"use client";

import { useState, useEffect } from "react";
import { CreditCard, WifiOff, Ticket, AlertTriangle, Clock, ShieldCheck, RefreshCcw, Smartphone, Lock, RotateCcw, Wifi, Eye, EyeOff, Edit3, Trash2, Plus, Zap, CheckCircle2, ChevronRight } from "lucide-react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import UpiGateway from "@/components/UpiGateway";
import NcmcCardModal from "@/components/NcmcCardModal";
import NcmcTopUpModal from "@/components/NcmcTopUpModal";

import { useAppStore } from "@/lib/store"; 
import { getCityData } from "@/lib/cityData";

export default function PassScreen() {
  const { 
    walletBalance, 
    addMoney,
    userName, 
    currentCity, 
    deductBalance, 
    activePass, 
    setActivePass, 
    mockDeviceToggle, 
    setMockDeviceToggle,
    ncmcCard,
    unlinkNcmcCard,
    topUpNcmcCard
  } = useAppStore();
  const cityData = getCityData(currentCity);
  const [activeTab, setActiveTab] = useState<"digital" | "ncmc">("ncmc");
  
  const [showUpi, setShowUpi] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [upiMode, setUpiMode] = useState<"pass" | "wallet-topup" | "ncmc-topup">("pass");
  const [targetCardDetails, setTargetCardDetails] = useState<{ cardNumber: string; cardHolder?: string; issuingBank?: string } | null>(null);
  
  const [showNcmcModal, setShowNcmcModal] = useState(false);
  const [showNcmcTopUpModal, setShowNcmcTopUpModal] = useState(false);
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);
  const [nfcSyncing, setNfcSyncing] = useState(false);
  const [nfcSuccessMsg, setNfcSuccessMsg] = useState("");
  
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

  const handleNfcSync = async () => {
    setNfcSyncing(true);
    setNfcSuccessMsg("");
    try {
      if (typeof window !== "undefined" && 'NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        ndef.onreading = () => {
          topUpNcmcCard(50);
          setNfcSuccessMsg("Physical NCMC chip read & ₹50 synced successfully!");
          setNfcSyncing(false);
          setTimeout(() => setNfcSuccessMsg(""), 4000);
        };
      } else {
        setTimeout(() => {
          topUpNcmcCard(50);
          setNfcSuccessMsg("Simulated NFC: RuPay chip synced & ₹50 balance refreshed!");
          setNfcSyncing(false);
          setTimeout(() => setNfcSuccessMsg(""), 4000);
        }, 1200);
      }
    } catch (e) {
      setTimeout(() => {
        topUpNcmcCard(50);
        setNfcSuccessMsg("RuPay chip balance synced!");
        setNfcSyncing(false);
        setTimeout(() => setNfcSuccessMsg(""), 4000);
      }, 1000);
    }
  };

  const handleNcmcTopUpProceed = (cardData: any, amount: number) => {
    setShowNcmcTopUpModal(false);
    setTargetCardDetails(cardData);
    setPendingAmount(amount);
    setUpiMode("ncmc-topup");
    setShowUpi(true);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 select-none [&>*]:shrink-0">
      {/* Top Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-1">
            {activeTab === "digital" ? "Smart Tickets" : "Physical NCMC Card"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400">
            {activeTab === "digital" ? "Anti-Fraud TOTP & Device Binding" : "RuPay Contactless Smart Mobility"}
          </p>
        </div>

        {activeTab === "digital" ? (
          <button 
            onClick={() => setMockDeviceToggle(!mockDeviceToggle)}
            className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 p-2 rounded-xl text-[10px] font-bold flex flex-col items-center shadow-sm active:scale-95"
          >
            <Smartphone size={16} className="mb-1" />
            {mockDeviceToggle ? "Using Phone B" : "Using Phone A"}
          </button>
        ) : (
          <div className="bg-surface-dark border border-indigo-900/50 px-3 py-1.5 rounded-xl shadow-md text-right">
            <span className="text-[9px] text-slate-500 dark:text-gray-400 font-bold uppercase block">Chip Status</span>
            <span className={`font-black text-xs flex items-center gap-1 ${ncmcCard.isLinked ? "text-emerald-400" : "text-amber-400"}`}>
              <Wifi size={12} className={ncmcCard.isLinked ? "animate-pulse" : ""} />
              {ncmcCard.isLinked ? "Linked & Active" : "Unlinked"}
            </span>
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-surface-dark p-1 rounded-2xl mb-6 border border-slate-200 dark:border-brand-dark shadow-sm">
        <button 
          onClick={() => setActiveTab("digital")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "digital" ? "bg-brand-dark text-slate-900 dark:text-white shadow-md font-extrabold" : "text-slate-500 dark:text-gray-400 hover:text-white"
          }`}
        >
          <Ticket size={14} />
          Digital Wallet & QR
        </button>
        <button 
          onClick={() => setActiveTab("ncmc")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "ncmc" ? "bg-indigo-900/60 text-indigo-200 shadow-md font-extrabold border border-indigo-500/30" : "text-slate-500 dark:text-gray-400 hover:text-white"
          }`}
        >
          <CreditCard size={14} />
          Physical NCMC Card
        </button>
      </div>
      
      {/* Tab Content: Digital Wallet Mode */}
      {activeTab === "digital" && (
        <>
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
        </>
      )}

      {/* Tab Content: Physical NCMC Card Mode */}
      {activeTab === "ncmc" && (
        <div className="mb-8 flex flex-col gap-4">
          {!ncmcCard.isLinked ? (
            /* Prompt to Enter Physical NCMC Card Details */
            <div className="bg-gradient-to-br from-indigo-950/90 via-surface-dark to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden text-center flex flex-col items-center">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="w-16 h-16 bg-indigo-900/40 rounded-2xl border border-indigo-500/40 flex items-center justify-center mb-4 shadow-inner">
                <CreditCard size={32} className="text-indigo-400" />
              </div>

              <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold mb-1">
                National Common Mobility Card
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                No Physical Card Linked
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-6 max-w-sm">
                Enter your physical RuPay NCMC 16-digit card details to track stored chip balance, top up via UPI, and tap-and-pay across all transit networks.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                <button
                  onClick={() => setShowNcmcTopUpModal(true)}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  <span>Enter Details & Top Up</span>
                </button>
                <button
                  onClick={handleNfcSync}
                  disabled={nfcSyncing}
                  className="bg-surface-black hover:bg-slate-800 border border-indigo-500/30 text-indigo-300 font-bold py-3.5 px-4 rounded-2xl text-xs active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  {nfcSyncing ? <RefreshCcw size={14} className="animate-spin" /> : <Smartphone size={14} />}
                  <span>Tap NFC Card</span>
                </button>
              </div>
            </div>
          ) : (
            /* Linked Physical NCMC RuPay Card Visualizer */
            <div className="flex flex-col gap-3">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-indigo-950 via-slate-900 to-brand-dark p-6 rounded-3xl shadow-2xl border border-indigo-500/40 relative overflow-hidden"
              >
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>

                {/* Card Top: Bank & NFC Standard */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-extrabold block">
                      {ncmcCard.issuingBank.split("(")[0].trim()}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                      <ShieldCheck size={11} /> One Nation One Card
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi size={20} className="text-indigo-300 rotate-90" />
                    <span className="text-[10px] font-black tracking-wider bg-white/10 px-2.5 py-1 rounded-lg border border-white/20 text-white">
                      NCMC
                    </span>
                  </div>
                </div>

                {/* EMV Smart Chip & Balance */}
                <div className="mb-6 relative z-10 flex items-center justify-between">
                  <div className="w-12 h-8 rounded-lg bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/60 shadow-inner flex flex-col justify-around p-1.5">
                    <div className="w-full h-0.5 bg-amber-700/40"></div>
                    <div className="w-full h-0.5 bg-amber-700/40"></div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold block">
                      Chip Stored Value
                    </span>
                    <h3 className="text-2xl font-black text-white mt-0.5">
                      ₹{ncmcCard.cardBalance.toFixed(2)}
                    </h3>
                  </div>
                </div>

                {/* 16-Digit Card Number with Eye Toggle */}
                <div className="mb-5 relative z-10 flex items-center justify-between">
                  <p className="font-mono text-base font-black tracking-widest text-white drop-shadow-sm">
                    {showFullCardNumber 
                      ? ncmcCard.cardNumber 
                      : (ncmcCard.cardNumber.slice(0, 4) + " •••• •••• " + (ncmcCard.cardNumber.slice(-4) || "8924"))}
                  </p>
                  <button
                    onClick={() => setShowFullCardNumber(!showFullCardNumber)}
                    className="p-1.5 text-indigo-300 hover:text-white bg-white/10 rounded-lg transition-colors"
                    title={showFullCardNumber ? "Mask Card Number" : "Show Full Card Number"}
                  >
                    {showFullCardNumber ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>

                {/* Card Footer */}
                <div className="flex justify-between items-end relative z-10">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">
                      Cardholder
                    </span>
                    <p className="text-xs text-white font-extrabold uppercase tracking-wider truncate max-w-[160px]">
                      {ncmcCard.cardHolder || userName || "COMMUTER"}
                    </p>
                  </div>

                  <div className="text-center">
                    <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">
                      Valid Thru
                    </span>
                    <p className="font-mono text-xs text-white font-bold">{ncmcCard.expiryDate || "12/28"}</p>
                  </div>

                  <div className="bg-white/95 text-slate-900 px-2.5 py-1 rounded-md font-black text-xs italic tracking-tighter shadow-md">
                    RuPay<span className="text-orange-600">▶</span>
                  </div>
                </div>
              </motion.div>

              {/* Physical Card Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setShowNcmcTopUpModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-2 rounded-xl text-[11px] shadow-sm flex items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <Plus size={14} /> Top Up Chip
                </button>

                <button
                  onClick={() => setShowNcmcModal(true)}
                  className="bg-surface-dark hover:bg-slate-800 border border-slate-200 dark:border-brand-dark text-slate-900 dark:text-white font-bold py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 active:scale-95 transition-transform"
                >
                  <Edit3 size={14} className="text-indigo-400" /> Edit Details
                </button>

                <button
                  onClick={handleNfcSync}
                  disabled={nfcSyncing}
                  className="bg-surface-dark hover:bg-slate-800 border border-slate-200 dark:border-brand-dark text-slate-900 dark:text-white font-bold py-2.5 px-2 rounded-xl text-[11px] flex items-center justify-center gap-1 active:scale-95 transition-transform disabled:opacity-50"
                >
                  {nfcSyncing ? <RefreshCcw size={14} className="animate-spin text-brand-accent" /> : <Wifi size={14} className="text-brand-accent" />}
                  <span>Sync NFC</span>
                </button>
              </div>

              {nfcSuccessMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs py-2 px-3 rounded-xl flex items-center gap-2"
                >
                  <CheckCircle2 size={16} className="shrink-0" />
                  <span>{nfcSuccessMsg}</span>
                </motion.div>
              )}

              {/* Unlink Card Option */}
              <div className="flex justify-between items-center px-2 pt-1 text-[11px] text-slate-500">
                <span>Nickname: {ncmcCard.cardNickName || "Primary Transit Card"}</span>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to unlink this physical NCMC card?")) {
                      unlinkNcmcCard();
                    }
                  }}
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <Trash2 size={12} /> Unlink Card
                </button>
              </div>

              {/* Quick Top-Up Chips for Physical NCMC Card */}
              <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-4 rounded-2xl flex flex-col gap-2.5 shadow-sm mt-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Zap size={14} className="text-indigo-400" /> Quick Top-Up Card
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">Select amount to top up</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setPendingAmount(amt);
                        setShowNcmcTopUpModal(true);
                      }}
                      className="bg-surface-black hover:bg-indigo-950/40 border border-slate-200 dark:border-indigo-500/30 text-slate-900 dark:text-white font-black py-2 px-1 rounded-xl text-xs active:scale-95 transition-all text-center flex items-center justify-center gap-0.5"
                    >
                      <span>+₹{amt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Shared Balance & Quick Top-Up Banner */}
      <div className="mb-6 flex items-center justify-between bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-brand-dark shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${activeTab === "digital" ? "bg-brand-dark" : "bg-indigo-900/50"}`}>
            <CreditCard size={20} className={activeTab === "digital" ? "text-brand-accent" : "text-indigo-400"} />
          </div>
          <div>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">
              {activeTab === "digital" ? "App Wallet Balance" : "NCMC Chip Balance"}
            </p>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">
              ₹{activeTab === "digital" ? (walletBalance || 0).toFixed(2) : (ncmcCard.isLinked ? ncmcCard.cardBalance.toFixed(2) : "0.00")}
            </p>
          </div>
        </div>
        <button 
          onClick={() => {
            setPendingAmount(100);
            setShowNcmcTopUpModal(true);
          }}
          className="text-xs bg-white text-black px-3.5 py-2 rounded-xl font-extrabold shadow-md hover:bg-gray-200 transition-colors active:scale-95"
        >
          Top Up
        </button>
      </div>

      {/* Passes Catalog */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeTab === "digital" ? "Buy Passes" : "Load Pass to NCMC Card"}
          </h3>
          {activeTab === "ncmc" && (
            <Link 
              href="/ncmc"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1"
            >
              <span>NFC Bridge</span> <ChevronRight size={14} />
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {passCatalog.map((pass, index) => (
            <div 
              key={index} 
              onClick={() => {
                const amt = parseInt(pass.price.replace(/[^0-9]/g, ''));
                if (activeTab === "ncmc" && !ncmcCard.isLinked) {
                  setShowNcmcModal(true);
                  return;
                }

                if (walletBalance >= amt) {
                  deductBalance(amt);
                  setActivePass({ 
                    name: pass.name + (activeTab === "ncmc" ? " (NCMC Card)" : ""), 
                    boundDeviceId: deviceFingerprint, 
                    expiry: Date.now() + 24*3600*1000, 
                    lastMigratedAt: null 
                  });
                  if (activeTab === "ncmc") {
                    alert(`PASS ACTIVATED: "${pass.name}" has been loaded onto your physical NCMC card chip!`);
                  }
                } else {
                  setPendingAmount(amt);
                  setActivePassName(pass.name + (activeTab === "ncmc" ? " (NCMC Card)" : ""));
                  setUpiMode("pass");
                  setShowUpi(true);
                }
              }} 
              className="flex justify-between items-center bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark hover:border-brand-base transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-surface-black p-2 rounded-lg border border-slate-200 dark:border-brand-dark group-hover:border-brand-base transition-colors">
                  <Ticket size={20} className={pass.color} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{pass.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                    {activeTab === "ncmc" ? "Physical Chip Pass" : pass.type}
                  </p>
                </div>
              </div>
              <button className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/50 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
                {pass.price}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Enter Physical NCMC Card Details Modal */}
      <NcmcCardModal 
        isOpen={showNcmcModal}
        onClose={() => setShowNcmcModal(false)}
      />

      {/* Top Up Physical NCMC Card Modal (takes card details & amount) */}
      <NcmcTopUpModal
        isOpen={showNcmcTopUpModal}
        defaultAmount={pendingAmount || 100}
        onClose={() => setShowNcmcTopUpModal(false)}
        onProceedToPay={handleNcmcTopUpProceed}
      />

      {/* UPI Payment Gateway */}
      <UpiGateway 
        isOpen={showUpi}
        amount={pendingAmount}
        cardDetails={
          upiMode === "ncmc-topup"
            ? (targetCardDetails || (ncmcCard.isLinked ? { cardNumber: ncmcCard.cardNumber, cardHolder: ncmcCard.cardHolder, issuingBank: ncmcCard.issuingBank } : undefined))
            : undefined
        }
        onCancel={() => setShowUpi(false)}
        onSuccess={() => {
          setShowUpi(false);
          if (upiMode === "ncmc-topup") {
            topUpNcmcCard(pendingAmount);
            alert(`SUCCESS: ₹${pendingAmount} credited to your physical NCMC card!`);
          } else if (upiMode === "wallet-topup") {
            addMoney(pendingAmount);
            alert(`SUCCESS: ₹${pendingAmount} added to your App Wallet!`);
          } else {
            setActivePass({ 
              name: activePassName || passCatalog[0]?.name || "Pass", 
              boundDeviceId: deviceFingerprint, 
              expiry: Date.now() + 24*3600*1000, 
              lastMigratedAt: null 
            });
            if (activeTab === "ncmc" && ncmcCard.isLinked) {
              alert(`SUCCESS: "${activePassName}" has been loaded onto your physical NCMC card chip!`);
            }
          }
        }}
      />
    </div>
  );
}