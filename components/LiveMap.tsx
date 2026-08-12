"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ABSOLUTE ALIAS PATHS
import { supabase } from "@/lib/supabase";

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

// Custom Leaflet Bus Icon
const busIcon = L.divIcon({
  className: "custom-bus-marker",
  html: `<div style="background-color: #14b8a6; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #09090b; box-shadow: 0 0 15px rgba(20,184,166,0.8); color: #020617; font-weight: 900; font-size: 12px;">🚌</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function LiveMap() {
  const [buses, setBuses] = useState<BusTelemetry[]>([
    { id: "b1", route: "500D", destination: "Silk Board", lat: 13.0358, lng: 77.5970, speed: "34 km/h", occupancy: "High", eta: "3 mins" },
    { id: "b2", route: "250", destination: "Majestic", lat: 13.0120, lng: 77.5850, speed: "26 km/h", occupancy: "Moderate", eta: "6 mins" },
    { id: "b3", route: "335E", destination: "ITPL", lat: 12.9716, lng: 77.6412, speed: "21 km/h", occupancy: "High", eta: "10 mins" },
  ]);

  const [wsConnected, setWsConnected] = useState(false);

  // Establish Supabase Realtime WebSocket Channel
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

    // Broadcast position shifts across connected clients every 5 seconds
    const interval = setInterval(() => {
      setBuses(prevBuses => {
        const driftedBuses = prevBuses.map(bus => {
          const latDrift = (Math.random() - 0.5) * 0.0010;
          const lngDrift = (Math.random() - 0.5) * 0.0010;
          const newBus = {
            ...bus,
            lat: bus.lat + latDrift,
            lng: bus.lng + lngDrift,
          };
          
          // Broadcast via WebSocket
          channel.send({
            type: 'broadcast',
            event: 'bus-location-update',
            payload: newBus,
          });

          return newBus;
        });
        return driftedBuses;
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-surface-dark shadow-2xl relative z-0">
      
      {/* WebSocket Status Badge Overlay */}
      <div className="absolute top-3 right-3 z-10 bg-surface-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-surface-dark flex items-center gap-2 shadow-lg">
        <span className={`w-2 h-2 rounded-full ${wsConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
        <span className="text-[10px] font-bold text-gray-300 uppercase">
          {wsConnected ? "WebSocket Live Sync" : "Connecting..."}
        </span>
      </div>

      <MapContainer
        center={[13.0150, 77.5900]} // Centered around North Bengaluru / Yelahanka
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%", background: "#09090b" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {buses.map(bus => (
          <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={busIcon}>
            <Popup>
              <div className="text-gray-900 font-sans p-1">
                <p className="font-black text-sm text-teal-700">Route {bus.route} → {bus.destination}</p>
                <p className="text-xs font-semibold text-gray-700 mt-1">Speed: {bus.speed}</p>
                <p className="text-xs text-gray-600">Crowd: <span className="font-bold text-orange-600">{bus.occupancy}</span></p>
                <p className="text-xs font-bold text-emerald-700 mt-1">Next Stop ETA: {bus.eta}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        <Polyline 
          positions={[
            [13.1000, 77.5963], 
            [13.0358, 77.5970], 
            [12.9716, 77.5946], 
            [12.9250, 77.6840]  
          ]} 
          color="#14b8a6" 
          weight={4} 
          opacity={0.6} 
          dashArray="6, 6"
        />
      </MapContainer>
    </div>
  );
}