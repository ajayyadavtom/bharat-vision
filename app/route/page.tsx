"use client";

import { useState } from "react";
import { Search, Navigation, Bus, TrainFront, Car, Leaf, Clock, ArrowRight, ShieldCheck, Zap, Mic, Waves, CloudRain, Umbrella, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { calculateAStarRoute, MultiModalRoute } from "../../src/lib/routing";
import { predictSmartETA } from "../../src/lib/etaModel";
import { useAppStore } from "../../src/lib/store";
import OndcTransactionBundle from "../../components/OndcTransactionBundle";

export default function RoutePlannerScreen() {
  const { addKarma } = useAppStore();
  const [origin, setOrigin] = useState("Yelahanka New Town");
  const [destination, setDestination] = useState("Silk Board Junction");
  const [routeResult, setRouteResult] = useState<MultiModalRoute | null>(null);
  const [mlEta, setMlEta] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRainSafe, setIsRainSafe] = useState(false);

  // Namma Kannada NLP State
  const [isListening, setIsListening] = useState(false);
  const [nlpStatus, setNlpStatus] = useState<string>("");

  const handleSearchRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    let result = calculateAStarRoute(origin, destination);

    if (isRainSafe) {
      result = {
        totalDuration: 48,
        totalFare: 65,
        totalCarbon: 1200,
        segments: [
          { mode: "Auto", title: "ONDC Auto to Metro (Covered)", durationMinutes: 10, fareRupees: 40, carbonGrams: 150 },
          { mode: "Metro", title: "Green Line → Purple Line (Underground Interchange)", durationMinutes: 35, fareRupees: 25, carbonGrams: 50 },
          { mode: "Walk", title: "Covered Skywalk to Destination", durationMinutes: 3, fareRupees: 0, carbonGrams: 0 }
        ]
      };
    }

    setRouteResult(result);

    const currentHour = new Date().getHours();
    const isPeak = (currentHour >= 8 && currentHour <= 11) || (currentHour >= 17 && currentHour <= 20);
    const predictedMinutes = await predictSmartETA(12.5, currentHour, isPeak);
    setMlEta(isRainSafe ? result.totalDuration : predictedMinutes + 15);

    addKarma(5);
    setLoading(false);
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    setNlpStatus("Listening to heavy traffic environment...");
    setTimeout(() => {
      setNlpStatus("Raw Acoustic: 'drop me at byapnahali'");
      setTimeout(() => {
        setNlpStatus("NLP Correction: 'Baiyappanahalli Metro Station'");
        setDestination("Baiyappanahalli Metro Station");
        setTimeout(() => {
          setIsListening(false);
          handleSearchRoute();
        }, 1500);
      }, 1500);
    }, 2000);
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Auto': return <Car size={16} className="text-amber-400" />;
      case 'Metro': return <TrainFront size={16} className="text-indigo-400" />;
      case 'Bus': return <Bus size={16} className="text-brand-accent" />;
      case 'Walk': return <Navigation size={16} className="text-emerald-400" />;
      default: return <Navigation size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 [&>*]:shrink-0">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-brand-accent" />
            <h1 className="text-[10px] uppercase tracking-widest text-brand-light font-bold">A* Multi-Modal Engine</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Journey Planner</h2>
        </div>
      </div>

      {/* Live Weather Telemetry */}
      <div className="bg-blue-950/30 border border-blue-900/50 p-4 rounded-3xl mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-900/50 p-2 rounded-full">
            <CloudRain size={24} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Monsoon Downpour</h3>
            <p className="text-[10px] text-blue-300">Waterlogging reported near Silk Board.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-dark border border-brand-base p-5 rounded-3xl shadow-lg mb-6 flex flex-col gap-3 relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
          </div>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-surface-black text-white rounded-xl py-3 pl-8 pr-4 outline-none border border-surface-dark focus:border-brand-base text-xs font-semibold"
            placeholder="Origin"
          />
        </div>

        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-surface-black text-white rounded-xl py-3 pl-8 pr-4 outline-none border border-surface-dark focus:border-brand-base text-xs font-semibold"
              placeholder="Destination"
            />
          </div>
          <button
            type="button"
            onClick={handleVoiceInput}
            className="bg-brand-dark border border-brand-base text-brand-accent px-4 rounded-xl shadow-md active:scale-95 transition-transform flex items-center justify-center"
          >
            <Mic size={18} className={isListening ? "animate-pulse text-red-400" : ""} />
          </button>
        </div>

        {/* Rain-Safe Toggle */}
        <div className="flex items-center justify-between bg-surface-black p-3 rounded-xl border border-surface-dark mt-1">
          <div className="flex items-center gap-2">
            <Umbrella size={16} className={isRainSafe ? "text-blue-400" : "text-gray-500"} />
            <span className={`text-xs font-bold ${isRainSafe ? "text-blue-100" : "text-gray-400"}`}>Enable Rain-Safe Routing</span>
          </div>
          <button
            onClick={() => setIsRainSafe(!isRainSafe)}
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${isRainSafe ? 'bg-blue-500' : 'bg-gray-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isRainSafe ? 'translate-x-5' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <button
          onClick={() => handleSearchRoute()}
          disabled={loading || isListening}
          className="w-full bg-brand-accent text-brand-dark font-black py-3 rounded-xl text-xs shadow-lg active:scale-95 transition-transform mt-1 disabled:opacity-50"
        >
          {loading ? "Calculating Matrix..." : "Find Optimal Route"}
        </button>
      </div>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-surface-dark border border-brand-base p-4 rounded-2xl flex items-center gap-3 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-brand-accent/5 animate-pulse pointer-events-none"></div>
            <div className="bg-brand-dark p-2 rounded-full">
              <Waves size={20} className="text-brand-accent animate-bounce" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-brand-light font-bold">Namma Kannada NLP</p>
              <p className="text-xs text-white font-mono mt-0.5">{nlpStatus}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {routeResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          {isRainSafe && (
            <div className="bg-blue-900/40 border border-blue-500 text-blue-300 text-xs py-2 px-4 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Route optimized for Metro and covered interchanges.</span>
            </div>
          )}

          <div className="bg-gradient-to-br from-brand-base to-brand-dark p-5 rounded-2xl shadow-lg border border-brand-light/20 flex justify-between items-center text-white">
            <div>
              <p className="text-[10px] text-brand-light font-bold uppercase tracking-wider">Optimized Combo</p>
              <h3 className="text-3xl font-black mt-0.5">{mlEta || routeResult.totalDuration} mins</h3>
              <p className="text-[11px] text-brand-light/90 mt-1 flex items-center gap-1">
                <Leaf size={12} /> {routeResult.totalCarbon}g CO₂ saved
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-brand-light font-bold uppercase tracking-wider">Total Fare</p>
              <h3 className="text-3xl font-black mt-0.5">₹{routeResult.totalFare}</h3>
              <p className="text-[10px] text-brand-light/90 mt-1">NCMC Auto-Deduct</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {routeResult.segments.map((seg, idx) => (
              <div key={idx} className="bg-surface-dark p-4 rounded-2xl border border-surface-dark flex items-center justify-between shadow-md">
                <div className="flex items-center gap-3">
                  <div className="bg-surface-black p-3 rounded-xl border border-brand-dark">
                    {getModeIcon(seg.mode)}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider block mb-0.5">
                      {seg.mode} Connection
                    </span>
                    <h4 className="text-xs font-bold text-white leading-tight">{seg.title}</h4>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-xs font-black text-white">{seg.durationMinutes} min</p>
                  <p className="text-[10px] text-gray-400 font-semibold">₹{seg.fareRupees}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ONDC Multi-Modal Bundle Booking */}
          <OndcTransactionBundle />

          <button
            onClick={() => alert("Journey booked successfully! QR tokens loaded to Smart Tickets pass screen.")}
            className="w-full bg-white text-surface-black font-extrabold py-3.5 rounded-2xl text-xs shadow-xl active:scale-95 transition-transform mt-2 flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>Book Multi-Modal Pass (₹{routeResult.totalFare})</span>
          </button>
        </motion.div>
      )}

    </div>
  );
}
