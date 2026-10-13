"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Dynamic import with ssr: false prevents "window is not defined" crashes
const Map = dynamic(() => import("../../components/Map"), { ssr: false });

export default function MapPage() {
  return (
    <div className="relative w-full h-[100dvh] bg-[#09090b] overflow-hidden flex flex-col">
      {/* Floating Back Button */}
      <div className="absolute top-4 left-4 z-[500]">
        <Link
          href="/"
          className="w-10 h-10 bg-slate-900/90 hover:bg-slate-800 text-white rounded-full flex items-center justify-center border border-slate-700 shadow-2xl transition-transform active:scale-95 cursor-pointer backdrop-blur-md"
          title="Back to Home"
        >
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Full-Screen Interactive Leaflet + OSM + OSRM Map */}
      <div className="flex-1 w-full h-full">
        <Map />
      </div>
    </div>
  );
}
