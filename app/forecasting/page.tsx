"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  MapPin, 
  Bus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Siren, 
  ArrowRight, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  PieChart, 
  SlidersHorizontal 
} from "lucide-react";
import { 
  BMTC_FLEET_STATISTICS, 
  BMTC_DIVISIONAL_FLEET_DATA, 
  OFFICIAL_BMTC_STOPS,
  BMTCStopRecord,
  BMTCFleetDivisionRecord 
} from "@/data/bmtcOfficialData";

interface SurgeNode {
  id: string;
  location: string;
  destination: string;
  searchIntentCount: number;
  arrivingCapacity: number;
  deficit: number;
  status: "Monitoring" | "Critical Deficit" | "Resolved";
}

type TabType = "surge" | "fleet" | "stops";

export default function DemandForecastingDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("surge");
  const [selectedYear, setSelectedYear] = useState<string>("2019-20");
  const [stopSearch, setStopSearch] = useState<string>("");
  const [expandedStop, setExpandedStop] = useState<string | null>(null);

  // 1. Live Interactive Surge Nodes
  const [nodes, setNodes] = useState<SurgeNode[]>([
    { id: "N-KRM", location: "Koramangala Block 5", destination: "Electronic City", searchIntentCount: 120, arrivingCapacity: 60, deficit: 60, status: "Critical Deficit" },
    { id: "N-YEL", location: "Yelahanka Santhe Circle", destination: "Majestic", searchIntentCount: 185, arrivingCapacity: 120, deficit: 65, status: "Critical Deficit" },
    { id: "N-HSR", location: "HSR Layout Sector 2", destination: "Silk Board", searchIntentCount: 210, arrivingCapacity: 50, deficit: 160, status: "Critical Deficit" },
    { id: "N-JAK", location: "Jakkur Aerodrum", destination: "Hebbal Flyover", searchIntentCount: 95, arrivingCapacity: 100, deficit: 0, status: "Monitoring" },
  ]);

  const [dispatching, setDispatching] = useState<string | null>(null);

  // Simulate real-time intent aggregation (app searches increasing live)
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === "Critical Deficit") {
          const newIntent = node.searchIntentCount + Math.floor(Math.random() * 5);
          return { ...node, searchIntentCount: newIntent, deficit: Math.max(0, newIntent - node.arrivingCapacity) };
        }
        return node;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDispatch = (nodeId: string) => {
    setDispatching(nodeId);
    setTimeout(() => {
      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, arrivingCapacity: node.arrivingCapacity + 120, deficit: 0, status: "Resolved" } 
          : node
      ));
      setDispatching(null);
    }, 2000);
  };

  // 2. Filter Divisional Fleet Data by Year
  const divisionRecords = useMemo(() => {
    return BMTC_DIVISIONAL_FLEET_DATA.filter(
      r => r.year === selectedYear && r.division !== "Total"
    );
  }, [selectedYear]);

  const totalRecord = useMemo(() => {
    return BMTC_DIVISIONAL_FLEET_DATA.find(
      r => r.year === selectedYear && r.division === "Total"
    );
  }, [selectedYear]);

  // 3. Filter AC-150 Stops
  const filteredStops = useMemo(() => {
    const q = stopSearch.toLowerCase().trim();
    if (!q) return OFFICIAL_BMTC_STOPS.slice(0, 35);
    return OFFICIAL_BMTC_STOPS.filter(
      s => s.name.toLowerCase().includes(q) || 
           s.topRoutes.some(r => r.toLowerCase().includes(q))
    ).slice(0, 35);
  }, [stopSearch]);

  const availableYears = ["2019-20", "2018-19", "2017-18", "2016-17"];

  return (
    <div className="flex flex-col min-h-[100dvh] md:h-full overflow-y-auto no-scrollbar pb-[120px] md:pb-8 bg-surface-black px-4 pt-8 md:max-w-[1500px] xl:max-w-[1640px] md:mx-auto md:w-full md:px-10 xl:px-14 [&>*]:shrink-0">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-[10px] uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">BMTC Smart City API</h1>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Transit Analytics</h2>
        </div>
        <div className="bg-surface-dark border border-indigo-200 dark:border-indigo-900 px-3 py-1.5 rounded-xl shadow-md text-right">
          <span className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase block">GTFS Realtime</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs flex items-center gap-1 justify-end">
            <Activity size={12} className="animate-pulse" /> Live Connected
          </span>
        </div>
      </div>

      {/* Navigation Segment Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-surface-dark p-1 rounded-2xl border border-slate-200 dark:border-brand-dark mb-6">
        <button
          onClick={() => setActiveTab("surge")}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "surge" 
              ? "bg-indigo-600 text-white shadow-md" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Activity size={14} /> Surge Deficit
        </button>
        <button
          onClick={() => setActiveTab("fleet")}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "fleet" 
              ? "bg-indigo-600 text-white shadow-md" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Bus size={14} /> Fleet (Govt)
        </button>
        <button
          onClick={() => setActiveTab("stops")}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "stops" 
              ? "bg-indigo-600 text-white shadow-md" 
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <MapPin size={14} /> AC-150 Stops
        </button>
      </div>

      {/* --- TAB 1: SURGE DEFICIT FORECAST --- */}
      {activeTab === "surge" && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-500 dark:text-gray-400 bg-surface-dark p-3 rounded-xl border border-slate-200 dark:border-surface-dark">
            Aggregates live commuter app search intent across the Bharat Vision network to predict crowd surges and deficit before stops overflow.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
            {nodes.map((node) => (
              <motion.div
                key={node.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl border shadow-lg relative overflow-hidden transition-all ${
                  node.status === "Critical Deficit" 
                    ? "bg-red-50/70 dark:bg-red-950/20 border-red-300 dark:border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                    : node.status === "Resolved"
                    ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30"
                    : "bg-surface-dark border-slate-200 dark:border-brand-dark"
                }`}
              >
                {node.status === "Critical Deficit" && (
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
                )}

                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <MapPin size={16} className={node.status === "Critical Deficit" ? "text-red-500 dark:text-red-400" : "text-teal-600 dark:text-brand-accent"} />
                      {node.location}
                    </h3>
                    <p className="text-xs font-bold text-slate-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <ArrowRight size={12} /> Towards {node.destination}
                    </p>
                  </div>
                  
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${
                    node.status === "Critical Deficit" ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/50" 
                    : node.status === "Resolved" ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/50"
                    : "bg-surface-black text-slate-600 dark:text-gray-400 border-slate-300 dark:border-gray-600"
                  }`}>
                    {node.status}
                  </span>
                </div>

                {/* Data Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
                  <div className="bg-surface-black p-3 rounded-xl border border-slate-200 dark:border-surface-dark text-center">
                    <p className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      <Activity size={10} /> App Searches
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{node.searchIntentCount}</p>
                  </div>
                  <div className="bg-surface-black p-3 rounded-xl border border-slate-200 dark:border-surface-dark text-center">
                    <p className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                      <Bus size={10} /> Fleet Cap.
                    </p>
                    <p className="text-lg font-black text-slate-900 dark:text-white">{node.arrivingCapacity}</p>
                  </div>
                  <div className={`p-3 rounded-xl border text-center ${
                    node.deficit > 0 ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/50" : "bg-surface-black border-slate-200 dark:border-surface-dark"
                  }`}>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1 ${
                      node.deficit > 0 ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-gray-400"
                    }`}>
                      <TrendingUp size={10} /> Deficit
                    </p>
                    <p className={`text-lg font-black ${node.deficit > 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                      {node.deficit > 0 ? `-${node.deficit}` : "0"}
                    </p>
                  </div>
                </div>

                {node.status === "Critical Deficit" && (
                  <button
                    onClick={() => handleDispatch(node.id)}
                    disabled={dispatching === node.id}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3 rounded-xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-10 disabled:opacity-50"
                  >
                    {dispatching === node.id ? (
                      <span className="animate-pulse flex items-center gap-2">
                        <Siren size={16} className="animate-spin" /> Assigning Depot Special...
                      </span>
                    ) : (
                      <>
                        <AlertTriangle size={16} /> Override: Dispatch Standby Bus Now
                      </>
                    )}
                  </button>
                )}

                {node.status === "Resolved" && (
                  <div className="w-full bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 relative z-10">
                    <CheckCircle2 size={16} /> 2 Standby Buses En Route. Surge Contained.
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          </div>
        </div>
      )}

      {/* --- TAB 2: DIVISIONAL FLEET UTILIZATION (GOVERNMENT DATASET) --- */}
      {activeTab === "fleet" && (
        <div className="flex flex-col gap-4">
          
          {/* Year Selector */}
          <div className="flex items-center justify-between bg-surface-dark p-3 rounded-2xl border border-slate-200 dark:border-surface-dark">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <SlidersHorizontal size={14} className="text-indigo-600 dark:text-indigo-400" /> Fiscal Period:
            </span>
            <div className="flex gap-1">
              {availableYears.map(yr => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                    selectedYear === yr 
                      ? "bg-indigo-600 text-white shadow-sm" 
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-surface-black border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Bengaluru City-Wide Fleet Total Card */}
          {totalRecord && (
            <div className="bg-gradient-to-br from-indigo-50 dark:from-indigo-950/60 via-white dark:via-surface-dark to-slate-50 dark:to-surface-dark border border-indigo-200 dark:border-indigo-500/40 p-5 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest block">Official BMTC Total</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Bengaluru Metro Fleet</h3>
                </div>
                <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40 px-3 py-1 rounded-full">
                  {totalRecord.fleetUtilisation}% Utilization
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white dark:bg-surface-black/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase">Total Held</p>
                  <p className="text-base font-black text-slate-900 dark:text-white mt-0.5">{totalRecord.busesHeld}</p>
                </div>
                <div className="bg-white dark:bg-surface-black/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[9px] text-emerald-700 dark:text-emerald-400 font-bold uppercase">On Road/Day</p>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{totalRecord.busesOnRoad}</p>
                </div>
                <div className="bg-white dark:bg-surface-black/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[9px] text-amber-700 dark:text-amber-400 font-bold uppercase">Spares</p>
                  <p className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">{totalRecord.roadWorthySpare}</p>
                </div>
                <div className="bg-white dark:bg-surface-black/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <p className="text-[9px] text-red-700 dark:text-red-400 font-bold uppercase">Off-Road</p>
                  <p className="text-base font-black text-red-600 dark:text-red-400 mt-0.5">{totalRecord.offRoadPercent}%</p>
                </div>
              </div>
            </div>
          )}

          {/* 6 BMTC Divisions Cards */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider px-1 mb-3">
              Divisional Breakdown ({selectedYear})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {divisionRecords.map((div) => {
              const utilNum = Number(div.fleetUtilisation) || 0;
              return (
                <div 
                  key={div.division}
                  className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-4 rounded-2xl shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{div.division} Division</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {div.division === "North" && "Yelahanka, Hebbal, Doddaballapur"}
                        {div.division === "West" && "Yeshwantpur, Peenya, Kengeri"}
                        {div.division === "South" && "Banashankari, Electronic City, Jayanagar"}
                        {div.division === "East" && "Whitefield, Indiranagar, KR Puram"}
                        {div.division === "North East" && "Nagawara, Thanisandra, Kalyan Nagar"}
                        {div.division === "Central" && "Kempegowda Majestic, Shivajinagar, Shantinagar"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-black ${utilNum >= 85 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {div.fleetUtilisation}%
                      </span>
                      <span className="text-[9px] text-slate-500 block">Fleet Util.</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        utilNum >= 88 ? "bg-emerald-500" : utilNum >= 80 ? "bg-indigo-500" : "bg-amber-500"
                      }`}
                      style={{ width: `${Math.min(100, utilNum)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                    <div className="bg-slate-100 dark:bg-surface-black/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <span className="text-slate-500 block">Held</span>
                      <span className="font-bold text-slate-900 dark:text-white">{div.busesHeld}</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-surface-black/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <span className="text-emerald-700 dark:text-emerald-500 block">On Road</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{div.busesOnRoad}</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-surface-black/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <span className="text-amber-700 dark:text-amber-500 block">Spares</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{div.roadWorthySpare}</span>
                    </div>
                    <div className="bg-slate-100 dark:bg-surface-black/60 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/80">
                      <span className="text-red-700 dark:text-red-500 block">Off-Road</span>
                      <span className="font-bold text-red-600 dark:text-red-400">{div.offRoadPercent}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 3: AC-150 HIGH-DENSITY BUS STOPS --- */}
      {activeTab === "stops" && (
        <div className="flex flex-col gap-4">
          
          {/* Stop Search Input */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={stopSearch}
              onChange={(e) => setStopSearch(e.target.value)}
              placeholder="Search 364 stops or bus routes (e.g. Yelahanka, 55-B, 401K)..."
              className="w-full bg-slate-100 dark:bg-surface-dark text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-surface-dark text-xs font-semibold focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              Transit Corridors ({filteredStops.length} stops shown)
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
              Total 1,307 Routes Linked
            </span>
          </div>

          {/* Stops List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStops.map((stop) => {
              const isExpanded = expandedStop === stop.name;
              const allRouteEntries = stop.routesMap ? Object.entries(stop.routesMap).sort((a, b) => b[1] - a[1]) : [];

              return (
                <div
                  key={stop.name}
                  className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-4 rounded-2xl shadow-sm transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1 pr-2">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                        <MapPin size={14} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                        {stop.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Lat: {stop.lat.toFixed(4)}, Lon: {stop.lng.toFixed(4)}
                        {stop.boothCodes && stop.boothCodes.length > 0 && ` • Booth: ${stop.boothCodes[0]}`}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/40 px-2 py-0.5 rounded-full text-[10px] font-black block">
                        {stop.dailyTrips} trips/day
                      </span>
                      <span className="text-[9px] text-slate-500 font-bold block mt-1">
                        {stop.routesCount} routes
                      </span>
                    </div>
                  </div>

                  {/* Top Routes Chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {stop.topRoutes.slice(0, 6).map((rt) => (
                      <span 
                        key={rt}
                        className="bg-slate-100 dark:bg-surface-black border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-2 py-0.5 rounded-md text-[10px] font-bold"
                      >
                        {rt}
                      </span>
                    ))}
                    {stop.routesCount > 6 && (
                      <button
                        onClick={() => setExpandedStop(isExpanded ? null : stop.name)}
                        className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold flex items-center gap-0.5 px-1 py-0.5"
                      >
                        {isExpanded ? (
                          <>Hide <ChevronUp size={12} /></>
                        ) : (
                          <>+{stop.routesCount - 6} more <ChevronDown size={12} /></>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Expanded Full Routes List */}
                  {isExpanded && allRouteEntries.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800"
                    >
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-2">
                        All Bus Schedules & Trip Counts:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {allRouteEntries.map(([rCode, trips]) => (
                          <div 
                            key={rCode}
                            className="bg-slate-100 dark:bg-surface-black/80 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px]"
                          >
                            <span className="font-bold text-slate-900 dark:text-white">{rCode}</span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">{trips} trips</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}