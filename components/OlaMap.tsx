"use client";

import React, { useEffect, useRef, useState } from "react";

interface OlaMapProps {
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
    OlaMaps?: any;
    olaMapsInstance?: any;
  }
}

export default function OlaMap({
  center = [12.9716, 77.5946], // Bengaluru center by default
  zoom = 13,
  markers = [],
  className = "w-full h-full min-h-[400px]"
}: OlaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_OLA_MAPS_KEY || "dBjo8v0MKCLjAFV7Sq4Gczna";

  useEffect(() => {
    let isMounted = true;
    const containerId = "ola-web-map-container";

    const initializeOlaMap = () => {
      if (!window.OlaMaps || !containerRef.current || mapInstanceRef.current) return;

      try {
        const olaMaps = new window.OlaMaps({
          apiKey: apiKey,
        });

        const map = olaMaps.init({
          style: "https://api.olamaps.io/tiles/vector/v1/styles/default-dark-standard/style.json",
          container: containerId,
          center: [center[1], center[0]], // Ola Maps expects [lng, lat]
          zoom: zoom,
        });

        mapInstanceRef.current = map;

        map.on("load", () => {
          if (!isMounted) return;
          setIsLoaded(true);

          markers.forEach((m) => {
            if (olaMaps.addMarker) {
              olaMaps
                .addMarker({
                  offset: [0, -15],
                  anchor: "bottom",
                  color: "#10b981",
                })
                .setLngLat([m.lng, m.lat])
                .addTo(map);
            }
          });
        });

        map.on("error", (err: any) => {
          console.warn("Ola Maps error:", err);
          if (isMounted) {
            setLoadError(err?.message || "Failed to load Ola Maps style.");
          }
        });
      } catch (err: any) {
        console.error("Ola Maps initialization error:", err);
        if (isMounted) {
          setLoadError(err?.message || "Failed to initialize Ola Maps.");
        }
      }
    };

    const scriptId = "olamaps-web-sdk-script";
    const existingScript = document.getElementById(scriptId);

    if (window.OlaMaps) {
      initializeOlaMap();
    } else if (existingScript) {
      existingScript.addEventListener("load", initializeOlaMap);
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/olamaps-web-sdk@latest/dist/olamaps-web-sdk.umd.js";
      script.async = true;

      script.onload = () => {
        initializeOlaMap();
      };

      script.onerror = () => {
        if (isMounted) {
          setLoadError("Ola Maps SDK script could not be loaded.");
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
  }, [center, zoom, apiKey]);

  return (
    <div className={`relative ${className}`}>
      <div
        id="ola-web-map-container"
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: "100%" }}
      />

      {!isLoaded && !loadError && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold z-10">
          Loading Ola Maps...
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 bg-slate-950/90 text-white flex flex-col items-center justify-center p-6 text-center z-20">
          <p className="text-emerald-400 font-bold mb-2">Ola Maps</p>
          <p className="text-xs text-slate-300 max-w-sm mb-4 leading-relaxed">
            {loadError}
          </p>
          <a
            href="https://maps.olakrutrim.com/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all"
          >
            Open Ola Maps Console
          </a>
        </div>
      )}
    </div>
  );
}
