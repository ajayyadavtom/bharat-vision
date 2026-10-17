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
}: {
  bus: LiveVehicle;
  routeId: string;
  crowdStatus?: CrowdsourcedBusStatus;
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

  const dynamicBusIcon = useMemo(() => {
    if (typeof window === "undefined" || !L.divIcon) return undefined as any;
    return L.divIcon({
      className: "custom-bus-marker",
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${crowdColor}; opacity: 0.25; transform: scale(1.4); animation: pulse 2s infinite;"></div>
          <div style="background-color: ${crowdColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.35); color: #ffffff; font-size: 15px; z-index: 2;">🚌</div>
          <div style="position: absolute; top: -4px; right: -6px; background-color: #0f172a; color: #ffffff; font-size: 9px; font-weight: 800; padding: 1.5px 5px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.4); z-index: 3; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${bus.spd}kph</div>
          <div style="position: absolute; bottom: -5px; background-color: ${crowdColor}; color: #ffffff; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 9999px; border: 1px solid #ffffff; z-index: 4; white-space: nowrap;">${crowdLabel}</div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
  }, [crowdColor, bus.spd, crowdLabel]);

  return (
    <Marker position={pos} icon={dynamicBusIcon}>
      <Popup>
        <div className="text-gray-900 font-sans p-1 min-w-[170px]">
          <p className="font-black text-sm text-slate-800 border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
            <span>Route {routeId}</span>
            <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              {bus.v_id}
            </span>
          </p>
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
              <span className="text-[10px] font-bold text-slate-800 truncate max-w-[110px] block">
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
        </div>
      </Popup>
    </Marker>
  );
}

// Controller that ONLY fits bounds on explicit route change or recenter trigger
// PREVENTS MAP ZOOM SNAP-BACK / FIGHT BUG
function MapController({
  center,
  zoom,
  bounds,
  routeKey,
  recenterTrigger,
}: {
  center?: [number, number];
  zoom?: number;
  bounds?: L.LatLngBoundsExpression;
  routeKey?: string;
  recenterTrigger: number;
}) {
  const map = useMap();
  const prevRouteKeyRef = useRef<string | undefined>(undefined);
  const prevRecenterRef = useRef<number>(recenterTrigger);

  useEffect(() => {
    const routeChanged = prevRouteKeyRef.current !== routeKey;
    const recenterClicked = prevRecenterRef.current !== recenterTrigger;
    prevRouteKeyRef.current = routeKey;
    prevRecenterRef.current = recenterTrigger;

    // Only auto-fit bounds on route change, initial load, or explicit recenter click!
    // NEVER on re-render, vehicle telemetry tick, or user manual zoom!
    if (routeChanged || recenterClicked) {
      if (bounds) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true });
      } else if (center) {
        map.flyTo(center, zoom || 13, { animate: true, duration: 1.0 });
      }
    }
  }, [bounds, center, zoom, routeKey, recenterTrigger, map]);

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

export default function LiveMap({
  busCode = "",
  destination = "",
  userLocation = null,
  routePath = null,
  routeStops = null,
  initialShowMetro = true,
  initialShowStops = true,
  onUserLocationChange,
}: {
  busCode?: string;
  destination?: string;
  userLocation?: [number, number] | null;
  routePath?: [number, number][] | null;
  routeStops?: BusStopNode[] | null;
  initialShowMetro?: boolean;
  initialShowStops?: boolean;
  onUserLocationChange?: (coords: [number, number], label?: string) => void;
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
  const [showStops, setShowStops] = useState<boolean>(initialShowStops);

  // Mapbox style configuration
  const [styleKey, setStyleKey] = useState<string>("navigation");
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const activeStyle: MapboxStyleOption = MAPBOX_STYLES[styleKey] || MAPBOX_STYLES.navigation;

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
  const effectiveRoutePath: [number, number][] = useMemo(() => {
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
    const curated = getCuratedStopsForBus(busCode);
    if (curated && curated.length > 1) {
      return curated.map((s) => [s.lat, s.lng] as [number, number]);
    }
    // Default Outer Ring Road arterial fallback
    return [
      [12.9181, 77.6232],
      [12.9243, 77.6507],
      [12.9277, 77.6804],
      [12.9425, 77.6971],
      [12.9569, 77.7006],
      [13.0012, 77.6756],
      [13.0358, 77.597],
    ];
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

  // REAL-TIME VEHICLE PROGRESSION ENGINE:
  // Dynamically simulates and moves buses forward along WHATEVER bus route is chosen!
  const [liveMovingBuses, setLiveMovingBuses] = useState<LiveVehicle[]>([]);

  useEffect(() => {
    if (!effectiveRoutePath || effectiveRoutePath.length < 2) return;

    // Calculate cumulative segment distances along route
    const segments: { p1: [number, number]; p2: [number, number]; dist: number; bearing: number }[] =
      [];
    let totalRouteMeters = 0;

    for (let i = 0; i < effectiveRoutePath.length - 1; i++) {
      const p1 = effectiveRoutePath[i];
      const p2 = effectiveRoutePath[i + 1];
      const dist = Math.max(1, haversineMeters(p1[0], p1[1], p2[0], p2[1]));
      const bearing = calculateBearing(p1[0], p1[1], p2[0], p2[1]);
      segments.push({ p1, p2, dist, bearing });
      totalRouteMeters += dist;
    }

    if (totalRouteMeters <= 0) return;

    // Deterministic vehicle seeds based on busCode
    const cleanCode = (busCode || "500D").toUpperCase();
    const seed = cleanCode.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

    // Initial progress positions for 2 buses on this corridor
    let bus1Progress = (totalRouteMeters * (0.22 + (seed % 20) / 100)) % totalRouteMeters;
    let bus2Progress = (totalRouteMeters * (0.65 + (seed % 30) / 100)) % totalRouteMeters;

    const vId1 = `KA57-F-${(2000 + (seed * 7) % 7000).toString()}`;
    const vId2 = `KA57-F-${(4000 + (seed * 13) % 5000).toString()}`;

    // Helper to calculate position on route polyline given progress in meters
    const getPointAtMeters = (
      meters: number
    ): { lat: number; lng: number; bearing: number; nextStopName: string; etaSec: number } => {
      let accumulated = 0;
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (accumulated + seg.dist >= meters || i === segments.length - 1) {
          const remainder = Math.max(0, meters - accumulated);
          const t = Math.min(1, remainder / seg.dist);
          const lat = seg.p1[0] + (seg.p2[0] - seg.p1[0]) * t;
          const lng = seg.p1[1] + (seg.p2[1] - seg.p1[1]) * t;

          // Find upcoming stop
          let nextStopName = "Next Transit Stop";
          let etaSec = 180;
          if (effectiveStops.length > 0) {
            const nextStopIdx = Math.min(
              effectiveStops.length - 1,
              Math.floor((meters / totalRouteMeters) * effectiveStops.length) + 1
            );
            const targetStop = effectiveStops[nextStopIdx] || effectiveStops[0];
            nextStopName = targetStop.name;
            const distToStop = haversineMeters(lat, lng, targetStop.lat, targetStop.lon);
            etaSec = Math.max(15, Math.round(distToStop / (35 / 3.6)));
          }

          return { lat, lng, bearing: seg.bearing, nextStopName, etaSec };
        }
        accumulated += seg.dist;
      }
      return {
        lat: segments[0].p1[0],
        lng: segments[0].p1[1],
        bearing: segments[0].bearing,
        nextStopName: effectiveStops[0]?.name || "Terminal",
        etaSec: 120,
      };
    };

    // Initialize immediate vehicle state
    const p1 = getPointAtMeters(bus1Progress);
    const p2 = getPointAtMeters(bus2Progress);

    setLiveMovingBuses([
      {
        v_id: vId1,
        route_id: cleanCode,
        lat: p1.lat,
        lng: p1.lng,
        spd: 34,
        hdg: p1.bearing,
        occ: 45,
        nxt_stp: p1.nextStopName,
        eta_sec: p1.etaSec,
      },
      {
        v_id: vId2,
        route_id: cleanCode,
        lat: p2.lat,
        lng: p2.lng,
        spd: 38,
        hdg: p2.bearing,
        occ: 72,
        nxt_stp: p2.nextStopName,
        eta_sec: p2.etaSec,
      },
    ]);

    // Live continuous vehicle motion interval (ticks every 1.2s)
    const interval = setInterval(() => {
      // Advance by transit speed (avg 35 km/h ≈ 9.7 m/s * 1.2s ≈ 11.6 meters)
      const delta1 = (34 / 3.6) * 1.2;
      const delta2 = (38 / 3.6) * 1.2;

      bus1Progress = (bus1Progress + delta1) % totalRouteMeters;
      bus2Progress = (bus2Progress + delta2) % totalRouteMeters;

      const pos1 = getPointAtMeters(bus1Progress);
      const pos2 = getPointAtMeters(bus2Progress);

      setLiveMovingBuses([
        {
          v_id: vId1,
          route_id: cleanCode,
          lat: pos1.lat,
          lng: pos1.lng,
          spd: Math.round(33 + Math.sin(Date.now() / 2000) * 4),
          hdg: pos1.bearing,
          occ: 48,
          nxt_stp: pos1.nextStopName,
          eta_sec: pos1.etaSec,
        },
        {
          v_id: vId2,
          route_id: cleanCode,
          lat: pos2.lat,
          lng: pos2.lng,
          spd: Math.round(37 + Math.cos(Date.now() / 2500) * 3),
          hdg: pos2.bearing,
          occ: 75,
          nxt_stp: pos2.nextStopName,
          eta_sec: pos2.etaSec,
        },
      ]);
    }, 1200);

    return () => clearInterval(interval);
  }, [effectiveRoutePath, effectiveStops, busCode]);

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

  // Start & Destination Markers for navigation routes
  const startPoint =
    effectiveRoutePath && effectiveRoutePath.length > 0 ? effectiveRoutePath[0] : null;
  const destPoint =
    effectiveRoutePath && effectiveRoutePath.length > 1
      ? effectiveRoutePath[effectiveRoutePath.length - 1]
      : null;

  const startIcon = useMemo(() => {
    if (typeof window === "undefined" || !L.divIcon) return undefined as any;
    return L.divIcon({
      className: "custom-route-start-marker",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
          <div style="background-color: #10b981; color: #ffffff; font-size: 9px; font-weight: 900; letter-spacing: 0.5px; padding: 2px 7px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(16,185,129,0.5); border: 1.5px solid #ffffff; white-space: nowrap;">ORIGIN</div>
          <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #10b981; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-top: 1px;"></div>
        </div>
      `,
      iconSize: [60, 36],
      iconAnchor: [30, 34],
    });
  }, []);

  const destIcon = useMemo(() => {
    if (typeof window === "undefined" || !L.divIcon) return undefined as any;
    return L.divIcon({
      className: "custom-route-dest-marker",
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
          <div style="background-color: #ef4444; color: #ffffff; font-size: 9px; font-weight: 900; letter-spacing: 0.5px; padding: 2px 7px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(239,68,68,0.5); border: 1.5px solid #ffffff; white-space: nowrap;">DESTINATION</div>
          <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #ef4444; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-top: 1px;"></div>
        </div>
      `,
      iconSize: [80, 36],
      iconAnchor: [40, 34],
    });
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
          >
            <span>{activeStyle.icon}</span>
            <span>{activeStyle.label}</span>
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
          onClick={() => setShowMetro((prev) => !prev)}
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

        {/* Toggle BMTC Bus Stops Layer */}
        <button
          type="button"
          onClick={() => setShowStops((prev) => !prev)}
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

      {/* WebSocket Status Badge Overlay */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col items-end gap-1.5">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
          <span className="text-[9px] font-black tracking-widest text-slate-800 dark:text-slate-200 uppercase">
            Live Bus Moving · {busCode || "500D"}
          </span>
        </div>
      </div>

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
            {typeof navigator !== "undefined" && "geolocation" in navigator && (
              <button
                type="button"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (pos) =>
                      handleSetLocation([pos.coords.latitude, pos.coords.longitude], "Real GPS Location"),
                    () => alert("Could not fetch GPS permission.")
                  );
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black px-2.5 py-1 rounded-xl whitespace-nowrap shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                🎯 Use Real GPS
              </button>
            )}
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
        <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          Route {busCode || "500D"}
        </span>
        <span className="flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-2 text-slate-600 dark:text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{liveMovingBuses.length} Moving Buses</span>
        </span>
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
        {/* MapController fits bounds ONCE per route change or recenter, NEVER on render/telemetry */}
        <MapController
          center={cityData.coordinates}
          bounds={mapBounds}
          routeKey={busCode || "500D"}
          recenterTrigger={recenterTrigger}
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

        {/* NAMMA METRO NETWORK: All 10 Metro Lines */}
        {showMetro &&
          metroData.lines.map((line) => (
            <Polyline
              key={`livemap-metro-line-${line.id}`}
              positions={line.coordinates as [number, number][]}
              color={line.color}
              weight={line.lineKey === "purple" || line.lineKey === "green" ? 4.5 : 3.5}
              opacity={0.85}
            />
          ))}

        {/* NAMMA METRO STATIONS: All 121 Metro Stations */}
        {showMetro &&
          metroData.stations.map((station) => (
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
                        className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white"
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
        {liveMovingBuses.map((bus) => (
          <SmoothBusMarker
            key={bus.v_id}
            bus={bus}
            routeId={bus.route_id}
            crowdStatus={crowdReports[bus.route_id]}
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

        {/* Start / Origin Marker */}
        {startPoint && (
          <Marker position={startPoint} icon={startIcon}>
            <Popup>
              <div className="font-bold text-xs p-1 text-slate-900">
                Origin / Boarding Terminal
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destPoint && (
          <Marker position={destPoint} icon={destIcon}>
            <Popup>
              <div className="font-bold text-xs p-1 text-slate-900">
                Destination Arrival Terminal
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}