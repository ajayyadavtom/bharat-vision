import bmtcRoutesIndex from "../data/bmtc_routes_index.json";

export interface GtfsRoute {
  routeId: string;
  shortName: string;
  longName: string;
  agency: "BMTC" | "Namma Metro";
  color: string;
  platform?: {
    station: string;
    platform: string;
    bay?: number | null;
  } | null;
}

export interface GtfsStop {
  stopId: string;
  stopName: string;
  latitude: number;
  longitude: number;
}

// Official Namma Metro Corridors
export const METRO_ROUTES: GtfsRoute[] = [
  { routeId: "METRO-GREEN", shortName: "Green Line", longName: "Nagasandra ⇄ Silk Institute", agency: "Namma Metro", color: "#22c55e" },
  { routeId: "METRO-PURPLE", shortName: "Purple Line", longName: "Whitefield ⇄ Challaghatta", agency: "Namma Metro", color: "#a855f7" }
];

export const GTFS_STOPS: Record<string, GtfsStop[]> = {
  "METRO-GREEN": [
    { stopId: "M-NGS", stopName: "Nagasandra", latitude: 13.0471, longitude: 77.5186 },
    { stopId: "M-YES", stopName: "Yeshwanthpur Interchange", latitude: 13.0238, longitude: 77.5529 },
    { stopId: "M-MAJ", stopName: "Nadaprabhu Kempegowda Stn (Majestic)", latitude: 12.9757, longitude: 77.5728 },
    { stopId: "M-SLK", stopName: "Silk Institute", latitude: 12.8795, longitude: 77.5276 }
  ],
  "METRO-PURPLE": [
    { stopId: "M-WFD", stopName: "Whitefield (Kadugodi)", latitude: 12.9961, longitude: 77.7610 },
    { stopId: "M-IND", stopName: "Indiranagar", latitude: 12.9783, longitude: 77.6387 },
    { stopId: "M-MGR", stopName: "MG Road", latitude: 12.9755, longitude: 77.6067 },
    { stopId: "M-MAJ-P", stopName: "Majestic Interchange", latitude: 12.9757, longitude: 77.5728 },
    { stopId: "M-CHL", stopName: "Challaghatta", latitude: 12.9064, longitude: 77.4721 }
  ]
};

// GTFS Data Query Pipeline powered by official 4,400+ BMTC routes
export function queryGtfsRoutes(searchTerm: string): GtfsRoute[] {
  const query = searchTerm.toLowerCase().trim();
  if (!query) return [];

  // 1. Search Metro
  const metroMatches = METRO_ROUTES.filter(
    route => route.shortName.toLowerCase().includes(query) || route.longName.toLowerCase().includes(query)
  );

  // 2. Search Real BMTC Routes Index
  const bmtcMatches = (bmtcRoutesIndex as any[])
    .filter(r => 
      r.routeNumber.toLowerCase().includes(query) || 
      r.origin.toLowerCase().includes(query) || 
      r.destination.toLowerCase().includes(query) ||
      (r.displayName && r.displayName.toLowerCase().includes(query))
    )
    .slice(0, 30)
    .map(r => ({
      routeId: `BMTC-${r.routeNumber}`,
      shortName: r.routeNumber,
      longName: `${r.origin} ⇄ ${r.destination}`,
      agency: "BMTC" as const,
      color: r.routeNumber.startsWith("KIA") ? "#f59e0b" : r.routeNumber.includes("Vajra") || r.routeNumber.endsWith("E") ? "#6366f1" : "#14b8a6",
      platform: r.platforms?.[0] || null
    }));

  return [...metroMatches, ...bmtcMatches];
}

export function getStopsForRoute(routeId: string): GtfsStop[] {
  return GTFS_STOPS[routeId] || [
    { stopId: "S-DEF-01", stopName: "Origin Terminal", latitude: 13.0150, longitude: 77.5900 },
    { stopId: "S-DEF-02", stopName: "Destination Terminal", latitude: 12.9716, longitude: 77.5946 }
  ];
}