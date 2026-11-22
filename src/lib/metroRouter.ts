import metroData from "@/data/namma_metro.json";

export interface MetroStationNode {
  id: string;
  name: string;
  lat: number;
  lon: number;
  lines: string[];
  isInterchange: boolean;
}

export interface MetroRouteResult {
  path: MetroStationNode[];
  stationIds: string[];
  lines: string[];
  coordinates: [number, number][];
  stops: number;
  interchange: boolean;
  transferInfo: {
    station: MetroStationNode;
    fromLine: string;
    toLine: string;
  } | null;
  mainLine: string;
  fare: number;
  durationMinutes: number;
}

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

export function findMetroRoute(startId: string, endId: string): { path: string[]; lines: string[] } | null {
  if (!startId || !endId) return null;
  if (startId === endId) return { path: [startId], lines: [] };

  const queue: { id: string; path: string[]; lines: string[] }[] = [
    { id: startId, path: [startId], lines: [] },
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
          lines: [...cur.lines, n.line],
        });
      }
    }
  }
  return null;
}

function approxDistMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLat = (lat2 - lat1) * 111000;
  const dLon = (lon2 - lon1) * 111000 * Math.cos((lat1 * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

/**
 * Extracts the slice of real metro track coordinates between two stations on a specific line.
 * If no matching line segment is within 650m, cleanly falls back to the station-to-station chord.
 */
export function getLegGeometry(
  lineName: string,
  sA: { lat: number; lon: number },
  sB: { lat: number; lon: number }
): [number, number][] {
  const sACoord: [number, number] = [sA.lat, sA.lon];
  const sBCoord: [number, number] = [sB.lat, sB.lon];
  const lineKey = lineName.toLowerCase();

  const matchingSegs = metroData.lines
    .filter((l) => l.lineKey === lineKey)
    .map((l) => l.coordinates as [number, number][]);

  let bestPts: [number, number][] | null = null;
  let minCombinedDist = Infinity;

  for (const seg of matchingSegs) {
    if (!seg || seg.length < 2) continue;

    let iA = 0;
    let minDA = Infinity;
    let iB = 0;
    let minDB = Infinity;

    for (let i = 0; i < seg.length; i++) {
      const dA = approxDistMeters(seg[i][0], seg[i][1], sACoord[0], sACoord[1]);
      if (dA < minDA) {
        minDA = dA;
        iA = i;
      }
      const dB = approxDistMeters(seg[i][0], seg[i][1], sBCoord[0], sBCoord[1]);
      if (dB < minDB) {
        minDB = dB;
        iB = i;
      }
    }

    if (minDA < 650 && minDB < 650 && (minDA + minDB) < minCombinedDist) {
      minCombinedDist = minDA + minDB;
      const sub = iA <= iB ? seg.slice(iA, iB + 1) : seg.slice(iB, iA + 1).reverse();
      bestPts = [sACoord, ...sub, sBCoord];
    }
  }

  return bestPts || [sACoord, sBCoord];
}

/**
 * Returns continuous high-resolution coordinates tracing the full metro route
 * between startStationId and endStationId along actual tracks and through all stops.
 */
export function getMetroRouteGeometry(startStationId: string, endStationId: string): [number, number][] {
  if (!startStationId || !endStationId || startStationId === endStationId) return [];

  const stations = metroData.stations as MetroStationNode[];
  const stationMap = new Map<string, MetroStationNode>();
  for (const s of stations) {
    stationMap.set(s.id, s);
  }

  const sStart = stationMap.get(startStationId);
  const sEnd = stationMap.get(endStationId);
  if (!sStart || !sEnd) return [];

  const route = findMetroRoute(startStationId, endStationId);
  if (!route || route.path.length < 2) {
    return [
      [sStart.lat, sStart.lon],
      [sEnd.lat, sEnd.lon],
    ];
  }

  const fullCoords: [number, number][] = [];

  for (let i = 0; i < route.path.length - 1; i++) {
    const u = stationMap.get(route.path[i]);
    const v = stationMap.get(route.path[i + 1]);
    const lineName = route.lines[i] || (u?.lines[0] ?? "Purple");

    if (!u || !v) continue;

    const leg = getLegGeometry(lineName, u, v);
    for (const pt of leg) {
      if (fullCoords.length === 0) {
        fullCoords.push(pt);
      } else {
        const last = fullCoords[fullCoords.length - 1];
        // Deduplicate consecutive identical/near-identical points (< 1.5m)
        if (approxDistMeters(last[0], last[1], pt[0], pt[1]) > 1.5) {
          fullCoords.push(pt);
        }
      }
    }
  }

  return fullCoords;
}

/**
 * Calculates complete trip metrics (fare, duration, stops, path stations, interchange info, geometry)
 */
export function calculateMetroTrip(startStationId: string, endStationId: string): MetroRouteResult | null {
  if (!startStationId || !endStationId || startStationId === endStationId) return null;

  const stations = metroData.stations as MetroStationNode[];
  const stationMap = new Map<string, MetroStationNode>();
  for (const s of stations) {
    stationMap.set(s.id, s);
  }

  const originStation = stationMap.get(startStationId);
  const destStation = stationMap.get(endStationId);
  if (!originStation || !destStation) return null;

  const routeResult = findMetroRoute(startStationId, endStationId);
  if (!routeResult || routeResult.path.length < 2) {
    const distKm = approxDistMeters(originStation.lat, originStation.lon, destStation.lat, destStation.lon) / 1000;
    const stops = Math.max(1, Math.min(35, Math.round(distKm / 1.15)));
    const interchange = !originStation.lines.some((l) => destStation.lines.includes(l));
    const fare = stops <= 1 ? 10 : stops <= 3 ? 15 : stops <= 5 ? 20 : stops <= 7 ? 25 : stops <= 10 ? 30 : stops <= 13 ? 35 : stops <= 16 ? 40 : stops <= 19 ? 45 : stops <= 23 ? 50 : 60;
    const duration = Math.round(stops * 2.3 + (interchange ? 5 : 2));

    return {
      path: [originStation, destStation],
      stationIds: [originStation.id, destStation.id],
      lines: [originStation.lines[0]],
      coordinates: [
        [originStation.lat, originStation.lon],
        [destStation.lat, destStation.lon],
      ],
      stops,
      interchange,
      transferInfo: null,
      mainLine: originStation.lines[0],
      fare,
      durationMinutes: duration,
    };
  }

  const pathStations = routeResult.path
    .map((id) => stationMap.get(id))
    .filter((s): s is MetroStationNode => !!s);

  let transferInfo: { station: MetroStationNode; fromLine: string; toLine: string } | null = null;
  for (let i = 0; i < routeResult.lines.length - 1; i++) {
    if (routeResult.lines[i] !== routeResult.lines[i + 1]) {
      const xferStation = stationMap.get(routeResult.path[i + 1]);
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

  const durationMinutes = Math.round(stops * 2.2 + (interchange ? 5 : 2));
  const coordinates = getMetroRouteGeometry(startStationId, endStationId);

  return {
    path: pathStations,
    stationIds: routeResult.path,
    lines: routeResult.lines,
    coordinates,
    stops,
    interchange,
    transferInfo,
    mainLine,
    fare,
    durationMinutes,
  };
}
