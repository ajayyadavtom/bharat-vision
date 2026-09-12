"use client";

import { useState, useEffect } from "react";
import { TrainFront, MapPin, Clock, CreditCard, ArrowRightLeft, Sparkles, CheckCircle2, Ticket, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../../src/lib/store";
import { getCityData } from "@/lib/cityData";

export default function MetroScreen() {
  const { walletBalance, addMoney, fetchUserData, currentCity } = useAppStore();
  const cityData = getCityData(currentCity);
  const STATIONS = cityData.metroStations;

  const [origin, setOrigin] = useState(STATIONS[0]?.id || ""); 
  const [destination, setDestination] = useState(STATIONS[1]?.id || ""); 
  const [activeTab, setActiveTab] = useState<string>("Line 1");
  const [bookedToken, setBookedToken] = useState<string | null>(null);

  // FIX: Fetch wallet data from cloud on page load/reload
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const originStation = STATIONS.find((s) => s.id === origin);
  const destStation = STATIONS.find((s) => s.id === destination);

  const calculateTrip = () => {
    if (origin === destination) return { fare: 0, duration: 0, stops: 0, interchange: false };
    
    const idx1 = STATIONS.findIndex((s) => s.id === origin);
    const idx2 = STATIONS.findIndex((s) => s.id === destination);
    const stops = Math.abs(idx2 - idx1);
    const fare = Math.min(60, 15 + stops * 8);
    const duration = stops * 4 + 5;
    const interchange = originStation?.line !== destStation?.line && originStation?.line !== "Both" && destStation?.line !== "Both";

    return { fare, duration, stops, interchange };
  };

  const trip = calculateTrip();

  const handleBuyToken = () => {
    if (walletBalance < trip.fare) {
      alert(`Insufficient balance! Your wallet has ₹${walletBalance.toFixed(2)}, but the fare is ₹${trip.fare}. Please add money from the Home screen.`);
      return;
    }
    // Deduct fare and sync to database
    addMoney(-trip.fare);
    setBookedToken(`NMM-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      
      {/* Header & Live Wallet Display */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-[10px] text-brand-accent uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-1">
            <Sparkles size={12} /> {cityData.transitAuthorities.metro} Official Partner
          </h2>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <TrainFront className="text-brand-accent" size={28} /> {cityData.transitAuthorities.metro}
          </h1>
        </div>

        {/* Live Wallet Badge */}
        <div className="bg-surface-dark border border-brand-dark px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-md">
          <Wallet size={14} className="text-brand-accent" />
          <span className="text-white font-extrabold text-xs">₹{walletBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Line Toggle Tabs - Now generalized */}
      <div className="flex bg-surface-dark p-1 rounded-2xl border border-surface-dark mb-6">
        <button
          onClick={() => setActiveTab("Line 1")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "Line 1" ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:text-white"
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div> Metro Line 1
        </button>
        <button
          onClick={() => setActiveTab("Line 2")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === "Line 2" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"
          }`}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div> Metro Line 2
        </button>
      </div>

      {/* Station Selector Card */}
      <div className="bg-surface-dark p-5 rounded-3xl border border-brand-dark mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white">Select Journey</h3>
          <button 
            onClick={() => { setOrigin(destination); setDestination(origin); }}
            className="p-2 bg-surface-black rounded-full border border-surface-dark text-brand-accent active:rotate-180 transition-transform"
          >
            <ArrowRightLeft size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Origin */}
          <div className="flex items-center gap-3 bg-surface-black p-3 rounded-2xl border border-surface-dark">
            <MapPin size={18} className="text-brand-light" />
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold block">From</label>
              <select 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
                className="bg-transparent text-white text-sm outline-none w-full font-semibold"
              >
                {STATIONS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface-dark text-white">
                    {s.name} ({s.line})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-3 bg-surface-black p-3 rounded-2xl border border-surface-dark">
            <TrainFront size={18} className="text-brand-accent" />
            <div className="flex-1">
              <label className="text-[10px] text-gray-500 uppercase font-bold block">To</label>
              <select 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="bg-transparent text-white text-sm outline-none w-full font-semibold"
              >
                {STATIONS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface-dark text-white">
                    {s.name} ({s.line})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Calculation Details */}
      {origin !== destination && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-dark p-5 rounded-3xl border border-surface-dark mb-6 flex flex-col gap-4 shadow-md"
        >
          <div className="grid grid-cols-3 gap-2 text-center border-b border-surface-black pb-4">
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Fare</span>
              <span className="text-xl font-black text-brand-accent">₹{trip.fare}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Est. Time</span>
              <span className="text-xl font-black text-white flex items-center justify-center gap-1">
                <Clock size={14} className="text-gray-400" /> {trip.duration}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 block uppercase font-bold">Stops</span>
              <span className="text-xl font-black text-gray-200">{trip.stops}</span>
            </div>
          </div>

          {trip.interchange && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-400 text-xs font-semibold flex items-center gap-2">
              <Sparkles size={14} /> Switch lines at the Interchange Station
            </div>
          )}

          {/* Book Token Button / Active Token View */}
          {!bookedToken ? (
            <button
              onClick={handleBuyToken}
              className="w-full bg-brand-accent text-surface-black font-extrabold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm"
            >
              <Ticket size={18} /> Buy Metro QR Token (₹{trip.fare})
            </button>
          ) : (
            <div className="bg-emerald-900/30 border border-emerald-500/40 p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
              <CheckCircle2 size={32} className="text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Active Single Journey QR Token</h4>
              <p className="text-xs text-emerald-300 font-mono font-bold tracking-wider">{bookedToken}</p>
              <span className="text-[10px] text-gray-400">Scan at automatic AFC gate at station</span>
            </div>
          )}
        </motion.div>
      )}

    </div>
  );
}