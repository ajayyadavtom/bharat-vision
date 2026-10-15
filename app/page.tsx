"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Leaf, 
  Ticket, 
  TrainFront, 
  CreditCard, 
  ShieldAlert, 
  Zap, 
  CloudRain, 
  Sun, 
  Cloud, 
  CloudLightning,
  User, 
  MapPin, 
  Medal, 
  Sparkles,
  Droplets,
  Wind,
  Crosshair,
  Compass
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useAppStore } from "@/lib/store";
import { getCityData, CITIES } from "@/lib/cityData";
import { fetchLiveWeatherAndAqi, RealtimeWeatherData } from "@/lib/weather";
import { requestBrowserLocation, reverseGeocodeCoordinates } from "@/lib/location";
import UpiGateway from "../components/UpiGateway";
import BehavioralHabitAI from "../components/BehavioralHabitAI";

export default function VisionHome() {
  const router = useRouter();
  const { 
    appLang, 
    userName, 
    walletBalance, 
    carbonSavedGrams, 
    karmaPoints, 
    currentCity, 
    setCurrentCity, 
    addMoney, 
    fetchUserData, 
    profilePictureUrl 
  } = useAppStore();

  const cityData = getCityData(currentCity);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Live Location & Weather / US AQI State
  const [liveWeather, setLiveWeather] = useState<RealtimeWeatherData | null>(null);
  const [showClimateModal, setShowClimateModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    coords: [number, number];
    name: string;
    city: string;
    isRealGps: boolean;
  } | null>(null);

  // Core Location & Weather Synchronizer
  const acquireLocation = async (manual: boolean = false) => {
    try {
      setIsLocating(true);
      const coords = await requestBrowserLocation();
      const geoInfo = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      
      const newLoc = {
        coords: [coords.latitude, coords.longitude] as [number, number],
        name: geoInfo.locality,
        city: geoInfo.city,
        isRealGps: true,
      };
      setUserLocation(newLoc);

      // Fetch live weather & AQI for the exact physical GPS coordinates
      const weatherRes = await fetchLiveWeatherAndAqi(coords.latitude, coords.longitude);
      setLiveWeather(weatherRes);
    } catch (err: unknown) {
      if (manual) {
        console.warn("Location permission error or timeout:", err);
      }
      // If GPS is blocked or denied, fall back to selected city coordinates
      const fallbackCoords = cityData.coordinates || [13.0150, 77.5900];
      const weatherRes = await fetchLiveWeatherAndAqi(fallbackCoords[0], fallbackCoords[1]);
      setLiveWeather(weatherRes);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    // Automatically prompt/request location the moment the user opens the app
    acquireLocation(false);
    fetchUserData();

    // Auto-refresh weather & AQI every 5 minutes
    const timer = setInterval(() => {
      const activeCoords = userLocation?.coords || cityData.coordinates || [13.0150, 77.5900];
      fetchLiveWeatherAndAqi(activeCoords[0], activeCoords[1]).then(setLiveWeather).catch(console.error);
    }, 5 * 60 * 1000);

    return () => clearInterval(timer);
  }, []);

  // Update weather if city dropdown changes and not on live GPS
  useEffect(() => {
    if (!userLocation?.isRealGps) {
      const coords = cityData.coordinates || [13.0150, 77.5900];
      fetchLiveWeatherAndAqi(coords[0], coords[1]).then(setLiveWeather).catch(console.error);
    }
  }, [cityData.id, userLocation?.isRealGps]);

  // Dynamic Weather Icon based on live conditions
  const renderWeatherIcon = () => {
    if (!liveWeather) return <Cloud size={16} className="text-slate-400" />;
    if (liveWeather.weatherCode >= 95) return <CloudLightning size={16} className="text-amber-400 animate-pulse" />;
    if (liveWeather.isRaining) return <CloudRain size={16} className="text-blue-400" />;
    if (liveWeather.weatherCode === 0) return <Sun size={16} className="text-amber-400" />;
    return <Cloud size={16} className="text-slate-500 dark:text-gray-400" />;
  };

  // Compute greeting dynamically
  const hour = new Date().getHours();
  
  const tHome = {
    en: {
      greeting: hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening",
      whereTo: "Where to?",
      searchP: "Search routes, stops...",
      quickActions: "Quick Actions",
      bookTickets: "Book Tickets",
      trackBus: "Track Bus",
      scanPass: "Scan Pass",
      metroMap: "Metro Map",
      myWallet: "My Wallet",
      addMoney: "Add Money",
      environmentalImpact: "Environmental Impact",
      co2Saved: "CO₂ Saved",
      karma: "Karma"
    },
    kn: {
      greeting: hour < 12 ? "ಶುಭೋದಯ" : hour < 18 ? "ಶುಭ ಮಧ್ಯಾಹ್ನ" : "ಶುಭ ಸಂಜೆ",
      whereTo: "ಎಲ್ಲಿಗೆ ಹೋಗಬೇಕು?",
      searchP: "ಮಾರ್ಗಗಳನ್ನು ಹುಡುಕಿ...",
      quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      bookTickets: "ಟಿಕೆಟ್ ಕಾಯ್ದಿರಿಸಿ",
      trackBus: "ಬಸ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      scanPass: "ಪಾಸ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ",
      metroMap: "ಮೆಟ್ರೋ ನಕ್ಷೆ",
      myWallet: "ನನ್ನ ವಾಲೆಟ್",
      addMoney: "ಹಣ ಸೇರಿಸಿ",
      environmentalImpact: "ಪರಿಸರ ಪ್ರಭಾವ",
      co2Saved: "CO₂ ಉಳಿತಾಯ",
      karma: "ಕರ್ಮ"
    },
    hi: {
      greeting: hour < 12 ? "सुप्रभात" : hour < 18 ? "शुभ दोपहर" : "शुभ संध्या",
      whereTo: "कहाँ जाना है?",
      searchP: "मार्ग खोजें...",
      quickActions: "त्वरित कार्य",
      bookTickets: "टिकट बुक करें",
      trackBus: "बस ट्रैक करें",
      scanPass: "पास स्कैन करें",
      metroMap: "मेट्रो मैप",
      myWallet: "मेरा वॉलेट",
      addMoney: "पैसे डालें",
      environmentalImpact: "पर्यावरणीय प्रभाव",
      co2Saved: "CO₂ बचत",
      karma: "कर्म"
    }
  };

  const handlePaymentSuccess = () => {
    addMoney(500);
    setIsPaymentOpen(false);
  };

  const dashboardVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <>
      <motion.div
        variants={dashboardVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col md:grid md:grid-cols-12 h-[100dvh] md:h-full overflow-y-auto no-scrollbar gap-6 p-4 pt-8 md:p-8 md:pt-6 pb-[120px] md:pb-8 relative z-10 [&>*]:shrink-0 md:max-w-7xl md:mx-auto md:w-full"
      >
        {/* User Greeting & Live Location Badge */}
        <motion.div variants={itemVariants} className="order-1 md:col-span-12 flex justify-between items-start md:pb-2 border-b border-transparent md:border-slate-200 md:dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <select 
                value={userLocation?.isRealGps ? "gps" : currentCity}
                onChange={(e) => {
                  if (e.target.value === "gps") {
                    acquireLocation(true);
                  } else {
                    setCurrentCity(e.target.value);
                    setUserLocation(null);
                  }
                }}
                className="text-[10px] uppercase tracking-widest text-slate-500 font-bold bg-transparent outline-none cursor-pointer"
              >
                {userLocation?.isRealGps && (
                  <option value="gps" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold">
                    📍 {userLocation.name} (Live GPS)
                  </option>
                )}
                {Object.values(CITIES).map(city => (
                  <option key={city.id} value={city.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {city.name} {city.state}
                  </option>
                ))}
              </select>

              {/* One-Click GPS Location Refresher */}
              <button
                type="button"
                onClick={() => acquireLocation(true)}
                disabled={isLocating}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-tight transition-all active:scale-95 border cursor-pointer ${
                  userLocation?.isRealGps
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-500"
                }`}
                title="Detect Exact Mobile Location"
              >
                <Crosshair size={10} className={isLocating ? "animate-spin text-emerald-500" : (userLocation?.isRealGps ? "text-emerald-500" : "")} />
                <span>{isLocating ? "Locating..." : (userLocation?.isRealGps ? "GPS Active" : "Detect Location")}</span>
              </button>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {tHome[appLang as keyof typeof tHome]?.greeting || tHome.en.greeting}, {userName ? (userName.toLowerCase() === "guest" ? "Jenny" : userName.split(" ")[0]) : "Jenny"}
            </h2>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Link href="/profile" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform hover:bg-slate-50 dark:hover:bg-slate-800 overflow-hidden">
              {profilePictureUrl ? (
                <img 
                  src={profilePictureUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <User size={18} className="text-slate-600 dark:text-slate-300" />
              )}
            </Link>
            <div className="flex flex-col gap-1 items-end">
              <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm cursor-default">
                <Leaf size={12} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{carbonSavedGrams || 0}g</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-800 shadow-sm cursor-default">
                <Medal size={12} className="text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">{karmaPoints || 0} pts</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Location Weather & US AQI Dashboard Card */}
        <motion.div 
          variants={itemVariants} 
          onClick={() => setShowClimateModal(!showClimateModal)}
          className="order-2 md:order-3 md:col-span-5 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-full border border-slate-200 dark:border-slate-700">
                {renderWeatherIcon()}
              </div>
              <div>
                <p className="text-slate-900 dark:text-white text-sm font-bold flex items-center gap-1.5">
                  {liveWeather ? `${liveWeather.temperature}°C` : "--°C"} · {
                    liveWeather ? (
                      appLang === 'kn' ? liveWeather.conditionTextKn :
                      appLang === 'hi' ? liveWeather.conditionTextHi :
                      liveWeather.conditionText
                    ) : "Loading weather..."
                  }
                </p>
                <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                  <MapPin size={10} className={userLocation?.isRealGps ? "text-emerald-500" : ""} /> 
                  {userLocation?.isRealGps ? `${userLocation.name}, ${userLocation.city}` : cityData.name} 
                  · Feels {liveWeather?.apparentTemperature ?? "--"}°C
                </p>
              </div>
            </div>

            {/* Real-Time US AQI Badge */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">US AQI</span>
                <span className={`text-xs font-black ${liveWeather?.aqiColor || "text-emerald-400"}`}>
                  {liveWeather?.aqi ?? "--"} ({liveWeather?.aqiCategory ?? "..."})
                </span>
              </div>
            </div>
          </div>

          {/* Commuter Climate Advisory Banner */}
          {liveWeather && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
              <span className="truncate pr-2 font-medium">
                💡 {
                  appLang === 'kn' ? liveWeather.commuterAlertKn :
                  appLang === 'hi' ? liveWeather.commuterAlertHi :
                  liveWeather.commuterAlert
                }
              </span>
              <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live
              </span>
            </div>
          )}

          {/* Detailed Real-Time Telemetry Drawer: Humidity, Wind, PM2.5, PM10 */}
          <AnimatePresence>
            {showClimateModal && liveWeather && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-2 text-center text-slate-700 dark:text-slate-200"
              >
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase flex items-center justify-center gap-0.5">
                    <Droplets size={10} className="text-blue-400" /> Humidity
                  </span>
                  <span className="text-xs font-black">{liveWeather.humidity}%</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase flex items-center justify-center gap-0.5">
                    <Wind size={10} className="text-teal-400" /> Wind
                  </span>
                  <span className="text-xs font-black">{liveWeather.windSpeed} km/h</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">PM2.5</span>
                  <span className="text-xs font-black">{liveWeather.pm25} µg</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">PM10</span>
                  <span className="text-xs font-black">{liveWeather.pm10} µg</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Where to? Navigation Search Bar */}
        <motion.div variants={itemVariants} className="order-3 md:order-2 md:col-span-7 relative group">
          <Link href="/route" className="block">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="w-full bg-white dark:bg-slate-900 text-slate-500 rounded-2xl py-4 pl-12 pr-4 border border-slate-200 dark:border-slate-800 group-hover:border-emerald-500 transition-all shadow-sm text-sm text-left">
              Where to? (e.g., Silk Board to Majestic)
            </div>
          </Link>
        </motion.div>

        {/* Bharat Wallet Balance Card */}
        <motion.div variants={itemVariants} className="order-4 md:order-5 md:col-span-5 bg-emerald-500 dark:bg-emerald-600 rounded-2xl p-5 shadow-lg border border-emerald-400 dark:border-emerald-500 relative overflow-hidden">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-emerald-50 text-xs font-semibold mb-1 flex items-center gap-1"><CreditCard size={12} /> BHARAT WALLET</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{(walletBalance || 0).toFixed(2)}</h3>
            </div>
            <button onClick={() => setIsPaymentOpen(true)} className="bg-white text-emerald-600 text-xs font-bold px-4 py-2 rounded-xl shadow-sm active:scale-95 transition-transform hover:bg-slate-50 cursor-pointer">
              Add Money
            </button>
          </div>
        </motion.div>

        {/* Rapid Transit Service Links */}
        <motion.div variants={itemVariants} className="order-5 md:order-4 md:col-span-7">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Rapid Transit</h3>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Link href="/pass" className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Ticket size={24} className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Smart Pass</span>
            </Link>

            <Link href="/ncmc" className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all shadow-sm">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <CreditCard size={24} className="text-indigo-500 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">NCMC Card</span>
            </Link>

            <Link href="/metro" className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all shadow-sm">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <TrainFront size={24} className="text-purple-500 dark:text-purple-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Namma Metro</span>
            </Link>

            <Link href="/auto" className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all shadow-sm">
              <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Search size={24} className="text-amber-500 dark:text-amber-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Auto/Cab</span>
            </Link>

            <Link href="/safety" className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-red-500 transition-all shadow-sm">
              <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <ShieldAlert size={24} className="text-red-500 dark:text-red-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">SafeKeep</span>
            </Link>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("bv-trigger-habit-ai"))}
              className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all shadow-sm cursor-pointer"
            >
              <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Sparkles size={24} className="text-teal-600 dark:text-teal-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Habit AI</span>
            </button>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isPaymentOpen && (
          <UpiGateway isOpen={isPaymentOpen} amount={500} onSuccess={handlePaymentSuccess} onCancel={() => setIsPaymentOpen(false)} />
        )}
      </AnimatePresence>

      <BehavioralHabitAI />
    </>
  );
}
