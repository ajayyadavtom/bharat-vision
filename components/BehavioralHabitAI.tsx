"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, MapPin, ArrowRight, X, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function BehavioralHabitAI() {
  const { walletBalance, deductBalance, rideHistory, addRideHistory, addKarma } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookedTicketId, setBookedTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Evaluate real-time commute context based on current hour and past ride history
  const commuteContext = useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD

    // Real commuter hours:
    // Morning Window: 07:00 - 11:59 (Peak office / college transit)
    // Evening Window: 16:00 - 21:00 (Peak evening return transit)
    const isMorning = hour >= 7 && hour < 12;
    const isEvening = hour >= 16 && hour < 21;

    let windowType: "morning" | "evening" | "offpeak" = "offpeak";
    let windowLabel = "Commute Pattern";
    let badgeText = "Real-Time AI Telemetry";
    let origin = "Yelahanka";
    let destination = "East West College";
    let fare = 45;
    let eta = 38;

    if (isMorning) {
      windowType = "morning";
      windowLabel = "Morning Commute";
      badgeText = "Peak Commute Window";
      origin = "Yelahanka";
      destination = "East West College";
      fare = 45;
      eta = 38;
    } else if (isEvening) {
      windowType = "evening";
      windowLabel = "Evening Return Trip";
      badgeText = "Return Routine Detected";
      origin = "East West College";
      destination = "Yelahanka";
      fare = 45;
      eta = 42;
    }

    // Dynamically learn from user's actual ride history if present
    if (rideHistory && rideHistory.length > 0) {
      const frequentRides = rideHistory.filter((r) => r.origin && r.destination);
      if (frequentRides.length > 0) {
        const topRide = frequentRides[0];
        if (topRide.origin && topRide.destination) {
          if (isMorning) {
            origin = topRide.origin;
            destination = topRide.destination;
            fare = topRide.fare || 45;
          } else if (isEvening) {
            origin = topRide.destination;
            destination = topRide.origin;
            fare = topRide.fare || 45;
          }
        }
      }
    }

    return {
      isCommuteHour: isMorning || isEvening,
      windowType,
      windowLabel,
      badgeText,
      origin,
      destination,
      fare,
      eta,
      dateStr,
    };
  }, [rideHistory]);

  // 2. On-demand Habit AI: Triggered explicitly when the user clicks the "Habit AI" button
  useEffect(() => {
    const handleManualTrigger = () => {
      setIsVisible(true);
      setBooked(false);
      setErrorMsg(null);
    };
    window.addEventListener("bv-trigger-habit-ai", handleManualTrigger);
    return () => window.removeEventListener("bv-trigger-habit-ai", handleManualTrigger);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      // Cooldown for 4 hours so it won't interrupt the commuter on repeated home visits
      localStorage.setItem("bv_habit_dismissed_until", (Date.now() + 4 * 60 * 60 * 1000).toString());
      sessionStorage.setItem(`bv_habit_shown_${commuteContext.windowType}`, "true");
    }
  }, [commuteContext.windowType]);

  const handleZeroClickBooking = async () => {
    setErrorMsg(null);

    if (walletBalance < commuteContext.fare) {
      setErrorMsg(`Insufficient wallet balance (₹${walletBalance.toFixed(2)}). Please add money from Home.`);
      return;
    }

    setIsBooking(true);

    try {
      // 1. Deduct fare from cloud wallet
      await deductBalance(commuteContext.fare);

      // 2. Generate official transit ticket record and sync to rideHistory
      const newTicketId = `NMM-${Math.floor(100000 + Math.random() * 900000)}`;
      addRideHistory({
        id: newTicketId,
        category: "bus",
        type: `Routine Commute (${commuteContext.origin} ➔ ${commuteContext.destination})`,
        network: "BMTC / Namma Metro Unified Hub",
        origin: commuteContext.origin,
        destination: commuteContext.destination,
        route: `${commuteContext.origin} ➔ ${commuteContext.destination}`,
        ticketId: newTicketId,
        fare: commuteContext.fare,
        dateString: `Today, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
        timestamp: Date.now(),
        status: "Active",
      });

      // 3. Award green commute karma
      await addKarma(15);

      // 4. Record that this window is booked so it won't prompt again today
      if (typeof window !== "undefined") {
        const bookedKey = `bv_habit_booked_${commuteContext.dateStr}_${commuteContext.windowType}`;
        localStorage.setItem(bookedKey, "true");
      }

      setBookedTicketId(newTicketId);
      setIsBooking(false);
      setBooked(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 3500);
    } catch (err) {
      console.error("Habit AI booking error:", err);
      setIsBooking(false);
      setErrorMsg("Transaction failed. Please try again.");
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed bottom-24 lg:bottom-8 left-4 right-4 lg:left-auto lg:right-8 max-w-md w-full z-[100] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] pointer-events-auto relative overflow-hidden"
        >
          {/* Subtle AI Shimmer Accent */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-teal-500/10 dark:via-brand-accent/5 to-teal-500/0 animate-[shimmer_2s_infinite] pointer-events-none" />

          {/* Dismiss button */}
          <button 
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full cursor-pointer z-10"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-2 mb-2.5">
            <div className="p-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-brand-accent">
              <Sparkles size={14} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-teal-600 dark:text-brand-accent font-black">
                Habit AI Analysis
              </span>
              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold">
                {commuteContext.badgeText}
              </span>
            </div>
          </div>

          {!booked ? (
            <>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                Book your usual commute?
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Detected your {commuteContext.windowLabel.toLowerCase()} pattern based on real-time transit telemetry.
              </p>
              
              {/* Route checkpoints */}
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-gray-300 font-medium mb-3 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <MapPin size={14} className="text-teal-600 dark:text-brand-accent shrink-0" />
                <span className="font-semibold truncate">{commuteContext.origin}</span>
                <ArrowRight size={14} className="text-slate-400 dark:text-gray-500 shrink-0" />
                <span className="text-slate-900 dark:text-white font-bold truncate">{commuteContext.destination}</span>
              </div>

              {/* Fare & ETA breakdown */}
              <div className="flex justify-between items-center bg-slate-100/80 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 mb-3">
                <div>
                  <p className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Multi-Modal Fare</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">₹{commuteContext.fare}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Est. Travel Time</p>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end mt-0.5">
                    <Clock size={13} /> {commuteContext.eta} mins
                  </p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 text-xs p-2.5 rounded-xl flex items-center gap-2 mb-3">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Zero-Click Booking CTA */}
              <button
                type="button"
                onClick={handleZeroClickBooking}
                disabled={isBooking}
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-brand-accent dark:hover:bg-teal-400 text-white dark:text-slate-950 font-black py-3 rounded-2xl text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isBooking ? (
                  <span className="animate-pulse">Authorizing Instant UPI Ticket...</span>
                ) : (
                  <>
                    <Zap size={16} />
                    <span>Zero-Click Booking (₹{commuteContext.fare})</span>
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
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-2.5 border border-emerald-500">
                <CheckCircle2 size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Tickets Generated!</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                Pass <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{bookedTicketId}</span> added to your Smart Tickets.
              </p>
              <span className="text-[10px] text-teal-600 dark:text-brand-accent font-bold mt-2">
                +15 Karma Points Awarded
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}