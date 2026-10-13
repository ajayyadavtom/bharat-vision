"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Navigation, MapPin, Compass, Locate, Route as RouteIcon, Layers } from "lucide-react";

// Dynamically attach leaflet-routing-machine on the client
if (typeof window !== "undefined") {
  (window as any).L = L;
  try {
    require("leaflet-routing-machine");
  } catch (err) {
    console.warn("Leaflet routing machine initialization:", err);
  }
}

// Fix Leaflet's default marker icon paths in Next.js
const userIcon = L.divIcon({
  className: "custom-user-gps-marker",
  html: `<div style="background-color: #3b82f6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(59,130,246,0.9); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background-color: #ffffff; border-radius: 50%;"></div></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const destIcon = L.divIcon({
  className: "custom-dest-marker",
  html: `<div style="background-color: #ef4444; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 0 12px rgba(239,68,68,0.9); display: flex; align-items: center; justify-content: center; font-size: 11px; color: white; font-weight: bold;">🏁</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

// Component to handle live GPS location tracking
function LiveLocationTracker({ 
  onLocationFound,
  followUser
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

        // Center map on user when first acquired or when followUser is requested
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

// Component to handle turn-by-turn routing using free public OSRM
function RoutingControl({ from, to }: { from: [number, number]; to: [number, number] }) {
  const map = useMap();
  const routingControlRef = useRef<any>(null);

  useEffect(() => {
    if (!map || !from || !to) return;

    // Remove previous routing control instance if present
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {
        // Safe ignore
      }
      routingControlRef.current = null;
    }

    try {
      // @ts-ignore - leaflet-routing-machine dynamically attached to L
      if (L.Routing && L.Routing.control) {
        // @ts-ignore
        const control = L.Routing.control({
          waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
          router: (L.Routing as any).osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1", // 100% Free Public OSRM Endpoint
          }),
          lineOptions: {
            styles: [
              { color: "#10b981", weight: 6, opacity: 0.9 },
              { color: "#3b82f6", weight: 3, opacity: 0.9 }
            ],
            extendToWaypoints: true,
            missingRouteStyles: [{ color: "#9333ea", weight: 3, dashArray: "5, 10" }]
          },
          addWaypoints: false,
          draggableWaypoints: false,
          fitSelectedRoutes: true,
          show: false, // Keep clean on mobile, custom UI displays metrics
          createMarker: () => null, // We render our own clean custom markers
        }).addTo(map);

        routingControlRef.current = control;
      }
    } catch (err) {
      console.warn("OSRM routing control initialization:", err);
    }

    return () => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch {
          // Ignore cleanup errors
        }
        routingControlRef.current = null;
      }
    };
  }, [map, from, to]);

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
  showQuickHubs = true
}: MapProps) {
  // Default coordinate (Bengaluru central)
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [targetDestination, setTargetDestination] = useState<[number, number]>(initialDestination);
  const [targetLabel, setTargetLabel] = useState<string>(destinationName);
  const [followUser, setFollowUser] = useState<boolean>(false);
  const [tileSource, setTileSource] = useState<"osm" | "carto">("osm");

  // Popular transit hubs for instant navigation
  const POPULAR_HUBS: { name: string; coords: [number, number] }[] = [
    { name: "Majestic KBS", coords: [12.9781, 77.5695] },
    { name: "Silk Board", coords: [12.9172, 77.6228] },
    { name: "Indiranagar", coords: [12.9784, 77.6408] },
    { name: "Whitefield", coords: [12.9863, 77.7335] },
    { name: "Yeshwanthpur", coords: [13.0232, 77.5502] },
    { name: "Airport (KIA)", coords: [13.1986, 77.7066] },
  ];

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      
      {/* Top Floating Navigation Header */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2 pointer-events-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 shadow-2xl text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black tracking-wide flex items-center gap-1">
              <Compass size={12} className="text-emerald-400" /> Free OSM + OSRM
            </span>
            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full uppercase">
              Zero Key
            </span>
          </div>

          {/* Map Layer Toggle */}
          <button
            onClick={() => setTileSource(prev => prev === "osm" ? "carto" : "osm")}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-2xl text-[10px] font-bold text-slate-200 transition-all cursor-pointer pointer-events-auto"
            title="Toggle between OpenStreetMap and CARTO Dark"
          >
            <Layers size={12} className="text-blue-400" />
            <span>{tileSource === "osm" ? "OpenStreetMap" : "CARTO Dark"}</span>
          </button>
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
        onClick={() => setFollowUser(prev => !prev)}
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
        <span className="text-[9px] text-slate-400 block mt-0.5">
          Tap anywhere on map to change destination
        </span>
      </div>

      {/* Main Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="w-full h-full bg-[#09090b] z-0"
        zoomControl={false}
      >
        {/* Free Tile Layer (Zero API Keys) */}
        {tileSource === "osm" ? (
          <TileLayer
            key="osm-free-tiles"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            key="carto-free-tiles"
            attribution='&copy; <a href="https://carto.com/" target="_blank" rel="noreferrer">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
        )}

        {/* Live Location GPS Tracker */}
        <LiveLocationTracker 
          onLocationFound={(coords) => setUserPos(coords)} 
          followUser={followUser}
        />

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

        {/* Free OSRM Turn-by-Turn Routing Line between User & Destination */}
        {userPos && targetDestination && (
          <RoutingControl from={userPos} to={targetDestination} />
        )}
      </MapContainer>
    </div>
  );
}
