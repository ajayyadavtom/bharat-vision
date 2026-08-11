"use client"; 

import { useState, useEffect } from "react";
import { Search, Leaf, Ticket, TrainFront, CreditCard, ShieldAlert, Zap, CloudRain, Sun, Cloud, User } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../src/lib/store"; 
import { getBengaluruWeather } from "../src/lib/weatherEngine";
import UpiGateway from "../components/UpiGateway";

export default function VisionHome() {
  const { userName, walletBalance, carbonSavedGrams, addMoney, fetchUserData } = useAppStore();
  const [showSplash, setShowSplash] = useState(true);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  const weather = getBengaluruWeather();

  useEffect(() => {
    fetchUserData();
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, [fetchUserData]);

  const renderWeatherIcon = () => {
    if (weather.condition === "Rain") return <CloudRain size={16} className="text-blue-400" />;
    if (weather.condition === "Clear") return <Sun size={16} className="text-amber-400" />;
    return <Cloud size={16} className="text-gray-400" />;
  };

  const handlePaymentSuccess = () => {
    addMoney(500);
    setIsPaymentOpen(false);
  };

  return (
    <>
      <UpiGateway 
        isOpen={isPaymentOpen} 
        amount={500} 
        onSuccess={handlePaymentSuccess} 
        onCancel={() => setIsPaymentOpen(false)} 
      />

      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-brand-base to-brand-dark rounded-3xl shadow-[0_0_50px_rgba(20,184,166,0.3)] flex items-center justify-center mb-6 border border-brand-light/20 relative overflow-hidden">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-10 bg-gradient-to-t from-brand-accent/20 to-transparent blur-xl"
                />
                <Zap size={44} className="text-white relative z-10" fill="currentColor" />
              </div>
              
              <h1 className="text-4xl font-black text-white tracking-tight mb-2">
                Bharat <span className="text-brand-accent">Vision</span>
              </h1>
              <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase">
                Namma Bengaluru
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6 p-4 pt-8 pb-24">
        
        {/* THE NEW HEADER FIX */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
              Namma Bengaluru
            </h1>
            <h2 className="text-2xl font-extrabold text-white">
              Good Evening, {userName ? userName : "Guest"}
            </h2>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            {/* NEW: Profile Button positioned correctly in the top right */}
            <Link href="/profile" className="w-10 h-10 bg-surface-dark border border-brand-accent rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(20,184,166,0.15)] active:scale-95 transition-transform">
              <User size={18} className="text-brand-light" />
            </Link>
            
            <div className="flex items-center gap-1.5 bg-brand-dark px-3 py-1.5 rounded-full border border-brand-base shadow-lg">
              <Leaf size={14} className="text-brand-accent" />
              <span className="text-xs text-brand-accent font-semibold">{carbonSavedGrams} g saved</span>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
          className="flex items-center justify-between bg-surface-dark border border-brand-dark rounded-xl p-3 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="bg-surface-black p-2 rounded-full border border-surface-dark">
              {renderWeatherIcon()}
            </div>
            <div>
              <p className="text-white text-sm font-bold flex items-center gap-2">
                {weather.temperature}°C · {weather.condition}
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                {weather.location}
              </p>
            </div>
          </div>
          {weather.commuterAlert && (
            <div className="bg-blue-900/30 border border-blue-800 px-3 py-1.5 rounded-lg max-w-[140px] text-right">
              <p className="text-[9px] text-blue-300 font-bold leading-tight">
                {weather.commuterAlert}
              </p>
            </div>
          )}
        </motion.div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400 group-focus-within:text-brand-light transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-surface-dark text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-transparent focus:border-brand-base focus:ring-1 focus:ring-brand-base transition-all shadow-md placeholder-gray-400"
            placeholder="Locate Route / Destination..."
          />
        </div>

        <div className="bg-gradient-to-br from-brand-base to-brand-dark rounded-2xl p-5 shadow-lg border border-brand-light/20 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-brand-accent/20 rounded-full blur-xl"></div>
          
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-brand-accent text-xs font-semibold mb-1 flex items-center gap-1">
                <CreditCard size={12} /> BHARAT WALLET
              </p>
              <h3 className="text-3xl font-bold text-white">₹{walletBalance.toFixed(2)}</h3>
            </div>
            <button 
              onClick={() => setIsPaymentOpen(true)}
              className="bg-brand-accent text-brand-dark text-xs font-bold px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform"
            >
              Add Money
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-3">Passes & Tickets</h3>
          <div className="grid grid-cols-3 gap-3">
            
            <Link href="/pass" className="flex flex-col items-center justify-center bg-surface-dark p-4 rounded-2xl border border-surface-dark hover:border-brand-base transition-colors shadow-md">
              <div className="bg-brand-dark p-3 rounded-full mb-2">
                <Ticket size={24} className="text-brand-accent" />
              </div>
              <span className="text-xs font-medium text-gray-200">BMTC Pass</span>
            </Link>

            <Link href="/metro" className="flex flex-col items-center justify-center bg-surface-dark p-4 rounded-2xl border border-surface-dark hover:border-brand-base transition-colors shadow-md">
              <div className="bg-indigo-900/50 p-3 rounded-full mb-2">
                <TrainFront size={24} className="text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-gray-200">Metro</span>
            </Link>

            <Link href="/safety" className="flex flex-col items-center justify-center bg-surface-dark p-4 rounded-2xl border border-surface-dark hover:border-red-900/50 transition-colors shadow-md">
              <div className="bg-red-900/30 p-3 rounded-full mb-2">
                <ShieldAlert size={24} className="text-red-500" />
              </div>
              <span className="text-xs font-medium text-gray-200">SafeKeep</span>
            </Link>

          </div>
        </div>
      </div>
    </>
  );
}