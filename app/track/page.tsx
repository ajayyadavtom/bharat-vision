"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation, Clock, Map as MapIcon, Zap, MapPin, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, Bus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("../../components/LiveMap"), { ssr: false });

import RouteDeviationAI from "../../components/RouteDeviationAI";
import ProximityChime from "../../components/ProximityChime";
import SmartBoardingCard from "../../components/SmartBoardingCard";

interface BmtcRouteInfo {
  routeNumber: string;
  cleanCode: string;
  fullName: string;
  origin: string;
  destination: string;
  tripCount: number;
  timetable: string[];
  stopsCount: number;
  stops: { name: string; lat?: number; lon?: number }[];
  availableDirections: { name: string; origin: string; destination: string }[];
}

export default function TrackScreen() {
  const [triggerAnomaly, setTriggerAnomaly] = useState(false);
  const [busCode, setBusCode] = useState("500D");
  const [destination, setDestination] = useState("");
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);

  // Real BMTC Route state
  const [routeInfo, setRouteInfo] = useState<BmtcRouteInfo | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showStopsList, setShowStopsList] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log("Loc error", err)
      );
    }
  }, []);

  // Fetch full BMTC GTFS route data when busCode changes
  useEffect(() => {
    if (!busCode || busCode.trim().length < 2) {
      setRouteInfo(null);
      return;
    }

    const destParam = destination ? `&destination=${encodeURIComponent(destination)}` : "";
    fetch(`/api/bmtc?bus=${encodeURIComponent(busCode.trim())}${destParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.found && data.route) {
          setRouteInfo(data.route);
        } else {
          setRouteInfo(null);
        }
      })
      .catch(console.error);
  }, [busCode, destination]);

  // Live search autocomplete
  const handleInputChange = (val: string) => {
    setBusCode(val.toUpperCase());
    if (val.trim().length >= 2) {
      setIsSearching(true);
      fetch(`/api/bmtc?search=${encodeURIComponent(val.trim())}`)
        .then((res) => res.json())
        .then((data) => {
          setSearchResults(data.results || []);
        })
        .catch(() => setSearchResults([]));
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const selectSearchResult = (item: any) => {
    setBusCode(item.cleanCode || item.routeNumber);
    setDestination(item.destination || "");
    setIsSearching(false);
    setSearchResults([]);
  };

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
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-24 bg-slate-50 dark:bg-slate-950 relative">
      <div className="p-4 pt-8 bg-gradient-to-b from-white dark:from-slate-900 to-transparent flex justify-between items-start">
        <div>
          <h2 className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> Real BMTC Live Telemetry
          </h2>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Live Tracking</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400">7,475 BMTC routes · 5,211 stops · Real GTFS</p>
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

      {/* Search Input Box with Real GTFS Autocomplete */}
      <div className="px-4 mb-2 relative z-30">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <span className="text-emerald-600 dark:text-emerald-400 text-xs">🚌</span>
          </div>
          <input 
            type="text" 
            value={busCode} 
            onChange={(e) => handleInputChange(e.target.value)} 
            placeholder="Search BMTC Bus (e.g. 500D, 335E, 250, KIA-8)..." 
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none font-bold placeholder-slate-400" 
          />
          {busCode && (
            <button 
              type="button" 
              onClick={() => { setBusCode(""); setRouteInfo(null); }} 
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>

        {/* Live Search Autocomplete Dropdown */}
        <AnimatePresence>
          {isSearching && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-4 right-4 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-60 overflow-y-auto"
            >
              {searchResults.map((item, idx) => (
                <button
                  key={`${item.cleanCode}-${idx}`}
                  type="button"
                  onClick={() => selectSearchResult(item)}
                  className="w-full p-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="text-xs font-black text-emerald-500 mr-2">{item.routeNumber}</span>
                    <span className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                      {item.origin} ➔ {item.destination}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-bold ml-2">
                    {item.stopsCount} stops
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Popular Real BMTC Corridors */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2 pb-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">Popular:</span>
          {["285M", "402B", "500D", "335E", "250", "365", "KIA-8", "401K"].map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => { setBusCode(b); setDestination(""); setIsSearching(false); }}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-all shrink-0 border ${
                busCode === b
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-500"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* The 100% Free Leaflet Dark Navigation Map */}
      <div className="px-4 mb-3 mt-1">
        <div className="w-full h-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden shadow-sm">
          <LiveMap busCode={busCode} destination={destination} userLocation={userLoc} />
        </div>
      </div>

      {/* WHERE IT WILL GO: Real-Time Corridor & Stops Card */}
      {routeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mb-4"
        >
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-black text-xs">
                  🚌
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    Route {routeInfo.routeNumber}
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                      {routeInfo.tripCount} Trips/day
                    </span>
                  </h3>
                </div>
              </div>

              {/* Direction switch toggle if multiple directions available */}
              {routeInfo.availableDirections?.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const otherDir = routeInfo.availableDirections.find(
                      (d) => d.destination !== routeInfo.destination
                    );
                    if (otherDir) setDestination(otherDir.destination);
                  }}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 transition-colors"
                >
                  🔄 Switch Direction
                </button>
              )}
            </div>

            {/* Where It Will Go (Origin to Destination) */}
            <div className="mt-3">
              <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider mb-1.5 flex items-center gap-1">
                <Navigation size={10} /> Where it will go:
              </p>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {routeInfo.origin}
                  </p>
                  <p className="text-[10px] text-slate-500">Starting Station</p>
                </div>
                <ArrowRight size={14} className="text-slate-400 shrink-0 mx-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                    {routeInfo.destination}
                  </p>
                  <p className="text-[10px] text-slate-500">Destination</p>
                </div>
              </div>
            </div>

            {/* Today's Timetable / Departures */}
            {routeInfo.timetable?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1.5 flex items-center gap-1">
                  <Clock size={10} /> Scheduled Departures ({routeInfo.timetable.length} shown):
                </p>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {routeInfo.timetable.slice(0, 10).map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-lg shrink-0"
                    >
                      {t.substring(0, 5)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stops Accordion */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowStopsList(!showStopsList)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors"
              >
                <span>View all {routeInfo.stopsCount} stops along this route</span>
                <ChevronRight
                  size={14}
                  className={`transition-transform ${showStopsList ? "rotate-90" : ""}`}
                />
              </button>

              <AnimatePresence>
                {showStopsList && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 flex flex-col gap-1.5 max-h-56 overflow-y-auto no-scrollbar pl-2 border-l-2 border-emerald-500/40"
                  >
                    {routeInfo.stops.map((stop, idx) => (
                      <div key={idx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <span className="w-4 text-[9px] font-mono text-slate-400">{idx + 1}.</span>
                        <span className="font-medium">{stop.name}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tokyo & Singapore Crowd Density Engine */}
      <div className="px-4">
        <SmartBoardingCard busCode={busCode} routeInfo={routeInfo} />
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
                <MapPin size={12} className="text-slate-900 dark:text-white" />
              </div>
              
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where to? (e.g. Majestic, Silk Board)" className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400" />
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
