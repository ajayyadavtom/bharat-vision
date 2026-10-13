import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Lazy-loaded cached in-memory dataset
let corridorsCache: any[] | null = null;
let routesIndexCache: any[] | null = null;

function loadData() {
  if (!corridorsCache) {
    try {
      const corridorsPath = path.join(process.cwd(), "src/data/bmtc_corridors.json");
      if (fs.existsSync(corridorsPath)) {
        corridorsCache = JSON.parse(fs.readFileSync(corridorsPath, "utf8"));
      }
    } catch (e) {
      console.error("Failed to load bmtc_corridors.json:", e);
      corridorsCache = [];
    }
  }

  if (!routesIndexCache) {
    try {
      const indexPath = path.join(process.cwd(), "src/data/bmtc_routes_index.json");
      if (fs.existsSync(indexPath)) {
        routesIndexCache = JSON.parse(fs.readFileSync(indexPath, "utf8"));
      }
    } catch (e) {
      console.error("Failed to load bmtc_routes_index.json:", e);
      routesIndexCache = [];
    }
  }
}

export async function GET(req: Request) {
  loadData();
  const { searchParams } = new URL(req.url);
  const busQuery = searchParams.get("bus");
  const searchQuery = searchParams.get("search");
  const listAll = searchParams.get("list");

  // 1. List popular routes for instant autocomplete dropdown
  if (listAll === "true") {
    const list = (routesIndexCache || []).slice(0, 50).map((r) => ({
      routeNumber: r.routeNumber,
      displayName: r.displayName,
      origin: r.origin,
      destination: r.destination,
      platform: r.platforms?.[0] || null,
    }));
    return NextResponse.json({ routes: list });
  }

  // 2. Specific bus number lookup (e.g. 500D, 250, 335E, 365, etc.)
  if (busQuery) {
    const cleanBus = busQuery.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    
    // Look for exact or prefix match in full corridors with GPS coordinates
    const matchedCorridor = (corridorsCache || []).find((c) => {
      const cClean = c.cleanRoute.toUpperCase().replace(/[^A-Z0-9]/g, "");
      return cClean === cleanBus || cClean.startsWith(cleanBus) || cleanBus.startsWith(cClean);
    });

    if (matchedCorridor) {
      return NextResponse.json({
        found: true,
        route: {
          routeNumber: matchedCorridor.cleanRoute,
          origin: matchedCorridor.origin,
          destination: matchedCorridor.destination,
          stopsCount: matchedCorridor.stopsCount,
          stops: matchedCorridor.stops,
          stopCoordinates: matchedCorridor.stopCoordinates,
          platform: matchedCorridor.platforms?.[0] || null,
        },
      });
    }

    // Fallback: search in routes index
    const matchedIndex = (routesIndexCache || []).find((r) => {
      const rClean = r.routeNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
      return rClean === cleanBus || rClean.startsWith(cleanBus);
    });

    if (matchedIndex) {
      return NextResponse.json({
        found: true,
        route: {
          routeNumber: matchedIndex.routeNumber,
          origin: matchedIndex.origin,
          destination: matchedIndex.destination,
          stopsCount: matchedIndex.stopsCount,
          stops: [matchedIndex.origin, matchedIndex.destination],
          stopCoordinates: [],
          platform: matchedIndex.platforms?.[0] || null,
        },
      });
    }

    return NextResponse.json({ found: false, message: `Bus ${busQuery} not found in BMTC directory.` }, { status: 404 });
  }

  // 3. Search routes by location or keyword (e.g. Majestic, Silk Board, Yelahanka)
  if (searchQuery) {
    const q = searchQuery.toLowerCase().trim();
    const results = (routesIndexCache || [])
      .filter(
        (r) =>
          r.routeNumber.toLowerCase().includes(q) ||
          r.origin.toLowerCase().includes(q) ||
          r.destination.toLowerCase().includes(q) ||
          r.displayName?.toLowerCase().includes(q)
      )
      .slice(0, 20);

    return NextResponse.json({ results });
  }

  return NextResponse.json({
    message: "BMTC GTFS Real Transit API",
    totalRoutes: routesIndexCache?.length || 0,
    totalCorridors: corridorsCache?.length || 0,
  });
}
