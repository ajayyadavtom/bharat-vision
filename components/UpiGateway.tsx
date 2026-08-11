"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Loader2, Landmark } from "lucide-react";

interface UpiGatewayProps {
  isOpen: boolean;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function UpiGateway({ isOpen, amount, onSuccess, onCancel }: UpiGatewayProps) {
  const [status, setStatus] = useState<"initiating" | "processing" | "success">("initiating");

  useEffect(() => {
    if (isOpen) {
      setStatus("initiating");
      // Simulate UPI connection delay
      const timer1 = setTimeout(() => setStatus("processing"), 1500);
      // Simulate Bank processing delay
      const timer2 = setTimeout(() => {
        setStatus("success");
        setTimeout(onSuccess, 1500); // Close and update wallet after success
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isOpen, onSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-end bg-black/60 backdrop-blur-sm p-4 pb-12"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-surface-black border border-surface-dark rounded-3xl p-6 shadow-[0_-10px_40px_rgba(20,184,166,0.15)] flex flex-col items-center"
          >
            {status === "initiating" && (
              <div className="flex flex-col items-center py-8">
                <ShieldCheck size={48} className="text-brand-dark mb-4 animate-pulse" />
                <h2 className="text-xl font-bold text-white mb-2">Secure UPI Gateway</h2>
                <p className="text-sm text-gray-400">Connecting to your banking app...</p>
                <button onClick={onCancel} className="mt-8 text-xs text-gray-500 underline">Cancel Transaction</button>
              </div>
            )}

            {status === "processing" && (
              <div className="flex flex-col items-center py-8">
                <Loader2 size={48} className="text-brand-accent animate-spin mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Processing ₹{amount}</h2>
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Landmark size={14} /> Waiting for bank confirmation
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  <CheckCircle2 size={64} className="text-brand-accent mb-4 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-1">Payment Successful</h2>
                <p className="text-sm text-brand-light">₹{amount} added to Bharat Wallet</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}