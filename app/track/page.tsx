"use client";

import { useState } from "react";
import { Navigation, Clock, Map as MapIcon, Zap, MapPin, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("../../components/LiveMap"), { ssr: false });

import RouteDeviationAI from "../../components/RouteDeviationAI";
import ProximityChime from "../../components/ProximityChime";
import SmartBoardingCard from "../../components/SmartBoardingCard";

export default function TrackScreen() {
  const [triggerAnomaly, setTriggerAnomaly] = useState(false);

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
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-slate-50 dark:bg-slate-950 relative">
      <div className="p-4 pt-8 bg-gradient-to-b from-white dark:from-slate-900 to-transparent flex justify-between items-start">
        <div>
          <h2 className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> Vanara Sena AI
          </h2>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Live Tracking</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400">80 buses · 120 stops · updated 2s ago</p>
        </div>
        
        <button 
          onClick={() => setTriggerAnomaly(true)}
          className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 p-2 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
          title="Simulate Route Deviation Anomaly"
        >
          <AlertTriangle size={18} />
        </button>
      </div>

      {/* Route Deviation AI Anomaly Engine */}
      <RouteDeviationAI externalTrigger={triggerAnomaly} resetTrigger={() => setTriggerAnomaly(false)} />

      {/* Proximity Deboarding Chime Engine */}
      <div className="px-4">
        <ProximityChime />
      </div>

      {/* The Live Interactive Map */}
      <div className="px-4 mb-6 mt-2">
        <div className="w-full h-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden shadow-sm">
          <LiveMap />
        </div>
      </div>

      {/* Tokyo & Singapore Crowd Density Engine */}
      <div className="px-4">
        <SmartBoardingCard />
      </div>

      <div className="px-4 mb-6 mt-2">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Navigation size={16} className="text-emerald-500" /> Plan your trip
          </h3>
          <div className="relative flex flex-col gap-4">
            <div className="absolute left-2.5 top-3.5 bottom-3.5 w-0.5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-emerald-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>
              <input type="text" value="Yelahanka, Bengaluru" readOnly className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none" />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <MapPin size={12} className="text-white" />
              </div>
              <input type="text" placeholder="Where to?" className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Smart Routes</h3>
        <div className="flex flex-col gap-3">
          {smartRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{route.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-emerald-500"/> {route.totalTime} mins
                    </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">₹{route.totalFare}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {route.segments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${
                      seg.mode === 'AUTO_ONDC' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500' :
                      seg.mode === 'BUS_BMTC' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {seg.mode.replace('_ONDC', '').replace('_BMTC', '')}
                    </span>
                    {i < route.segments.length - 1 && <span className="text-slate-400 text-xs">&rarr;</span>}
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
