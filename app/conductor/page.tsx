"use client";

import { useState } from "react";
import { Scan, CheckCircle2, XCircle, ShieldCheck, Ticket, Users, RefreshCw, AlertTriangle, Radio, IndianRupee, SmartphoneNfc, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConductorETMV2() {
  const [activeTab, setActiveTab] = useState<"validate" | "cash-sync">("validate");
  
  // Validation State
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ status: "valid" | "invalid" | null; commuterName?: string; route?: string }>({ status: null });
  
  // Shift State
  const [ticketsIssuedCount, setTicketsIssuedCount] = useState(142);
  const [totalRevenue, setTotalRevenue] = useState(2840);
  const [digitalChangeIssued, setDigitalChangeIssued] = useState(0);

  // Cash-to-Digital Sync State
  const [fareAmount, setFareAmount] = useState<number>(20);
  const [cashReceived, setCashReceived] = useState<number>(500);
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);

  const calculateChange = () => Math.max(0, cashReceived - fareAmount);

  const handleSimulateScan = (type: "valid" | "invalid") => {
    setIsScanning(true);
    setTimeout(() => {
      if (type === "valid") {
        setVerificationResult({ status: "valid", commuterName: "Ajay M.", route: "500D (Hebbal ⇄ Silk Board)" });
        setTicketsIssuedCount(prev => prev + 1);
        setTotalRevenue(prev => prev + fareAmount);
      } else {
        setVerificationResult({ status: "invalid", commuterName: "Unknown", route: "Expired Pass" });
      }
      setIsScanning(false);
    }, 800);
  };

  const handleCashToDigitalSync = () => {
    const changeAmount = calculateChange();
    if (changeAmount <= 0) return;

    setIsTransferring(true);
    // Simulate optical scan of commuter's wallet receiver QR & instant cloud transfer
    setTimeout(() => {
      setIsTransferring(false);
      setTransferSuccess(true);
      setDigitalChangeIssued(prev => prev + changeAmount);
      setTotalRevenue(prev => prev + fareAmount); // Only fare adds to revenue
      setTicketsIssuedCount(prev => prev + 1);
      
      setTimeout(() => {
        setTransferSuccess(false);
        setCashReceived(0);
      }, 4000);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 [&>*]:shrink-0">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse"></span>
            <h1 className="text-[10px] uppercase tracking-widest text-brand-light font-bold">Conductor ETM Terminal</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Route 500D</h2>
        </div>
        <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark px-3 py-1.5 rounded-xl shadow-md text-right">
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase block">Device ID</span>
          <span className="text-slate-900 dark:text-white font-mono text-xs">ETM-BLR-042</span>
        </div>
      </div>

      {/* ETM Shift Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">Shift Revenue</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">₹{totalRevenue}</p>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1">Live Synced</span>
        </div>
        <div className="bg-surface-dark p-4 rounded-2xl border border-slate-200 dark:border-surface-dark flex flex-col justify-between">
          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase">Change Dispensed</p>
          <p className="text-3xl font-black text-brand-accent mt-2">₹{digitalChangeIssued}</p>
          <span className="text-[10px] text-brand-light font-semibold mt-1">Via App Wallet</span>
        </div>
      </div>

      {/* Module Toggle */}
      <div className="flex bg-surface-dark p-1 rounded-xl mb-6 border border-slate-200 dark:border-brand-dark">
        <button 
          onClick={() => setActiveTab("validate")}
          className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "validate" ? "bg-brand-dark text-slate-900 dark:text-white shadow-md" : "text-slate-500 dark:text-gray-400"}`}
        >
          <Scan size={16} /> Validate Passes
        </button>
        <button 
          onClick={() => setActiveTab("cash-sync")}
          className={`flex-1 py-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === "cash-sync" ? "bg-indigo-900/50 text-indigo-300 shadow-md" : "text-slate-500 dark:text-gray-400"}`}
        >
          <IndianRupee size={16} /> Cash-to-Digital
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "validate" && (
          <motion.div
            key="validate"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {/* Standard QR/NFC Validator */}
            <div className="bg-surface-dark border border-brand-base p-6 rounded-3xl shadow-lg mb-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-base/10 to-white dark:to-surface-black opacity-40"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-dark rounded-2xl border border-brand-base flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                  <Scan size={32} className="text-brand-accent animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Optical & NFC Pass Validator</h3>
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">Point ETM scanner at commuter's dynamic TOTP QR code.</p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button onClick={() => handleSimulateScan("valid")} disabled={isScanning} className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-bold py-3 rounded-xl text-xs active:scale-95 transition-transform">
                    Simulate Valid Scan
                  </button>
                  <button onClick={() => handleSimulateScan("invalid")} disabled={isScanning} className="bg-red-500/20 border border-red-500 text-red-300 font-bold py-3 rounded-xl text-xs active:scale-95 transition-transform">
                    Simulate Invalid
                  </button>
                </div>
              </div>
            </div>

            {verificationResult.status && !isScanning && (
              <div className={`p-5 rounded-2xl border shadow-xl ${verificationResult.status === "valid" ? "bg-emerald-950/30 border-emerald-500" : "bg-red-950/30 border-red-500"}`}>
                <div className="flex items-center gap-3">
                  {verificationResult.status === "valid" ? <CheckCircle2 size={24} className="text-emerald-400" /> : <XCircle size={24} className="text-red-400" />}
                  <div>
                    <h4 className={`text-base font-black uppercase ${verificationResult.status === "valid" ? "text-emerald-300" : "text-red-300"}`}>
                      {verificationResult.status === "valid" ? "Access Granted" : "Access Denied"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">{verificationResult.commuterName} • {verificationResult.route}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "cash-sync" && (
          <motion.div
            key="cash-sync"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Cash-to-Digital Sync Engine */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-surface-dark to-white dark:to-surface-black border border-indigo-500/50 p-6 rounded-3xl shadow-lg mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-900/50 p-2 rounded-xl text-indigo-400 border border-indigo-500/30">
                  <SmartphoneNfc size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cash-to-Wallet Sync</h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Digitize commuter change instantly.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">Ticket Fare</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-500 dark:text-gray-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      value={fareAmount}
                      onChange={(e) => setFareAmount(Number(e.target.value))}
                      className="w-full bg-surface-black text-slate-900 dark:text-white rounded-xl py-3 pl-8 pr-4 outline-none border border-slate-200 dark:border-surface-dark focus:border-indigo-500 text-lg font-black"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">Cash Note Received</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[50, 100, 200, 500].map(amt => (
                      <button 
                        key={amt}
                        onClick={() => setCashReceived(amt)}
                        className={`py-2 rounded-lg text-xs font-bold border transition-colors ${cashReceived === amt ? "bg-indigo-600 border-indigo-500 text-slate-900 dark:text-white" : "bg-surface-black border-slate-200 dark:border-surface-dark text-slate-500 dark:text-gray-400"}`}
                      >
                        ₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-black/50 p-4 rounded-2xl border border-indigo-900/50 flex justify-between items-center mb-6">
                <div>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Change to Digitize</p>
                  <p className="text-3xl font-black text-indigo-400 mt-1">₹{calculateChange()}</p>
                </div>
                <ArrowRight size={24} className="text-gray-600" />
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">Destination</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">User Wallet</p>
                </div>
              </div>

              {!transferSuccess ? (
                <button
                  onClick={handleCashToDigitalSync}
                  disabled={isTransferring || calculateChange() <= 0}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-xl text-sm shadow-[0_5px_20px_rgba(79,70,229,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isTransferring ? (
                    <span className="animate-pulse flex items-center gap-2">
                      <RefreshCw size={18} className="animate-spin" /> Transferring ₹{calculateChange()}...
                    </span>
                  ) : (
                    <>
                      <Scan size={18} /> Scan User QR to Transfer ₹{calculateChange()}
                    </>
                  )}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-emerald-950/40 border border-emerald-900 text-emerald-400 font-bold py-4 rounded-xl text-sm flex flex-col items-center justify-center gap-2"
                >
                  <CheckCircle2 size={24} />
                  <span>₹{calculateChange()} synced to commuter wallet!</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}