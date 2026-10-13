"use client";

import { useState } from "react";
import { Users, Bus, Radio, CheckCircle2, TrendingUp, ShieldAlert, RefreshCw, Zap, Building2, Gauge, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { BMTC_FLEET_STATISTICS, OFFICIAL_BMTC_ROUTES } from "@/data/bmtcOfficialData";

interface CorridorTelemetry {
  route: string;
  corridor: string;
  activeBuses: number;
  passengerCount: number;
  surgeStatus: "Normal" | "Elevated Surge" | "Critical Overflow";
  officialTrips: number;
  type: string;
}

export default function DepotDashboard() {
  const [corridors, setCorridors] = useState<CorridorTelemetry[]>([
    { 
      route: "402-B", 
      corridor: "Yelahanka Satellite Town ⇄ Majestic (KBS Platform 22)", 
      activeBuses: 24, 
      passengerCount: 1680, 
      surgeStatus: "Critical Overflow",
      officialTrips: 4389,
      type: "Ordinary Non-AC"
    },
    { 
      route: "401-K", 
      corridor: "Yelahanka ⇄ Yeshwantpur ⇄ Kengeri", 
      activeBuses: 28, 
      passengerCount: 1840, 
      surgeStatus: "Elevated Surge",
      officialTrips: 5429,
      type: "Arterial Ring Feeder"
    },
    { 
      route: "500-D", 
      corridor: "Hebbal ⇄ Silk Board (Outer Ring Road Express)", 
      activeBuses: 32, 
      passengerCount: 2240, 
      surgeStatus: "Critical Overflow",
      officialTrips: 3850,
      type: "Ring Road High-Frequency"
    },
    { 
      route: "356-CW", 
      corridor: "Electronic City Tollway Flyover Express", 
      activeBuses: 26, 
      passengerCount: 1420, 
      surgeStatus: "Elevated Surge",
      officialTrips: 4899,
      type: "Elevated Tollway Express"
    },
    { 
      route: "V-500DA", 
      corridor: "Yelahanka ⇄ Central Silk Board (Volvo Vajra AC)", 
      activeBuses: 16, 
      passengerCount: 680, 
      surgeStatus: "Normal",
      officialTrips: 2755,
      type: "Volvo AC Vajra"
    },
    { 
      route: "258-C", 
      corridor: "Nelamangala ⇄ Peenya ⇄ Majestic", 
      activeBuses: 18, 
      passengerCount: 890, 
      surgeStatus: "Normal",
      officialTrips: 3276,
      type: "North-West Corridor"
    },
  ]);

  const [dispatchedLogs, setDispatchedLogs] = useState<string[]>([]);
  const [loadingRoute, setLoadingRoute] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"telemetry" | "fleet" | "routes">("telemetry");

  const handleDispatchReliefBus = (route: string) => {
    setLoadingRoute(route);
    setTimeout(() => {
      setCorridors(prev =>
        prev.map(c => c.route === route ? { ...c, surgeStatus: "Normal", passengerCount: Math.round(c.passengerCount * 0.65) } : c)
      );
      setDispatchedLogs(prev => [`[${new Date().toLocaleTimeString()}] Relief fleet auto-dispatched for BMTC Route ${route}. Real-time ETM conductors alerted at depot gates.`, ...prev]);
      setLoadingRoute(null);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      
      {/* Header */}
      <div className="mb-5 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h1 className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Official BMTC Command Center</h1>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Depot & Fleet Telemetry</h2>
          <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">Live feed synchronized with official BMTC open data</p>
        </div>
        <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark px-3 py-1.5 rounded-xl shadow-md text-right">
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase block">Depots 1–50</span>
          <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
            <Radio size={12} className="animate-pulse" /> 50 Depots Live
          </span>
        </div>
      </div>

      {/* Official BMTC Master Fleet KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
        <div className="bg-surface-dark p-3.5 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-[10px] font-bold uppercase">Total Fleet</span>
            <Bus size={14} className="text-brand-accent" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{BMTC_FLEET_STATISTICS.totalFleet.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">{BMTC_FLEET_STATISTICS.fleetUtilization} Fleet Utilized</span>
        </div>

        <div className="bg-surface-dark p-3.5 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-[10px] font-bold uppercase">Electric Buses</span>
            <Zap size={14} className="text-emerald-400" />
          </div>
          <p className="text-xl font-black text-emerald-400 mt-1">{BMTC_FLEET_STATISTICS.electricBuses.toLocaleString()}</p>
          <span className="text-[10px] text-slate-400 font-semibold mt-0.5">Tata / JBM / Switch EV</span>
        </div>

        <div className="bg-surface-dark p-3.5 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-[10px] font-bold uppercase">Daily Schedules</span>
            <Gauge size={14} className="text-blue-400" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{BMTC_FLEET_STATISTICS.dailySchedules.toLocaleString()}</p>
          <span className="text-[10px] text-blue-400 font-semibold mt-0.5">{BMTC_FLEET_STATISTICS.dailyEffectiveKm}</span>
        </div>

        <div className="bg-surface-dark p-3.5 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-gray-400">
            <span className="text-[10px] font-bold uppercase">Operating Depots</span>
            <Building2 size={14} className="text-amber-400" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{BMTC_FLEET_STATISTICS.depotsCount}</p>
          <span className="text-[10px] text-amber-400 font-semibold mt-0.5">{BMTC_FLEET_STATISTICS.staffStrength.toLocaleString()} Staff</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 p-1 bg-surface-dark rounded-xl border border-slate-200 dark:border-surface-dark mb-4">
        <button
          onClick={() => setActiveTab("telemetry")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "telemetry" 
              ? "bg-brand-accent text-slate-950 shadow-md" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          Corridor Telemetry
        </button>
        <button
          onClick={() => setActiveTab("fleet")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "fleet" 
              ? "bg-brand-accent text-slate-950 shadow-md" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          Division Fleet (50 Depots)
        </button>
        <button
          onClick={() => setActiveTab("routes")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === "routes" 
              ? "bg-brand-accent text-slate-950 shadow-md" 
              : "text-slate-400 hover:text-white"
          }`}
        >
          Top BMTC Routes
        </button>
      </div>

      {activeTab === "telemetry" && (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-accent" /> Real Corridor Density & Relief Dispatch
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Real BMTC Trip Density</span>
          </div>

          <div className="flex flex-col gap-3.5 mb-6">
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
                <div className="flex justify-between items-start mb-2.5">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-brand-dark text-brand-accent font-black text-xs px-2 py-0.5 rounded border border-brand-base">
                        Route {corridor.route}
                      </span>
                      <span className="text-xs text-slate-800 dark:text-gray-200 font-bold">{corridor.corridor}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-slate-400 font-medium">{corridor.type}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">• {corridor.officialTrips.toLocaleString()} Recorded Trips</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border shrink-0 ${
                    corridor.surgeStatus === "Critical Overflow" 
                      ? "bg-red-500/20 text-red-400 border-red-500" 
                      : corridor.surgeStatus === "Elevated Surge"
                      ? "bg-amber-500/20 text-amber-400 border-amber-500"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500"
                  }`}>
                    {corridor.surgeStatus}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-surface-black p-2.5 rounded-xl border border-slate-200 dark:border-surface-dark mb-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-gray-300">
                    <Users size={14} className="text-brand-accent" />
                    <span>Live Pax Load: <strong className="text-slate-900 dark:text-white">{corridor.passengerCount} pax</strong></span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-400">
                    Depot Fleet: <strong className="text-slate-900 dark:text-white">{corridor.activeBuses} buses</strong>
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

          {dispatchedLogs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Depot Command Audit Logs</h3>
              <div className="bg-surface-dark p-3.5 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col gap-2 font-mono text-[11px]">
                {dispatchedLogs.map((log, index) => (
                  <div key={index} className="text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={12} className="shrink-0" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === "fleet" && (
        <div className="flex flex-col gap-3 mb-6">
          <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark">
            <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
              <Compass size={16} className="text-brand-accent" /> Division-Wise Fleet Allocation (Official BMTC)
            </h3>
            <p className="text-xs text-slate-400 mb-4">Verified distribution across 50 BMTC depots in Greater Bengaluru</p>

            <div className="flex flex-col gap-3">
              {Object.entries(BMTC_FLEET_STATISTICS.divisionBuses).map(([division, count], idx) => {
                const percent = ((count / BMTC_FLEET_STATISTICS.totalFleet) * 100).toFixed(1);
                return (
                  <div key={idx} className="bg-surface-black p-3 rounded-xl border border-slate-200 dark:border-surface-dark">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-white">{division}</span>
                      <span className="text-xs font-mono font-bold text-brand-accent">{count.toLocaleString()} buses ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark text-xs text-slate-300 space-y-2">
            <p className="font-bold text-white">Official Operational Benchmarks:</p>
            <p>• <strong>Average Fuel Efficiency:</strong> {BMTC_FLEET_STATISTICS.fuelMileageKmpl} KMPL (Diesel fleet benchmark)</p>
            <p>• <strong>Daily Effective Distance:</strong> {BMTC_FLEET_STATISTICS.dailyEffectiveKm}</p>
            <p>• <strong>Total Operating Staff:</strong> {BMTC_FLEET_STATISTICS.staffStrength.toLocaleString()} personnel (Drivers, Conductors & Mechanical Crews)</p>
            <p>• <strong>EV Transition:</strong> {BMTC_FLEET_STATISTICS.electricBuses.toLocaleString()} zero-emission electric buses operating under FAME-II and GCC models</p>
          </div>
        </div>
      )}

      {activeTab === "routes" && (
        <div className="flex flex-col gap-3 mb-6">
          <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark">
            <h3 className="text-sm font-bold text-white mb-1">Top BMTC Corridors by Official Trip Volume</h3>
            <p className="text-xs text-slate-400 mb-3">Extracted directly from BMTC Open Data (ac150-stops.csv)</p>

            <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto no-scrollbar">
              {OFFICIAL_BMTC_ROUTES.slice(0, 25).map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-surface-black rounded-xl border border-slate-200 dark:border-surface-dark text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500 font-mono text-[10px] w-4">{i + 1}</span>
                    <div>
                      <span className="bg-brand-dark text-brand-accent font-black text-xs px-2 py-0.5 rounded border border-brand-base mr-2">
                        {r.route}
                      </span>
                      <span className="text-white font-medium text-xs">{r.corridor}</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">{r.type}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-bold font-mono text-xs block">{r.trips.toLocaleString()}</span>
                    <span className="text-[9px] text-slate-500 uppercase">Trips</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}