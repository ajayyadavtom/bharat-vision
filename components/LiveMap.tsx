"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

const busIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  className: "smooth-marker" 
});

const routePath: [number, number][] = [
  [13.1005, 77.5963], [13.0980, 77.5960], [13.0950, 77.5955], 
  [13.0910, 77.5945], [13.0870, 77.5930]
];

export default function LiveMap() {
  const yelahankaCoords: [number, number] = [13.1005, 77.5963];
  const [busPosition, setBusPosition] = useState<[number, number]>(routePath[0]);

  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);

    let pathIndex = 0;
    const drivingEngine = setInterval(() => {
      pathIndex = (pathIndex + 1) % routePath.length;
      setBusPosition(routePath[pathIndex]);
    }, 2500);

    return () => clearInterval(drivingEngine);
  }, []);

  return (
    <div className="w-full h-full relative z-0 bg-surface-dark">
      
      <style>{`
        .smooth-marker {
          transition: transform 2.5s linear !important;
        }
      `}</style>

      <MapContainer 
        center={yelahankaCoords} 
        zoom={14} 
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={busPosition} icon={busIcon}>
          <Popup className="font-bold text-gray-800">
            Route 500D (Live) <br/> 
            <span className="text-brand-dark text-xs">Moving to next stop...</span>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}