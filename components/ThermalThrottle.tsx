"use client";

import { useEffect, useState } from "react";
import { BatteryWarning, Leaf, ZapOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThermalThrottle() {
  const [isThrottled, setIsThrottled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  useEffect(() => {
    // 1. Page Visibility API (Throttle when app is in the background)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("App backgrounded: Dropping GPS polling from 3s to 30s [Thermal Throttle Active]");
        setIsThrottled(true);
      } else {
        console.log("App foregrounded: Restoring 3s GPS polling");
        setIsThrottled(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. Battery Status API (Throttle when battery is low)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBattery = () => {
          setBatteryLevel(battery.level * 100);
          if (battery.level <= 0.15 && !battery.charging) {
            setIsThrottled(true);
          }
        };

        updateBattery();
        battery.addEventListener('levelchange', updateBattery);
        battery.addEventListener('chargingchange', updateBattery);
      });
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {isThrottled && batteryLevel !== null && batteryLevel <= 15 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 left-0 right-0 max-w-md mx-auto px-4 z-[200] pointer-events-none"
        >
          <div className="bg-amber-950/90 backdrop-blur-md border border-amber-500/50 p-3 rounded-2xl shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-amber-900/50 p-2 rounded-xl text-amber-400">
                <BatteryWarning size={20} className="animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-100">Low Battery ({Math.round(batteryLevel)}%)</p>
                <p className="text-[10px] text-amber-300">Ultra-Lite Mode Active. GPS Throttled.</p>
              </div>
            </div>
            <ZapOff size={16} className="text-amber-500/50" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}