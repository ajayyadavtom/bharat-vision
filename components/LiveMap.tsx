"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { getCityData } from "@/lib/cityData";

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

interface LiveFleetUpdate {
  type: string;
  timestamp: number;
  route_id: string;
  vehicles: LiveVehicle[];
}

// Linear Interpolation (Lerp) Engine for Zomato-style smooth gliding
function SmoothBusMarker({ bus, routeId }: { bus: LiveVehicle, routeId: string }) {
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

  // Dynamic Occupancy Color Coding (Green < 50%, Yellow 50-80%, Red > 80%)
  const bgColor = bus.occ > 80 ? '#ef4444' : bus.occ > 50 ? '#f59e0b' : '#10b981';
  const shadowColor = bus.occ > 80 ? 'rgba(239,68,68,0.7)' : bus.occ > 50 ? 'rgba(245,158,11,0.7)' : 'rgba(16,185,129,0.7)';
  
  const dynamicBusIcon = L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background-color: ${bgColor}; opacity: 0.2; transform: scale(1.5);"></div>
        <div style="background-color: ${bgColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #ffffff; box-shadow: 0 4px 15px ${shadowColor}; color: #ffffff; font-size: 14px; z-index: 2;">🚌</div>
        <div style="position: absolute; top: -6px; right: -6px; background-color: #000; color: #fff; font-size: 9px; font-weight: bold; padding: 2px 4px; border-radius: 4px; z-index: 3;">${bus.spd}kph</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  return (
    <Marker position={pos} icon={dynamicBusIcon}>
      <Popup>
        <div className="text-gray-900 font-sans p-1 min-w-[160px]">
          <p className="font-black text-sm text-slate-800 border-b border-slate-200 pb-1 mb-2">Route {routeId} <span className="text-xs font-normal text-slate-500">({bus.v_id.split(' ')[0]})</span></p>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Heading</span>
            <span className="text-xs font-bold text-gray-900">{bus.hdg}°</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Occupancy</span>
            <span className="text-xs font-bold" style={{ color: bgColor }}>{bus.occ}% Full</span>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded p-2 mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Next Stop</span>
              <span className="text-[10px] font-bold text-slate-800">{bus.nxt_stp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-emerald-600 font-black uppercase">ETA</span>
              <span className="text-xs font-black text-emerald-600 animate-pulse">{Math.floor(bus.eta_sec / 60)}m {bus.eta_sec % 60}s</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

import { useMap } from "react-leaflet";

function MapController({ center, zoom, bounds }: { center?: [number, number], zoom?: number, bounds?: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (center) {
      map.flyTo(center, zoom || map.getZoom(), { animate: true, duration: 1.5 });
    }
  }, [center, zoom, bounds, map]);
  return null;
}

export default function LiveMap({ 
  busCode = "", 
  destination = "", 
  userLocation = null,
  routePath = null
}: { 
  busCode?: string, 
  destination?: string, 
  userLocation?: [number, number] | null,
  routePath?: [number, number][] | null
}) {
  const { currentCity } = useAppStore();
  const cityData = getCityData(currentCity);

  const [fleetUpdates, setFleetUpdates] = useState<Record<string, LiveFleetUpdate>>({});
  const [wsConnected, setWsConnected] = useState(false);
  
  // Calculate dynamic map center
  let mapCenter: [number, number] = cityData.coordinates;
  let mapBounds: L.LatLngBoundsExpression | undefined = undefined;

  const activeVehicles = Object.values(fleetUpdates).flatMap(update => 
    (!busCode || update.route_id.toLowerCase().includes(busCode.toLowerCase())) 
      ? update.vehicles.map(v => ({ ...v, route_id: update.route_id })) 
      : []
  );

  if (routePath && routePath.length > 0) {
    mapBounds = L.latLngBounds(routePath);
  } else if (busCode && activeVehicles.length > 0) {
    mapCenter = [activeVehicles[0].lat, activeVehicles[0].lng];
  } else if (userLocation) {
    mapCenter = userLocation;
  }

  // Establish WebSockets / Server-Sent Events (SSE) Real-time pipeline
  useEffect(() => {
    const channel = supabase.channel('bengaluru-transit-telemetry', {
      config: { broadcast: { self: true } },
    });

    channel
      .on('broadcast', { event: 'LIVE_FLEET_UPDATE' }, (payload) => {
        const update = payload.payload as LiveFleetUpdate;
        setFleetUpdates(prev => ({ ...prev, [update.route_id]: update }));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setWsConnected(true);
      });

    // Mock Live WebSocket Stream injecting exactly the requested JSON Structure every 3 seconds
    const interval = setInterval(() => {
      
      const generatePayload = (route_id: string, baseLat: number, baseLng: number, baseOcc: number): LiveFleetUpdate => {
        // Retrieve current state to drift from, or start fresh
        let currentV = fleetUpdates[route_id]?.vehicles[0];
        
        const lat = currentV ? currentV.lat + (Math.random() - 0.5) * 0.002 : baseLat;
        const lng = currentV ? currentV.lng + (Math.random() - 0.5) * 0.002 : baseLng;
        const spd = Math.floor(Math.random() * 20 + 25);
        const hdg = Math.floor(Math.random() * 360);
        const occ = Math.min(100, Math.max(0, currentV ? currentV.occ + (Math.floor(Math.random() * 10) - 5) : baseOcc));
        const eta_sec = currentV ? Math.max(0, currentV.eta_sec - 3) : 180;
        
        return {
          type: "LIVE_FLEET_UPDATE",
          timestamp: Math.floor(Date.now() / 1000),
          route_id,
          vehicles: [{
            v_id: `KA5709/08/2026, 09:09 AM F${Math.floor(Math.random() * 1000)}`,
            lat, lng, spd, hdg, occ,
            nxt_stp: route_id === "500D" ? "Silk Board" : "Majestic",
            eta_sec
          }]
        };
      };

      const payloads = [
        generatePayload("500D", 13.0358, 77.5970, 82),
        generatePayload("250", 13.0120, 77.5850, 45),
        generatePayload("335E", 12.9716, 77.6412, 95)
      ];

      payloads.forEach(payload => {
        channel.send({ type: 'broadcast', event: 'LIVE_FLEET_UPDATE', payload });
        // Local state update for simulation since broadcast self:true takes a tiny ms
        setFleetUpdates(prev => ({ ...prev, [payload.route_id]: payload }));
      });
      
    }, 3000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fleetUpdates]);

  return (
    <div className="w-full h-full relative z-0 bg-surface-black">
      
      {/* WebSocket Status Badge Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-surface-black/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-brand-dark flex items-center gap-2 shadow-2xl">
        <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`}></span>
        <span className="text-[9px] font-black tracking-widest text-slate-900 dark:text-white uppercase">
          {wsConnected ? "WebSocket Active" : "Connecting..."}
        </span>
      </div>
      
      <div className="absolute bottom-3 left-3 z-[400] bg-surface-black/90 backdrop-blur-md px-2 py-1 rounded border border-slate-200 dark:border-brand-dark flex items-center shadow-2xl pointer-events-none">
        <span className="text-[8px] font-black tracking-widest text-brand-light uppercase">
          60 FPS Interpolation
        </span>
      </div>

      <MapContainer
        key={cityData.id}
        center={cityData.coordinates}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full bg-[#09090b] z-0"
        zoomControl={false}
      >
        <MapController center={mapCenter} bounds={mapBounds} />
        
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {userLocation && (
          <Marker position={userLocation} icon={L.divIcon({
            className: "custom-user-marker",
            html: `<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59,130,246,0.8);"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          })}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {activeVehicles.map(bus => (
          <SmoothBusMarker key={bus.v_id} bus={bus} routeId={bus.route_id} />
        ))}

        {routePath && routePath.length > 0 && (
          <Polyline 
            positions={routePath} 
            color="#3b82f6" 
            weight={5} 
            opacity={0.8} 
            dashArray="1, 8"
          />
        )}
      </MapContainer>
    </div>
  );
}