"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wifi, ShieldCheck, X, RefreshCw, Smartphone, Landmark, AlertCircle, Plus, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, NcmcCardInfo } from "@/lib/store";

interface NcmcTopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPay: (cardData: NcmcCardInfo, amount: number) => void;
  defaultAmount?: number;
}

const POPULAR_BANKS = [
  "State Bank of India (SBI NCMC)",
  "Canara Bank RuPay NCMC",
  "Paytm Payments Bank Transit",
  "ICICI Bank NCMC Card",
  "HDFC Bank RuPay NCMC",
  "Airtel Payments Bank NCMC",
  "Axis Bank RuPay Transit",
  "Bank of Baroda NCMC",
  "Union Bank of India NCMC",
  "Other RuPay NCMC Issuer"
];

const PRESET_AMOUNTS = [100, 200, 500, 1000];

export default function NcmcTopUpModal({ isOpen, onClose, onProceedToPay, defaultAmount = 100 }: NcmcTopUpModalProps) {
  const { ncmcCard, linkNcmcCard, userName } = useAppStore();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issuingBank, setIssuingBank] = useState("State Bank of India (SBI NCMC)");
  const [topUpAmount, setTopUpAmount] = useState<number>(defaultAmount);
  const [customAmountStr, setCustomAmountStr] = useState<string>(defaultAmount.toString());

  const [isScanningNfc, setIsScanningNfc] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Prefill or initialize with existing card details when modal opens
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      if (ncmcCard.isLinked && ncmcCard.cardNumber) {
        setCardNumber(ncmcCard.cardNumber);
        setCardHolder(ncmcCard.cardHolder || (userName || "COMMUTER").toUpperCase());
        setExpiryDate(ncmcCard.expiryDate || "12/28");
        setIssuingBank(ncmcCard.issuingBank || POPULAR_BANKS[0]);
      } else {
        // Defaults if no card was entered yet
        setCardNumber("");
        setCardHolder((userName && userName.toLowerCase() !== "guest" ? userName : "COMMUTER").toUpperCase());
        setExpiryDate("");
        setIssuingBank(POPULAR_BANKS[0]);
      }
      setTopUpAmount(defaultAmount);
      setCustomAmountStr(defaultAmount.toString());
    }
  }, [isOpen, ncmcCard, userName, defaultAmount]);

  if (!isOpen) return null;

  // Format 16 digits as XXXX XXXX XXXX XXXX
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
    if (errorMsg) setErrorMsg(null);
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 2) {
      const month = parseInt(raw.slice(0, 2), 10);
      if (month > 12) raw = "12" + raw.slice(2);
      if (month === 0) raw = "01" + raw.slice(2);
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    setExpiryDate(raw);
    if (errorMsg) setErrorMsg(null);
  };

  // Amount selection
  const handleSelectPreset = (amt: number) => {
    setTopUpAmount(amt);
    setCustomAmountStr(amt.toString());
    if (errorMsg) setErrorMsg(null);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmountStr(val);
    const num = parseInt(val, 10) || 0;
    setTopUpAmount(num);
    if (errorMsg) setErrorMsg(null);
  };

  // NFC Scan or Simulated fallback
  const handleNfcRead = async () => {
    setIsScanningNfc(true);
    setErrorMsg(null);

    try {
      if (typeof window !== "undefined" && "NDEFReader" in window) {
        const ndef = new (window as any).NDEFReader();
        await ndef.scan();
        ndef.onreading = (event: any) => {
          const serial = event.serialNumber ? event.serialNumber.replace(/:/g, "").slice(0, 16) : "6071884219208924";
          const formatted = (serial.padEnd(16, "0").slice(0, 16)).replace(/(\d{4})(?=\d)/g, "$1 ");
          setCardNumber(formatted);
          setCardHolder((userName && userName.toLowerCase() !== "guest" ? userName : "AJAY M.").toUpperCase());
          setExpiryDate("08/29");
          setIssuingBank("Canara Bank RuPay NCMC");
          setIsScanningNfc(false);
        };
      } else {
        setTimeout(() => {
          setCardNumber("6071 8842 1920 8924");
          setCardHolder((userName && userName.toLowerCase() !== "guest" ? userName : "AJAY M.").toUpperCase());
          setExpiryDate("09/29");
          setIssuingBank("State Bank of India (SBI NCMC)");
          setIsScanningNfc(false);
        }, 1200);
      }
    } catch (err) {
      setTimeout(() => {
        setCardNumber("6071 8842 1920 8924");
        setCardHolder((userName && userName.toLowerCase() !== "guest" ? userName : "AJAY M.").toUpperCase());
        setExpiryDate("09/29");
        setIssuingBank("State Bank of India (SBI NCMC)");
        setIsScanningNfc(false);
      }, 1000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length !== 16) {
      setErrorMsg("Please enter a valid 16-digit RuPay NCMC card number.");
      return;
    }

    if (!cardHolder.trim()) {
      setErrorMsg("Please enter the cardholder name printed on the physical card.");
      return;
    }

    if (!expiryDate || expiryDate.length !== 5 || !expiryDate.includes("/")) {
      setErrorMsg("Please enter a valid expiry date (MM/YY).");
      return;
    }

    if (!topUpAmount || topUpAmount < 50) {
      setErrorMsg("Minimum recharge amount is ₹50.");
      return;
    }

    if (topUpAmount > 5000) {
      setErrorMsg("Maximum recharge amount per transaction is ₹5,000.");
      return;
    }

    const cardData: NcmcCardInfo = {
      cardNumber: cardNumber.trim(),
      cardHolder: cardHolder.trim().toUpperCase(),
      expiryDate: expiryDate.trim(),
      issuingBank: issuingBank,
      cardBalance: ncmcCard.cardBalance || 0,
      isLinked: true,
      autoTopUp: ncmcCard.autoTopUp ?? true,
      cardNickName: ncmcCard.cardNickName || "Primary Transit Card",
      lastSyncedAt: Date.now()
    };

    // Save/update card details in store
    linkNcmcCard(cardData);

    // Proceed to payment gateway
    onProceedToPay(cardData, topUpAmount);
  };

  const currentBalance = ncmcCard.isLinked ? ncmcCard.cardBalance : 0;
  const newBalance = currentBalance + (topUpAmount || 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.98 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2.5 rounded-2xl text-indigo-600 dark:text-indigo-400">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Top Up Physical NCMC Card
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  Enter Card Details & Select Recharge Amount
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto no-scrollbar flex-1 pr-0.5 pb-2">
            
            {/* Live Interactive Card Preview */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-5 rounded-2xl shadow-xl border border-indigo-500/30 mb-5 relative overflow-hidden select-none">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header */}
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-extrabold block">
                    {issuingBank.split("(")[0].trim()}
                  </span>
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={10} /> RuPay NCMC Transit
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi size={18} className="text-indigo-300 rotate-90" />
                  <span className="text-[10px] font-black tracking-wider bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                    NCMC
                  </span>
                </div>
              </div>

              {/* EMV Chip and Real-time Balance Calc */}
              <div className="mb-4 relative z-10 flex items-center justify-between">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/50 shadow-inner flex flex-col justify-around p-1">
                  <div className="w-full h-0.5 bg-amber-600/40"></div>
                  <div className="w-full h-0.5 bg-amber-600/40"></div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-indigo-300 uppercase block font-semibold">Balance After Top-Up</span>
                  <span className="text-base font-black text-emerald-400">
                    ₹{newBalance.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Card Number */}
              <div className="mb-4 relative z-10">
                <p className="font-mono text-sm sm:text-base font-bold tracking-widest text-white drop-shadow-sm">
                  {cardNumber || "6071 •••• •••• 8924"}
                </p>
              </div>

              {/* Cardholder, Expiry, RuPay */}
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">Cardholder</span>
                  <p className="text-xs font-black tracking-wide uppercase truncate max-w-[160px]">
                    {cardHolder || "COMMUTER NAME"}
                  </p>
                </div>

                <div className="text-center">
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">Valid Thru</span>
                  <p className="font-mono text-xs font-bold">{expiryDate || "MM/YY"}</p>
                </div>

                <div className="bg-white/95 text-slate-900 px-2 py-0.5 rounded font-black text-xs italic tracking-tighter shadow-sm">
                  RuPay<span className="text-orange-600">▶</span>
                </div>
              </div>
            </div>

            {/* Quick NFC Scan Button */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleNfcRead}
                disabled={isScanningNfc}
                className="w-full bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 font-bold py-2.5 px-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                {isScanningNfc ? (
                  <>
                    <RefreshCw size={14} className="animate-spin text-indigo-500" />
                    <span>Reading Physical Card via NFC...</span>
                  </>
                ) : (
                  <>
                    <Smartphone size={14} className="text-indigo-500" />
                    <span>Tap NFC Card to Auto-Fill Details</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/50 flex items-center gap-2 text-red-600 dark:text-red-400 text-xs">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* CARD DETAILS HEADER */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-500 block">
                  1. Physical Card Details
                </span>
              </div>

              {/* Card Number Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  16-Digit RuPay Card Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="6071 4289 0123 8924"
                    maxLength={19}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    {cardNumber.replace(/\s/g, "").length}/16
                  </div>
                </div>
              </div>

              {/* Cardholder Name & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Cardholder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => { setCardHolder(e.target.value.toUpperCase()); if (errorMsg) setErrorMsg(null); }}
                    placeholder="e.g. AJAY M."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 dark:text-white uppercase outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Valid Thru (MM/YY) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 font-mono text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 text-center"
                  />
                </div>
              </div>

              {/* Issuing Bank Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Landmark size={12} className="text-indigo-500" /> Issuing Bank / Transit Partner
                </label>
                <select
                  value={issuingBank}
                  onChange={(e) => setIssuingBank(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer"
                >
                  {POPULAR_BANKS.map((b) => (
                    <option key={b} value={b} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* RECHARGE AMOUNT SECTION */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-1 pt-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-500 block">
                  2. Select Recharge Amount
                </span>
              </div>

              {/* Preset Amount Chips */}
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectPreset(amt)}
                    className={`py-2.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                      topUpAmount === amt
                        ? "bg-indigo-600 text-white shadow-md border border-indigo-500"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400"
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Or Enter Custom Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-500 text-sm">₹</span>
                  <input
                    type="text"
                    value={customAmountStr}
                    onChange={handleCustomAmountChange}
                    placeholder="e.g. 300"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2.5 font-bold text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Calculation Summary Box */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Current Chip Balance</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">₹{currentBalance.toFixed(2)}</span>
                </div>
                <div className="text-indigo-500 font-black">+</div>
                <div>
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Top-Up Amount</span>
                  <span className="font-extrabold text-indigo-500">₹{(topUpAmount || 0).toFixed(2)}</span>
                </div>
                <div className="text-indigo-500 font-black">=</div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">New Balance</span>
                  <span className="font-black text-emerald-500">₹{newBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-4 rounded-2xl text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Pay ₹{topUpAmount || 0} & Top Up Card</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </form>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
