"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Car, Bus, ArrowRight, ShieldCheck, CreditCard, Loader2, CheckCircle2, MapPin, Ticket } from "lucide-react";

export default function OndcTransactionBundle() {
  const [bookingState, setBookingState] = useState<"idle" | "discovering" | "ready" | "processing" | "confirmed">("idle");
  const [driverFound, setDriverFound] = useState(false);

  const startDiscovery = () => {
    setBookingState("discovering");
    
    // Simulate pinging the ONDC/Beckn open network for nearby autos
    setTimeout(() => {
      setDriverFound(true);
      setTimeout(() => {
        setBookingState("ready");
      }, 1500);
    }, 2500);
  };

  const executeUnifiedPayment = () => {
    setBookingState("processing");
    
    // Simulate the unified transaction where one UPI mandate pays both the Auto driver and BMTC
    setTimeout(() => {
      setBookingState("confirmed");
    }, 3000);
  };

  return (
    <div className="bg-surface-dark border border-indigo-900/50 p-5 rounded-3xl shadow-xl mt-6 relative overflow-hidden">
      
      {/* Background ONDC Network Graphic */}
      <div className="absolute -right-10 -top-10 text-indigo-500/5 pointer-events-none">
        <Network size={150} />
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <Network size={16} className="text-indigo-400" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
          Beckn / ONDC Protocol
        </h3>
      </div>

      <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1 relative z-10">Multi-Modal Bundle</h4>
      <p className="text-xs text-slate-500 dark:text-gray-400 mb-5 relative z-10">
        Book your first-mile auto and main transit pass in a single unified transaction.
      </p>

      {/* Segment 1: ONDC Auto */}
      <div className="bg-surface-black border border-slate-200 dark:border-surface-dark p-4 rounded-2xl mb-3 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
              <Car size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-amber-500 font-bold">First Mile</p>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Open-Network Auto</h5>
            </div>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white">₹45</span>
        </div>
        <div className="pl-12">
          <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1">
            <MapPin size={12} className="text-gray-500" /> Current Location <ArrowRight size={10} className="text-gray-600" /> Bus Stop
          </p>
          
          <AnimatePresence mode="wait">
            {bookingState === "discovering" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-2 flex items-center gap-2 text-[10px] font-mono text-indigo-400">
                <Loader2 size={12} className="animate-spin" /> Pinging ONDC Network...
              </motion.div>
            )}
            
            {(bookingState === "ready" || bookingState === "processing" || bookingState === "confirmed") && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex items-center gap-2 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md inline-flex border border-emerald-500/20">
                <ShieldCheck size={12} /> Driver Confirmed (KA-50-A-1234)
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Segment 2: BMTC Transit */}
      <div className="bg-surface-black border border-slate-200 dark:border-surface-dark p-4 rounded-2xl mb-5 relative z-10">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3">
            <div className="bg-brand-dark p-2.5 rounded-xl border border-brand-base">
              <Bus size={18} className="text-brand-accent" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-brand-accent font-bold">Main Transit</p>
              <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Vajra AC Pass (Route 500D)</h5>
            </div>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-white">₹140</span>
        </div>
      </div>

      {/* Total & Action */}
      <div className="flex items-center justify-between border-t border-indigo-900/50 pt-4 mt-2 relative z-10">
        <div>
          <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold">Unified Total</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">₹185</p>
        </div>
        
        {bookingState === "idle" && (
          <button onClick={startDiscovery} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl text-xs active:scale-95 transition-all shadow-lg flex items-center gap-2">
            <Network size={16} /> Discover Rides
          </button>
        )}

        {bookingState === "ready" && (
          <button onClick={executeUnifiedPayment} className="bg-brand-accent hover:bg-brand-light text-brand-dark font-black py-3 px-6 rounded-xl text-xs active:scale-95 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] flex items-center gap-2">
            <CreditCard size={16} /> Pay ₹185 & Book All
          </button>
        )}

        {bookingState === "processing" && (
          <button disabled className="bg-surface-black border border-slate-200 dark:border-surface-dark text-slate-500 dark:text-gray-400 font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 opacity-80">
            <Loader2 size={16} className="animate-spin" /> Splitting Payments...
          </button>
        )}

        {bookingState === "confirmed" && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold py-3 px-4 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> Tickets Issued
          </motion.div>
        )}
      </div>

      {/* Post-Booking Instructions */}
      <AnimatePresence>
        {bookingState === "confirmed" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 pt-4 border-t border-indigo-900/50 relative z-10 flex gap-2">
            <div className="flex-1 bg-surface-black border border-slate-200 dark:border-surface-dark p-3 rounded-xl flex items-center justify-center gap-2 text-amber-400 text-[10px] font-bold">
              <Car size={14} /> Auto Arriving (3m)
            </div>
            <div className="flex-1 bg-surface-black border border-slate-200 dark:border-surface-dark p-3 rounded-xl flex items-center justify-center gap-2 text-brand-accent text-[10px] font-bold">
              <Ticket size={14} /> View AC Pass
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}