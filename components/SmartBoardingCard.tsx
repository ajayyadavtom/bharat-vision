"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DoorOpen, ArrowRight, Bus, TrainFront, Clock, Info } from "lucide-react";

export default function SmartBoardingCard() {
  const [occupancy, setOccupancy] = useState(82); // 82% full
  const [flash, setFlash] = useState(false);

  // Simulate real-time occupancy updates
  useEffect(() => {
    const interval = setInterval(() => {
      setOccupancy((prev) => {
        const fluctuate = prev + (Math.floor(Math.random() * 5) - 2);
        return Math.min(100, Math.max(0, fluctuate));
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getOccupancyDetails = (occ: number) => {
    if (occ < 40) return { label: "Seats Available", color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" };
    if (occ < 80) return { label: "Standing Room", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" };
    return { label: "Packed (Crush Load)", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" };
  };

  const status = getOccupancyDetails(occupancy);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-5 rounded-3xl shadow-lg mt-6 relative overflow-hidden"
    >
      {/* Dynamic Background Pulse on Update */}
      {flash && <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none"></div>}

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping"></span>
            <h3 className="text-[10px] uppercase tracking-widest text-brand-light font-bold">Live Telemetry</h3>
          </div>
          <h4 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Bus size={20} className="text-brand-accent" /> Route 285M
          </h4>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Yelahanka ⇄ East West College of Engineering</p>
        </div>
      </div>

      {/* Singapore-Style Crowd Density */}
      <div className="mb-5">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Crowd Density</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${status.bg} ${status.border}`}>
            <Users size={12} className={status.color} />
            <span className={`text-[10px] font-black uppercase tracking-wider ${status.color}`}>
              {status.label} ({occupancy}%)
            </span>
          </div>
        </div>
        
        {/* Segmented Density Bar */}
        <div className="flex w-full h-2 rounded-full overflow-hidden bg-surface-black border border-slate-200 dark:border-surface-dark gap-0.5">
          <motion.div className="h-full bg-emerald-500" animate={{ width: `${Math.min(occupancy, 40)}%` }} transition={{ ease: "linear" }} />
          <motion.div className="h-full bg-amber-500" animate={{ width: `${Math.max(0, Math.min(occupancy - 40, 40))}%` }} transition={{ ease: "linear" }} />
          <motion.div className="h-full bg-red-500" animate={{ width: `${Math.max(0, occupancy - 80)}%` }} transition={{ ease: "linear" }} />
        </div>
      </div>

      {/* Tokyo-Style Boarding Strategy */}
      <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-2xl p-4">
        <h5 className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <Info size={12} /> Optimal Interchange Strategy
        </h5>
        
        <div className="flex items-center gap-3">
          <div className="bg-surface-black border border-indigo-500/30 p-2.5 rounded-xl">
            <DoorOpen size={20} className="text-indigo-400" />
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Board via the Front Door</p>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-1">
              Positions you perfectly for the Green Line escalators upon arrival.
            </p>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-indigo-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-indigo-200">
            <Clock size={14} className="text-indigo-400" />
            <span className="font-semibold">Expected Transfer Time</span>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white">45 sec</span>
        </div>
      </div>

    </motion.div>
  );
}