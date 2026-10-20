"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
  Search, 
  Navigation, 
  Bus, 
  TrainFront, 
  Car, 
  Leaf, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Mic, 
  Waves, 
  MapPin, 
  Crosshair, 
  Sparkles, 
  ArrowRightLeft, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Layers,
  X,
  Radio
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "@/components/WeatherWidget";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { fetchMapboxRoute } from "@/lib/mapbox";
import { 
  calculateBestBusSuggestion, 
  searchBmtcStops, 
  findNearestStop, 
  BestBusSuggestionResult, 
  BmtcStop 
} from "@/lib/busNavigation";

// Dynamically import LiveMap (Client-side only)
const LiveMap = dynamic(() => import("../../components/LiveMap"), { ssr: false });

export default function RoutePlannerScreen() {
  const router = useRouter();
  const { addKarma, walletBalance } = useAppStore();

  // User live location state
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [liveLocationAddress, setLiveLocationAddress] = useState<string>("");

  // Input fields
  const [origin, setOrigin] = useState("My Live Location");
  const [destination, setDestination] = useState("Kempegowda Bus Station (Majestic)");
  const [useLiveLocation, setUseLiveLocation] = useState(true);

  // Suggestions & Autocomplete
  const [originSuggestions, setOriginSuggestions] = useState<BmtcStop[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<BmtcStop[]>([]);
  const [activeInputFocus, setActiveInputFocus] = useState<"origin" | "destination" | null>(null);

  // Calculation results
  const [suggestion, setSuggestion] = useState<BestBusSuggestionResult | null>(null);
  const [activeOptionId, setActiveOptionId] = useState<string>("best_bus");
  const [loading, setLoading] = useState(false);
  const [isRainSafe, setIsRainSafe] = useState(false);
  
  // Real-time Turn-by-Turn Navigation mode
  const [isNavigatingLive, setIsNavigatingLive] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [showStopsList, setShowStopsList] = useState(false);

  // Road geometry for LiveMap
  const [simulatedPath, setSimulatedPath] = useState<[number, number][] | null>(null);
  const [routeStops, setRouteStops] = useState<{ name: string; lat: number; lon: number }[]>([]);

  // Namma Kannada Speech Recognition
  const [isListening, setIsListening] = useState(false);
  const [nlpStatus, setNlpStatus] = useState<string>("");

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Popular Quick-Destination shortcuts
  const popularDestinations = [
    { label: "Silk Board", query: "Central Silk Board" },
    { label: "Majestic", query: "Kempegowda Bus Station (Majestic)" },
    { label: "Whitefield", query: "Whitefield ITPL" },
    { label: "Electronic City", query: "Electronic City Phase 1" },
    { label: "Airport", query: "Kempegowda International Airport (KIA)" },
    { label: "Indiranagar", query: "Indiranagar 100ft Road" },
    { label: "Koramangala", query: "Koramangala Sony World Signal" },
    { label: "Hebbal", query: "Hebbal Flyover Junction" },
    { label: "Banashankari", query: "Banashankari TTMC" },
    { label: "Yeshwanthpur", query: "Yeshwanthpur Railway Station" }
  ];

  // Request browser geolocation
  const detectLiveLocation = useCallback(() => {
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      setLocatingUser(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setUserLoc(coords);
          setLocatingUser(false);
          const nearest = findNearestStop(coords[0], coords[1]);
          setLiveLocationAddress(`Near ${nearest.name}`);
        },
        (err) => {
          console.warn("Geolocation fallback to central Bengaluru:", err);
          const fallbackCoords: [number, number] = [12.9172, 77.6228]; // Central Silk Board default
          setUserLoc(fallbackCoords);
          setLocatingUser(false);
          const nearest = findNearestStop(fallbackCoords[0], fallbackCoords[1]);
          setLiveLocationAddress(`Near ${nearest.name}`);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  // Initial location detection on mount
  useEffect(() => {
    detectLiveLocation();
  }, [detectLiveLocation]);

  // Click outside listener for autocomplete dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setActiveInputFocus(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autocomplete for Origin
  const handleOriginChange = (val: string) => {
    setOrigin(val);
    if (val.toLowerCase().includes("live") || val.toLowerCase().includes("current")) {
      setUseLiveLocation(true);
      setOriginSuggestions([]);
    } else {
      setUseLiveLocation(false);
      setOriginSuggestions(searchBmtcStops(val, 5));
    }
  };

  // Autocomplete for Destination
  const handleDestChange = (val: string) => {
    setDestination(val);
    setDestSuggestions(searchBmtcStops(val, 5));
  };

  // Execute Route calculation & fetch road-matched polyline
  const calculateRoute = useCallback(async (customOrigin?: string, customDest?: string) => {
    setLoading(true);
    const origQuery = customOrigin !== undefined ? customOrigin : origin;
    const destQuery = customDest !== undefined ? customDest : destination;

    const res = calculateBestBusSuggestion({
      origin: origQuery,
      destination: destQuery,
      userLoc: userLoc
    });

    setSuggestion(res);
    setActiveOptionId("best_bus");

    // Route stops for markers
    const stopsList = [
      { name: res.boardingStop.name, lat: res.boardingStop.lat, lon: res.boardingStop.lon },
      ...res.routeStops,
      { name: res.alightingStop.name, lat: res.alightingStop.lat, lon: res.alightingStop.lon }
    ];
    setRouteStops(stopsList);

    // Fetch real road geometry via Mapbox Directions API
    try {
      const realPath = await fetchMapboxRoute(
        [res.boardingStop.lat, res.boardingStop.lon],
        [res.alightingStop.lat, res.alightingStop.lon]
      );
      if (realPath && realPath.length > 0) {
        setSimulatedPath(realPath);
      } else {
        setSimulatedPath([
          [res.userCoords[0], res.userCoords[1]],
          [res.boardingStop.lat, res.boardingStop.lon],
          [(res.boardingStop.lat + res.alightingStop.lat) / 2, (res.boardingStop.lon + res.alightingStop.lon) / 2],
          [res.alightingStop.lat, res.alightingStop.lon],
          [res.destCoords[0], res.destCoords[1]]
        ]);
      }
    } catch (e) {
      console.warn("Mapbox route fetch error, using direct segment coordinates:", e);
      setSimulatedPath([
        [res.boardingStop.lat, res.boardingStop.lon],
        [res.alightingStop.lat, res.alightingStop.lon]
      ]);
    }

    addKarma(5);
    setLoading(false);
  }, [origin, destination, userLoc, addKarma]);

  // Run initial calculation when user location is resolved or on first load
  useEffect(() => {
    if (userLoc) {
      calculateRoute();
    }
  }, [userLoc, calculateRoute]);

  // Voice Input (Namma Kannada & Indian English)
  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please type your destination.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setNlpStatus("Listening for destination in English or Kannada...");
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setNlpStatus(`Target: '${speechResult}'`);
      setDestination(speechResult);
      setTimeout(() => {
        setIsListening(false);
        calculateRoute(origin, speechResult);
      }, 1000);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setNlpStatus("Error capturing voice. Please type.");
    };

    recognition.start();
  };

  // Swap Origin and Destination
  const handleSwap = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
    setUseLiveLocation(false);
    calculateRoute(destination, tempOrigin);
  };

  // Quick select destination
  const handleSelectQuickDest = (q: string) => {
    setDestination(q);
    calculateRoute(origin, q);
  };

  // Set to Live Location
  const handleSetLiveLocation = () => {
    setUseLiveLocation(true);
    setOrigin("My Live Location");
    detectLiveLocation();
    if (userLoc) {
      calculateRoute("My Live Location", destination);
    }
  };

  // Voice speech announcement for turn-by-turn guidance
  const speakInstruction = (text: string) => {
    if (voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 h-[100dvh] lg:h-full bg-slate-100 dark:bg-[#09090b] relative overflow-hidden text-slate-900 dark:text-slate-100 lg:max-w-[1720px] lg:mx-auto lg:w-full lg:px-10 xl:px-14 lg:py-4">
      
      {/* Top Half: Live Map with Route, Boarding, and GPS Markers */}
      <div className={`absolute top-0 left-0 right-0 lg:static lg:col-start-6 xl:col-start-5 lg:col-span-7 xl:col-span-8 lg:h-[calc(100vh-140px)] lg:min-h-[620px] lg:max-h-[860px] lg:rounded-3xl lg:overflow-hidden lg:shadow-xl transition-all duration-500 ease-in-out ${suggestion ? 'h-[38vh]' : 'h-[52vh]'} z-0`}>
        <LiveMap
          busCode={suggestion?.busCode || "500D"}
          destination={suggestion?.busDestination || destination}
          userLocation={userLoc}
          routeStops={routeStops}
          routePath={simulatedPath}
          initialShowMetro={true}
          initialShowStops={true}
        />
        {/* Blending Gradient */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-slate-100 dark:from-[#09090b] to-transparent z-10 pointer-events-none" />
      </div>

      {/* Floating Active Turn-by-Turn Guidance Banner (When Live Navigation is Active) */}
      <AnimatePresence>
        {isNavigatingLive && suggestion && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 z-40 bg-slate-900/95 text-white backdrop-blur-xl border border-emerald-500/50 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0 animate-pulse text-white font-black text-sm">
                <Bus size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                    Board {suggestion.busCode}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    Departs in {suggestion.nextDepartureMinutes}m
                  </span>
                </div>
                <p className="text-xs font-black truncate text-white mt-0.5">
                  Toward {suggestion.busDestination}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="Toggle voice guidance"
              >
                {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setIsNavigatingLive(false)}
                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black"
              >
                Exit
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Half: Interactive Sheet & Best Bus Suggestion Drawer */}
      <motion.div 
        layout
        className={`absolute bottom-0 left-0 right-0 lg:static lg:col-start-1 lg:col-span-5 xl:col-span-4 lg:h-[calc(100vh-140px)] lg:min-h-[620px] lg:max-h-[860px] lg:rounded-3xl lg:shadow-none bg-slate-100 dark:bg-[#09090b] rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_-15px_40px_rgba(0,0,0,0.6)] z-20 flex flex-col transition-all duration-500 ease-in-out pb-[80px] lg:pb-0 ${
          suggestion ? 'h-[75vh]' : 'h-[62vh]'
        }`}
      >
        {/* Grab Handle */}
        <div className="w-full flex justify-center pt-2.5 pb-1 flex-shrink-0 cursor-grab">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
          
          {/* Section 1: Interactive Origin & Destination Selector Form */}
          <div ref={searchContainerRef} className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mb-3 relative">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Compass size={14} className="text-emerald-500" /> Plan Journey & Auto-Find Bus
              </span>
              
              {/* Swap Origin / Destination Button */}
              <button
                type="button"
                onClick={handleSwap}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Swap From and To"
              >
                <ArrowRightLeft size={13} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 relative">
              {/* Timeline Connector Line */}
              <div className="absolute left-[19px] top-[32px] bottom-[32px] w-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

              {/* Origin / Live Location Input */}
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-center shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="flex-1 min-w-0 relative">
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400">From (Your Location)</label>
                    {useLiveLocation && (
                      <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Radio size={10} className="animate-spin" /> GPS Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 focus-within:border-emerald-500 transition-colors">
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => handleOriginChange(e.target.value)}
                      onFocus={() => setActiveInputFocus("origin")}
                      placeholder="My Live Location or Enter Stop..."
                      className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleSetLiveLocation}
                      className={`text-[9px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap transition-all ${
                        useLiveLocation
                          ? "bg-emerald-500 text-slate-950 font-black"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-950"
                      }`}
                      title="Use GPS Live Location"
                    >
                      {locatingUser ? "Locating..." : "📍 Live Loc"}
                    </button>
                  </div>

                  {/* Autocomplete Origin Dropdown */}
                  {activeInputFocus === "origin" && originSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
                      {originSuggestions.map((s) => (
                        <button
                          key={`orig-sugg-${s.id}`}
                          type="button"
                          onClick={() => {
                            setOrigin(s.name);
                            setUseLiveLocation(false);
                            setActiveInputFocus(null);
                            calculateRoute(s.name, destination);
                          }}
                          className="w-full text-left p-2 rounded-xl text-xs hover:bg-emerald-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <MapPin size={13} className="text-emerald-500 shrink-0" />
                          <span className="truncate">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Destination Input */}
              <div className="flex items-center gap-2.5 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center shrink-0">
                  <MapPin size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0 relative">
                  <label className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 block mb-0.5">To (Destination)</label>
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 focus-within:border-purple-500 transition-colors">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => handleDestChange(e.target.value)}
                      onFocus={() => setActiveInputFocus("destination")}
                      placeholder="Destination (e.g. Majestic, Whitefield, Airport)..."
                      className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isListening
                          ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-purple-500"
                      }`}
                      title="Voice search (Kannada / English)"
                    >
                      <Mic size={14} />
                    </button>
                  </div>

                  {/* Autocomplete Destination Dropdown */}
                  {activeInputFocus === "destination" && destSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-48 overflow-y-auto">
                      {destSuggestions.map((s) => (
                        <button
                          key={`dest-sugg-${s.id}`}
                          type="button"
                          onClick={() => {
                            setDestination(s.name);
                            setActiveInputFocus(null);
                            calculateRoute(origin, s.name);
                          }}
                          className="w-full text-left p-2 rounded-xl text-xs hover:bg-purple-50 dark:hover:bg-slate-800 flex items-center gap-2 cursor-pointer font-bold"
                        >
                          <MapPin size={13} className="text-purple-500 shrink-0" />
                          <span className="truncate">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Voice NLP Status Indicator */}
            {isListening && (
              <div className="mt-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 p-2 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                <Waves size={14} className="animate-bounce" />
                <span className="font-bold">{nlpStatus || "Listening..."}</span>
              </div>
            )}

            {/* Quick Destination Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 shrink-0 mr-1">Quick:</span>
              {popularDestinations.map((pop) => (
                <button
                  key={pop.label}
                  type="button"
                  onClick={() => handleSelectQuickDest(pop.query)}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shrink-0 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {pop.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Best Bus Recommendation Card */}
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-3 relative overflow-hidden"
            >
              {/* Header: Recommended Best Bus */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/30">
                    Auto-Matched Best Bus
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-300">
                  <Clock size={13} className="text-slate-400" />
                  <span>Departs in {suggestion.nextDepartureMinutes}m</span>
                </div>
              </div>

              {/* Primary Bus Recommendation Banner */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-4 rounded-2xl mb-3 shadow-md">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white text-slate-950 font-black text-base px-2.5 py-0.5 rounded-lg shadow-sm">
                        {suggestion.busCode}
                      </span>
                      <span className="text-xs font-extrabold text-emerald-100 uppercase tracking-wide">
                        {suggestion.busFullName.split("(")[0]}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-white leading-tight">
                      Towards {suggestion.busDestination}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white block">₹{suggestion.fareRupees}</span>
                    <span className="text-[10px] text-emerald-100 font-bold">Standard Fare</span>
                  </div>
                </div>

                {/* Sub-Corridor & Live Crowd */}
                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px] font-bold text-emerald-50">
                  <span>Corridor: {suggestion.corridorName.split("⇄")[0]}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full">
                    🟢 {suggestion.crowdLevel} Crowd ({suggestion.occupancyPercent}% full)
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 mb-3.5">
                <div>
                  <span className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 block">Total Time</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-center gap-0.5">
                    {suggestion.totalDurationMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 block">Bus Stops</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                    {suggestion.stopsCount}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 block">First Walk</span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                    {suggestion.walkToBoardingMinutes}m
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 block">CO₂ Saved</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-0.5">
                    <Leaf size={11} /> {suggestion.carbonSavedGrams}g
                  </span>
                </div>
              </div>

              {/* Boarding and Alighting Stop Advisory */}
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 mb-3.5 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Boarding Bus Stop</span>
                    <strong className="text-slate-900 dark:text-white truncate block">{suggestion.boardingStop.name}</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Walk {suggestion.walkToBoardingMeters}m ({suggestion.walkToBoardingMinutes} min) from your location</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black block">Alighting Bus Stop</span>
                    <strong className="text-slate-900 dark:text-white truncate block">{suggestion.alightingStop.name}</strong>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">Walk {suggestion.walkFromAlightMeters}m ({suggestion.walkFromAlightMinutes} min) to {suggestion.destinationName}</span>
                  </div>
                </div>
              </div>

              {/* Expandable Step-by-Step Route Guidance */}
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => setShowStopsList(!showStopsList)}
                  className="w-full flex items-center justify-between text-xs font-black text-slate-700 dark:text-slate-300 py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Navigation size={13} className="text-emerald-500" />
                    <span>Turn-by-Turn Navigation Steps ({suggestion.steps.length} Checkpoints)</span>
                  </span>
                  {showStopsList ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>

                <AnimatePresence>
                  {showStopsList && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2.5 max-h-56 overflow-y-auto pr-1"
                    >
                      {suggestion.steps.map((st, idx) => (
                        <div key={st.id} className="flex items-start gap-2.5 text-xs">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[9px] shrink-0 text-white ${
                            st.type === "walk_start" || st.type === "walk_dest"
                              ? "bg-slate-500"
                              : st.type === "board_bus"
                              ? "bg-emerald-500"
                              : st.type === "alight_bus"
                              ? "bg-rose-500"
                              : "bg-indigo-500"
                          }`}>
                            {idx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="font-extrabold text-slate-900 dark:text-white leading-tight">{st.instruction}</p>
                            <p className="text-[10px] text-slate-500 leading-snug mt-0.5">{st.detail}</p>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400 shrink-0">~{st.timeMinutes}m</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons: Start Navigation & Buy Ticket */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNavigatingLive(true);
                    speakInstruction(`Starting live navigation. Walk to ${suggestion.boardingStop.name} to board bus ${suggestion.busCode}.`);
                  }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-2xl shadow-md active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation size={15} /> Start Live Navigation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(`Journey booked! ₹${suggestion.fareRupees} token added to your Pass.`);
                    router.push("/pass");
                  }}
                  className="px-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-black py-3 rounded-2xl shadow-md active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck size={15} /> Book Ticket (₹{suggestion.fareRupees})
                </button>
              </div>
            </motion.div>
          )}

          {/* Section 3: Alternative Transit Modes (Metro, AC Volvo, Feeder) */}
          {suggestion && suggestion.alternatives.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                Alternative Travel Options
              </h4>
              <div className="flex flex-col gap-2">
                {suggestion.alternatives.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => setActiveOptionId(alt.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      activeOptionId === alt.id
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
                        : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-700 dark:text-slate-300">
                        {alt.mode === "Metro" ? <TrainFront size={16} /> : alt.mode === "Auto" ? <Car size={16} /> : <Bus size={16} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900 dark:text-white">{alt.title}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {alt.tag}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400">{alt.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="text-xs font-black text-slate-900 dark:text-white block">{alt.durationMinutes}m</span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold">₹{alt.fareRupees}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Rain-Safe & Weather Adaptive Widget */}
          <WeatherWidget isRainSafe={isRainSafe} setIsRainSafe={setIsRainSafe} locationName={origin} />

        </div>
      </motion.div>
    </div>
  );
}
