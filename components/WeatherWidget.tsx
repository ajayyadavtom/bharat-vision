import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Umbrella, CloudRain, MapPin, Thermometer } from "lucide-react";

export default function WeatherWidget({ isRainSafe, setIsRainSafe, locationName = "Bengaluru" }: { isRainSafe: boolean, setIsRainSafe: (val: boolean) => void, locationName?: string }) {
  // Generate random rain drops
  const drops = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1,
    duration: 0.5 + Math.random() * 0.7
  }));

  const [aqi, setAqi] = useState<number | null>(null);
  const [aqiColor, setAqiColor] = useState("text-emerald-400");

  useEffect(() => {
    // Fetch Real AQI for Bengaluru without needing an API key (using Open-Meteo)
    fetch("https://air-quality-api.open-meteo.com/v1/air-quality?latitude=12.9716&longitude=77.5946&current=us_aqi")
      .then(res => res.json())
      .then(data => {
        if (data && data.current && data.current.us_aqi) {
          const val = data.current.us_aqi;
          setAqi(val);
          if (val <= 50) setAqiColor("text-emerald-400");
          else if (val <= 100) setAqiColor("text-yellow-400");
          else if (val <= 150) setAqiColor("text-orange-400");
          else setAqiColor("text-red-500");
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 rounded-3xl p-5 shadow-lg border border-slate-700 mt-3 text-white">
      {/* Animated Rain Drops */}
      <div className="absolute inset-0 pointer-events-none opacity-50">
        {drops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ y: -20, x: `${drop.x}%`, opacity: 0 }}
            animate={{ y: 250, opacity: [0, 1, 0] }}
            transition={{
              duration: drop.duration,
              repeat: Infinity,
              delay: drop.delay,
              ease: "linear"
            }}
            className="absolute w-0.5 h-8 bg-blue-400 rounded-full"
          />
        ))}
      </div>

      <div className="relative z-10 flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-blue-300 mb-1">
            <MapPin size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{locationName}</span>
          </div>
          <h3 className="text-2xl font-black flex items-center gap-2">
            22°C <CloudRain size={24} className="text-blue-400" />
          </h3>
          <p className="text-xs text-blue-200 mt-1 font-semibold">Heavy Monsoon Rain</p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10 text-center">
          <p className="text-[10px] uppercase text-blue-200 font-bold mb-1">AQI</p>
          <p className={`text-sm font-black ${aqiColor}`}>
            {aqi !== null ? aqi : "--"}
          </p>
        </div>
      </div>

      {/* Embedded Rain-Safe Toggle */}
      <div 
        onClick={() => setIsRainSafe(!isRainSafe)}
        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
          isRainSafe ? 'bg-blue-500/30 border-blue-400/50' : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl transition-colors ${isRainSafe ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-700/50 text-slate-400'}`}>
            <Umbrella size={18} />
          </div>
          <div>
            <span className="text-sm font-bold text-white block">Rain-Safe Routing</span>
            <span className="text-[10px] text-blue-200/70">Prioritize Metro underpasses</span>
          </div>
        </div>
        <div className={`w-12 h-6 rounded-full transition-colors relative p-1 flex items-center ${isRainSafe ? 'bg-blue-400' : 'bg-slate-700'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${isRainSafe ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </div>
      </div>
    </div>
  );
}
