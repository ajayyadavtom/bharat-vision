"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, MapPin, ArrowRight, X, Clock, CheckCircle2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function BehavioralHabitAI() {
  const { userName } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    // Only show AI habit predictions for logged-in users with history (not Guests)
    if (userName === "Guest") return;

    // Simulate the AI detecting a routine morning commute from past booking data
    const checkHabitPattern = () => {
      const hour = new Date().getHours();
      setTimeout(() => {
        setIsVisible(true);
      }, 2500);
    };

    checkHabitPattern();
  }, [userName]);

  const handleZeroClickBooking = () => {
    setIsBooking(true);
    // Simulate instantaneous pre-authorized UPI mandate execution
    setTimeout(() => {
      setIsBooking(false);
      setBooked(true);
      setTimeout(() => setIsVisible(false), 3000);
    }, 1500);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-24 left-0 right-0 max-w-md mx-auto px-4 z-[100] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="bg-slate-900 border border-slate-700 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden"
        >
          {/* AI Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-brand-accent/5 to-brand-accent/0 animate-[shimmer_2s_infinite] pointer-events-none"></div>

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors bg-slate-800 p-1.5 rounded-full"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-brand-accent" />
            <span className="text-[10px] uppercase tracking-widest text-brand-accent font-black">Habit AI Analysis</span>
          </div>

          {!booked ? (
            <>
              <h3 className="text-lg font-black text-white mb-1">Book your usual commute?</h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-300 font-medium mb-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <MapPin size={14} className="text-brand-accent" /> Yelahanka
                <ArrowRight size={14} className="text-gray-500" />
                <span className="text-white font-bold">East West College</span>
              </div>

              <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Multi-Modal Fare</p>
                  <p className="text-xl font-black text-white mt-0.5">₹45</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ETA</p>
                  <p className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <Clock size={12} /> 38 mins
                  </p>
                </div>
              </div>

              <button
                onClick={handleZeroClickBooking}
                disabled={isBooking}
                className="w-full bg-brand-accent text-brand-dark font-black py-3.5 rounded-xl text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isBooking ? (
                  <span className="animate-pulse">Processing UPI Mandate...</span>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Zero-Click Booking (₹45)</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-4 text-center"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 border border-emerald-500">
                <CheckCircle2 size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-white">Tickets Generated!</h3>
              <p className="text-xs text-gray-400 mt-1">Multi-modal passes sent to Smart Tickets.</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}