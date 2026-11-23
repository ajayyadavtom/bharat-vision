"use client";

import { useState, useEffect, useRef } from "react";
import { Navigation, Clock, Map as MapIcon, Zap, MapPin, AlertTriangle, Search, ChevronRight, Bus, Layers, Crosshair } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("../../components/LiveMap"), { ssr: false });

import RouteDeviationAI from "../../components/RouteDeviationAI";
import ProximityChime from "../../components/ProximityChime";
import SmartBoardingCard from "../../components/SmartBoardingCard";
import CrowdReportPrompt from "../../components/CrowdReportPrompt";
import SmartTripPlanner from "../../components/SmartTripPlanner";
import { useAppStore } from "@/lib/store";
import { requestBrowserLocation, reverseGeocodeCoordinates } from "@/lib/location";

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

interface LiveFleetVehicle {
  busId: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  speed: number;
  bearing: number;
  origin: string;
  destination: string;
  nextStop: string;
  eta: string;
  etaMinutes: number;
  fare: number;
  occupancy?: number;
  crowdLevel?: string;
  routeId?: string;
  routeName?: string;
}

export default function TrackScreen() {
  const [triggerAnomaly, setTriggerAnomaly] = useState(false);
  // Default to empty busCode so page loads clean with no default route mapping
  const [busCode, setBusCode] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BmtcSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeRouteDetails, setActiveRouteDetails] = useState<BmtcRouteDetails | null>(null);
  const [showAllStops, setShowAllStops] = useState(false);
  const [destination, setDestination] = useState("");

  // Live Multi-Bus Fleet State
  const [liveVehicles, setLiveVehicles] = useState<LiveFleetVehicle[]>([]);
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(null);
  const [isLoadingFleet, setIsLoadingFleet] = useState(false);

  const { userLocation, setUserLocation } = useAppStore();
  const [userLoc, setUserLoc] = useState<[number, number] | null>(
    userLocation?.coords || null
  );
  const [locLabel, setLocLabel] = useState<string>(
    userLocation?.locality || "Central Silk Board"
  );
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleDetectLocation = async () => {
    try {
      setIsDetectingLoc(true);
      const coords = await requestBrowserLocation();
      const geoInfo = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      const newCoords: [number, number] = [coords.latitude, coords.longitude];
      setUserLoc(newCoords);
      setLocLabel(geoInfo.locality);
      setUserLocation({
        coords: newCoords,
        locality: geoInfo.locality,
        city: geoInfo.city || "Bengaluru",
        isRealGps: coords.isRealGps,
        timestamp: Date.now(),
      });
    } catch (e) {
      console.warn("Detect location error in /track:", e);
    } finally {
      setIsDetectingLoc(false);
    }
  };

  // Sync if store location changes or detect on initial mount
  useEffect(() => {
    if (userLocation?.coords) {
      setUserLoc(userLocation.coords);
      setLocLabel(userLocation.locality);
    } else {
      handleDetectLocation();
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

  // Poll real-time BMTC live fleet for the searched bus route every 5 seconds
  useEffect(() => {
    if (!busCode) {
      setLiveVehicles([]);
      setSelectedBusId(null);
      setFocusCoords(null);
      return;
    }

    let isMounted = true;
    async function fetchFleet() {
      try {
        setIsLoadingFleet(true);
        const res = await fetch(`/api/bmtc/live?route=${encodeURIComponent(busCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.vehicles)) {
            setLiveVehicles(data.vehicles);
            setSelectedBusId((current) => {
              if (current && data.vehicles.some((v: any) => v.busId === current)) {
                return current;
              }
              return data.vehicles[0]?.busId || null;
            });
          }
        }
      } catch (err) {
        console.warn("Could not load live BMTC fleet:", err);
      } finally {
        if (isMounted) setIsLoadingFleet(false);
      }
    }

    fetchFleet();
    const interval = setInterval(fetchFleet, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [busCode]);

  const handleSelectBus = (id: string) => {
    setSelectedBusId(id);
    const v = liveVehicles.find((bus) => bus.busId === id);
    if (v) {
      setFocusCoords([v.lat, v.lng]);
    }
  };

  const selectedBus = liveVehicles.find((v) => v.busId === selectedBusId) || liveVehicles[0] || null;

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
    { code: "285H", label: "285H (Koluvarayanahalli ⇄ KR Market)" },
    { code: "500D", label: "500D (Silk Board ⇄ Hebbal)" },
    { code: "335E", label: "335E (Majestic ⇄ Whitefield)" },
    { code: "250", label: "250 (Majestic ⇄ Yelahanka)" },
    { code: "KIA9", label: "KIA-9 (Airport Express)" },
    { code: "KBS3C", label: "KBS-3C (Majestic ⇄ Chandapura)" },
    { code: "401K", label: "401K (Yelahanka ⇄ Kengeri)" },
  ];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 h-[100dvh] lg:h-full overflow-y-auto lg:overflow-hidden no-scrollbar pb-[120px] lg:pb-0 bg-slate-50 dark:bg-slate-950 relative max-w-[1720px] mx-auto w-full lg:px-8 xl:px-12 lg:py-4 lg:gap-6">
      
      {/* LEFT COLUMN: Controls, Search, Stops Timeline & AI Modules */}
      <div className="contents lg:flex lg:flex-col lg:col-span-5 xl:col-span-5 lg:h-full lg:overflow-y-auto no-scrollbar lg:gap-3.5 lg:pr-2">
        
        {/* Header */}
        <div className="order-1 lg:order-none shrink-0 p-4 pt-8 lg:p-0 bg-gradient-to-b from-white dark:from-slate-900 to-transparent lg:bg-transparent flex justify-between items-start">
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
            className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 p-2 rounded-xl flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer"
            title="Simulate Route Deviation Anomaly"
          >
            <AlertTriangle size={18} />
          </button>
        </div>

        {/* Interactive BMTC 4400+ Routes Autocomplete Search */}
        <div className="order-2 lg:order-none shrink-0 px-4 lg:px-0 relative" ref={searchContainerRef}>
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
            <div className="absolute top-14 left-4 right-4 lg:left-0 lg:right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[500] max-h-72 overflow-y-auto no-scrollbar animate-in fade-in zoom-in-95 duration-150">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex justify-between">
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

        {/* Commuter Active Location Bar (Allows user to set origin location) */}
        <div className="order-3 lg:order-none shrink-0 px-4 lg:px-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 min-w-0">
            <span className="text-blue-500 font-black">📍 Your Location:</span>
            <span className="font-extrabold truncate text-slate-800 dark:text-slate-200">
              {locLabel}
            </span>
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingLoc}
              title="Detect Exact GPS Location"
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border transition-all active:scale-95 cursor-pointer shrink-0 ${
                userLocation?.isRealGps
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                  : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500"
              }`}
            >
              <Crosshair size={10} className={isDetectingLoc ? "animate-spin text-emerald-500" : (userLocation?.isRealGps ? "text-emerald-500" : "")} />
              <span>{isDetectingLoc ? "Locating..." : userLocation ? (userLocation.isRealGps ? "GPS Active" : "Live") : "Detect"}</span>
            </button>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[9px] text-slate-400 font-bold hidden sm:inline">Quick set:</span>
            {[
              { label: "Silk Board", coords: [12.9172, 77.6228] as [number, number] },
              { label: "Majestic", coords: [12.9772, 77.5713] as [number, number] },
              { label: "Whitefield", coords: [12.9863, 77.7335] as [number, number] },
              { label: "Hebbal", coords: [13.0358, 77.597] as [number, number] },
            ].map((hub) => (
              <button
                key={hub.label}
                type="button"
                onClick={() => {
                  setUserLoc(hub.coords);
                  setLocLabel(hub.label);
                }}
                className="text-[9px] font-black bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400 px-2 py-0.5 rounded-lg active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                {hub.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Empty State Prompt when no bus number is searched */}
        {!busCode && (
          <div className="order-4 lg:order-none shrink-0 px-4 lg:px-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-3 text-2xl">
                🚌
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                Track Live BMTC Buses
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-sm mx-auto">
                Type any bus number (e.g. <strong>285H</strong>, <strong>500D</strong>, <strong>335E</strong>, <strong>KIA-9</strong>) above to view all active buses on track, where they are coming from, live speed, and next-stop arrival ETAs.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularCorridors.slice(0, 4).map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setBusCode(c.code);
                      setSearchQuery(c.code);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    Track {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIVE FLEET SELECTOR: Displays count of buses on track and lets user pick which bus to track */}
        {busCode && (
          <div className="order-4 lg:order-none shrink-0 px-4 lg:px-0 flex flex-col gap-3">
            {/* Live Buses Count & Status Header */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-3xl p-4 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-300 animate-ping absolute" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-200 relative" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wide flex items-center gap-2">
                    <span>{liveVehicles.length} Live Buses Active</span>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                      Route {busCode}
                    </span>
                  </h3>
                  <p className="text-[11px] text-emerald-100 font-medium">
                    {activeRouteDetails?.origin || "Origin"} ➔ {activeRouteDetails?.destination || "Destination"}
                  </p>
                </div>
              </div>
              <div className="text-right text-[10px] font-bold text-emerald-100 bg-white/10 px-2.5 py-1 rounded-xl">
                {isLoadingFleet ? "Updating..." : "5s Live Telemetry"}
              </div>
            </div>

            {/* Live Buses Selection Grid */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <span>Select Bus on Track ({liveVehicles.length}):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold lowercase">
                  tap to center live GPS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {liveVehicles.map((vehicle) => {
                  const isSelected = vehicle.busId === (selectedBusId || liveVehicles[0]?.busId);
                  return (
                    <button
                      key={vehicle.busId}
                      type="button"
                      onClick={() => handleSelectBus(vehicle.busId)}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/40 shadow-md"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400 hover:shadow-sm"
                      }`}
                    >
                      {/* Top Row: Reg Plate & Speed */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
                          <span className="font-black text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700">
                            {vehicle.busId}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          ⚡ {vehicle.speed} km/h
                        </span>
                      </div>

                      {/* Where it is coming from & heading */}
                      <div className="text-[11px] mb-2 space-y-0.5">
                        <p className="text-slate-600 dark:text-slate-400 font-medium truncate">
                          <strong className="text-emerald-600 dark:text-emerald-400 font-bold">From:</strong> {vehicle.origin}
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 font-medium truncate">
                          <strong className="text-rose-500 font-bold">To:</strong> {vehicle.destination}
                        </p>
                      </div>

                      {/* Next Stop & ETA */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                        <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                          🚏 {vehicle.nextStop}
                        </span>
                        <span className="font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded">
                          ETA {vehicle.eta}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-wider bg-emerald-500 text-white px-1.5 py-0.5 rounded-md shadow-xs">
                          Tracking
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currently Selected Bus Live Telemetry Card */}
            {selectedBus && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚌</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900 dark:text-white">
                        Live Tracking: {selectedBus.busId}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        GPS: {selectedBus.lat.toFixed(4)}° N, {selectedBus.lng.toFixed(4)}° E · Bearing {selectedBus.bearing}°
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg">
                    ● Active Telemetry
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center mb-3">
                  <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Next ETA</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">{selectedBus.eta}</span>
                  </div>
                  <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Speed</span>
                    <span className="text-xs font-black text-slate-900 dark:text-white block mt-0.5">{selectedBus.speed} km/h</span>
                  </div>
                  <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Fare</span>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 block mt-0.5">₹{selectedBus.fare}</span>
                  </div>
                  <div className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block">Crowd</span>
                    <span className="text-xs font-black text-amber-600 dark:text-amber-400 block mt-0.5">{selectedBus.crowdLevel || "Moderate"}</span>
                  </div>
                </div>

                {/* Where it came from & Next stop details */}
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Origin (Departed From):</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedBus.origin}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">Approaching Stop:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{selectedBus.nextStop}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Final Terminus:</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedBus.destination}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Route Alignment & Bus Stops Timeline Drawer */}
        {activeRouteDetails && (
          <div className="order-5 lg:order-none shrink-0 px-4 lg:px-0">
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
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                    {activeRouteDetails.tripCount} Trips/day
                  </span>
                </div>
              </div>

              {/* Stops Timeline Accordion */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
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

        {/* Route Deviation AI Anomaly Engine (10-minute cooldown, transit velocity gated) */}
        <div className="order-6 lg:order-none shrink-0 px-4 lg:px-0">
          <RouteDeviationAI
            externalTrigger={triggerAnomaly}
            resetTrigger={() => setTriggerAnomaly(false)}
            busRouteId={busCode || "500D"}
          />
        </div>

        {/* Proximity Deboarding Chime Engine (Active for all routes, auto-notifies on route switch) */}
        <div className="order-7 lg:order-none shrink-0 px-4 lg:px-0">
          <ProximityChime
            busCode={busCode || "500D"}
            userLocation={userLoc}
            routeStops={activeRouteDetails?.stops}
            routeName={activeRouteDetails?.fullName || activeRouteDetails?.routeNumber}
          />
        </div>

        {/* Real-time Hardware-free Crowd Detection System Prompt */}
        <div className="order-8 lg:order-none shrink-0 px-4 lg:px-0">
          <CrowdReportPrompt busId={busCode || "500D"} availableBuses={["500D", "335E", "250", "KIA9", "KBS3C"]} />
        </div>

        {/* Tokyo & Singapore Crowd Density Engine */}
        <div className="order-9 lg:order-none shrink-0 px-4 lg:px-0">
          <SmartBoardingCard />
        </div>

        {/* Real-time Smart vs Cheap Destination Planner (Automated Bus/Walk/Auto/Metro Calculation) */}
        <div className="order-10 lg:order-none shrink-0 px-4 lg:px-0 pb-6 lg:pb-4">
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

      {/* RIGHT COLUMN: The Live Interactive Map (Mapbox Retina + Metro + Bus Stops + Moving Bus) */}
      <div className="order-4 lg:order-none lg:col-span-7 xl:col-span-7 lg:h-full lg:min-h-0 px-4 lg:px-0 my-2 lg:my-0 flex flex-col">
        <div className="w-full h-80 sm:h-96 lg:h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl relative overflow-hidden shadow-lg">
          <LiveMap
            busCode={busCode}
            destination={destination}
            userLocation={userLoc}
            routeStops={activeRouteDetails?.stops}
            routePath={activeRouteDetails?.coordinates}
            initialShowMetro={false}
            initialShowStops={false}
            onUserLocationChange={(newLoc) => setUserLoc(newLoc)}
            vehicles={liveVehicles}
            selectedVehicleId={selectedBusId}
            onSelectVehicle={handleSelectBus}
            focusCoords={focusCoords}
          />
        </div>
      </div>

    </div>
  );
}
