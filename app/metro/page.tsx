"use client";

import { useState, useEffect, useMemo } from "react";
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
import { getCityData, TransitNode } from "@/lib/cityData";

export default function MetroScreen() {
  const { walletBalance, deductBalance, fetchUserData, currentCity } = useAppStore();
  const cityData = getCityData(currentCity);
  const ALL_STATIONS = cityData.metroStations;

  // Real BMRCL Lines
  const purpleStations = useMemo(
    () => ALL_STATIONS.filter((s) => s.line === "Purple" || s.line === "Both"),
    [ALL_STATIONS]
  );
  const greenStations = useMemo(
    () => ALL_STATIONS.filter((s) => s.line === "Green" || s.line === "Both"),
    [ALL_STATIONS]
  );

  const [activeLineFilter, setActiveLineFilter] = useState<"All" | "Purple" | "Green">("All");
  const [origin, setOrigin] = useState<string>("p-idg"); // Indiranagar by default
  const [destination, setDestination] = useState<string>("interchange-majestic"); // Majestic by default
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
    return ALL_STATIONS;
  }, [activeLineFilter, purpleStations, greenStations, ALL_STATIONS]);

  // Authentic BMRCL Journey & Fare Engine
  const calculateTrip = () => {
    if (!originStation || !destStation || originStation.id === destStation.id) {
      return { fare: 0, duration: 0, stops: 0, interchange: false, path: [] };
    }

    const majesticId = "interchange-majestic";
    const isOrigPurple = originStation.line === "Purple" || originStation.line === "Both";
    const isDestPurple = destStation.line === "Purple" || destStation.line === "Both";
    const isOrigGreen = originStation.line === "Green" || originStation.line === "Both";
    const isDestGreen = destStation.line === "Green" || destStation.line === "Both";

    let stops = 0;
    let interchange = false;
    let path: TransitNode[] = [];

    // Case 1: Both stations on Purple Line
    if (isOrigPurple && isDestPurple && (originStation.line === "Purple" || destStation.line === "Purple")) {
      const idx1 = purpleStations.findIndex((s) => s.id === originStation.id);
      const idx2 = purpleStations.findIndex((s) => s.id === destStation.id);
      stops = Math.abs(idx2 - idx1);
      path = idx1 <= idx2 ? purpleStations.slice(idx1, idx2 + 1) : purpleStations.slice(idx2, idx1 + 1).reverse();
    }
    // Case 2: Both stations on Green Line
    else if (isOrigGreen && isDestGreen && (originStation.line === "Green" || destStation.line === "Green")) {
      const idx1 = greenStations.findIndex((s) => s.id === originStation.id);
      const idx2 = greenStations.findIndex((s) => s.id === destStation.id);
      stops = Math.abs(idx2 - idx1);
      path = idx1 <= idx2 ? greenStations.slice(idx1, idx2 + 1) : greenStations.slice(idx2, idx1 + 1).reverse();
    }
    // Case 3: Cross-line transfer via Majestic Interchange
    else {
      interchange = true;
      if (isOrigPurple) {
        // Purple -> Majestic -> Green
        const p1 = purpleStations.findIndex((s) => s.id === originStation.id);
        const pMaj = purpleStations.findIndex((s) => s.id === majesticId);
        const gMaj = greenStations.findIndex((s) => s.id === majesticId);
        const g2 = greenStations.findIndex((s) => s.id === destStation.id);

        const stopsPart1 = Math.abs(pMaj - p1);
        const stopsPart2 = Math.abs(g2 - gMaj);
        stops = stopsPart1 + stopsPart2;

        const path1 = p1 <= pMaj ? purpleStations.slice(p1, pMaj) : purpleStations.slice(pMaj + 1, p1 + 1).reverse();
        const path2 = gMaj <= g2 ? greenStations.slice(gMaj, g2 + 1) : greenStations.slice(g2, gMaj + 1).reverse();
        path = [...path1, ...path2];
      } else {
        // Green -> Majestic -> Purple
        const g1 = greenStations.findIndex((s) => s.id === originStation.id);
        const gMaj = greenStations.findIndex((s) => s.id === majesticId);
        const pMaj = purpleStations.findIndex((s) => s.id === majesticId);
        const p2 = purpleStations.findIndex((s) => s.id === destStation.id);

        const stopsPart1 = Math.abs(gMaj - g1);
        const stopsPart2 = Math.abs(p2 - pMaj);
        stops = stopsPart1 + stopsPart2;

        const path1 = g1 <= gMaj ? greenStations.slice(g1, gMaj) : greenStations.slice(gMaj + 1, g1 + 1).reverse();
        const path2 = pMaj <= p2 ? purpleStations.slice(pMaj, p2 + 1) : purpleStations.slice(p2, pMaj + 1).reverse();
        path = [...path1, ...path2];
      }
    }

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

    // Real travel time: ~2.3 mins per station + 5 min interchange buffer if switching at Majestic
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
      <div className="mb-4 flex justify-between items-start">
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
          <p className="text-[11px] text-slate-400">Bengaluru Rapid Transit System</p>
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

      {/* Yelahanka Commuter Advisory Banner */}
      <div className="mb-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-2.5 text-amber-300">
        <Info size={16} className="shrink-0 mt-0.5 text-amber-400" />
        <div className="text-[11px] leading-relaxed">
          <strong className="font-bold text-amber-200">Commuter Note for Yelahanka:</strong>
          <span className="text-amber-300/90 block mt-0.5">
            Yelahanka currently does <strong>not</strong> have an operational metro station (Airport Blue Line Phase 2B is under construction). To reach the nearest metro, take <strong>BMTC bus 402B or 401K</strong> to <strong>Yeshwanthpur</strong> or <strong>Nagasandra</strong> (Green Line).
          </span>
        </div>
      </div>

      {/* Official Line Toggle Tabs */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 mb-5">
        <button
          onClick={() => setActiveLineFilter("All")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeLineFilter === "All"
              ? "bg-slate-800 text-white shadow-md border border-slate-700"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span>All ({ALL_STATIONS.length})</span>
        </button>

        <button
          onClick={() => setActiveLineFilter("Purple")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeLineFilter === "Purple"
              ? "bg-purple-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span>Purple (37)</span>
        </button>

        <button
          onClick={() => setActiveLineFilter("Green")}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            activeLineFilter === "Green"
              ? "bg-emerald-600 text-white shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Green (31)</span>
        </button>
      </div>

      {/* Station Selector Card */}
      <div className="bg-slate-900/90 p-4 rounded-3xl border border-slate-800 mb-5 shadow-xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs uppercase tracking-wider font-black text-slate-400">Select Journey</h3>
          <button 
            onClick={() => { setOrigin(destination); setDestination(origin); }}
            className="p-2 bg-slate-800 rounded-full border border-slate-700 text-emerald-400 active:rotate-180 transition-transform hover:bg-slate-700"
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
                    {s.line === "Purple" ? "🟣" : s.line === "Green" ? "🟢" : "🔄"} {s.name}
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
                    {s.line === "Purple" ? "🟣" : s.line === "Green" ? "🟢" : "🔄"} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Calculated Trip Details */}
      {originStation.id !== destStation.id && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 mb-5 shadow-xl"
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
                  Switch between <strong>Purple Line</strong> (Platforms 1 & 2) and <strong>Green Line</strong> (Platforms 3 & 4) at <strong>Nadaprabhu Kempegowda Station, Majestic</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-2xl text-emerald-300 text-xs font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
              <span>Direct single-train journey on {originStation.line === "Purple" ? "Purple Line" : "Green Line"}. No line change needed.</span>
            </div>
          )}

          {/* Expandable Station-by-Station Journey View */}
          <div className="mb-4 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setShowStationList(!showStationList)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white"
            >
              <span className="flex items-center gap-2">
                <Navigation size={14} className="text-emerald-400" />
                <span>Station-by-Station Route ({trip.path.length} Stations)</span>
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
                    const isMajestic = station.id === "interchange-majestic";

                    return (
                      <div key={`path-${station.id}-${idx}`} className="flex items-center gap-2.5 text-xs">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isMajestic ? "bg-amber-400 animate-pulse" :
                          station.line === "Purple" ? "bg-purple-500" : "bg-emerald-500"
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
          <span className="text-[9px] text-slate-500 block mt-1">37 Stations · 43.4 km</span>
        </div>

        <div className="bg-slate-900/60 p-3 rounded-2xl border border-emerald-500/30">
          <div className="flex items-center gap-1.5 mb-1 text-emerald-400 font-black text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Green Line</span>
          </div>
          <p className="text-[10px] text-slate-300 font-semibold">Madavara ⇄ Silk Institute</p>
          <span className="text-[9px] text-slate-500 block mt-1">31 Stations · 33.5 km</span>
        </div>
      </div>

    </div>
  );
}