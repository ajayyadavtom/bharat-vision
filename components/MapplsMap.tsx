"use client";

import React, { useEffect, useRef, useState } from "react";

interface MapplsMapProps {
  center?: [number, number]; // [lat, lng]
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
  }>;
  className?: string;
}

declare global {
  interface Window {
    mappls?: any;
  }
}

export default function MapplsMap({
  center = [12.9716, 77.5946], // Bengaluru center by default
  zoom = 13,
  markers = [],
  className = "w-full h-full min-h-[400px]"
}: MapplsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mappls Static Key
  const staticKey = process.env.NEXT_PUBLIC_MAPPLS_KEY || "lhvxctxtboznvhqkwtgkawgxjakfvxlmlfhu";

  useEffect(() => {
    let isMounted = true;
    const containerId = "mappls-web-map-container";

    // 1. Function to initialize the Mappls map
    const initializeMapplsMap = () => {
      if (!window.mappls || !containerRef.current || mapInstanceRef.current) return;

      try {
        const map = new window.mappls.Map(containerId, {
          center: { lat: center[0], lng: center[1] },
          zoom: zoom,
          zoomControl: true,
          traffic: false,
          hybrid: false
        });

        mapInstanceRef.current = map;

        map.on("load", () => {
          if (!isMounted) return;
          setIsLoaded(true);

          // Add markers if supplied
          markers.forEach((m) => {
            new window.mappls.Marker({
              map: map,
              position: { lat: m.lat, lng: m.lng },
              fitbounds: false,
              popupHtml: m.title ? `<div class="p-2 font-bold">${m.title}</div>` : undefined
            });
          });
        });

        map.on("error", (err: any) => {
          console.warn("Mappls error:", err);
        });
      } catch (err: any) {
        console.error("Mappls initialization error:", err);
        if (isMounted) setLoadError(err?.message || "Failed to initialize Mappls map.");
      }
    };

    // 2. Load the official Mappls Web SDK script dynamically
    const scriptId = "mappls-web-sdk-script";
    const existingScript = document.getElementById(scriptId);

    if (window.mappls) {
      initializeMapplsMap();
    } else if (existingScript) {
      existingScript.addEventListener("load", initializeMapplsMap);
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://sdk.mappls.com/map/sdk/web?v=3.0&access_token=${staticKey}`;
      script.async = true;

      script.onload = () => {
        initializeMapplsMap();
      };

      script.onerror = () => {
        if (isMounted) {
          setLoadError(
            "Mappls Web SDK script could not be loaded. Please ensure 'Web Maps SDK' is enabled in your Mappls Developer Console."
          );
        }
      };

      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        try {
          if (typeof mapInstanceRef.current.remove === "function") {
            mapInstanceRef.current.remove();
          }
        } catch {
          // ignore cleanup errors
        }
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, staticKey]);

  return (
    <div className={`relative ${className}`}>
      {/* Target DOM Container with explicit sizing */}
      <div
        id="mappls-web-map-container"
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "100%" }}
      />

      {/* Loading Overlay */}
      {!isLoaded && !loadError && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold z-10">
          Loading Mappls Map...
        </div>
      )}

      {/* Helpful Error Notice */}
      {loadError && (
        <div className="absolute inset-0 bg-slate-950/90 text-white flex flex-col items-center justify-center p-6 text-center z-20">
          <p className="text-amber-400 font-bold mb-2">Mappls Activation Required</p>
          <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
            {loadError}
          </p>
          <a
            href="https://console.mappls.com/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all"
          >
            Open Mappls Console
          </a>
        </div>
      )}
    </div>
  );
}
