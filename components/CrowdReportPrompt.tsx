"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Compass,
  X,
  CheckCircle2,
  Medal,
  Activity,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export type CrowdLevel = "Low" | "Moderate" | "High";

interface CrowdReportPromptProps {
  busId?: string;
  availableBuses?: string[];
  onReportSubmitted?: (crowdLevel: CrowdLevel, busId: string) => void;
  // Allows manual simulation in development/testing environments
  enableSimulation?: boolean;
}

// Calculate distance between two lat/lng coordinates in meters (Haversine Formula)
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
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

export default function CrowdReportPrompt({
  busId = "500D",
  availableBuses = ["500D", "335E", "250"],
  onReportSubmitted,
  enableSimulation = true,
}: CrowdReportPromptProps) {
  const [selectedBus, setSelectedBus] = useState<string>(busId);
  const [isMoving, setIsMoving] = useState(false);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hasReported, setHasReported] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastReportedLevel, setLastReportedLevel] = useState<CrowdLevel | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Position history for calculating speed when device does not supply coords.speed
  const prevPositionRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep selectedBus synced if prop changes
  useEffect(() => {
    if (busId) setSelectedBus(busId);
  }, [busId]);

  // Monitor Geolocation and Speed
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }

    const handlePosition = (position: GeolocationPosition) => {
      const { latitude, longitude, speed } = position.coords;
      const currentTime = position.timestamp;
      setUserCoords({ lat: latitude, lng: longitude });

      let calculatedSpeedKmh = 0;

      // Check native GPS speed (in m/s)
      if (speed !== null && !isNaN(speed) && speed > 0) {
        calculatedSpeedKmh = speed * 3.6; // convert m/s to km/h
      } else if (prevPositionRef.current) {
        // Fallback: Calculate speed from distance / time
        const distMeters = calculateDistanceMeters(
          prevPositionRef.current.lat,
          prevPositionRef.current.lng,
          latitude,
          longitude
        );
        const timeDiffSec = (currentTime - prevPositionRef.current.time) / 1000;

        if (timeDiffSec > 1 && timeDiffSec < 30) {
          const speedMps = distMeters / timeDiffSec;
          calculatedSpeedKmh = speedMps * 3.6;
        }
      }

      prevPositionRef.current = {
        lat: latitude,
        lng: longitude,
        time: currentTime,
      };

      setSpeedKmh(Math.round(calculatedSpeedKmh));

      // Transit movement threshold: Speed > 6 km/h (indicates vehicle motion rather than stationary)
      const moving = calculatedSpeedKmh > 6;
      setIsMoving(moving);
    };

    const handleError = (error: GeolocationPositionError) => {
      console.warn("Geolocation tracking warning:", error.message);
      // Don't completely block UI; user can still simulate or recover
      if (error.code === error.PERMISSION_DENIED) {
        setGeoError("Location permission denied. Enable GPS for auto-detection.");
      }
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePosition,
        handleError,
        {
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 10000,
        }
      );
    } catch (e) {
      console.error("Failed to start geolocation watcher", e);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
      }
    };
  }, []);

  // 1-Tap Submission Handler
  const handleReportCrowd = useCallback(
    async (level: CrowdLevel) => {
      if (submitting) return;
      setSubmitting(true);
      setLastReportedLevel(level);

      try {
        const payload = {
          busId: selectedBus,
          crowdLevel: level,
          latitude: userCoords?.lat,
          longitude: userCoords?.lng,
          speed: speedKmh || (isMoving ? 28 : undefined),
        };

        const res = await fetch("/api/crowd", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setHasReported(true);
          if (onReportSubmitted) {
            onReportSubmitted(level, selectedBus);
          }

          // Auto-dismiss after 3.5 seconds and enter a 5-minute cooldown
          cooldownTimerRef.current = setTimeout(() => {
            setIsDismissed(true);
            // Reset after 5-minute cooldown for next stop/trip
            setTimeout(() => {
              setIsDismissed(false);
              setHasReported(false);
            }, 5 * 60 * 1000);
          }, 3500);
        } else {
          const data = await res.json();
          alert(`Report error: ${data.error || "Failed to submit"}`);
        }
      } catch (err) {
        console.error("Crowd reporting submission error:", err);
      } finally {
        setSubmitting(false);
      }
    },
    [selectedBus, userCoords, speedKmh, isMoving, onReportSubmitted, submitting]
  );

  // Manual simulation toggle for testing/desktop environments
  const handleToggleSimulation = () => {
    if (isMoving) {
      setIsMoving(false);
      setSpeedKmh(0);
    } else {
      setIsMoving(true);
      setSpeedKmh(32);
      setIsDismissed(false);
      setHasReported(false);
      if (!userCoords) {
        setUserCoords({ lat: 12.9716, lng: 77.6412 });
      }
    }
  };

  // If user dismissed or not moving and not simulated, don't show prompt
  const showPrompt = isMoving && !isDismissed;

  return (
    <div className="relative">
      {/* Simulation / Diagnostic Trigger Pill (Useful for desktop testing) */}
      {enableSimulation && (
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={handleToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
              isMoving
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700/50 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
            }`}
            title="Click to simulate in-transit movement for testing"
          >
            <Activity size={12} className={isMoving ? "animate-spin" : ""} />
            <span>
              {isMoving ? `Simulating Movement (${speedKmh} km/h)` : "Test Movement Prompt"}
            </span>
          </button>
        </div>
      )}

      {/* 1-Tap Floating Bottom Sheet Prompt */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-[420px] z-50 pointer-events-auto"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl p-5 shadow-[0_15px_50px_rgba(0,0,0,0.25)] border border-slate-200 dark:border-slate-800 overflow-hidden relative">
              {/* Background ambient glow */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {!hasReported ? (
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800/40">
                        <Compass size={18} className="animate-spin text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Motion Detected · {speedKmh > 0 ? `${speedKmh} km/h` : "In Transit"}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                          Are you riding Bus {selectedBus}?
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsDismissed(true)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full transition-colors cursor-pointer"
                      aria-label="Dismiss prompt"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Route selector chips if user is on an alternative corridor */}
                  {availableBuses.length > 1 && (
                    <div className="flex items-center gap-1.5 mb-3 overflow-x-auto no-scrollbar py-0.5">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                        Bus:
                      </span>
                      {availableBuses.map((id) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSelectedBus(id)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all cursor-pointer ${
                            selectedBus === id
                              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                          }`}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                    Help fellow commuters! 1-tap crowd density update:
                  </p>

                  {/* 1-Tap Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Low Crowd */}
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleReportCrowd("Low")}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 transition-all hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer group disabled:opacity-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1.5 group-hover:rotate-6 transition-transform shadow-md shadow-emerald-500/30">
                        <Users size={16} />
                      </div>
                      <span className="text-xs font-black">Low</span>
                      <span className="text-[9px] font-semibold text-emerald-600/80 dark:text-emerald-400/80">
                        Seats Free
                      </span>
                    </button>

                    {/* Moderate Crowd */}
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleReportCrowd("Moderate")}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 transition-all hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer group disabled:opacity-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center mb-1.5 group-hover:rotate-6 transition-transform shadow-md shadow-amber-500/30">
                        <Users size={16} />
                      </div>
                      <span className="text-xs font-black">Moderate</span>
                      <span className="text-[9px] font-semibold text-amber-600/80 dark:text-amber-400/80">
                        Standing Room
                      </span>
                    </button>

                    {/* High Crowd */}
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleReportCrowd("High")}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 transition-all hover:scale-[1.02] active:scale-95 shadow-sm cursor-pointer group disabled:opacity-50"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center mb-1.5 group-hover:rotate-6 transition-transform shadow-md shadow-rose-500/30">
                        <Users size={16} />
                      </div>
                      <span className="text-xs font-black">High</span>
                      <span className="text-[9px] font-semibold text-rose-600/80 dark:text-rose-400/80">
                        Crush Load
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles size={11} className="text-amber-500" /> +25 Karma Points per report
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Geo-Validated GPS
                    </span>
                  </div>
                </div>
              ) : (
                /* Post-Submission Karma Reward Screen */
                <div className="flex flex-col items-center text-center py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mb-2 shadow-inner border border-emerald-300 dark:border-emerald-700">
                    <Medal size={28} className="text-emerald-500 animate-bounce" />
                  </div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white">
                    +25 Karma Points Earned!
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                    Reported <span className="font-bold text-emerald-600 dark:text-emerald-400">{lastReportedLevel}</span> crowd on Route {selectedBus}. The live Leaflet map is now updated!
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" /> Geo-validated
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsDismissed(true)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline ml-2"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Geolocation Notice (if permission denied) */}
      {geoError && (
        <div className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/40 flex items-center gap-1.5 mt-2">
          <AlertCircle size={12} className="shrink-0" />
          <span>{geoError}</span>
        </div>
      )}
    </div>
  );
}
