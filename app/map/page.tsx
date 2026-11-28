"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Dynamically import GoogleNavSystem with ssr: false to prevent Leaflet window errors
const GoogleNavSystem = dynamic(() => import("../../components/GoogleNavSystem"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#09090b] text-white">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading Navigation System...</p>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="relative w-full h-[100dvh] bg-[#09090b] overflow-hidden flex flex-col">
      {/* Full-Screen Interactive Google Map Navigation System */}
      <div className="flex-1 w-full h-full">
        <GoogleNavSystem />
      </div>
    </div>
  );
}
