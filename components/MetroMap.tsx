"use client";

import { useEffect, useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import metroData from "@/data/namma_metro.json";

interface MetroMapProps {
  originStationId?: string;
  destStationId?: string;
  onSelectOrigin?: (stationId: string) => void;
  onSelectDestination?: (stationId: string) => void;
  activeLineFilter?: string;
  className?: string;
}

function MapController({ center, zoom, bounds }: { center?: [number, number]; zoom?: number; bounds?: L.LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [30, 30], animate: true });
    } else if (center) {
      map.flyTo(center, zoom || 12, { animate: true, duration: 1.2 });
    }
  }, [center, zoom, bounds, map]);
  return null;
}

export default function MetroMap({
  originStationId,
  destStationId,
  onSelectOrigin,
  onSelectDestination,
  activeLineFilter = "All",
  className = "w-full h-full",
}: MetroMapProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(activeLineFilter);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setSelectedFilter(activeLineFilter);
  }, [activeLineFilter]);

  // Filter lines
  const visibleLines = useMemo(() => {
    if (selectedFilter === "All") return metroData.lines;
    const filterLower = selectedFilter.toLowerCase();
    return metroData.lines.filter((l) => l.lineKey === filterLower);
  }, [selectedFilter]);

  // Filter stations
  const visibleStations = useMemo(() => {
    if (selectedFilter === "All") return metroData.stations;
    return metroData.stations.filter((s) =>
      s.lines.some((l) => l.toLowerCase() === selectedFilter.toLowerCase())
    );
  }, [selectedFilter]);

  const originStation = useMemo(
    () => metroData.stations.find((s) => s.id === originStationId),
    [originStationId]
  );
  const destStation = useMemo(
    () => metroData.stations.find((s) => s.id === destStationId),
    [destStationId]
  );

  // Dynamic bounds
  const mapBounds: L.LatLngBoundsExpression | undefined = useMemo(() => {
    if (originStation && destStation) {
      return L.latLngBounds(
        [originStation.lat, originStation.lon],
        [destStation.lat, destStation.lon]
      );
    }
    return undefined;
  }, [originStation, destStation]);

  const centerCoordinates: [number, number] = [12.9757, 77.585]; // Central Bengaluru / Majestic

  return (
    <div className={`relative ${isExpanded ? "fixed inset-0 z-50 bg-slate-950 p-4" : className}`}>
      {/* Top Filter Buttons & Controls (Shown in Fullscreen/Expanded mode) */}
      {isExpanded && (
        <div className="absolute top-3 left-3 z-[400] flex items-center gap-1 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto no-scrollbar max-w-[80%]">
          {["All", "Purple", "Green", "Yellow", "Blue", "Pink"].map((line) => (
            <button
              key={line}
              type="button"
              onClick={() => setSelectedFilter(line)}
              className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                selectedFilter === line
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
                    : "bg-slate-700 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {line === "Purple" ? "🟣" : line === "Green" ? "🟢" : line === "Yellow" ? "🟡" : line === "Blue" ? "🔵" : line === "Pink" ? "🌸" : "🌐"} {line}
            </button>
          ))}
        </div>
      )}

      {/* Expand / Minimize Toggle Button */}
      <div className="absolute top-2 right-2 z-[400] flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white shadow-xl text-[10px] font-bold flex items-center gap-1 cursor-pointer"
          title={isExpanded ? "Minimize map" : "Expand map"}
        >
          <span>{isExpanded ? "✕ Close" : "⛶ Expand"}</span>
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-2 left-2 z-[400] bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[8px] font-bold text-slate-300 flex items-center gap-2 pointer-events-none shadow-lg">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> Purple
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Green
        </span>
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Yellow
        </span>
        <span className="text-slate-400">· 121 Stations</span>
      </div>

      <MapContainer
        center={centerCoordinates}
        zoom={12}
        className="w-full h-full bg-[#09090b] rounded-2xl z-0"
        zoomControl={false}
      >
        <MapController center={centerCoordinates} bounds={mapBounds} />

        {/* 100% Free Leaflet Dark Navigation Basemap — Zero API Keys Required */}
        <TileLayer
          key="free-carto-dark-metro"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OSM</a> &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={18}
        />

        {/* Metro Track Polyline Alignments */}
        {visibleLines.map((line) => (
          <Polyline
            key={`metro-line-${line.id}`}
            positions={line.coordinates as [number, number][]}
            color={line.color}
            weight={line.lineKey === "purple" || line.lineKey === "green" ? 5 : 4}
            opacity={0.85}
          />
        ))}

        {/* Highlight Path between Origin & Destination if selected */}
        {originStation && destStation && (
          <Polyline
            key="selected-trip-line"
            positions={[
              [originStation.lat, originStation.lon],
              [destStation.lat, destStation.lon],
            ]}
            color="#38bdf8"
            weight={3}
            dashArray="4, 6"
            opacity={0.9}
          />
        )}

        {/* Station Markers */}
        {visibleStations.map((station) => {
          const isOrigin = originStation?.id === station.id;
          const isDest = destStation?.id === station.id;
          const isInterchange = station.isInterchange;

          const fillColor = isOrigin
            ? "#10b981"
            : isDest
            ? "#ef4444"
            : isInterchange
            ? "#ffffff"
            : station.lines.includes("Purple")
            ? "#a855f7"
            : station.lines.includes("Green")
            ? "#10b981"
            : station.lines.includes("Yellow")
            ? "#eab308"
            : "#3b82f6";

          const radius = isOrigin || isDest ? 8 : isInterchange ? 6 : 4;

          return (
            <CircleMarker
              key={`metro-station-${station.id}`}
              center={[station.lat, station.lon]}
              radius={radius}
              pathOptions={{
                color: isOrigin || isDest ? "#ffffff" : isInterchange ? "#f59e0b" : "#ffffff",
                weight: isOrigin || isDest ? 3 : isInterchange ? 2.5 : 1.5,
                fillColor: fillColor,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-xs min-w-[150px]">
                  <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-200">
                    <span className="font-black text-slate-900 text-sm">{station.name}</span>
                    {isInterchange && (
                      <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                        Interchange
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {station.lines.map((l) => (
                      <span
                        key={l}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white ${
                          l === "Purple"
                            ? "bg-purple-600"
                            : l === "Green"
                            ? "bg-emerald-600"
                            : l === "Yellow"
                            ? "bg-amber-500 text-slate-900"
                            : "bg-blue-600"
                        }`}
                      >
                        {l} Line
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-1.5 mt-2 pt-1 border-t border-slate-100">
                    {onSelectOrigin && (
                      <button
                        type="button"
                        onClick={() => onSelectOrigin(station.id)}
                        className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded transition-colors ${
                          isOrigin
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-700"
                        }`}
                      >
                        {isOrigin ? "✓ From" : "Set From"}
                      </button>
                    )}
                    {onSelectDestination && (
                      <button
                        type="button"
                        onClick={() => onSelectDestination(station.id)}
                        className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded transition-colors ${
                          isDest
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 hover:bg-red-100 text-slate-800 hover:text-red-700"
                        }`}
                      >
                        {isDest ? "✓ To" : "Set To"}
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
