import bmtcStopsData from "../data/bmtc_stops.json";
import { BENGALURU_HUBS, TransitHub } from "./routing";

export interface BmtcStop {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distanceMeters?: number;
}

export interface BusNavigationStep {
  id: string;
  type: "walk_start" | "board_bus" | "ride_bus" | "alight_bus" | "walk_dest";
  instruction: string;
  detail: string;
  timeMinutes: number;
  distanceMeters?: number;
  badge?: string;
}

export interface BusAlternativeOption {
  id: string;
  mode: "Bus" | "Metro" | "Auto";
  title: string;
  lineOrRoute: string;
  durationMinutes: number;
  fareRupees: number;
  tag: string;
  description: string;
}

export interface BestBusSuggestionResult {
  isLiveOrigin: boolean;
  originName: string;
  destinationName: string;
  userCoords: [number, number];
  destCoords: [number, number];
  
  // Boarding Stop details
  boardingStop: BmtcStop;
  walkToBoardingMinutes: number;
  walkToBoardingMeters: number;

  // Alighting Stop details
  alightingStop: BmtcStop;
  walkFromAlightMinutes: number;
  walkFromAlightMeters: number;

  // Primary Recommended Bus
  busCode: string;
  busFullName: string;
  busDestination: string;
  corridorName: string;
  frequency: string;
  nextDepartureMinutes: number;
  stopsCount: number;
  busRideMinutes: number;
  totalDurationMinutes: number;
  fareRupees: number;
  carbonSavedGrams: number;
  crowdLevel: "Low" | "Moderate" | "High";
  occupancyPercent: number;

  // Navigation Steps
  steps: BusNavigationStep[];

  // Intermediate Key Stops for timeline
  routeStops: { name: string; lat: number; lon: number }[];

  // Alternative options
  alternatives: BusAlternativeOption[];
}

const ALL_BMTC_STOPS: BmtcStop[] = bmtcStopsData as BmtcStop[];

// Haversine distance in meters
export function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dphi = ((lat2 - lat1) * Math.PI) / 180;
  const dlambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dphi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Find nearest BMTC stop to any coordinates
export function findNearestStop(lat: number, lon: number): BmtcStop {
  let nearest = ALL_BMTC_STOPS[0];
  let minDist = Infinity;
  for (let i = 0; i < ALL_BMTC_STOPS.length; i++) {
    const s = ALL_BMTC_STOPS[i];
    const d = getDistanceMeters(lat, lon, s.lat, s.lon);
    if (d < minDist) {
      minDist = d;
      nearest = s;
    }
  }
  return { ...nearest, distanceMeters: Math.round(minDist) };
}

// Normalize strings for fuzzy matching
function norm(str: string): string {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Search BMTC stops by text query
export function searchBmtcStops(query: string, limit = 6): BmtcStop[] {
  if (!query || query.trim().length === 0) return [];
  const q = norm(query);

  const exactMatches: BmtcStop[] = [];
  const startMatches: BmtcStop[] = [];
  const includeMatches: BmtcStop[] = [];

  for (let i = 0; i < ALL_BMTC_STOPS.length; i++) {
    const s = ALL_BMTC_STOPS[i];
    const n = norm(s.name);
    if (n === q) {
      exactMatches.push(s);
    } else if (n.startsWith(q)) {
      startMatches.push(s);
    } else if (n.includes(q)) {
      includeMatches.push(s);
    }
    if (exactMatches.length + startMatches.length + includeMatches.length >= limit * 2) {
      break;
    }
  }

  return [...exactMatches, ...startMatches, ...includeMatches].slice(0, limit);
}

// Match authentic corridor bus
export function matchCorridorBus(origName: string, destName: string) {
  const o = norm(origName);
  const d = norm(destName);

  const isSilk = o.includes("silk") || d.includes("silk") || o.includes("csb") || d.includes("csb");
  const isMajestic = o.includes("majestic") || d.includes("majestic") || o.includes("kempegowda") || d.includes("kempegowda") || o.includes("kbs") || d.includes("kbs");
  const isEcity = o.includes("electronic") || d.includes("electronic") || o.includes("bommasandra") || d.includes("bommasandra");
  const isWfield = o.includes("whitefield") || d.includes("whitefield") || o.includes("itpl") || d.includes("itpl") || o.includes("kadugodi") || d.includes("kadugodi");
  const isAirport = o.includes("airport") || d.includes("airport") || o.includes("kia") || d.includes("kia") || o.includes("devanahalli") || d.includes("devanahalli");
  const isYelahanka = o.includes("yelahanka") || d.includes("yelahanka");
  const isHebbal = o.includes("hebbal") || d.includes("hebbal") || o.includes("manyata") || d.includes("manyata");
  const isIndiranagar = o.includes("indiranagar") || d.includes("indiranagar") || o.includes("domlur") || d.includes("domlur") || o.includes("hal") || d.includes("hal");
  const isKoramangala = o.includes("koramangala") || d.includes("koramangala") || o.includes("madiwala") || d.includes("madiwala");
  const isBsk = o.includes("banashankari") || d.includes("banashankari") || o.includes("bsk") || d.includes("bsk") || o.includes("jayanagar") || d.includes("jayanagar");
  const isYpr = o.includes("yeshwant") || d.includes("yeshwant") || o.includes("peenya") || d.includes("peenya") || o.includes("goraguntepalya") || d.includes("goraguntepalya");
  const isKengeri = o.includes("kengeri") || d.includes("kengeri") || o.includes("mysoreroad") || d.includes("mysoreroad");

  // Airport Routes (Vayu Vajra AC Volvo)
  if (isAirport) {
    if (isWfield) {
      return {
        code: "KIA-6",
        name: "BMTC Vayu Vajra Airport AC (KIA-6)",
        dest: "Kempegowda Int. Airport (Terminal 1 & 2)",
        corridor: "Whitefield / ITPL ⇄ Airport via Hoodi & Devanahalli",
        freq: "Every 20 mins"
      };
    }
    if (isEcity) {
      return {
        code: "KIA-8",
        name: "BMTC Vayu Vajra Airport AC (KIA-8)",
        dest: "Kempegowda Int. Airport (Terminal 1 & 2)",
        corridor: "Electronic City ⇄ Silk Board ⇄ Airport Elevated Flyover",
        freq: "Every 25 mins"
      };
    }
    if (isIndiranagar) {
      return {
        code: "KIA-4",
        name: "BMTC Vayu Vajra Airport AC (KIA-4)",
        dest: "Kempegowda Int. Airport (Terminal 1 & 2)",
        corridor: "HAL ⇄ Indiranagar ⇄ Airport Expressway",
        freq: "Every 30 mins"
      };
    }
    if (isKoramangala || isSilk) {
      return {
        code: "KIA-7",
        name: "BMTC Vayu Vajra Airport AC (KIA-7)",
        dest: "Kempegowda Int. Airport (Terminal 1 & 2)",
        corridor: "HSR Layout ⇄ Koramangala ⇄ Airport Expressway",
        freq: "Every 20 mins"
      };
    }
    return {
      code: "KIA-9",
      name: "BMTC Vayu Vajra Airport AC (KIA-9)",
      dest: "Kempegowda Int. Airport (Terminal 1 & 2)",
      corridor: "Majestic (KBS) ⇄ Hebbal ⇄ Airport Expressway",
      freq: "Every 15 mins"
    };
  }

  // Silk Board ⇄ Majestic
  if (isSilk && isMajestic) {
    return {
      code: "365",
      name: "BMTC Route 365 Vajra Express",
      dest: d.includes("silk") ? "Central Silk Board" : "Kempegowda Bus Station (Majestic)",
      corridor: "Hosur Road Arterial Corridor (Dairy Circle, Madiwala, Silk Board)",
      freq: "Every 6 mins"
    };
  }

  // Silk Board ⇄ Electronic City
  if (isSilk && isEcity) {
    return {
      code: "356-CW-FLY",
      name: "BMTC Route 356-CW Express (Elevated Tollway)",
      dest: d.includes("electronic") ? "Electronic City Phase 1 / Wipro Gate" : "Central Silk Board",
      corridor: "Electronic City Elevated Tollway High-Speed Corridor",
      freq: "Every 5 mins"
    };
  }

  // Outer Ring Road (Silk Board ⇄ Bellandur ⇄ Marathahalli ⇄ KR Puram ⇄ Hebbal)
  if (
    (isSilk || isHebbal) &&
    (isWfield || o.includes("bellandur") || d.includes("bellandur") || o.includes("marathahalli") || d.includes("marathahalli") || o.includes("krpuram") || d.includes("krpuram") || o.includes("hsr") || d.includes("hsr"))
  ) {
    return {
      code: "500D",
      name: "BMTC Route 500D Vajra Express (Outer Ring Road)",
      dest: d.includes("silk") ? "Central Silk Board" : "Hebbala TTMC / Manyata Tech Park",
      corridor: "Outer Ring Road IT Tech Corridor (HSR, Bellandur, Marathahalli, KR Puram)",
      freq: "Every 4 mins"
    };
  }

  // Majestic ⇄ Whitefield / ITPL
  if (isMajestic && isWfield) {
    return {
      code: "335E",
      name: "BMTC Route 335E Express",
      dest: d.includes("white") || d.includes("itpl") ? "Whitefield Kadugodi Bus Station" : "Kempegowda Bus Station (Majestic)",
      corridor: "Old Airport Road & ITPL Corridor via Domlur, HAL & Marathahalli",
      freq: "Every 5 mins"
    };
  }

  // Majestic ⇄ Electronic City
  if (isMajestic && isEcity) {
    return {
      code: "365",
      name: "BMTC Route 365 Express",
      dest: d.includes("electronic") ? "Electronic City Wipro Gate" : "Kempegowda Bus Station (Majestic)",
      corridor: "Hosur Road Corridor via Shantinagar & Silk Board",
      freq: "Every 6 mins"
    };
  }

  // Majestic ⇄ Yelahanka
  if (isMajestic && isYelahanka) {
    return {
      code: "250",
      name: "BMTC Route 250 Express",
      dest: d.includes("yelahanka") ? "Yelahanka Old Town" : "Kempegowda Bus Station (Majestic)",
      corridor: "Ballari Road Corridor via Mekhri Circle & Hebbal",
      freq: "Every 8 mins"
    };
  }

  // Yelahanka ⇄ Yeshwanthpur / Kengeri / Ring Road
  if ((isYelahanka || isHebbal) && (isYpr || isKengeri)) {
    return {
      code: "401-K",
      name: "BMTC Route 401-K Express",
      dest: d.includes("kengeri") ? "Kengeri TTMC" : "Yelahanka New Town 5th Phase",
      corridor: "Outer Ring Road West via BEL Circle, Yeshwanthpur & Vijayanagar",
      freq: "Every 7 mins"
    };
  }

  // Indiranagar / Domlur ⇄ Whitefield
  if (isIndiranagar && isWfield) {
    return {
      code: "335E",
      name: "BMTC Route 335E Express",
      dest: d.includes("white") || d.includes("itpl") ? "Whitefield ITPL" : "Indiranagar / Domlur",
      corridor: "Old Airport Road Express Corridor",
      freq: "Every 5 mins"
    };
  }

  // Banashankari ⇄ Silk Board / Electronic City
  if (isBsk && (isSilk || isEcity)) {
    return {
      code: "600F",
      name: "BMTC Route 600F Express",
      dest: d.includes("banashankari") ? "Banashankari TTMC" : "Electronic City / Silk Board",
      corridor: "South Ring Road Corridor via BTM Layout & Silk Board",
      freq: "Every 8 mins"
    };
  }

  // Banashankari ⇄ Majestic
  if (isBsk && isMajestic) {
    return {
      code: "215",
      name: "BMTC Route 215 Express",
      dest: d.includes("banashankari") ? "Banashankari TTMC" : "Kempegowda Bus Station (Majestic)",
      corridor: "Kanakapura Road & Jayanagar Arterial Corridor",
      freq: "Every 6 mins"
    };
  }

  // Yeshwanthpur ⇄ Majestic
  if (isYpr && isMajestic) {
    return {
      code: "258-C",
      name: "BMTC Route 258-C Express",
      dest: d.includes("yeshwant") || d.includes("peenya") ? "Nelamangala / Peenya" : "Kempegowda Bus Station (Majestic)",
      corridor: "Tumkur Road Corridor via Rajajinagar",
      freq: "Every 6 mins"
    };
  }

  // Koramangala ⇄ Electronic City
  if (isKoramangala && isEcity) {
    return {
      code: "356-J",
      name: "BMTC Route 356-J Express",
      dest: d.includes("electronic") ? "Electronic City Phase 2" : "Koramangala Sony World Signal",
      corridor: "Madiwala & Hosur Road Elevated Expressway",
      freq: "Every 7 mins"
    };
  }

  // Default High-Capacity Arterial Corridor Bus
  return {
    code: "G-2",
    name: "BMTC Big-10 Arterial Route G-2",
    dest: `${destName || "City Center"} Terminal`,
    corridor: "Primary High-Density Radial Arterial Corridor",
    freq: "Every 8 mins"
  };
}

// Master Intelligent Bus Recommendation Engine
export function calculateBestBusSuggestion({
  origin,
  destination,
  userLoc
}: {
  origin: string;
  destination: string;
  userLoc: [number, number] | null;
}): BestBusSuggestionResult {
  const isLiveOrigin =
    !origin ||
    origin.toLowerCase().includes("live") ||
    origin.toLowerCase().includes("current") ||
    origin.toLowerCase().includes("my location");

  // Default fallback user coordinates: Central Bengaluru / MG Road
  let userCoords: [number, number] = [12.9716, 77.5946];
  let originDisplayName = origin || "My Live Location";

  if (isLiveOrigin && userLoc) {
    userCoords = userLoc;
    originDisplayName = "My Live Location";
  } else if (!isLiveOrigin) {
    // Check known hubs first
    const hub = Object.values(BENGALURU_HUBS).find(
      (h) => norm(h.name).includes(norm(origin)) || h.aliases.some((a) => norm(origin).includes(norm(a)))
    );
    if (hub) {
      userCoords = [hub.lat, hub.lng];
      originDisplayName = hub.name;
    } else {
      const stop = searchBmtcStops(origin, 1)[0];
      if (stop) {
        userCoords = [stop.lat, stop.lon];
        originDisplayName = stop.name;
      }
    }
  }

  // Resolve nearest Boarding Stop to origin/user coordinates
  const boardingStop = findNearestStop(userCoords[0], userCoords[1]);
  const walkToBoardingMeters = boardingStop.distanceMeters || 120;
  const walkToBoardingMinutes = Math.max(1, Math.round(walkToBoardingMeters / 80));

  // Resolve destination coordinates
  let destCoords: [number, number] = [12.9779, 77.5739]; // Default: Majestic
  let destinationDisplayName = destination || "Kempegowda Bus Station (Majestic)";

  const destHub = Object.values(BENGALURU_HUBS).find(
    (h) => norm(h.name).includes(norm(destination)) || h.aliases.some((a) => norm(destination).includes(norm(a)))
  );
  if (destHub) {
    destCoords = [destHub.lat, destHub.lng];
    destinationDisplayName = destHub.name;
  } else {
    const destStopMatch = searchBmtcStops(destination, 1)[0];
    if (destStopMatch) {
      destCoords = [destStopMatch.lat, destStopMatch.lon];
      destinationDisplayName = destStopMatch.name;
    }
  }

  // Resolve nearest Alighting Stop to destination
  const alightingStop = findNearestStop(destCoords[0], destCoords[1]);
  const walkFromAlightMeters = alightingStop.distanceMeters || 90;
  const walkFromAlightMinutes = Math.max(1, Math.round(walkFromAlightMeters / 80));

  // Match the Best Bus for this corridor
  const bus = matchCorridorBus(boardingStop.name, alightingStop.name);

  // Compute metrics based on real transit distance
  const transitDistKm = getDistanceMeters(boardingStop.lat, boardingStop.lon, alightingStop.lat, alightingStop.lon) / 1000;
  const stopsCount = Math.max(3, Math.min(36, Math.round(transitDistKm / 0.85)));

  let fareRupees = 15;
  if (stopsCount <= 3) fareRupees = 15;
  else if (stopsCount <= 6) fareRupees = 20;
  else if (stopsCount <= 10) fareRupees = 25;
  else if (stopsCount <= 15) fareRupees = 30;
  else fareRupees = 35;

  if (bus.code.startsWith("KIA")) {
    fareRupees = 220;
  }

  const busRideMinutes = Math.round(stopsCount * 1.8 + 4);
  const totalDurationMinutes = walkToBoardingMinutes + busRideMinutes + walkFromAlightMinutes;
  const carbonSavedGrams = Math.round(transitDistKm * 85);
  const nextDepartureMinutes = Math.floor(Math.random() * 4) + 2; // e.g. 2-5 mins

  // Deterministic realistic crowd rating
  const hour = new Date().getHours();
  const isPeakHour = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
  const crowdLevel: "Low" | "Moderate" | "High" = isPeakHour ? "Moderate" : "Low";
  const occupancyPercent = isPeakHour ? 68 : 34;

  // Step-by-Step Navigation Guidance
  const steps: BusNavigationStep[] = [
    {
      id: "step-1-walk-start",
      type: "walk_start",
      instruction: `Walk to ${boardingStop.name}`,
      detail: `Walk ${walkToBoardingMeters}m (${walkToBoardingMinutes} min) from ${isLiveOrigin ? "your live location" : originDisplayName} to the designated BMTC shelter/platform.`,
      timeMinutes: walkToBoardingMinutes,
      distanceMeters: walkToBoardingMeters,
      badge: "Walk"
    },
    {
      id: "step-2-board-bus",
      type: "board_bus",
      instruction: `Board Bus ${bus.code} (${bus.name})`,
      detail: `Board bus heading towards ${bus.dest}. Next departure in ${nextDepartureMinutes} mins. Frequency: ${bus.freq}.`,
      timeMinutes: nextDepartureMinutes,
      badge: bus.code
    },
    {
      id: "step-3-ride-bus",
      type: "ride_bus",
      instruction: `Ride ${stopsCount} stops (~${busRideMinutes} mins)`,
      detail: `Transit via ${bus.corridor}. Live crowding: ${occupancyPercent}% (${crowdLevel}). Digital tickets via QR & NCMC accepted.`,
      timeMinutes: busRideMinutes,
      badge: `${stopsCount} Stops`
    },
    {
      id: "step-4-alight-bus",
      type: "alight_bus",
      instruction: `Get down at ${alightingStop.name}`,
      detail: `Exit bus and use pedestrian crossing or skywalk connector towards ${destinationDisplayName}.`,
      timeMinutes: 1,
      badge: "Alight"
    },
    {
      id: "step-5-walk-dest",
      type: "walk_dest",
      instruction: `Walk to final destination: ${destinationDisplayName}`,
      detail: `Walk ${walkFromAlightMeters}m (${walkFromAlightMinutes} min) to reach destination entrance.`,
      timeMinutes: walkFromAlightMinutes,
      distanceMeters: walkFromAlightMeters,
      badge: "Arrive"
    }
  ];

  // Key Intermediate Stops for timeline
  const routeStops = [
    { name: boardingStop.name, lat: boardingStop.lat, lon: boardingStop.lon },
    {
      name: `Midway Stop: ${bus.corridor.split("⇄")[0]?.trim() || "Arterial Junction"}`,
      lat: (boardingStop.lat + alightingStop.lat) / 2,
      lon: (boardingStop.lon + alightingStop.lon) / 2
    },
    { name: alightingStop.name, lat: alightingStop.lat, lon: alightingStop.lon }
  ];

  // Alternative transit choices
  const alternatives: BusAlternativeOption[] = [
    {
      id: "alt-bus-vajra",
      mode: "Bus",
      title: `${bus.code} Low-Floor AC Volvo`,
      lineOrRoute: bus.code,
      durationMinutes: Math.round(busRideMinutes * 0.9),
      fareRupees: fareRupees + 15,
      tag: "Air Conditioned",
      description: "Volvo luxury AC bus with mobile charging & dedicated luggage bays."
    },
    {
      id: "alt-metro",
      mode: "Metro",
      title: "Namma Metro Rapid Transit",
      lineOrRoute: "Purple / Green Line",
      durationMinutes: Math.max(18, Math.round(transitDistKm * 1.5 + 8)),
      fareRupees: Math.min(60, Math.round(transitDistKm * 2.2 + 10)),
      tag: "Fastest / No Traffic",
      description: "High-speed rail corridor bypassing surface bottlenecks completely."
    },
    {
      id: "alt-auto-firstmile",
      mode: "Auto",
      title: "ONDC Auto Express First-Mile",
      lineOrRoute: "ONDC Auto",
      durationMinutes: Math.round(walkToBoardingMinutes * 0.4 + busRideMinutes),
      fareRupees: fareRupees + 30,
      tag: "Zero Walk",
      description: "Direct doorstep pickup to skip walking in heat or rain."
    }
  ];

  return {
    isLiveOrigin,
    originName: originDisplayName,
    destinationName: destinationDisplayName,
    userCoords,
    destCoords,
    boardingStop,
    walkToBoardingMinutes,
    walkToBoardingMeters,
    alightingStop,
    walkFromAlightMinutes,
    walkFromAlightMeters,
    busCode: bus.code,
    busFullName: bus.name,
    busDestination: bus.dest,
    corridorName: bus.corridor,
    frequency: bus.freq,
    nextDepartureMinutes,
    stopsCount,
    busRideMinutes,
    totalDurationMinutes,
    fareRupees,
    carbonSavedGrams,
    crowdLevel,
    occupancyPercent,
    steps,
    routeStops,
    alternatives
  };
}
