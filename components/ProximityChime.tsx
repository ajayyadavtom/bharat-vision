"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
  Search,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
} from "lucide-react";
import {
  StopTarget,
  getCuratedStopsForBus,
  CURATED_CORRIDOR_STOPS,
} from "@/data/curatedCorridorStops";

// Default fallback corridor if offline & no route matched
const DEFAULT_FALLBACK_STOPS: StopTarget[] = [
  { name: "Central Silk Board", lat: 12.918153, lng: 77.62326, code: "CSB", seq: 1 },
  { name: "HSR Layout 14th Main", lat: 12.91619, lng: 77.63521, code: "HSR", seq: 2 },
  { name: "Agara Junction", lat: 12.92433, lng: 77.65073, code: "AGR", seq: 3 },
  { name: "Ibbaluru Junction", lat: 12.92129, lng: 77.66217, code: "IBL", seq: 4 },
  { name: "Bellanduru Petrol Bunk", lat: 12.92309, lng: 77.6705, code: "BLD", seq: 5 },
  { name: "Eco Space Tech Park", lat: 12.92776, lng: 77.68049, code: "ECO", seq: 6 },
  { name: "Kadubisanahalli", lat: 12.94259, lng: 77.69717, code: "KDB", seq: 7 },
  { name: "Marathahalli Bridge", lat: 12.95694, lng: 77.70062, code: "MTH", seq: 8 },
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
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);

    // Tone 2: A5 (880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.0, now + 0.28);
    gain2.gain.setValueAtTime(0.3, now + 0.28);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.28);
    osc2.stop(now + 0.8);
  } catch (e) {
    console.warn("Web Audio chime could not play:", e);
  }
}

export interface RawRouteStop {
  name: string;
  lat: number;
  lon?: number;
  lng?: number;
  code?: string;
  seq?: number;
}

interface ProximityChimeProps {
  busCode?: string;
  userLocation?: [number, number] | null;
  routeStops?: RawRouteStop[];
  routeName?: string;
}

export default function ProximityChime({
  busCode = "500D",
  userLocation = null,
  routeStops,
  routeName,
}: ProximityChimeProps) {
  // Navigation & In-Bus Velocity Gating
  const [isNavigatingBus, setIsNavigatingBus] = useState<boolean>(false);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(
    userLocation ? { lat: userLocation[0], lng: userLocation[1] } : null
  );

  // Dynamic Route Stops
  const [activeStops, setActiveStops] = useState<StopTarget[]>(() => {
    const curated = getCuratedStopsForBus(busCode);
    return curated && curated.length > 0 ? curated : DEFAULT_FALLBACK_STOPS;
  });

  // Alarm Arming & Target Stop State
  const [selectedStop, setSelectedStop] = useState<StopTarget>(() => {
    const list = getCuratedStopsForBus(busCode) || DEFAULT_FALLBACK_STOPS;
    return list[list.length - 1] || list[0];
  });
  const [isArmed, setIsArmed] = useState<boolean>(false);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);
  const [isSimulatingBus, setIsSimulatingBus] = useState<boolean>(false);

  // Dynamic Route Notification Banner
  const [routeChangeAlert, setRouteChangeAlert] = useState<{
    busCode: string;
    stopsCount: number;
    wasReset: boolean;
  } | null>(null);

  // Stop Search & Filter
  const [stopFilter, setStopFilter] = useState<string>("");

  const prevBusCodeRef = useRef<string>(busCode);
  const prevPosRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync userLocation prop
  useEffect(() => {
    if (userLocation && !userCoords) {
      setUserCoords({ lat: userLocation[0], lng: userLocation[1] });
    }
  }, [userLocation, userCoords]);

  // Normalize incoming routeStops prop or fetch/fallback dynamically
  const resolveStops = useCallback(
    async (code: string, incomingStops?: RawRouteStop[]): Promise<StopTarget[]> => {
      // 1. If explicit stops are passed via prop
      if (incomingStops && incomingStops.length > 0) {
        return incomingStops.map((s, idx) => ({
          name: s.name,
          lat: s.lat,
          lng: s.lng ?? s.lon ?? 12.9716,
          code: s.code || s.name.slice(0, 3).toUpperCase(),
          seq: s.seq ?? idx + 1,
        }));
      }

      // 2. Check Curated Corridors dictionary
      const curated = getCuratedStopsForBus(code);
      if (curated && curated.length > 0) {
        return curated;
      }

      // 3. Attempt dynamic API fetch for any of the 7,475 BMTC routes
      try {
        const clean = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
        const res = await fetch(`/api/bmtc?bus=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.found && data.route?.stops && data.route.stops.length > 0) {
            return data.route.stops.map((s: any, idx: number) => ({
              name: s.name,
              lat: s.lat,
              lng: s.lng ?? s.lon ?? 12.9716,
              code: s.name.slice(0, 3).toUpperCase(),
              seq: idx + 1,
            }));
          }
        }
      } catch (e) {
        console.warn("Could not fetch stops for route in ProximityChime:", e);
      }

      // 4. Default Fallback Corridor
      return DEFAULT_FALLBACK_STOPS;
    },
    []
  );

  // DYNAMIC NOTIFICATION & ROUTE CHANGE HANDLER
  // Automatically responds when user picks another bus or route
  useEffect(() => {
    let isSubscribed = true;

    async function handleRouteChange() {
      const stops = await resolveStops(busCode, routeStops);
      if (!isSubscribed) return;

      setActiveStops(stops);

      const hasRouteChanged = prevBusCodeRef.current !== busCode;
      prevBusCodeRef.current = busCode;

      if (hasRouteChanged) {
        const wasArmedBefore = isArmed;

        // Disarm if armed on an old route to avoid misfiring on wrong checkpoints
        if (wasArmedBefore) {
          setIsArmed(false);
          setHasTriggered(false);
          setDistanceMeters(null);
          if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current);
        }

        // Auto-select the final destination stop or nearest stop on new route
        const defaultTarget = stops[stops.length - 1] || stops[0];
        setSelectedStop(defaultTarget);
        setStopFilter("");

        // Show prominent Route Change Notification
        setRouteChangeAlert({
          busCode,
          stopsCount: stops.length,
          wasReset: wasArmedBefore,
        });

        if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
        alertTimerRef.current = setTimeout(() => {
          setRouteChangeAlert(null);
        }, 7000);
      } else {
        // If routeStops just finished loading for the same route and selectedStop isn't in it
        setSelectedStop((prev) => {
          const match = stops.find((s) => s.name === prev.name);
          return match || stops[stops.length - 1] || stops[0];
        });
      }
    }

    handleRouteChange();

    return () => {
      isSubscribed = false;
    };
  }, [busCode, routeStops, resolveStops, isArmed]);

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
      console.warn("ProximityChime GPS watcher warning:", err.message);
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

  // Execute Real Multimodal Deboarding Alarm (Chime + Speech + Vibration)
  const triggerAlarm = useCallback((target: StopTarget) => {
    setHasTriggered(true);

    // 1. Pleasant Transit Audio Chime
    playTransitChime();

    // 2. Hardware Vibration Alert (Pulse pattern)
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate([600, 250, 600, 250, 1000]);
      } catch (e) {
        console.warn("Vibration not allowed:", e);
      }
    }

    // 3. Spoken Voice Alert (NLP Web Speech Synthesis)
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel(); // clear queue
        const utterance = new SpeechSynthesisUtterance(
          `Approaching ${target.name}. You are approximately 300 meters away. Please prepare to deboard at the next stop.`
        );
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error:", e);
      }
    }
  }, []);

  // Real-time calculation of distance to target stop from the moving bus/user GPS
  useEffect(() => {
    if (!isArmed || hasTriggered) return;

    // Simulation Mode: steadily approaches target
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
  }, [isArmed, hasTriggered, isSimulatingBus, userCoords, selectedStop, triggerAlarm]);

  const handleArmAlarm = () => {
    setIsArmed(true);
    setHasTriggered(false);
    setIsNavigatingBus(true);

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
    if (isNavigatingBus && isSimulatingBus) {
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

  // Filtered stops for search
  const filteredStops = useMemo(() => {
    const q = stopFilter.toLowerCase().trim();
    if (!q) return activeStops;
    return activeStops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.seq !== undefined && s.seq.toString() === q)
    );
  }, [activeStops, stopFilter]);

  // Calculate live ETA in minutes and seconds
  const currentSpeedMps = Math.max(3, (speedKmh * 1000) / 3600);
  const etaSec = distanceMeters !== null ? Math.round(distanceMeters / currentSpeedMps) : null;

  // Selected stop distance from user
  const selectedStopDist = useMemo(() => {
    if (!userCoords) return null;
    return Math.round(
      haversineDistance(userCoords.lat, userCoords.lng, selectedStop.lat, selectedStop.lng)
    );
  }, [userCoords, selectedStop]);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm mb-4 relative overflow-hidden transition-all">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
            <BellRing size={16} />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Next Stop Proximity Alarm
              </h3>
              <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800/60">
                Route {busCode}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Auto-vibrates & chimes 300m before your deboarding stop
            </p>
          </div>
        </div>

        {/* Navigation State Badge */}
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight flex items-center gap-1 border shrink-0 ${
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
          {isNavigatingBus ? `Riding Bus (${speedKmh} km/h)` : "Stationary"}
        </span>
      </div>

      {/* DYNAMIC ROUTE CHANGE NOTIFICATION (Automatically alerts when bus/route changes) */}
      <AnimatePresence>
        {routeChangeAlert && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className={`mb-3 p-3 rounded-2xl border text-xs flex items-start justify-between gap-2 shadow-sm ${
              routeChangeAlert.wasReset
                ? "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200"
                : "bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800/60 text-teal-900 dark:text-teal-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap size={15} className="shrink-0 text-teal-600 dark:text-teal-400" />
              <div>
                <p className="font-extrabold text-[11px] leading-snug">
                  Route Switched to <span className="underline font-black">{routeChangeAlert.busCode}</span>
                </p>
                <p className="text-[10px] opacity-85 mt-0.5">
                  {routeChangeAlert.wasReset
                    ? "Previous alarm disarmed. All " + routeChangeAlert.stopsCount + " stops loaded — choose your new deboard stop below."
                    : `${routeChangeAlert.stopsCount} official stops loaded along this corridor. Pick any stop to arm your 300m alarm.`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRouteChangeAlert(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT: ARMED TRACKING vs. STOP CHOOSER */}
      {isArmed && !hasTriggered ? (
        /* STATE 3: Armed Alarm - Tracking Distance from the Moving Bus */
        <div className="relative pt-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/30">
                <Bus size={20} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <Radio size={10} className="animate-ping" /> Bus Approaching Deboard Stop:
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  {selectedStop.name}
                  {selectedStop.seq && (
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-bold">
                      Stop #{selectedStop.seq}
                    </span>
                  )}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDisarmAlarm}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer transition-colors"
            >
              Cancel Alarm
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
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
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
            <span>En Route (1.2 km)</span>
            <span className="text-teal-600 dark:text-teal-400 font-extrabold flex items-center gap-0.5">
              <Zap size={9} /> 300m Alarm Trigger Zone
            </span>
            <span>Deboard Exit</span>
          </div>

          {/* Change Deboard Stop Quick Action */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-[10px] text-slate-500">Need a different stop on Route {busCode}?</span>
            <button
              type="button"
              onClick={handleDisarmAlarm}
              className="text-teal-600 dark:text-teal-400 font-bold hover:underline cursor-pointer text-[11px]"
            >
              Change Deboard Stop
            </button>
          </div>
        </div>
      ) : (
        /* STOP CHOOSER: Displays all stops for chosen route with search filter & arming */
        <div className="space-y-3">
          {/* Search Filter for Route Stops */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={stopFilter}
                onChange={(e) => setStopFilter(e.target.value)}
                placeholder={`Search ${activeStops.length} stops on Route ${busCode}...`}
                className="bg-transparent text-xs text-slate-900 dark:text-white outline-none w-full font-medium placeholder-slate-400"
              />
              {stopFilter && (
                <button
                  type="button"
                  onClick={() => setStopFilter("")}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>
            <div className="flex justify-between items-center mt-1 px-1 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              <span>
                {filteredStops.length} of {activeStops.length} Stops Available
              </span>
              <span>Tap stop to set alarm</span>
            </div>
          </div>

          {/* Stops List (All Stops where commuter can choose to deboard) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1 border-y border-slate-100 dark:border-slate-800 py-1.5">
            {filteredStops.map((stop, idx) => {
              const isSelected = selectedStop.name === stop.name;
              const isStart = stop.seq === 1 || idx === 0;
              const isEnd = stop.seq === activeStops.length || idx === activeStops.length - 1;

              // Compute distance to stop if user GPS is available
              const distToStop = userCoords
                ? Math.round(haversineDistance(userCoords.lat, userCoords.lng, stop.lat, stop.lng))
                : null;

              return (
                <button
                  key={`${stop.name}-${stop.seq ?? idx}`}
                  type="button"
                  onClick={() => setSelectedStop(stop)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? "bg-teal-50 dark:bg-teal-950/70 border-teal-500 text-teal-900 dark:text-teal-100 shadow-xs ring-1 ring-teal-500/30"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-teal-400"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isSelected
                          ? "bg-teal-600 text-white"
                          : isStart
                          ? "bg-emerald-500 text-white"
                          : isEnd
                          ? "bg-rose-500 text-white"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {stop.seq ?? idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black truncate leading-tight">{stop.name}</p>
                      <p className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                        {isStart ? "Origin" : isEnd ? "Terminal" : "Intermediate"}
                        {distToStop !== null && (
                          <span>
                            • {distToStop >= 1000 ? `${(distToStop / 1000).toFixed(1)} km` : `${distToStop}m`}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="shrink-0 bg-teal-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 size={10} /> Target
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Deboard Summary & Arm Action */}
          <div className="bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3 border border-slate-200 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 block">
                  Deboard Stop Target:
                </span>
                <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {selectedStop.name}
                  {selectedStop.seq && (
                    <span className="text-[10px] text-slate-400 font-bold ml-1">
                      (Stop #{selectedStop.seq})
                    </span>
                  )}
                </h4>
              </div>
              {selectedStopDist !== null && (
                <div className="text-right shrink-0">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Est. Distance</span>
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    {selectedStopDist >= 1000
                      ? `${(selectedStopDist / 1000).toFixed(1)} km`
                      : `${selectedStopDist} m`}
                  </span>
                </div>
              )}
            </div>

            {/* Arm Button & Simulation Trigger */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleArmAlarm}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-2.5 px-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <BellRing size={14} /> Arm 300m Alarm for {selectedStop.name}
              </button>

              <button
                type="button"
                onClick={handleToggleBusNavigation}
                className={`py-2 px-3 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isSimulatingBus
                    ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400"
                }`}
                title="Test proximity alarm with simulated transit velocity"
              >
                <Navigation size={13} className={isSimulatingBus ? "animate-spin" : ""} />
                {isSimulatingBus ? "Stop Simulation" : "Simulate In-Bus Approach"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STATE 4: Geofence Alarm Triggered (< 350m / 300m from Moving Bus) */}
      <AnimatePresence>
        {hasTriggered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-amber-500 text-slate-950 p-5 rounded-2xl shadow-xl border-2 border-amber-300 relative overflow-hidden mt-3"
          >
            {/* Pulsing ring animation */}
            <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-black/15 rounded-full flex items-center justify-center mb-2">
                <BellRing size={28} className="text-slate-950 animate-bounce" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black/10 px-2.5 py-0.5 rounded-full mb-1">
                Deboard Warning · 300m Geofence Active
              </span>
              <h3 className="text-xl font-black text-slate-950 mb-0.5">
                Prepare to Deboard!
              </h3>
              <p className="text-xs font-bold text-amber-950 mb-3 max-w-xs leading-relaxed">
                Your bus on Route <span className="font-black">{busCode}</span> is arriving at{" "}
                <span className="underline font-black">{selectedStop.name}</span>. Please move toward the exit doors.
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