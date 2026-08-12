"use client";

import { useState } from "react";
import { User, MapPin, ShieldCheck, Leaf, Medal, Receipt, ChevronRight, ScanFace, Upload, CheckCircle2, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";

export default function ProfileScreen() {
  const { userName, carbonSavedGrams, karmaPoints } = useAppStore();
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Simulated AI OCR Data Extraction
  const [scannedData, setScannedData] = useState<{name: string; dob: string; college: string; university: string; status: string} | null>(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    
    // Simulate API delay for OCR Processing
    setTimeout(() => {
      setScannedData({
        name: "Ajay M.",
        dob: "07-07-2007",
        college: "East West College of Engineering",
        university: "Visvesvaraya Technological University (VTU)",
        status: "Eligible for 75% BMTC Concession"
      });
      setIsScanning(false);
      setIsVerified(true);
    }, 2500);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 [&>*]:shrink-0">
      
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <User size={28} className="text-white" />
        <div>
          <h2 className="text-3xl font-extrabold text-white">My Profile</h2>
          <p className="text-xs text-gray-400">Manage identity, passes, and transit impact</p>
        </div>
      </div>

      {/* Identity Card */}
      <div className="bg-surface-dark border border-brand-dark p-5 rounded-3xl shadow-lg mb-6 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-16 h-16 rounded-full border-2 border-brand-accent flex items-center justify-center bg-surface-black relative z-10 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
          <User size={32} className="text-brand-light" />
        </div>
        
        <div className="relative z-10">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            {userName || "Guest Commuter"} <ShieldCheck size={16} className="text-emerald-400" />
          </h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <MapPin size={12} className="text-brand-accent" /> Yelahanka, Bengaluru
          </p>
        </div>
      </div>

      {/* Verification Banner */}
      {!isVerified ? (
        <button 
          onClick={() => setShowScanner(true)}
          className="w-full bg-gradient-to-r from-indigo-900 to-indigo-950 border border-indigo-500/50 p-4 rounded-2xl shadow-lg mb-6 flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-300 group-hover:text-white transition-colors">
              <ScanFace size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-indigo-100">Verify Student ID</h4>
              <p className="text-[10px] text-indigo-300">Unlock 75% BMTC & Metro Concessions</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <div className="w-full bg-emerald-950/40 border border-emerald-500/50 p-4 rounded-2xl shadow-lg mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-emerald-100">Student Concession Active</h4>
              <p className="text-[10px] text-emerald-300">ID Validated via e-KYC OCR</p>
            </div>
          </div>
        </div>
      )}

      {/* Transit Impact Stats */}
      <h3 className="text-lg font-bold text-white mb-3">Your Transit Impact</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface-dark border border-brand-dark p-4 rounded-2xl flex flex-col justify-between">
          <div className="bg-emerald-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-2">
            <Leaf size={16} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">
            {(carbonSavedGrams / 1000).toFixed(1)} <span className="text-sm text-gray-400 font-bold">kg</span>
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Carbon Offset</p>
        </div>
        
        <div className="bg-surface-dark border border-brand-dark p-4 rounded-2xl flex flex-col justify-between">
          <div className="bg-amber-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-2">
            <Medal size={16} className="text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white mt-1">
            {karmaPoints} <span className="text-sm text-gray-400 font-bold">pts</span>
          </p>
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1">Rank: Bronze</p>
        </div>
      </div>

      {/* Action List */}
      <div className="flex flex-col gap-3">
        <button className="bg-surface-dark border border-surface-dark hover:border-brand-dark p-4 rounded-2xl flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <Receipt size={18} className="text-gray-400" />
            <span className="text-sm font-bold text-white">Ride History & Receipts</span>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      {/* AI e-KYC Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-surface-dark border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>

              {!isVerified ? (
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-16 h-16 bg-indigo-900/40 rounded-2xl border border-indigo-500/50 flex items-center justify-center mb-4 relative overflow-hidden">
                    {isScanning && <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>}
                    <ScanFace size={32} className="text-indigo-400 relative z-10" />
                  </div>
                  
                  <h3 className="text-xl font-black text-white mb-2">
                    {isScanning ? "Analyzing ID..." : "Upload Institutional ID"}
                  </h3>
                  <p className="text-xs text-gray-400 mb-6">
                    Our AI will extract your details to instantly provision your student transit pass.
                  </p>

                  {isScanning ? (
                    <div className="flex flex-col items-center gap-3 w-full bg-surface-black p-4 rounded-xl border border-surface-dark">
                      <Loader2 size={24} className="text-indigo-400 animate-spin" />
                      <span className="text-xs text-indigo-300 font-mono">Running OCR Neural Net...</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSimulateScan}
                      className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <Upload size={18} />
                      Capture / Upload ID Card
                    </button>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center mt-2"
                >
                  <div className="w-16 h-16 bg-emerald-900/40 rounded-full border border-emerald-500 flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">ID Verified Successfully</h3>
                  <p className="text-xs text-emerald-400 mb-6">Concession framework active.</p>

                  <div className="w-full bg-surface-black p-4 rounded-xl border border-surface-dark text-left flex flex-col gap-2">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Commuter Name</span>
                      <p className="text-sm font-bold text-white">{scannedData?.name}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Date of Birth</span>
                      <p className="text-sm font-bold text-white">{scannedData?.dob}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Institution</span>
                      <p className="text-sm font-bold text-white">{scannedData?.college}</p>
                      <p className="text-[10px] text-gray-400">{scannedData?.university}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowScanner(false)}
                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl text-sm active:scale-95 transition-transform mt-4"
                  >
                    Return to Profile
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}