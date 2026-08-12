export interface GtfsRoute {
  routeId: string;
  shortName: string;
  longName: string;
  agency: "BMTC" | "Namma Metro";
  color: string;
}

export interface GtfsStop {
  stopId: string;
  stopName: string;
  latitude: number;
  longitude: number;
}

// Official GTFS Static Feed Simulation for Bengaluru Transit Corridors
export const GTFS_ROUTES: GtfsRoute[] = [
  { routeId: "BMTC-500D", shortName: "500D", longName: "Hebbal ⇄ Silk Board Outer Ring Road", agency: "BMTC", color: "#14b8a6" },
  { routeId: "BMTC-250", shortName: "250", longName: "Yelahanka New Town ⇄ Majestic", agency: "BMTC", color: "#3b82f6" },
  { routeId: "BMTC-335E", shortName: "335E", longName: "ITPL ⇄ Majestic AC Vajra", agency: "BMTC", color: "#6366f1" },
  { routeId: "METRO-GREEN", shortName: "Green Line", longName: "Nagasandra ⇄ Silk Institute", agency: "Namma Metro", color: "#22c55e" },
  { routeId: "METRO-PURPLE", shortName: "Purple Line", longName: "Whitefield ⇄ Challaghatta", agency: "Namma Metro", color: "#a855f7" }
];

export const GTFS_STOPS: Record<string, GtfsStop[]> = {
  "BMTC-250": [
    { stopId: "S-YLK-01", stopName: "Yelahanka New Town 5th Phase", latitude: 13.1000, longitude: 77.5963 },
    { stopId: "S-YLK-02", stopName: "Mother Dairy Yelahanka", latitude: 13.0850, longitude: 77.5910 },
    { stopId: "S-HBB-01", stopName: "Hebbal Flyover Bus Bay", latitude: 13.0358, longitude: 77.5970 },
    { stopId: "S-MAJ-01", stopName: "Kempegowda Bus Station (Majestic)", latitude: 12.9776, longitude: 77.5726 }
  ],
  "METRO-GREEN": [
    { stopId: "M-NGS", stopName: "Nagasandra", latitude: 13.0471, longitude: 77.5186 },
    { stopId: "M-YES", stopName: "Yeshwanthpur Interchange", latitude: 13.0238, longitude: 77.5529 },
    { stopId: "M-MAJ", stopName: "Nadaprabhu Kempegowda Stn (Majestic)", latitude: 12.9757, longitude: 77.5728 },
    { stopId: "M-SLK", stopName: "Silk Institute", latitude: 12.8795, longitude: 77.5276 }
  ]
};

// GTFS Data Query Pipeline
export function queryGtfsRoutes(searchTerm: string): GtfsRoute[] {
  const query = searchTerm.toLowerCase();
  return GTFS_ROUTES.filter(
    route => route.shortName.toLowerCase().includes(query) || route.longName.toLowerCase().includes(query)
  );
}

export function getStopsForRoute(routeId: string): GtfsStop[] {
  return GTFS_STOPS[routeId] || [
    { stopId: "S-DEF-01", stopName: "Origin Terminal", latitude: 13.0150, longitude: 77.5900 },
    { stopId: "S-DEF-02", stopName: "Destination Terminal", latitude: 12.9716, longitude: 77.5946 }
  ];
}