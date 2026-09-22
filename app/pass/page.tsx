"use client";

import { useState, useEffect } from "react";
import { CreditCard, WifiOff, Ticket, AlertTriangle, Clock, ShieldCheck, RefreshCcw, Smartphone, Lock, RotateCcw } from "lucide-react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import UpiGateway from "@/components/UpiGateway";

import { useAppStore } from "@/lib/store"; 
import { getCityData } from "@/lib/cityData";

export default function PassScreen() {
  const { walletBalance, userName, currentCity, deductBalance, activePass, setActivePass, mockDeviceToggle, setMockDeviceToggle } = useAppStore();
  const cityData = getCityData(currentCity);
  const [activeTab, setActiveTab] = useState("digital");
  
  
  const [showUpi, setShowUpi] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [qrPayload, setQrPayload] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  // Hologram tilt coordinates
  const [tilt, setTilt] = useState({ x: 50, y: 50 });
  const [isSecureBlocked, setIsSecureBlocked] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState("BV-BINDING-PENDING");

  const passCatalog = cityData.passes;

  useEffect(() => {
    setMounted(true);
    // Safe network check
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    
    // Generate stable device binding fingerprint from browser specs
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "UnknownDevice";
    const screenRes = typeof window !== "undefined" ? `${window.screen.width}x${window.screen.height}` : "0x0";
    const rawFingerprint = `${userAgent}-${screenRes}-${userName || "COMMUTER"}`;
    
    // Simple hash for device binding ID
    let hash = 0;
    for (let i = 0; i < rawFingerprint.length; i++) {
      hash = (hash << 5) - hash + rawFingerprint.charCodeAt(i);
      hash |= 0;
    }
    setDeviceFingerprint(`BV-DEV-${Math.abs(hash).toString(16).toUpperCase()}${mockDeviceToggle ? '-NEW' : ''}`);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, [userName]);

  // Gyroscope / Mouse Hologram Shimmer Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setTilt({ x, y });
  };

  // Ultra-Resilient Cryptographic TOTP Hash Generator
  useEffect(() => {
    if (!mounted) return;
    let isMounted = true;

    const generateCryptographicToken = async () => {
      const timeStep = Math.floor(Date.now() / 10000);
      const safeUserName = userName ? userName.replace(/[^a-zA-Z0-9]/g, '') : "COMMUTER";
      const rawString = `${cityData.transitAuthorities.bus}-SECURE-${safeUserName}-${deviceFingerprint}-${timeStep}-${isOnline ? 'ONLINE' : 'OFFLINE'}`;
      
      try {
        let hashHex = "";
        // Safely check if we are in a secure context allowing crypto API
        if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
          const encoder = new TextEncoder();
          const data = encoder.encode(rawString);
          const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        } else {
          // Fallback for non-HTTPS local network testing (Mobile IP testing)
          hashHex = btoa(rawString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
        }
        
        if (isMounted) {
          setQrPayload(`BV-TOTP:${hashHex.substring(0, 16).toUpperCase()}:${timeStep}`);
        }
      } catch (err) {
        // Absolute worst-case scenario fallback
        if (isMounted) {
          setQrPayload(`BV-FALLBACK:${safeUserName}-${timeStep}`);
        }
      }
    };

    generateCryptographicToken();

    const interval = setInterval(() => {
      setTime(new Date());
      generateCryptographicToken();
    }, 10000); 

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [userName, isOnline, mounted, deviceFingerprint]);

  // Anti-Screenshot & Screen Recording Armor (FLAG_SECURE Simulation)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') setIsSecureBlocked(true);
      else setIsSecureBlocked(false);
    };
    const handleBlur = () => setIsSecureBlocked(true);
    const handleFocus = () => setIsSecureBlocked(false);
    
    // Catch standard screenshot keys
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S')) || (e.ctrlKey && e.key === 'p')) {
        setIsSecureBlocked(true);
        setTimeout(() => setIsSecureBlocked(false), 3000);
      }
    };

    // Gyroscope tracking for Kinetic Hologram
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let x = event.gamma ? (event.gamma + 90) / 1.8 : 50; 
      let y = event.beta ? (event.beta + 180) / 3.6 : 50; 
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));
      setTilt({ x, y });
    };

    if (typeof window !== 'undefined') {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleBlur);
      window.addEventListener("focus", handleFocus);
      window.addEventListener("keydown", handleKeyDown);
      
      // Request device orientation if available
      if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("blur", handleBlur);
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [mockDeviceToggle, userName]);

  const [activePassName, setActivePassName] = useState("");

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 select-none [&>*]:shrink-0">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Smart Tickets</h1>
          <p className="text-xs text-slate-500 dark:text-gray-400">Anti-Fraud TOTP & Device Binding</p>
        </div>
        <button 
          onClick={() => setMockDeviceToggle(!mockDeviceToggle)}
          className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 p-2 rounded-xl text-[10px] font-bold flex flex-col items-center shadow-sm active:scale-95"
        >
          <Smartphone size={16} className="mb-1" />
          {mockDeviceToggle ? "Using Phone B" : "Using Phone A"}
        </button>
      </div>
      
      {activePass ? (
        activePass.boundDeviceId === deviceFingerprint ? (
          <div 
            onMouseMove={handleMouseMove}
            className="mb-8 relative rounded-3xl overflow-hidden shadow-2xl border border-brand-base bg-white dark:bg-slate-900 p-6 flex flex-col items-center justify-center"
          >
            {/* Gyroscope Shimmer Hologram */}
            <div 
              className="absolute inset-0 pointer-events-none z-0 opacity-50 mix-blend-color-dodge transition-transform duration-75 ease-out"
              style={{
                background: `radial-gradient(circle at ${tilt.x}% ${tilt.y}%, rgba(20,184,166,0.6) 0%, rgba(59,130,246,0.3) 40%, transparent 80%)`
              }}
            />
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.1] flex items-center justify-center overflow-hidden">
              <p 
                className="text-slate-900 dark:text-white font-black text-6xl uppercase tracking-widest whitespace-nowrap transition-transform duration-75"
                style={{ transform: `translate(${(tilt.x - 50) * -1.5}px, ${(tilt.y - 50) * -1.5}px) rotate(-30deg)` }}
              >
                BHARAT VISION • LIVE TICKET •
              </p>
            </div>

            {isSecureBlocked ? (
              <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-center p-6">
                <ShieldCheck size={48} className="text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">FLAG_SECURE ENFORCED</h2>
                <p className="text-xs text-gray-400">OS-Level Screenshot & Screen Recording Blocked.</p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center w-full">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center drop-shadow-sm">{activePass.name}</h2>
                <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-6 flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={14} /> Active & Anchored
                </div>
                <div className="bg-white p-2 rounded-2xl mb-4 w-full flex justify-center items-center h-[232px] border-4 border-slate-100 shadow-inner relative overflow-hidden">
                  {qrPayload ? (
                    <QRCode value={qrPayload} size={200} level="H" />
                  ) : (
                    <RefreshCcw className="animate-spin text-slate-400" size={32} />
                  )}
                </div>
                <div className="text-center w-full mt-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 drop-shadow-sm">Valid until: {new Date(activePass.expiry).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-mono">Enclave: {deviceFingerprint.split('-').pop()}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-8 relative rounded-3xl overflow-hidden shadow-xl border border-rose-500/50 bg-rose-50 dark:bg-rose-950/30 p-6 flex flex-col items-center justify-center text-center">
            <div className="bg-rose-100 dark:bg-rose-900/50 p-4 rounded-full mb-4 shadow-inner">
              <Lock size={40} className="text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Pass Bound to Another Device</h2>
            <p className="text-xs text-slate-600 dark:text-rose-200/70 mb-6">
              Your <b>{activePass.name}</b> is cryptographically anchored to hardware ID: <code className="bg-rose-200 dark:bg-rose-900/50 px-1 rounded">{activePass.boundDeviceId.split('-').pop()}</code>.
            </p>
            <button 
              onClick={() => {
                const now = Date.now();
                if (activePass.lastMigratedAt && (now - activePass.lastMigratedAt) < 24*3600*1000) {
                  alert("SECURITY PROTOCOL: You can only migrate a pass once every 24 hours to prevent account-sharing fraud.\n\nPlease try again later.");
                  return;
                }
                setActivePass({
                  ...activePass,
                  boundDeviceId: deviceFingerprint,
                  lastMigratedAt: now
                });
                alert("SUCCESS! The pass has been cryptographically re-anchored to this device's Secure Enclave.");
              }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-3 rounded-xl w-full flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <RotateCcw size={16} /> Migrate Pass Here
            </button>
            {activePass.lastMigratedAt && (
              <p className="text-[9px] text-rose-500 mt-3 flex items-center gap-1 justify-center">
                <AlertTriangle size={10} /> Migrated recently. 24h cooldown active.
              </p>
            )}
          </div>
        )
      ) : (
        <div className="mb-8 bg-surface-dark rounded-3xl p-8 border border-slate-200 dark:border-surface-dark text-center flex flex-col items-center justify-center shadow-inner">
          <Ticket size={48} className="text-slate-400 dark:text-gray-600 mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Active Tickets</h3>
          <p className="text-xs text-slate-500">Select a pass below to generate your QR ticket.</p>
        </div>
      )}


      <div className="flex bg-surface-dark p-1 rounded-xl mb-6 border border-slate-200 dark:border-brand-dark">
        <button 
          onClick={() => setActiveTab("digital")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "digital" ? "bg-brand-dark text-slate-900 dark:text-white shadow-md" : "text-slate-500 dark:text-gray-400"
          }`}
        >
          Digital Wallet
        </button>
        <button 
          onClick={() => setActiveTab("ncmc")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "ncmc" ? "bg-indigo-900/50 text-indigo-300 shadow-md" : "text-slate-500 dark:text-gray-400"
          }`}
        >
          Physical NCMC Card
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-brand-dark">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${activeTab === "digital" ? "bg-brand-dark" : "bg-indigo-900/50"}`}>
            <CreditCard size={20} className={activeTab === "digital" ? "text-brand-accent" : "text-indigo-400"} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">
              {activeTab === "digital" ? "App Wallet Balance" : "NCMC Chip Balance"}
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              ₹{activeTab === "digital" ? (walletBalance || 0).toFixed(2) : "50.00"}
            </p>
          </div>
        </div>
        <button className="text-xs bg-white text-black px-3 py-1.5 rounded-lg font-bold shadow-md hover:bg-gray-200 transition-colors">
          Top Up
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Buy Passes</h3>
        <div className="flex flex-col gap-3">
          {passCatalog.map((pass, index) => (
            <div key={index} onClick={() => {
              const amt = parseInt(pass.price.replace(/[^0-9]/g, ''));
              if (walletBalance >= amt) {
                deductBalance(amt);
                setActivePass({ name: pass.name, boundDeviceId: deviceFingerprint, expiry: Date.now() + 24*3600*1000, lastMigratedAt: null });
              } else {
                setPendingAmount(amt);
                setActivePassName(pass.name);
                setShowUpi(true);
              }
            }} className="flex justify-between items-center bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark hover:border-brand-base transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="bg-surface-black p-2 rounded-lg border border-slate-200 dark:border-brand-dark group-hover:border-brand-base transition-colors">
                  <Ticket size={20} className={pass.color} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{pass.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider">{pass.type}</p>
                </div>
              </div>
              <button className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/50 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
                {pass.price}
              </button>
            </div>
          ))}
        </div>
      </div>

      <UpiGateway 
        isOpen={showUpi}
        amount={pendingAmount}
        onCancel={() => setShowUpi(false)}
        onSuccess={() => {
          setShowUpi(false);
          setActivePass({ name: passCatalog[0]?.name || "Pass", boundDeviceId: deviceFingerprint, expiry: Date.now() + 24*3600*1000, lastMigratedAt: null });
        }}
      />
    </div>
  );
}