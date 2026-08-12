"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, AlertOctagon, Check, X, Users, MapPin, Medal, Loader2, GitMerge } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function RouteDeviationAI() {
  const { addKarma } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [voteStatus, setVoteStatus] = useState<"pending" | "voting" | "verifying" | "confirmed">("pending");

  useEffect(() => {
    // Simulate the AI detecting an anomaly via GPS & Beacon cross-check after 4 seconds on the tracking screen
    const detectAnomaly = setTimeout(() => {
      setIsVisible(true);
    }, 4000);

    return () => clearTimeout(detectAnomaly);
  }, []);

  const handleVote = (hasDeviated: boolean) => {
    setVoteStatus("voting");
    
    // Simulate the decentralized consensus verification
    setTimeout(() => {
      setVoteStatus("verifying");
      
      setTimeout(() => {
        setVoteStatus("confirmed");
        if (hasDeviated) {
          addKarma(15); // Gamification reward for confirming the route change
        }
        
        // Hide the overlay after a few seconds
        setTimeout(() => setIsVisible(false), 4500);
      }, 2500);
    }, 1000);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-20 left-0 right-0 max-w-md mx-auto px-4 z-[150] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-surface-dark border border-amber-500/50 p-5 rounded-3xl shadow-[0_15px_40px_rgba(245,158,11,0.2)] pointer-events-auto relative overflow-hidden"
        >
          {/* AI Beacon Scan Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/10 to-amber-500/0 animate-[shimmer_2s_infinite] pointer-events-none"></div>

          {voteStatus === "pending" && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <AlertOctagon size={16} className="text-amber-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-widest text-amber-400 font-black">AI Anomaly Detected</span>
              </div>

              <h3 className="text-lg font-black text-white mb-2 leading-tight">
                Are you on Route 500D?
              </h3>
              
              <p className="text-xs text-gray-300 font-medium mb-4 bg-surface-black/50 p-3 rounded-xl border border-surface-dark">
                Our sensors indicate this bus just took a sharp left turn away from the Outer Ring Road. Did the conductor change the route?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleVote(true)}
                  className="flex-1 bg-amber-500 text-black font-black py-3 rounded-xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Check size={16} /> Yes, Detour
                </button>
                <button
                  onClick={() => handleVote(false)}
                  className="flex-1 bg-surface-black border border-surface-dark text-white font-bold py-3 rounded-xl text-xs active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <X size={16} /> No, Normal Path
                </button>
              </div>
            </>
          )}

          {voteStatus === "voting" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Loader2 size={24} className="text-amber-500 animate-spin mb-3" />
              <h3 className="text-sm font-bold text-white">Transmitting Data...</h3>
            </div>
          )}

          {voteStatus === "verifying" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-3 text-brand-accent">
                <Users size={16} className="animate-bounce" />
                <Users size={20} className="animate-bounce delay-75" />
                <Users size={16} className="animate-bounce delay-150" />
              </div>
              <h3 className="text-sm font-bold text-white">Verifying Consensus</h3>
              <p className="text-xs text-gray-400 mt-1">Cross-checking with 3 other passengers onboard...</p>
            </div>
          )}

          {voteStatus === "confirmed" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-2 text-center"
            >
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 border border-emerald-500">
                <GitMerge size={24} className="text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-white">Route Graph Updated!</h3>
              <p className="text-xs text-gray-300 mt-1 mb-3">
                Consensus reached. Ghost ETAs removed for upcoming stops.
              </p>
              <div className="bg-amber-900/40 border border-amber-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                <Medal size={16} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400">+15 Karma Points Earned</span>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}