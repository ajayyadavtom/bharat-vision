"use client";

import { useState } from "react";
import { Users, AlertTriangle, Bus, Radio, CheckCircle2, TrendingUp, ShieldAlert, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface CorridorTelemetry {
  route: string;
  corridor: string;
  activeBuses: number;
  passengerCount: number;
  surgeStatus: "Normal" | "Elevated Surge" | "Critical Overflow";
}

export default function DepotDashboard() {
  const [corridors, setCorridors] = useState<CorridorTelemetry[]>([
    { route: "500D", corridor: "Hebbal ⇄ Silk Board", activeBuses: 14, passengerCount: 1180, surgeStatus: "Critical Overflow" },
    { route: "250", corridor: "Yelahanka ⇄ Majestic", activeBuses: 8, passengerCount: 650, surgeStatus: "Elevated Surge" },
    { route: "335E", corridor: "ITPL ⇄ Majestic", activeBuses: 12, passengerCount: 420, surgeStatus: "Normal" },
    { route: "401K", corridor: "Yelahanka ⇄ Yeshwanthpur", activeBuses: 6, passengerCount: 290, surgeStatus: "Normal" },
  ]);

  const [dispatchedLogs, setDispatchedLogs] = useState<string[]>([]);
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);

  const handleDispatchReliefBus = (route: string) => {
    setLoadingRoute(route);
    setTimeout(() => {
      setCorridors(prev =>
        prev.map(c => c.route === route ? { ...c, surgeStatus: "Normal", passengerCount: Math.round(c.passengerCount * 0.7) } : c)
      );
      setDispatchedLogs(prev => [`[${new Date().toLocaleTimeString()}] Relief feeder bus dispatched for Route ${route}. ETM conductors notified.`, ...prev]);
      setLoadingRoute(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <h1 className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Depot Command Center</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Surge Telemetry</h2>
        </div>
        <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark px-3 py-1.5 rounded-xl shadow-md text-right">
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase block">System Status</span>
          <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
            <Radio size={12} className="animate-pulse" /> Live Feed Active
          </span>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">Active Fleet</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">40 Buses</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1">100% Operational</span>
        </div>
        <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">Total Pax</p>
          <p className="text-2xl font-black text-brand-accent mt-2">2,540</p>
          <span className="text-[10px] text-amber-400 font-semibold mt-1">Peak Hour Load</span>
        </div>
        <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">Surge Zones</p>
          <p className="text-2xl font-black text-red-400 mt-2">2 Routes</p>
          <span className="text-[10px] text-red-400 font-semibold mt-1">Action Required</span>
        </div>
      </div>

      {/* Corridor Surge Monitoring List */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <TrendingUp size={18} className="text-brand-accent" /> Corridor Density & Relief Dispatch
      </h3>

      <div className="flex flex-col gap-4 mb-6">
        {corridors.map((corridor, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border backdrop-blur-md transition-all ${
              corridor.surgeStatus === "Critical Overflow" 
                ? "bg-red-950/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.15)]" 
                : corridor.surgeStatus === "Elevated Surge"
                ? "bg-amber-950/20 border-amber-500/40"
                : "bg-surface-dark border-slate-200 dark:border-surface-dark"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-brand-dark text-brand-accent font-black text-xs px-2 py-0.5 rounded border border-brand-base">
                    Route {corridor.route}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-gray-300 font-semibold">{corridor.corridor}</span>
                </div>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border ${
                corridor.surgeStatus === "Critical Overflow" 
                  ? "bg-red-500/20 text-red-400 border-red-500" 
                  : corridor.surgeStatus === "Elevated Surge"
                  ? "bg-amber-500/20 text-amber-400 border-amber-500"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500"
              }`}>
                {corridor.surgeStatus}
              </span>
            </div>

            <div className="flex justify-between items-center bg-surface-black p-3 rounded-xl border border-slate-200 dark:border-surface-dark mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-300">
                <Users size={14} className="text-brand-accent" />
                <span>Passenger Load: <strong className="text-slate-900 dark:text-white">{corridor.passengerCount} pax</strong></span>
              </div>
              <div className="text-xs text-slate-500 dark:text-gray-400">
                Active Fleet: <strong className="text-slate-900 dark:text-white">{corridor.activeBuses} units</strong>
              </div>
            </div>

            {corridor.surgeStatus !== "Normal" && (
              <button
                onClick={() => handleDispatchReliefBus(corridor.route)}
                disabled={loadingRoute === corridor.route}
                className="w-full bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loadingRoute === corridor.route ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Broadcasting ETM Chime & Dispatching...</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={14} />
                    <span>Trigger Conductor ETM Chime & Dispatch Relief Bus</span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Dispatched Audit Logs */}
      {dispatchedLogs.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Command Audit Logs</h3>
          <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col gap-2 font-mono text-[11px]">
            {dispatchedLogs.map((log, index) => (
              <div key={index} className="text-emerald-400 flex items-center gap-2">
                <CheckCircle2 size={12} />
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}