"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import {
  Navigation,
  Compass,
  Search,
  MapPin,
  ArrowRightLeft,
  Locate,
  Volume2,
  VolumeX,
  X,
  Layers,
  Clock,
  Car,
  Bike,
  Bus,
  Footprints,
  ChevronDown,
  ChevronUp,
  Play,
  Check,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCcw,
  Crosshair,
  Radio,
  ArrowLeft,
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MAPBOX_PUBLIC_TOKEN,
  MAPBOX_STYLES,
  MapboxStyleOption,
  fetchDetailedRoute,
  DetailedRouteResult,
  NavigationStep,
  formatNavDistance,
  formatNavDuration,
} from "@/lib/mapbox";
import { requestBrowserLocation, reverseGeocodeCoordinates } from "@/lib/location";
import { searchBmtcStops, findNearestStop, BmtcStop } from "@/lib/busNavigation";
import Link from "next/link";

// Custom Leaflet Markers
const getStartGpsIcon = () => {
  if (typeof window === "undefined" || !L.divIcon) return undefined as any;
  return L.divIcon({
    className: "google-nav-origin-marker",
    html: `
      <div style="position: relative; width: 26px; height: 26px; display: flex; items-center; justify-content: center;">
        <div style="position: absolute; inset: -4px; background: rgba(59, 130, 246, 0.35); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 22px; height: 22px; background: #2563eb; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 10px rgba(37,99,235,0.8); display: flex; align-items: center; justify-content: center;">
          <div style="width: 7px; height: 7px; background: #ffffff; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

const getDestPinIcon = () => {
  if (typeof window === "undefined" || !L.divIcon) return undefined as any;
  return L.divIcon({
    className: "google-nav-dest-marker",
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <div style="width: 28px; height: 28px; background: #dc2626; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid #ffffff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
          <div style="transform: rotate(45deg); font-size: 13px; line-height: 1; color: #ffffff; font-weight: 900;">★</div>
        </div>
        <div style="width: 8px; height: 3px; background: rgba(0,0,0,0.3); border-radius: 50%; margin-top: 2px;"></div>
      </div>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
  });
};

// Component to smoothly center or fit map to bounds
function MapCameraController({
  routeCoords,
  isNavigating,
  userPos,
  followUser,
}: {
  routeCoords: [number, number][] | null;
  isNavigating: boolean;
  userPos: [number, number] | null;
  followUser: boolean;
}) {
  const map = useMap();
  const prevNavRef = useRef(false);

  useEffect(() => {
    if (isNavigating && userPos && (followUser || !prevNavRef.current)) {
      map.flyTo(userPos, 17, { animate: true, duration: 1.2 });
      prevNavRef.current = true;
    } else if (!isNavigating && routeCoords && routeCoords.length > 1) {
      try {
        const bounds = L.latLngBounds(routeCoords.map((c) => L.latLng(c[0], c[1])));
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16, animate: true });
      } catch (e) {
        // Fallback
      }
      prevNavRef.current = false;
    }
  }, [routeCoords, isNavigating, userPos, followUser, map]);

  return null;
}

// Map Click Handler for Setting Custom Destination
function MapClickHandler({
  onSelectDestCoords,
}: {
  onSelectDestCoords: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onSelectDestCoords([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Popular Transit & Destination Hubs in Bengaluru
const POPULAR_HUBS = [
  { label: "Majestic (KBS)", name: "Kempegowda Bus Station (Majestic)", coords: [12.9781, 77.5695] as [number, number] },
  { label: "Silk Board", name: "Central Silk Board Junction", coords: [12.9172, 77.6228] as [number, number] },
  { label: "Whitefield (ITPL)", name: "Whitefield ITPL Gate", coords: [12.9863, 77.7335] as [number, number] },
  { label: "Electronic City", name: "Electronic City Phase 1", coords: [12.8452, 77.6602] as [number, number] },
  { label: "Airport (KIA)", name: "Kempegowda International Airport", coords: [13.1986, 77.7066] as [number, number] },
  { label: "Indiranagar", name: "Indiranagar 100ft Road", coords: [12.9784, 77.6408] as [number, number] },
  { label: "Koramangala", name: "Koramangala Sony World Signal", coords: [12.9352, 77.6245] as [number, number] },
  { label: "Hebbal", name: "Hebbal Flyover Junction", coords: [13.0358, 77.5970] as [number, number] },
  { label: "Yeshwanthpur", name: "Yeshwanthpur Railway Station", coords: [13.0232, 77.5502] as [number, number] },
  { label: "Jayanagar", name: "Jayanagar 4th Block", coords: [12.9299, 77.5833] as [number, number] },
];

export default function GoogleNavSystem({
  initialOrigin,
  initialDestination,
  onBack,
}: {
  initialOrigin?: { name: string; coords: [number, number] };
  initialDestination?: { name: string; coords: [number, number] };
  onBack?: () => void;
}) {
  // Live GPS state
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [liveLocality, setLiveLocality] = useState<string>("Locating...");
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [followUser, setFollowUser] = useState(true);

  // Origin & Destination state
  const [originName, setOriginName] = useState(initialOrigin?.name || "Your Location");
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(
    initialOrigin?.coords || null
  );
  const [isOriginLive, setIsOriginLive] = useState(true);

  const [destName, setDestName] = useState(
    initialDestination?.name || "Kempegowda Bus Station (Majestic)"
  );
  const [destCoords, setDestCoords] = useState<[number, number]>(
    initialDestination?.coords || [12.9781, 77.5695]
  );

  // Mode: Driving / Two-Wheeler / Transit / Walking
  const [travelMode, setTravelMode] = useState<"driving" | "two_wheeler" | "transit" | "walking">("driving");

  // Autocomplete Suggestions
  const [originSuggestions, setOriginSuggestions] = useState<BmtcStop[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<BmtcStop[]>([]);
  const [activeInputFocus, setActiveInputFocus] = useState<"origin" | "destination" | null>(null);

  // Route calculation & Navigation Data
  const [routeResult, setRouteResult] = useState<DetailedRouteResult | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Navigation HUD Mode
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showStepsSheet, setShowStepsSheet] = useState(false);

  // Map Appearance & Layer Controls
  const [styleKey, setStyleKey] = useState<string>("navigation");
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [tileError, setTileError] = useState(false);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const activeStyle: MapboxStyleOption = MAPBOX_STYLES[styleKey] || MAPBOX_STYLES.navigation;

  // Detect and watch live GPS location
  const syncLiveLocation = useCallback(async () => {
    try {
      const coords = await requestBrowserLocation();
      const pos: [number, number] = [coords.latitude, coords.longitude];
      setUserPos(pos);
      setIsGpsActive(coords.isRealGps);

      const geo = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      setLiveLocality(geo.locality);

      if (isOriginLive) {
        setOriginCoords(pos);
        setOriginName(`Your Location (${geo.locality})`);
      }
    } catch (err) {
      console.warn("GPS sync error, using default Bengaluru coordinates:", err);
      const fallback: [number, number] = [12.9172, 77.6228]; // Central Silk Board
      setUserPos(fallback);
      setLiveLocality("Central Silk Board");
      if (isOriginLive) {
        setOriginCoords(fallback);
        setOriginName("Your Location (Silk Board)");
      }
    }
  }, [isOriginLive]);

  // Initial GPS detection & continuous watch
  useEffect(() => {
    syncLiveLocation();

    if (typeof window !== "undefined" && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserPos(newPos);
          setIsGpsActive(true);
        },
        (err) => console.warn("Watch position error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [syncLiveLocation]);

  // Close search suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setActiveInputFocus(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Route whenever Origin, Destination or Travel Mode changes
  const calculateRoute = useCallback(
    async (fromCoords?: [number, number], toCoords?: [number, number]) => {
      const start = fromCoords || originCoords || userPos;
      const end = toCoords || destCoords;

      if (!start || !end) return;

      setIsLoadingRoute(true);
      try {
        const profile =
          travelMode === "walking"
            ? "walking"
            : travelMode === "two_wheeler"
            ? "cycling"
            : "driving";
        const result = await fetchDetailedRoute(start, end, profile);
        if (result) {
          setRouteResult(result);
          setCurrentStepIndex(0);
        }
      } catch (e) {
        console.warn("Route calculation failed:", e);
      } finally {
        setIsLoadingRoute(false);
      }
    },
    [originCoords, userPos, destCoords, travelMode]
  );

  // Trigger recalculation on coordinate / mode changes
  useEffect(() => {
    if ((originCoords || userPos) && destCoords) {
      calculateRoute();
    }
  }, [originCoords, userPos, destCoords, travelMode, calculateRoute]);

  // Handle Autocomplete for Origin
  const handleOriginChange = (val: string) => {
    setOriginName(val);
    if (val.toLowerCase().includes("live") || val.toLowerCase().includes("your") || val.toLowerCase().includes("current")) {
      setIsOriginLive(true);
      setOriginCoords(userPos);
      setOriginSuggestions([]);
    } else {
      setIsOriginLive(false);
      setOriginSuggestions(searchBmtcStops(val, 5));
    }
  };

  // Handle Autocomplete for Destination
  const handleDestChange = (val: string) => {
    setDestName(val);
    setDestSuggestions(searchBmtcStops(val, 5));
  };

  // Swap Origin and Destination
  const handleSwap = () => {
    const prevOriginName = originName;
    const prevOriginCoords = originCoords || userPos;
    const prevDestName = destName;
    const prevDestCoords = destCoords;

    if (!prevOriginCoords || !prevDestCoords) return;

    setOriginName(prevDestName);
    setOriginCoords(prevDestCoords);
    setIsOriginLive(false);

    setDestName(prevOriginName);
    setDestCoords(prevOriginCoords);

    calculateRoute(prevDestCoords, prevOriginCoords);
  };

  // Set Origin directly to Live Location
  const handleUseLiveLocation = () => {
    setIsOriginLive(true);
    setOriginName(`Your Location (${liveLocality})`);
    if (userPos) {
      setOriginCoords(userPos);
      calculateRoute(userPos, destCoords);
    } else {
      syncLiveLocation();
    }
  };

  // Handle Quick Hub selection
  const handleSelectQuickHub = (hub: typeof POPULAR_HUBS[0]) => {
    setDestName(hub.name);
    setDestCoords(hub.coords);
    calculateRoute(originCoords || userPos || undefined, hub.coords);
  };

  // Handle Tap on Map to Set Destination
  const handleMapClickDest = async (coords: [number, number]) => {
    setDestCoords(coords);
    const nearest = findNearestStop(coords[0], coords[1]);
    const label = `Near ${nearest.name} (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`;
    setDestName(label);
    calculateRoute(originCoords || userPos || undefined, coords);
  };

  // Turn-by-Turn Voice Prompt Announcer
  const speakVoiceInstruction = (text: string) => {
    if (voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Live Navigation HUD
  const startNavigation = () => {
    if (!routeResult || routeResult.steps.length === 0) return;
    setIsNavigating(true);
    setFollowUser(true);
    setCurrentStepIndex(0);
    const firstStep = routeResult.steps[0];
    speakVoiceInstruction(`Starting navigation to ${destName}. In ${formatNavDistance(firstStep.distanceMeters)}, ${firstStep.instruction}.`);
  };

  // Exit Navigation
  const exitNavigation = () => {
    setIsNavigating(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Next / Previous Step in Navigation simulation
  const nextStep = () => {
    if (!routeResult) return;
    if (currentStepIndex < routeResult.steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const st = routeResult.steps[nextIdx];
      speakVoiceInstruction(`In ${formatNavDistance(st.distanceMeters)}, ${st.instruction}.`);
    } else {
      speakVoiceInstruction("You have arrived at your destination.");
    }
  };

  const prevStep = () => {
    if (!routeResult) return;
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      const st = routeResult.steps[prevIdx];
      speakVoiceInstruction(st.instruction);
    }
  };

  // Helper to render maneuver turn icon
  const renderTurnIcon = (type: string, modifier?: string, size = 26) => {
    const mod = (modifier || "").toLowerCase();
    if (type === "arrive") return <Check size={size} className="text-emerald-400" />;
    if (mod.includes("right")) return <CornerUpRight size={size} className="text-white" />;
    if (mod.includes("left")) return <CornerUpLeft size={size} className="text-white" />;
    if (mod.includes("uturn")) return <RotateCcw size={size} className="text-amber-400" />;
    return <ArrowUp size={size} className="text-white" />;
  };

  // Compute Estimated Arrival Time
  const estimatedArrivalTime = useMemo(() => {
    if (!routeResult) return "--:--";
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + routeResult.durationSeconds * 1000);
    return arrivalDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [routeResult]);

  return (
    <div className="relative w-full h-full bg-[#09090b] overflow-hidden flex flex-col font-sans select-none">
      
      {/* ============================================================== */}
      {/* 1. TOP BAR / SEARCH PANEL (WHEN NOT IN FULL NAV HUD MODE) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {!isNavigating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-3 left-3 right-3 lg:left-6 lg:top-6 lg:max-w-md z-[500] pointer-events-none"
          >
            <div
              ref={searchBoxRef}
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-3.5 pointer-events-auto transition-all"
            >
              {/* Header Title with Back Button */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {onBack ? (
                    <button
                      type="button"
                      onClick={onBack}
                      className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Back"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  ) : (
                    <Link
                      href="/"
                      className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Home"
                    >
                      <ArrowLeft size={16} />
                    </Link>
                  )}
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Compass size={14} className="text-blue-500" /> Google Map Navigation
                  </span>
                </div>

                {/* Map Style Selector Pill */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsStyleMenuOpen((p) => !p)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span>{activeStyle.icon}</span>
                    <span>{activeStyle.label}</span>
                    <ChevronDown size={10} />
                  </button>
                  {isStyleMenuOpen && (
                    <div className="absolute top-7 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1 shadow-2xl flex flex-col gap-0.5 min-w-[140px] z-[600]">
                      {Object.values(MAPBOX_STYLES).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setStyleKey(st.id);
                            setIsStyleMenuOpen(false);
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[10px] font-bold text-left ${
                            styleKey === st.id
                              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                              : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span>{st.icon} {st.label}</span>
                          {styleKey === st.id && <span>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dual Input Form: From & To */}
              <div className="relative flex flex-col gap-2">
                {/* Connecting Line Between Origin & Destination */}
                <div className="absolute left-[13px] top-[26px] bottom-[26px] w-0.5 bg-slate-300 dark:bg-slate-700 z-0" />

                {/* ORIGIN INPUT */}
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950/70 border border-blue-400 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0 relative">
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-2.5 py-1.5 focus-within:border-blue-500 transition-colors">
                      <input
                        type="text"
                        value={originName}
                        onChange={(e) => handleOriginChange(e.target.value)}
                        onFocus={() => setActiveInputFocus("origin")}
                        placeholder="Choose starting point or live location..."
                        className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleUseLiveLocation}
                        className={`text-[9px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap transition-all ${
                          isOriginLive
                            ? "bg-blue-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-100"
                        }`}
                        title="Use Live GPS"
                      >
                        <Radio size={9} className="inline mr-1" />
                        Live GPS
                      </button>
                    </div>

                    {/* Autocomplete Origin Dropdown */}
                    {activeInputFocus === "origin" && originSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1 z-50 max-h-48 overflow-y-auto">
                        {originSuggestions.map((s) => (
                          <button
                            key={`orig-${s.id}`}
                            type="button"
                            onClick={() => {
                              setOriginName(s.name);
                              setOriginCoords([s.lat, s.lon]);
                              setIsOriginLive(false);
                              setActiveInputFocus(null);
                              calculateRoute([s.lat, s.lon], destCoords);
                            }}
                            className="w-full text-left p-2 rounded-xl text-xs hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 font-bold cursor-pointer"
                          >
                            <MapPin size={12} className="text-blue-500 shrink-0" />
                            <span className="truncate">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* DESTINATION INPUT */}
                <div className="flex items-center gap-2 relative z-10">
                  <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-950/70 border border-red-400 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0 relative">
                    <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-2.5 py-1.5 focus-within:border-red-500 transition-colors">
                      <input
                        type="text"
                        value={destName}
                        onChange={(e) => handleDestChange(e.target.value)}
                        onFocus={() => setActiveInputFocus("destination")}
                        placeholder="Choose destination..."
                        className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                      />
                      {destName && (
                        <button
                          type="button"
                          onClick={() => setDestName("")}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Autocomplete Destination Dropdown */}
                    {activeInputFocus === "destination" && destSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1 z-50 max-h-48 overflow-y-auto">
                        {destSuggestions.map((s) => (
                          <button
                            key={`dest-${s.id}`}
                            type="button"
                            onClick={() => {
                              setDestName(s.name);
                              setDestCoords([s.lat, s.lon]);
                              setActiveInputFocus(null);
                              calculateRoute(originCoords || userPos || undefined, [s.lat, s.lon]);
                            }}
                            className="w-full text-left p-2 rounded-xl text-xs hover:bg-red-50 dark:hover:bg-slate-800 flex items-center gap-2 font-bold cursor-pointer"
                          >
                            <MapPin size={12} className="text-red-500 shrink-0" />
                            <span className="truncate">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Swap From / To Button */}
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-sm"
                    title="Swap Origin & Destination"
                  >
                    <ArrowRightLeft size={13} />
                  </button>
                </div>
              </div>

              {/* Mode Switcher Tabs (Driving / Two-Wheeler / Transit / Walking) */}
              <div className="flex items-center justify-between gap-1 pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800">
                {[
                  { id: "driving", label: "Drive / Cab", icon: Car },
                  { id: "two_wheeler", label: "Bike", icon: Bike },
                  { id: "transit", label: "Transit", icon: Bus },
                  { id: "walking", label: "Walk", icon: Footprints },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = travelMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTravelMode(mode.id as any)}
                      className={`flex-1 py-1 px-1.5 rounded-xl flex items-center justify-center gap-1 text-[10px] font-black transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={12} />
                      <span className="hidden sm:inline">{mode.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Hub Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 mt-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 shrink-0">Popular:</span>
                {POPULAR_HUBS.slice(0, 6).map((hub) => (
                  <button
                    key={hub.label}
                    type="button"
                    onClick={() => handleSelectQuickHub(hub)}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-slate-700 dark:text-slate-300 hover:text-blue-600 shrink-0 whitespace-nowrap transition-colors"
                  >
                    {hub.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 2. ROUTE SUMMARY & "START" BUTTON (BOTTOM CARD PREVIEW) */}
      {/* ============================================================== */}
      <AnimatePresence>
        {!isNavigating && routeResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-4 left-3 right-3 lg:left-6 lg:bottom-6 lg:max-w-md z-[500] pointer-events-none"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-4 pointer-events-auto">
              {/* Route Summary Row */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {formatNavDuration(routeResult.durationSeconds)}
                    </span>
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      ({formatNavDistance(routeResult.distanceMeters)})
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                    Fastest route now · {routeResult.summary}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-black text-slate-400 block">ETA Arrival</span>
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">{estimatedArrivalTime}</span>
                </div>
              </div>

              {/* Action Buttons: Green Google Maps "Start" & "Steps" Drawer */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={startNavigation}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-95 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play size={15} fill="currentColor" /> Start Navigation
                </button>
                <button
                  type="button"
                  onClick={() => setShowStepsSheet((p) => !p)}
                  className="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Steps ({routeResult.steps.length})</span>
                  {showStepsSheet ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>

              {/* Expandable Step-by-Step Directions */}
              <AnimatePresence>
                {showStepsSheet && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 max-h-56 overflow-y-auto pr-1"
                  >
                    {routeResult.steps.map((step, idx) => (
                      <div key={`step-preview-${idx}`} className="flex items-start gap-2.5 text-xs">
                        <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-slate-600 dark:text-slate-300 font-bold">
                          {renderTurnIcon(step.type, step.modifier, 14)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">{step.instruction}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{step.roadName} · {formatNavDistance(step.distanceMeters)}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {formatNavDuration(step.durationSeconds)}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================== */}
      {/* 3. ACTIVE GOOGLE MAPS TURN-BY-TURN NAVIGATION HUD */}
      {/* ============================================================== */}
      <AnimatePresence>
        {isNavigating && routeResult && routeResult.steps[currentStepIndex] && (
          <>
            {/* Top Green Navigation Header (Google Maps Style) */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="absolute top-3 left-3 right-3 lg:left-6 lg:top-6 lg:max-w-lg z-[600]"
            >
              <div className="bg-[#0f5132] text-white p-4 rounded-3xl shadow-2xl border border-emerald-500/40 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-3">
                  {/* Turn Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0 shadow-inner">
                    {renderTurnIcon(
                      routeResult.steps[currentStepIndex].type,
                      routeResult.steps[currentStepIndex].modifier,
                      30
                    )}
                  </div>

                  {/* Turn Distance & Instruction */}
                  <div className="flex-1 min-w-0">
                    <span className="text-2xl font-black text-white tracking-tight block">
                      In {formatNavDistance(routeResult.steps[currentStepIndex].distanceMeters)}
                    </span>
                    <p className="text-sm font-extrabold text-emerald-100 leading-snug mt-0.5 line-clamp-2">
                      {routeResult.steps[currentStepIndex].instruction}
                    </p>
                    <p className="text-[10px] text-emerald-200/80 font-bold uppercase tracking-wider mt-1">
                      Then continue on {routeResult.steps[currentStepIndex].roadName}
                    </p>
                  </div>

                  {/* Audio Guidance Toggle */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setVoiceEnabled((p) => !p)}
                      className={`p-2.5 rounded-2xl backdrop-blur-md transition-all active:scale-95 ${
                        voiceEnabled ? "bg-white/25 text-white" : "bg-black/30 text-emerald-200"
                      }`}
                      title="Voice directions toggle"
                    >
                      {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                  </div>
                </div>

                {/* Simulation Step Controls */}
                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/20 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
                  >
                    ← Prev Turn
                  </button>
                  <span className="text-emerald-100 font-mono">
                    Step {currentStepIndex + 1} of {routeResult.steps.length}
                  </span>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={currentStepIndex === routeResult.steps.length - 1}
                    className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-40 transition-colors"
                  >
                    Next Turn →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Bottom Navigation Control Bar (Google Maps Style) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="absolute bottom-4 left-3 right-3 lg:left-6 lg:bottom-6 lg:max-w-lg z-[600]"
            >
              <div className="bg-slate-900/95 text-white p-4 rounded-3xl shadow-2xl border border-slate-800 backdrop-blur-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-emerald-400">
                      {formatNavDuration(routeResult.durationSeconds)}
                    </span>
                    <span className="text-sm font-bold text-slate-400">
                      ({formatNavDistance(routeResult.distanceMeters)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300 font-bold mt-0.5">
                    <span>ETA {estimatedArrivalTime}</span>
                    <span>·</span>
                    <span className="text-emerald-400">GPS Locked</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Recenter Button */}
                  <button
                    type="button"
                    onClick={() => setFollowUser(true)}
                    className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-blue-400 active:scale-95 transition-all shadow-md"
                    title="Re-center on Live Location"
                  >
                    <Locate size={20} />
                  </button>
                  {/* Red Circular Exit Button */}
                  <button
                    type="button"
                    onClick={exitNavigation}
                    className="w-11 h-11 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-black active:scale-95 transition-all shadow-lg shadow-rose-600/30"
                    title="Exit Navigation"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating GPS Recenter button when outside navigation */}
      {!isNavigating && (
        <button
          type="button"
          onClick={() => {
            setFollowUser(true);
            if (userPos) {
              setOriginCoords(userPos);
            }
          }}
          className="absolute bottom-24 right-4 z-[400] w-11 h-11 bg-slate-900/90 hover:bg-slate-800 text-blue-400 border border-slate-700 rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer backdrop-blur-md"
          title="Center on Live Location"
        >
          <Locate size={20} className={userPos ? "text-blue-400" : "text-slate-400"} />
        </button>
      )}

      {/* ============================================================== */}
      {/* 4. MAIN INTERACTIVE LEAFLET / MAPBOX MAP */}
      {/* ============================================================== */}
      <div className="w-full h-full flex-1">
        <MapContainer
          center={originCoords || userPos || [12.9716, 77.5946]}
          zoom={13}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          className="w-full h-full bg-[#09090b] z-0"
          zoomControl={false}
        >
          {/* Mapbox High-Definition Tiles with OSM fallback */}
          {!tileError ? (
            <TileLayer
              key={`mapbox-tile-${activeStyle.styleId}`}
              attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              url={`https://api.mapbox.com/styles/v1/mapbox/${activeStyle.styleId}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`}
              tileSize={256}
              maxZoom={22}
              eventHandlers={{
                tileerror: () => setTileError(true),
              }}
            />
          ) : (
            <TileLayer
              key="osm-backup"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          )}

          {/* Smooth Camera Controller */}
          <MapCameraController
            routeCoords={routeResult?.coordinates || null}
            isNavigating={isNavigating}
            userPos={userPos}
            followUser={followUser}
          />

          {/* Tap Map to Set Destination */}
          <MapClickHandler onSelectDestCoords={handleMapClickDest} />

          {/* Live User GPS / Origin Marker */}
          {(originCoords || userPos) && (
            <Marker position={originCoords || userPos!} icon={getStartGpsIcon()}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <span className="text-[9px] uppercase font-bold text-blue-500 block">Starting Point</span>
                  <strong className="text-slate-800 text-sm">{originName}</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Target Destination Marker */}
          {destCoords && (
            <Marker position={destCoords} icon={getDestPinIcon()}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <span className="text-[9px] uppercase font-bold text-red-500 block">Destination</span>
                  <strong className="text-slate-800 text-sm">{destName}</strong>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Real Road Polyline Navigation Route */}
          {routeResult && routeResult.coordinates.length > 0 && (
            <>
              {/* Outer Casing */}
              <Polyline
                positions={routeResult.coordinates}
                color="#0f172a"
                weight={9}
                opacity={0.8}
              />
              {/* Vibrant Google Maps Blue Core */}
              <Polyline
                positions={routeResult.coordinates}
                color="#1a73e8"
                weight={6}
                opacity={1}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
