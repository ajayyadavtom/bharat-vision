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
  ChevronDown, 
  ChevronUp, 
  Navigation,
  Search,
  X,
  Compass
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import metroData from "@/data/namma_metro.json";

// Dynamic import of Leaflet Metro Map (Client-side only)
const MetroMap = dynamic(() => import("@/components/MetroMap"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 dark:bg-slate-900 animate-pulse rounded-3xl flex items-center justify-center text-xs text-slate-500 dark:text-slate-400 font-bold">
      <TrainFront className="text-purple-500 animate-bounce mr-2" size={20} />
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

type LineFilterKey = "All" | "Purple" | "Green" | "Yellow" | "Blue" | "Pink";

// Build Adjacency Graph from metroData.lineSequences
const networkGraph = new Map<string, { to: string; line: string }[]>();

function addEdge(u: string, v: string, line: string) {
  if (!networkGraph.has(u)) networkGraph.set(u, []);
  if (!networkGraph.has(v)) networkGraph.set(v, []);
  networkGraph.get(u)!.push({ to: v, line });
  networkGraph.get(v)!.push({ to: u, line });
}

const sequences = (metroData as { lineSequences?: Record<string, string[]> }).lineSequences || {};
if (sequences.purple) {
  for (let i = 0; i < sequences.purple.length - 1; i++) addEdge(sequences.purple[i], sequences.purple[i + 1], "Purple");
}
if (sequences.green) {
  for (let i = 0; i < sequences.green.length - 1; i++) addEdge(sequences.green[i], sequences.green[i + 1], "Green");
}
if (sequences.yellow) {
  for (let i = 0; i < sequences.yellow.length - 1; i++) addEdge(sequences.yellow[i], sequences.yellow[i + 1], "Yellow");
}
if (sequences.pink) {
  for (let i = 0; i < sequences.pink.length - 1; i++) addEdge(sequences.pink[i], sequences.pink[i + 1], "Pink");
}
if (sequences.blue) {
  for (let i = 0; i < sequences.blue.length - 1; i++) addEdge(sequences.blue[i], sequences.blue[i + 1], "Blue");
}

// Shortest path BFS on Metro Network
function findShortestRoute(startId: string, endId: string) {
  if (startId === endId) return null;
  const queue: { id: string; path: string[]; lines: string[] }[] = [
    { id: startId, path: [startId], lines: [] }
  ];
  const visited = new Set<string>([startId]);

  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.id === endId) {
      return cur;
    }
    const neighbors = networkGraph.get(cur.id) || [];
    for (const n of neighbors) {
      if (!visited.has(n.to)) {
        visited.add(n.to);
        queue.push({
          id: n.to,
          path: [...cur.path, n.to],
          lines: [...cur.lines, n.line]
        });
      }
    }
  }
  return null;
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
  const pinkStations = useMemo(
    () => ALL_STATIONS.filter((s) => s.lines.includes("Pink")),
    [ALL_STATIONS]
  );

  const [activeLineFilter, setActiveLineFilter] = useState<LineFilterKey>("All");
  const [origin, setOrigin] = useState<string>("indiranagar");
  const [destination, setDestination] = useState<string>("majestic");
  const [stationSearch, setStationSearch] = useState<string>("");
  const [bookedToken, setBookedToken] = useState<string | null>(null);
  const [showStationList, setShowStationList] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const originStation = ALL_STATIONS.find((s) => s.id === origin) || ALL_STATIONS[0];
  const destStation = ALL_STATIONS.find((s) => s.id === destination) || ALL_STATIONS[1];

  // Filter stations based on active tab and optional search query
  const displayStations = useMemo(() => {
    let pool = ALL_STATIONS;
    if (activeLineFilter === "Purple") pool = purpleStations;
    else if (activeLineFilter === "Green") pool = greenStations;
    else if (activeLineFilter === "Yellow") pool = yellowStations;
    else if (activeLineFilter === "Blue") pool = blueStations;
    else if (activeLineFilter === "Pink") pool = pinkStations;

    if (stationSearch.trim()) {
      const q = stationSearch.toLowerCase().trim();
      return pool.filter((s) => s.name.toLowerCase().includes(q) || s.lines.some((l) => l.toLowerCase().includes(q)));
    }
    return pool;
  }, [activeLineFilter, purpleStations, greenStations, yellowStations, blueStations, pinkStations, ALL_STATIONS, stationSearch]);

  // Authentic BMRCL Journey & Fare Engine
  const trip = useMemo(() => {
    if (!originStation || !destStation || originStation.id === destStation.id) {
      return { 
        fare: 0, 
        duration: 0, 
        stops: 0, 
        interchange: false, 
        path: [] as MetroStationNode[],
        transferInfo: null as { station: MetroStationNode; fromLine: string; toLine: string } | null,
        mainLine: ""
      };
    }

    const routeResult = findShortestRoute(originStation.id, destStation.id);

    if (routeResult && routeResult.path.length > 1) {
      const pathStations = routeResult.path
        .map((id) => ALL_STATIONS.find((s) => s.id === id))
        .filter((s): s is MetroStationNode => !!s);

      // Detect transfer
      let transferInfo: { station: MetroStationNode; fromLine: string; toLine: string } | null = null;
      for (let i = 0; i < routeResult.lines.length - 1; i++) {
        if (routeResult.lines[i] !== routeResult.lines[i + 1]) {
          const xferStation = ALL_STATIONS.find((s) => s.id === routeResult.path[i + 1]);
          if (xferStation) {
            transferInfo = {
              station: xferStation,
              fromLine: routeResult.lines[i],
              toLine: routeResult.lines[i + 1],
            };
            break;
          }
        }
      }

      const stops = Math.max(1, pathStations.length - 1);
      const interchange = transferInfo !== null;
      const mainLine = routeResult.lines[0] || originStation.lines[0];

      // Official BMRCL Fare Matrix
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
      else fare = 60; // Max cap

      const duration = Math.round(stops * 2.2 + (interchange ? 5 : 2));

      return {
        fare,
        duration,
        stops,
        interchange,
        path: pathStations,
        transferInfo,
        mainLine,
      };
    }

    // Fallback if disconnected
    const distKm = Math.sqrt(
      Math.pow((destStation.lat - originStation.lat) * 111, 2) +
      Math.pow((destStation.lon - originStation.lon) * 111 * Math.cos(destStation.lat * (Math.PI / 180)), 2)
    );
    const stops = Math.max(1, Math.min(35, Math.round(distKm / 1.15)));
    const interchange = !originStation.lines.some((l) => destStation.lines.includes(l));

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
    else fare = 60;

    const duration = Math.round(stops * 2.3 + (interchange ? 5 : 2));
    const path = [originStation, destStation];

    return {
      fare,
      duration,
      stops,
      interchange,
      path,
      transferInfo: null,
      mainLine: originStation.lines[0],
    };
  }, [originStation, destStation, ALL_STATIONS]);

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

  const lineFilters: {
    key: LineFilterKey;
    label: string;
    count: number;
    dotColor: string;
    activeClass: string;
  }[] = [
    {
      key: "All",
      label: "All Lines",
      count: ALL_STATIONS.length,
      dotColor: "",
      activeClass: "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-md",
    },
    {
      key: "Purple",
      label: "Purple",
      count: purpleStations.length,
      dotColor: "bg-purple-500",
      activeClass: "bg-purple-600 text-white shadow-md shadow-purple-600/30",
    },
    {
      key: "Green",
      label: "Green",
      count: greenStations.length,
      dotColor: "bg-emerald-500",
      activeClass: "bg-emerald-600 text-white shadow-md shadow-emerald-600/30",
    },
    {
      key: "Yellow",
      label: "Yellow",
      count: yellowStations.length,
      dotColor: "bg-amber-400",
      activeClass: "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30",
    },
    {
      key: "Blue",
      label: "Blue",
      count: blueStations.length,
      dotColor: "bg-blue-500",
      activeClass: "bg-blue-600 text-white shadow-md shadow-blue-600/30",
    },
    {
      key: "Pink",
      label: "Pink",
      count: pinkStations.length,
      dotColor: "bg-pink-500",
      activeClass: "bg-pink-600 text-white shadow-md shadow-pink-600/30",
    },
  ];

  const popularStations = [
    { id: "majestic", name: "Majestic" },
    { id: "indiranagar", name: "Indiranagar" },
    { id: "mg-road", name: "MG Road" },
    { id: "whitefield", name: "Whitefield" },
    { id: "electronic-city-i", name: "Electronic City" },
    { id: "central-silkboard", name: "Silk Board" },
    { id: "yeshwanthpur", name: "Yeshwanthpur" },
    { id: "jayanagar", name: "Jayanagar" },
  ];

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-[120px] bg-slate-50 dark:bg-surface-black px-4 pt-6 text-slate-900 dark:text-slate-100 [&>*]:shrink-0">
      
      {/* Header & Live Wallet Display */}
      <div className="mb-4 flex justify-between items-start gap-2 shrink-0">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <h2 className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-black">
              Official BMRCL Network
            </h2>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrainFront className="text-purple-600 dark:text-purple-400" size={26} /> Namma Metro
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            121 Stations · 5 Lines · Official GeoJSON Routing
          </p>
        </div>

        {/* Live Wallet Badge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-sm shrink-0">
          <div className="bg-emerald-50 dark:bg-emerald-950/60 p-1.5 rounded-xl">
            <Wallet size={15} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-bold block leading-none">Wallet</span>
            <span className="text-slate-900 dark:text-white font-black text-xs leading-none">₹{walletBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Official Line Toggle Tabs */}
      <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-3.5 overflow-x-auto no-scrollbar shrink-0 min-h-[46px] shadow-xs">
        {lineFilters.map((filter) => {
          const isSelected = activeLineFilter === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveLineFilter(filter.key)}
              className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? filter.activeClass
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {filter.dotColor && <span className={`w-2 h-2 rounded-full ${filter.dotColor}`} />}
              <span>{filter.label} ({filter.count})</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Namma Metro Network Map */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-black uppercase text-purple-700 dark:text-purple-300 tracking-wider flex items-center gap-1.5">
            <MapPin size={13} className="text-purple-600 dark:text-purple-400" /> Interactive Metro Map
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
            Tap stations to set From/To
          </span>
        </div>
        <div className="w-full h-64 bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-md relative">
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
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 mb-4 shadow-sm shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs uppercase tracking-wider font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Compass size={14} className="text-purple-500" /> Plan Journey
          </h3>
          <button 
            type="button"
            onClick={() => { setOrigin(destination); setDestination(origin); }}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 active:rotate-180 transition-transform hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            title="Swap Origin and Destination"
          >
            <ArrowRightLeft size={14} />
          </button>
        </div>

        {/* Quick Search Input */}
        <div className="relative mb-3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={14} />
          </div>
          <input
            type="text"
            value={stationSearch}
            onChange={(e) => setStationSearch(e.target.value)}
            placeholder="Search all 121 stations..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-purple-500 transition-colors text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          {stationSearch && (
            <button
              type="button"
              onClick={() => setStationSearch("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Popular Stations Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-3">
          <span className="text-[10px] text-slate-400 uppercase font-black shrink-0 mr-1">Quick:</span>
          {popularStations.map((pop) => (
            <button
              key={pop.id}
              type="button"
              onClick={() => {
                if (origin !== pop.id) setDestination(pop.id);
                else setOrigin(pop.id);
              }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-950/60 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 shrink-0 transition-colors cursor-pointer"
            >
              {pop.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {/* Origin Dropdown */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black block leading-tight">
                From Station (Boarding)
              </label>
              <select 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white text-sm outline-none w-full font-bold truncate cursor-pointer"
              >
                {displayStations.map((s) => (
                  <option key={`origin-${s.id}`} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {s.lines.includes("Purple") ? "🟣" : s.lines.includes("Green") ? "🟢" : s.lines.includes("Yellow") ? "🟡" : s.lines.includes("Blue") ? "🔵" : "🌸"} {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination Dropdown */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center shrink-0">
              <TrainFront size={16} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black block leading-tight">
                To Station (Destination)
              </label>
              <select 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent text-slate-900 dark:text-white text-sm outline-none w-full font-bold truncate cursor-pointer"
              >
                {displayStations.map((s) => (
                  <option key={`dest-${s.id}`} value={s.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {s.lines.includes("Purple") ? "🟣" : s.lines.includes("Green") ? "🟢" : s.lines.includes("Yellow") ? "🟡" : s.lines.includes("Blue") ? "🔵" : "🌸"} {s.name}
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
          className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 mb-4 shadow-sm shrink-0"
        >
          {/* Fare & Metrics Grid */}
          <div className="grid grid-cols-3 gap-2 text-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-black">Official Fare</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{trip.fare}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-black">Est. Travel</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-1">
                <Clock size={16} className="text-slate-400" /> {trip.duration}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-black">Total Stops</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{trip.stops}</span>
            </div>
          </div>

          {/* Interchange Advisory Banner */}
          {trip.interchange && trip.transferInfo ? (
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 p-3.5 rounded-2xl text-amber-800 dark:text-amber-300 text-xs font-semibold mb-4 flex items-start gap-2.5">
              <Sparkles size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 dark:text-amber-200 block font-bold">
                  Interchange at {trip.transferInfo.station.name}:
                </strong>
                <span className="text-[11px] text-amber-800/90 dark:text-amber-300/90">
                  Switch from <strong>{trip.transferInfo.fromLine} Line</strong> to <strong>{trip.transferInfo.toLine} Line</strong> at <strong>{trip.transferInfo.station.name}</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 p-2.5 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Direct single-train journey. No line transfer needed.</span>
            </div>
          )}

          {/* Expandable Station-by-Station Route View */}
          <div className="mb-4 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowStationList(!showStationList)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Navigation size={14} className="text-emerald-600 dark:text-emerald-400" />
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
                  className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 max-h-64 overflow-y-auto pr-1"
                >
                  {trip.path.map((station, idx) => {
                    const isStart = idx === 0;
                    const isEnd = idx === trip.path.length - 1;
                    const isTransfer = trip.transferInfo?.station.id === station.id;

                    const dotColor = station.lines.includes("Purple")
                      ? "bg-purple-500"
                      : station.lines.includes("Green")
                      ? "bg-emerald-500"
                      : station.lines.includes("Yellow")
                      ? "bg-amber-400"
                      : station.lines.includes("Blue")
                      ? "bg-blue-500"
                      : "bg-pink-500";

                    return (
                      <div key={`path-${station.id}-${idx}`} className="flex items-center gap-2.5 text-xs py-0.5">
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isTransfer ? "bg-amber-400 ring-2 ring-amber-500/50 animate-pulse" : dotColor}`} />
                        <div className="flex-1 min-w-0 flex items-center gap-1.5 truncate">
                          <span className={`truncate ${
                            isStart || isEnd ? "font-black text-slate-900 dark:text-white" :
                            isTransfer ? "font-bold text-amber-600 dark:text-amber-300" : "text-slate-600 dark:text-slate-300"
                          }`}>
                            {station.name}
                          </span>
                          {isStart && (
                            <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                              Board
                            </span>
                          )}
                          {isEnd && (
                            <span className="text-[9px] font-black bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.5 rounded">
                              Alight
                            </span>
                          )}
                          {isTransfer && (
                            <span className="text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              🔀 Transfer: {trip.transferInfo?.toLine} Line
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">#{idx + 1}</span>
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
              type="button"
              onClick={handleBuyToken}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-2xl shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Ticket size={18} /> Buy Metro Single Journey QR (₹{trip.fare})
            </button>
          ) : (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
              <CheckCircle2 size={32} className="text-emerald-500 dark:text-emerald-400" />
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Active BMRCL Single Journey Token</h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-mono font-black tracking-widest bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-300 dark:border-emerald-500/30">
                {bookedToken}
              </p>
              <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                {originStation.name} ➔ {destStation.name}
              </p>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Scan at automatic AFC gates. Valid for 120 minutes.</span>
            </div>
          )}
        </motion.div>
      )}

      {/* Official 5-Line Network Summary Cards */}
      <div className="mb-6 shrink-0">
        <h3 className="text-xs uppercase tracking-wider font-black text-slate-700 dark:text-slate-300 mb-2 px-1">
          Namma Metro Lines Overview
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Purple Line */}
          <div 
            onClick={() => setActiveLineFilter("Purple")}
            className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-purple-200 dark:border-purple-500/30 shadow-xs cursor-pointer hover:border-purple-500 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1 text-purple-700 dark:text-purple-400 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Purple Line</span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">Whitefield ⇄ Challaghatta</p>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-1">{purpleStations.length} Stations · 43.5 km</span>
          </div>

          {/* Green Line */}
          <div 
            onClick={() => setActiveLineFilter("Green")}
            className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 shadow-xs cursor-pointer hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1 text-emerald-700 dark:text-emerald-400 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Green Line</span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">Madavara (BIEC) ⇄ Silk Institute</p>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-1">{greenStations.length} Stations · 33.5 km</span>
          </div>

          {/* Yellow Line */}
          <div 
            onClick={() => setActiveLineFilter("Yellow")}
            className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-amber-200 dark:border-amber-500/30 shadow-xs cursor-pointer hover:border-amber-500 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1 text-amber-700 dark:text-amber-400 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Yellow Line</span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">RV Road ⇄ Bommasandra</p>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-1">{yellowStations.length} Stations · 19.1 km</span>
          </div>

          {/* Blue Line */}
          <div 
            onClick={() => setActiveLineFilter("Blue")}
            className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-blue-200 dark:border-blue-500/30 shadow-xs cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1 text-blue-700 dark:text-blue-400 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Blue Line (ORR)</span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">Silk Board ⇄ KR Puram / Airport</p>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-1">{blueStations.length} Stations · 56.8 km</span>
          </div>

          {/* Pink Line */}
          <div 
            onClick={() => setActiveLineFilter("Pink")}
            className="col-span-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-pink-200 dark:border-pink-500/30 shadow-xs cursor-pointer hover:border-pink-500 transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1 text-pink-700 dark:text-pink-400 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>Pink Line</span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 font-semibold">Kalena Agrahara ⇄ Nagawara</p>
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-1">{pinkStations.length} Stations · 21.4 km</span>
          </div>
        </div>
      </div>

    </div>
  );
}