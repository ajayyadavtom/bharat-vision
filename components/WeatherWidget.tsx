import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Umbrella, CloudRain, Sun, Cloud, CloudLightning, Wind, Droplets, MapPin, RefreshCw, Activity } from "lucide-react";
import { fetchLiveWeatherAndAqi, RealtimeWeatherData } from "@/lib/weather";
import { CITIES } from "@/lib/cityData";
import { useAppStore } from "@/lib/store";

interface WeatherWidgetProps {
  isRainSafe: boolean;
  setIsRainSafe: (val: boolean) => void;
  locationName?: string;
  coordinates?: [number, number];
}

export default function WeatherWidget({
  isRainSafe,
  setIsRainSafe,
  locationName = "Bengaluru",
  coordinates,
}: WeatherWidgetProps) {
  const { userLocation } = useAppStore();
  const [data, setData] = useState<RealtimeWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [drops, setDrops] = useState<any[]>([]);

  // Resolve coordinates: provided coordinates -> user live GPS -> city coordinates -> fallback
  const resolvedCoords: [number, number] = coordinates || userLocation?.coords || (() => {
    const cityKey = locationName.toLowerCase();
    const city = Object.values(CITIES).find(c => c.name.toLowerCase() === cityKey || c.id === cityKey);
    return city ? city.coordinates : [12.9716, 77.5946];
  })();

  const displayLocation = userLocation?.isRealGps && !coordinates ? `${userLocation.name}, ${userLocation.city}` : locationName;

  const loadWeather = async () => {
    try {
      setLoading(true);
      const res = await fetchLiveWeatherAndAqi(resolvedCoords[0], resolvedCoords[1]);
      setData(res);
      // If live precipitation is active, automatically recommend Rain-Safe routing
      if (res.isRaining && !isRainSafe) {
        setIsRainSafe(true);
      }
    } catch (err) {
      console.error("Failed to load live weather:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
    // Poll every 5 minutes for live update
    const interval = setInterval(loadWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [resolvedCoords[0], resolvedCoords[1]]);

  useEffect(() => {
    if (data?.isRaining) {
      setDrops(
        Array.from({ length: 30 }).map((_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 1,
          duration: 0.5 + Math.random() * 0.7,
        }))
      );
    } else {
      setDrops([]);
    }
  }, [data?.isRaining]);

  const renderConditionIcon = () => {
    if (!data) return <Cloud size={24} className="text-slate-400" />;
    if (data.weatherCode >= 95) return <CloudLightning size={24} className="text-amber-400 animate-pulse" />;
    if (data.isRaining) return <CloudRain size={24} className="text-blue-400" />;
    if (data.weatherCode === 0) return <Sun size={24} className="text-amber-400" />;
    return <Cloud size={24} className="text-slate-300" />;
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-3xl p-5 shadow-xl border border-slate-700/80 mt-3 text-white">
      {/* Animated Rain Drops (Only active when it's genuinely raining) */}
      {data?.isRaining && (
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {drops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ y: -20, x: `${drop.x}%`, opacity: 0 }}
              animate={{ y: 260, opacity: [0, 1, 0] }}
              transition={{
                duration: drop.duration,
                repeat: Infinity,
                delay: drop.delay,
                ease: "linear",
              }}
              className="absolute w-0.5 h-8 bg-blue-400 rounded-full"
            />
          ))}
        </div>
      )}

      {/* Sun glow when clear */}
      {!data?.isRaining && data?.weatherCode === 0 && (
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Header Info */}
      <div className="relative z-10 flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-1.5 text-blue-300 mb-1">
            <MapPin size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{displayLocation}</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </span>
          </div>

          <h3 className="text-2xl font-black flex items-center gap-2">
            {data ? `${data.temperature}°C` : "--°C"} {renderConditionIcon()}
          </h3>

          <p className="text-xs text-blue-200 mt-1 font-semibold flex items-center gap-1">
            {data ? data.conditionText : "Loading climate telemetry..."}
            {data && <span className="text-[10px] text-slate-400 font-normal">· Feels {data.apparentTemperature}°C</span>}
          </p>
        </div>

        {/* Live AQI Badge */}
        <div 
          onClick={() => setShowDetails(!showDetails)}
          className="bg-white/10 hover:bg-white/15 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 text-center cursor-pointer transition-all active:scale-95 shadow-sm"
        >
          <div className="flex items-center justify-center gap-1">
            <Activity size={10} className="text-blue-300" />
            <p className="text-[9px] uppercase text-blue-200 font-bold">US AQI</p>
          </div>
          <p className={`text-base font-black ${data ? data.aqiColor : "text-white"}`}>
            {data ? data.aqi : "--"}
          </p>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tight block">
            {data ? data.aqiCategory : "..."}
          </span>
        </div>
      </div>

      {/* Real-time Atmospheric Telemetry Bar */}
      {data && (
        <div className="relative z-10 grid grid-cols-3 gap-2 bg-black/30 backdrop-blur-sm rounded-2xl p-2.5 border border-white/5 mb-3 text-center">
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase">
              <Droplets size={10} className="text-blue-400" /> Humidity
            </span>
            <span className="text-xs font-black text-slate-200">{data.humidity}%</span>
          </div>
          <div className="flex flex-col items-center border-x border-white/10">
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1 uppercase">
              <Wind size={10} className="text-teal-400" /> Wind
            </span>
            <span className="text-xs font-black text-slate-200">{data.windSpeed} km/h</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-slate-400 font-bold uppercase">PM2.5</span>
            <span className="text-xs font-black text-slate-200">{data.pm25} µg/m³</span>
          </div>
        </div>
      )}

      {/* Expanded Air Quality Telemetry Details */}
      <AnimatePresence>
        {showDetails && data && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3 bg-white/5 rounded-2xl p-3 border border-white/10 text-xs"
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-slate-300 text-[11px]">Real-Time Air Quality Breakdown</span>
              <span className="text-[9px] text-slate-400 font-mono">Synced: {data.updatedAt}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="bg-black/20 p-2 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold">PM10 Coarse Dust</p>
                <p className="text-sm font-black text-white">{data.pm10} <span className="text-[9px] font-normal text-slate-400">µg/m³</span></p>
              </div>
              <div className="bg-black/20 p-2 rounded-xl">
                <p className="text-[10px] text-slate-400 font-bold">Precipitation</p>
                <p className="text-sm font-black text-white">{data.precipitation} <span className="text-[9px] font-normal text-slate-400">mm/h</span></p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commuter Climate Advisory */}
      {data && (
        <div className="relative z-10 bg-blue-500/10 border border-blue-400/20 rounded-2xl p-2.5 mb-3 flex items-center justify-between">
          <p className="text-[11px] text-blue-200 font-medium leading-tight">
            💡 {data.commuterAlert}
          </p>
          <button
            onClick={loadWeather}
            disabled={loading}
            className="text-slate-400 hover:text-white p-1 transition-colors"
            title="Refresh weather"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      )}

      {/* Embedded Rain-Safe Toggle */}
      <div
        onClick={() => setIsRainSafe(!isRainSafe)}
        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
          isRainSafe ? "bg-blue-500/30 border-blue-400/50" : "bg-white/5 border-white/10 hover:bg-white/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl transition-colors ${
              isRainSafe
                ? "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "bg-slate-700/50 text-slate-400"
            }`}
          >
            <Umbrella size={18} />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Rain-Safe Routing</span>
            <span className="text-[10px] text-blue-200/70">
              {data?.isRaining ? "Heavy rain active — prioritizing covered metro" : "Prioritize Metro underpasses & skywalks"}
            </span>
          </div>
        </div>
        <div
          className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center ${
            isRainSafe ? "bg-blue-400" : "bg-slate-700"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
              isRainSafe ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
