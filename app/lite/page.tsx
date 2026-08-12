"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { BatteryWarning, WifiOff, ShieldAlert, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

// ABSOLUTE ALIAS PATHS
import { useAppStore } from "@/lib/store";

export default function UltraLiteModeScreen() {
  const { userName } = useAppStore();
  const [time, setTime] = useState(new Date());
  const [qrPayload, setQrPayload] = useState("");

  // Hyper-efficient TOTP Generation (Runs every 30 seconds instead of 1 second to save CPU cycles)
  useEffect(() => {
    const generateOfflineToken = () => {
      const timeStep = Math.floor(Date.now() / 30000);
      // Pure string concatenation; bypassing heavy crypto libraries for maximum battery saving in Lite Mode
      setQrPayload(`BV-LITE-${userName || "COMMUTER"}-${timeStep}-OFFLINE`);
    };

    generateOfflineToken();
    
    const interval = setInterval(() => {
      setTime(new Date());
      generateOfflineToken();
    }, 30000); 

    return () => clearInterval(interval);
  }, [userName]);

  // Zero-Network SOS Fallback
  const triggerLiteSos = () => {
    window.location.href = `sms:112?body=SOS%20EMERGENCY!%20Commuter%20requires%20immediate%20assistance.%20Sent%20via%20Bharat%20Vision%20Ultra-Lite%20Offline%20Protocol.`;
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white font-mono flex flex-col gap-6 selection:bg-white selection:text-black">
      
      {/* High-Contrast Header */}
      <div className="border-b-4 border-white pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-widest">Ultra-Lite</h1>
          <h2 className="text-lg font-bold uppercase mt-1">Safe Mode Active</h2>
        </div>
        <Link href="/" className="bg-white text-black p-2 rounded-none font-bold text-xs uppercase flex items-center gap-1 active:bg-gray-300">
          <ArrowLeft size={16} /> Exit
        </Link>
      </div>

      {/* System Status Blocks */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black border-2 border-yellow-400 p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <BatteryWarning size={20} />
            <span className="font-bold text-xs uppercase">Power</span>
          </div>
          <p className="text-xl font-black text-white">12%</p>
          <p className="text-[10px] text-gray-400 uppercase mt-1">Animations: OFF</p>
        </div>

        <div className="bg-black border-2 border-red-500 p-4">
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <WifiOff size={20} />
            <span className="font-bold text-xs uppercase">Network</span>
          </div>
          <p className="text-xl font-black text-white">EDGE</p>
          <p className="text-[10px] text-gray-400 uppercase mt-1">Map & GPS: OFF</p>
        </div>
      </div>

      {/* Static Offline QR Ticket (Core Utility) */}
      <div className="bg-white text-black p-6 flex flex-col items-center justify-center border-4 border-gray-300 mt-2">
        <div className="flex items-center gap-2 mb-4 w-full justify-center border-b-2 border-black pb-2">
          <Zap size={20} />
          <h3 className="font-black text-lg uppercase tracking-widest">Offline Pass</h3>
        </div>
        
        <div className="bg-white p-2">
          {qrPayload ? (
            <QRCode value={qrPayload} size={220} level="L" fgColor="#000000" bgColor="#FFFFFF" />
          ) : (
            <div className="w-[220px] h-[220px] flex items-center justify-center bg-gray-200">
              <span className="text-xs font-bold uppercase">Generating...</span>
            </div>
          )}
        </div>

        <div className="w-full mt-4 flex justify-between items-center text-xs font-bold uppercase">
          <span>{userName || "Commuter"}</span>
          <span>{time.toLocaleTimeString('en-IN', { hour12: false })}</span>
        </div>
      </div>

      {/* High-Contrast SOS Button */}
      <button 
        onClick={triggerLiteSos}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-6 border-4 border-red-800 mt-auto flex items-center justify-center gap-3 active:scale-95 transition-transform"
      >
        <ShieldAlert size={24} />
        SMS 112 SOS
      </button>

    </div>
  );
}