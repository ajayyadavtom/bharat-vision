"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MapPin, Bus, TrendingUp, AlertTriangle, CheckCircle2, Siren, ArrowRight, BarChart3 } from "lucide-react";

interface SurgeNode {
  id: string;
  location: string;
  destination: string;
  searchIntentCount: number;
  arrivingCapacity: number;
  deficit: number;
  status: "Monitoring" | "Critical Deficit" | "Resolved";
}

export default function DemandForecastingDashboard() {
  const [nodes, setNodes] = useState<SurgeNode[]>([
    { id: "N-KRM", location: "Koramangala Block 5", destination: "Electronic City", searchIntentCount: 120, arrivingCapacity: 60, deficit: 60, status: "Critical Deficit" },
    { id: "N-YEL", location: "Yelahanka New Town", destination: "Majestic", searchIntentCount: 85, arrivingCapacity: 120, deficit: 0, status: "Monitoring" },
    { id: "N-HSR", location: "HSR Layout Sector 2", destination: "Silk Board", searchIntentCount: 210, arrivingCapacity: 50, deficit: 160, status: "Critical Deficit" },
  ]);

  const [dispatching, setDispatching] = useState<string | null>(null);

  // Simulate real-time intent aggregation (app searches increasing live)
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === "Critical Deficit") {
          // Increment search intent to simulate more users opening the app
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
    
    // Simulate API call to BMTC Depot Dispatch System
    setTimeout(() => {
      setNodes(prev => prev.map(node => 
        node.id === nodeId 
          ? { ...node, arrivingCapacity: node.arrivingCapacity + 120, deficit: 0, status: "Resolved" } 
          : node
      ));
      setDispatching(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen h-full overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 [&>*]:shrink-0">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={14} className="text-indigo-400" />
            <h1 className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold">BMTC Smart City API</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Demand Forecast</h2>
        </div>
        <div className="bg-surface-dark border border-indigo-900 px-3 py-1.5 rounded-xl shadow-md text-right">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">AI Status</span>
          <span className="text-indigo-400 font-black text-xs flex items-center gap-1">
            <Activity size={12} className="animate-pulse" /> Aggregating Intent
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-6 bg-surface-dark p-3 rounded-xl border border-surface-dark">
        This dashboard aggregates live commuter search intent across the Bharat Vision network to predict crowd surges before they happen.
      </p>

      {/* Surge Nodes List */}
      <div className="flex flex-col gap-4">
        <AnimatePresence>
          {nodes.map((node) => (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-3xl border shadow-lg relative overflow-hidden transition-all ${
                node.status === "Critical Deficit" 
                  ? "bg-red-950/20 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]"
                  : node.status === "Resolved"
                  ? "bg-emerald-950/20 border-emerald-500/30"
                  : "bg-surface-dark border-brand-dark"
              }`}
            >
              {/* Background Alert Pulse */}
              {node.status === "Critical Deficit" && (
                <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>
              )}

              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <MapPin size={18} className={node.status === "Critical Deficit" ? "text-red-400" : "text-brand-accent"} />
                    {node.location}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 flex items-center gap-1 mt-1">
                    <ArrowRight size={12} /> Towards {node.destination}
                  </p>
                </div>
                
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full border ${
                  node.status === "Critical Deficit" ? "bg-red-500/20 text-red-400 border-red-500/50" 
                  : node.status === "Resolved" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                  : "bg-surface-black text-gray-400 border-gray-600"
                }`}>
                  {node.status}
                </span>
              </div>

              {/* Data Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-5 relative z-10">
                <div className="bg-surface-black p-3 rounded-xl border border-surface-dark text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Activity size={10} /> App Searches
                  </p>
                  <p className="text-xl font-black text-white">{node.searchIntentCount}</p>
                </div>
                <div className="bg-surface-black p-3 rounded-xl border border-surface-dark text-center">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <Bus size={10} /> Fleet Cap.
                  </p>
                  <p className="text-xl font-black text-white">{node.arrivingCapacity}</p>
                </div>
                <div className={`p-3 rounded-xl border text-center ${
                  node.deficit > 0 ? "bg-red-950/40 border-red-900/50" : "bg-surface-black border-surface-dark"
                }`}>
                  <p className={`text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center justify-center gap-1 ${
                    node.deficit > 0 ? "text-red-400" : "text-gray-500"
                  }`}>
                    <TrendingUp size={10} /> Deficit
                  </p>
                  <p className={`text-xl font-black ${node.deficit > 0 ? "text-red-400" : "text-emerald-400"}`}>
                    {node.deficit > 0 ? `-${node.deficit}` : "0"}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              {node.status === "Critical Deficit" && (
                <button
                  onClick={() => handleDispatch(node.id)}
                  disabled={dispatching === node.id}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-3.5 rounded-xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-10 disabled:opacity-50"
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
                <div className="w-full bg-emerald-950/40 border border-emerald-900 text-emerald-400 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 relative z-10">
                  <CheckCircle2 size={16} /> 2 Standby Buses En Route. Surge Contained.
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}