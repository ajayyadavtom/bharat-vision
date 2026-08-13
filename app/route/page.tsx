"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Search,
  Navigation,
  Bus,
  TrainFront,
  Car,
  Bike,
  Leaf,
  ArrowRight,
  ShieldCheck,
  Zap,
  Mic,
  Waves,
  CloudRain,
  Umbrella,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { calculateAStarRoute, MultiModalRoute } from "../../src/lib/routing";
import { predictSmartETA } from "../../src/lib/etaModel";
import { useAppStore } from "../../src/lib/store";
import OndcTransactionBundle from "../../components/OndcTransactionBundle";
import BehavioralHabitAI from "../../components/BehavioralHabitAI";
import RouteDeviationAI from "../../components/RouteDeviationAI";

interface TripComparison {
  id: string;
  title: string;
  subtitle: string;
  distanceKm: number;
  timeMinutes: number;
  costRupees: number;
  carbonHint: string;
}

const DEFAULT_ORIGIN = "Yelahanka New Town";
const DEFAULT_DESTINATION = "Silk Board Junction";

function buildComparisons(origin: string, destination: string, route: MultiModalRoute, mlEta: number | null): TripComparison[] {
  const normalizedPair = `${origin} ${destination}`.toLowerCase();
  const isKoramangalaToEc = normalizedPair.includes("koramangala") && normalizedPair.includes("electronic city");

  const baseDistance = isKoramangalaToEc
    ? 14.5
    : Number(Math.max(3, route.totalDuration * 0.35).toFixed(1));

  const metroBusTime = isKoramangalaToEc ? 62 : (mlEta || route.totalDuration);
  const directAutoTime = isKoramangalaToEc ? 38 : Math.max(12, Math.round(baseDistance * 3.2));
  const carTime = isKoramangalaToEc ? 46 : Math.max(14, Math.round(baseDistance * 3.8));
  const cycleTime = isKoramangalaToEc ? 72 : Math.max(20, Math.round(baseDistance * 6.5));

  const metroBusCost = isKoramangalaToEc ? 78 : route.totalFare;
  const directAutoCost = isKoramangalaToEc ? 255 : Math.round(baseDistance * 16 + 20);
  const carCost = isKoramangalaToEc ? 132 : Math.round(baseDistance * 11);
  const cycleCost = isKoramangalaToEc ? 35 : Math.round(baseDistance * 3.5);

  return [
    {
      id: "metro-bus",
      title: "Metro + BMTC",
      subtitle: "A* Multi-modal transit",
      distanceKm: baseDistance,
      timeMinutes: metroBusTime,
      costRupees: metroBusCost,
      carbonHint: "Lowest emissions",
    },
    {
      id: "auto-rapido",
      title: "Direct Auto / Rapido",
      subtitle: "Fast point-to-point",
      distanceKm: baseDistance,
      timeMinutes: directAutoTime,
      costRupees: directAutoCost,
      carbonHint: "Higher emissions",
    },
    {
      id: "car",
      title: "Personal Car",
      subtitle: "Petrol cost estimate",
      distanceKm: baseDistance,
      timeMinutes: carTime,
      costRupees: carCost,
      carbonHint: "Road congestion risk",
    },
    {
      id: "bicycle",
      title: "Bicycle / Yulu",
      subtitle: "Fitness-friendly last-mile",
      distanceKm: baseDistance,
      timeMinutes: cycleTime,
      costRupees: cycleCost,
      carbonHint: "Zero tailpipe emissions",
    },
  ];
}

export default function RoutePlannerScreen() {
  const { addKarma } = useAppStore();
  const [origin, setOrigin] = useState(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState(DEFAULT_DESTINATION);
  const [routeResult, setRouteResult] = useState<MultiModalRoute | null>(null);
  const [mlEta, setMlEta] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRainSafe, setIsRainSafe] = useState(false);
  const [comparisons, setComparisons] = useState<TripComparison[]>([]);

  // Namma Kannada NLP State
  const [isListening, setIsListening] = useState(false);
  const [nlpStatus, setNlpStatus] = useState<string>("");

  const handleSearchRoute = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    let resolvedOrigin = origin.trim();
    let resolvedDestination = destination.trim();

    if (resolvedOrigin.toLowerCase().includes(" to ") && (!resolvedDestination || resolvedDestination === DEFAULT_DESTINATION)) {
      const [originPart, destinationPart] = resolvedOrigin.split(/\bto\b/i);
      if (originPart && destinationPart) {
        resolvedOrigin = originPart.trim();
        resolvedDestination = destinationPart.trim();
        setOrigin(resolvedOrigin);
        setDestination(resolvedDestination);
      }
    }

    let result = calculateAStarRoute(resolvedOrigin, resolvedDestination);

    if (isRainSafe) {
      result = {
        totalDuration: 48,
        totalFare: 65,
        totalCarbon: 1200,
        segments: [
          { mode: "Auto", title: "ONDC Auto to Metro (Covered)", durationMinutes: 10, fareRupees: 40, carbonGrams: 150 },
          { mode: "Metro", title: "Green Line → Purple Line (Underground Interchange)", durationMinutes: 35, fareRupees: 25, carbonGrams: 50 },
          { mode: "Walk", title: "Covered Skywalk to Destination", durationMinutes: 3, fareRupees: 0, carbonGrams: 0 },
        ],
      };
    }

    setRouteResult(result);

    const currentHour = new Date().getHours();
    const isPeak = (currentHour >= 8 && currentHour <= 11) || (currentHour >= 17 && currentHour <= 20);
    const predictedMinutes = await predictSmartETA(12.5, currentHour, isPeak);
    const finalEta = isRainSafe ? result.totalDuration : predictedMinutes + 15;
    setMlEta(finalEta);

    setComparisons(buildComparisons(resolvedOrigin, resolvedDestination, result, finalEta));
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
      case "Auto": return <Car size={16} className="text-amber-400" />;
      case "Metro": return <TrainFront size={16} className="text-indigo-400" />;
      case "Bus": return <Bus size={16} className="text-brand-accent" />;
      case "Walk": return <Navigation size={16} className="text-emerald-400" />;
      default: return <Navigation size={16} className="text-gray-400" />;
    }
  };

  const getComparisonIcon = (id: string) => {
    if (id === "metro-bus") return <TrainFront size={16} className="text-indigo-400" />;
    if (id === "auto-rapido") return <Car size={16} className="text-amber-400" />;
    if (id === "car") return <Navigation size={16} className="text-white" />;
    return <Bike size={16} className="text-emerald-400" />;
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 [&>*]:shrink-0">
      <RouteDeviationAI />
      <BehavioralHabitAI />

      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-brand-accent" />
            <h1 className="text-[10px] uppercase tracking-widest text-brand-light font-bold">A* Multi-Modal Engine</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Journey Planner</h2>
        </div>
        <Link
          href="/chat"
          className="bg-surface-dark border border-brand-dark text-gray-200 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
        >
          <MessageSquare size={12} className="text-brand-accent" /> Vanara Chat
        </Link>
      </div>

      {/* Six-layer AI integration status */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-surface-dark border border-brand-dark rounded-xl p-2 text-[10px] text-gray-300 font-semibold flex items-center gap-2">
          <Search size={12} className="text-brand-accent" /> A* Routing Engine
        </div>
        <div className="bg-surface-dark border border-brand-dark rounded-xl p-2 text-[10px] text-gray-300 font-semibold flex items-center gap-2">
          <Zap size={12} className="text-indigo-400" /> TensorFlow ETA
        </div>
        <div className="bg-surface-dark border border-brand-dark rounded-xl p-2 text-[10px] text-gray-300 font-semibold flex items-center gap-2">
          <Leaf size={12} className="text-emerald-400" /> Habit AI Overlay
        </div>
        <div className="bg-surface-dark border border-brand-dark rounded-xl p-2 text-[10px] text-gray-300 font-semibold flex items-center gap-2">
          <ShieldCheck size={12} className="text-amber-400" /> Deviation AI
        </div>
        <div className="bg-surface-dark border border-brand-dark rounded-xl p-2 text-[10px] text-gray-300 font-semibold flex items-center gap-2">
          <Mic size={12} className="text-red-400" /> NLP Voice Input
        </div>
        <div className="bg-surface-dark border border-brand-dark rounded-xl p-2 text-[10px] text-gray-300 font-semibold flex items-center gap-2">
          <MessageSquare size={12} className="text-brand-light" /> Vanara Chatbot
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
            placeholder="Origin or type 'Koramangala to Electronic City'"
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
            className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${isRainSafe ? "bg-blue-500" : "bg-gray-700"}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isRainSafe ? "translate-x-5" : "translate-x-0"}`}></div>
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

          <div className="bg-surface-dark p-4 rounded-2xl border border-surface-dark">
            <h3 className="text-sm font-bold text-white mb-3">Comparative Trip Planner</h3>
            <div className="grid grid-cols-1 gap-3">
              {comparisons.map((option) => (
                <div key={option.id} className="bg-surface-black p-3 rounded-xl border border-brand-dark/40">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-2">
                      <div className="p-2 rounded-lg bg-surface-dark border border-surface-dark mt-0.5">{getComparisonIcon(option.id)}</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{option.title}</h4>
                        <p className="text-[10px] text-gray-400">{option.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-brand-accent font-bold">{option.carbonHint}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
                    <div className="bg-surface-dark rounded-lg p-2 text-center">
                      <p className="text-gray-500 uppercase tracking-wider">Distance</p>
                      <p className="text-white font-black mt-0.5">{option.distanceKm} km</p>
                    </div>
                    <div className="bg-surface-dark rounded-lg p-2 text-center">
                      <p className="text-gray-500 uppercase tracking-wider">Time</p>
                      <p className="text-white font-black mt-0.5">{option.timeMinutes} min</p>
                    </div>
                    <div className="bg-surface-dark rounded-lg p-2 text-center">
                      <p className="text-gray-500 uppercase tracking-wider">Cost</p>
                      <p className="text-white font-black mt-0.5">₹{option.costRupees}</p>
                    </div>
                  </div>
                </div>
              ))}
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

          <Link
            href="/chat"
            className="w-full bg-surface-dark border border-brand-base text-brand-accent font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2"
          >
            <MessageSquare size={14} /> Ask Vanara to explain this route
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}

    </div>
  );
}
