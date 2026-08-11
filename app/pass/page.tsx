"use client";

import { useState } from "react";
import { CreditCard, WifiOff, Ticket, AlertTriangle, Clock } from "lucide-react";
import { useAppStore } from "../../src/lib/store"; 
import LiveQrTicket from "../../components/LiveQrTicket"; 
import { generateProvisionalPass, ProvisionalTicket } from "../../src/lib/provisionalEngine";

export default function PassScreen() {
  const { walletBalance } = useAppStore();
  const [activeTab, setActiveTab] = useState("digital");
  
  const [provisionalPass, setProvisionalPass] = useState<ProvisionalTicket | null>(null);

  const passCatalog = [
    { name: "Ordinary Day Pass", price: "₹80", type: "BMTC", color: "text-brand-accent" },
    { name: "Vajra AC Day Pass", price: "₹140", type: "AC", color: "text-indigo-400" },
    { name: "Ordinary Monthly", price: "₹1,200", type: "BMTC", color: "text-brand-accent" },
  ];

  const handleUpiHangSimulation = () => {
    const emergencyPass = generateProvisionalPass("500D", 20);
    setProvisionalPass(emergencyPass);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Smart Tickets</h1>
          <p className="text-xs text-gray-400">Zero-network boarding & NCMC Sync</p>
        </div>
        
        <button 
          onClick={handleUpiHangSimulation}
          className="bg-alert-orange/20 border border-alert-orange text-alert-orange text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 transition-transform"
        >
          <AlertTriangle size={12} /> Force UPI Hang
        </button>
      </div>

      {provisionalPass ? (
        <div className="mb-8 relative">
          <div className="bg-alert-orange/10 border-2 border-alert-orange p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4 bg-alert-orange px-3 py-1 rounded-full text-surface-black font-black text-[10px] uppercase tracking-wider">
              <Clock size={12} /> Provisional 1-Hour Pass
            </div>
            
            <h2 className="text-white font-bold text-xl mb-1">Route {provisionalPass.route}</h2>
            <p className="text-alert-orange text-xs font-mono mb-4">ID: {provisionalPass.id}</p>
            
            <div className="w-full bg-surface-black p-3 rounded-xl border border-alert-orange/30 text-center mb-2">
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
              className="text-gray-400 text-[10px] mt-3 underline underline-offset-2"
            >
              Cancel Ticket
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 relative">
          <div className="bg-surface-dark border border-brand-base p-6 rounded-3xl shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-base/20 to-surface-black opacity-50"></div>
            
            <div className="relative z-10 flex flex-col items-center w-full">
              <div className="flex items-center gap-2 mb-4 bg-brand-dark px-3 py-1 rounded-full border border-brand-base">
                <WifiOff size={12} className="text-brand-accent" />
                <span className="text-[10px] font-bold tracking-wider text-brand-accent uppercase">
                  Offline Mode Active
                </span>
              </div>

              <LiveQrTicket route="500D" />
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
              ₹{activeTab === "digital" ? walletBalance.toFixed(2) : "50.00"}
            </p>
          </div>
        </div>
        <button className="text-xs bg-white text-surface-black px-3 py-1.5 rounded-lg font-bold shadow-md hover:bg-gray-200 transition-colors">
          Top Up
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3">Buy Passes</h3>
        <div className="flex flex-col gap-3">
          {passCatalog.map((pass, index) => (
            <div key={index} className="flex justify-between items-center bg-surface-dark p-4 rounded-2xl border border-surface-dark hover:border-brand-base transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-surface-black p-2 rounded-lg border border-brand-dark">
                  <Ticket size={20} className={pass.color} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{pass.name}</h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">{pass.type}</p>
                </div>
              </div>
              <button className="bg-brand-dark text-brand-accent text-xs font-bold px-3 py-1.5 rounded-lg border border-brand-base active:scale-95 transition-transform">
                {pass.price}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}