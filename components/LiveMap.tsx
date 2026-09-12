"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { getCityData } from "@/lib/cityData";

interface BusTelemetry {
  id: string;
  route: string;
  destination: string;
  lat: number;
  lng: number;
  speed: string;
  occupancy: "High" | "Moderate" | "Low";
  eta: string;
}

// Custom Leaflet Bus Icon (Zomato-style vector marker)
const busIcon = L.divIcon({
  className: "custom-bus-marker",
  html: `<div style="background-color: #14b8a6; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #09090b; box-shadow: 0 4px 20px rgba(20,184,166,0.9); color: #020617; font-weight: 900; font-size: 14px; transform: scale(1); transition: transform 0.2s;">🚌</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Linear Interpolation (Lerp) Engine for Zomato-style smooth gliding
function SmoothBusMarker({ bus, icon }: { bus: BusTelemetry, icon: L.DivIcon }) {
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
        return; // Target reached
      }
      
      // Interpolate next frame
      const nextLat = currentLat + (targetLat - currentLat) * smoothFactor;
      const nextLng = currentLng + (targetLng - currentLng) * smoothFactor;
      
      prevPos.current = [nextLat, nextLng];
      setPos([nextLat, nextLng]);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [bus.lat, bus.lng]);

  return (
    <Marker position={pos} icon={icon}>
      <Popup>
        <div className="text-gray-900 font-sans p-1 min-w-[150px]">
          <p className="font-black text-sm text-teal-700 border-b border-teal-100 pb-1 mb-1">Route {bus.route} → {bus.destination}</p>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Live Speed</span>
            <span className="text-xs font-bold text-gray-900">{bus.speed}</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase">Density</span>
            <span className={`text-xs font-bold ${bus.occupancy === 'High' ? 'text-red-600' : 'text-orange-600'}`}>{bus.occupancy}</span>
          </div>
          <div className="bg-emerald-50 rounded p-1.5 mt-2 flex justify-between items-center">
            <span className="text-[10px] text-emerald-800 font-black uppercase">Next Stop ETA</span>
            <span className="text-xs font-black text-emerald-600 animate-pulse">{bus.eta}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function LiveMap() {
  const { currentCity } = useAppStore();
  const cityData = getCityData(currentCity);

  const [buses, setBuses] = useState<BusTelemetry[]>([
    { id: "b1", route: "500D", destination: "Silk Board", lat: 13.0358, lng: 77.5970, speed: "34 km/h", occupancy: "High", eta: "3 mins" },
    { id: "b2", route: "250", destination: "Majestic", lat: 13.0120, lng: 77.5850, speed: "26 km/h", occupancy: "Moderate", eta: "6 mins" },
    { id: "b3", route: "335E", destination: "ITPL", lat: 12.9716, lng: 77.6412, speed: "21 km/h", occupancy: "High", eta: "10 mins" },
  ]);

  const [wsConnected, setWsConnected] = useState(false);

  // Establish WebSockets / Server-Sent Events (SSE) Real-time pipeline
  useEffect(() => {
    const channel = supabase.channel('bengaluru-transit-telemetry', {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on('broadcast', { event: 'bus-location-update' }, (payload) => {
        const updatedBus = payload.payload as BusTelemetry;
        setBuses(prev => prev.map(b => b.id === updatedBus.id ? updatedBus : b));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setWsConnected(true);
        }
      });

    // Mock Live WebSocket Stream: Broadcast coordinate shifts every 3 seconds
    const interval = setInterval(() => {
      setBuses(prevBuses => {
        const driftedBuses = prevBuses.map(bus => {
          // Simulate realistic road movement
          const latDrift = (Math.random() - 0.5) * 0.0030;
          const lngDrift = (Math.random() - 0.5) * 0.0030;
          const newBus = {
            ...bus,
            lat: bus.lat + latDrift,
            lng: bus.lng + lngDrift,
            speed: `${Math.floor(Math.random() * 20 + 20)} km/h`
          };
          
          // Broadcast via WebSocket to all listening clients instantly
          channel.send({
            type: 'broadcast',
            event: 'bus-location-update',
            payload: newBus,
          });

          return newBus;
        });
        return driftedBuses;
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full h-full relative z-0 bg-surface-black">
      
      {/* WebSocket Status Badge Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-surface-black/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-dark flex items-center gap-2 shadow-2xl">
        <span className={`w-2.5 h-2.5 rounded-full ${wsConnected ? "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400"}`}></span>
        <span className="text-[9px] font-black tracking-widest text-white uppercase">
          {wsConnected ? "SSE / WS Active Stream" : "Connecting..."}
        </span>
      </div>
      
      {/* 60FPS Native Render Badge Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-surface-black/90 backdrop-blur-md px-2 py-1 rounded border border-brand-dark flex items-center shadow-2xl pointer-events-none">
        <span className="text-[8px] font-black tracking-widest text-brand-light uppercase">
          60 FPS Vector Canvas (Lerp enabled)
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
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {buses.map(bus => (
          <SmoothBusMarker key={bus.id} bus={bus} icon={busIcon} />
        ))}

        <Polyline 
          positions={[
            [13.1000, 77.5963], 
            [13.0358, 77.5970], 
            [12.9716, 77.5946], 
            [12.9250, 77.6840]  
          ]} 
          color="#14b8a6" 
          weight={5} 
          opacity={0.8} 
          dashArray="8, 8"
        />
      </MapContainer>
    </div>
  );
}