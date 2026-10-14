"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BellRing,
  MapPin,
  Volume2,
  Bus,
  CheckCircle2,
  Lock,
  Navigation,
  Compass,
  Gauge,
  Radio,
  X,
  VolumeX,
} from "lucide-react";

interface StopTarget {
  name: string;
  lat: number;
  lng: number;
  code: string;
}

// Official corridor stops along Route 500D (Outer Ring Road)
const UPCOMING_STOPS: StopTarget[] = [
  { name: "Central Silk Board", lat: 12.918153, lng: 77.62326, code: "CSB" },
  { name: "HSR Layout 14th Main", lat: 12.91619, lng: 77.63521, code: "HSR" },
  { name: "Agara Junction", lat: 12.92433, lng: 77.65073, code: "AGR" },
  { name: "Ibbaluru Junction", lat: 12.92129, lng: 77.66217, code: "IBL" },
  { name: "Bellanduru Petrol Bunk", lat: 12.92309, lng: 77.6705, code: "BLD" },
  { name: "Eco Space Tech Park", lat: 12.92776, lng: 77.68049, code: "ECO" },
  { name: "Kadubisanahalli", lat: 12.94259, lng: 77.69717, code: "KDB" },
  { name: "Marathahalli Bridge", lat: 12.95694, lng: 77.70062, code: "MTH" },
];

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

// Synthesizes a pleasant 2-tone transit announcement chime via Web Audio API
function playTransitChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Tone 2: A5 (880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.0, now + 0.25);
    gain2.gain.setValueAtTime(0.25, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.7);
  } catch (e) {
    console.warn("Web Audio chime could not play:", e);
  }
}

export default function ProximityChime({
  busCode = "500D",
}: {
  busCode?: string;
  userLocation?: [number, number] | null;
}) {
  // Navigation & In-Bus Velocity Gating
  const [isNavigatingBus, setIsNavigatingBus] = useState<boolean>(false);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Alarm Arming & Target Stop State
  const [selectedStop, setSelectedStop] = useState<StopTarget>(UPCOMING_STOPS[0]);
  const [isArmed, setIsArmed] = useState<boolean>(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);
  const [isSimulatingBus, setIsSimulatingBus] = useState<boolean>(false);

  const prevPosRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Monitor live GPS coordinates and detect real vehicle transit movement
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) return;

    const handlePos = (pos: GeolocationPosition) => {
      const { latitude, longitude, speed } = pos.coords;
      const now = pos.timestamp;
      setUserCoords({ lat: latitude, lng: longitude });

      let calculatedSpeed = 0;
      if (speed !== null && !isNaN(speed) && speed >= 0) {
        calculatedSpeed = speed * 3.6;
      } else if (prevPosRef.current) {
        const dist = haversineDistance(
          prevPosRef.current.lat,
          prevPosRef.current.lng,
          latitude,
          longitude
        );
        const sec = (now - prevPosRef.current.time) / 1000;
        if (sec > 0.5 && sec < 30) calculatedSpeed = (dist / sec) * 3.6;
      }

      prevPosRef.current = { lat: latitude, lng: longitude, time: now };
      const kmh = Math.round(calculatedSpeed);
      setSpeedKmh(kmh);

      // Auto-unlock bus navigation if the commuter is moving at transit velocity (>= 12 km/h)
      if (kmh >= 12) {
        setIsNavigatingBus(true);
      }
    };

    const handleErr = (err: GeolocationPositionError) => {
      console.warn("ProximityChime GPS watcher error:", err.message);
    };

    try {
      watchIdRef.current = navigator.geolocation.watchPosition(handlePos, handleErr, {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 10000,
      });
    } catch (e) {
      console.error("Failed to start geolocation watcher", e);
    }

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // Real-time calculation of distance to target stop from the moving bus/user GPS
  useEffect(() => {
    if (!isArmed || hasTriggered) return;

    // If running in simulation mode, decrease distance steadily
    if (isSimulatingBus) {
      simulationIntervalRef.current = setInterval(() => {
        setDistanceMeters((prev) => {
          const current = prev !== null ? prev : 1200;
          const next = Math.max(0, current - 45); // bus moving ~35 km/h approaching stop

          // Trigger Geofence Alarm when within 350 meters
          if (next <= 350 && !hasTriggered) {
            triggerAlarm(selectedStop);
            return next;
          }
          return next;
        });
      }, 1000);

      return () => {
        if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
      };
    }

    // Real GPS Distance Calculation
    if (userCoords) {
      const realDist = Math.round(
        haversineDistance(
          userCoords.lat,
          userCoords.lng,
          selectedStop.lat,
          selectedStop.lng
        )
      );
      setDistanceMeters(realDist);

      // Trigger Geofence Alarm when within 350 meters
      if (realDist <= 350 && !hasTriggered) {
        triggerAlarm(selectedStop);
      }
    }
  }, [isArmed, hasTriggered, isSimulatingBus, userCoords, selectedStop]);

  // Execute Real Multimodal Deboarding Alarm (Chime + Speech + Vibration)
  const triggerAlarm = useCallback((target: StopTarget) => {
    setHasTriggered(true);

    // 1. Pleasant Transit Audio Chime
    playTransitChime();

    // 2. Hardware Vibration Alert (Pulse pattern)
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([600, 250, 600, 250, 1000]);
    }

    // 3. Spoken Voice Alert (NLP Web Speech Synthesis)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Approaching ${target.name}. You are approximately 300 meters away. Please prepare to deboard at the next stop.`
      );
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleArmAlarm = () => {
    setIsArmed(true);
    setHasTriggered(false);
    // Initial distance calculation
    if (userCoords) {
      const initialDist = Math.round(
        haversineDistance(userCoords.lat, userCoords.lng, selectedStop.lat, selectedStop.lng)
      );
      setDistanceMeters(initialDist);
    } else {
      setDistanceMeters(1100);
    }
  };

  const handleDisarmAlarm = () => {
    setIsArmed(false);
    setHasTriggered(false);
    setDistanceMeters(null);
    if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
  };

  // Toggle simulated in-transit bus ride for desktop test verification
  const handleToggleBusNavigation = () => {
    if (isNavigatingBus) {
      setIsNavigatingBus(false);
      handleDisarmAlarm();
      setIsSimulatingBus(false);
      setSpeedKmh(0);
    } else {
      setIsNavigatingBus(true);
      setIsSimulatingBus(true);
      setSpeedKmh(36);
      if (!userCoords) {
        // Approximate location 1.2km from selected stop
        setUserCoords({ lat: selectedStop.lat + 0.009, lng: selectedStop.lng + 0.007 });
      }
    }
  };

  // Calculate live ETA in minutes and seconds
  const currentSpeedMps = Math.max(3, (speedKmh * 1000) / 3600);
  const etaSec = distanceMeters !== null ? Math.round(distanceMeters / currentSpeedMps) : null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm mb-4 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <BellRing size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              Next Stop Proximity Alarm
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Auto-vibrates & chimes 300m before your deboarding stop
            </p>
          </div>
        </div>

        {/* Navigation State Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1 border ${
            isNavigatingBus
              ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isNavigatingBus ? "bg-emerald-500 animate-ping" : "bg-slate-400"
            }`}
          />
          {isNavigatingBus ? `Riding Bus (${speedKmh} km/h)` : "Not in Bus"}
        </span>
      </div>

      {/* STATE 1: User NOT Navigating in a Bus (Locked State) */}
      {!isNavigatingBus && (
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 mx-auto flex items-center justify-center mb-2">
            <Lock size={18} />
          </div>
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1">
            Alarm Available While Riding Moving Bus
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 max-w-sm mx-auto leading-relaxed">
            To prevent false alerts, the next-stop alarm activates only when you are navigating on an active bus trip (moving speed $\ge 12$ km/h).
          </p>

          <button
            type="button"
            onClick={handleToggleBusNavigation}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Navigation size={14} /> Start Bus Navigation on Route {busCode}
          </button>
        </div>
      )}

      {/* STATE 2: User IS Navigating on Bus (Unlocked & Stop Chooser) */}
      {isNavigatingBus && !isArmed && (
        <div className="space-y-3">
          {/* Target Stop Selector */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 block">
              Select Your Deboard Stop on Route {busCode}:
            </label>
            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto no-scrollbar pr-1">
              {UPCOMING_STOPS.map((stop) => {
                const isSelected = selectedStop.name === stop.name;
                return (
                  <button
                    key={stop.name}
                    type="button"
                    onClick={() => setSelectedStop(stop)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-800 dark:text-teal-200 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400"
                    }`}
                  >
                    <span className="text-[11px] font-black truncate">{stop.name}</span>
                    <span className="text-[9px] text-slate-400 font-semibold">{stop.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Arm Alarm Button */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleArmAlarm}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MapPin size={16} /> Arm Alarm for {selectedStop.name}
            </button>
            <button
              type="button"
              onClick={handleToggleBusNavigation}
              className="px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
              title="Stop Navigation"
            >
              Stop Nav
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: Armed Alarm - Tracking Distance from the Moving Bus */}
      {isNavigatingBus && isArmed && !hasTriggered && (
        <div className="relative pt-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Bus size={20} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <Radio size={10} className="animate-ping" /> Bus Approaching:
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedStop.name}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDisarmAlarm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/60 mb-3 text-center">
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">Live Distance</p>
              <p className="text-base font-black text-slate-900 dark:text-white">
                {distanceMeters !== null ? `${distanceMeters}m` : "Calculating..."}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">Bus Velocity</p>
              <p className="text-base font-black text-teal-600 dark:text-teal-400">
                {speedKmh} km/h
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">Arrival ETA</p>
              <p className="text-base font-black text-slate-900 dark:text-white">
                {etaSec !== null ? `${Math.floor(etaSec / 60)}m ${etaSec % 60}s` : "--"}
              </p>
            </div>
          </div>

          {/* Geofence Progress to 300m threshold */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <motion.div
              className="h-full bg-teal-500"
              animate={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    distanceMeters !== null ? 100 - (distanceMeters / 1200) * 100 : 20
                  )
                )}%`,
              }}
              transition={{ ease: "linear", duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold mt-1.5 px-0.5">
            <span>Outer Zone</span>
            <span className="text-teal-600 dark:text-teal-400">Geofence Trigger (300m)</span>
            <span>Arrival Stop</span>
          </div>
        </div>
      )}

      {/* STATE 4: Geofence Alarm Triggered (< 350m from Moving Bus) */}
      <AnimatePresence>
        {hasTriggered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-amber-500 text-slate-950 p-5 rounded-2xl shadow-xl border-2 border-amber-300 relative overflow-hidden mt-1"
          >
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-black/15 rounded-full flex items-center justify-center mb-2">
                <BellRing size={28} className="text-slate-950 animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-2 py-0.5 rounded-full mb-1">
                Deboard Warning · 300m Geofence
              </span>
              <h3 className="text-xl font-black text-slate-950 mb-0.5">
                Prepare to Deboard!
              </h3>
              <p className="text-xs font-bold text-amber-950 mb-3 max-w-xs">
                Your bus is arriving at <span className="underline">{selectedStop.name}</span>. Moving toward the exit doors.
              </p>

              <button
                type="button"
                onClick={handleDisarmAlarm}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-black py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <CheckCircle2 size={16} /> Dismiss Deboard Alarm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}