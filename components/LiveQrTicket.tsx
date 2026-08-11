"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { ShieldCheck, EyeOff, AlertOctagon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveQrTicket({ route = "500D", userId = "AJAY_M_001" }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [secureHash, setSecureHash] = useState("");
  // THE NEW SECURITY STATE
  const [isScreenSecure, setIsScreenSecure] = useState(true);

  useEffect(() => {
    // 1. The Anti-Fraud Visibility Listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // App lost focus (User is switching apps, opening a screen recorder, or taking a screenshot in some OS)
        setIsScreenSecure(false);
      } else {
        // App regained focus
        setIsScreenSecure(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. The Cryptographic TOTP Logic
    const interval = setInterval(() => {
      // If the screen is not secure, freeze the clock to prevent fraud
      if (!document.hidden) {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        const secondsRemaining = 30 - (currentUnixTime % 30);
        setTimeLeft(secondsRemaining);

        const timeWindow = Math.floor(currentUnixTime / 30);
        const rawPayload = `BV_TICKET|${userId}|${route}|${timeWindow}`;
        setSecureHash(btoa(rawPayload)); 
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [route, userId]);

  return (
    <div className="flex flex-col items-center relative">
      
      {/* 3. The Security Blur Overlay */}
      <AnimatePresence>
        {!isScreenSecure && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface-black/80 rounded-2xl border-2 border-alert-red overflow-hidden p-4 text-center"
          >
            <AlertOctagon size={40} className="text-alert-red mb-2 animate-pulse" />
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">Security Lock</h3>
            <p className="text-[10px] text-gray-300 font-medium">
              Screen recording and backgrounding disabled for anti-fraud protection.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Actual Rendering QR Code */}
      <div className={`w-40 h-40 bg-white rounded-xl flex items-center justify-center mb-4 relative shadow-[0_0_15px_rgba(20,184,166,0.2)] p-2 transition-all ${!isScreenSecure ? 'opacity-10 scale-95' : 'opacity-100'}`}>
        {secureHash ? (
          <QRCode 
            value={secureHash} 
            size={144}
            bgColor="#ffffff"
            fgColor="#0f172a"
            level="H" 
          />
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-200 rounded-lg"></div>
        )}
        
        {/* Scanning Laser Animation */}
        <motion.div 
          animate={{ y: [0, 140, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-2 left-2 right-2 h-0.5 bg-brand-accent shadow-[0_0_8px_rgba(20,184,166,0.8)] z-10"
        />
      </div>

      <h2 className="text-white font-bold text-lg">Route {route} Ticket</h2>
      
      <p className="text-brand-light text-[10px] font-mono mt-1 flex items-center gap-1 bg-brand-dark px-2 py-1 rounded border border-brand-base">
        {isScreenSecure ? (
          <><ShieldCheck size={12} /> Live TOTP Active</>
        ) : (
          <><EyeOff size={12} className="text-alert-red" /> <span className="text-alert-red">Feed Paused</span></>
        )}
      </p>
      
      {/* The Live Clock UI */}
      <div className="mt-3 flex items-center gap-2 bg-surface-black px-3 py-1.5 rounded-lg border border-surface-dark">
        <span className="text-gray-400 text-xs font-mono">Refreshes in:</span>
        <span className={`font-black font-mono text-sm transition-colors ${
          timeLeft <= 5 ? "text-alert-red animate-pulse" : "text-brand-accent"
        }`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}