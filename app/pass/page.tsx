"use client";

import { useState, useEffect } from "react";
import { CreditCard, WifiOff, Ticket, AlertTriangle, Clock, ShieldCheck, RefreshCcw, Smartphone } from "lucide-react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";

// ABSOLUTE ALIAS PATHS
import { useAppStore } from "@/lib/store"; 

interface ProvisionalTicket {
  id: string;
  route: string;
  originalFare: number;
}

const generateProvisionalPass = (route: string, fare: number): ProvisionalTicket => ({
  id: `UPI-HANG-${Math.floor(10000 + Math.random() * 90000)}`,
  route,
  originalFare: fare
});

export default function PassScreen() {
  const { walletBalance, userName } = useAppStore();
  const [activeTab, setActiveTab] = useState("digital");
  const [provisionalPass, setProvisionalPass] = useState<ProvisionalTicket | null>(null);
  
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  const [qrPayload, setQrPayload] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  // Hologram tilt coordinates
  const [tilt, setTilt] = useState({ x: 50, y: 50 });
  const [deviceFingerprint, setDeviceFingerprint] = useState("BV-BINDING-PENDING");

  const passCatalog = [
    { name: "Ordinary Day Pass", price: "₹80", type: "BMTC", color: "text-brand-accent" },
    { name: "Vajra AC Day Pass", price: "₹140", type: "AC", color: "text-indigo-400" },
    { name: "Ordinary Monthly", price: "₹1,200", type: "BMTC", color: "text-brand-accent" },
  ];

  const handleUpiHangSimulation = () => {
    const emergencyPass = generateProvisionalPass("500D", 20);
    setProvisionalPass(emergencyPass);
  };

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
    setDeviceFingerprint(`BV-DEV-${Math.abs(hash).toString(16).toUpperCase()}`);

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
      const rawString = `BMTC-SECURE-${safeUserName}-${deviceFingerprint}-${timeStep}-${isOnline ? 'ONLINE' : 'OFFLINE'}`;
      
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

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 select-none [&>*]:shrink-0">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Smart Tickets</h1>
          <p className="text-xs text-gray-400">Anti-Fraud TOTP & Device Binding</p>
        </div>
        
        <button 
          onClick={handleUpiHangSimulation}
          className="bg-amber-900/20 border border-amber-500 text-amber-500 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
        >
          <AlertTriangle size={12} /> Force UPI Hang
        </button>
      </div>

      {provisionalPass ? (
        <div className="mb-8 relative">
          <div className="bg-amber-950/40 border-2 border-amber-500 p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 bg-amber-500 px-3 py-1 rounded-full text-black font-black text-[10px] uppercase tracking-wider">
              <Clock size={12} /> Provisional 1-Hour Pass
            </div>
            
            <h2 className="text-white font-bold text-xl mb-1">Route {provisionalPass.route}</h2>
            <p className="text-amber-500 text-xs font-mono mb-4">ID: {provisionalPass.id}</p>
            
            <div className="w-full bg-black/50 p-3 rounded-xl border border-amber-500/30 text-center mb-2">
              <p className="text-gray-300 text-xs leading-relaxed">
                Your UPI payment is currently hanging due to bank network issues. 
                <strong className="text-white"> You are authorized to travel.</strong>
              </p>
            </div>
            
            <p className="text-gray-400 text-[10px] mt-2">
              Backend will resolve ₹{provisionalPass.originalFare} fare automatically.
            </p>
            
            <button 
              onClick={() => setProvisionalPass(null)}
              className="text-gray-400 hover:text-white transition-colors text-[10px] mt-3 underline underline-offset-2"
            >
              Cancel Ticket
            </button>
          </div>
        </div>
      ) : (
        /* HOLOGRAPHIC ANTI-FRAUD PASS CONTAINER */
        <div 
          onMouseMove={handleMouseMove}
          className="mb-8 relative rounded-3xl overflow-hidden shadow-2xl border border-brand-base"
        >
          {/* Dynamic Holographic Foil Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none z-30 opacity-30 mix-blend-color-dodge transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${tilt.x}% ${tilt.y}%, rgba(20,184,166,0.8) 0%, rgba(59,130,246,0.4) 30%, transparent 70%)`
            }}
          />

          {/* Moving Anti-Piracy Watermark */}
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden opacity-5">
            <p className="text-white font-black text-4xl rotate-[-30deg] uppercase tracking-widest whitespace-nowrap">
              BHARAT VISION VERIFIED • {userName || "COMMUTER"} •
            </p>
          </div>

          <div className="bg-surface-dark p-6 relative z-10 flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-base/20 to-surface-black opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center w-full">
              
              <div className="flex items-center justify-between w-full mb-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isOnline ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400' : 'bg-brand-dark border-brand-base text-brand-accent'}`}>
                  {isOnline ? <ShieldCheck size={12} /> : <WifiOff size={12} />}
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    {isOnline ? "SHA-256 TOTP Active" : "Offline Cryptographic Trust"}
                  </span>
                </div>
                
                <span className="text-[9px] font-mono text-gray-400 flex items-center gap-1">
                  <Smartphone size={10} /> {deviceFingerprint}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl mb-4 w-full flex justify-center items-center h-[232px] shadow-inner">
                {qrPayload ? (
                  <QRCode value={qrPayload} size={200} level="H" />
                ) : (
                  <RefreshCcw className="animate-spin text-gray-300" size={32} />
                )}
              </div>
              
              <div className="w-full flex justify-between items-center bg-surface-black p-3 rounded-xl border border-surface-dark">
                <span className="text-xs font-bold text-gray-300 uppercase">{userName || "Commuter"}</span>
                <span className="text-xs font-mono text-brand-accent tabular-nums">
                  {time.toLocaleTimeString('en-IN', { hour12: true })}
                </span>
              </div>
              
            </div>
          </div>
        </div>
      )}

      <div className="flex bg-surface-dark p-1 rounded-xl mb-6 border border-brand-dark">
        <button 
          onClick={() => setActiveTab("digital")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "digital" ? "bg-brand-dark text-white shadow-md" : "text-gray-400"
          }`}
        >
          Digital Wallet
        </button>
        <button 
          onClick={() => setActiveTab("ncmc")}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "ncmc" ? "bg-indigo-900/50 text-indigo-300 shadow-md" : "text-gray-400"
          }`}
        >
          Physical NCMC Card
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between bg-surface-dark p-4 rounded-2xl border border-brand-dark">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${activeTab === "digital" ? "bg-brand-dark" : "bg-indigo-900/50"}`}>
            <CreditCard size={20} className={activeTab === "digital" ? "text-brand-accent" : "text-indigo-400"} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {activeTab === "digital" ? "App Wallet Balance" : "NCMC Chip Balance"}
            </p>
            <p className="text-xl font-extrabold text-white">
              ₹{activeTab === "digital" ? (walletBalance || 0).toFixed(2) : "50.00"}
            </p>
          </div>
        </div>
        <button className="text-xs bg-white text-black px-3 py-1.5 rounded-lg font-bold shadow-md hover:bg-gray-200 transition-colors">
          Top Up
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3">Buy Passes</h3>
        <div className="flex flex-col gap-3">
          {passCatalog.map((pass, index) => (
            <div key={index} className="flex justify-between items-center bg-surface-dark p-4 rounded-2xl border border-surface-dark hover:border-brand-base transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="bg-surface-black p-2 rounded-lg border border-brand-dark group-hover:border-brand-base transition-colors">
                  <Ticket size={20} className={pass.color} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{pass.name}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{pass.type}</p>
                </div>
              </div>
              <button className="bg-brand-dark text-brand-accent text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-base group-hover:bg-brand-base group-hover:text-black transition-colors">
                {pass.price}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}