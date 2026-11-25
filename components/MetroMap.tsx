// components/MetroMap.tsx
"use client";

import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, useMap } from "react-leaflet";
import L from "leaflet";

import metroData from "@/data/namma_metro.json";
import { MAPBOX_PUBLIC_TOKEN, MAPBOX_STYLES, MapboxStyleOption } from "@/lib/mapbox";
import { getMetroRouteGeometry, findMetroRoute } from "@/lib/metroRouter";
import { LiveMetroTrain } from "@/lib/bmrclGtfsEngine";

interface MetroMapProps {
  originStationId?: string;
  destStationId?: string;
  onSelectOrigin?: (stationId: string) => void;
  onSelectDestination?: (stationId: string) => void;
  activeLineFilter?: string;
  onSelectLineFilter?: (line: string) => void;
  routePath?: [number, number][];
  className?: string;
}

function MapController({
  center,
  zoom,
  bounds,
  filterKey,
  recenterTrigger,
}: {
  center?: [number, number];
  zoom?: number;
  bounds?: L.LatLngBoundsExpression;
  filterKey?: string;
  recenterTrigger?: number;
}) {
  const map = useMap();
  const prevFilterRef = useRef<string | undefined>(undefined);
  const prevRecenterRef = useRef<number | undefined>(recenterTrigger);

  useEffect(() => {
    const filterChanged = prevFilterRef.current !== filterKey;
    const recenterClicked = prevRecenterRef.current !== recenterTrigger;
    prevFilterRef.current = filterKey;
    prevRecenterRef.current = recenterTrigger;

    // Only auto-fit bounds on filter change, initial load, or explicit recenter click
    if (filterChanged || recenterClicked) {
      if (filterKey && filterKey !== "All") {
        const lower = filterKey.toLowerCase();
        const lineStations = metroData.stations.filter((s) =>
          s.lines.some((l) => l.toLowerCase() === lower)
        );
        if (lineStations.length > 0) {
          const lineBounds = L.latLngBounds(
            lineStations.map((s) => [s.lat, s.lon] as [number, number])
          );
          map.fitBounds(lineBounds, { padding: [40, 40], maxZoom: 14, animate: true });
          return;
        }
      }

      if (bounds) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15, animate: true });
      } else if (center) {
        map.flyTo(center, zoom || 12, { animate: true, duration: 1.0 });
      }
    }
  }, [center, zoom, bounds, filterKey, recenterTrigger, map]);

  return null;
}

function MetroFloatingControls({
  onRecenter,
  showTrains,
  onToggleTrains,
  trainCount,
}: {
  onRecenter: () => void;
  showTrains: boolean;
  onToggleTrains: () => void;
  trainCount: number;
}) {
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
        aria-label="Recenter Metro Map"
        className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all shadow-md cursor-pointer"
        title="Recenter Central Metro"
      >
        🎯
      </button>
      <button
        type="button"
        onClick={onToggleTrains}
        aria-label="Toggle Live Trains"
        className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs active:scale-95 transition-all shadow-md cursor-pointer ${
          showTrains
            ? "bg-purple-600 border-purple-400 text-white shadow-purple-600/30"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
        }`}
        title={showTrains ? `Hide Live Trains (${trainCount} active)` : "Show Live Trains"}
      >
        🚆
      </button>
    </div>
  );
}

// 60 FPS Smooth Moving Metro Train Marker with RequestAnimationFrame Lerp
export function SmoothMetroTrainMarker({ train }: { train: LiveMetroTrain }) {
  const [pos, setPos] = useState<[number, number]>([train.lat, train.lng]);
  const prevPos = useRef<[number, number]>([train.lat, train.lng]);
  const targetPos = useRef<[number, number]>([train.lat, train.lng]);

  useEffect(() => {
    targetPos.current = [train.lat, train.lng];
    let animationFrame: number;
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
  }, [train.lat, train.lng]);

  const trainIcon = useMemo(() => {
    const isPurple = train.line === "Purple";
    const isGreen = train.line === "Green";
    const glowShadow = isPurple
      ? "0 0 14px rgba(140,40,119,0.8)"
      : isGreen
      ? "0 0 14px rgba(0,153,51,0.8)"
      : "0 0 14px rgba(234,179,8,0.8)";

    const html = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="
          position: absolute;
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          background: ${train.lineColor};
          opacity: 0.25;
          animation: ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          background: #090d16;
          border: 2px solid ${train.lineColor};
          box-shadow: ${glowShadow};
          border-radius: 12px;
          padding: 2.5px 7px;
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          font-family: ui-sans-serif, system-ui, sans-serif;
          user-select: none;
        ">
          <span style="font-size: 11px;">🚆</span>
          <span style="font-size: 9px; font-weight: 900; color: #ffffff; letter-spacing: 0.5px;">${train.trainId}</span>
          <span style="
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: ${train.isDwelling ? "#f59e0b" : "#10b981"};
            display: inline-block;
          "></span>
        </div>
      </div>
    `;

    return L.divIcon({
      className: "live-metro-train-marker-div",
      html,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }, [train.line, train.lineColor, train.trainId, train.isDwelling]);

  return (
    <Marker position={pos} icon={trainIcon} zIndexOffset={500}>
      <Popup>
        <div className="p-1 font-sans text-xs min-w-[210px] text-slate-900">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🚆</span>
              <span className="font-black text-sm text-slate-900">{train.trainId}</span>
            </div>
            <span
              className="text-[9px] font-black px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: train.lineColor }}
            >
              {train.line} Line
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Destination:</span>
              <span className="font-extrabold text-slate-900 truncate max-w-[130px]" title={train.headsign}>
                {train.headsign}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Speed:</span>
              <span className="font-black text-emerald-600">
                {train.isDwelling ? "0 km/h (Platform Stop)" : `${train.speed} km/h`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Next Station:</span>
              <span className="font-black text-indigo-600 truncate max-w-[130px]">
                {train.nextStationName}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Arrival In:</span>
              <span className="font-mono font-bold text-amber-600">
                {train.etaNextStationSeconds > 60
                  ? `${Math.floor(train.etaNextStationSeconds / 60)}m ${train.etaNextStationSeconds % 60}s`
                  : `${train.etaNextStationSeconds}s`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-bold">Crowd:</span>
              <span className="font-bold text-slate-800">
                {train.occupancyPercent}% ({train.crowdLevel})
              </span>
            </div>

            <div className="pt-1.5 mt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
              <span>IST Telemetry</span>
              <span>Trip {train.tripId}</span>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MetroMap({
  originStationId,
  destStationId,
  onSelectOrigin,
  onSelectDestination,
  activeLineFilter = "All",
  onSelectLineFilter,
  routePath,
  className = "w-full h-full",
}: MetroMapProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>(activeLineFilter);
  const [isExpanded, setIsExpanded] = useState(false);
  const [styleKey, setStyleKey] = useState<string>("navigation");
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [tileError, setTileError] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // Live Metro Trains State
  const [liveTrains, setLiveTrains] = useState<LiveMetroTrain[]>([]);
  const [showLiveTrains, setShowLiveTrains] = useState(true);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>("");

  const activeStyle: MapboxStyleOption = MAPBOX_STYLES[styleKey] || MAPBOX_STYLES.navigation;

  useEffect(() => {
    setSelectedFilter(activeLineFilter);
  }, [activeLineFilter]);

  // Poll live metro trains from /api/metro/live every 4 seconds
  useEffect(() => {
    let isMounted = true;

    async function fetchLiveTrains() {
      try {
        const lineParam = selectedFilter !== "All" ? `?line=${encodeURIComponent(selectedFilter)}` : "";
        const res = await fetch(`/api/metro/live${lineParam}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && isMounted) {
          setLiveTrains(data.trains || []);
          setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        }
      } catch (err) {
        console.warn("Failed to poll live metro trains:", err);
      }
    }

    fetchLiveTrains();
    const interval = setInterval(fetchLiveTrains, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedFilter]);

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

  // Real Metro Track Polyline Geometry
  const selectedRouteCoordinates: [number, number][] = useMemo(() => {
    if (routePath && routePath.length > 1) {
      return routePath;
    }
    if (originStationId && destStationId && originStationId !== destStationId) {
      return getMetroRouteGeometry(originStationId, destStationId);
    }
    return [];
  }, [routePath, originStationId, destStationId]);

  // Set of station IDs along the selected route for visual highlight
  const selectedRouteStationIds = useMemo(() => {
    if (originStationId && destStationId && originStationId !== destStationId) {
      const res = findMetroRoute(originStationId, destStationId);
      if (res?.path) {
        return new Set(res.path);
      }
    }
    return new Set<string>();
  }, [originStationId, destStationId]);

  // Dynamic bounds auto-fitting the entire curved metro track of the selected journey
  const mapBounds: L.LatLngBoundsExpression | undefined = useMemo(() => {
    if (selectedRouteCoordinates && selectedRouteCoordinates.length > 1) {
      return L.latLngBounds(selectedRouteCoordinates);
    }
    if (originStation && destStation) {
      return L.latLngBounds(
        [originStation.lat, originStation.lon],
        [destStation.lat, destStation.lon]
      );
    }
    return undefined;
  }, [selectedRouteCoordinates, originStation, destStation]);

  const centerCoordinates: [number, number] = [12.9757, 77.585]; // Central Bengaluru / Majestic

  const handleRecenter = useCallback(() => {
    setRecenterTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className={`relative ${isExpanded ? "fixed inset-0 z-50 bg-slate-950 p-4" : className}`}>
      {/* Top Mapbox Style & Line Selector Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-1.5 flex-wrap max-w-[85%]">
        <button
          type="button"
          onClick={() => setIsStyleMenuOpen((prev) => !prev)}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-100 hover:border-purple-500 transition-all cursor-pointer"
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
                    ? "bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{style.icon}</span>
                  <span>{style.label}</span>
                </span>
                {styleKey === style.id && <span className="text-purple-500 text-xs">✓</span>}
              </button>
            ))}
          </div>
        )}

        {/* Live Active Trains Badge */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2 text-[10px] font-bold text-slate-800 dark:text-slate-100">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{liveTrains.length} Live Trains</span>
        </div>

        {/* Expanded Line Filter Pills */}
        {isExpanded && (
          <div 
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            style={{ touchAction: "pan-x pan-y", WebkitOverflowScrolling: "touch" }}
            className="flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-x-auto no-scrollbar scroll-smooth"
          >
            {["All", "Purple", "Green", "Yellow", "Blue", "Pink"].map((line) => (
              <button
                key={line}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFilter(line);
                  onSelectLineFilter?.(line);
                }}
                className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
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
                      : "bg-slate-800 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {line === "Purple" ? "🟣" : line === "Green" ? "🟢" : line === "Yellow" ? "🟡" : line === "Blue" ? "🔵" : line === "Pink" ? "🌸" : "🌐"} {line}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Expand / Minimize Toggle Button */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-purple-500 shadow-xl text-[10px] font-black flex items-center gap-1 cursor-pointer transition-all"
          title={isExpanded ? "Minimize map" : "Expand map"}
        >
          <span>{isExpanded ? "✕ Minimize" : "⛶ Expand Map"}</span>
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[8px] font-black text-slate-700 dark:text-slate-200 flex items-center gap-2 pointer-events-none shadow-xl">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Purple
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Green
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-400" /> Yellow
        </span>
        <span className="text-slate-400 font-bold">· 121 Stations</span>
        {lastUpdatedTime && (
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            · {liveTrains.length} active trains
          </span>
        )}
      </div>

      <MapContainer
        center={centerCoordinates}
        zoom={12}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        className="w-full h-full bg-[#f8fafc] dark:bg-[#09090b] rounded-2xl z-0"
        zoomControl={false}
      >
        <MapController
          center={centerCoordinates}
          bounds={mapBounds}
          filterKey={selectedFilter}
          recenterTrigger={recenterTrigger}
        />
        <MetroFloatingControls
          onRecenter={handleRecenter}
          showTrains={showLiveTrains}
          onToggleTrains={() => setShowLiveTrains((prev) => !prev)}
          trainCount={liveTrains.length}
        />

        {/* Mapbox High-Definition Retina Tile Layer */}
        {!tileError ? (
          <TileLayer
            key={`mapbox-metro-${activeStyle.styleId}`}
            attribution='&copy; <a href="https://www.mapbox.com/" target="_blank" rel="noreferrer">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/${activeStyle.styleId}/tiles/256/{z}/{x}/{y}@2x?access_token=${MAPBOX_PUBLIC_TOKEN}`}
            tileSize={256}
            maxZoom={22}
            eventHandlers={{
              tileerror: () => {
                console.warn("Mapbox tile error on Metro map, fallback to OSM");
                setTileError(true);
              },
            }}
          />
        ) : (
          <TileLayer
            key="osm-fallback-metro"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}

        {/* Metro Track Polyline Alignments */}
        {visibleLines.map((line) => (
          <Polyline
            key={`metro-line-${line.id}`}
            positions={line.coordinates as [number, number][]}
            color={line.color}
            weight={line.lineKey === "purple" || line.lineKey === "green" ? 5 : 4}
            opacity={0.9}
          />
        ))}

        {/* Highlight Path between Origin & Destination along Metro Tracks */}
        {selectedRouteCoordinates && selectedRouteCoordinates.length > 1 && (
          <>
            <Polyline
              key="selected-trip-casing"
              positions={selectedRouteCoordinates}
              color="#090d16"
              weight={9}
              opacity={0.8}
            />
            <Polyline
              key="selected-trip-glow"
              positions={selectedRouteCoordinates}
              color="#0284c7"
              weight={6}
              opacity={0.85}
            />
            <Polyline
              key="selected-trip-line"
              positions={selectedRouteCoordinates}
              color="#38bdf8"
              weight={3.5}
              dashArray="6, 6"
              opacity={1}
            />
          </>
        )}

        {/* 121 Metro Station Markers */}
        {visibleStations.map((station) => {
          const isOrigin = originStation?.id === station.id;
          const isDest = destStation?.id === station.id;
          const isInterchange = station.isInterchange;
          const isOnSelectedRoute = selectedRouteStationIds.has(station.id);

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
            : station.lines.includes("Pink")
            ? "#ec4899"
            : "#3b82f6";

          const radius = isOrigin || isDest ? 9 : isOnSelectedRoute ? 7 : isInterchange ? 7 : 5;

          return (
            <CircleMarker
              key={`metro-station-${station.id}`}
              center={[station.lat, station.lon]}
              radius={radius}
              pathOptions={{
                color: isOrigin || isDest ? "#ffffff" : isOnSelectedRoute ? "#38bdf8" : isInterchange ? "#f59e0b" : "#ffffff",
                weight: isOrigin || isDest ? 3.5 : isOnSelectedRoute ? 3 : isInterchange ? 3 : 2,
                fillColor: fillColor,
                fillOpacity: 1,
              }}
            >
              <Popup>
                <div className="p-1 font-sans text-xs min-w-[170px] text-slate-900">
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
                            : l === "Pink"
                            ? "bg-pink-600"
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
                        className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                          isOrigin
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-700"
                        }`}
                      >
                        {isOrigin ? "✓ Boarding" : "Set Boarding"}
                      </button>
                    )}
                    {onSelectDestination && (
                      <button
                        type="button"
                        onClick={() => onSelectDestination(station.id)}
                        className={`flex-1 py-1 px-1.5 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                          isDest
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 hover:bg-red-100 text-slate-800 hover:text-red-700"
                        }`}
                      >
                        {isDest ? "✓ Destination" : "Set Destination"}
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Live Moving Metro Train Markers Layer */}
        {showLiveTrains &&
          liveTrains.map((train) => (
            <SmoothMetroTrainMarker key={`live-metro-train-${train.tripId}`} train={train} />
          ))}
      </MapContainer>
    </div>
  );
}
