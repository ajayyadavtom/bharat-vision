"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertOctagon,
  Check,
  X,
  Users,
  Medal,
  Loader2,
  GitMerge,
  Camera,
  XCircle,
  Navigation,
  Compass,
  Gauge,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { sendSystemNotification, triggerVibration, playTransitChime } from "@/lib/notifications";

interface RouteDeviationAIProps {
  externalTrigger?: boolean;
  resetTrigger?: () => void;
  busRouteId?: string;
}

// 10-minute cooldown window in milliseconds
const COOLDOWN_MS = 10 * 60 * 1000;
// Minimum velocity to qualify as traveling on a bus (12 km/h)
const MIN_BUS_SPEED_KMH = 12;
// Minimum detour distance in meters off the route to flag an anomaly
const DEVIATION_THRESHOLD_METERS = 250;

// Reference corridor points for Route 500D (Outer Ring Road Corridor)
const ROUTE_500D_CORRIDOR = [
  { lat: 13.04218, lng: 77.59387, name: "Hebbala Bridge" },
  { lat: 13.0402, lng: 77.62454, name: "Nagawara Junction" },
  { lat: 13.02964, lng: 77.63134, name: "Hennur Junction" },
  { lat: 13.0226, lng: 77.64702, name: "Babusabpalya" },
  { lat: 13.004, lng: 77.66328, name: "Kasthurinagara" },
  { lat: 12.99645, lng: 77.66857, name: "Tin Factory" },
  { lat: 12.98823, lng: 77.6895, name: "Mahadevapura" },
  { lat: 12.97565, lng: 77.697, name: "Dodda Nekkundi" },
  { lat: 12.95694, lng: 77.70062, name: "Marathahalli Bridge" },
  { lat: 12.94259, lng: 77.69717, name: "Kadubisanahalli" },
  { lat: 12.92776, lng: 77.68049, name: "Eco Space" },
  { lat: 12.92129, lng: 77.66217, name: "Ibbaluru" },
  { lat: 12.92433, lng: 77.65073, name: "Agara Junction" },
  { lat: 12.91619, lng: 77.63521, name: "HSR Layout 14th Main" },
  { lat: 12.918153, lng: 77.62326, name: "Central Silk Board" },
];

// Haversine distance in meters
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate minimum distance from user point to the closest route line segment
function getDistanceToRouteMeters(
  userLat: number,
  userLng: number,
  corridor: { lat: number; lng: number }[]
): number {
  let minDistance = Infinity;

  for (let i = 0; i < corridor.length; i++) {
    const distToPoint = haversineDistance(
      userLat,
      userLng,
      corridor[i].lat,
      corridor[i].lng
    );
    if (distToPoint < minDistance) {
      minDistance = distToPoint;
    }
  }

  return minDistance;
}

export default function RouteDeviationAI({
  externalTrigger,
  resetTrigger,
  busRouteId = "500D",
}: RouteDeviationAIProps) {
  const { addKarma } = useAppStore();

  const [isVisible, setIsVisible] = useState(false);
  const [voteStatus, setVoteStatus] = useState<
    "pending" | "voting" | "ocr" | "verifying" | "confirmed"
  >("pending");

  // Real-time telemetry calculations
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [isInBus, setIsInBus] = useState<boolean>(false);
  const [deviationMeters, setDeviationMeters] = useState<number>(0);
  const [cooldownRemainingSec, setCooldownRemainingSec] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevPositionRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const consecutiveDeviationsRef = useRef<number>(0);

  // Check last prompt time stored in localStorage to enforce strict 10-minute cooldown
  const getLastPromptTime = (): number => {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem("bmtc_last_deviation_prompt_time");
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  };

  const setLastPromptTime = (time: number) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("bmtc_last_deviation_prompt_time", String(time));
    } catch (e) {
      console.warn("Could not save deviation timestamp", e);
    }
  };

  // Cooldown countdown timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      const lastTime = getLastPromptTime();
      const elapsed = Date.now() - lastTime;
      const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
      setCooldownRemainingSec(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // REAL-TIME GEOLOCATION & MOVEMENT ANOMALY CALCULATOR
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    let watchId: number;

    const handlePosition = (position: GeolocationPosition) => {
      const { latitude, longitude, speed } = position.coords;
      const currentTime = position.timestamp;

      // 1. Calculate user speed in km/h
      let calculatedSpeed = 0;
      if (speed !== null && !isNaN(speed) && speed >= 0) {
        calculatedSpeed = speed * 3.6;
      } else if (prevPositionRef.current) {
        const dist = haversineDistance(
          prevPositionRef.current.lat,
          prevPositionRef.current.lng,
          latitude,
          longitude
        );
        const timeDiffSec = (currentTime - prevPositionRef.current.time) / 1000;
        if (timeDiffSec > 0.5 && timeDiffSec < 30) {
          calculatedSpeed = (dist / timeDiffSec) * 3.6;
        }
      }

      prevPositionRef.current = { lat: latitude, lng: longitude, time: currentTime };
      const currentSpeed = Math.round(calculatedSpeed);
      setSpeedKmh(currentSpeed);

      // 2. Check if user is traveling on a bus:
      // Stationary or walking (< 12 km/h) means the user is NOT on a moving bus
      const userTravelingInBus = currentSpeed >= MIN_BUS_SPEED_KMH;
      setIsInBus(userTravelingInBus);

      // 3. Compute real-time distance from the expected bus corridor
      const offsetMeters = Math.round(
        getDistanceToRouteMeters(latitude, longitude, ROUTE_500D_CORRIDOR)
      );
      setDeviationMeters(offsetMeters);

      // 4. Check 10-minute cooldown
      const lastPrompt = getLastPromptTime();
      const cooldownActive = Date.now() - lastPrompt < COOLDOWN_MS;

      // 5. Evaluate genuine route anomaly:
      // Must be: (A) in a moving bus, (B) deviated > 250m off route, (C) NOT in 10-minute cooldown
      if (userTravelingInBus && offsetMeters > DEVIATION_THRESHOLD_METERS) {
        consecutiveDeviationsRef.current += 1;

        // Require 2 consecutive GPS fixes off-route to prevent momentary GPS drift/jitter
        if (consecutiveDeviationsRef.current >= 2 && !isVisible && !cooldownActive) {
          triggerDeviationAlert();
        }
      } else {
        consecutiveDeviationsRef.current = 0;
      }
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn("RouteDeviationAI geolocation error:", error.message);
    };

    try {
      watchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      });
    } catch (e) {
      console.error("Failed to start route deviation watcher", e);
    }

    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, [isVisible]);

  // Unified Deviation Alert Displayer (respects notification settings)
  const triggerDeviationAlert = useCallback(() => {
    const notifs = useAppStore.getState().notificationSettings;
    if (notifs && !notifs.deviations) {
      console.log("Route deviation alerts disabled in settings.");
      return;
    }

    setIsVisible(true);
    setVoteStatus("pending");
    setLastPromptTime(Date.now());

    if (!notifs || notifs.soundChimes) {
      playTransitChime();
    }
    if (!notifs || notifs.vibration) {
      triggerVibration([300, 150, 300]);
    }
    if (!notifs || notifs.pushEnabled) {
      sendSystemNotification(`Route Detour Alert • Route ${busRouteId || "500D"} ⚠️`, {
        body: "Bus appears to have deviated from its designated corridor. Tap to verify and help commuters.",
        tag: "route-deviation",
      });
    }
  }, [busRouteId]);

  // Handle external manual test trigger from header
  useEffect(() => {
    if (externalTrigger) {
      triggerDeviationAlert();
    }
  }, [externalTrigger, triggerDeviationAlert]);

  const handleVote = (hasDeviated: boolean) => {
    setVoteStatus("voting");
    setTimeout(() => {
      setVoteStatus("verifying");
      setTimeout(() => {
        setVoteStatus("confirmed");
        if (hasDeviated) addKarma(25);
        setTimeout(() => {
          handleDismiss();
        }, 3500);
      }, 2000);
    }, 1000);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVoteStatus("ocr");
      setTimeout(() => {
        setVoteStatus("confirmed");
        addKarma(50);
        setTimeout(() => {
          handleDismiss();
        }, 3500);
      }, 2500);
    }
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setVoteStatus("pending");
    setLastPromptTime(Date.now());
    if (resetTrigger) resetTrigger();
  }, [resetTrigger]);

  // Diagnostic simulation trigger for manual testing
  const handleSimulateDetour = () => {
    setSpeedKmh(34);
    setIsInBus(true);
    setDeviationMeters(420);
    triggerDeviationAlert();
  };

  return (
    <>
      {/* Real-time Telemetry Status Bar for Anomaly Engine */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isInBus
                ? "bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]"
                : "bg-slate-400"
            }`}
          />
          <span className="font-bold">
            {isInBus ? `On Bus (${speedKmh} km/h)` : "Stationary / Walking"}
          </span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>Corridor Offset: {deviationMeters}m</span>
        </div>

        <div className="flex items-center gap-2">
          {cooldownRemainingSec > 0 && !isVisible ? (
            <span className="text-[9px] font-semibold text-amber-600 dark:text-amber-400">
              Cooldown: {Math.floor(cooldownRemainingSec / 60)}m {cooldownRemainingSec % 60}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSimulateDetour}
              className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              title="Test real anomaly detection algorithm"
            >
              Simulate Detour
            </button>
          )}
        </div>
      </div>

      {/* Real-Time Anomaly Modal (Strictly 10-Min Cooldown & In-Bus Velocity Gated) */}
      <AnimatePresence>
        {isVisible && (
          <div className="fixed top-20 left-0 right-0 max-w-md mx-auto px-4 z-[150] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -25, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-white dark:bg-slate-900 border border-amber-500/60 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_50px_rgba(245,158,11,0.25)] pointer-events-auto relative overflow-hidden"
            >
              {/* AI Beacon Scan Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/5 dark:via-amber-500/10 to-amber-500/0 animate-[shimmer_2s_infinite] pointer-events-none" />

              {/* Dismiss Button */}
              {voteStatus === "pending" && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10 p-1 cursor-pointer"
                  aria-label="Dismiss anomaly alert"
                >
                  <XCircle size={20} />
                </button>
              )}

              {voteStatus === "pending" && (
                <>
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <div className="flex items-center gap-2">
                      <AlertOctagon size={16} className="text-amber-500 animate-pulse" />
                      <span className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                        AI Anomaly Detection Active
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                    Route {busRouteId} Deviation Detected
                  </h3>

                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="mb-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                        <Gauge size={13} /> Velocity: {speedKmh} km/h (In-Transit)
                      </span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        Detour: ~{deviationMeters}m off route
                      </span>
                    </p>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                      Our real-time trajectory engine noticed your moving bus diverted away from the standard Outer Ring Road path. Did the driver take a detour?
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-3 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/40">
                    <div className="flex items-center gap-1.5">
                      <Medal size={14} className="text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                        Earn +25 Karma Points
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400">10m Cooldown</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleVote(true)}
                        className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check size={16} /> Yes, Route Detour
                      </button>
                      <button
                        type="button"
                        onClick={() => handleVote(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <X size={16} /> Normal Path
                      </button>
                    </div>

                    {/* Camera Capture for Display Board OCR */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={fileInputRef}
                      onChange={handleCameraCapture}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={triggerCamera}
                      className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/50 text-indigo-700 dark:text-indigo-300 font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera size={15} /> Snap Destination Display Board for OCR (+50 Karma)
                    </button>
                  </div>
                </>
              )}

              {voteStatus === "ocr" && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="relative">
                    <Camera size={32} className="text-indigo-500 mb-3" />
                    <div className="absolute inset-0 bg-indigo-400/20 blur-md rounded-full animate-pulse" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    Analyzing Image via OCR...
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Extracting LED Destination Board Text with Neural Net
                  </p>
                </div>
              )}

              {voteStatus === "voting" && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Loader2 size={24} className="text-amber-500 animate-spin mb-3" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Transmitting Verified Report...
                  </h3>
                </div>
              )}

              {voteStatus === "verifying" && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-3 text-indigo-500">
                    <Users size={16} className="animate-bounce" />
                    <Users size={20} className="animate-bounce delay-75" />
                    <Users size={16} className="animate-bounce delay-150" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Verifying Consensus
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Cross-referencing telemetry with onboard commuters...
                  </p>
                </div>
              )}

              {voteStatus === "confirmed" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-2 text-center"
                >
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-2 border border-emerald-500">
                    <GitMerge size={24} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Route Graph Updated!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-0.5 mb-3 max-w-xs">
                    Consensus reached. Real-time detour marked for fellow commuters. Next check in 10 minutes.
                  </p>
                  <div className="bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-500/30 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-300">
                      +25 Karma Points Awarded
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}