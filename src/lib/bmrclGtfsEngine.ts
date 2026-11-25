// src/lib/bmrclGtfsEngine.ts
import fs from "fs";
import path from "path";

export interface MetroStation {
  id: string;
  code: string;
  name: string;
  lat: number;
  lon: number;
  lines: ("Purple" | "Green" | "Yellow")[];
}

export interface FareInfo {
  token: number;
  smartCardPeak: number;
  smartCardOffPeak: number;
  qr: number;
  currency: string;
}

export interface NextTrainInfo {
  currentIstTime: string;
  nextDepartureTime: string;
  etaMinutes: number;
  countdownSeconds: number;
  headsign: string;
  platform: string;
  directionId: number;
  isOperating: boolean;
  statusMessage: string;
  upcomingDepartures: {
    time: string;
    headsign: string;
    countdownSec: number;
  }[];
}

export interface StationDepartureBoard {
  station: MetroStation;
  currentIstTime: string;
  directions: {
    directionId: number;
    headsign: string;
    platform: string;
    nextDeparture: string;
    countdownSeconds: number;
    etaMinutes: number;
    statusMessage: string;
    upcoming: { time: string; headsign: string; countdownSec: number }[];
  }[];
}

export interface InterchangeInfo {
  station: MetroStation;
  fromLine: string;
  toLine: string;
  transferWalkMinutes: number;
}

export interface PlannedMetroJourney {
  success: boolean;
  origin: MetroStation;
  destination: MetroStation;
  routeType: "DIRECT" | "SINGLE_INTERCHANGE" | "DOUBLE_INTERCHANGE";
  lines: string[];
  primaryLine: string;
  interchange: InterchangeInfo | null;
  interchanges: InterchangeInfo[];
  totalStops: number;
  totalDurationMinutes: number;
  path: MetroStation[];
  fare: FareInfo;
  nextTrain: NextTrainInfo;
}

export interface LiveMetroTrain {
  trainId: string;
  tripId: string;
  line: "Purple" | "Green" | "Yellow";
  lineColor: string;
  headsign: string;
  directionId: number;
  lat: number;
  lng: number;
  bearing: number;
  speed: number;
  currentStationCode: string;
  currentStationName: string;
  nextStationCode: string;
  nextStationName: string;
  etaNextStationSeconds: number;
  isDwelling: boolean;
  progressPercent: number;
  occupancyPercent: number;
  crowdLevel: "Low" | "Moderate" | "Crowded" | "Packed";
  updatedAt: string;
}

// In-memory GTFS caches
let isInitialized = false;
const STATIONS: Record<string, MetroStation> = {};
const NAME_TO_ID_INDEX: Record<string, string> = {};

// Official Station Code Sequences from BMRCL GTFS
export const PURPLE_SEQUENCE: string[] = [
  "CLGA", "KGIT", "MLSD", "PATG", "BGUC", "RRRN", "NYHM", "MYRD", "DJNR", "AGPP",
  "VJN", "HSLI", "MIRD", "BRCS", "KGWA", "VSWA", "VDSA", "CBPK", "MAGR", "TTY",
  "HLRU", "IDN", "SVRD", "BYPH", "JTPM", "KRAM", "MDVP", "GDCP", "DKIA", "VWIA",
  "KDNH", "VDHP", "SSHP", "ITPL", "KDGD", "UWVL", "WHTM"
];

export const GREEN_SEQUENCE: string[] = [
  "APTS", "TGTP", "VJRH", "KLPK", "APRC", "PUTH", "JPN", "BSNK", "RVR", "JYN",
  "SECE", "LBGH", "NLC", "KRMT", "CKPE", "KGWA", "SPGD", "SPRU", "KVPR", "RJNR",
  "MHLI", "SSFY", "YPM", "YPI", "PEYA", "PYID", "JLHL", "DSH", "NGSA", "MNJN",
  "JIDL", "BIET"
];

export const YELLOW_SEQUENCE: string[] = [
  "RVR", "RGDT", "JDHP", "BTML", "SBJT", "HSRL", "OFDC", "MSRN", "CKBR", "BSRD",
  "HOSR", "ETCT", "ECTN", "HSKR", "HBGI", "BMSD"
];

interface GtfsTripMeta {
  tripId: string;
  routeId: string;
  serviceId: string;
  headsign: string;
  directionId: number;
}

interface GtfsStopTimeEntry {
  stopCode: string;
  seq: number;
  arrSec: number;
  depSec: number;
  headsign?: string;
}

interface GtfsDepartureItem {
  secs: number;
  headsign: string;
  timeStr: string;
  tripId: string;
  directionId: number;
  platform: string;
}

const FARE_MATRIX: Record<string, number> = {};
const TRIPS_META: Record<string, GtfsTripMeta> = {};
const TRIP_STOP_TIMES: Record<string, GtfsStopTimeEntry[]> = {};
// Keyed by `${stationCode}_${directionId}` and `${stationCode}`
const DEPARTURES_BY_STATION_AND_DIR: Record<string, GtfsDepartureItem[]> = {};

// Clean Station Aliases mapping common user/slug queries to BMRCL codes
const STATION_ALIASES: Record<string, string> = {
  "majestic": "KGWA",
  "kempegowda": "KGWA",
  "nadaprabhu": "KGWA",
  "nadaprabhukempegowdastationmajestic": "KGWA",
  "indiranagar": "IDN",
  "whitefield": "WHTM",
  "whitefieldkadugodi": "WHTM",
  "kadugodi": "KDGD",
  "challaghatta": "CLGA",
  "madavara": "BIET",
  "biec": "BIET",
  "silk-institute": "APTS",
  "silkinstitute": "APTS",
  "anajanapura": "APTS",
  "nagasandra": "NGSA",
  "hesaraghattacrossnagasandra": "NGSA",
  "yeshwanthpur": "YPM",
  "yeshwantpur": "YPM",
  "yeshwanthpurindustry": "YPI",
  "krmarket": "KRMT",
  "krishnarajendramarket": "KRMT",
  "hosahalli": "HSLI",
  "vijayanagar": "VJN",
  "mgroad": "MAGR",
  "mahatmagandhiroad": "MAGR",
  "cubbonpark": "CBPK",
  "vidhanasoudha": "VDSA",
  "drbrambedkarstationvidhanasoudha": "VDSA",
  "centralsilkboard": "SBJT",
  "silkboard": "SBJT",
  "rvroad": "RVR",
  "rashtreeyavidyalayaroad": "RVR",
  "jayanagar": "JYN",
  "banashankari": "BSNK",
  "electroniccity": "ETCT",
  "electroniccityi": "ETCT",
  "electroniccityii": "ECTN",
  "bommasandra": "BMSD",
  "deltaelectronicsbommasandra": "BMSD",
  "btmlayout": "BTML",
  "jayadevahospital": "JDHP",
  "ragigudda": "RGDT",
  "krpuram": "KRAM",
  "krishnarajapura": "KRAM",
  "itpl": "ITPL",
  "pattanduragrahara": "ITPL",
  "baiyappanahalli": "BYPH",
  "swamivivekanandaroad": "SVRD",
  "svroad": "SVRD",
  "halasuru": "HLRU",
  "trinity": "TTY",
  "sirvisvesvaraya": "VSWA",
  "sirmvisvesvarayastation": "VSWA",
  "cityrailwaystation": "BRCS",
  "krantiveerasangollirayannarailwaystation": "BRCS",
  "magadiroad": "MIRD",
  "attiguppe": "AGPP",
  "deepanjalinagar": "DJNR",
  "mysoreroad": "MYRD",
  "nayandahalli": "NYHM",
  "rajarajeshwarinagar": "RRRN",
  "jnanabharathi": "BGUC",
  "pattanagere": "PATG",
  "kengeribusterminal": "MLSD",
  "kengeri": "KGIT"
};

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function secondsToTimeStr(secs: number): string {
  const normalized = ((secs % 86400) + 86400) % 86400;
  const h = Math.floor(normalized / 3600);
  const m = Math.floor((normalized % 3600) / 60);
  const s = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function timeStrToSeconds(str: string): number {
  if (!str) return 0;
  const [h, m, s] = str.split(":").map(Number);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
}

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

function getCurrentIst(): { seconds: number; timeStr: string; serviceId: string } {
  const now = new Date();
  const istDateString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istDateString);
  const seconds = istDate.getHours() * 3600 + istDate.getMinutes() * 60 + istDate.getSeconds();
  const timeStr = secondsToTimeStr(seconds);

  // GTFS Calendar match
  const day = istDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  let serviceId = "weekday";
  if (day === 0) serviceId = "sunday";
  else if (day === 1) serviceId = "monday";
  else serviceId = "weekday";

  return { seconds, timeStr, serviceId };
}

export function initBmrclGtfs() {
  if (isInitialized) return;

  try {
    const dataDir = path.join(process.cwd(), "data/metro");

    // 1. Parse stops.txt
    const stopsPath = path.join(dataDir, "stops.txt");
    if (fs.existsSync(stopsPath)) {
      const raw = fs.readFileSync(stopsPath, "utf8");
      const lines = raw.split("\n");
      const header = parseCsvLine(lines[0]);
      const idIdx = header.indexOf("stop_id");
      const nameIdx = header.indexOf("stop_name");
      const latIdx = header.indexOf("stop_lat");
      const lonIdx = header.indexOf("stop_lon");
      const typeIdx = header.indexOf("location_type");

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line) continue;
        const p = parseCsvLine(line);
        const locType = p[typeIdx];
        if (locType === "1") {
          const id = p[idIdx]?.trim();
          const rawName = p[nameIdx]?.replace(/^"|"$/g, "").trim() || id;
          const lat = parseFloat(p[latIdx]);
          const lon = parseFloat(p[lonIdx]);

          const assignedLines: ("Purple" | "Green" | "Yellow")[] = [];
          if (PURPLE_SEQUENCE.includes(id)) assignedLines.push("Purple");
          if (GREEN_SEQUENCE.includes(id)) assignedLines.push("Green");
          if (YELLOW_SEQUENCE.includes(id)) assignedLines.push("Yellow");

          STATIONS[id] = {
            id,
            code: id,
            name: rawName,
            lat,
            lon,
            lines: assignedLines,
          };

          NAME_TO_ID_INDEX[rawName.toLowerCase()] = id;
          NAME_TO_ID_INDEX[id.toLowerCase()] = id;
          const clean = rawName.toLowerCase().replace(/[^a-z0-9]/g, "");
          NAME_TO_ID_INDEX[clean] = id;
        }
      }
    }

    // 2. Parse fare_leg_rules.txt
    const fareRulesPath = path.join(dataDir, "fare_leg_rules.txt");
    if (fs.existsSync(fareRulesPath)) {
      const raw = fs.readFileSync(fareRulesPath, "utf8");
      const lines = raw.split("\n");
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line) continue;
        const parts = line.split(",");
        const from = parts[2];
        const to = parts[3];
        const prod = parts[5];
        if (from && to && prod && prod.endsWith("_token")) {
          const amt = parseInt(prod.replace("fare_", "").replace("_token", ""), 10);
          if (!isNaN(amt)) {
            FARE_MATRIX[`${from}_${to}`] = amt;
          }
        }
      }
    }

    // 3. Parse trips.txt
    const tripsPath = path.join(dataDir, "trips.txt");
    if (fs.existsSync(tripsPath)) {
      const raw = fs.readFileSync(tripsPath, "utf8");
      const lines = raw.split("\n");
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line) continue;
        const p = parseCsvLine(line);
        // route_id,service_id,trip_headsign,direction_id,shape_id,trip_id
        const tid = p[5];
        if (!tid) continue;
        TRIPS_META[tid] = {
          routeId: p[0],
          serviceId: p[1],
          headsign: p[2]?.replace(/^"|"$/g, "") || "",
          directionId: parseInt(p[3] || "0", 10),
          tripId: tid,
        };
      }
    }

    // 4. Parse stop_times.txt for real departure timetables and active train positions
    const stopTimesPath = path.join(dataDir, "stop_times.txt");
    if (fs.existsSync(stopTimesPath)) {
      const raw = fs.readFileSync(stopTimesPath, "utf8");
      const lines = raw.split("\n");
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line) continue;
        const parts = line.split(",");
        const tripId = parts[0];
        const arrTime = parts[1];
        const depTime = parts[2];
        const stopId = parts[3];
        const seq = parseInt(parts[4] || "0", 10);
        if (!tripId || !depTime || !stopId) continue;

        const stationCode = stopId.split("_")[0];
        if (!stationCode) continue;

        const arrSec = timeStrToSeconds(arrTime || depTime);
        const depSec = timeStrToSeconds(depTime);

        // Populate trip stops sequence for active train position interpolation
        if (!TRIP_STOP_TIMES[tripId]) {
          TRIP_STOP_TIMES[tripId] = [];
        }
        TRIP_STOP_TIMES[tripId].push({
          stopCode: stationCode,
          seq,
          arrSec,
          depSec,
          headsign: parts[5]?.replace(/^"|"$/g, ""),
        });

        const meta = TRIPS_META[tripId];
        const platform = stopId.includes("_PF2") ? "Platform 2" : "Platform 1";
        const directionId = meta ? meta.directionId : 0;
        const headsign = (meta ? meta.headsign : "") || (directionId === 0 ? "South/Westbound" : "North/Eastbound");

        const departureItem: GtfsDepartureItem = {
          secs: depSec,
          headsign,
          timeStr: depTime,
          tripId,
          directionId,
          platform,
        };

        // Key 1: station + directionId (e.g. IDN_0, IDN_1)
        const keyDir = `${stationCode}_${directionId}`;
        if (!DEPARTURES_BY_STATION_AND_DIR[keyDir]) {
          DEPARTURES_BY_STATION_AND_DIR[keyDir] = [];
        }
        DEPARTURES_BY_STATION_AND_DIR[keyDir].push(departureItem);

        // Key 2: general station (e.g. IDN)
        if (!DEPARTURES_BY_STATION_AND_DIR[stationCode]) {
          DEPARTURES_BY_STATION_AND_DIR[stationCode] = [];
        }
        DEPARTURES_BY_STATION_AND_DIR[stationCode].push(departureItem);
      }

      // Sort and deduplicate all departure lists
      for (const k of Object.keys(DEPARTURES_BY_STATION_AND_DIR)) {
        DEPARTURES_BY_STATION_AND_DIR[k].sort((a, b) => a.secs - b.secs);
      }

      // Sort trip stop times by sequence
      for (const tid of Object.keys(TRIP_STOP_TIMES)) {
        TRIP_STOP_TIMES[tid].sort((a, b) => a.seq - b.seq);
      }
    }

    isInitialized = true;
  } catch (err) {
    console.error("Error initializing BMRCL GTFS data:", err);
  }
}

// Resolve user query (e.g. "Majestic", "indiranagar", "KGWA", "whitefield") to canonical MetroStation
export function resolveStation(input: string): MetroStation | null {
  initBmrclGtfs();
  if (!input) return null;
  const q = input.trim();
  const lower = q.toLowerCase();
  const clean = lower.replace(/[^a-z0-9]/g, "");

  // 1. Direct code lookup
  const upper = q.toUpperCase();
  if (STATIONS[upper]) return STATIONS[upper];

  // 2. Exact alias map lookup
  if (STATION_ALIASES[clean]) {
    const id = STATION_ALIASES[clean];
    if (STATIONS[id]) return STATIONS[id];
  }
  for (const [alias, code] of Object.entries(STATION_ALIASES)) {
    if (clean.includes(alias) || alias.includes(clean)) {
      if (STATIONS[code]) return STATIONS[code];
    }
  }

  // 3. Direct name index lookup
  if (NAME_TO_ID_INDEX[lower]) return STATIONS[NAME_TO_ID_INDEX[lower]];
  if (NAME_TO_ID_INDEX[clean]) return STATIONS[NAME_TO_ID_INDEX[clean]];

  // 4. Substring match
  for (const [name, id] of Object.entries(NAME_TO_ID_INDEX)) {
    if (name.length > 3 && (name.includes(clean) || clean.includes(name))) {
      return STATIONS[id];
    }
  }

  return null;
}

export function getAllMetroStations(): MetroStation[] {
  initBmrclGtfs();
  return Object.values(STATIONS);
}

// Calculate exact fare based on BMRCL GTFS rules
export function calculateMetroFare(fromCode: string, toCode: string, stopsCount: number): FareInfo {
  initBmrclGtfs();
  let baseToken = FARE_MATRIX[`${fromCode}_${toCode}`] || FARE_MATRIX[`${toCode}_${fromCode}`];

  if (!baseToken) {
    // Official distance-based fare fallback slab
    if (stopsCount <= 3) baseToken = 10;
    else if (stopsCount <= 6) baseToken = 20;
    else if (stopsCount <= 10) baseToken = 30;
    else if (stopsCount <= 15) baseToken = 40;
    else if (stopsCount <= 21) baseToken = 50;
    else if (stopsCount <= 27) baseToken = 60;
    else if (stopsCount <= 33) baseToken = 70;
    else baseToken = 80;
  }

  const smartCardPeak = Math.round(baseToken * 0.95 * 10) / 10; // 5% off
  const smartCardOffPeak = Math.round(baseToken * 0.90 * 10) / 10; // 10% off
  const qr = Math.round(baseToken * 0.95 * 10) / 10; // 5% off QR ticket

  return {
    token: baseToken,
    smartCardPeak,
    smartCardOffPeak,
    qr,
    currency: "INR",
  };
}

// Calculate next train arrival time from real GTFS departures for current IST time
export function getNextTrainTimings(
  stationCode: string,
  destinationHeadsignOrDir?: string | number
): NextTrainInfo {
  initBmrclGtfs();

  const { seconds: currentIstSeconds, timeStr: currentIstTime, serviceId: activeService } = getCurrentIst();

  let targetDir: number | null = null;
  if (typeof destinationHeadsignOrDir === "number") {
    targetDir = destinationHeadsignOrDir;
  } else if (typeof destinationHeadsignOrDir === "string") {
    const s = destinationHeadsignOrDir.toLowerCase();
    if (s.includes("whitefield") || s.includes("madavara") || s.includes("kadugodi") || s.includes("east") || s.includes("north")) {
      targetDir = 1;
    } else if (s.includes("challaghatta") || s.includes("mysore") || s.includes("silk institute") || s.includes("south") || s.includes("west")) {
      targetDir = 0;
    }
  }

  // Look up direction-specific or all-departures list
  let candidateDepartures: GtfsDepartureItem[] = [];
  if (targetDir !== null && DEPARTURES_BY_STATION_AND_DIR[`${stationCode}_${targetDir}`]) {
    candidateDepartures = DEPARTURES_BY_STATION_AND_DIR[`${stationCode}_${targetDir}`];
  } else if (DEPARTURES_BY_STATION_AND_DIR[stationCode]) {
    candidateDepartures = DEPARTURES_BY_STATION_AND_DIR[stationCode];
  }

  // Filter departures matching active service or weekday
  const relevantDepartures = candidateDepartures.filter((d) => {
    const trip = TRIPS_META[d.tripId];
    return !trip || trip.serviceId === activeService || trip.serviceId === "weekday";
  });

  const sourceList = relevantDepartures.length > 0 ? relevantDepartures : candidateDepartures;

  // Find next departure >= currentIstSeconds
  let nextDep: GtfsDepartureItem | null = null;
  const upcomingList: { time: string; headsign: string; countdownSec: number }[] = [];

  for (let i = 0; i < sourceList.length; i++) {
    if (sourceList[i].secs >= currentIstSeconds) {
      if (!nextDep) {
        nextDep = sourceList[i];
      } else if (upcomingList.length < 4) {
        upcomingList.push({
          time: sourceList[i].timeStr,
          headsign: sourceList[i].headsign,
          countdownSec: sourceList[i].secs - currentIstSeconds,
        });
      }
    }
  }

  if (nextDep) {
    const diffSec = nextDep.secs - currentIstSeconds;
    const etaMins = Math.floor(diffSec / 60);
    const etaSecs = diffSec % 60;
    const readableCountdown = diffSec < 60 ? `${diffSec}s` : `${etaMins}m ${etaSecs}s`;

    return {
      currentIstTime,
      nextDepartureTime: nextDep.timeStr,
      etaMinutes: Math.max(1, Math.round(diffSec / 60)),
      countdownSeconds: diffSec,
      headsign: nextDep.headsign || String(destinationHeadsignOrDir || "BMRCL Network"),
      platform: nextDep.platform,
      directionId: nextDep.directionId,
      isOperating: true,
      statusMessage: `Next train arriving in ${readableCountdown} (${nextDep.timeStr} IST)`,
      upcomingDepartures: upcomingList,
    };
  }

  // If after revenue hours (past 23:30)
  const firstMorning = sourceList[0] || { secs: 5 * 3600, timeStr: "05:00:00", headsign: "First Train", platform: "Platform 1", directionId: 0 };
  return {
    currentIstTime,
    nextDepartureTime: firstMorning.timeStr,
    etaMinutes: 0,
    countdownSeconds: 0,
    headsign: firstMorning.headsign,
    platform: firstMorning.platform,
    directionId: firstMorning.directionId,
    isOperating: false,
    statusMessage: `Revenue service closed. First train tomorrow at ${firstMorning.timeStr} IST.`,
    upcomingDepartures: sourceList.slice(1, 4).map((d) => ({
      time: d.timeStr,
      headsign: d.headsign,
      countdownSec: 0,
    })),
  };
}

// Station Departure Board returning both Platform 1 and Platform 2 next trains
export function getStationDepartureBoard(stationCode: string): StationDepartureBoard | null {
  initBmrclGtfs();
  const station = resolveStation(stationCode);
  if (!station) return null;

  const { timeStr: currentIstTime } = getCurrentIst();

  const dir0 = getNextTrainTimings(station.id, 0);
  const dir1 = getNextTrainTimings(station.id, 1);

  return {
    station,
    currentIstTime,
    directions: [
      {
        directionId: 0,
        headsign: dir0.headsign,
        platform: "Platform 1",
        nextDeparture: dir0.nextDepartureTime,
        countdownSeconds: dir0.countdownSeconds,
        etaMinutes: dir0.etaMinutes,
        statusMessage: dir0.statusMessage,
        upcoming: dir0.upcomingDepartures,
      },
      {
        directionId: 1,
        headsign: dir1.headsign,
        platform: "Platform 2",
        nextDeparture: dir1.nextDepartureTime,
        countdownSeconds: dir1.countdownSeconds,
        etaMinutes: dir1.etaMinutes,
        statusMessage: dir1.statusMessage,
        upcoming: dir1.upcomingDepartures,
      },
    ],
  };
}

// Live Metro Train Interpolation Engine
export function getActiveMetroTrains(lineFilter?: string): LiveMetroTrain[] {
  initBmrclGtfs();

  const { seconds: istSec, timeStr: istTimeStr, serviceId: activeService } = getCurrentIst();

  // Crowd calculation based on IST hour
  const now = new Date();
  const istDateString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istDateString);
  const hour = istDate.getHours();
  const isPeak = (hour >= 8 && hour <= 11) || (hour >= 17 && hour <= 20);
  const isNight = hour >= 22 || hour <= 6;
  const baseOccupancy = isPeak ? 82 : isNight ? 24 : 54;
  const crowdLevel: "Low" | "Moderate" | "Crowded" | "Packed" =
    baseOccupancy > 85 ? "Packed" : baseOccupancy > 70 ? "Crowded" : baseOccupancy > 40 ? "Moderate" : "Low";

  const activeTrains: LiveMetroTrain[] = [];

  for (const [tid, stops] of Object.entries(TRIP_STOP_TIMES)) {
    if (!stops || stops.length < 2) continue;
    const meta = TRIPS_META[tid];
    if (!meta) continue;

    // Filter by active service or weekday
    if (meta.serviceId !== activeService && meta.serviceId !== "weekday") {
      continue;
    }

    // Line matching
    let line: "Purple" | "Green" | "Yellow" = "Purple";
    let lineColor = "#8C2877";
    const rUpper = meta.routeId.toUpperCase();
    if (rUpper.includes("GREEN")) {
      line = "Green";
      lineColor = "#009933";
    } else if (rUpper.includes("YELLOW")) {
      line = "Yellow";
      lineColor = "#EAB308";
    }

    if (lineFilter && lineFilter !== "All" && line.toLowerCase() !== lineFilter.toLowerCase()) {
      continue;
    }

    const firstStop = stops[0];
    const lastStop = stops[stops.length - 1];

    if (istSec >= firstStop.depSec && istSec <= lastStop.arrSec) {
      // Find current stop segment
      for (let i = 0; i < stops.length - 1; i++) {
        const cur = stops[i];
        const next = stops[i + 1];

        // 1. Train is moving between cur and next station
        if (istSec >= cur.depSec && istSec <= next.arrSec) {
          const segDuration = next.arrSec - cur.depSec;
          const progress = segDuration > 0 ? (istSec - cur.depSec) / segDuration : 0;
          const c1 = STATIONS[cur.stopCode] || { lat: 12.9757, lon: 77.585, name: cur.stopCode };
          const c2 = STATIONS[next.stopCode] || { lat: 12.9757, lon: 77.585, name: next.stopCode };

          const lat = c1.lat + (c2.lat - c1.lat) * progress;
          const lng = c1.lon + (c2.lon - c1.lon) * progress;
          const bearing = calculateBearing(c1.lat, c1.lon, c2.lat, c2.lon);

          const trainNumber = `${line === "Purple" ? "P" : line === "Green" ? "G" : "Y"}-${tid.replace(/[^0-9]/g, "") || i + 101}`;

          activeTrains.push({
            trainId: trainNumber,
            tripId: tid,
            line,
            lineColor,
            headsign: meta.headsign || (meta.directionId === 0 ? "Challaghatta / Mysore Rd" : "Whitefield (Kadugodi)"),
            directionId: meta.directionId,
            lat,
            lng,
            bearing,
            speed: Math.round(48 + (tid.length % 12)),
            currentStationCode: cur.stopCode,
            currentStationName: c1.name,
            nextStationCode: next.stopCode,
            nextStationName: c2.name,
            etaNextStationSeconds: Math.max(0, next.arrSec - istSec),
            isDwelling: false,
            progressPercent: Math.round(progress * 100),
            occupancyPercent: Math.min(96, baseOccupancy + (i % 12)),
            crowdLevel,
            updatedAt: istTimeStr,
          });
          break;
        }

        // 2. Train is dwelling at platform (doors open for passenger boarding)
        if (istSec >= cur.arrSec && istSec < cur.depSec) {
          const c1 = STATIONS[cur.stopCode] || { lat: 12.9757, lon: 77.585, name: cur.stopCode };
          const c2 = STATIONS[next.stopCode] || { lat: 12.9757, lon: 77.585, name: next.stopCode };
          const bearing = calculateBearing(c1.lat, c1.lon, c2.lat, c2.lon);
          const trainNumber = `${line === "Purple" ? "P" : line === "Green" ? "G" : "Y"}-${tid.replace(/[^0-9]/g, "") || i + 101}`;

          activeTrains.push({
            trainId: trainNumber,
            tripId: tid,
            line,
            lineColor,
            headsign: meta.headsign || (meta.directionId === 0 ? "Challaghatta / Mysore Rd" : "Whitefield (Kadugodi)"),
            directionId: meta.directionId,
            lat: c1.lat,
            lng: c1.lon,
            bearing,
            speed: 0,
            currentStationCode: cur.stopCode,
            currentStationName: c1.name,
            nextStationCode: next.stopCode,
            nextStationName: c2.name,
            etaNextStationSeconds: next.arrSec - istSec,
            isDwelling: true,
            progressPercent: 0,
            occupancyPercent: Math.min(96, baseOccupancy + (i % 12)),
            crowdLevel,
            updatedAt: istTimeStr,
          });
          break;
        }
      }
    }
  }

  return activeTrains;
}

// Plan optimal journey across Purple, Green, and Yellow Lines with Interchanges
export function planMetroJourney(fromInput: string, toInput: string): PlannedMetroJourney | null {
  initBmrclGtfs();

  const origin = resolveStation(fromInput);
  const destination = resolveStation(toInput);

  if (!origin || !destination) return null;
  if (origin.id === destination.id) {
    return {
      success: true,
      origin,
      destination,
      routeType: "DIRECT",
      lines: origin.lines,
      primaryLine: origin.lines[0] || "Purple",
      interchange: null,
      interchanges: [],
      totalStops: 1,
      totalDurationMinutes: 0,
      path: [origin],
      fare: { token: 10, smartCardPeak: 9.5, smartCardOffPeak: 9.0, qr: 9.5, currency: "INR" },
      nextTrain: getNextTrainTimings(origin.id, origin.name),
    };
  }

  // 1. Direct Route on Purple Line
  const pFromIdx = PURPLE_SEQUENCE.indexOf(origin.id);
  const pToIdx = PURPLE_SEQUENCE.indexOf(destination.id);
  if (pFromIdx !== -1 && pToIdx !== -1) {
    const slice = pFromIdx <= pToIdx
      ? PURPLE_SEQUENCE.slice(pFromIdx, pToIdx + 1)
      : PURPLE_SEQUENCE.slice(pToIdx, pFromIdx + 1).reverse();
    const pathStations = slice.map((id) => STATIONS[id]).filter(Boolean);
    const directionId = pFromIdx < pToIdx ? 1 : 0;
    const headsign = pFromIdx < pToIdx ? "Whitefield (Kadugodi)" : "Challaghatta";
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, directionId);

    return {
      success: true,
      origin,
      destination,
      routeType: "DIRECT",
      lines: ["Purple"],
      primaryLine: "Purple",
      interchange: null,
      interchanges: [],
      totalStops: pathStations.length,
      totalDurationMinutes: Math.round(pathStations.length * 1.8),
      path: pathStations,
      fare,
      nextTrain,
    };
  }

  // 2. Direct Route on Green Line
  const gFromIdx = GREEN_SEQUENCE.indexOf(origin.id);
  const gToIdx = GREEN_SEQUENCE.indexOf(destination.id);
  if (gFromIdx !== -1 && gToIdx !== -1) {
    const slice = gFromIdx <= gToIdx
      ? GREEN_SEQUENCE.slice(gFromIdx, gToIdx + 1)
      : GREEN_SEQUENCE.slice(gToIdx, gFromIdx + 1).reverse();
    const pathStations = slice.map((id) => STATIONS[id]).filter(Boolean);
    const directionId = gFromIdx < gToIdx ? 1 : 0;
    const headsign = gFromIdx < gToIdx ? "Madavara" : "Silk Institute";
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, directionId);

    return {
      success: true,
      origin,
      destination,
      routeType: "DIRECT",
      lines: ["Green"],
      primaryLine: "Green",
      interchange: null,
      interchanges: [],
      totalStops: pathStations.length,
      totalDurationMinutes: Math.round(pathStations.length * 1.8),
      path: pathStations,
      fare,
      nextTrain,
    };
  }

  // 3. Direct Route on Yellow Line
  const yFromIdx = YELLOW_SEQUENCE.indexOf(origin.id);
  const yToIdx = YELLOW_SEQUENCE.indexOf(destination.id);
  if (yFromIdx !== -1 && yToIdx !== -1) {
    const slice = yFromIdx <= yToIdx
      ? YELLOW_SEQUENCE.slice(yFromIdx, yToIdx + 1)
      : YELLOW_SEQUENCE.slice(yToIdx, yFromIdx + 1).reverse();
    const pathStations = slice.map((id) => STATIONS[id]).filter(Boolean);
    const directionId = yFromIdx < yToIdx ? 1 : 0;
    const headsign = yFromIdx < yToIdx ? "Delta Electronics Bommasandra" : "Rashtreeya Vidyalaya Road";
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, directionId);

    return {
      success: true,
      origin,
      destination,
      routeType: "DIRECT",
      lines: ["Yellow"],
      primaryLine: "Yellow",
      interchange: null,
      interchanges: [],
      totalStops: pathStations.length,
      totalDurationMinutes: Math.round(pathStations.length * 1.8),
      path: pathStations,
      fare,
      nextTrain,
    };
  }

  // 4. Interchange: Purple <-> Green via Majestic (KGWA)
  const isFromPurple = pFromIdx !== -1;
  const isToPurple = pToIdx !== -1;
  const isFromGreen = gFromIdx !== -1;
  const isToGreen = gToIdx !== -1;

  if ((isFromPurple && isToGreen) || (isFromGreen && isToPurple)) {
    const majesticStation = STATIONS["KGWA"];
    let leg1: string[] = [];
    let leg2: string[] = [];
    let fromLine = "";
    let toLine = "";
    let initialDir = 0;

    if (isFromPurple && isToGreen) {
      fromLine = "Purple";
      toLine = "Green";
      const mPIdx = PURPLE_SEQUENCE.indexOf("KGWA");
      leg1 = pFromIdx <= mPIdx
        ? PURPLE_SEQUENCE.slice(pFromIdx, mPIdx + 1)
        : PURPLE_SEQUENCE.slice(mPIdx, pFromIdx + 1).reverse();
      initialDir = pFromIdx < mPIdx ? 1 : 0;

      const mGIdx = GREEN_SEQUENCE.indexOf("KGWA");
      leg2 = mGIdx <= gToIdx
        ? GREEN_SEQUENCE.slice(mGIdx + 1, gToIdx + 1)
        : GREEN_SEQUENCE.slice(gToIdx, mGIdx).reverse();
    } else {
      fromLine = "Green";
      toLine = "Purple";
      const mGIdx = GREEN_SEQUENCE.indexOf("KGWA");
      leg1 = gFromIdx <= mGIdx
        ? GREEN_SEQUENCE.slice(gFromIdx, mGIdx + 1)
        : GREEN_SEQUENCE.slice(mGIdx, gFromIdx + 1).reverse();
      initialDir = gFromIdx < mGIdx ? 1 : 0;

      const mPIdx = PURPLE_SEQUENCE.indexOf("KGWA");
      leg2 = mPIdx <= pToIdx
        ? PURPLE_SEQUENCE.slice(mPIdx + 1, pToIdx + 1)
        : PURPLE_SEQUENCE.slice(pToIdx, mPIdx).reverse();
    }

    const fullCodes = [...leg1, ...leg2];
    const pathStations = fullCodes.map((id) => STATIONS[id]).filter(Boolean);
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, initialDir);

    const interchangeInfo: InterchangeInfo = {
      station: majesticStation,
      fromLine,
      toLine,
      transferWalkMinutes: 3,
    };

    return {
      success: true,
      origin,
      destination,
      routeType: "SINGLE_INTERCHANGE",
      lines: [fromLine, toLine],
      primaryLine: fromLine,
      interchange: interchangeInfo,
      interchanges: [interchangeInfo],
      totalStops: pathStations.length,
      totalDurationMinutes: Math.round(pathStations.length * 1.8 + 4),
      path: pathStations,
      fare,
      nextTrain,
    };
  }

  // 5. Interchange: Green <-> Yellow via RV Road (RVR)
  const isFromYellow = yFromIdx !== -1;
  const isToYellow = yToIdx !== -1;

  if ((isFromGreen && isToYellow) || (isFromYellow && isToGreen)) {
    const rvRoadStation = STATIONS["RVR"];
    let leg1: string[] = [];
    let leg2: string[] = [];
    let fromLine = "";
    let toLine = "";
    let initialDir = 0;

    if (isFromGreen && isToYellow) {
      fromLine = "Green";
      toLine = "Yellow";
      const rvrGIdx = GREEN_SEQUENCE.indexOf("RVR");
      leg1 = gFromIdx <= rvrGIdx
        ? GREEN_SEQUENCE.slice(gFromIdx, rvrGIdx + 1)
        : GREEN_SEQUENCE.slice(rvrGIdx, gFromIdx + 1).reverse();
      initialDir = gFromIdx < rvrGIdx ? 1 : 0;

      const rvrYIdx = YELLOW_SEQUENCE.indexOf("RVR");
      leg2 = rvrYIdx <= yToIdx
        ? YELLOW_SEQUENCE.slice(rvrYIdx + 1, yToIdx + 1)
        : YELLOW_SEQUENCE.slice(yToIdx, rvrYIdx).reverse();
    } else {
      fromLine = "Yellow";
      toLine = "Green";
      const rvrYIdx = YELLOW_SEQUENCE.indexOf("RVR");
      leg1 = yFromIdx <= rvrYIdx
        ? YELLOW_SEQUENCE.slice(yFromIdx, rvrYIdx + 1)
        : YELLOW_SEQUENCE.slice(rvrYIdx, yFromIdx + 1).reverse();
      initialDir = 0;

      const rvrGIdx = GREEN_SEQUENCE.indexOf("RVR");
      leg2 = rvrGIdx <= gToIdx
        ? GREEN_SEQUENCE.slice(rvrGIdx + 1, gToIdx + 1)
        : GREEN_SEQUENCE.slice(gToIdx, rvrGIdx).reverse();
    }

    const fullCodes = [...leg1, ...leg2];
    const pathStations = fullCodes.map((id) => STATIONS[id]).filter(Boolean);
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, initialDir);

    const interchangeInfo: InterchangeInfo = {
      station: rvRoadStation,
      fromLine,
      toLine,
      transferWalkMinutes: 2,
    };

    return {
      success: true,
      origin,
      destination,
      routeType: "SINGLE_INTERCHANGE",
      lines: [fromLine, toLine],
      primaryLine: fromLine,
      interchange: interchangeInfo,
      interchanges: [interchangeInfo],
      totalStops: pathStations.length,
      totalDurationMinutes: Math.round(pathStations.length * 1.8 + 3),
      path: pathStations,
      fare,
      nextTrain,
    };
  }

  // 6. Double Interchange: Purple <-> Yellow via Majestic (KGWA) & RV Road (RVR)
  if ((isFromPurple && isToYellow) || (isFromYellow && isToPurple)) {
    const majesticStation = STATIONS["KGWA"];
    const rvRoadStation = STATIONS["RVR"];
    const interchanges: InterchangeInfo[] = [
      {
        station: majesticStation,
        fromLine: isFromPurple ? "Purple" : "Green",
        toLine: isFromPurple ? "Green" : "Purple",
        transferWalkMinutes: 3,
      },
      {
        station: rvRoadStation,
        fromLine: isFromPurple ? "Green" : "Yellow",
        toLine: isFromPurple ? "Yellow" : "Green",
        transferWalkMinutes: 2,
      },
    ];

    let fullCodes: string[] = [];
    let initialDir = 0;

    if (isFromPurple && isToYellow) {
      const mPIdx = PURPLE_SEQUENCE.indexOf("KGWA");
      const leg1 = pFromIdx <= mPIdx
        ? PURPLE_SEQUENCE.slice(pFromIdx, mPIdx + 1)
        : PURPLE_SEQUENCE.slice(mPIdx, pFromIdx + 1).reverse();
      initialDir = pFromIdx < mPIdx ? 1 : 0;

      const mGIdx = GREEN_SEQUENCE.indexOf("KGWA");
      const rvrGIdx = GREEN_SEQUENCE.indexOf("RVR");
      const leg2 = GREEN_SEQUENCE.slice(rvrGIdx, mGIdx).reverse();

      const rvrYIdx = YELLOW_SEQUENCE.indexOf("RVR");
      const leg3 = YELLOW_SEQUENCE.slice(rvrYIdx + 1, yToIdx + 1);

      fullCodes = [...leg1, ...leg2, ...leg3];
    } else {
      const rvrYIdx = YELLOW_SEQUENCE.indexOf("RVR");
      const leg1 = YELLOW_SEQUENCE.slice(0, yFromIdx + 1).reverse();
      initialDir = 0;

      const mGIdx = GREEN_SEQUENCE.indexOf("KGWA");
      const rvrGIdx = GREEN_SEQUENCE.indexOf("RVR");
      const leg2 = GREEN_SEQUENCE.slice(rvrGIdx + 1, mGIdx + 1);

      const mPIdx = PURPLE_SEQUENCE.indexOf("KGWA");
      const leg3 = mPIdx <= pToIdx
        ? PURPLE_SEQUENCE.slice(mPIdx + 1, pToIdx + 1)
        : PURPLE_SEQUENCE.slice(pToIdx, mPIdx).reverse();

      fullCodes = [...leg1, ...leg2, ...leg3];
    }

    const pathStations = fullCodes.map((id) => STATIONS[id]).filter(Boolean);
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, initialDir);

    return {
      success: true,
      origin,
      destination,
      routeType: "DOUBLE_INTERCHANGE",
      lines: isFromPurple ? ["Purple", "Green", "Yellow"] : ["Yellow", "Green", "Purple"],
      primaryLine: isFromPurple ? "Purple" : "Yellow",
      interchange: interchanges[0],
      interchanges,
      totalStops: pathStations.length,
      totalDurationMinutes: Math.round(pathStations.length * 1.8 + 6),
      path: pathStations,
      fare,
      nextTrain,
    };
  }

  return null;
}
