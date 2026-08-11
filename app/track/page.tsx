"use client";

import { Navigation, Clock, Map as MapIcon, Zap, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// 1. PERFECT PATH ALIGNMENT: Pointing exactly to your root components folder
const LiveMap = dynamic(() => import("../../components/LiveMap"), { ssr: false });

export default function TrackScreen() {
  // 2. HARDCODED DATA: Ensures it doesn't crash on missing logic files
  const smartRoutes = [
    {
      id: "r1",
      name: "Fastest: Metro + Walk",
      totalTime: 42,
      totalFare: 55,
      segments: [{ mode: "AUTO_ONDC" }, { mode: "METRO_BMRCL" }, { mode: "WALK" }]
    },
    {
      id: "r2",
      name: "Cheapest: Direct Bus",
      totalTime: 65,
      totalFare: 25,
      segments: [{ mode: "WALK" }, { mode: "BUS_BMTC" }, { mode: "WALK" }]
    }
  ];

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-surface-black relative">
      
      <div className="p-4 pt-8 bg-gradient-to-b from-brand-dark/50 to-transparent">
        <h2 className="text-[10px] text-brand-accent uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-1">
          <Zap size={10} fill="currentColor" /> Vanara Sena
        </h2>
        <h1 className="text-3xl font-extrabold text-white mb-2">Live Tracking</h1>
        <p className="text-xs text-gray-400">80 buses · 120 stops · updated 2s ago</p>
      </div>

      {/* The Live Interactive Map */}
      <div className="px-4 mb-6">
        <div className="w-full h-64 bg-surface-dark border border-brand-dark rounded-3xl relative overflow-hidden shadow-lg">
           <LiveMap />
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-surface-dark p-5 rounded-3xl border border-surface-dark shadow-md">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
            <Navigation size={16} className="text-brand-light" /> Plan your trip
          </h3>
          
          <div className="relative flex flex-col gap-4">
            <div className="absolute left-2.5 top-3.5 bottom-3.5 w-0.5 bg-brand-dark rounded-full"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-5 h-5 rounded-full bg-surface-black border-2 border-brand-light flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-light"></div>
              </div>
              <input type="text" value="Yelahanka, Bengaluru" readOnly className="flex-1 bg-transparent text-sm text-gray-300 outline-none" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center shadow-[0_0_8px_rgba(20,184,166,0.5)]">
                <MapPin size={12} className="text-brand-dark" />
              </div>
              <input type="text" placeholder="Where to?" className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-lg font-bold text-white mb-3">Smart Routes</h3>
        <div className="flex flex-col gap-3">
          {smartRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-surface-dark p-4 rounded-2xl border border-surface-dark shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{route.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-brand-accent"/> {route.totalTime} mins
                    </span>
                    <span className="font-bold text-gray-300">₹{route.totalFare}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {route.segments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                      seg.mode === 'AUTO_ONDC' ? 'bg-amber-500/20 text-amber-500' : 
                      seg.mode === 'BUS_BMTC' ? 'bg-brand-dark text-brand-accent' : 
                      'bg-surface-black text-gray-400 border border-surface-dark'
                    }`}>
                      {seg.mode.replace('_ONDC', '').replace('_BMTC', '')}
                    </span>
                    {i < route.segments.length - 1 && <span className="text-gray-600 text-xs">&rarr;</span>}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}