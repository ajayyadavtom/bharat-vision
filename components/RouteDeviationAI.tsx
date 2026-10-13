"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertOctagon, Check, X, Users, Medal, Loader2, GitMerge, Camera, XCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function RouteDeviationAI({ externalTrigger, resetTrigger }: { externalTrigger?: boolean, resetTrigger?: () => void }) {
  const { addKarma } = useAppStore();
  const [isVisible, setIsVisible] = useState(false);
  const [voteStatus, setVoteStatus] = useState<"pending" | "voting" | "ocr" | "verifying" | "confirmed">("pending");
  const [isWatching, setIsWatching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // REAL-TIME GEOLOCATION WATCHER
    let watchId: number;
    if ("geolocation" in navigator) {
      setIsWatching(true);
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          // In a real app, we would compare position.coords against GTFS-RT route shape.
          // For demo purposes, we still use a timeout to trigger it after location is acquired, 
          // to guarantee the user sees it without having to actually walk 500 meters.
          if (!isVisible && !externalTrigger) {
            const detectAnomaly = setTimeout(() => {
              setIsVisible(true);
            }, 10000);
            return () => clearTimeout(detectAnomaly);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }

    if (externalTrigger) {
      setIsVisible(true);
      setVoteStatus("pending");
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [externalTrigger, isVisible]);

  const handleVote = (hasDeviated: boolean) => {
    setVoteStatus("voting");
    setTimeout(() => {
      setVoteStatus("verifying");
      setTimeout(() => {
        setVoteStatus("confirmed");
        if (hasDeviated) addKarma(15);
        setTimeout(() => {
          handleDismiss();
        }, 4500);
      }, 2500);
    }, 1000);
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // User uploaded/captured an image. Start OCR process.
      setVoteStatus("ocr");
      setTimeout(() => {
        // Simulate successful OCR verification extracting route text from the image
        setVoteStatus("confirmed");
        addKarma(25);
        setTimeout(() => {
          handleDismiss();
        }, 4500);
      }, 3000);
    }
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setVoteStatus("pending");
    if (resetTrigger) resetTrigger();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed top-20 left-0 right-0 max-w-md mx-auto px-4 z-[150] pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="bg-white dark:bg-slate-900 border border-amber-500/50 p-5 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_rgba(245,158,11,0.2)] pointer-events-auto relative overflow-hidden"
        >
          {/* AI Beacon Scan Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/0 via-amber-500/5 dark:via-amber-500/10 to-amber-500/0 animate-[shimmer_2s_infinite] pointer-events-none"></div>

          {/* Dismiss Button */}
          {voteStatus === "pending" && (
            <button 
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10"
            >
              <XCircle size={20} />
            </button>
          )}

          {voteStatus === "pending" && (
            <>
              <div className="flex justify-between items-start mb-3 pr-6">
                <div className="flex items-center gap-2">
                  <AlertOctagon size={16} className="text-amber-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-amber-600 dark:text-amber-400 font-black">AI Anomaly Detected</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                Are you on Route 500D?
              </h3>
              
              <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="mb-2">
                  <strong className="text-indigo-500 flex items-center gap-1 mb-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Live GPS Telemetry Active
                  </strong>
                  Our ML model noticed you and 5 passengers took a sudden detour away from Outer Ring Road.
                </p>
                <p>
                  <strong>Did the conductor change the destination display to Electronic City?</strong>
                </p>
              </div>

              <div className="flex items-center gap-2 mb-3 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800">
                <Medal size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">Weighted Trust Score: 2x (Verified Frequent Rider)</span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVote(true)}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white dark:text-black font-black py-3 rounded-xl text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={16} /> Yes, Detour
                  </button>
                  <button
                    onClick={() => handleVote(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Normal Path
                  </button>
                </div>
                
                {/* Hidden File Input for Real Camera Capture */}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={fileInputRef} 
                  onChange={handleCameraCapture} 
                  className="hidden" 
                />
                
                <button
                  onClick={triggerCamera}
                  className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-bold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-2 mt-1"
                >
                  <Camera size={16} /> Snap Display Board for OCR
                </button>
              </div>
            </>
          )}

          {voteStatus === "ocr" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="relative">
                <Camera size={32} className="text-indigo-500 mb-3" />
                <div className="absolute inset-0 bg-indigo-400/20 blur-md rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Analyzing Image...</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Extracting LED text via OCR Neural Net</p>
            </div>
          )}

          {voteStatus === "voting" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <Loader2 size={24} className="text-amber-500 animate-spin mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transmitting Data...</h3>
            </div>
          )}

          {voteStatus === "verifying" && (
            <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-3 text-indigo-500">
                <Users size={16} className="animate-bounce" />
                <Users size={20} className="animate-bounce delay-75" />
                <Users size={16} className="animate-bounce delay-150" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verifying Consensus</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Cross-checking with 3 other passengers onboard...</p>
            </div>
          )}

          {voteStatus === "confirmed" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-2 text-center"
            >
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-3 border border-emerald-500">
                <GitMerge size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Route Graph Updated!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 mb-3">
                Decentralized consensus reached. Ghost ETAs removed instantly.
              </p>
              <div className="bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-500/30 px-4 py-2 rounded-full flex items-center gap-2">
                <Medal size={16} className="text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">+25 Karma Points Earned</span>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}