import dynamic from "next/dynamic";

const MapboxBusMap = dynamic(() => import("@/components/MapboxBusMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-2xl bg-slate-900 animate-pulse flex items-center justify-center text-slate-400 text-sm font-bold">
      Loading Live BMTC Mapbox Stream...
    </div>
  ),
});

export default function LiveTrackingPage() {
  return (
    <div className="w-full h-[600px] p-4">
      <MapboxBusMap 
        routeCode="500D" 
        pollIntervalMs={5000} 
      />
    </div>
  );
}