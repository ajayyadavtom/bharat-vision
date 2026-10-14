// components/MapboxBusMap.tsx
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_PUBLIC_TOKEN } from "@/lib/mapbox";
import { Loader2, Navigation, Radio, Compass, ShieldCheck } from "lucide-react";

export interface LiveBusTelemetry {
  busId: string;
  latitude: number;
  longitude: number;
  speed: number;
  bearing: number;
  routeId?: string;
  routeName?: string;
  origin?: string;
  destination?: string;
  nextStop?: string;
  occupancy?: number;
  crowdLevel?: string;
  timestamp?: number;
  source?: string;
}

export interface MapboxBusMapProps {
  routeCode?: string; // e.g. "500D", "335E", "250"
  routeCoordinates?: [number, number][]; // Optional [lat, lng][] array
  pollIntervalMs?: number; // Defaults to 5000 (5 seconds)
  initialZoom?: number; // Defaults to 13.5
  initialCenter?: [number, number]; // [lat, lng]
  styleUrl?: string; // Defaults to navigation day
  className?: string;
  onBusUpdate?: (bus: LiveBusTelemetry) => void;
  showControls?: boolean;
}

const RIPPLE_KEYFRAMES_STYLE = `
@keyframes bmtcRippleWave {
  0% { transform: scale(0.6); opacity: 0.85; }
  60% { transform: scale(2.0); opacity: 0.25; }
  100% { transform: scale(2.5); opacity: 0; }
}
@keyframes bmtcOuterGlow {
  0% { transform: scale(0.7); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}
`;

export default function MapboxBusMap({
  routeCode = "500D",
  routeCoordinates,
  pollIntervalMs = 5000,
  initialZoom = 13.5,
  initialCenter = [12.9716, 77.5946],
  styleUrl = "mapbox://styles/mapbox/navigation-day-v1",
  className = "w-full h-full",
  onBusUpdate,
  showControls = true,
}: MapboxBusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const busRotatorRef = useRef<HTMLDivElement | null>(null);
  const speedBadgeRef = useRef<HTMLSpanElement | null>(null);

  const prevCoordRef = useRef<{ lng: number; lat: number; bearing: number } | null>(null);
  const targetCoordRef = useRef<{ lng: number; lat: number; bearing: number } | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isFollowingBusRef = useRef<boolean>(true);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBus, setCurrentBus] = useState<LiveBusTelemetry | null>(null);
  const [activeRoutePath, setActiveRoutePath] = useState<[number, number][]>(routeCoordinates || []);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Inject ripple animation keyframes
  useEffect(() => {
    const styleId = "bmtc-mapbox-ripple-styles";
    if (!document.getElementById(styleId)) {
      const styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.innerHTML = RIPPLE_KEYFRAMES_STYLE;
      document.head.appendChild(styleTag);
    }
  }, []);

  // 2. Fetch route path from existing BMTC directory if not provided
  useEffect(() => {
    if (routeCoordinates && routeCoordinates.length > 0) {
      setActiveRoutePath(routeCoordinates);
      return;
    }

    let isMounted = true;
    async function fetchRoutePolyline() {
      try {
        const res = await fetch(`/api/bmtc?bus=${encodeURIComponent(routeCode)}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.found && data.route?.coordinates?.length > 0) {
            setActiveRoutePath(data.route.coordinates);
          }
        }
      } catch (err) {
        console.warn("Failed to load route polyline:", err);
      }
    }

    fetchRoutePolyline();
    return () => {
      isMounted = false;
    };
  }, [routeCode, routeCoordinates]);

  // 3. Initialize Mapbox GL JS map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken =
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
      MAPBOX_PUBLIC_TOKEN ||
      "";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [initialCenter[1], initialCenter[0]],
      zoom: initialZoom,
      pitch: 35,
      attributionControl: false,
    });

    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, showZoom: false }), "bottom-right");
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-left");

    map.on("load", () => {
      mapRef.current = map;
      setIsMapLoaded(true);
    });

    map.on("dragstart", () => {
      isFollowingBusRef.current = false;
    });

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (markerRef.current) markerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [styleUrl, initialCenter, initialZoom]);

  // 4. Render GeoJSON LineString Route Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || activeRoutePath.length === 0) return;

    const sourceId = "bmtc-route-source";
    const casingLayerId = "bmtc-route-casing";
    const lineLayerId = "bmtc-route-inner-line";

    const geojsonCoordinates = activeRoutePath.map(([lat, lng]) => [lng, lat]);

    const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      properties: { routeCode },
      geometry: {
        type: "LineString",
        coordinates: geojsonCoordinates,
      },
    };

    if (map.getSource(sourceId)) {
      (map.getSource(sourceId) as mapboxgl.GeoJSONSource).setData(routeGeoJSON);
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: routeGeoJSON,
      });

      map.addLayer({
        id: casingLayerId,
        type: "line",
        source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#064e3b", "line-width": 8, "line-opacity": 0.45 },
      });

      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#10b981", "line-width": 4 },
      });
    }

    if (geojsonCoordinates.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      geojsonCoordinates.forEach((coord) => bounds.extend(coord as [number, number]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 1000 });
    }
  }, [isMapLoaded, activeRoutePath, routeCode]);

  // 5. Build Custom Marker with Ripple Effect
  const createCustomMarkerElement = useCallback((bus: LiveBusTelemetry) => {
    const markerEl = document.createElement("div");
    markerEl.className = "bmtc-vehicle-marker-wrapper";
    markerEl.style.position = "relative";
    markerEl.style.width = "64px";
    markerEl.style.height = "64px";
    markerEl.style.display = "flex";
    markerEl.style.alignItems = "center";
    markerEl.style.justifyContent = "center";
    markerEl.style.cursor = "pointer";

    // Ripple ring 1
    const rippleRing = document.createElement("div");
    rippleRing.style.position = "absolute";
    rippleRing.style.width = "46px";
    rippleRing.style.height = "46px";
    rippleRing.style.borderRadius = "50%";
    rippleRing.style.backgroundColor = "rgba(16, 185, 129, 0.45)";
    rippleRing.style.animation = "bmtcRippleWave 2.2s cubic-bezier(0, 0.2, 0.8, 1) infinite";
    rippleRing.style.pointerEvents = "none";
    markerEl.appendChild(rippleRing);

    // Ripple wave 2
    const rippleWave = document.createElement("div");
    rippleWave.style.position = "absolute";
    rippleWave.style.width = "46px";
    rippleWave.style.height = "46px";
    rippleWave.style.borderRadius = "50%";
    rippleWave.style.border = "2px solid rgba(52, 211, 153, 0.85)";
    rippleWave.style.animation = "bmtcOuterGlow 2.2s cubic-bezier(0.2, 0, 0, 1) infinite";
    rippleWave.style.animationDelay = "0.7s";
    rippleWave.style.pointerEvents = "none";
    markerEl.appendChild(rippleWave);

    // Bus Rotator Container
    const busRotator = document.createElement("div");
    busRotator.style.width = "42px";
    busRotator.style.height = "42px";
    busRotator.style.borderRadius = "50%";
    busRotator.style.display = "flex";
    busRotator.style.alignItems = "center";
    busRotator.style.justifyContent = "center";
    busRotator.style.transformOrigin = "center center";
    busRotator.style.willChange = "transform";
    busRotator.style.transform = `rotate(${bus.bearing || 0}deg)`;
    busRotator.style.zIndex = "2";

    busRotator.innerHTML = `
      <div style="position: relative; width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #047857 100%); border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 6v6"></path>
          <path d="M16 6v6"></path>
          <path d="M4 12h16"></path>
          <path d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"></path>
          <circle cx="7" cy="18" r="1.5" fill="#ffffff"></circle>
          <circle cx="17" cy="18" r="1.5" fill="#ffffff"></circle>
        </svg>
        <div style="position: absolute; top: -5px; width: 0; height: 0; border-left: 4.5px solid transparent; border-right: 4.5px solid transparent; border-bottom: 7px solid #ffffff; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));"></div>
      </div>
    `;
    markerEl.appendChild(busRotator);
    busRotatorRef.current = busRotator;

    // Upright Route & Speed Badge
    const badge = document.createElement("div");
    badge.style.position = "absolute";
    badge.style.top = "-12px";
    badge.style.backgroundColor = "#0f172a";
    badge.style.color = "#ffffff";
    badge.style.fontSize = "9px";
    badge.style.fontWeight = "800";
    badge.style.padding = "2px 7px";
    badge.style.borderRadius = "9999px";
    badge.style.border = "1.5px solid rgba(255,255,255,0.7)";
    badge.style.boxShadow = "0 2px 6px rgba(0,0,0,0.35)";
    badge.style.zIndex = "4";
    badge.style.whiteSpace = "nowrap";
    badge.style.pointerEvents = "none";
    badge.innerHTML = `<span style="color: #34d399;">${routeCode}</span> • <span class="bmtc-spd-val">${bus.speed} km/h</span>`;
    markerEl.appendChild(badge);

    const spdSpan = badge.querySelector(".bmtc-spd-val") as HTMLSpanElement;
    if (spdSpan) speedBadgeRef.current = spdSpan;

    return markerEl;
  }, [routeCode]);

  // 6. Smooth Glide Engine (Linear Coordinate & Shortest Angular Interpolation)
  const animateGlideToTarget = useCallback(
    (target: { lng: number; lat: number; bearing: number }, durationMs: number) => {
      const activeMarker = markerRef.current;
      const busRotator = busRotatorRef.current;
      if (!activeMarker) return;

      const start = prevCoordRef.current || { ...target };
      const startTime = performance.now();

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      let angleDiff = (target.bearing - start.bearing) % 360;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      function step(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);

        const currentLng = start.lng + (target.lng - start.lng) * progress;
        const currentLat = start.lat + (target.lat - start.lat) * progress;
        if (activeMarker) {
          activeMarker.setLngLat([currentLng, currentLat]);
        }

        const currentBearing = (start.bearing + angleDiff * progress + 360) % 360;
        if (busRotator) {
          busRotator.style.transform = `rotate(${currentBearing.toFixed(2)}deg)`;
        }

        prevCoordRef.current = {
          lng: currentLng,
          lat: currentLat,
          bearing: currentBearing,
        };

        if (isFollowingBusRef.current && mapRef.current) {
          mapRef.current.easeTo({
            center: [currentLng, currentLat],
            duration: 0,
            pitch: 35,
          });
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        }
      }

      animFrameRef.current = requestAnimationFrame(step);
    },
    []
  );

  // 7. Polling every 5 seconds
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    let isSubscribed = true;

    async function pollLiveTelemetry() {
      try {
        const res = await fetch(`/api/bmtc/live?route=${encodeURIComponent(routeCode)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!isSubscribed || !data.success) return;

        const bus: LiveBusTelemetry = {
          busId: data.busId || `KA-57-F-${routeCode}`,
          latitude: data.latitude,
          longitude: data.longitude,
          speed: data.speed,
          bearing: data.bearing,
          routeId: data.routeId || routeCode,
          routeName: data.routeName,
          origin: data.origin,
          destination: data.destination,
          nextStop: data.nextStop,
          occupancy: data.occupancy,
          crowdLevel: data.crowdLevel,
          timestamp: data.timestamp,
          source: data.source,
        };

        setCurrentBus(bus);
        setIsLoading(false);
        setErrorMsg(null);
        if (onBusUpdate) onBusUpdate(bus);

        if (speedBadgeRef.current) {
          speedBadgeRef.current.textContent = `${bus.speed} km/h`;
        }

        const newTarget = {
          lng: bus.longitude,
          lat: bus.latitude,
          bearing: bus.bearing,
        };

        if (!markerRef.current) {
          const markerElement = createCustomMarkerElement(bus);

          const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
            <div style="padding: 6px; font-family: system-ui, sans-serif; min-width: 170px;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
                <span style="font-weight: 900; color: #0f172a; font-size: 13px;">Route ${bus.routeId}</span>
                <span style="font-size: 10px; background: #ecfdf5; color: #047857; font-weight: 700; padding: 2px 6px; border-radius: 6px;">Live GPS</span>
              </div>
              <p style="margin: 0; font-size: 11px; color: #64748b;">Vehicle: <b>${bus.busId}</b></p>
              <p style="margin: 2px 0; font-size: 11px; color: #64748b;">Speed: <b>${bus.speed} km/h</b></p>
              <p style="margin: 2px 0; font-size: 11px; color: #64748b;">Next Stop: <b>${bus.nextStop || "Arriving soon"}</b></p>
              <div style="margin-top: 6px; display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${bus.occupancy && bus.occupancy > 75 ? "#ef4444" : "#10b981"}; display: inline-block;"></span>
                <span style="font-size: 10px; font-weight: 700; color: #334155;">Occupancy: ${bus.occupancy || 55}% (${bus.crowdLevel || "Moderate"})</span>
              </div>
            </div>
          `);

          const currentMap = mapRef.current;
          if (!currentMap) return;

          const marker = new mapboxgl.Marker({
            element: markerElement,
            anchor: "center",
          })
            .setLngLat([newTarget.lng, newTarget.lat])
            .setPopup(popup)
            .addTo(currentMap);

          markerRef.current = marker;
          prevCoordRef.current = { ...newTarget };
          targetCoordRef.current = { ...newTarget };
        } else {
          targetCoordRef.current = newTarget;
          animateGlideToTarget(newTarget, pollIntervalMs);
        }
      } catch (err: any) {
        console.warn("Error polling BMTC live telemetry:", err);
        setErrorMsg("Reconnecting live GPS link...");
      }
    }

    pollLiveTelemetry();
    const intervalTimer = setInterval(pollLiveTelemetry, pollIntervalMs);

    return () => {
      isSubscribed = false;
      clearInterval(intervalTimer);
    };
  }, [isMapLoaded, routeCode, pollIntervalMs, createCustomMarkerElement, animateGlideToTarget, onBusUpdate]);

  const handleRecenter = () => {
    isFollowingBusRef.current = true;
    if (prevCoordRef.current && mapRef.current) {
      mapRef.current.flyTo({
        center: [prevCoordRef.current.lng, prevCoordRef.current.lat],
        zoom: 15,
        pitch: 35,
        duration: 800,
      });
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[420px]" />

      {/* Floating Status Banner */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 pointer-events-none max-w-[280px]">
        <div className="bg-slate-950/85 backdrop-blur-md border border-slate-700/60 p-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Radio size={18} className="text-emerald-400 animate-pulse" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">Route {routeCode}</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Live 5s
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium truncate">
              {currentBus?.nextStop ? `Next: ${currentBus.nextStop}` : "Tracking active bus..."}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-amber-950/80 backdrop-blur-sm border border-amber-600/40 px-3 py-1.5 rounded-xl text-[10px] text-amber-300 font-medium flex items-center gap-1.5">
            <Loader2 size={12} className="animate-spin" /> {errorMsg}
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20 pointer-events-none">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <Loader2 size={20} className="text-emerald-400 animate-spin" />
          </div>
          <p className="text-xs font-bold text-white tracking-wide">Acquiring BMTC Fleet GPS...</p>
        </div>
      )}

      {/* Follow Bus Button */}
      {showControls && (
        <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleRecenter}
            aria-label="Follow Bus"
            title="Focus & Follow Bus"
            className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xl hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
          >
            <Navigation size={18} className="fill-current" />
          </button>
        </div>
      )}

      {/* Bottom Telemetry Bar */}
      {currentBus && (
        <div className="absolute bottom-4 left-4 z-10 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 px-3 py-2 rounded-xl flex items-center gap-3 text-white text-[11px] font-medium shadow-xl">
          <div className="flex items-center gap-1.5">
            <Compass size={13} className="text-emerald-400" />
            <span>{currentBus.bearing}° Heading</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-teal-400" />
            <span>{currentBus.busId}</span>
          </div>
        </div>
      )}
    </div>
  );
}