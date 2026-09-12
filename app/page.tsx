"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Leaf, Ticket, TrainFront, CreditCard, ShieldAlert, Zap, CloudRain, Sun, Cloud, User, MapPin } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useAppStore } from "@/lib/store";
import { getCityData, CITIES } from "@/lib/cityData";
import UpiGateway from "../components/UpiGateway";
import BehavioralHabitAI from "../components/BehavioralHabitAI";

export default function VisionHome() {
  const router = useRouter();
  const { userName, walletBalance, carbonSavedGrams, addMoney, fetchUserData, currentCity, setCurrentCity } = useAppStore();
  const cityData = getCityData(currentCity);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Compute greeting dynamically
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const weather = {
    temperature: 22,
    condition: "Rain",
    location: cityData.name,
    commuterAlert: "Light drizzle expected. Carry an umbrella."
  };

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const renderWeatherIcon = () => {
    if (weather.condition === "Rain") return <CloudRain size={16} className="text-blue-400" />;
    if (weather.condition === "Clear") return <Sun size={16} className="text-amber-400" />;
    return <Cloud size={16} className="text-slate-500 dark:text-gray-400" />;
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
        className="flex flex-col h-screen overflow-y-auto no-scrollbar gap-6 p-4 pt-8 pb-[120px] relative z-10 [&>*]:shrink-0"
      >
        <motion.div variants={itemVariants} className="flex justify-between items-start">
          <div>
            <select 
              value={currentCity}
              onChange={(e) => setCurrentCity(e.target.value)}
              className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1 bg-transparent outline-none cursor-pointer"
            >
              {Object.values(CITIES).map(city => (
                <option key={city.id} value={city.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{city.name} {city.state}</option>
              ))}
            </select>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {greeting}, {userName ? userName.split(" ")[0] : "Ajay"}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link href="/profile" className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform hover:bg-slate-50 dark:hover:bg-slate-800">
              <User size={18} className="text-slate-600 dark:text-slate-300" />
            </Link>
            <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800 shadow-sm cursor-default">
              <Leaf size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{carbonSavedGrams || 0} g saved</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full border border-slate-200 dark:border-slate-700">{renderWeatherIcon()}</div>
            <div>
              <p className="text-slate-900 dark:text-white text-sm font-bold">{weather.temperature}°C · {weather.condition}</p>
              <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><MapPin size={10} /> {weather.location}</p>
            </div>
          </div>
          {weather.commuterAlert && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 px-3 py-1.5 rounded-lg max-w-[140px] text-right relative overflow-hidden">
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-blue-500/10" />
              <p className="text-[9px] text-blue-700 dark:text-blue-300 font-bold leading-tight relative z-10">{weather.commuterAlert}</p>
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="relative group">
          <Link href="/route" className="block">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <div className="w-full bg-white dark:bg-slate-900 text-slate-500 rounded-2xl py-4 pl-12 pr-4 border border-slate-200 dark:border-slate-800 group-hover:border-emerald-500 transition-all shadow-sm text-sm text-left">
              Where to? (e.g., Silk Board to Majestic)
            </div>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-emerald-500 dark:bg-emerald-600 rounded-2xl p-5 shadow-lg border border-emerald-400 dark:border-emerald-500 relative overflow-hidden">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-6 -top-6 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-emerald-50 text-xs font-semibold mb-1 flex items-center gap-1"><CreditCard size={12} /> BHARAT WALLET</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₹{(walletBalance || 0).toFixed(2)}</h3>
            </div>
            <button onClick={() => setIsPaymentOpen(true)} className="bg-white text-emerald-600 text-xs font-bold px-4 py-2 rounded-xl shadow-sm active:scale-95 transition-transform hover:bg-slate-50">
              Add Money
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Rapid Transit</h3>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/pass" className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all shadow-sm">
              <div className="bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <Ticket size={24} className="text-emerald-500 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Smart Pass</span>
            </Link>

            <Link href="/metro" className="group flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all shadow-sm">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                <TrainFront size={24} className="text-indigo-500 dark:text-indigo-400" />
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
