"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { getCityData } from "@/lib/cityData";
import { MAPBOX_PUBLIC_TOKEN, MAPBOX_STYLES, MapboxStyleOption } from "@/lib/mapbox";
import { requestBrowserLocation, reverseGeocodeCoordinates } from "@/lib/location";
import metroData from "@/data/namma_metro.json";
import { getCuratedStopsForBus } from "@/data/curatedCorridorStops";

interface LiveVehicle {
  v_id: string;
  lat: number;
  lng: number;
  spd: number;
  hdg: number;
  occ: number;
  nxt_stp: string;
  eta_sec: number;
  route_id: string;
}

export interface CrowdsourcedBusStatus {
  busId: string;
  crowdLevel: "Low" | "Moderate" | "High";
  score: number;
  color: string;
  occupancyPercent: number;
  reportCount: number;
  lastUpdated: number;
  expiresInSec: number;
}

interface LiveFleetUpdate {
  type: string;
  timestamp: number;
  route_id: string;
  vehicles: LiveVehicle[];
}

export interface BusStopNode {
  name: string;
  lat: number;
  lon: number;
}

// Distance calculation between GPS coordinates
function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Accurate road direction bearing angle
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((brng + 360) % 360);
}

// Linear Interpolation (Lerp) Engine for 60 FPS smooth vehicle gliding along road
function SmoothBusMarker({
  bus,
  routeId,
  crowdStatus,
  isSelected,
  onSelect,
}: {
  bus: LiveVehicle & { origin?: string; destination?: string; fare?: number; route_name?: string };
  routeId: string;
  crowdStatus?: CrowdsourcedBusStatus;
  isSelected?: boolean;
  onSelect?: () => void;
}) {
  const [pos, setPos] = useState<[number, number]>([bus.lat, bus.lng]);
  const prevPos = useRef<[number, number]>([bus.lat, bus.lng]);
  const targetPos = useRef<[number, number]>([bus.lat, bus.lng]);

  useEffect(() => {
    targetPos.current = [bus.lat, bus.lng];
    let animationFrame: number;

    // Smooth Lerp factor tuned for 60 FPS continuous movement
    const smoothFactor = 0.08;

    const animate = () => {
      const [currentLat, currentLng] = prevPos.current;
      const [targetLat, targetLng] = targetPos.current;

      const dist = Math.sqrt(
        Math.pow(targetLat - currentLat, 2) + Math.pow(targetLng - currentLng, 2)
      );

      if (dist < 0.000003) {
        setPos([targetLat, targetLng]);
        prevPos.current = [targetLat, targetLng];
        return;
      }

      const nextLat = currentLat + (targetLat - currentLat) * smoothFactor;
      const nextLng = currentLng + (targetLng - currentLng) * smoothFactor;

      prevPos.current = [nextLat, nextLng];
      setPos([nextLat, nextLng]);

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [bus.lat, bus.lng]);

  const crowdColor = crowdStatus
    ? crowdStatus.color
    : bus.occ > 80
    ? "#ef4444"
    : bus.occ > 50
    ? "#f59e0b"
    : "#10b981";
  const crowdLabel = crowdStatus
    ? crowdStatus.crowdLevel
    : bus.occ > 80
    ? "High"
    : bus.occ > 50
    ? "Moderate"
    : "Low";
  const displayOcc = crowdStatus ? crowdStatus.occupancyPercent : bus.occ;

  // Extract clean Bus Number (e.g. 500D, 285H, KIA-9) to display on the bus logo
  const cleanBusNo = useMemo(() => {
    const raw = routeId || bus.route_id || "";
    const match = raw.match(/^(KIA[-\s]?\d+|\d+[-A-Za-z]+|[A-Za-z]+\d+[A-Za-z]*|\d+)/i);
    if (match) {
      return match[0].toUpperCase().replace(/\s+/g, "");
    }
    if (raw.length > 0 && raw.length <= 6) return raw.toUpperCase();
    if (bus.v_id) {
      const regMatch = bus.v_id.match(/\d{3,4}$/);
      if (regMatch) return regMatch[0];
    }
    return "BMTC";
  }, [routeId, bus.route_id, bus.v_id]);

  const vehicleSuffix = useMemo(() => {
    if (!bus.v_id) return "";
    const regMatch = bus.v_id.match(/\d{3,4}$/);
    return regMatch ? `#${regMatch[0]}` : "";
  }, [bus.v_id]);

  const dynamicBusIcon = useMemo(() => {
    if (typeof window === "undefined" || !L.divIcon) return undefined as any;
    const ringStyle = isSelected
      ? "box-shadow: 0 0 0 4px #10b981, 0 6px 20px rgba(16,185,129,0.7); transform: scale(1.15);"
      : "box-shadow: 0 4px 14px rgba(0,0,0,0.35);";

    return L.divIcon({
      className: "custom-bus-marker",
      html: `
        <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          ${isSelected ? '<div style="position: absolute; top: -19px; background-color: #10b981; color: #ffffff; font-size: 8px; font-weight: 900; padding: 1.5px 6px; border-radius: 9999px; box-shadow: 0 2px 8px rgba(0,0,0,0.4); border: 1px solid #ffffff; z-index: 10; white-space: nowrap; animation: bounce 1.5s infinite;">TRACKING</div>' : ""}
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${isSelected ? "#10b981" : crowdColor}; opacity: ${isSelected ? 0.4 : 0.25}; transform: scale(1.4); animation: pulse 2s infinite;"></div>
          <div style="background-color: ${crowdColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; ${ringStyle} color: #ffffff; font-size: 15px; z-index: 2;">🚌</div>
          <div style="position: absolute; top: -5px; right: -7px; background-color: #0f172a; color: #38bdf8; font-size: 9px; font-weight: 900; padding: 1.5px 5.5px; border-radius: 6px; border: 1.5px solid ${isSelected ? "#10b981" : "rgba(255,255,255,0.6)"}; z-index: 4; box-shadow: 0 2px 6px rgba(0,0,0,0.5); white-space: nowrap;">${cleanBusNo}</div>
          <div style="position: absolute; bottom: -5px; background-color: #0f172a; color: #ffffff; font-size: 8px; font-weight: 900; padding: 1px 4.5px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.4); z-index: 4; white-space: nowrap; font-family: monospace;">${vehicleSuffix || crowdLabel}</div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });
  }, [crowdColor, cleanBusNo, vehicleSuffix, crowdLabel, isSelected]);

  return (
    <Marker
      position={pos}
      icon={dynamicBusIcon}
      zIndexOffset={isSelected ? 1000 : 100}
      eventHandlers={{
        click: () => onSelect?.(),
      }}
    >
      <Popup>
        <div className="text-gray-900 font-sans p-1 min-w-[190px]">
          <p className="font-black text-sm text-slate-800 border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
            <span>Route {routeId}</span>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
              {bus.v_id}
            </span>
          </p>
          {bus.origin && bus.destination && (
            <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 mb-2">
              <p className="font-bold text-slate-800 line-clamp-1">📍 From: {bus.origin}</p>
              <p className="font-bold text-slate-800 line-clamp-1 mt-0.5">🏁 To: {bus.destination}</p>
            </div>
          )}
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Speed</span>
            <span className="text-xs font-bold text-gray-900">{bus.spd} km/h</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Road Bearing</span>
            <span className="text-xs font-bold text-gray-900">{bus.hdg}°</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Crowd Level</span>
            <span className="text-xs font-bold" style={{ color: crowdColor }}>
              {displayOcc}% ({crowdLabel})
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Next Stop</span>
              <span className="text-[10px] font-bold text-slate-800 truncate max-w-[120px] block">
                {bus.nxt_stp}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-600 font-black uppercase">Arrival ETA</span>
              <span className="text-xs font-black text-emerald-600 animate-pulse">
                {Math.floor(bus.eta_sec / 60)}m {bus.eta_sec % 60}s
              </span>
            </div>
          </div>
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect()}
              className={`w-full mt-2 py-1 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-900 text-white hover:bg-emerald-600"
              }`}
            >
              {isSelected ? "✓ Currently Tracking" : "Track This Bus"}
            </button>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// Controller that fits bounds on route change, recenter trigger, or flies to focused bus
function MapController({
  center,
  zoom,
  bounds,
  routeKey,
  recenterTrigger,
  focusCoords,
}: {
  center?: [number, number];
  zoom?: number;
  bounds?: L.LatLngBoundsExpression;
  routeKey?: string;
  recenterTrigger: number;
  focusCoords?: [number, number] | null;
}) {
  const map = useMap();
  const prevRouteKeyRef = useRef<string | undefined>(undefined);
  const prevRecenterRef = useRef<number>(recenterTrigger);
  const lastFittedBoundsKeyRef = useRef<string | null>(null);
  const prevFocusCoordsRef = useRef<string | null>(null);

  useEffect(() => {
    // When a specific vehicle is clicked/selected, fly straight to its coordinates
    if (focusCoords && focusCoords.length === 2) {
      const coordKey = `${focusCoords[0].toFixed(5)},${focusCoords[1].toFixed(5)}`;
      if (prevFocusCoordsRef.current !== coordKey) {
        prevFocusCoordsRef.current = coordKey;
        map.flyTo(focusCoords, 15, { animate: true, duration: 1.0 });
        return;
      }
    }

    const routeChanged = prevRouteKeyRef.current !== routeKey;
    const recenterClicked = prevRecenterRef.current !== recenterTrigger;
    const boundsKey = routeKey ? `${routeKey}-${bounds ? "has-bounds" : "no-bounds"}` : null;
    const needsInitialBoundsFit = Boolean(bounds && boundsKey && lastFittedBoundsKeyRef.current !== boundsKey);

    prevRouteKeyRef.current = routeKey;
    prevRecenterRef.current = recenterTrigger;

    // Auto-fit bounds on route change, when route bounds load from API, or explicit recenter click!
    if (routeChanged || recenterClicked || needsInitialBoundsFit) {
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true });
        if (boundsKey) {
          lastFittedBoundsKeyRef.current = boundsKey;
        }
      } else if (center) {
        map.flyTo(center, zoom || 13, { animate: true, duration: 1.0 });
      }
    }
  }, [bounds, center, zoom, routeKey, recenterTrigger, focusCoords, map]);

  return null;
}

// Invalidate size on mount and container resize so Leaflet never renders grey tiles or distorted dimensions
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    // Initial size invalidations to ensure proper tile rendering in responsive layouts
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);

    const container = map.getContainer();
    if (!container) {
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        map.invalidateSize();
      });
      ro.observe(container);
    }

    const handleWindowResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleWindowResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro?.disconnect();
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [map]);

  return null;
}

// Auto-fly to selected metro line bounds when filtered
function MetroLineFlyer({ lineFilter }: { lineFilter: string }) {
  const map = useMap();
  const prevFilterRef = useRef<string>("All");

  useEffect(() => {
    if (prevFilterRef.current === lineFilter) return;
    prevFilterRef.current = lineFilter;

    if (lineFilter === "All") return;

    const lower = lineFilter.toLowerCase();
    const stns = metroData.stations.filter((s) =>
      s.lines.some((l) => l.toLowerCase() === lower)
    );
    if (stns.length > 0) {
      const bounds = L.latLngBounds(stns.map((s) => [s.lat, s.lon] as [number, number]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });
    }
  }, [lineFilter, map]);

  return null;
}

// Tap map listener when in "Set Location" mode
function MapClickHandler({
  isSettingLocation,
  onMapClick,
}: {
  isSettingLocation: boolean;
  onMapClick: (coords: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      if (isSettingLocation) {
        onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

// Floating Map Zoom & Recenter Controls with Live Zoom Level Badge
function MapFloatingControls({
  onRecenter,
  onToggleSetLocation,
  isSettingLocation,
}: {
  onRecenter: () => void;
  onToggleSetLocation: () => void;
  isSettingLocation: boolean;
}) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend() {
      setCurrentZoom(map.getZoom());
    },
  });

  return (
    <div className="absolute bottom-6 right-3 z-[400] flex flex-col gap-1.5 shadow-2xl">
      {/* Zoom In Button */}
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="w-9 h-9 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-black text-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-lg cursor-pointer backdrop-blur-md"
        title="Zoom In"
      >
        +
      </button>

      {/* Live Zoom Level Indicator */}
      <div className="text-[9px] font-black text-center text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-900/90 py-0.5 px-1 rounded-lg border border-slate-200 dark:border-slate-800 pointer-events-none select-none backdrop-blur-md">
        {Math.round(currentZoom)}x
      </div>

      {/* Zoom Out Button */}
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="w-9 h-9 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex items-center justify-center font-black text-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-lg cursor-pointer backdrop-blur-md"
        title="Zoom Out"
      >
        −
      </button>

      {/* Recenter Map Button */}
      <button
        type="button"
        onClick={onRecenter}
        aria-label="Recenter map"
        className="w-9 h-9 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-base hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-lg cursor-pointer backdrop-blur-md"
        title="Recenter Route & Buses"
      >
        🎯
      </button>

      {/* Set My Location Toggle Button */}
      <button
        type="button"
        onClick={onToggleSetLocation}
        aria-label="Set My Location"
        className={`w-9 h-9 rounded-2xl border flex items-center justify-center text-base transition-all shadow-lg cursor-pointer backdrop-blur-md active:scale-95 ${
          isSettingLocation
            ? "bg-blue-600 text-white border-blue-400 ring-2 ring-blue-400/50 animate-pulse"
            : "bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
        title={isSettingLocation ? "Click map to set location" : "Set My Location"}
      >
        📍
      </button>
    </div>
  );
}

// Popular Bengaluru Transit Hub Presets
const BENGALURU_LOCATION_PRESETS = [
  { name: "Majestic (KBS)", coords: [12.9772, 77.5713] as [number, number] },
  { name: "Silk Board", coords: [12.9172, 77.6228] as [number, number] },
  { name: "Whitefield (ITPL)", coords: [12.9863, 77.7335] as [number, number] },
  { name: "Indiranagar", coords: [12.9784, 77.6408] as [number, number] },
  { name: "Hebbal", coords: [13.0358, 77.597] as [number, number] },
  { name: "Koramangala", coords: [12.9352, 77.6245] as [number, number] },
  { name: "Electronic City", coords: [12.8452, 77.6602] as [number, number] },
  { name: "Airport (KIA)", coords: [13.1986, 77.7066] as [number, number] },
];

export interface LiveVehicleTelemetry {
  busId: string;
  lat: number;
  lng: number;
  latitude?: number;
  longitude?: number;
  speed: number;
  bearing: number;
  routeId?: string;
  routeName?: string;
  origin?: string;
  destination?: string;
  nextStop?: string;
  eta?: string;
  etaMinutes?: number;
  fare?: number;
  occupancy?: number;
  crowdLevel?: string;
}

export default function LiveMap({
  busCode = "",
  destination = "",
  userLocation = null,
  routePath = null,
  routeStops = null,
  initialShowMetro = false,
  initialShowStops = false,
  onUserLocationChange,
  vehicles: propVehicles,
  selectedVehicleId = null,
  onSelectVehicle,
  focusCoords = null,
}: {
  busCode?: string;
  destination?: string;
  userLocation?: [number, number] | null;
  routePath?: [number, number][] | null;
  routeStops?: BusStopNode[] | null;
  initialShowMetro?: boolean;
  initialShowStops?: boolean;
  onUserLocationChange?: (coords: [number, number], label?: string) => void;
  vehicles?: LiveVehicleTelemetry[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (busId: string) => void;
  focusCoords?: [number, number] | null;
}) {
  const { currentCity } = useAppStore();
  const cityData = getCityData(currentCity);

  // Dynamic user location state
  const [currentUserLocation, setCurrentUserLocation] = useState<[number, number] | null>(
    userLocation
  );
  const [userLocationLabel, setUserLocationLabel] = useState<string>("Current GPS Location");
  const [isSettingLocation, setIsSettingLocation] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // Sync prop userLocation
  useEffect(() => {
    if (userLocation && !currentUserLocation) {
      setCurrentUserLocation(userLocation);
    }
  }, [userLocation, currentUserLocation]);

  const [wsConnected, setWsConnected] = useState(false);
  const [crowdReports, setCrowdReports] = useState<Record<string, CrowdsourcedBusStatus>>({});

  // Dynamic Route & Stops fetched from BMTC GTFS directory
  const [bmtcRouteData, setBmtcRouteData] = useState<{
    routeNumber: string;
    fullName: string;
    origin: string;
    destination: string;
    stops: BusStopNode[];
    coordinates: [number, number][];
  } | null>(null);

  // Toggleable Layers on Map
  const [showMetro, setShowMetro] = useState<boolean>(initialShowMetro);
  const [activeMetroLineFilter, setActiveMetroLineFilter] = useState<string>("All");
  const [showStops, setShowStops] = useState<boolean>(initialShowStops);

  // Filtered Metro Lines
  const visibleMetroLines = useMemo(() => {
    if (activeMetroLineFilter === "All") return metroData.lines;
    const lower = activeMetroLineFilter.toLowerCase();
    return metroData.lines.filter((l) => l.lineKey === lower);
  }, [activeMetroLineFilter]);

  // Filtered Metro Stations
  const visibleMetroStations = useMemo(() => {
    if (activeMetroLineFilter === "All") return metroData.stations;
    const lower = activeMetroLineFilter.toLowerCase();
    return metroData.stations.filter((s) =>
      s.lines.some((l) => l.toLowerCase() === lower)
    );
  }, [activeMetroLineFilter]);

  // Mapbox style configuration (defaults to clean streets view, not navigation)
  const [styleKey, setStyleKey] = useState<string>("streets");
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const activeStyle: MapboxStyleOption = MAPBOX_STYLES[styleKey] || MAPBOX_STYLES.streets;

  // Fetch real BMTC route alignment and stops when busCode changes
  useEffect(() => {
    if (!busCode) {
      setBmtcRouteData(null);
      return;
    }

    let isMounted = true;
    async function fetchBmtcRoute() {
      try {
        const clean = busCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
        const res = await fetch(`/api/bmtc?bus=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.found && data.route) {
            setBmtcRouteData(data.route);
          }
        }
      } catch (err) {
        console.warn("Could not load BMTC route details in LiveMap:", err);
      }
    }
    fetchBmtcRoute();
    return () => {
      isMounted = false;
    };
  }, [busCode]);

  // Combine provided route path, fetched BMTC path, or curated corridor path
  // NOTE: When no route is selected, returns empty array (NO DEFAULT ROUTE OVERLAY)
  const effectiveRoutePath: [number, number][] = useMemo(() => {
    if (!busCode && (!routePath || routePath.length === 0)) {
      return [];
    }
    if (routePath && routePath.length > 1) {
      return routePath;
    }
    if (bmtcRouteData?.coordinates && bmtcRouteData.coordinates.length > 1) {
      return bmtcRouteData.coordinates;
    }
    if (routeStops && routeStops.length > 1) {
      return routeStops.map((s) => [s.lat, s.lon] as [number, number]);
    }
    if (bmtcRouteData?.stops && bmtcRouteData.stops.length > 1) {
      return bmtcRouteData.stops.map((s) => [s.lat, s.lon] as [number, number]);
    }
    if (busCode) {
      const curated = getCuratedStopsForBus(busCode);
      if (curated && curated.length > 1) {
        return curated.map((s) => [s.lat, s.lng] as [number, number]);
      }
    }
    return [];
  }, [routePath, bmtcRouteData, routeStops, busCode]);

  // Combine provided stops or fetched BMTC stops
  const effectiveStops: BusStopNode[] = useMemo(() => {
    if (routeStops && routeStops.length > 0) return routeStops;
    if (bmtcRouteData?.stops && bmtcRouteData.stops.length > 0) return bmtcRouteData.stops;
    const curated = getCuratedStopsForBus(busCode);
    if (curated && curated.length > 0) {
      return curated.map((s) => ({ name: s.name, lat: s.lat, lon: s.lng }));
    }
    return [];
  }, [routeStops, bmtcRouteData, busCode]);

  // Memoized bounds to prevent recreating object on every render
  const mapBounds = useMemo(() => {
    if (effectiveRoutePath && effectiveRoutePath.length > 1) {
      return L.latLngBounds(effectiveRoutePath);
    }
    return undefined;
  }, [effectiveRoutePath]);

  // Handle setting location (by map tap or preset selection)
  const handleSetLocation = useCallback(
    (coords: [number, number], label?: string) => {
      setCurrentUserLocation(coords);
      const name = label || `Custom Pin (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`;
      setUserLocationLabel(name);
      setIsSettingLocation(false);
      onUserLocationChange?.(coords, name);

      setLocationToast(`📍 Location set to: ${name}`);
      setTimeout(() => setLocationToast(null), 3500);
    },
    [onUserLocationChange]
  );

  // REAL-TIME BMTC AVLS GPS FLEET:
  // When vehicles prop is not passed externally (e.g. on homepage or route planner),
  // automatically poll the official real BMTC live GPS telemetry endpoint every 5s.
  const [internalVehicles, setInternalVehicles] = useState<LiveVehicleTelemetry[]>([]);

  useEffect(() => {
    if (propVehicles !== undefined || !busCode) {
      setInternalVehicles([]);
      return;
    }

    let isMounted = true;
    async function pollLiveFleet() {
      try {
        const clean = busCode.trim().toUpperCase();
        const res = await fetch(`/api/bmtc/live?route=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success && Array.isArray(data.vehicles)) {
            setInternalVehicles(data.vehicles);
          }
        }
      } catch (err) {
        console.warn("Could not poll live BMTC fleet in LiveMap:", err);
      }
    }

    pollLiveFleet();
    const interval = setInterval(pollLiveFleet, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [propVehicles, busCode]);

  const effectiveFleet = propVehicles !== undefined ? propVehicles : internalVehicles;

  // Effective vehicles to display on map: priority to real API live vehicles
  const displayVehicles = useMemo(() => {
    if (effectiveFleet && effectiveFleet.length > 0) {
      return effectiveFleet.map((v) => ({
        v_id: v.busId,
        lat: v.lat || v.latitude || 12.9716,
        lng: v.lng || v.longitude || 77.5946,
        spd: v.speed || 30,
        hdg: v.bearing || 0,
        occ: v.occupancy || 50,
        nxt_stp: v.nextStop || "Next Stop",
        eta_sec: (v.etaMinutes || 4) * 60,
        route_id: v.routeId || busCode,
        origin: v.origin,
        destination: v.destination,
        fare: v.fare,
      }));
    }
    return [];
  }, [effectiveFleet, busCode]);

  // Recenter trigger
  const handleRecenter = useCallback(() => {
    setRecenterTrigger((prev) => prev + 1);
  }, []);

  // Sync Crowdsourced Occupancy
  useEffect(() => {
    const fetchCrowdData = () => {
      try {
        const stored = localStorage.getItem("crowd_reports_v1");
        if (stored) {
          const parsed = JSON.parse(stored);
          const now = Date.now();
          const valid: Record<string, CrowdsourcedBusStatus> = {};
          Object.entries(parsed).forEach(([key, val]: [string, any]) => {
            if (val.lastUpdated && now - val.lastUpdated < (val.expiresInSec || 1800) * 1000) {
              valid[key] = val;
            }
          });
          setCrowdReports(valid);
        }
      } catch (e) {
        console.warn("Error reading crowdsource data", e);
      }
    };

    fetchCrowdData();
    const interval = setInterval(fetchCrowdData, 15000);
    return () => clearInterval(interval);
  }, []);

  // Supabase Telemetry Broadcast channel
  useEffect(() => {
    const channel = supabase.channel("bengaluru-transit-telemetry", {
      config: { broadcast: { self: true } },
    });

    channel
      .on("broadcast", { event: "LIVE_FLEET_UPDATE" }, () => {})
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setWsConnected(true);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const userLocationMarkerIcon = useMemo(() => {
    if (typeof window === "undefined" || !L.divIcon) return undefined as any;
    return L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: grab;">
          <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: #2563eb; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background-color: #2563eb; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(37,99,235,0.9); z-index: 2; display: flex; align-items: center; justify-content: center; color: white; font-size: 10px;">📍</div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }, []);

  return (
    <div className="w-full h-full relative z-0 bg-slate-100 dark:bg-[#09090b] overflow-hidden">
      {/* Top Map Controls: Style Switcher & Transit Layers */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 flex-wrap max-w-[85%]">
        {/* Mapbox Style Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsStyleMenuOpen((prev) => !prev)}
            className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-100 hover:border-emerald-500 transition-all cursor-pointer"
            title="Map Display Theme"
          >
            <span>{activeStyle.icon}</span>
            <span>Map: {activeStyle.label}</span>
            <span className="text-[9px] text-slate-400">▾</span>
          </button>

          {isStyleMenuOpen && (
            <div className="absolute top-9 left-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 min-w-[170px] animate-in fade-in zoom-in-95 duration-150 z-[450]">
              <div className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800">
                Mapbox Styles
              </div>
              {Object.values(MAPBOX_STYLES).map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    setStyleKey(style.id);
                    setTileError(false);
                    setIsStyleMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all text-left cursor-pointer ${
                    styleKey === style.id
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{style.icon}</span>
                    <span>{style.label}</span>
                  </span>
                  {styleKey === style.id && <span className="text-emerald-500 text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Toggle Namma Metro Layer */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMetro((prev) => !prev);
          }}
          className={`px-3 py-1.5 rounded-full border shadow-xl flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer backdrop-blur-md ${
            showMetro
              ? "bg-purple-600 text-white border-purple-500 shadow-purple-600/20"
              : "bg-white/95 dark:bg-slate-900/95 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-purple-400"
          }`}
          title="Toggle 121 Namma Metro stations & lines"
        >
          <span>🚇</span>
          <span>Metro {showMetro ? "ON" : "OFF"}</span>
        </button>

        {/* Metro Line Filter Pills */}
        {showMetro && (
          <div 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            style={{ touchAction: "pan-x pan-y", WebkitOverflowScrolling: "touch" }}
            className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto no-scrollbar scroll-smooth max-w-[280px] sm:max-w-none"
          >
            {["All", "Purple", "Green", "Yellow", "Blue", "Pink"].map((line) => (
              <button
                key={line}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMetroLineFilter(line);
                }}
                className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeMetroLineFilter === line
                    ? line === "Purple"
                      ? "bg-purple-600 text-white shadow-sm"
                      : line === "Green"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : line === "Yellow"
                      ? "bg-amber-500 text-slate-950 shadow-sm"
                      : line === "Blue"
                      ? "bg-blue-600 text-white shadow-sm"
                      : line === "Pink"
                      ? "bg-pink-600 text-white shadow-sm"
                      : "bg-slate-800 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {line === "Purple" ? "🟣" : line === "Green" ? "🟢" : line === "Yellow" ? "🟡" : line === "Blue" ? "🔵" : line === "Pink" ? "🌸" : "🌐"} {line}
              </button>
            ))}
          </div>
        )}

        {/* Toggle BMTC Bus Stops Layer */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowStops((prev) => !prev);
          }}
          className={`px-3 py-1.5 rounded-full border shadow-xl flex items-center gap-1.5 text-[11px] font-bold transition-all cursor-pointer backdrop-blur-md ${
            showStops
              ? "bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20"
              : "bg-white/95 dark:bg-slate-900/95 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-400"
          }`}
          title="Toggle BMTC bus stops along route"
        >
          <span>🚏</span>
          <span>Stops ({effectiveStops.length})</span>
        </button>
      </div>

      {/* WebSocket Status Badge Overlay (Only when bus is active) */}
      {busCode && displayVehicles.length > 0 && (
        <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-1.5">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            <span className="text-[9px] font-black tracking-widest text-slate-800 dark:text-slate-200 uppercase">
              {displayVehicles.length} Buses Live · {busCode}
            </span>
          </div>
        </div>
      )}

      {/* "Set My Location" Active Mode Banner */}
      {isSettingLocation && (
        <div className="absolute top-14 left-3 right-3 z-[450] bg-blue-600 text-white p-3 rounded-2xl shadow-2xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base animate-bounce">📍</span>
              <p className="text-xs font-black">
                Tap anywhere on the map or pick a Bengaluru hub:
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSettingLocation(false)}
              className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-2 py-0.5 rounded-lg cursor-pointer"
            >
              ✕ Cancel
            </button>
          </div>

          {/* Quick Hub Presets */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {BENGALURU_LOCATION_PRESETS.map((hub) => (
              <button
                key={hub.name}
                type="button"
                onClick={() => handleSetLocation(hub.coords, hub.name)}
                className="bg-white/15 hover:bg-white/25 text-white text-[10px] font-black px-2.5 py-1 rounded-xl whitespace-nowrap border border-white/20 active:scale-95 transition-all cursor-pointer"
              >
                {hub.name}
              </button>
            ))}
            <button
              type="button"
              onClick={async () => {
                try {
                  setLocationToast("📡 Detecting live location...");
                  const coords = await requestBrowserLocation();
                  const geoInfo = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
                  handleSetLocation([coords.latitude, coords.longitude], geoInfo.locality);
                } catch (err) {
                  setLocationToast("Could not determine live location.");
                  setTimeout(() => setLocationToast(null), 3000);
                }
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black px-2.5 py-1 rounded-xl whitespace-nowrap shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              🎯 Use Live GPS
            </button>
          </div>
        </div>
      )}

      {/* Location Set Success Toast */}
      {locationToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[450] bg-slate-900/95 text-white border border-emerald-500/50 px-4 py-2 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{locationToast}</span>
        </div>
      )}

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5 shadow-xl text-[8px] font-black">
        {busCode ? (
          <>
            <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Route {busCode}
            </span>
            <span className="flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-2 text-slate-600 dark:text-slate-300">
              <span className={`w-2 h-2 rounded-full ${displayVehicles.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`} />
              <span>{displayVehicles.length} {displayVehicles.length === 1 ? "Live Bus" : "Live Buses"}</span>
            </span>
          </>
        ) : (
          <span className="text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            BMTC Live Hub · Search a bus to track
          </span>
        )}
        {currentUserLocation && (
          <span className="border-l border-slate-300 dark:border-slate-700 pl-2 text-blue-600 dark:text-blue-400">
            📍 {userLocationLabel}
          </span>
        )}
      </div>

      <MapContainer
        center={cityData.coordinates}
        zoom={13}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        className="w-full h-full bg-[#f8fafc] dark:bg-[#09090b] z-0"
        zoomControl={false}
      >
        {/* MapResizer ensures Leaflet recalculates pixel boundaries on mount, resize, and breakpoint changes */}
        <MapResizer />

        {/* MapController fits bounds ONCE per route change or recenter, or flies to focused bus */}
        <MapController
          center={cityData.coordinates}
          bounds={mapBounds}
          routeKey={busCode || ""}
          recenterTrigger={recenterTrigger}
          focusCoords={focusCoords}
        />

        {/* Map Click Handler for Setting User Location */}
        <MapClickHandler
          isSettingLocation={isSettingLocation}
          onMapClick={(coords) => handleSetLocation(coords)}
        />

        {/* Floating Zoom & Location Controls */}
        <MapFloatingControls
          onRecenter={handleRecenter}
          onToggleSetLocation={() => setIsSettingLocation((prev) => !prev)}
          isSettingLocation={isSettingLocation}
        />

        {/* Mapbox 2x Retina Tile Layer */}
        {!tileError ? (
          <TileLayer
            key={`mapbox-${activeStyle.styleId}`}
            attribution='&copy; <a href="https://www.mapbox.com/" target="_blank" rel="noreferrer">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/${activeStyle.styleId}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`}
            tileSize={256}
            maxZoom={22}
            eventHandlers={{
              tileerror: () => {
                console.warn("Mapbox tile loading failed, falling back to OpenStreetMap");
                setTileError(true);
              },
            }}
          />
        ) : (
          <TileLayer
            key="osm-fallback"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* Auto-flyer when metro line filter changes */}
        {showMetro && <MetroLineFlyer lineFilter={activeMetroLineFilter} />}

        {/* NAMMA METRO NETWORK: All or Filtered Metro Lines */}
        {showMetro &&
          visibleMetroLines.map((line) => (
            <Polyline
              key={`livemap-metro-line-${line.id}`}
              positions={line.coordinates as [number, number][]}
              color={line.color}
              weight={line.lineKey === "purple" || line.lineKey === "green" ? 4.5 : 3.5}
              opacity={0.85}
            />
          ))}

        {/* NAMMA METRO STATIONS: All or Filtered Metro Stations */}
        {showMetro &&
          visibleMetroStations.map((station) => (
            <CircleMarker
              key={`livemap-metro-stn-${station.id}`}
              center={[station.lat, station.lon]}
              radius={station.isInterchange ? 6.5 : 4.5}
              pathOptions={{
                color: station.isInterchange ? "#f59e0b" : "#ffffff",
                weight: station.isInterchange ? 2.5 : 1.5,
                fillColor: station.lines.includes("Purple")
                  ? "#a855f7"
                  : station.lines.includes("Green")
                  ? "#10b981"
                  : station.lines.includes("Yellow")
                  ? "#eab308"
                  : station.lines.includes("Pink")
                  ? "#ec4899"
                  : "#3b82f6",
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-xs min-w-[150px] text-slate-900">
                  <div className="flex items-center justify-between gap-1 mb-1 pb-1 border-b border-slate-200">
                    <span className="font-black text-slate-900 text-sm">🚇 {station.name}</span>
                    {station.isInterchange && (
                      <span className="text-[8px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">
                        Interchange
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {station.lines.map((l) => (
                      <span
                        key={l}
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded text-white ${
                          l === "Purple"
                            ? "bg-purple-600"
                            : l === "Green"
                            ? "bg-emerald-600"
                            : l === "Yellow"
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : l === "Pink"
                            ? "bg-pink-600"
                            : "bg-blue-600"
                        }`}
                      >
                        {l} Line
                      </span>
                    ))}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}

        {/* BMTC BUS STOPS: All Bus Stops Along Selected Route */}
        {showStops &&
          effectiveStops.map((stop, index) => {
            const isFirst = index === 0;
            const isLast = index === effectiveStops.length - 1;
            const stopColor = isFirst ? "#10b981" : isLast ? "#ef4444" : "#0284c7";

            return (
              <CircleMarker
                key={`bmtc-stop-${stop.name}-${index}`}
                center={[stop.lat, stop.lon]}
                radius={isFirst || isLast ? 7 : 4.5}
                pathOptions={{
                  color: "#ffffff",
                  weight: 2,
                  fillColor: stopColor,
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <div className="p-1 font-sans text-xs min-w-[160px] text-slate-900">
                    <span className="text-[9px] font-black uppercase text-slate-400 block">
                      {isFirst
                        ? "Origin Terminal"
                        : isLast
                        ? "Destination Terminal"
                        : `Bus Stop #${index + 1}`}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 block mb-1">
                      🚏 {stop.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Lat: {stop.lat.toFixed(4)}, Lon: {stop.lon.toFixed(4)}
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* High-visibility pulsating GPS User Location (Draggable so user can change location) */}
        {currentUserLocation && (
          <Marker
            position={currentUserLocation}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                handleSetLocation([pos.lat, pos.lng], "Custom Dragged Pin");
              },
            }}
            icon={userLocationMarkerIcon}
          >
            <Popup>
              <div className="font-bold text-xs p-1 text-slate-900">
                <span className="text-[9px] uppercase font-bold text-blue-600 block">
                  My Commuter Location
                </span>
                <p className="font-black text-sm text-slate-900">{userLocationLabel}</p>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  {currentUserLocation[0].toFixed(5)}, {currentUserLocation[1].toFixed(5)}
                </span>
                <span className="text-[9px] text-blue-600 font-bold block mt-1">
                  💡 Tip: Drag this pin or click 📍 to change location!
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* LIVE MOVING BUSES: Shown along the road path for whatever bus the user chooses */}
        {displayVehicles.map((bus) => (
          <SmoothBusMarker
            key={bus.v_id}
            bus={bus}
            routeId={bus.route_id}
            crowdStatus={crowdReports[bus.route_id]}
            isSelected={bus.v_id === selectedVehicleId}
            onSelect={() => onSelectVehicle?.(bus.v_id)}
          />
        ))}

        {/* High-Contrast Navigation Polyline Route (BMTC or Multi-modal) */}
        {effectiveRoutePath && effectiveRoutePath.length > 0 && (
          <>
            {/* Dark casing/shadow line for sharp contrast against light/dark tiles */}
            <Polyline
              positions={effectiveRoutePath}
              color="#0f172a"
              weight={8}
              opacity={0.8}
            />
            {/* Vivid cyan/blue foreground path */}
            <Polyline
              positions={effectiveRoutePath}
              color="#06b6d4"
              weight={5}
              opacity={1}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}