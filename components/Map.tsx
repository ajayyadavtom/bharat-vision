"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Navigation, MapPin, Compass, Locate, Route as RouteIcon, Layers } from "lucide-react";
import { MAPBOX_PUBLIC_TOKEN, MAPBOX_STYLES, MapboxStyleOption, fetchMapboxRoute } from "@/lib/mapbox";

// Fix Leaflet default marker icon paths in Next.js
const userIcon = L.divIcon({
  className: "custom-user-gps-marker",
  html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(59,130,246,0.9); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background-color: #ffffff; border-radius: 50%;"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const destIcon = L.divIcon({
  className: "custom-dest-marker",
  html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(239,68,68,0.9); display: flex; align-items: center; justify-content: center; font-size: 12px; color: white; font-weight: bold;">🏁</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// Component to handle live GPS location tracking
function LiveLocationTracker({
  onLocationFound,
  followUser,
}: {
  onLocationFound: (coords: [number, number]) => void;
  followUser: boolean;
}) {
  const map = useMap();
  const hasCenteredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        onLocationFound(coords);

        if (!hasCenteredRef.current || followUser) {
          map.flyTo(coords, 14, { animate: true, duration: 1.2 });
          hasCenteredRef.current = true;
        }
      },
      (err) => console.warn("Live GPS location watch error:", err.message),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map, onLocationFound, followUser]);

  return null;
}

// Allow user to tap/click map to set a new destination
function MapClickHandler({ onMapClick }: { onMapClick: (coords: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function MapFloatingControls() {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend() {
      setCurrentZoom(map.getZoom());
    },
  });

  return (
    <div className="absolute bottom-20 right-4 z-[400] flex flex-col gap-1.5 shadow-xl">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Zoom in"
        className="w-9 h-9 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center font-black text-lg active:scale-95 transition-all shadow-md cursor-pointer backdrop-blur-md"
        title="Zoom In"
      >
        +
      </button>
      <div className="text-[9px] font-black text-center text-slate-400 bg-slate-900/90 py-0.5 px-1 rounded-lg border border-slate-700 pointer-events-none select-none backdrop-blur-md">
        {Math.round(currentZoom)}x
      </div>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Zoom out"
        className="w-9 h-9 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center font-black text-lg active:scale-95 transition-all shadow-md cursor-pointer backdrop-blur-md"
        title="Zoom Out"
      >
        −
      </button>
    </div>
  );
}

interface MapProps {
  initialDestination?: [number, number];
  destinationName?: string;
  className?: string;
  showQuickHubs?: boolean;
}

export default function Map({
  initialDestination = [12.9781, 77.5695], // Default: Majestic (Kempegowda Bus Station)
  destinationName = "Majestic (Kempegowda Station)",
  className = "w-full h-full min-h-[450px]",
  showQuickHubs = true,
}: MapProps) {
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [targetDestination, setTargetDestination] = useState<[number, number]>(initialDestination);
  const [targetLabel, setTargetLabel] = useState<string>(destinationName);
  const [followUser, setFollowUser] = useState<boolean>(false);
  const [styleKey, setStyleKey] = useState<string>("navigation");
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][] | null>(null);
  const [tileError, setTileError] = useState(false);

  const activeStyle: MapboxStyleOption = MAPBOX_STYLES[styleKey] || MAPBOX_STYLES.navigation;

  // Popular transit hubs for instant navigation
  const POPULAR_HUBS: { name: string; coords: [number, number] }[] = [
    { name: "Majestic KBS", coords: [12.9781, 77.5695] },
    { name: "Silk Board", coords: [12.9172, 77.6228] },
    { name: "Indiranagar", coords: [12.9784, 77.6408] },
    { name: "Whitefield", coords: [12.9863, 77.7335] },
    { name: "Yeshwanthpur", coords: [13.0232, 77.5502] },
    { name: "Airport (KIA)", coords: [13.1986, 77.7066] },
  ];

  // Fetch real Mapbox driving/navigation route between User and Target Destination
  useEffect(() => {
    if (!userPos || !targetDestination) {
      setRouteCoordinates(null);
      return;
    }

    let isMounted = true;
    async function loadRoute() {
      if (userPos && targetDestination) {
        const path = await fetchMapboxRoute(userPos, targetDestination);
        if (isMounted) {
          if (path && path.length > 0) {
            setRouteCoordinates(path);
          } else {
            setRouteCoordinates([userPos, targetDestination]);
          }
        }
      }
    }

    loadRoute();
    return () => {
      isMounted = false;
    };
  }, [userPos, targetDestination]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Top Floating Navigation Header */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 shadow-2xl text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black tracking-wide flex items-center gap-1">
              <Compass size={12} className="text-emerald-400" /> Mapbox Navigation
            </span>
            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full uppercase">
              HD
            </span>
          </div>

          {/* Map Layer Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsStyleMenuOpen((prev) => !prev)}
              className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-2xl text-[10px] font-bold text-slate-200 transition-all cursor-pointer pointer-events-auto"
              title="Change Mapbox Style"
            >
              <span>{activeStyle.icon}</span>
              <span>{activeStyle.label}</span>
              <span className="text-[8px] text-slate-400">▾</span>
            </button>

            {isStyleMenuOpen && (
              <div className="absolute top-9 right-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-1 min-w-[160px] z-[450]">
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
                    <span>
                      {style.icon} {style.label}
                    </span>
                    {styleKey === style.id && <span className="text-emerald-500 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Landmark Selectors */}
        {showQuickHubs && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pointer-events-auto py-0.5">
            {POPULAR_HUBS.map((hub) => (
              <button
                key={hub.name}
                onClick={() => {
                  setTargetDestination(hub.coords);
                  setTargetLabel(hub.name);
                }}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all shadow-md cursor-pointer ${
                  targetLabel === hub.name
                    ? "bg-emerald-500 text-slate-950 border border-emerald-400 font-black"
                    : "bg-slate-900/85 text-slate-300 border border-slate-700/80 hover:bg-slate-800"
                }`}
              >
                {hub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locate Me Floating Action Button */}
      <button
        onClick={() => setFollowUser((prev) => !prev)}
        className="absolute bottom-6 right-4 z-[400] w-11 h-11 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 border border-slate-700/90 rounded-full shadow-2xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer backdrop-blur-md"
        title="Center on my live GPS location"
      >
        <Locate size={20} className={userPos ? "text-emerald-400" : "text-slate-400"} />
      </button>

      {/* Destination Indicator Pill */}
      <div className="absolute bottom-6 left-4 z-[400] max-w-[240px] bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-2xl text-white pointer-events-auto">
        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-black text-slate-400">
          <MapPin size={10} className="text-red-400" />
          <span>Navigating to</span>
        </div>
        <p className="text-xs font-black text-white truncate mt-0.5">{targetLabel}</p>
        <span className="text-[9px] text-slate-400 block mt-0.5">Tap anywhere on map to change destination</span>
      </div>

      {/* Main Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        className="w-full h-full bg-[#09090b] z-0"
        zoomControl={false}
      >
        <MapFloatingControls />
        {/* Mapbox High-Definition Tiles */}
        {!tileError ? (
          <TileLayer
            key={`mapbox-map-${activeStyle.styleId}`}
            attribution='&copy; <a href="https://www.mapbox.com/" target="_blank" rel="noreferrer">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/${activeStyle.styleId}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`}
            tileSize={256}
            maxZoom={22}
            eventHandlers={{
              tileerror: () => {
                console.warn("Mapbox tile loading failed in Map.tsx");
                setTileError(true);
              },
            }}
          />
        ) : (
          <TileLayer
            key="osm-free-tiles"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* Live Location GPS Tracker */}
        <LiveLocationTracker onLocationFound={(coords) => setUserPos(coords)} followUser={followUser} />

        {/* Handle tap/click on map to change destination */}
        <MapClickHandler
          onMapClick={(coords) => {
            setTargetDestination(coords);
            setTargetLabel(`Custom Pin (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`);
          }}
        />

        {/* Live User Position Marker */}
        {userPos && (
          <Marker position={userPos} icon={userIcon}>
            <Popup>
              <div className="p-1 font-sans text-xs">
                <span className="text-[9px] uppercase font-bold text-blue-500 block">Live GPS</span>
                <strong className="text-slate-800 text-sm">You are here</strong>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-mono">
                  {userPos[0].toFixed(5)}, {userPos[1].toFixed(5)}
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {targetDestination && (
          <Marker position={targetDestination} icon={destIcon}>
            <Popup>
              <div className="p-1 font-sans text-xs">
                <span className="text-[9px] uppercase font-bold text-red-500 block">Target Destination</span>
                <strong className="text-slate-800 text-sm">{targetLabel}</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Mapbox Road Polyline Navigation Route */}
        {routeCoordinates && routeCoordinates.length > 0 && (
          <>
            <Polyline positions={routeCoordinates} color="#0f172a" weight={8} opacity={0.7} />
            <Polyline positions={routeCoordinates} color="#06b6d4" weight={5} opacity={1} />
          </>
        )}
      </MapContainer>
    </div>
  );
}
