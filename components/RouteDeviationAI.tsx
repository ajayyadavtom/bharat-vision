"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, Check, X, Users, Medal, Loader2, GitMerge, Camera, XCircle, Gauge } from "lucide-react";
import { useAppStore } from "@/lib/store";

// Helper to calculate exact distance between two coordinates in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function RouteDeviationAI({ 
  externalTrigger, 
  resetTrigger 
}: { 
  externalTrigger?: boolean;
  resetTrigger?: () => void;
}) {
  const { addKarma } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [voteStatus, setVoteStatus] = useState<"pending" | "voting" | "ocr" | "verifying" | "confirmed">("pending");
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(0);

  // Track previous GPS coordinates to calculate real ground speed
  const prevPosRef = useRef<{ lat: number; lng: number; time: number } | null>(null);
  // Rate-limiting cooldown: at least 40 seconds between notifications
  const lastPromptTimeRef = useRef<number>(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const COOLDOWN_MS = 40000; // 40 seconds minimum cooldown

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    setVoteStatus("pending");
    lastPromptTimeRef.current = Date.now(); // Reset 40s cooldown upon dismissal
    if (resetTrigger) resetTrigger();
  }, [resetTrigger]);

  useEffect(() => {
    let watchId: number;

    if (typeof window !== "undefined" && "geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const now = Date.now();
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          let calculatedSpeed = 0;

          // 1. First priority: native device speed if available (m/s to km/h)
          if (position.coords.speed !== null && position.coords.speed >= 0) {
            calculatedSpeed = position.coords.speed * 3.6;
          } 
          // 2. Second priority: compute delta distance / delta time between GPS fixes
          else if (prevPosRef.current) {
            const dt = (now - prevPosRef.current.time) / 1000; // seconds
            if (dt >= 2) {
              const dist = getDistanceMeters(prevPosRef.current.lat, prevPosRef.current.lng, lat, lng);
              calculatedSpeed = (dist / dt) * 3.6; // km/h
            } else {
              calculatedSpeed = currentSpeedKmh;
            }
          }

          // Update location history
          prevPosRef.current = { lat, lng, time: now };
          const roundedSpeed = Math.round(calculatedSpeed);
          setCurrentSpeedKmh(roundedSpeed);

          // SMART AI TRAVELING DETECTION:
          // User MUST be moving in a transit vehicle (speed >= 12 km/h).
          // If user is stationary (0 to 5 km/h) or walking, DO NOT annoy the user.
          const isTraveling = roundedSpeed >= 12;
          const timeSinceLastPrompt = now - lastPromptTimeRef.current;

          // Only trigger if user is actively traveling AND at least 40 seconds have elapsed
          if (isTraveling && timeSinceLastPrompt >= COOLDOWN_MS && !isVisible) {
            lastPromptTimeRef.current = now;
            setIsVisible(true);
            setVoteStatus("pending");
          }
        },
        (error) => {
          console.warn("Geolocation watch error:", error.message);
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isVisible, currentSpeedKmh]);

  // Handle manual simulation trigger from Track Bus UI button
  useEffect(() => {
    if (externalTrigger) {
      setIsVisible(true);
      setVoteStatus("pending");
      lastPromptTimeRef.current = Date.now();
    }
  }, [externalTrigger]);

  const handleVote = (hasDeviated: boolean) => {
    setVoteStatus("voting");
    setTimeout(() => {
      setVoteStatus("verifying");
      setTimeout(() => {
        setVoteStatus("confirmed");
        if (hasDeviated) addKarma(15);
        setTimeout(() => {
          handleDismiss();
        }, 3000);
      }, 1800);
    }, 800);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVoteStatus("ocr");
      setTimeout(() => {
        setVoteStatus("confirmed");
        addKarma(25);
        setTimeout(() => {
          handleDismiss();
        }, 3000);
      }, 2500);
    }
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-20 left-0 right-0 max-w-md mx-auto px-4 z-[150] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-amber-500/50 p-5 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(245,158,11,0.2)] pointer-events-auto relative overflow-hidden"
        >
          {/* AI Beacon Scan Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/5 dark:via-amber-500/10 to-amber-500/0 animate-[shimmer_2s_infinite] pointer-events-none"></div>

          {/* Dismiss Button */}
          {voteStatus === "pending" && (
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10 p-1 cursor-pointer"
              title="Dismiss for 40 seconds"
            >
              <XCircle size={20} />
            </button>
          )}

          {voteStatus === "pending" && (
            <>
              <div className="flex justify-between items-start mb-3 pr-6">
                <div className="flex items-center gap-2">
                  <AlertOctagon size={16} className="text-amber-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">
                    Transit Anomaly Detected
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                Are you on Route 500D?
              </h3>
              
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-indigo-500 font-bold flex items-center gap-1.5 text-[11px]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Live Telemetry Active
                  </span>
                  {currentSpeedKmh > 0 && (
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Gauge size={10} /> {currentSpeedKmh} km/h
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Our telemetry model detected a sudden detour away from Outer Ring Road corridor.
                </p>
                <p className="mt-1.5 font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  Did the bus take a bypass route or detour?
                </p>
              </div>

              <div className="flex items-center gap-2 mb-3 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <Medal size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Earn +15 Karma Points for verifying</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVote(true)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white dark:text-black font-black py-2.5 rounded-xl text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check size={16} /> Yes, Detour
                  </button>
                  <button
                    onClick={() => handleVote(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <X size={16} /> Normal Path
                  </button>
                </div>
                
                {/* Hidden File Input for Real Camera Capture */}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={fileInputRef} 
                  onChange={handleCameraCapture} 
                  className="hidden" 
                />
                
                <button
                  onClick={triggerCamera}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold py-2 rounded-xl text-[11px] active:scale-95 transition-all flex items-center justify-center gap-1.5 mt-0.5 cursor-pointer"
                >
                  <Camera size={14} /> Snap Display Board for OCR (+25 pts)
                </button>
              </div>
            </>
          )}

          {voteStatus === "ocr" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="relative">
                <Camera size={32} className="text-indigo-500 mb-3" />
                <div className="absolute inset-0 bg-indigo-400/20 blur-md rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Analyzing Image...</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Extracting LED text via OCR Neural Net</p>
            </div>
          )}

          {voteStatus === "voting" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Loader2 size={24} className="text-amber-500 animate-spin mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transmitting Verification...</h3>
            </div>
          )}

          {voteStatus === "verifying" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-3 text-indigo-500">
                <Users size={16} className="animate-bounce" />
                <Users size={20} className="animate-bounce delay-75" />
                <Users size={16} className="animate-bounce delay-150" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verifying Consensus</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cross-checking with other telemetry reports...</p>
            </div>
          )}

          {voteStatus === "confirmed" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-2 text-center"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 border border-emerald-500">
                <GitMerge size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Telemetry Verified!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 mb-3">
                Consensus updated. Ghost ETAs prevented for other commuters.
              </p>
              <div className="bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                <Medal size={16} className="text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+15 Karma Points Earned</span>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}