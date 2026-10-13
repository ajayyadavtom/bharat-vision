import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// In-memory cache for O(1) route lookups & autocomplete
let routesByCodeCache: Record<string, any[]> | null = null;
let searchIndexCache: any[] | null = null;

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
}

export async function GET(req: Request) {
  loadBmtcData();
  const { searchParams } = new URL(req.url);
  const busQuery = searchParams.get("bus");
  const destinationQuery = searchParams.get("destination");
  const searchQuery = searchParams.get("search");
  const listAll = searchParams.get("list");

  // 1. List popular routes for instant autocomplete suggestions
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

  // 2. Specific bus lookup with destination / direction matching
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

  // 3. Search routes by keyword (e.g. Majestic, Silk Board, Whitefield, 500D)
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
      .slice(0, 25)
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
  });
}
