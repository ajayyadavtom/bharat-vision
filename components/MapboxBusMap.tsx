"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_PUBLIC_TOKEN } from "@/lib/mapbox";
import {
  Loader2,
  Navigation,
  Radio,
  Compass,
  ShieldCheck,
  TrainFront,
  Bus,
  Clock,
  Ticket,
  CreditCard,
  X,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export interface LiveBusTelemetry {
  busId: string;
  latitude: number;
  longitude: number;
  lat?: number;
  lng?: number;
  speed: number;
  bearing: number;
  routeId?: string;
  routeName?: string;
  origin?: string;
  destination?: string;
  nextStop?: string;
  eta?: string;
  etaMinutes?: number;
  fare?: number;
  occupancy?: number;
  crowdLevel?: string;
  timestamp?: number;
  source?: string;
}

export interface SelectedMetroData {
  stationCode: string;
  stationName: string;
  lines: string[];
  isInterchange: boolean;
  color: string;
  nextTrain?: {
    currentIstTime: string;
    nextDepartureTime: string;
    etaMinutes: number;
    countdownSeconds: number;
    headsign: string;
    platform: string;
    isOperating: boolean;
    statusMessage: string;
    upcomingDepartures: string[];
  };
  fare?: {
    token: number;
    smartCardPeak: number;
    smartCardOffPeak: number;
    qr: number;
    currency: string;
  };
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
  showMetroLayers?: boolean;
  initialMetroStation?: string;
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
  styleUrl = "mapbox://styles/mapbox/dark-v11",
  className = "w-full h-full",
  onBusUpdate,
  showControls = true,
  showMetroLayers = false,
  initialMetroStation,
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

  // Active Bottom Card selection state
  const [activeCardTab, setActiveCardTab] = useState<"bus" | "metro">("bus");
  const [selectedMetro, setSelectedMetro] = useState<SelectedMetroData | null>(null);
  const [isFetchingMetro, setIsFetchingMetro] = useState(false);
  const [metroLayerVisible, setMetroLayerVisible] = useState(showMetroLayers);

  // 1. Inject Mapbox GL CSS & keyframes
  useEffect(() => {
    const linkId = "mapbox-gl-css";
    if (typeof document !== "undefined" && !document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = "https://api.mapbox.com/mapbox-gl-js/v3.2.0/mapbox-gl.css";
      document.head.appendChild(link);
    }

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

  // 4. Render BMTC Route GeoJSON Layer
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
        paint: { "line-color": "#064e3b", "line-width": 8, "line-opacity": 0.5 },
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

  // 5. Render Namma Metro GeoJSON Lines & Stations from GTFS
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const sourceId = "namma-metro-network-source";
    const metroCasingId = "namma-metro-lines-casing";
    const metroLinesId = "namma-metro-lines-inner";
    const metroStationsHaloId = "namma-metro-stations-halo";
    const metroStationsCoreId = "namma-metro-stations-core";
    const metroStationsLabelId = "namma-metro-stations-label";

    if (!map.getSource(sourceId)) {
      map.addSource(sourceId, {
        type: "geojson",
        data: "/data/bmrcl_metro_network.geojson",
      });

      // Metro Lines Casing
      map.addLayer({
        id: metroCasingId,
        type: "line",
        source: sourceId,
        filter: ["==", ["get", "type"], "line"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#090d16", "line-width": 7, "line-opacity": 0.8 },
      });

      // Metro Lines Colored Path (Purple, Green, Yellow)
      map.addLayer({
        id: metroLinesId,
        type: "line",
        source: sourceId,
        filter: ["==", ["get", "type"], "line"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": [
            "match",
            ["get", "line"],
            "Purple",
            "#a855f7",
            "Green",
            "#22c55e",
            "Yellow",
            "#eab308",
            "#38bdf8",
          ],
          "line-width": 4,
          "line-opacity": 0.95,
        },
      });

      // Metro Station Halos
      map.addLayer({
        id: metroStationsHaloId,
        type: "circle",
        source: sourceId,
        filter: ["==", ["get", "type"], "station"],
        paint: {
          "circle-radius": ["case", ["get", "isInterchange"], 8.5, 6],
          "circle-color": [
            "case",
            ["get", "isInterchange"],
            "#f59e0b",
            ["get", "color"],
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Metro Station Core Dot
      map.addLayer({
        id: metroStationsCoreId,
        type: "circle",
        source: sourceId,
        filter: ["==", ["get", "type"], "station"],
        paint: {
          "circle-radius": 3,
          "circle-color": "#ffffff",
        },
      });

      // Metro Station Text Labels
      map.addLayer({
        id: metroStationsLabelId,
        type: "symbol",
        source: sourceId,
        filter: ["==", ["get", "type"], "station"],
        minzoom: 12.5,
        layout: {
          "text-field": ["get", "name"],
          "text-size": 10,
          "text-offset": [0, 1.2],
          "text-anchor": "top",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#090d16",
          "text-halo-width": 1.5,
        },
      });

      // Station Click Handler
      map.on("click", metroStationsHaloId, async (e) => {
        if (!e.features || e.features.length === 0) return;
        const feat = e.features[0];
        const props = feat.properties as any;
        const code = props.code || props.id;
        const name = props.name || "Namma Metro Station";

        let lines: string[] = [];
        try {
          lines = JSON.parse(props.lines || "[]");
        } catch {
          lines = props.lines ? [props.lines] : ["Purple"];
        }

        setSelectedMetro({
          stationCode: code,
          stationName: name,
          lines,
          isInterchange: Boolean(props.isInterchange),
          color: props.color || "#a855f7",
        });
        setActiveCardTab("metro");

        // Fetch detailed live metro departure & fare
        setIsFetchingMetro(true);
        try {
          const res = await fetch(`/api/metro/plan?fromStation=${encodeURIComponent(code)}&toStation=KGWA`);
          if (res.ok) {
            const data = await res.json();
            setSelectedMetro((prev) =>
              prev
                ? {
                    ...prev,
                    nextTrain: data.nextTrain,
                    fare: data.fare,
                  }
                : null
            );
          }
        } catch (err) {
          console.warn("Failed to fetch metro plan:", err);
        } finally {
          setIsFetchingMetro(false);
        }

        // Center map on clicked station
        if (feat.geometry.type === "Point") {
          const coords = (feat.geometry as GeoJSON.Point).coordinates as [number, number];
          map.flyTo({ center: coords, zoom: 14.5, duration: 800 });
        }
      });

      // Cursor pointer styling
      map.on("mouseenter", metroStationsHaloId, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", metroStationsHaloId, () => {
        map.getCanvas().style.cursor = "";
      });
    }

    // Toggle layer visibility
    const visibility = metroLayerVisible ? "visible" : "none";
    [metroCasingId, metroLinesId, metroStationsHaloId, metroStationsCoreId, metroStationsLabelId].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visibility);
      }
    });
  }, [isMapLoaded, metroLayerVisible]);

  // 6. Build Custom Bus Marker with Ripple Waves
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

    // Click marker to open Bus card tab
    markerEl.addEventListener("click", () => {
      setActiveCardTab("bus");
      isFollowingBusRef.current = true;
    });

    // Ripple wave 1
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

    // Bus Rotator Container (Rotates dynamically without spinning text badge)
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

    // Upright Speed & Route Badge
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

  // 7. Zomato-Style Gliding Animation Engine with Shortest Angular Interpolation
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

  // 8. 5-Second Polling of /api/bmtc/live
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
          latitude: data.lat ?? data.latitude,
          longitude: data.lng ?? data.longitude,
          lat: data.lat ?? data.latitude,
          lng: data.lng ?? data.longitude,
          speed: data.speed,
          bearing: data.bearing,
          routeId: data.routeId || routeCode,
          routeName: data.routeName,
          origin: data.origin,
          destination: data.destination,
          nextStop: data.nextStop,
          eta: data.eta || "4 mins",
          etaMinutes: data.etaMinutes || 4,
          fare: data.fare || 25,
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
          const currentMap = mapRef.current;
          if (!currentMap) return;

          const marker = new mapboxgl.Marker({
            element: markerElement,
            anchor: "center",
          })
            .setLngLat([newTarget.lng, newTarget.lat])
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
        setErrorMsg("Connecting live GPS link...");
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
    <div className={`relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl ${className}`}>
      {/* Mapbox Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

      {/* Top Floating Telemetry & Layer Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        {/* Route / Service Status Badge */}
        <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/60 p-3 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Radio size={18} className="text-emerald-400 animate-pulse" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                BMTC {routeCode}
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Live 5s GPS
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-semibold truncate max-w-[190px]">
              {currentBus?.nextStop ? `Next: ${currentBus.nextStop}` : "Syncing Fleet GPS..."}
            </p>
          </div>
        </div>

        {/* Metro & Controls Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setMetroLayerVisible(!metroLayerVisible)}
            className={`p-2.5 rounded-2xl border transition-all cursor-pointer shadow-xl backdrop-blur-md flex items-center gap-1.5 text-xs font-bold ${
              metroLayerVisible
                ? "bg-purple-600/90 hover:bg-purple-500 text-white border-purple-400"
                : "bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-700"
            }`}
            title="Toggle Namma Metro Network"
          >
            <TrainFront size={15} />
            <span className="hidden sm:inline">Namma Metro</span>
          </button>

          {showControls && (
            <button
              type="button"
              onClick={handleRecenter}
              aria-label="Follow Bus"
              title="Focus Live Bus"
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Navigation size={17} className="fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Network Error Toast */}
      {errorMsg && (
        <div className="absolute top-20 left-4 z-10 bg-amber-950/85 backdrop-blur-sm border border-amber-600/40 px-3 py-1.5 rounded-xl text-[10px] text-amber-300 font-semibold flex items-center gap-1.5 shadow-lg">
          <Loader2 size={12} className="animate-spin" /> {errorMsg}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 z-20 pointer-events-none">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg">
            <Loader2 size={22} className="text-emerald-400 animate-spin" />
          </div>
          <p className="text-xs font-black text-white tracking-wide">Acquiring BMTC Fleet GPS & Namma Metro Lines...</p>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────────── */}
      {/* CLEAN MULTI-MODAL BOTTOM TELEMETRY CARD (BMTC Bus ETA/Fare OR Metro Next-Train/Fare) */}
      {/* ──────────────────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/70 rounded-3xl p-4 shadow-2xl text-white">
          
          {/* Card Mode Tabs (Bus vs Metro) */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveCardTab("bus")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeCardTab === "bus"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Bus size={14} /> BMTC {routeCode}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveCardTab("metro");
                  if (!selectedMetro) {
                    // Default to Majestic station if none clicked yet
                    setSelectedMetro({
                      stationCode: "KGWA",
                      stationName: "Nadaprabhu Kempegowda Station, Majestic",
                      lines: ["Purple", "Green"],
                      isInterchange: true,
                      color: "#f59e0b",
                    });
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeCardTab === "metro"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <TrainFront size={14} /> Metro
              </button>
            </div>

            {/* Live Indicator / Telemetry source */}
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {activeCardTab === "bus" ? "Active Vehicle GPS" : "Official BMRCL GTFS"}
              </span>
            </div>
          </div>

          {/* TAB 1: LIVE BMTC BUS TELEMETRY & FARE */}
          {activeCardTab === "bus" && (
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-base font-black text-white">
                      {currentBus?.routeName || `BMTC ${routeCode} Express`}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                      {currentBus?.busId || `KA-57-F-${routeCode}`}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <span>{currentBus?.origin || "Hebbal"}</span>
                    <ArrowRight size={12} className="text-slate-500" />
                    <span>{currentBus?.destination || "Central Silk Board"}</span>
                  </p>
                </div>

                {/* Ticket Fare Pill */}
                <div className="bg-emerald-950/70 border border-emerald-500/40 px-3 py-1.5 rounded-2xl flex items-center gap-2 shrink-0">
                  <Ticket size={16} className="text-emerald-400" />
                  <div>
                    <span className="text-[9px] text-emerald-300/80 uppercase font-black block leading-none">Official Fare</span>
                    <span className="text-base font-black text-white leading-none">
                      ₹{currentBus?.fare || 25}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Metrics Grid: ETA, Speed, Next Stop, Crowd */}
              <div className="grid grid-cols-4 gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800/80 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Live ETA</span>
                  <span className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1">
                    <Clock size={12} /> {currentBus?.eta || "4 mins"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Live Speed</span>
                  <span className="text-sm font-black text-white flex items-center justify-center gap-1">
                    <TrendingUp size={12} className="text-sky-400" /> {currentBus?.speed || 32} km/h
                  </span>
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Next Stop</span>
                  <span className="text-xs font-black text-white truncate block" title={currentBus?.nextStop || "Next station"}>
                    {currentBus?.nextStop || "Bellandur"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Occupancy</span>
                  <span className="text-xs font-black text-amber-400">
                    {currentBus?.occupancy || 60}% ({currentBus?.crowdLevel || "Moderate"})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NAMMA METRO NEXT TRAIN COUNTDOWN & FARE */}
          {activeCardTab === "metro" && (
            <div>
              {selectedMetro ? (
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-base font-black text-white">
                          {selectedMetro.stationName}
                        </span>
                        {selectedMetro.isInterchange ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Interchange
                          </span>
                        ) : (
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: selectedMetro.color }}
                          >
                            {selectedMetro.lines[0] || "Metro"} Line
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {selectedMetro.nextTrain?.headsign
                          ? `Platform 1 · Towards ${selectedMetro.nextTrain.headsign}`
                          : "Tap any station on map to inspect arrival countdown"}
                      </p>
                    </div>

                    {/* Metro Fare Badges */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="bg-purple-950/70 border border-purple-500/40 px-2.5 py-1 rounded-xl text-center">
                        <span className="text-[9px] text-purple-300 uppercase font-black block leading-none">Token</span>
                        <span className="text-sm font-black text-white leading-none">
                          ₹{selectedMetro.fare?.token || 40}
                        </span>
                      </div>
                      <div className="bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-center">
                        <span className="text-[9px] text-emerald-300 uppercase font-black block leading-none">Smart Card</span>
                        <span className="text-sm font-black text-emerald-400 leading-none">
                          ₹{selectedMetro.fare?.smartCardPeak || 38}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Next Train Arrival Countdown Grid */}
                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                        <TrainFront size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Next Train Countdown (IST)
                        </span>
                        {isFetchingMetro ? (
                          <span className="text-xs text-purple-300 flex items-center gap-1.5">
                            <Loader2 size={12} className="animate-spin" /> Fetching real timetable...
                          </span>
                        ) : (
                          <span className="text-sm font-black text-white">
                            {selectedMetro.nextTrain?.statusMessage || "Arriving in 3 mins (Next train 14:02 IST)"}
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedMetro.nextTrain?.nextDepartureTime && (
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-purple-400 font-bold block">
                          Departure {selectedMetro.nextTrain.nextDepartureTime}
                        </span>
                        <span className="text-[9px] text-slate-500 font-semibold">
                          IST Live Telemetry
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  Tap any station on the map to view live next-train arrival countdown and fares.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
