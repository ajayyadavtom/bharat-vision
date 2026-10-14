import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In-memory cache for O(1) route lookups & autocomplete
let routesByCodeCache: Record<string, any[]> | null = null;
let searchIndexCache: any[] | null = null;
let stopsCache: any[] | null = null;

let fleetStatsCache: any | null = null;

function loadBmtcData() {
  if (!routesByCodeCache) {
    try {
      const codePath = path.join(process.cwd(), "src/data/bmtc_routes_by_code.json");
      if (fs.existsSync(codePath)) {
        routesByCodeCache = JSON.parse(fs.readFileSync(codePath, "utf8"));
      }
    } catch (e) {
      console.error("Failed to load bmtc_routes_by_code.json:", e);
      routesByCodeCache = {};
    }
  }

  if (!searchIndexCache) {
    try {
      const indexPath = path.join(process.cwd(), "src/data/bmtc_search_index.json");
      if (fs.existsSync(indexPath)) {
        searchIndexCache = JSON.parse(fs.readFileSync(indexPath, "utf8"));
      }
    } catch (e) {
      console.error("Failed to load bmtc_search_index.json:", e);
      searchIndexCache = [];
    }
  }

  if (!stopsCache) {
    try {
      const stopsPath = path.join(process.cwd(), "src/data/bmtc_stops.json");
      if (fs.existsSync(stopsPath)) {
        stopsCache = JSON.parse(fs.readFileSync(stopsPath, "utf8"));
      }
    } catch (e) {
      console.error("Failed to load bmtc_stops.json:", e);
      stopsCache = [];
    }
  }

  if (!fleetStatsCache) {
    try {
      const fleetPath = path.join(process.cwd(), "src/data/bmtc_fleet_stats.json");
      if (fs.existsSync(fleetPath)) {
        fleetStatsCache = JSON.parse(fs.readFileSync(fleetPath, "utf8"));
      }
    } catch (e) {
      console.error("Failed to load bmtc_fleet_stats.json:", e);
      fleetStatsCache = null;
    }
  }
}

export async function GET(req: Request) {
  loadBmtcData();
  const { searchParams } = new URL(req.url);
  const busQuery = searchParams.get("bus");
  const destinationQuery = searchParams.get("destination");
  const searchQuery = searchParams.get("search");
  const stopSearchQuery = searchParams.get("stop") || searchParams.get("stops");
  const stopRoutesQuery = searchParams.get("stopRoutes");
  const routeStopsQuery = searchParams.get("routeStops");
  const fleetQuery = searchParams.get("fleet");
  const listAll = searchParams.get("list");

  // 1. Official Fleet Statistics & Divisional Performance (from 56f6deb2-c7ad-4ade-88fb-92190eafe19b.csv)
  if (fleetQuery === "true") {
    return NextResponse.json({
      fleet: fleetStatsCache || { message: "Fleet dataset not loaded" },
    });
  }

  // 2. Query routes passing through a specific stop
  if (stopRoutesQuery) {
    const q = stopRoutesQuery.toLowerCase().trim();
    const matchedStop = (stopsCache || []).find((s: any) =>
      s.name.toLowerCase() === q || s.name.toLowerCase().includes(q)
    );
    if (matchedStop && matchedStop.routesMap) {
      const routes = Object.entries(matchedStop.routesMap)
        .map(([route, trips]) => ({ route, trips: Number(trips) }))
        .sort((a, b) => b.trips - a.trips);
      return NextResponse.json({
        found: true,
        stopName: matchedStop.name,
        lat: matchedStop.lat,
        lon: matchedStop.lon,
        dailyTrips: matchedStop.dailyTrips || 0,
        routesCount: routes.length,
        routes,
      });
    }
    return NextResponse.json(
      { found: false, message: `Stop "${stopRoutesQuery}" not found or has no linked routes.` },
      { status: 404 }
    );
  }

  // 3. Query all stops for a specific route from the official stop network
  if (routeStopsQuery) {
    const cleanRoute = routeStopsQuery.trim().toUpperCase();
    const matchedStops = (stopsCache || [])
      .filter((s: any) => {
        if (!s.routesMap) return false;
        return Object.keys(s.routesMap).some(
          (r: string) => r.toUpperCase() === cleanRoute || r.toUpperCase().includes(cleanRoute)
        );
      })
      .map((s: any) => ({
        name: s.name,
        lat: s.lat,
        lon: s.lon,
        tripsOnThisRoute: s.routesMap ? s.routesMap[cleanRoute] || 0 : 0,
        totalDailyTrips: s.dailyTrips || 0,
      }))
      .sort((a: any, b: any) => b.tripsOnThisRoute - a.tripsOnThisRoute);

    return NextResponse.json({
      route: cleanRoute,
      stopsCount: matchedStops.length,
      stops: matchedStops,
    });
  }

  // 4. Search bus stops across all 5,409 stops with enriched dailyTrips and routes
  if (stopSearchQuery) {
    const q = stopSearchQuery.toLowerCase().trim();
    const matchedStops = (stopsCache || [])
      .filter((s: any) => s.name.toLowerCase().includes(q))
      .slice(0, 30)
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        lat: s.lat,
        lon: s.lon,
        dailyTrips: s.dailyTrips || null,
        routesCount: s.routesCount || null,
        topRoutes: s.topRoutes || [],
        routesMap: s.routesMap || undefined,
      }));
    return NextResponse.json({ stops: matchedStops });
  }

  // 2. List popular routes for instant autocomplete suggestions
  if (listAll === "true") {
    const list = (searchIndexCache || [])
      .sort((a, b) => (b.trip_count || 0) - (a.trip_count || 0))
      .slice(0, 50)
      .map((r) => ({
        routeNumber: r.name,
        cleanCode: r.clean_code,
        origin: r.origin,
        destination: r.destination,
        stopsCount: r.stops_count,
        tripCount: r.trip_count,
      }));
    return NextResponse.json({ routes: list });
  }

  // 3. Specific bus lookup with destination / direction matching
  if (busQuery) {
    const cleanBus = busQuery.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

    let matches = (routesByCodeCache && routesByCodeCache[cleanBus]) || [];

    // If no exact code match, try prefix match across index
    if (matches.length === 0 && searchIndexCache) {
      const prefixMatch = searchIndexCache.find(
        (r) => r.clean_code === cleanBus || r.clean_code.startsWith(cleanBus)
      );
      if (prefixMatch && routesByCodeCache) {
        matches = routesByCodeCache[prefixMatch.clean_code] || [];
      }
    }

    if (matches.length > 0) {
      // If destination query provided, pick the direction matching the destination
      let matchedRoute = matches[0];
      if (destinationQuery) {
        const destLower = destinationQuery.toLowerCase().trim();
        const destMatch = matches.find(
          (m) =>
            m.destination.toLowerCase().includes(destLower) ||
            m.full_name.toLowerCase().includes(destLower)
        );
        if (destMatch) matchedRoute = destMatch;
      }

      return NextResponse.json({
        found: true,
        route: {
          routeNumber: matchedRoute.name,
          cleanCode: matchedRoute.clean_code,
          fullName: matchedRoute.full_name,
          origin: matchedRoute.origin,
          destination: matchedRoute.destination,
          tripCount: matchedRoute.trip_count,
          timetable: matchedRoute.timetable || [],
          stopsCount: matchedRoute.stops?.length || 0,
          stops: matchedRoute.stops || [],
          stopCoordinates: (matchedRoute.stops || []).filter((s: any) => s.lat && s.lon),
          coordinates: matchedRoute.coordinates || [],
          availableDirections: matches.map((m: any) => ({
            name: m.name,
            origin: m.origin,
            destination: m.destination,
            tripCount: m.trip_count,
          })),
        },
      });
    }

    return NextResponse.json(
      { found: false, message: `Bus ${busQuery} not found in BMTC GTFS directory.` },
      { status: 404 }
    );
  }

  // 4. Search routes by keyword (e.g. Majestic, Silk Board, Whitefield, 500D)
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    const cleanQ = q.toUpperCase().replace(/[^A-Z0-9]/g, "");

    const results = (searchIndexCache || [])
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.clean_code.includes(cleanQ) ||
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q)
      )
      .slice(0, 30)
      .map((r) => ({
        routeNumber: r.name,
        cleanCode: r.clean_code,
        origin: r.origin,
        destination: r.destination,
        stopsCount: r.stops_count,
        tripCount: r.trip_count,
      }));

    return NextResponse.json({ results });
  }

  return NextResponse.json({
    message: "BMTC Official GTFS Real Transit API",
    totalRoutes: searchIndexCache?.length || 0,
    totalStops: stopsCache?.length || 0,
    officialDivisionsCount: fleetStatsCache?.divisionBreakdown2020?.length || 6,
    fleetUtilisation: fleetStatsCache?.bengaluruTotal2020?.fleetUtilisation || 85.1,
    latestFleetTotalHeld: fleetStatsCache?.bengaluruTotal2020?.busesHeld || 6514.9,
    latestFleetOnRoad: fleetStatsCache?.bengaluruTotal2020?.busesOnRoad || 5542.4,
  });
}
