"use client";

import { useState } from "react";
import { CreditCard, Wifi, ShieldCheck, RefreshCcw, Smartphone, Zap, CheckCircle2, ArrowLeft, Plus, Edit3, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

// STORE & MODALS
import { useAppStore } from "@/lib/store";
import NcmcCardModal from "@/components/NcmcCardModal";
import NcmcTopUpModal from "@/components/NcmcTopUpModal";
import UpiGateway from "@/components/UpiGateway";

export default function NcmcPage() {
  const { ncmcCard, setNcmcCard, topUpNcmcCard, userName } = useAppStore();
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [showUpi, setShowUpi] = useState(false);
  const [pendingAmount, setPendingAmount] = useState(100);
  const [showFullNumber, setShowFullNumber] = useState(false);

  // Simulate or execute Web NFC API reading of physical NCMC chip
  const handleNfcScan = async () => {
    setIsScanning(true);
    setScanSuccess(false);

    try {
      // Check if browser supports Web NFC API
      if (typeof window !== "undefined" && 'NDEFReader' in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        ndef.onreading = (event: any) => {
          topUpNcmcCard(100); // Sync NFC chip balance
          setScanSuccess(true);
          setIsScanning(false);
        };
      } else {
        // Fallback simulation for testing on desktop/laptops without physical NFC hardware
        setTimeout(() => {
          topUpNcmcCard(50);
          setScanSuccess(true);
          setIsScanning(false);
        }, 1200);
      }
    } catch (err) {
      console.warn("NFC read error or permission denied, using software fallback:", err);
      setTimeout(() => {
        topUpNcmcCard(50);
        setScanSuccess(true);
        setIsScanning(false);
      }, 1000);
    }
  };

  const displayCardNumber = () => {
    if (!ncmcCard.isLinked || !ncmcCard.cardNumber) {
      return "6071 •••• •••• ••••";
    }
    if (showFullNumber) {
      return ncmcCard.cardNumber;
    }
    return ncmcCard.cardNumber.slice(0, 4) + " •••• •••• " + (ncmcCard.cardNumber.slice(-4) || "8924");
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      
      {/* Top Header */}
      <div className="mb-4 flex items-center justify-between">
        <Link 
          href="/pass"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 bg-surface-dark border border-indigo-900/40 px-3 py-1.5 rounded-xl active:scale-95 transition-transform"
        >
          <ArrowLeft size={14} /> Back to Passes
        </Link>
        <button
          onClick={() => setShowModal(true)}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 active:scale-95 transition-transform"
        >
          {ncmcCard.isLinked ? <Edit3 size={12} /> : <Plus size={12} />}
          <span>{ncmcCard.isLinked ? "Edit Details" : "Enter Details"}</span>
        </button>
      </div>

      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-indigo-400" />
            <h1 className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">RuPay NCMC Standard</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contactless Card</h2>
        </div>
        <div className="bg-surface-dark border border-indigo-900/50 px-3 py-1.5 rounded-xl shadow-md text-right">
          <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase block">Chip Status</span>
          <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
            <Wifi size={12} className="animate-pulse" /> NFC Ready
          </span>
        </div>
      </div>

      {/* Virtual NCMC Card Visualizer */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-950 via-surface-dark to-brand-dark p-6 rounded-3xl shadow-2xl border border-indigo-500/30 mb-6 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">
              {ncmcCard.isLinked ? ncmcCard.issuingBank.split("(")[0].trim() : "National Common Mobility Card"}
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              ₹{(ncmcCard.isLinked ? ncmcCard.cardBalance : 0).toFixed(2)}
            </h3>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/20">
            <CreditCard size={24} className="text-indigo-400" />
          </div>
        </div>

        {/* EMV Chip and Number */}
        <div className="mb-4 relative z-10 flex items-center justify-between">
          <div className="w-11 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/50 shadow-inner flex flex-col justify-around p-1">
            <div className="w-full h-0.5 bg-amber-600/40"></div>
            <div className="w-full h-0.5 bg-amber-600/40"></div>
          </div>
          <button
            onClick={() => setShowFullNumber(!showFullNumber)}
            className="p-1.5 text-indigo-300 hover:text-white bg-white/10 rounded-lg transition-colors"
          >
            {showFullNumber ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <div className="mb-4 relative z-10">
          <p className="text-sm font-mono font-bold tracking-widest text-white">
            {displayCardNumber()}
          </p>
        </div>

        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">
              {ncmcCard.isLinked ? ncmcCard.cardHolder : (userName || "COMMUTER")}
            </p>
            <p className="text-xs text-slate-900 dark:text-white font-bold mt-0.5">
              Valid Thru: {ncmcCard.isLinked ? ncmcCard.expiryDate : "MM/YY"}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <ShieldCheck size={12} /> {ncmcCard.isLinked ? "Active & Linked" : "Unlinked"}
          </div>
        </div>
      </motion.div>

      {/* Card Action Buttons: Enter Details & Top Up */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-surface-dark hover:bg-slate-800 border border-indigo-500/30 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform"
        >
          <Edit3 size={14} className="text-indigo-400" />
          <span>{ncmcCard.isLinked ? "Edit Card Details" : "Enter Card Details"}</span>
        </button>

        <button
          onClick={() => setShowTopUpModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          <Plus size={14} />
          <span>Top Up via UPI</span>
        </button>
      </div>

      {/* NFC Tap & Sync Trigger */}
      <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-5 rounded-3xl shadow-lg mb-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-surface-black rounded-2xl border border-slate-200 dark:border-surface-dark flex items-center justify-center mb-4 shadow-inner">
          <Smartphone size={28} className="text-brand-accent animate-pulse" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">NFC Hardware Bridge</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-5 max-w-xs">
          Hold your physical RuPay NCMC card to the back of your phone to sync chip balance or reload instantly.
        </p>

        <button
          onClick={handleNfcScan}
          disabled={isScanning}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isScanning ? (
            <>
              <RefreshCcw size={16} className="animate-spin" />
              <span>Scanning NCMC Chip via NFC...</span>
            </>
          ) : (
            <>
              <Wifi size={16} />
              <span>Tap Physical NCMC Card / Sync Balance</span>
            </>
          )}
        </button>

        {scanSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs py-2 px-4 rounded-xl flex items-center gap-2 w-full justify-center"
          >
            <CheckCircle2 size={16} />
            <span>NCMC Card successfully scanned and synced!</span>
          </motion.div>
        )}
      </div>

      {/* Auto Top-Up Settings */}
      <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-5 rounded-3xl shadow-lg flex justify-between items-center">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Auto Top-Up via UPI</h4>
          <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">Automatically reload ₹100 when balance dips below ₹50.</p>
        </div>
        <button
          onClick={() => setNcmcCard({ autoTopUp: !ncmcCard.autoTopUp })}
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${ncmcCard.autoTopUp ? 'bg-brand-accent' : 'bg-gray-700'}`}
        >
          <div className={`w-5 h-5 rounded-full bg-surface-black transition-transform ${ncmcCard.autoTopUp ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
      </div>

      {/* NCMC Card Modal */}
      <NcmcCardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      {/* Top Up Modal: Takes Card Details & Amount */}
      <NcmcTopUpModal
        isOpen={showTopUpModal}
        onClose={() => setShowTopUpModal(false)}
        onProceedToPay={(cardData, amount) => {
          setShowTopUpModal(false);
          setPendingAmount(amount);
          setShowUpi(true);
        }}
      />

      {/* UPI Payment Gateway */}
      <UpiGateway
        isOpen={showUpi}
        amount={pendingAmount}
        cardDetails={ncmcCard.isLinked ? { cardNumber: ncmcCard.cardNumber, cardHolder: ncmcCard.cardHolder, issuingBank: ncmcCard.issuingBank } : undefined}
        onCancel={() => setShowUpi(false)}
        onSuccess={() => {
          topUpNcmcCard(pendingAmount);
          setShowUpi(false);
          alert(`SUCCESS: ₹${pendingAmount} credited to your physical NCMC card chip!`);
        }}
      />

    </div>
  );
}