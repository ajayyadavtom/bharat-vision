"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, MapPin, Volume2, Bus, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function ProximityChime() {
  const [isTracking, setIsTracking] = useState(false);
  const [distance, setDistance] = useState(1200); // Start 1.2km away
  const [hasTriggered, setHasTriggered] = useState(false);

  // Target Stop
  const targetStop = "Silk Board Junction";

  const enableTracking = () => {
    setIsTracking(true);
    setDistance(1200);
    setHasTriggered(false);
  };

  useEffect(() => {
    if (!isTracking || hasTriggered) return;

    // Simulate the bus moving closer to the destination
    const interval = setInterval(() => {
      setDistance((prev) => {
        const newDist = prev - 50; // Move 50 meters closer every second for the demo
        
        // Trigger Geofence at exactly 300 meters
        if (newDist <= 300 && !hasTriggered) {
          triggerDeboardAlarm();
          return 300;
        }
        return newDist;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTracking, hasTriggered]);

  const triggerDeboardAlarm = () => {
    setHasTriggered(true);

    // 1. Hardware Vibration (Requires user interaction first, which we got via the enable button)
    if ("vibrate" in navigator) {
      navigator.vibrate([500, 200, 500, 200, 1000]); // Pulse pattern
    }

    // 2. Voice NLP Alert
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Approaching ${targetStop}. You are 300 meters away. Please prepare to deboard at the rear doors.`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isTracking && !hasTriggered) {
    return (
      <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-4 rounded-3xl shadow-lg mt-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BellRing size={18} className="text-slate-500 dark:text-gray-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Geofence Alarm</h3>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">
          Enable background tracking. We will vibrate and alert you 300m before your stop.
        </p>
        <button
          onClick={enableTracking}
          className="w-full bg-brand-dark hover:bg-brand-base border border-brand-base text-brand-light font-bold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <MapPin size={16} /> Set Alarm for {targetStop}
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!hasTriggered ? (
        <motion.div
          key="tracking"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          className="bg-surface-dark border border-brand-base p-4 rounded-3xl shadow-[0_5px_20px_rgba(20,184,166,0.1)] mt-6 relative overflow-hidden"
        >
          {/* Radar Sweep Animation */}
          <div className="absolute inset-0 bg-brand-accent/5 animate-[pulse_2s_infinite] pointer-events-none"></div>

          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-surface-black p-2 rounded-full border border-slate-200 dark:border-brand-dark">
                <Bus size={20} className="text-brand-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-brand-light font-bold mb-0.5">Live Distance</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{distance} <span className="text-xs text-slate-500 dark:text-gray-400 font-semibold">meters</span></p>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end">
              <Volume2 size={16} className="text-brand-accent mb-1 animate-pulse" />
              <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Alarm Armed</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-surface-black h-2 rounded-full mt-4 overflow-hidden border border-slate-200 dark:border-surface-dark relative z-10">
            <motion.div 
              className="h-full bg-brand-accent"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.max(0, 100 - (distance / 1200) * 100)}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="triggered"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500 border-4 border-amber-400 p-5 rounded-3xl shadow-[0_0_40px_rgba(245,158,11,0.6)] mt-6 relative overflow-hidden"
        >
          {/* High Alert Pulse */}
          <div className="absolute inset-0 bg-white/20 animate-ping pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="bg-black/20 p-3 rounded-full mb-3">
              <BellRing size={32} className="text-black animate-bounce" />
            </div>
            <h3 className="text-2xl font-black text-black tracking-tight mb-1">Get Ready!</h3>
            <p className="text-sm font-bold text-amber-900 mb-4">
              You are exactly 300 meters from {targetStop}.
            </p>
            
            <button
              onClick={() => {
                setIsTracking(false);
                setHasTriggered(false);
              }}
              className="w-full bg-black hover:bg-gray-900 text-slate-900 dark:text-white font-black py-3 rounded-xl text-xs active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
            >
              <CheckCircle2 size={18} /> Dismiss Alarm
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}