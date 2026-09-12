"use client";

import { useState } from "react";
import { Search, MapPin, Navigation, Car, AlertTriangle, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getCityData } from "@/lib/cityData";

export default function AutoCabBooking() {
  const { currentCity, walletBalance, addMoney } = useAppStore();
  const cityData = getCityData(currentCity);
  
  const [pickup, setPickup] = useState("Current Location");
  const [dropoff, setDropoff] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [rides, setRides] = useState<any[]>([]);
  const [bookedRide, setBookedRide] = useState<any | null>(null);

  const handleSearch = () => {
    if (!dropoff) return;
    setIsSearching(true);
    setRides([]);
    
    // Simulate Beckn protocol / ONDC network search
    setTimeout(() => {
      setIsSearching(false);
      setRides([
        { id: "r1", type: "Auto Rickshaw", driver: "Ramesh K.", rating: 4.8, eta: "3 mins", fare: 45, network: "Namma Yatri (ONDC)" },
        { id: "r2", type: "Mini Cab", driver: "Suresh M.", rating: 4.6, eta: "5 mins", fare: 120, network: "Savaari (ONDC)" },
      ]);
    }, 1500);
  };

  const handleBook = (ride: any) => {
    if (walletBalance < ride.fare) {
      alert(`Insufficient Bharat Wallet balance. Fare is ₹${ride.fare}.`);
      return;
    }
    addMoney(-ride.fare);
    setBookedRide(ride);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[10px] text-amber-500 uppercase tracking-[0.2em] font-bold mb-1 flex items-center gap-1">
          <Zap size={12} /> ONDC Beckn Open Network
        </h2>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Car className="text-amber-500" size={28} /> Auto & Cab
        </h1>
        <p className="text-xs text-gray-400">First & Last Mile Connectivity in {cityData.name}</p>
      </div>

      {/* Booking Form */}
      <div className="bg-surface-dark p-5 rounded-3xl border border-surface-dark mb-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 bg-surface-black p-3 rounded-2xl border border-surface-dark focus-within:border-amber-500 transition-colors">
            <MapPin size={18} className="text-brand-light" />
            <input 
              type="text" 
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pickup Location"
              className="bg-transparent text-white text-sm outline-none w-full font-semibold placeholder-gray-500"
            />
          </div>
          <div className="flex items-center gap-3 bg-surface-black p-3 rounded-2xl border border-surface-dark focus-within:border-amber-500 transition-colors">
            <Navigation size={18} className="text-amber-500" />
            <input 
              type="text" 
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Where to?"
              className="bg-transparent text-white text-sm outline-none w-full font-semibold placeholder-gray-500"
            />
          </div>
          
          <button 
            onClick={handleSearch}
            disabled={!dropoff || isSearching}
            className="w-full bg-amber-500 text-surface-black font-extrabold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSearching ? "Searching Open Network..." : "Find Rides"}
          </button>
        </div>
      </div>

      {/* Results */}
      {rides.length > 0 && !bookedRide && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Available Rides</h3>
          {rides.map(ride => (
            <motion.div 
              key={ride.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-dark p-4 rounded-2xl border border-amber-900/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-900/30 p-2 rounded-xl">
                  <Car size={24} className="text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{ride.type}</h4>
                  <p className="text-[10px] text-gray-400">{ride.network} • {ride.eta} away</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-lg font-black text-amber-400">₹{ride.fare}</span>
                <button 
                  onClick={() => handleBook(ride)}
                  className="bg-amber-500 text-surface-black text-xs font-bold px-4 py-1.5 rounded-lg active:scale-95 transition-transform"
                >
                  Book
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active Ride */}
      {bookedRide && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-900/20 border border-emerald-500/30 p-5 rounded-3xl flex flex-col items-center text-center gap-3"
        >
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
            <Car size={32} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white mb-1">Driver Assigned!</h3>
            <p className="text-sm text-gray-300">Your {bookedRide.type.toLowerCase()} is on the way.</p>
          </div>
          
          <div className="w-full bg-surface-black rounded-2xl p-4 flex justify-between items-center mt-2 border border-surface-dark">
            <div className="text-left">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Driver</p>
              <p className="text-sm font-bold text-white">{bookedRide.driver} ★ {bookedRide.rating}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase">PIN</p>
              <p className="text-xl font-black text-emerald-400 tracking-widest">{Math.floor(1000 + Math.random() * 9000)}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="text-xs text-gray-400 font-semibold">Ride tracked via Bharat Vision</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
