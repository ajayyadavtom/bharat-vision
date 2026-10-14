"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft, Radio, Sparkles } from "lucide-react";
import Link from "next/link";

const MapboxBusMap = dynamic(() => import("@/components/MapboxBusMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] rounded-2xl bg-slate-900 animate-pulse flex flex-col items-center justify-center gap-3 text-slate-400 p-6">
      <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-spin">
        ⏳
      </div>
      <p className="text-sm font-bold text-slate-200">Initializing Mapbox GL JS Live Stream...</p>
      <p className="text-xs text-slate-500">Connecting to BMTC GPS Telemetry</p>
    </div>
  ),
});

const POPULAR_ROUTES = [
  { code: "500D", label: "500D ORR Express" },
  { code: "335E", label: "335E Whitefield" },
  { code: "250", label: "250 Yelahanka" },
  { code: "401K", label: "401K Kengeri" },
  { code: "365", label: "365 Electronic City" },
];

export default function LiveTrackingPage() {
  const [selectedRoute, setSelectedRoute] = useState("500D");

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 dark:bg-slate-950 pb-18 overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-4 pt-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3 z-20 shadow-sm shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-xs"
              aria-label="Back to home"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  BMTC Live Radar
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <Radio size={9} className="animate-pulse" /> Live 5s
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Zomato-style smooth gliding bus telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Route Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {POPULAR_ROUTES.map((route) => {
            const isActive = selectedRoute === route.code;
            return (
              <button
                key={route.code}
                onClick={() => setSelectedRoute(route.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-600/30 scale-100"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500/50"
                }`}
              >
                {route.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Mapbox Viewport */}
      <div className="flex-1 w-full p-2 relative overflow-hidden">
        <MapboxBusMap
          key={selectedRoute}
          routeCode={selectedRoute}
          pollIntervalMs={5000}
          className="w-full h-full rounded-2xl"
        />
      </div>
    </div>
  );
}