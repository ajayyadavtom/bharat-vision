"use client";

import { useEffect, useRef, useState } from "react";
import { X, ScanLine, CheckCircle2, XCircle, Bus, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function VisualBoardingLens() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanState, setScanState] = useState<"scanning" | "detected_wrong" | "detected_correct">("scanning");
  
  // Simulated Target Bus
  const targetRoute = "250";
  const targetDestination = "Yelahanka New Town";

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    // Simulate Computer Vision OCR Pipeline
    // Phase 1: Detect wrong bus first
    const wrongBusTimer = setTimeout(() => {
      setScanState("detected_wrong");
      
      // Phase 2: Resume scanning
      setTimeout(() => {
        setScanState("scanning");
        
        // Phase 3: Detect correct bus
        setTimeout(() => {
          setScanState("detected_correct");
        }, 3000);
      }, 2500);
    }, 3000);

    return () => {
      clearTimeout(wrongBusTimer);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden flex flex-col font-sans">
      
      {/* Live Camera Feed */}
      {hasPermission ? (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        />
      ) : hasPermission === false ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-black z-0 px-6 text-center">
          <AlertTriangle size={48} className="text-gray-600 mb-4" />
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Camera Required</h3>
          <p className="text-slate-500 dark:text-gray-400 text-xs">Allow camera access to scan approaching BMTC bus boards.</p>
        </div>
      ) : null}

      {/* Top HUD */}
      <div className="relative z-20 flex justify-between items-start p-6 bg-gradient-to-b from-black/90 to-transparent pb-16">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest text-brand-light uppercase">
              Vision Assist Active
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Target: Route {targetRoute}</h2>
          <p className="text-xs font-bold text-slate-600 dark:text-gray-300">Towards {targetDestination}</p>
        </div>
        
        <Link href="/" className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20 text-slate-900 dark:text-white hover:bg-black/60 transition-colors">
          <X size={20} />
        </Link>
      </div>

      {/* Dynamic Scanning Reticle & Results */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-none p-6">
        
        <AnimatePresence mode="wait">
          {scanState === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-64 h-32 border-2 border-brand-accent/50 rounded-xl flex items-center justify-center overflow-hidden bg-brand-accent/5 backdrop-blur-sm">
                <motion.div 
                  animate={{ top: ['-10%', '110%'] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-brand-accent shadow-[0_0_15px_rgba(20,184,166,1)]"
                />
                <ScanLine size={48} className="text-brand-accent/30" />
              </div>
              <div className="mt-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-brand-base/30">
                <p className="text-xs font-mono text-brand-accent animate-pulse">Point at BMTC LED Board...</p>
              </div>
            </motion.div>
          )}

          {scanState === "detected_wrong" && (
            <motion.div
              key="wrong"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 bg-red-500/20 rounded-full border-4 border-red-500 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(239,68,68,0.5)]">
                <XCircle size={64} className="text-red-500" />
              </div>
              <div className="bg-red-950/90 backdrop-blur-xl border border-red-500 p-6 rounded-3xl shadow-2xl">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Wrong Bus</h3>
                <p className="text-sm font-bold text-red-400 mb-4">Do Not Board</p>
                <div className="bg-black/50 p-3 rounded-xl text-left border border-red-900">
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">OCR Detected</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">Route 401K</p>
                  <p className="text-xs text-slate-600 dark:text-gray-300">Towards Yeshwanthpur</p>
                </div>
              </div>
            </motion.div>
          )}

          {scanState === "detected_correct" && (
            <motion.div
              key="correct"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 bg-emerald-500/20 rounded-full border-4 border-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                <CheckCircle2 size={64} className="text-emerald-400" />
              </div>
              <div className="bg-emerald-950/90 backdrop-blur-xl border border-emerald-500 p-6 rounded-3xl shadow-2xl w-full max-w-sm">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1 uppercase tracking-wider">Your Bus</h3>
                <p className="text-sm font-bold text-emerald-400 mb-4">Safe to Board</p>
                <div className="bg-black/50 p-3 rounded-xl text-left border border-emerald-900 mb-4">
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">OCR Match</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">Route {targetRoute}</p>
                  <p className="text-xs text-slate-600 dark:text-gray-300">Towards {targetDestination}</p>
                </div>
                <button className="w-full bg-emerald-500 text-black font-black py-3.5 rounded-xl text-sm shadow-lg pointer-events-auto active:scale-95 transition-transform flex items-center justify-center gap-2">
                  <Bus size={18} /> Generate E-Ticket
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      {/* Bottom Gradient for Contrast */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}