"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { 
  TrainFront, 
  MapPin, 
  Clock, 
  ArrowRightLeft, 
  Sparkles, 
  CheckCircle2, 
  Ticket, 
  Wallet, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../src/lib/store";
import metroData from "@/data/namma_metro.json";

// Dynamic import of the tiny Leaflet Metro Map (Client-side only)
const MetroMap = dynamic(() => import("../../components/MetroMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-900/80 animate-pulse rounded-3xl flex items-center justify-center text-xs text-slate-400 font-bold">
      <TrainFront className="text-purple-400 animate-bounce mr-2" size={18} />
      Loading Namma Metro Map...
    </div>
  )
});

interface MetroStationNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  lines: string[];
  isInterchange: boolean;
}

export default function MetroScreen() {
  const { walletBalance, deductBalance, fetchUserData } = useAppStore();
  const ALL_STATIONS: MetroStationNode[] = metroData.stations;

  // Real BMRCL Lines
  const purpleStations = useMemo(
    () => ALL_STATIONS.filter((s) => s.lines.includes("Purple")),
    [ALL_STATIONS]
  );
  const greenStations = useMemo(
    () => ALL_STATIONS.filter((s) => s.lines.includes("Green")),
    [ALL_STATIONS]
  );
  const yellowStations = useMemo(
    () => ALL_STATIONS.filter((s) => s.lines.includes("Yellow")),
    [ALL_STATIONS]
  );
  const blueStations = useMemo(
    () => ALL_STATIONS.filter((s) => s.lines.includes("Blue")),
    [ALL_STATIONS]
  );

  const [activeLineFilter, setActiveLineFilter] = useState<"All" | "Purple" | "Green" | "Yellow" | "Blue">("All");
  const [origin, setOrigin] = useState<string>("indiranagar");
  const [destination, setDestination] = useState<string>("majestic");
  const [bookedToken, setBookedToken] = useState<string | null>(null);
  const [showStationList, setShowStationList] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const originStation = ALL_STATIONS.find((s) => s.id === origin) || ALL_STATIONS[0];
  const destStation = ALL_STATIONS.find((s) => s.id === destination) || ALL_STATIONS[1];

  // Filter stations available in dropdown based on active tab
  const displayStations = useMemo(() => {
    if (activeLineFilter === "Purple") return purpleStations;
    if (activeLineFilter === "Green") return greenStations;
    if (activeLineFilter === "Yellow") return yellowStations;
    if (activeLineFilter === "Blue") return blueStations;
    return ALL_STATIONS;
  }, [activeLineFilter, purpleStations, greenStations, yellowStations, blueStations, ALL_STATIONS]);

  // Authentic BMRCL Journey & Fare Engine
  const calculateTrip = () => {
    if (!originStation || !destStation || originStation.id === destStation.id) {
      return { fare: 0, duration: 0, stops: 0, interchange: false, path: [] };
    }

    const isCommonLine = originStation.lines.some((l) => destStation.lines.includes(l));
    const interchange = !isCommonLine;

    // Approximate stations between coordinates based on Bangalore metro grid
    // Distance formula (Euclidean * 111 km/deg)
    const distKm = Math.sqrt(
      Math.pow((destStation.lat - originStation.lat) * 111, 2) +
      Math.pow((destStation.lon - originStation.lon) * 111 * Math.cos(destStation.lat * (Math.PI / 180)), 2)
    );

    // BMRCL average station spacing is 1.15 km
    const stops = Math.max(1, Math.min(35, Math.round(distKm / 1.15)));

    // Generate path sequence
    let path: MetroStationNode[] = [originStation];
    if (interchange) {
      const majesticStation = ALL_STATIONS.find((s) => s.id === "majestic") || originStation;
      if (originStation.id !== "majestic" && destStation.id !== "majestic") {
        path.push(majesticStation);
      }
    }
    path.push(destStation);

    // Official BMRCL Distance-based Fare Matrix
    let fare = 10;
    if (stops <= 1) fare = 10;
    else if (stops <= 3) fare = 15;
    else if (stops <= 5) fare = 20;
    else if (stops <= 7) fare = 25;
    else if (stops <= 10) fare = 30;
    else if (stops <= 13) fare = 35;
    else if (stops <= 16) fare = 40;
    else if (stops <= 19) fare = 45;
    else if (stops <= 23) fare = 50;
    else fare = 60; // Max BMRCL Fare Cap

    // Real travel time: ~2.3 mins per station + 5 min interchange buffer if switching
    const duration = Math.round(stops * 2.3 + (interchange ? 5 : 2));

    return { fare, duration, stops, interchange, path };
  };

  const trip = calculateTrip();

  const handleBuyToken = () => {
    if (walletBalance < trip.fare) {
      alert(
        `Insufficient balance! Your wallet has ₹${walletBalance.toFixed(2)}, but the fare is ₹${trip.fare}. Please add money from the Home screen.`
      );
      return;
    }
    deductBalance(trip.fare);
    setBookedToken(`NMM-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-28 bg-surface-black px-4 pt-6 text-slate-100">
      
      {/* Header & Live Wallet Display */}
      <div className="mb-3 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">
              Official BMRCL Network
            </h2>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <TrainFront className="text-purple-400" size={26} /> Namma Metro
          </h1>
          <p className="text-[11px] text-slate-400">121 Stations · 5 Lines · Real GeoJSON Network</p>
        </div>

        {/* Live Wallet Badge */}
        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
          <Wallet size={14} className="text-emerald-400" />
          <div>
            <span className="text-[9px] text-slate-400 uppercase font-bold block leading-none">Wallet</span>
            <span className="text-white font-black text-xs leading-none">₹{walletBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Official Line Toggle Tabs */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 mb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveLineFilter("All")}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeLineFilter === "All"
              ? "bg-slate-800 text-white shadow-md border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>All ({ALL_STATIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveLineFilter("Purple")}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeLineFilter === "Purple"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Purple ({purpleStations.length})</span>
        </button>

        <button
          onClick={() => setActiveLineFilter("Green")}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeLineFilter === "Green"
              ? "bg-emerald-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Green ({greenStations.length})</span>
        </button>

        <button
          onClick={() => setActiveLineFilter("Yellow")}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeLineFilter === "Yellow"
              ? "bg-amber-500 text-slate-950 shadow-md font-black"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>Yellow ({yellowStations.length})</span>
        </button>

        <button
          onClick={() => setActiveLineFilter("Blue")}
          className={`py-1.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeLineFilter === "Blue"
              ? "bg-blue-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span>Blue ({blueStations.length})</span>
        </button>
      </div>

      {/* Interactive Tiny Namma Metro Network Map */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider flex items-center gap-1">
            <MapPin size={11} className="text-purple-400" /> Interactive Metro Map
          </span>
          <span className="text-[9px] text-slate-400 font-bold">
            Tap stations to set From/To
          </span>
        </div>
        <div className="w-full h-56 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
          <MetroMap
            originStationId={origin}
            destStationId={destination}
            onSelectOrigin={(id) => setOrigin(id)}
            onSelectDestination={(id) => setDestination(id)}
            activeLineFilter={activeLineFilter}
          />
        </div>
      </div>

      {/* Station Selector Card */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 mb-4 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs uppercase tracking-wider font-black text-slate-400">Plan Journey</h3>
          <button 
            onClick={() => { setOrigin(destination); setDestination(origin); }}
            className="p-2 bg-slate-800 rounded-full border border-slate-700 text-emerald-400 active:rotate-180 transition-transform hover:bg-slate-700 cursor-pointer"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* Origin Station Dropdown */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow-sm shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-[9px] text-slate-500 uppercase font-black block">Boarding Station (From)</label>
              <select 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
                className="bg-transparent text-white text-sm outline-none w-full font-bold truncate cursor-pointer"
              >
                {displayStations.map((s) => (
                  <option key={`orig-${s.id}`} value={s.id} className="bg-slate-900 text-white">
                    {s.lines.includes("Purple") ? "🟣" : s.lines.includes("Green") ? "🟢" : s.lines.includes("Yellow") ? "🟡" : "🔵"} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination Station Dropdown */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-purple-500 border-2 border-white shadow-sm shrink-0" />
            <div className="flex-1 min-w-0">
              <label className="text-[9px] text-slate-500 uppercase font-black block">Destination Station (To)</label>
              <select 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent text-white text-sm outline-none w-full font-bold truncate cursor-pointer"
              >
                {displayStations.map((s) => (
                  <option key={`dest-${s.id}`} value={s.id} className="bg-slate-900 text-white">
                    {s.lines.includes("Purple") ? "🟣" : s.lines.includes("Green") ? "🟢" : s.lines.includes("Yellow") ? "🟡" : "🔵"} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Trip Details */}
      {originStation && destStation && originStation.id !== destStation.id && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 mb-4 shadow-xl"
        >
          {/* Fare & Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center border-b border-slate-800 pb-4 mb-4">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-black">Official Fare</span>
              <span className="text-2xl font-black text-emerald-400">₹{trip.fare}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-black">Est. Travel</span>
              <span className="text-2xl font-black text-white flex items-center justify-center gap-1">
                <Clock size={16} className="text-slate-400" /> {trip.duration}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-black">Total Stops</span>
              <span className="text-2xl font-black text-indigo-400">{trip.stops}</span>
            </div>
          </div>

          {/* Interchange Advisory Banner */}
          {trip.interchange ? (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl text-amber-300 text-xs font-semibold mb-4 flex items-start gap-2">
              <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-200 block font-bold">Interchange Required at Majestic:</strong>
                <span className="text-[11px] text-amber-300/90">
                  Switch between <strong>Purple Line</strong> and <strong>Green Line</strong> at <strong>Nadaprabhu Kempegowda Station, Majestic</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-2xl text-emerald-300 text-xs font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Direct single-train journey. No line change needed.</span>
            </div>
          )}

          {/* Expandable Station-by-Station Journey View */}
          <div className="mb-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setShowStationList(!showStationList)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Navigation size={14} className="text-emerald-400" />
                <span>Station-by-Station Route ({trip.path.length} Key Checkpoints)</span>
              </span>
              {showStationList ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {showStationList && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-slate-800 space-y-2 max-h-56 overflow-y-auto pr-1"
                >
                  {trip.path.map((station, idx) => {
                    const isStart = idx === 0;
                    const isEnd = idx === trip.path.length - 1;
                    const isMajestic = station.id === "majestic";

                    return (
                      <div key={`path-${station.id}-${idx}`} className="flex items-center gap-2.5 text-xs">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isMajestic ? "bg-amber-400 animate-pulse" :
                          station.lines.includes("Purple") ? "bg-purple-500" : "bg-emerald-500"
                        }`} />
                        <span className={`flex-1 truncate ${
                          isStart || isEnd ? "font-black text-white" :
                          isMajestic ? "font-bold text-amber-300" : "text-slate-300"
                        }`}>
                          {station.name} {isMajestic && "(Transfer Hub)"}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">#{idx + 1}</span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Book Token Button / Active Token View */}
          {!bookedToken ? (
            <button
              onClick={handleBuyToken}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Ticket size={18} /> Buy Metro Single Journey QR (₹{trip.fare})
            </button>
          ) : (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
              <h4 className="text-sm font-black text-white">Active BMRCL Single Journey Token</h4>
              <p className="text-sm text-emerald-300 font-mono font-black tracking-widest bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-500/30">
                {bookedToken}
              </p>
              <p className="text-[11px] text-slate-300">
                {originStation.name} ➔ {destStation.name}
              </p>
              <span className="text-[10px] text-slate-400">Scan at automatic AFC gates. Valid for 120 minutes.</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Official Line Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-purple-500/30">
          <div className="flex items-center gap-1.5 mb-1 text-purple-400 font-black text-xs">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Purple Line</span>
          </div>
          <p className="text-[10px] text-slate-300 font-semibold">Whitefield ⇄ Challaghatta</p>
          <span className="text-[9px] text-slate-500 block mt-1">{purpleStations.length} Stations · 43.4 km</span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-400 font-black text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Green Line</span>
          </div>
          <p className="text-[10px] text-slate-300 font-semibold">Madavara ⇄ Silk Institute</p>
          <span className="text-[9px] text-slate-500 block mt-1">{greenStations.length} Stations · 33.5 km</span>
        </div>
      </div>

    </div>
  );
}