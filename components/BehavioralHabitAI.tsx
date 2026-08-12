"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, MapPin, ArrowRight, X, Clock, CheckCircle2 } from "lucide-react";

export default function BehavioralHabitAI() {
  const [isVisible, setIsVisible] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    // Simulate the AI detecting a routine morning commute
    const checkHabitPattern = () => {
      const hour = new Date().getHours();
      // If it's morning rush hour (simulated here with a timeout for demo purposes)
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    };

    checkHabitPattern();
  }, []);

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
          className="bg-surface-dark border border-brand-accent/50 p-5 rounded-3xl shadow-[0_10px_40px_rgba(20,184,166,0.2)] pointer-events-auto relative overflow-hidden"
        >
          {/* AI Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/0 via-brand-accent/10 to-brand-accent/0 animate-[shimmer_2s_infinite] pointer-events-none"></div>

          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-brand-accent" />
            <span className="text-[10px] uppercase tracking-widest text-brand-light font-black">Habit AI Detected</span>
          </div>

          {!booked ? (
            <>
              <h3 className="text-lg font-black text-white mb-1">Usual Morning Commute?</h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-300 font-semibold mb-4 bg-surface-black/50 p-2 rounded-xl border border-surface-dark">
                <MapPin size={14} className="text-brand-accent" /> Yelahanka
                <ArrowRight size={14} className="text-gray-500" />
                <span className="text-white">East West College of Engineering</span>
              </div>

              <div className="flex justify-between items-center bg-surface-black p-3 rounded-xl border border-brand-dark mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Optimal Multi-Modal Fare</p>
                  <p className="text-xl font-black text-white mt-0.5">₹45</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">ETA</p>
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