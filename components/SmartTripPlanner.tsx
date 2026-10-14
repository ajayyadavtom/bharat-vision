"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation,
  MapPin,
  Clock,
  ArrowRight,
  Bus,
  Car,
  TrainFront,
  Footprints,
  Sparkles,
  Coins,
  CheckCircle2,
  Zap,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Ticket,
  Search,
  X,
} from "lucide-react";
import { useAppStore } from "@/lib/store";

interface SmartTripPlannerProps {
  userLocation?: [number, number] | null;
  currentBusCode?: string;
  onSelectBusRoute?: (busCode: string) => void;
}

interface CorridorDestination {
  id: string;
  roadName: string;
  destinationName: string;
  lat: number;
  lng: number;
  primaryBus: string;
  hasMetro: boolean;
  metroLine?: "Purple" | "Green" | "Yellow";
  tag: string;
}

// Bengaluru high-traffic corridors with official GPS hub coordinates
const CORRIDOR_DESTINATIONS: CorridorDestination[] = [
  {
    id: "orr-silkboard",
    roadName: "Outer Ring Road (ORR)",
    destinationName: "Central Silk Board",
    lat: 12.9172,
    lng: 77.6228,
    primaryBus: "500D",
    hasMetro: false,
    tag: "Tech Corridor",
  },
  {
    id: "old-airport-whitefield",
    roadName: "Old Airport Road ⇄ ITPL",
    destinationName: "Whitefield Kadugodi",
    lat: 12.9863,
    lng: 77.7335,
    primaryBus: "335E",
    hasMetro: true,
    metroLine: "Purple",
    tag: "High-Speed Metro",
  },
  {
    id: "hosur-ecity",
    roadName: "Hosur Road Elevated Tollway",
    destinationName: "Electronic City Phase 1",
    lat: 12.8452,
    lng: 77.6602,
    primaryBus: "365",
    hasMetro: false,
    tag: "Express Flyover",
  },
  {
    id: "bellary-hebbal",
    roadName: "Bellary Road (Airport Road)",
    destinationName: "Hebbal Flyover Junction",
    lat: 13.0358,
    lng: 77.597,
    primaryBus: "250",
    hasMetro: false,
    tag: "Airport Corridor",
  },
  {
    id: "majestic-citycenter",
    roadName: "KBS Arterial Corridor",
    destinationName: "Kempegowda Majestic (Interchange)",
    lat: 12.9772,
    lng: 77.5713,
    primaryBus: "250",
    hasMetro: true,
    metroLine: "Purple",
    tag: "Central Interchange",
  },
  {
    id: "mg-road-east",
    roadName: "MG Road / Brigade Road",
    destinationName: "MG Road Metro Station",
    lat: 12.9756,
    lng: 77.6066,
    primaryBus: "335E",
    hasMetro: true,
    metroLine: "Purple",
    tag: "Purple Line",
  },
  {
    id: "tumkur-yeshwantpur",
    roadName: "Tumkur Road Corridor",
    destinationName: "Yeshwantpur Railway Station",
    lat: 13.0232,
    lng: 77.5503,
    primaryBus: "258",
    hasMetro: true,
    metroLine: "Green",
    tag: "Green Line",
  },
];

// Haversine distance in kilometers
function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function SmartTripPlanner({
  userLocation,
  currentBusCode,
  onSelectBusRoute,
}: SmartTripPlannerProps) {
  // Origin Coordinates (defaults to Yelahanka New Town or live GPS)
  const originCoords: [number, number] = userLocation || [13.1007, 77.5963];
  const originName = userLocation ? "Your Current Live Location" : "Yelahanka, Bengaluru";

  const { addRideHistory } = useAppStore();

  // Selected Corridor or Destination
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorDestination>(
    CORRIDOR_DESTINATIONS[0]
  );
  const [customDestinationInput, setCustomDestinationInput] = useState<string>("");
  const [activePlanTab, setActivePlanTab] = useState<"cheapest" | "smart">("smart");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  // Sync if currentBusCode matches a corridor
  useEffect(() => {
    if (currentBusCode) {
      const match = CORRIDOR_DESTINATIONS.find(
        (c) => c.primaryBus.toLowerCase() === currentBusCode.toLowerCase()
      );
      if (match) setSelectedCorridor(match);
    }
  }, [currentBusCode]);

  // Real-time Calculation Engine: computes distance, time, and fares for BOTH options
  const planCalculations = useMemo(() => {
    // 1. Calculate actual distance in kilometers
    const distanceKm = Math.max(
      3.5,
      Math.round(
        calculateHaversineKm(
          originCoords[0],
          originCoords[1],
          selectedCorridor.lat,
          selectedCorridor.lng
        ) * 10
      ) / 10
    );

    // 2. OPTION 1: "Cheapest Route" (Direct BMTC Bus + Short Walk)
    // Bus travels at ~22 km/h surface speed + 10 mins walking & boarding
    const busTimeMin = Math.round((distanceKm / 22) * 60) + 12;
    // BMTC Stage fare: ₹15 base + ₹5 per 5km, capped at ₹30
    const busFare = Math.min(30, Math.max(15, 15 + Math.floor(distanceKm / 5) * 5));

    const cheapestPlan = {
      id: "cheapest",
      title: "Cheapest: Direct Bus",
      subtitle: "Maximum Savings · Zero Surge · Shakti Scheme Friendly",
      totalTimeMinutes: busTimeMin,
      totalFareRupees: busFare,
      carbonSavedGrams: Math.round(distanceKm * 95),
      busRoute: selectedCorridor.primaryBus,
      segments: [
        {
          mode: "Walk" as const,
          title: `Walk 350m to nearest bus boarding stop`,
          duration: 5,
          fare: 0,
          color: "text-slate-500",
          bg: "bg-slate-100 dark:bg-slate-800",
        },
        {
          mode: "Bus" as const,
          title: `Direct BMTC Route ${selectedCorridor.primaryBus} along ${selectedCorridor.roadName}`,
          duration: busTimeMin - 10,
          fare: busFare,
          color: "text-indigo-600 dark:text-indigo-400",
          bg: "bg-indigo-100 dark:bg-indigo-900/40",
          details: `Direct transit to ${selectedCorridor.destinationName}. Frequency: every 6-8 mins. Free for Shakti pass / ₹${busFare} ticket.`,
        },
        {
          mode: "Walk" as const,
          title: `Short walk to final destination`,
          duration: 5,
          fare: 0,
          color: "text-slate-500",
          bg: "bg-slate-100 dark:bg-slate-800",
        },
      ],
    };

    // 3. OPTION 2: "Smart / Fastest Route" (First-Mile ONDC Auto + Rapid Metro / Express Flyover + Walk)
    // Rapid transit (Metro/Flyover) travels at ~42 km/h + 6 min auto connection
    const smartTimeMin = Math.max(
      18,
      Math.round((distanceKm / 42) * 60) + 8
    );
    // First-mile ONDC Auto (₹35) + Metro / Flyover ticket (₹25-₹30) = ₹60-₹65
    const firstMileAutoFare = 35;
    const rapidFare = selectedCorridor.hasMetro ? 30 : 25;
    const smartTotalFare = firstMileAutoFare + rapidFare;

    const timeSavedMinutes = Math.max(12, busTimeMin - smartTimeMin);

    const smartPlan = {
      id: "smart",
      title: "Smart: Express Auto + Metro",
      subtitle: `Saves ${timeSavedMinutes} mins · Cost-Efficient Multi-Modal`,
      totalTimeMinutes: smartTimeMin,
      totalFareRupees: smartTotalFare,
      timeSavedMinutes,
      carbonSavedGrams: Math.round(distanceKm * 125),
      segments: [
        {
          mode: "Auto" as const,
          title: "ONDC Open Auto: Doorstep to Rapid Transit Hub",
          duration: 6,
          fare: firstMileAutoFare,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-100 dark:bg-amber-950/40",
          details: "Instant open mobility hail. Guaranteed zero surge pricing via Beckn network.",
        },
        {
          mode: selectedCorridor.hasMetro ? ("Metro" as const) : ("Bus" as const),
          title: selectedCorridor.hasMetro
            ? `Namma Metro ${selectedCorridor.metroLine || "Purple"} Line (Bypasses Surface Traffic)`
            : `BMTC Vajra Express ${selectedCorridor.primaryBus} via Elevated Flyover`,
          duration: smartTimeMin - 10,
          fare: rapidFare,
          color: selectedCorridor.hasMetro
            ? "text-purple-600 dark:text-purple-400"
            : "text-emerald-600 dark:text-emerald-400",
          bg: selectedCorridor.hasMetro
            ? "bg-purple-100 dark:bg-purple-950/40"
            : "bg-emerald-100 dark:bg-emerald-950/40",
          details: `Direct high-speed corridor to ${selectedCorridor.destinationName}. High frequency, automated barrier ticketing.`,
        },
        {
          mode: "Walk" as const,
          title: "Covered Skywalk to Arrival Point",
          duration: 4,
          fare: 0,
          color: "text-slate-500",
          bg: "bg-slate-100 dark:bg-slate-800",
        },
      ],
    };

    return { distanceKm, cheapestPlan, smartPlan, timeSavedMinutes };
  }, [originCoords, selectedCorridor]);

  // Handle clicking a road pill
  const handleSelectCorridor = (corridor: CorridorDestination) => {
    setSelectedCorridor(corridor);
    setCustomDestinationInput("");
    if (onSelectBusRoute) {
      onSelectBusRoute(corridor.primaryBus);
    }
  };

  // Handle Booking Simulation
  const handleBookPlan = (planType: "cheapest" | "smart") => {
    if (planType === "cheapest") {
      if (onSelectBusRoute) {
        onSelectBusRoute(selectedCorridor.primaryBus);
      }

      addRideHistory({
        id: `BMTC-${selectedCorridor.primaryBus}-${Date.now().toString().slice(-4)}`,
        category: "bus",
        type: `BMTC Direct Bus (Route ${selectedCorridor.primaryBus})`,
        network: "BMTC Bengaluru",
        origin: originName,
        destination: selectedCorridor.destinationName,
        route: `${selectedCorridor.roadName} Corridor`,
        ticketId: `BMTC-${Math.floor(100000 + Math.random() * 900000)}`,
        fare: planCalculations.cheapestPlan.totalFareRupees,
        dateString: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        timestamp: Date.now(),
        status: "Active"
      });

      setBookingSuccessMsg(
        `BMTC Route ${selectedCorridor.primaryBus} selected! Tracking live vehicles on the map.`
      );
      // Smooth scroll up to the map
      window.scrollTo({ top: 180, behavior: "smooth" });
    } else {
      addRideHistory({
        id: `SMART-${Math.floor(100000 + Math.random() * 900000)}`,
        category: "auto",
        type: `Smart Multi-Modal (Auto + ${selectedCorridor.hasMetro ? "Metro" : "Express"})`,
        network: "ONDC Beckn & BMRCL Unified",
        origin: originName,
        destination: selectedCorridor.destinationName,
        route: `Auto First-Mile ➔ ${selectedCorridor.hasMetro ? "Namma Metro" : "Express Flyover"} ➔ Skywalk`,
        driver: "ONDC First-Mile Auto Captain",
        ticketId: `BDL-${Math.floor(1000 + Math.random() * 9000)}`,
        fare: planCalculations.smartPlan.totalFareRupees,
        dateString: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        timestamp: Date.now(),
        status: "Active"
      });

      setBookingSuccessMsg(
        `ONDC Auto & Transit Bundle Initiated! Fare ₹${planCalculations.smartPlan.totalFareRupees} locked. Driver dispatching to your location.`
      );
    }

    setTimeout(() => {
      setBookingSuccessMsg(null);
    }, 4500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm mt-3 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Navigation size={16} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              Real-Time Trip Planner & Road Selector
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Live automated calculation for Cheapest vs Smartest routes
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
          Live Distance: {planCalculations.distanceKm} km
        </span>
      </div>

      {/* Origin & Destination Interactive Fields */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3.5 border border-slate-100 dark:border-slate-800 mb-3.5">
        <div className="flex flex-col gap-2.5 relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[13px] top-4 bottom-4 w-0.5 bg-slate-300 dark:bg-slate-700 pointer-events-none" />

          {/* Origin */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border-2 border-emerald-500 flex items-center justify-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">Origin</span>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {originName}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <MapPin size={12} />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase font-bold text-slate-400 block">
                Destination Road / Corridor
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {selectedCorridor.destinationName}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md">
                  Route {selectedCorridor.primaryBus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Road / Corridor Selection Pills */}
      <div className="mb-4">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
          Pick Road Corridor to Calculate:
        </span>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CORRIDOR_DESTINATIONS.map((corridor) => {
            const isSelected = selectedCorridor.id === corridor.id;
            return (
              <button
                key={corridor.id}
                type="button"
                onClick={() => handleSelectCorridor(corridor)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm scale-102"
                    : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500"
                }`}
              >
                <span>{corridor.roadName}</span>
                <span
                  className={`text-[9px] px-1 rounded font-black ${
                    isSelected
                      ? "bg-white/20 text-white dark:bg-black/20 dark:text-black"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {corridor.primaryBus}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Calculation Tabs Header (Option 1 vs Option 2) */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* OPTION 1: CHEAPEST TAB BUTTON */}
        <button
          type="button"
          onClick={() => setActivePlanTab("cheapest")}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
            activePlanTab === "cheapest"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
              : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Coins size={12} /> 1. Cheapest Plan
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              ₹{planCalculations.cheapestPlan.totalFareRupees}
            </span>
          </div>
          <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
            Direct BMTC Bus
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock size={10} /> {planCalculations.cheapestPlan.totalTimeMinutes} mins total
          </p>
        </button>

        {/* OPTION 2: SMART TAB BUTTON */}
        <button
          type="button"
          onClick={() => setActivePlanTab("smart")}
          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
            activePlanTab === "smart"
              ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm"
              : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1">
              <Zap size={12} fill="currentColor" /> 2. Smart Plan
            </span>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
              ₹{planCalculations.smartPlan.totalFareRupees}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-900 dark:text-white line-clamp-1">
              Auto + Rapid Transit
            </p>
            <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
              ⚡ -{planCalculations.timeSavedMinutes}m
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock size={10} /> {planCalculations.smartPlan.totalTimeMinutes} mins (Fastest)
          </p>
        </button>
      </div>

      {/* Dynamic Plan Details Drawer */}
      <AnimatePresence mode="wait">
        {activePlanTab === "cheapest" ? (
          /* OPTION 1 CONTENT: THE CHEAPEST ROUTE */
          <motion.div
            key="cheapest-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3 border-b border-emerald-500/20 pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Cost Efficiency Leader
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Direct Bus Travel via Route {planCalculations.cheapestPlan.busRoute}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  Total Fare: ₹{planCalculations.cheapestPlan.totalFareRupees}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">
                  {planCalculations.cheapestPlan.totalTimeMinutes} mins travel time
                </span>
              </div>
            </div>

            {/* Step-by-Step Segments */}
            <div className="space-y-2 mb-3.5">
              {planCalculations.cheapestPlan.segments.map((seg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${seg.bg} ${seg.color} flex items-center justify-center shrink-0 font-bold`}
                  >
                    {seg.mode === "Walk" ? <Footprints size={14} /> : <Bus size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">
                      {seg.title}
                    </p>
                    {seg.details && (
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {seg.details}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {seg.duration}m
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      {seg.fare === 0 ? "Free" : `₹${seg.fare}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Button for Cheapest Route */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleBookPlan("cheapest")}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Bus size={16} /> Track & Board Bus {planCalculations.cheapestPlan.busRoute}
              </button>
            </div>
          </motion.div>
        ) : (
          /* OPTION 2 CONTENT: THE SMART / FASTEST ROUTE */
          <motion.div
            key="smart-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3 border-b border-indigo-500/20 pb-2.5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500" /> Smart Multi-Modal Speed
                </span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Fast Auto + Rapid Bypass ({selectedCorridor.hasMetro ? "Namma Metro" : "Express Flyover"})
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 block">
                  Total Fare: ₹{planCalculations.smartPlan.totalFareRupees}
                </span>
                <span className="text-[9px] text-amber-600 dark:text-amber-400 font-black">
                  ⚡ Saves {planCalculations.timeSavedMinutes} minutes
                </span>
              </div>
            </div>

            {/* Step-by-Step Segments */}
            <div className="space-y-2 mb-3.5">
              {planCalculations.smartPlan.segments.map((seg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 bg-white dark:bg-slate-900/90 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <div
                    className={`w-7 h-7 rounded-lg ${seg.bg} ${seg.color} flex items-center justify-center shrink-0 font-bold`}
                  >
                    {seg.mode === "Auto" ? (
                      <Car size={14} />
                    ) : seg.mode === "Metro" ? (
                      <TrainFront size={14} />
                    ) : seg.mode === "Bus" ? (
                      <Bus size={14} />
                    ) : (
                      <Footprints size={14} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 dark:text-slate-200 truncate leading-snug">
                      {seg.title}
                    </p>
                    {seg.details && (
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {seg.details}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      {seg.duration}m
                    </span>
                    <span className="text-[10px] text-indigo-600 font-bold block">
                      {seg.fare === 0 ? "Free" : `₹${seg.fare}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action Button for Smart Route */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleBookPlan("smart")}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Zap size={16} fill="currentColor" /> Book ONDC Auto + Rapid Transit Bundle (₹{planCalculations.smartPlan.totalFareRupees})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Notification Alert on Action */}
      <AnimatePresence>
        {bookingSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-3 p-3 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg"
          >
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="flex-1">{bookingSuccessMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
