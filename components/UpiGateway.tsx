"use client";

import { useState } from "react";
import { ShieldCheck, Zap, X, RefreshCw, Smartphone, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface UpiGatewayProps {
  isOpen: boolean;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
  cardDetails?: {
    cardNumber: string;
    cardHolder?: string;
    issuingBank?: string;
  };
}

export default function UpiGateway({ isOpen, amount, onSuccess, onCancel, cardDetails }: UpiGatewayProps) {
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0); // 0 = default, 1 = verifying

  if (!isOpen) return null;

  const handleLiveCheckout = () => {
    setLoading(true);
    setVerificationStep(1);

    // Simulate backend payment verification against the UPI provider
    setTimeout(() => {
      setLoading(false);
      setVerificationStep(0);
      onSuccess();
    }, 3500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-brand-base rounded-3xl p-6 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Close Button */}
          <button 
            onClick={onCancel}
            disabled={loading}
            className="absolute top-5 right-5 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white transition-colors disabled:opacity-30"
          >
            <X size={20} />
          </button>

          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap size={16} className="text-brand-accent" />
            <span className="text-[10px] uppercase tracking-widest text-brand-dark dark:text-brand-light font-bold">Manual UPI Gateway</span>
          </div>
          
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Pay to Recharge</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">Scan using any UPI App (Paytm, PhonePe, GPay)</p>

          {/* Target NCMC Card Display */}
          {cardDetails && cardDetails.cardNumber && (
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/40 p-3 rounded-2xl mb-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <CreditCard size={18} />
                </div>
                <div>
                  <p className="text-[9px] text-indigo-500 dark:text-indigo-300 font-extrabold uppercase tracking-wider">
                    Target NCMC Card
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                    {cardDetails.cardNumber.slice(0, 4)} •••• •••• {cardDetails.cardNumber.slice(-4)}
                  </p>
                </div>
              </div>
              <span className="text-[9px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md font-bold">
                {cardDetails.issuingBank?.split("(")[0].trim() || "RuPay"}
              </span>
            </div>
          )}

          {/* Amount Display Box */}
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center mb-6">
            <span className="text-xs text-slate-600 dark:text-gray-300 font-bold uppercase">Amount to Pay</span>
            <span className="text-2xl font-black text-brand-accent">₹{amount}.00</span>
          </div>

          {/* QR Code Section */}
          <div className="mb-6 flex flex-col items-center">
            <div className="bg-white p-3 rounded-2xl border-4 border-brand-base shadow-lg mb-4">
              {/* Ensure standard width/height to avoid hydration mismatch with next/image, or use standard img */}
              <img 
                src="/paytm-qr.jpg" 
                alt="Paytm QR Code" 
                className="w-48 h-48 object-cover rounded-xl"
              />
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 w-full text-left flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500">UPI ID:</span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">ajaytom@ptyes</span>
              </div>
            </div>
            
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-4 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg border border-amber-200 dark:border-amber-900/50">
              ⚠️ Important: Please transfer exactly ₹{amount} to the details above. The funds will be credited to your account after verification.
            </p>
          </div>

          <button
            onClick={handleLiveCheckout}
            disabled={loading}
            className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-2xl text-xs shadow-[0_5px_20px_rgba(20,184,166,0.3)] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Verifying payment with bank...</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>I have transferred ₹{amount}</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}