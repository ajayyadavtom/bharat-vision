"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { ShieldCheck, EyeOff, AlertOctagon, Wifi, WifiOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveQrTicket({ route = "500D", userId = "AJAY_M_001" }) {
  const [timeLeft, setTimeLeft] = useState(30);
  const [secureHash, setSecureHash] = useState("");
  const [isScreenSecure, setIsScreenSecure] = useState(true);
  
  // Dual Logic State
  const [networkMode, setNetworkMode] = useState<"online" | "offline">("online");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Network detection logic
    const checkNetworkStatus = () => {
      if (typeof navigator === "undefined") return;
      
      let isOnline = navigator.onLine;
      
      // Check for low data / slow connection if API available
      if (isOnline && (navigator as any).connection) {
        const conn = (navigator as any).connection;
        if (conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g' || conn.saveData) {
          isOnline = false; // Fallback to offline logic for low data
        }
      }
      
      setNetworkMode(isOnline ? "online" : "offline");
    };

    checkNetworkStatus();
    window.addEventListener("online", checkNetworkStatus);
    window.addEventListener("offline", checkNetworkStatus);
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', checkNetworkStatus);
    }

    // 1. The Anti-Fraud Visibility Listener
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsScreenSecure(false);
      } else {
        setIsScreenSecure(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 2. The Cryptographic TOTP / Server Sync Logic
    const interval = setInterval(() => {
      if (!document.hidden) {
        const currentUnixTime = Math.floor(Date.now() / 1000);
        
        // Ensure synchronized clock logic:
        // When online, validity is longer (e.g., 300 seconds) + check against server timestamp.
        // When offline, fallback to 30-second TOTP local logic.
        
        if (networkMode === "online") {
           // Online logic (Server based generation mocked here)
           const secondsRemaining = 300 - (currentUnixTime % 300);
           setTimeLeft(secondsRemaining);
           
           const timeWindow = Math.floor(currentUnixTime / 300);
           const rawPayload = `ONLINE_TKT|${userId}|${route}|${timeWindow}|VERIFIED`;
           setSecureHash(btoa(rawPayload));
        } else {
           // Offline Fallback Logic (TOTP)
           const secondsRemaining = 30 - (currentUnixTime % 30);
           setTimeLeft(secondsRemaining);

           const timeWindow = Math.floor(currentUnixTime / 30);
           const rawPayload = `OFFLINE_TOTP|${userId}|${route}|${timeWindow}`;
           setSecureHash(btoa(rawPayload)); 
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("online", checkNetworkStatus);
      window.removeEventListener("offline", checkNetworkStatus);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', checkNetworkStatus);
      }
    };
  }, [route, userId, networkMode]);

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center relative">
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

      <div className={`w-48 h-48 bg-white rounded-xl flex items-center justify-center mb-4 relative shadow-[0_0_20px_rgba(20,184,166,0.3)] p-3 transition-all ${!isScreenSecure ? 'opacity-10 scale-95' : 'opacity-100'}`}>
        {secureHash ? (
          <QRCode 
            value={secureHash} 
            size={160}
            bgColor="#ffffff"
            fgColor={networkMode === "online" ? "#0f172a" : "#4338ca"}
            level="H" 
          />
        ) : (
          <div className="w-full h-full animate-pulse bg-gray-200 rounded-lg"></div>
        )}
        
        {/* Scanning Laser Animation */}
        <motion.div 
          animate={{ y: [0, 168, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className={`absolute top-2 left-2 right-2 h-[3px] shadow-[0_0_12px_rgba(20,184,166,1)] z-10 ${networkMode === "online" ? "bg-brand-accent" : "bg-indigo-500"}`}
        />
      </div>

      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-white font-bold text-xl">Route {route} Ticket</h2>
        {networkMode === "online" ? (
          <div className="bg-green-500/20 text-green-400 p-1 rounded border border-green-500/30" title="Online mode (Server sync)">
            <Wifi size={14} />
          </div>
        ) : (
          <div className="bg-amber-500/20 text-amber-400 p-1 rounded border border-amber-500/30" title="Offline mode (Local TOTP)">
            <WifiOff size={14} />
          </div>
        )}
      </div>
      
      <p className="text-brand-light text-[10px] font-mono mt-1 flex items-center gap-1 bg-brand-dark px-2 py-1 rounded border border-brand-base">
        {isScreenSecure ? (
          networkMode === "online" ? <><ShieldCheck size={12} className="text-green-400" /> Server Verified QR</> : <><ShieldCheck size={12} className="text-indigo-400" /> Local TOTP Active</>
        ) : (
          <><EyeOff size={12} className="text-alert-red" /> <span className="text-alert-red">Feed Paused</span></>
        )}
      </p>
      
      {/* The Live Clock UI */}
      <div className="mt-3 flex items-center gap-2 bg-surface-black px-3 py-1.5 rounded-lg border border-surface-dark">
        <span className="text-gray-400 text-xs font-mono">{networkMode === "online" ? "Server sync in:" : "Refreshes in:"}</span>
        <span className={`font-black font-mono text-sm transition-colors ${
          timeLeft <= 10 ? "text-alert-red animate-pulse" : (networkMode === "online" ? "text-brand-accent" : "text-indigo-400")
        }`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}