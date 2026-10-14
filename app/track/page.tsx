"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation, Clock, Map as MapIcon, Zap, MapPin, AlertTriangle, Search, ChevronRight, Bus, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("../../components/LiveMap"), { ssr: false });

import RouteDeviationAI from "../../components/RouteDeviationAI";
import ProximityChime from "../../components/ProximityChime";
import SmartBoardingCard from "../../components/SmartBoardingCard";
import CrowdReportPrompt from "../../components/CrowdReportPrompt";
import SmartTripPlanner from "../../components/SmartTripPlanner";

interface BmtcSearchResult {
  routeNumber: string;
  cleanCode: string;
  origin: string;
  destination: string;
  stopsCount: number;
  tripCount: number;
}

interface BmtcRouteDetails {
  routeNumber: string;
  cleanCode: string;
  fullName: string;
  origin: string;
  destination: string;
  tripCount: number;
  timetable: string[];
  stopsCount: number;
  stops: { name: string; lat: number; lon: number }[];
  coordinates: [number, number][];
}

export default function TrackScreen() {
  const [triggerAnomaly, setTriggerAnomaly] = useState(false);
  const [busCode, setBusCode] = useState("500D");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BmtcSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeRouteDetails, setActiveRouteDetails] = useState<BmtcRouteDetails | null>(null);
  const [showAllStops, setShowAllStops] = useState(false);
  const [destination, setDestination] = useState("");
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log("Loc error", err)
      );
    }
  }, []);

  // Fetch Route details whenever busCode changes
  useEffect(() => {
    if (!busCode) {
      setActiveRouteDetails(null);
      return;
    }

    let isMounted = true;
    async function loadRoute() {
      try {
        const res = await fetch(`/api/bmtc?bus=${encodeURIComponent(busCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.found && data.route) {
            setActiveRouteDetails(data.route);
          }
        }
      } catch (e) {
        console.warn("Could not load route details:", e);
      }
    }

    loadRoute();
    return () => {
      isMounted = false;
    };
  }, [busCode]);

  // Autocomplete search across all 7,475 BMTC routes
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 1) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/bmtc?search=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
          setShowDropdown(true);
        }
      } catch (e) {
        console.warn("Autocomplete error:", e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRoute = (item: BmtcSearchResult) => {
    setBusCode(item.cleanCode);
    setSearchQuery(item.routeNumber);
    setShowDropdown(false);
  };

  const popularCorridors = [
    { code: "500D", label: "500D (Silk Board ⇄ Hebbal)" },
    { code: "335E", label: "335E (Majestic ⇄ Whitefield)" },
    { code: "250", label: "250 (Majestic ⇄ Yelahanka)" },
    { code: "KIA9", label: "KIA-9 (Airport Express)" },
    { code: "KBS3C", label: "KBS-3C (Majestic ⇄ Chandapura)" },
    { code: "401K", label: "401K (Yelahanka ⇄ Kengeri)" },
  ];

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-[120px] bg-slate-50 dark:bg-slate-950 relative">
      <div className="p-4 pt-8 bg-gradient-to-b from-white dark:from-slate-900 to-transparent flex justify-between items-start">
        <div>
          <h2 className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> BMTC GTFS Live Fleet & Metro
          </h2>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">Live Tracking</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            5,192 Bus Stops · 121 Metro Stations · 4,400+ Routes
          </p>
        </div>

        <button
          onClick={() => setTriggerAnomaly(true)}
          className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 p-2 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
          title="Simulate Route Deviation Anomaly"
        >
          <AlertTriangle size={18} />
        </button>
      </div>

      {/* Route Deviation AI Anomaly Engine (10-minute cooldown, transit velocity gated) */}
      <div className="px-4">
        <RouteDeviationAI
          externalTrigger={triggerAnomaly}
          resetTrigger={() => setTriggerAnomaly(false)}
          busRouteId={busCode || "500D"}
        />
      </div>

      {/* Proximity Deboarding Chime Engine (Active for all routes, auto-notifies on route switch) */}
      <div className="px-4">
        <ProximityChime
          busCode={busCode || "500D"}
          userLocation={userLoc}
          routeStops={activeRouteDetails?.stops}
          routeName={activeRouteDetails?.fullName || activeRouteDetails?.routeNumber}
        />
      </div>

      {/* Interactive BMTC 4400+ Routes Autocomplete Search */}
      <div className="px-4 mb-2 relative" ref={searchContainerRef}>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Bus size={16} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
            placeholder="Search any bus (e.g. 500D, 335E, KIA-9, Majestic)..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none font-bold placeholder-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setShowDropdown(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold px-1.5"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Autocomplete Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute top-14 left-4 right-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[500] max-h-72 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150">
            <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400 tracking-wider flex justify-between">
              <span>Matching BMTC Routes ({searchResults.length})</span>
              <span>Tap to Navigate</span>
            </div>
            {searchResults.map((item) => (
              <button
                key={`${item.routeNumber}-${item.origin}-${item.destination}`}
                type="button"
                onClick={() => handleSelectRoute(item)}
                className="w-full text-left p-3 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between transition-colors cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      {item.routeNumber}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {item.stopsCount} stops · {item.tripCount} trips/day
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-1">
                    {item.origin} ➔ {item.destination}
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </button>
            ))}
          </div>
        )}

        {/* Quick Corridor Selector Pills */}
        <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar py-0.5">
          {popularCorridors.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                setBusCode(item.code);
                setSearchQuery(item.code);
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                busCode === item.code
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* The Live Interactive Map (Mapbox Retina + Metro + Bus Stops) */}
      <div className="px-4 mb-4 mt-1">
        <div className="w-full h-80 sm:h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden shadow-lg">
          <LiveMap
            busCode={busCode}
            destination={destination}
            userLocation={userLoc}
            routeStops={activeRouteDetails?.stops}
            routePath={activeRouteDetails?.coordinates}
            initialShowMetro={true}
            initialShowStops={true}
          />
        </div>
      </div>

      {/* Selected Route Alignment & Bus Stops Timeline Drawer */}
      {activeRouteDetails && (
        <div className="px-4 mb-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-500 text-white font-black text-xs px-2.5 py-0.5 rounded-md">
                    {activeRouteDetails.routeNumber}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Official BMTC GTFS Route
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {activeRouteDetails.fullName || `${activeRouteDetails.origin} ➔ ${activeRouteDetails.destination}`}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                  {activeRouteDetails.stopsCount} Stops
                </span>
                <span className="text-[10px] text-slate-400 font-bold block">
                  {activeRouteDetails.tripCount} Trips/day
                </span>
              </div>
            </div>

            {/* Stops Timeline Accordion */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                Route Stops Navigation
              </span>
              <button
                type="button"
                onClick={() => setShowAllStops(!showAllStops)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-bold cursor-pointer hover:underline"
              >
                {showAllStops ? "Show Less ▲" : `View All (${activeRouteDetails.stopsCount}) ▼`}
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
              {(showAllStops
                ? activeRouteDetails.stops
                : activeRouteDetails.stops.slice(0, 5)
              ).map((stop, idx) => {
                const isStart = idx === 0;
                const isEnd = idx === activeRouteDetails.stops.length - 1;
                return (
                  <div
                    key={`${stop.name}-${idx}`}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 text-white ${
                        isStart ? "bg-emerald-500" : isEnd ? "bg-rose-500" : "bg-sky-500"
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{stop.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {isStart ? "Origin Terminal" : isEnd ? "Destination Terminal" : `Intermediate Stop #${idx + 1}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Real-time Hardware-free Crowd Detection System Prompt */}
      <div className="px-4 mb-3">
        <CrowdReportPrompt busId={busCode || "500D"} availableBuses={["500D", "335E", "250", "KIA9", "KBS3C"]} />
      </div>

      {/* Tokyo & Singapore Crowd Density Engine */}
      <div className="px-4 mb-3">
        <SmartBoardingCard />
      </div>

      {/* Real-time Smart vs Cheap Destination Planner (Automated Bus/Walk/Auto/Metro Calculation) */}
      <div className="px-4 mb-4">
        <SmartTripPlanner
          userLocation={userLoc}
          currentBusCode={busCode}
          onSelectBusRoute={(code) => {
            setBusCode(code);
            setSearchQuery(code);
          }}
        />
      </div>
    </div>
  );
}
