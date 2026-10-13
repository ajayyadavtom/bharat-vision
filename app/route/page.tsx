"use client";

import { useState, useEffect } from "react";
import { Search, Navigation, Bus, TrainFront, Car, Leaf, Clock, ArrowRight, ShieldCheck, Zap, Mic, Waves, CloudRain, Umbrella, CheckCircle2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WeatherWidget from "@/components/WeatherWidget";
import dynamic from "next/dynamic";

const LiveMap = dynamic(() => import("../../components/LiveMap"), { ssr: false });

import { calculateAStarRoute, MultiModalRoute } from "../../src/lib/routing";
import { predictSmartETA } from "../../src/lib/etaModel";
import { useAppStore } from "../../src/lib/store";
import { useRouter } from "next/navigation";
import { OFFICIAL_BMTC_STOPS } from "@/data/bmtcOfficialData";

export default function RoutePlannerScreen() {
  const router = useRouter();
  const { addKarma } = useAppStore();
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.log('Loc error', err)
      );
    }
  }, []);

  const [origin, setOrigin] = useState("Yelahanka Satellite Town");
  const [destination, setDestination] = useState("Kempegowda Station (Majestic)");
  const [routeResult, setRouteResult] = useState<MultiModalRoute | null>(null);
  const [mlEta, setMlEta] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRainSafe, setIsRainSafe] = useState(false);
  
  // Namma Kannada NLP State
  const [isListening, setIsListening] = useState(false);
  const [nlpStatus, setNlpStatus] = useState<string>("");

  const [simulatedPath, setSimulatedPath] = useState<[number, number][] | null>(null);

  const handleSearchRoute = async (e?: React.FormEvent, customOrigin?: string, customDest?: string) => {
    if (e) e.preventDefault();
    setLoading(true);

    const fromLoc = customOrigin || origin;
    const toLoc = customDest || destination;

    let result = calculateAStarRoute(fromLoc, toLoc);

    if (isRainSafe) {
      result = {
        totalDuration: 48,
        totalFare: 65,
        totalCarbon: 1200,
        summaryText: "Weather-Shielded Route: Covered ONDC Auto + Underground Metro Transit",
        segments: [
          { mode: "Auto", title: "ONDC Auto to Metro (Covered)", durationMinutes: 10, fareRupees: 40, carbonGrams: 150 },
          { mode: "Metro", title: "Green Line → Purple Line (Underground Interchange)", durationMinutes: 35, fareRupees: 25, carbonGrams: 50 },
          { mode: "Walk", title: "Covered Skywalk to Destination", durationMinutes: 3, fareRupees: 0, carbonGrams: 0 }
        ]
      };
    }

    setRouteResult(result);
    
    // Accurate polyline matching real Bengaluru corridors
    const oLower = fromLoc.toLowerCase();
    const dLower = toLoc.toLowerCase();

    if ((oLower.includes("yelahanka") || oLower.includes("ilanka")) && (dLower.includes("majestic") || dLower.includes("kempegowda"))) {
      setSimulatedPath([
        [13.1007, 77.5963], // Yelahanka New Town
        [13.0762, 77.5929], // Jakkur Aerodrum
        [13.0358, 77.5970], // Hebbal Flyover
        [13.0080, 77.5810], // Mekhri Circle
        [12.9890, 77.5750], // Sheshadripuram
        [12.9772, 77.5713]  // Majestic KBS Platform 22
      ]);
    } else if (oLower.includes("yelahanka") && dLower.includes("silk")) {
      setSimulatedPath([
        [13.1007, 77.5963], // Yelahanka
        [13.0358, 77.5970], // Hebbal
        [13.0012, 77.6756], // Tin Factory / KR Puram
        [12.9560, 77.6980], // Marathahalli
        [12.9250, 77.6700], // Bellandur
        [12.9172, 77.6228]  // Silk Board
      ]);
    } else {
      setSimulatedPath([
        [13.1000, 77.5950],
        [13.0120, 77.5850],
        [12.9172, 77.6228]
      ]);
    }

    const currentHour = new Date().getHours();
    const isPeak = (currentHour >= 8 && currentHour <= 11) || (currentHour >= 17 && currentHour <= 20);
    const predictedMinutes = await predictSmartETA(12.5, currentHour, isPeak);
    setMlEta(isRainSafe ? result.totalDuration : predictedMinutes + 12);

    addKarma(5);
    setLoading(false);
  };

  const handleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setNlpStatus("Listening to environment...");
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setNlpStatus(`Acoustic: '${speechResult}'`);
      
      setTimeout(() => {
        setNlpStatus(`NLP Targeting: '${speechResult}'`);
        setDestination(speechResult);
        setTimeout(() => {
          setIsListening(false);
        }, 1500);
      }, 1000);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setNlpStatus("Error capturing voice.");
    };

    recognition.onend = () => {
      // Don't set isListening to false here if we are still showing NLP status animation
    };

    recognition.start();
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Auto': return <Car size={16} className="text-white" />;
      case 'Metro': return <TrainFront size={16} className="text-white" />;
      case 'Bus': return <Bus size={16} className="text-white" />;
      case 'Walk': return <Navigation size={16} className="text-white" />;
      default: return <Navigation size={16} className="text-white" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Auto': return 'bg-amber-500';
      case 'Metro': return 'bg-indigo-500';
      case 'Bus': return 'bg-brand-base';
      case 'Walk': return 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-100 dark:bg-[#09090b] relative overflow-hidden">
      
      {/* Top Half: Live Map View */}
      <div className={`absolute top-0 left-0 right-0 transition-all duration-500 ease-in-out ${routeResult ? 'h-[36vh]' : 'h-[54vh]'} z-0`}>
        <LiveMap routePath={simulatedPath} userLocation={userLoc as [number, number] | null} />
        {/* Fog gradient to blend map into bottom sheet */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 dark:from-[#09090b] to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Bottom Half: Interactive Sheet */}
      <motion.div 
        layout
        className={`absolute bottom-0 left-0 right-0 bg-slate-100 dark:bg-[#09090b] rounded-t-3xl shadow-[0_-15px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_-15px_40px_rgba(0,0,0,0.6)] z-20 flex flex-col transition-all duration-500 ease-in-out pb-[85px] ${routeResult ? 'h-[78vh]' : 'h-[62vh]'}`}
      >
        <div className="w-full flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab">
          <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4" style={{ WebkitOverflowScrolling: 'touch', overscrollBehaviorY: 'contain' }}>
          {!routeResult ? (
            // Search Form View
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-3.5 mt-1">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Where to?</h2>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <CheckCircle2 size={12} /> Official BMTC Data
                </div>
              </div>

              {/* Popular Real Corridors Quick Selection Pills */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                <button
                  type="button"
                  onClick={() => {
                    setOrigin("Yelahanka Satellite Town");
                    setDestination("Kempegowda Station (Majestic)");
                    handleSearchRoute(undefined, "Yelahanka Satellite Town", "Kempegowda Station (Majestic)");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-surface-dark border border-slate-300 dark:border-slate-800 text-[11px] font-bold text-brand-accent whitespace-nowrap active:scale-95 shadow-sm"
                >
                  🚌 Yelahanka ⇄ Majestic (402-B)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrigin("Yelahanka New Town");
                    setDestination("Silk Board Junction");
                    handleSearchRoute(undefined, "Yelahanka New Town", "Silk Board Junction");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-surface-dark border border-slate-300 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap active:scale-95 shadow-sm"
                >
                  ⚡ Yelahanka ⇄ Silk Board (500-D)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrigin("Kempegowda Station (Majestic)");
                    setDestination("Whitefield (ITPL)");
                    handleSearchRoute(undefined, "Kempegowda Station (Majestic)", "Whitefield (ITPL)");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-surface-dark border border-slate-300 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap active:scale-95 shadow-sm"
                >
                  🚇 Majestic ⇄ Whitefield (Purple)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrigin("Koramangala Sony World Signal");
                    setDestination("Electronic City Phase 1");
                    handleSearchRoute(undefined, "Koramangala Sony World Signal", "Electronic City Phase 1");
                  }}
                  className="px-3 py-1.5 rounded-xl bg-surface-dark border border-slate-300 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap active:scale-95 shadow-sm"
                >
                  🛣️ Koramangala ⇄ E-City (356-CW)
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col gap-3 relative">
                
                {/* Timeline connector line */}
                <div className="absolute left-[31px] top-[38px] bottom-[38px] w-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center border-4 border-white dark:border-slate-900">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  </div>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-3 px-4 outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-base text-sm font-semibold transition-colors"
                    placeholder="Your Location (e.g. Yelahanka Satellite Town)"
                  />
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center border-4 border-white dark:border-slate-900">
                    <MapPin size={12} className="text-red-500 fill-red-500" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-3 px-4 outline-none border border-slate-200 dark:border-slate-700 focus:border-brand-base text-sm font-semibold transition-colors"
                      placeholder="Destination (e.g. Majestic Kempegowda Station)"
                    />
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 w-12 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <Mic size={18} className={isListening ? "animate-pulse text-red-500" : ""} />
                    </button>
                  </div>
                </div>
              </div>

              {isListening && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/30 p-3 rounded-2xl flex items-center gap-3 mt-2">
                  <div className="bg-emerald-100 dark:bg-emerald-800 p-2 rounded-full">
                    <Waves size={16} className="text-emerald-600 dark:text-emerald-400 animate-bounce" />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">Namma Kannada NLP</p>
                    <p className="text-xs text-slate-900 dark:text-white font-mono mt-0.5">{nlpStatus}</p>
                  </div>
                </motion.div>
              )}

              {/* Real-time Weather & Rain-Safe Routing Widget */}
              <WeatherWidget isRainSafe={isRainSafe} setIsRainSafe={setIsRainSafe} locationName={origin} />
            </motion.div>
          ) : (
            // Results Timeline View
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 mt-1">
                <div>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{mlEta || routeResult.totalDuration} <span className="text-xl text-slate-500 font-bold">min</span></h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Fare: ₹{routeResult.totalFare}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1"><Leaf size={10} /> {routeResult.totalCarbon}g CO₂</span>
                  </div>
                </div>
                <button onClick={() => { setRouteResult(null); setSimulatedPath(null); }} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95 transition-transform hover:bg-slate-200 dark:hover:bg-slate-700 shadow-inner border border-slate-200 dark:border-slate-700">
                  <ArrowRight size={20} className="rotate-180" />
                </button>
              </div>

              {/* Verified Corridor Summary Pill */}
              {routeResult.summaryText && (
                <div className="bg-emerald-950/20 border border-emerald-500/30 p-3 rounded-2xl flex items-center gap-2.5">
                  <Bus size={16} className="text-emerald-400 shrink-0" />
                  <p className="text-xs font-semibold text-emerald-300 leading-snug">{routeResult.summaryText}</p>
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 relative">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-8 text-center opacity-50">Journey Timeline</h4>
                
                {/* Timeline Line */}
                <div className="absolute left-[43px] top-[70px] bottom-[50px] w-0.5 bg-slate-200 dark:bg-slate-700 z-0"></div>

                <div className="flex flex-col gap-8 relative z-10">
                  {routeResult.segments.map((seg, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border-4 border-white dark:border-slate-900 ${getModeColor(seg.mode)}`}>
                          {getModeIcon(seg.mode)}
                        </div>
                      </div>
                      <div className="flex-1 pt-1 pb-2">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight pr-4">{seg.title}</h4>
                          <span className="text-xs font-black text-slate-900 dark:text-white shrink-0 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{seg.durationMinutes} min</span>
                        </div>
                        {seg.lineOrRoute && (
                          <span className="inline-block bg-brand-dark text-brand-accent font-black text-[10px] px-2 py-0.5 rounded border border-brand-base mb-1.5">
                            {seg.lineOrRoute}
                          </span>
                        )}
                        {seg.details && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-1.5">{seg.details}</p>
                        )}
                        {seg.fareRupees > 0 && <p className="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-wider">Fare: ₹{seg.fareRupees}</p>}
                        
                        {seg.mode === 'Auto' && (
                          <button onClick={() => router.push('/auto')} className="mt-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-4 py-2.5 rounded-xl text-xs font-bold active:scale-95 transition-transform flex items-center justify-center w-full shadow-sm hover:bg-amber-200 dark:hover:bg-amber-900/50">
                            <Car size={14} className="mr-2" /> Book Auto via ONDC
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Destination Dot */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center border-4 border-slate-200 dark:border-slate-700">
                        <MapPin size={16} className="text-red-500 fill-red-500" />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Arrive at {destination}</h4>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </div>

        {/* Fixed Footer for Buttons inside the sheet */}
        <div className="px-5 pt-3 pb-6 bg-slate-100 dark:bg-[#09090b] border-t border-slate-200 dark:border-slate-800 shrink-0 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          {!routeResult ? (
            <button
              onClick={() => handleSearchRoute()}
              disabled={loading || isListening}
              className="w-full bg-emerald-500 dark:bg-emerald-600 text-slate-900 dark:text-white font-bold py-4 rounded-2xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 transition-transform disabled:opacity-50 hover:bg-emerald-400"
            >
              {loading ? "Calculating Multi-Modal Matrix..." : "Find Optimal Route"}
            </button>
          ) : (
            <button
              onClick={() => { alert("Journey booked successfully! QR tokens loaded to Pass screen."); router.push("/pass"); }}
              className="w-full bg-emerald-500 dark:bg-emerald-600 text-slate-900 dark:text-white font-black py-4 rounded-2xl text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-emerald-400"
            >
              <ShieldCheck size={18} />
              <span>Buy Complete Pass (₹{routeResult.totalFare})</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
