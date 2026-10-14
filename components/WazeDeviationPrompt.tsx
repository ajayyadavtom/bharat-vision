"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Check, Medal } from "lucide-react";

export default function WazeDeviationPrompt({
  busId = "500D",
}: {
  busId?: string;
}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // 10-minute cooldown check
  useEffect(() => {
    const lastPrompt = localStorage.getItem("waze_last_deviation_time");
    const COOLDOWN = 10 * 60 * 1000;
    if (lastPrompt && Date.now() - parseInt(lastPrompt, 10) < COOLDOWN) {
      return;
    }
  }, []);

  const handleVote = () => {
    setHasVoted(true);
    localStorage.setItem("waze_last_deviation_time", String(Date.now()));
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("waze_last_deviation_time", String(Date.now()));
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-24 left-4 right-4 z-50 pointer-events-auto"
      >
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-slate-800 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 animate-[shimmer_2s_infinite]" />

          {!hasVoted ? (
            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full text-amber-600 dark:text-amber-400 shrink-0 mt-1">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-1">
                    Did Route {busId} just take a detour?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Our real-time engine noticed the moving bus deviating from the corridor. Confirm to alert fellow commuters and earn Karma!
                  </p>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleVote}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check size={16} /> Yes
                    </button>
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <X size={16} /> No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3">
                <Medal size={32} className="text-emerald-500" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                +50 Karma Points!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 px-4">
                Your report updated the live map for commuters. Next check in 10 minutes.
              </p>
              <button
                type="button"
                onClick={handleDismiss}
                className="text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
