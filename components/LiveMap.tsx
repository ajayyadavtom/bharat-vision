"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";

import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { getCityData } from "@/lib/cityData";
import { MAPBOX_PUBLIC_TOKEN, MAPBOX_STYLES, MapboxStyleOption } from "@/lib/mapbox";
import metroData from "@/data/namma_metro.json";

interface LiveVehicle {
  v_id: string;
  lat: number;
  lng: number;
  spd: number;
  hdg: number;
  occ: number;
  nxt_stp: string;
  eta_sec: number;
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

// Linear Interpolation (Lerp) Engine for smooth vehicle gliding
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

    // Lerp factor tuned for 60 FPS vector canvas gliding over a 3s WebSocket polling gap
    const smoothFactor = 0.04;

    const animate = () => {
      const [currentLat, currentLng] = prevPos.current;
      const [targetLat, targetLng] = targetPos.current;

      const dist = Math.sqrt(Math.pow(targetLat - currentLat, 2) + Math.pow(targetLng - currentLng, 2));

      if (dist < 0.000005) {
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

  const crowdColor = crowdStatus ? crowdStatus.color : bus.occ > 80 ? "#ef4444" : bus.occ > 50 ? "#f59e0b" : "#10b981";
  const crowdLabel = crowdStatus ? crowdStatus.crowdLevel : bus.occ > 80 ? "High" : bus.occ > 50 ? "Moderate" : "Low";
  const displayOcc = crowdStatus ? crowdStatus.occupancyPercent : bus.occ;

  const dynamicBusIcon = L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${crowdColor}; opacity: 0.25; transform: scale(1.4); animation: pulse 2s infinite;"></div>
        <div style="background-color: ${crowdColor}; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.3); color: #ffffff; font-size: 15px; z-index: 2;">🚌</div>
        <div style="position: absolute; top: -4px; right: -6px; background-color: #0f172a; color: #ffffff; font-size: 9px; font-weight: 800; padding: 1.5px 5px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.4); z-index: 3; box-shadow: 0 2px 6px rgba(0,0,0,0.4);">${bus.spd}kph</div>
        <div style="position: absolute; bottom: -5px; background-color: ${crowdColor}; color: #ffffff; font-size: 8px; font-weight: 900; padding: 1px 4px; border-radius: 9999px; border: 1px solid #ffffff; z-index: 4; white-space: nowrap;">${crowdLabel}</div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

  return (
    <Marker position={pos} icon={dynamicBusIcon}>
      <Popup>
        <div className="text-gray-900 font-sans p-1 min-w-[170px]">
          <p className="font-black text-sm text-slate-800 border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
            <span>Route {routeId}</span>
            <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {bus.v_id.split(" ")[0]}
            </span>
          </p>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Heading</span>
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
              <span className="text-[10px] font-bold text-slate-800">{bus.nxt_stp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-600 font-black uppercase">ETA</span>
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

function MapController({
  center,
  zoom,
  bounds,
}: {
  center?: [number, number];
  zoom?: number;
  bounds?: L.LatLngBoundsExpression;
}) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16, animate: true });
    } else if (center) {
      map.flyTo(center, zoom || map.getZoom(), { animate: true, duration: 1.2 });
    }
  }, [center, zoom, bounds, map]);
  return null;
}

function MapFloatingControls({ onRecenter }: { onRecenter: () => void }) {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-3 z-[400] flex flex-col gap-1.5 shadow-xl">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white flex items-center justify-center font-black text-base hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white flex items-center justify-center font-black text-base hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer"
      >
        −
      </button>
      <button
        type="button"
        onClick={onRecenter}
        aria-label="Recenter map"
        className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer"
        title="Recenter"
      >
        🎯
      </button>
    </div>
  );
}

export default function LiveMap({
  busCode = "",
  destination = "",
  userLocation = null,
  routePath = null,
  routeStops = null,
  initialShowMetro = true,
  initialShowStops = true,
}: {
  busCode?: string;
  destination?: string;
  userLocation?: [number, number] | null;
  routePath?: [number, number][] | null;
  routeStops?: BusStopNode[] | null;
  initialShowMetro?: boolean;
  initialShowStops?: boolean;
}) {
  const { currentCity } = useAppStore();
  const cityData = getCityData(currentCity);

  const [fleetUpdates, setFleetUpdates] = useState<Record<string, LiveFleetUpdate>>({});
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
        const res = await fetch(`/api/bmtc?bus=${encodeURIComponent(busCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.found && data.route) {
            setBmtcRouteData(data.route);
          }
        }
      } catch (err) {
        console.warn("Could not load BMTC route details:", err);
      }
    }
    fetchBmtcRoute();
    return () => {
      isMounted = false;
    };
  }, [busCode]);

  // Combine provided route path or fetched BMTC path
  const effectiveRoutePath: [number, number][] | null =
    routePath && routePath.length > 0
      ? routePath
      : bmtcRouteData?.coordinates && bmtcRouteData.coordinates.length > 0
      ? bmtcRouteData.coordinates
      : null;

  // Combine provided stops or fetched BMTC stops
  const effectiveStops: BusStopNode[] =
    routeStops && routeStops.length > 0
      ? routeStops
      : bmtcRouteData?.stops && bmtcRouteData.stops.length > 0
      ? bmtcRouteData.stops
      : [];

  // Calculate dynamic map center & bounds
  let mapCenter: [number, number] = cityData.coordinates;
  let mapBounds: L.LatLngBoundsExpression | undefined = undefined;

  const activeVehicles = Object.values(fleetUpdates).flatMap((update) =>
    !busCode || update.route_id.toLowerCase().includes(busCode.toLowerCase())
      ? update.vehicles.map((v) => ({ ...v, route_id: update.route_id }))
      : []
  );

  if (effectiveRoutePath && effectiveRoutePath.length > 0) {
    mapBounds = L.latLngBounds(effectiveRoutePath);
  } else if (busCode && activeVehicles.length > 0) {
    mapCenter = [activeVehicles[0].lat, activeVehicles[0].lng];
  } else if (userLocation) {
    mapCenter = userLocation;
  }

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

  // Establish WebSockets / Telemetry Stream
  useEffect(() => {
    const channel = supabase.channel("bengaluru-transit-telemetry", {
      config: { broadcast: { self: true } },
    });

    channel
      .on("broadcast", { event: "LIVE_FLEET_UPDATE" }, (payload) => {
        const update = payload.payload as LiveFleetUpdate;
        setFleetUpdates((prev) => ({ ...prev, [update.route_id]: update }));
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setWsConnected(true);
      });

    const interval = setInterval(() => {
      const generatePayload = (
        route_id: string,
        baseLat: number,
        baseLng: number,
        baseOcc: number
      ): LiveFleetUpdate => {
        const currentV = fleetUpdates[route_id]?.vehicles[0];

        const lat = currentV ? currentV.lat + (Math.random() - 0.5) * 0.002 : baseLat;
        const lng = currentV ? currentV.lng + (Math.random() - 0.5) * 0.002 : baseLng;
        const spd = Math.floor(Math.random() * 20 + 25);
        const hdg = Math.floor(Math.random() * 360);
        const occ = Math.min(
          100,
          Math.max(0, currentV ? currentV.occ + (Math.floor(Math.random() * 10) - 5) : baseOcc)
        );
        const eta_sec = currentV ? Math.max(0, currentV.eta_sec - 3) : 180;

        return {
          type: "LIVE_FLEET_UPDATE",
          timestamp: Math.floor(Date.now() / 1000),
          route_id,
          vehicles: [
            {
              v_id: `KA5709/08/2026, 09:09 AM F${Math.floor(Math.random() * 1000)}`,
              lat,
              lng,
              spd,
              hdg,
              occ,
              nxt_stp: route_id === "500D" ? "Silk Board" : "Majestic",
              eta_sec,
            },
          ],
        };
      };

      const payloads = [
        generatePayload("500D", 13.0358, 77.597, 82),
        generatePayload("250", 13.012, 77.585, 45),
        generatePayload("335E", 12.9716, 77.6412, 95),
      ];

      payloads.forEach((payload) => {
        channel.send({ type: "broadcast", event: "LIVE_FLEET_UPDATE", payload });
        setFleetUpdates((prev) => ({ ...prev, [payload.route_id]: payload }));
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fleetUpdates]);

  // Start & Destination Markers for navigation routes
  const startPoint = effectiveRoutePath && effectiveRoutePath.length > 0 ? effectiveRoutePath[0] : null;
  const destPoint = effectiveRoutePath && effectiveRoutePath.length > 1 ? effectiveRoutePath[effectiveRoutePath.length - 1] : null;

  const startIcon = L.divIcon({
    className: "custom-route-start-marker",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; pointer-events: auto;">
        <div style="background-color: #10b981; color: #ffffff; font-size: 9px; font-weight: 900; letter-spacing: 0.5px; padding: 2px 7px; border-radius: 9999px; box-shadow: 0 4px 10px rgba(16,185,129,0.5); border: 1.5px solid #ffffff; white-space: nowrap;">START</div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background-color: #10b981; border: 3px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-top: 1px;"></div>
      </div>
    `,
    iconSize: [60, 36],
    iconAnchor: [30, 34],
  });

  const destIcon = L.divIcon({
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

  return (
    <div className="w-full h-full relative z-0 bg-slate-100 dark:bg-[#09090b]">
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
          <span
            className={`w-2 h-2 rounded-full ${
              wsConnected
                ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                : "bg-amber-400"
            }`}
          ></span>
          <span className="text-[9px] font-black tracking-widest text-slate-800 dark:text-slate-200 uppercase">
            {wsConnected ? "Live Telemetry" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2.5 shadow-xl pointer-events-none text-[8px] font-black">
        <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Mapbox HD</span>
        {showMetro && (
          <span className="flex items-center gap-1 border-l border-slate-300 dark:border-slate-700 pl-2 text-slate-600 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>121 Metro Stns</span>
          </span>
        )}
        {effectiveStops.length > 0 && (
          <span className="border-l border-slate-300 dark:border-slate-700 pl-2 text-slate-600 dark:text-slate-300">
            🚏 {effectiveStops.length} Stops
          </span>
        )}
      </div>

      <MapContainer
        key={`${cityData.id}-${recenterTrigger}`}
        center={cityData.coordinates}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full bg-[#f8fafc] dark:bg-[#09090b] z-0"
        zoomControl={false}
      >
        <MapController center={mapCenter} bounds={mapBounds} />
        <MapFloatingControls onRecenter={handleRecenter} />

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
                      <span key={l} className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-white">
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
                      {isFirst ? "Origin Terminal" : isLast ? "Destination Terminal" : `Bus Stop #${index + 1}`}
                    </span>
                    <span className="font-extrabold text-sm text-slate-900 block mb-1">🚏 {stop.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Lat: {stop.lat.toFixed(4)}, Lon: {stop.lon.toFixed(4)}
                    </span>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

        {/* High-visibility pulsating GPS User Location */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: "custom-user-marker",
              html: `
                <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
                  <div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: #3b82f6; opacity: 0.3; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                  <div style="background-color: #2563eb; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(37,99,235,0.9); z-index: 2;"></div>
                </div>
              `,
              iconSize: [34, 34],
              iconAnchor: [17, 17],
            })}
          >
            <Popup>
              <div className="font-bold text-xs p-1 text-slate-900">Your Current GPS Location</div>
            </Popup>
          </Marker>
        )}

        {/* Live Moving Vehicles with Dynamic Crowdsourced Colors (Green/Yellow/Red) */}
        {activeVehicles.map((bus) => (
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
              <div className="font-bold text-xs p-1 text-slate-900">Origin / Boarding Point</div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destPoint && (
          <Marker position={destPoint} icon={destIcon}>
            <Popup>
              <div className="font-bold text-xs p-1 text-slate-900">Destination Arrival Point</div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}