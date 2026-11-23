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
  isOperating: boolean;
  statusMessage: string;
  upcomingDepartures: string[];
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

// In-memory GTFS caches
let isInitialized = false;
const STATIONS: Record<string, MetroStation> = {};
const NAME_TO_ID_INDEX: Record<string, string> = {};

// Official Station Code Sequences from BMRCL GTFS
const PURPLE_SEQUENCE: string[] = [
  "CLGA", "KGIT", "MLSD", "PATG", "BGUC", "RRRN", "NYHM", "MYRD", "DJNR", "AGPP",
  "VJN", "HSLI", "MIRD", "BRCS", "KGWA", "VSWA", "VDSA", "CBPK", "MAGR", "TTY",
  "HLRU", "IDN", "SVRD", "BYPH", "JTPM", "KRAM", "MDVP", "GDCP", "DKIA", "VWIA",
  "KDNH", "VDHP", "SSHP", "ITPL", "KDGD", "UWVL", "WHTM"
];

const GREEN_SEQUENCE: string[] = [
  "APTS", "TGTP", "VJRH", "KLPK", "APRC", "PUTH", "JPN", "BSNK", "RVR", "JYN",
  "SECE", "LBGH", "NLC", "KRMT", "CKPE", "KGWA", "SPGD", "SPRU", "KVPR", "RJNR",
  "MHLI", "SSFY", "YPM", "YPI", "PEYA", "PYID", "JLHL", "DSH", "NGSA", "MNJN",
  "JIDL", "BIET"
];

const YELLOW_SEQUENCE: string[] = [
  "RVR", "RGDT", "JDHP", "BTML", "SBJT", "HSRL", "OFDC", "MSRN", "CKBR", "BSRD",
  "HOSR", "ETCT", "ECTN", "HSKR", "HBGI", "BMSD"
];

const FARE_MATRIX: Record<string, number> = {};
// Timetable departures by station code and direction: key = `${stationCode}_${direction}` -> sorted array of seconds from midnight
const DEPARTURES_BY_STATION: Record<string, number[]> = {};
const PLATFORM_MAP: Record<string, string> = {};

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

function secondsToTimeStr(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function timeStrToSeconds(str: string): number {
  const [h, m, s] = str.split(":").map(Number);
  return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
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
          // Add common clean alias
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

    // 3. Parse stop_times.txt for real departure timetables
    const stopTimesPath = path.join(dataDir, "stop_times.txt");
    if (fs.existsSync(stopTimesPath)) {
      const raw = fs.readFileSync(stopTimesPath, "utf8");
      const lines = raw.split("\n");
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]?.trim();
        if (!line) continue;
        const parts = line.split(",");
        const depTime = parts[2];
        const stopId = parts[3];
        if (!depTime || !stopId) continue;

        const stationCode = stopId.split("_")[0];
        if (!stationCode) continue;

        if (!DEPARTURES_BY_STATION[stationCode]) {
          DEPARTURES_BY_STATION[stationCode] = [];
        }
        const secs = timeStrToSeconds(depTime);
        DEPARTURES_BY_STATION[stationCode].push(secs);

        // Store platform info if present
        if (stopId.includes("_PF")) {
          const pfNum = stopId.split("_PF")[1];
          PLATFORM_MAP[stationCode] = `Platform ${pfNum || 1}`;
        }
      }

      // Sort and deduplicate departure seconds for O(log N) binary search
      for (const code of Object.keys(DEPARTURES_BY_STATION)) {
        DEPARTURES_BY_STATION[code] = Array.from(new Set(DEPARTURES_BY_STATION[code])).sort((a, b) => a - b);
      }
    }

    isInitialized = true;
  } catch (err) {
    console.error("Error initializing BMRCL GTFS data:", err);
  }
}

// Resolve any user query (e.g. "Majestic", "indiranagar", "KGWA", "Whitefield") to canonical MetroStation
export function resolveStation(input: string): MetroStation | null {
  initBmrclGtfs();
  if (!input) return null;
  const q = input.trim();
  const lower = q.toLowerCase();
  const clean = lower.replace(/[^a-z0-9]/g, "");

  // 1. Direct code lookup
  const upper = q.toUpperCase();
  if (STATIONS[upper]) return STATIONS[upper];

  // 2. Common high-priority aliases
  if (lower.includes("majestic") || lower.includes("kempegowda")) return STATIONS["KGWA"] || null;
  if (lower.includes("silk board") || lower.includes("silkboard")) return STATIONS["SBJT"] || null;
  if (lower.includes("rv road") || lower.includes("rashtreeya")) return STATIONS["RVR"] || null;
  if (lower.includes("mg road") || lower.includes("mgroad")) return STATIONS["MAGR"] || null;
  if (lower.includes("indiranagar")) return STATIONS["IDN"] || null;
  if (lower.includes("whitefield")) return STATIONS["WHTM"] || null;
  if (lower.includes("electronic city")) return STATIONS["ETCT"] || null;
  if (lower.includes("bommasandra")) return STATIONS["BMSD"] || null;
  if (lower.includes("challaghatta")) return STATIONS["CLGA"] || null;
  if (lower.includes("madavara")) return STATIONS["BIET"] || null;
  if (lower.includes("vidhana soudha") || lower.includes("ambedkar")) return STATIONS["VDSA"] || null;
  if (lower.includes("cubbon")) return STATIONS["CBPK"] || null;
  if (lower.includes("yeshwantpur") || lower.includes("yeshwanthpur")) return STATIONS["YPM"] || null;
  if (lower.includes("jayanagar")) return STATIONS["JYN"] || null;
  if (lower.includes("banashankari")) return STATIONS["BSNK"] || null;

  // 3. Direct name index lookup
  if (NAME_TO_ID_INDEX[lower]) return STATIONS[NAME_TO_ID_INDEX[lower]];
  if (NAME_TO_ID_INDEX[clean]) return STATIONS[NAME_TO_ID_INDEX[clean]];

  // 4. Substring match
  for (const [name, id] of Object.entries(NAME_TO_ID_INDEX)) {
    if (name.length > 3 && (name.includes(lower) || lower.includes(name))) {
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
export function getNextTrainTimings(stationCode: string, destinationHeadsign: string): NextTrainInfo {
  initBmrclGtfs();

  // Current IST Time calculation
  const now = new Date();
  const istDateString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istDateString);
  const currentIstSeconds = istDate.getHours() * 3600 + istDate.getMinutes() * 60 + istDate.getSeconds();
  const currentIstTime = secondsToTimeStr(currentIstSeconds);

  const departures = DEPARTURES_BY_STATION[stationCode] || [];
  const platform = PLATFORM_MAP[stationCode] || "Platform 1";

  if (departures.length === 0) {
    // Fallback frequency-based schedule: Trains every 5 mins from 05:00 to 23:00
    const startSec = 5 * 3600;
    const endSec = 23 * 3600;
    if (currentIstSeconds >= startSec && currentIstSeconds <= endSec) {
      const waitSec = 300 - (currentIstSeconds % 300);
      const nextSec = currentIstSeconds + waitSec;
      return {
        currentIstTime,
        nextDepartureTime: secondsToTimeStr(nextSec),
        etaMinutes: Math.max(1, Math.round(waitSec / 60)),
        countdownSeconds: waitSec,
        headsign: destinationHeadsign,
        platform,
        isOperating: true,
        statusMessage: `Next metro train in ${Math.round(waitSec / 60)} mins`,
        upcomingDepartures: [secondsToTimeStr(nextSec + 300), secondsToTimeStr(nextSec + 600)],
      };
    } else {
      return {
        currentIstTime,
        nextDepartureTime: "05:00:00",
        etaMinutes: 0,
        countdownSeconds: 0,
        headsign: destinationHeadsign,
        platform,
        isOperating: false,
        statusMessage: "Metro operations closed. Services resume tomorrow at 05:00 AM IST.",
        upcomingDepartures: ["05:10:00", "05:20:00"],
      };
    }
  }

  // Find next departure >= currentIstSeconds
  let nextSec: number | null = null;
  let upcoming: string[] = [];

  for (let i = 0; i < departures.length; i++) {
    if (departures[i] >= currentIstSeconds) {
      nextSec = departures[i];
      upcoming = departures.slice(i + 1, i + 4).map(secondsToTimeStr);
      break;
    }
  }

  if (nextSec !== null) {
    const diffSec = nextSec - currentIstSeconds;
    const etaMins = Math.max(1, Math.round(diffSec / 60));
    return {
      currentIstTime,
      nextDepartureTime: secondsToTimeStr(nextSec),
      etaMinutes: etaMins,
      countdownSeconds: diffSec,
      headsign: destinationHeadsign,
      platform,
      isOperating: true,
      statusMessage: `Arriving in ${etaMins} mins (${secondsToTimeStr(nextSec)} IST)`,
      upcomingDepartures: upcoming,
    };
  } else {
    // Past last train of the night
    const firstTomorrowSec = departures[0] || 5 * 3600;
    return {
      currentIstTime,
      nextDepartureTime: secondsToTimeStr(firstTomorrowSec),
      etaMinutes: 0,
      countdownSeconds: 0,
      headsign: destinationHeadsign,
      platform,
      isOperating: false,
      statusMessage: `Night revenue service ended. First morning train tomorrow at ${secondsToTimeStr(firstTomorrowSec)} IST.`,
      upcomingDepartures: departures.slice(1, 4).map(secondsToTimeStr),
    };
  }
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

  // 1. Check for Direct Route on Purple Line
  const pFromIdx = PURPLE_SEQUENCE.indexOf(origin.id);
  const pToIdx = PURPLE_SEQUENCE.indexOf(destination.id);
  if (pFromIdx !== -1 && pToIdx !== -1) {
    const slice = pFromIdx <= pToIdx
      ? PURPLE_SEQUENCE.slice(pFromIdx, pToIdx + 1)
      : PURPLE_SEQUENCE.slice(pToIdx, pFromIdx + 1).reverse();
    const pathStations = slice.map((id) => STATIONS[id]).filter(Boolean);
    const headsign = pFromIdx < pToIdx ? "Whitefield (Kadugodi)" : "Challaghatta";
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, headsign);

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

  // 2. Check for Direct Route on Green Line
  const gFromIdx = GREEN_SEQUENCE.indexOf(origin.id);
  const gToIdx = GREEN_SEQUENCE.indexOf(destination.id);
  if (gFromIdx !== -1 && gToIdx !== -1) {
    const slice = gFromIdx <= gToIdx
      ? GREEN_SEQUENCE.slice(gFromIdx, gToIdx + 1)
      : GREEN_SEQUENCE.slice(gToIdx, gFromIdx + 1).reverse();
    const pathStations = slice.map((id) => STATIONS[id]).filter(Boolean);
    const headsign = gFromIdx < gToIdx ? "Madavara" : "Silk Institute";
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, headsign);

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

  // 3. Check for Direct Route on Yellow Line
  const yFromIdx = YELLOW_SEQUENCE.indexOf(origin.id);
  const yToIdx = YELLOW_SEQUENCE.indexOf(destination.id);
  if (yFromIdx !== -1 && yToIdx !== -1) {
    const slice = yFromIdx <= yToIdx
      ? YELLOW_SEQUENCE.slice(yFromIdx, yToIdx + 1)
      : YELLOW_SEQUENCE.slice(yToIdx, yFromIdx + 1).reverse();
    const pathStations = slice.map((id) => STATIONS[id]).filter(Boolean);
    const headsign = yFromIdx < yToIdx ? "Delta Electronics Bommasandra" : "Rashtreeya Vidyalaya Road";
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, headsign);

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
    let initialHeadsign = "";

    if (isFromPurple && isToGreen) {
      fromLine = "Purple";
      toLine = "Green";
      const mPIdx = PURPLE_SEQUENCE.indexOf("KGWA");
      leg1 = pFromIdx <= mPIdx
        ? PURPLE_SEQUENCE.slice(pFromIdx, mPIdx + 1)
        : PURPLE_SEQUENCE.slice(mPIdx, pFromIdx + 1).reverse();
      initialHeadsign = pFromIdx < mPIdx ? "Whitefield (Kadugodi)" : "Challaghatta";

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
      initialHeadsign = gFromIdx < mGIdx ? "Madavara" : "Silk Institute";

      const mPIdx = PURPLE_SEQUENCE.indexOf("KGWA");
      leg2 = mPIdx <= pToIdx
        ? PURPLE_SEQUENCE.slice(mPIdx + 1, pToIdx + 1)
        : PURPLE_SEQUENCE.slice(pToIdx, mPIdx).reverse();
    }

    const fullCodes = [...leg1, ...leg2];
    const pathStations = fullCodes.map((id) => STATIONS[id]).filter(Boolean);
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, initialHeadsign);

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
      totalDurationMinutes: Math.round(pathStations.length * 1.8 + 4), // 4 mins transfer buffer
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
    let initialHeadsign = "";

    if (isFromGreen && isToYellow) {
      fromLine = "Green";
      toLine = "Yellow";
      const rvrGIdx = GREEN_SEQUENCE.indexOf("RVR");
      leg1 = gFromIdx <= rvrGIdx
        ? GREEN_SEQUENCE.slice(gFromIdx, rvrGIdx + 1)
        : GREEN_SEQUENCE.slice(rvrGIdx, gFromIdx + 1).reverse();
      initialHeadsign = gFromIdx < rvrGIdx ? "Madavara" : "Silk Institute";

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
      initialHeadsign = "Rashtreeya Vidyalaya Road";

      const rvrGIdx = GREEN_SEQUENCE.indexOf("RVR");
      leg2 = rvrGIdx <= gToIdx
        ? GREEN_SEQUENCE.slice(rvrGIdx + 1, gToIdx + 1)
        : GREEN_SEQUENCE.slice(gToIdx, rvrGIdx).reverse();
    }

    const fullCodes = [...leg1, ...leg2];
    const pathStations = fullCodes.map((id) => STATIONS[id]).filter(Boolean);
    const fare = calculateMetroFare(origin.id, destination.id, pathStations.length);
    const nextTrain = getNextTrainTimings(origin.id, initialHeadsign);

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
    let initialHeadsign = "";

    if (isFromPurple && isToYellow) {
      const mPIdx = PURPLE_SEQUENCE.indexOf("KGWA");
      const leg1 = pFromIdx <= mPIdx
        ? PURPLE_SEQUENCE.slice(pFromIdx, mPIdx + 1)
        : PURPLE_SEQUENCE.slice(mPIdx, pFromIdx + 1).reverse();
      initialHeadsign = pFromIdx < mPIdx ? "Whitefield (Kadugodi)" : "Challaghatta";

      const mGIdx = GREEN_SEQUENCE.indexOf("KGWA");
      const rvrGIdx = GREEN_SEQUENCE.indexOf("RVR");
      const leg2 = GREEN_SEQUENCE.slice(rvrGIdx, mGIdx).reverse(); // Majestic southwards to RV Road

      const rvrYIdx = YELLOW_SEQUENCE.indexOf("RVR");
      const leg3 = YELLOW_SEQUENCE.slice(rvrYIdx + 1, yToIdx + 1);

      fullCodes = [...leg1, ...leg2, ...leg3];
    } else {
      const rvrYIdx = YELLOW_SEQUENCE.indexOf("RVR");
      const leg1 = YELLOW_SEQUENCE.slice(0, yFromIdx + 1).reverse();
      initialHeadsign = "Rashtreeya Vidyalaya Road";

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
    const nextTrain = getNextTrainTimings(origin.id, initialHeadsign);

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
