"use client";

import { useState, useEffect } from "react";
import { CreditCard, Wifi, ShieldCheck, X, Sparkles, CheckCircle2, RefreshCw, Smartphone, Landmark, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, NcmcCardInfo } from "@/lib/store";

interface NcmcCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (card: NcmcCardInfo) => void;
  initialData?: Partial<NcmcCardInfo>;
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

export default function NcmcCardModal({ isOpen, onClose, onSuccess, initialData }: NcmcCardModalProps) {
  const { ncmcCard, linkNcmcCard, userName } = useAppStore();

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issuingBank, setIssuingBank] = useState("State Bank of India (SBI NCMC)");
  const [cardBalance, setCardBalance] = useState("100.00");
  const [cardNickName, setCardNickName] = useState("Primary Transit Card");
  
  const [isScanningNfc, setIsScanningNfc] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Initialize form with existing or initial data
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setIsSaved(false);
      const source = initialData || (ncmcCard.isLinked ? ncmcCard : null);
      if (source && source.cardNumber) {
        setCardNumber(source.cardNumber);
        setCardHolder(source.cardHolder || "");
        setExpiryDate(source.expiryDate || "");
        setIssuingBank(source.issuingBank || POPULAR_BANKS[0]);
        setCardBalance(source.cardBalance ? source.cardBalance.toFixed(2) : "100.00");
        setCardNickName(source.cardNickName || "Primary Transit Card");
      } else {
        // Defaults for new entry
        setCardNumber("");
        setCardHolder(userName && userName.toLowerCase() !== "guest" ? userName.toUpperCase() : "COMMUTER");
        setExpiryDate("");
        setIssuingBank(POPULAR_BANKS[0]);
        setCardBalance("100.00");
        setCardNickName("Primary Transit Card");
      }
    }
  }, [isOpen, initialData, ncmcCard, userName]);

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

  // Web NFC Reading or Simulated fallback
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
          setCardBalance("150.00");
          setIsScanningNfc(false);
        };
      } else {
        // Fallback simulation
        setTimeout(() => {
          setCardNumber("6071 8842 1920 8924");
          setCardHolder((userName && userName.toLowerCase() !== "guest" ? userName : "AJAY M.").toUpperCase());
          setExpiryDate("09/29");
          setIssuingBank("State Bank of India (SBI NCMC)");
          setCardBalance("150.00");
          setIsScanningNfc(false);
        }, 1200);
      }
    } catch (err) {
      setTimeout(() => {
        setCardNumber("6071 8842 1920 8924");
        setCardHolder((userName && userName.toLowerCase() !== "guest" ? userName : "AJAY M.").toUpperCase());
        setExpiryDate("09/29");
        setIssuingBank("State Bank of India (SBI NCMC)");
        setCardBalance("150.00");
        setIsScanningNfc(false);
      }, 1000);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (cleanNumber.length !== 16) {
      setErrorMsg("Please enter a valid 16-digit RuPay NCMC card number.");
      return;
    }

    if (!cardHolder.trim()) {
      setErrorMsg("Please enter the cardholder name printed on the card.");
      return;
    }

    if (!expiryDate || expiryDate.length !== 5 || !expiryDate.includes("/")) {
      setErrorMsg("Please enter a valid expiry date (MM/YY).");
      return;
    }

    const balanceNum = parseFloat(cardBalance) || 0;

    const cardData: NcmcCardInfo = {
      cardNumber: cardNumber.trim(),
      cardHolder: cardHolder.trim().toUpperCase(),
      expiryDate: expiryDate.trim(),
      issuingBank: issuingBank,
      cardBalance: Math.max(0, balanceNum),
      isLinked: true,
      autoTopUp: ncmcCard.autoTopUp ?? true,
      cardNickName: cardNickName.trim() || "Primary Transit Card",
      lastSyncedAt: Date.now()
    };

    linkNcmcCard(cardData);
    setIsSaved(true);

    if (onSuccess) {
      onSuccess(cardData);
    }

    setTimeout(() => {
      onClose();
    }, 900);
  };

  // Mask display number for preview
  const displayPreviewNumber = () => {
    if (!cardNumber) return "•••• •••• •••• ••••";
    const parts = cardNumber.split(" ");
    return parts.map((part, i) => {
      if (i === 0 || i === 3) return part;
      return "••••";
    }).join(" ");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-xl text-indigo-600 dark:text-indigo-400">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {ncmcCard.isLinked ? "Edit Physical NCMC Card" : "Link Physical NCMC Card"}
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                  RuPay Contactless Smart Card Details
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
            
            {/* Live Interactive Physical NCMC Card Preview */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-5 rounded-2xl shadow-xl border border-indigo-500/30 mb-5 relative overflow-hidden select-none">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header: Bank & Contactless Wave */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-indigo-300 font-bold block">
                    {issuingBank.split("(")[0].trim()}
                  </span>
                  <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={10} /> RuPay NCMC Standard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi size={18} className="text-indigo-300 rotate-90" />
                  <span className="text-[10px] font-black tracking-wider bg-white/10 px-2 py-0.5 rounded-md border border-white/20">
                    NCMC
                  </span>
                </div>
              </div>

              {/* EMV Chip Visualizer */}
              <div className="mb-4 relative z-10 flex items-center justify-between">
                <div className="w-10 h-7 rounded-md bg-gradient-to-tr from-amber-300 via-amber-200 to-amber-400 border border-amber-500/50 shadow-inner flex flex-col justify-around p-1">
                  <div className="w-full h-0.5 bg-amber-600/40"></div>
                  <div className="w-full h-0.5 bg-amber-600/40"></div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-indigo-300 uppercase block font-semibold">Chip Balance</span>
                  <span className="text-sm font-black text-white">₹{parseFloat(cardBalance || "0").toFixed(2)}</span>
                </div>
              </div>

              {/* 16-Digit Card Number */}
              <div className="mb-4 relative z-10">
                <p className="font-mono text-base font-bold tracking-widest text-white drop-shadow-sm">
                  {cardNumber || "6071 •••• •••• 8924"}
                </p>
              </div>

              {/* Card Footer: Holder Name, Expiry, RuPay Logo */}
              <div className="flex justify-between items-end relative z-10">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest block font-bold">Cardholder</span>
                  <p className="text-xs font-black tracking-wide uppercase truncate max-w-[170px]">
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
                    <span>Scanning Physical Card via NFC...</span>
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

            {/* Form Fields */}
            <form onSubmit={handleSave} className="flex flex-col gap-3.5">
              
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

              {/* Cardholder Name Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Cardholder Name (as printed on card) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => { setCardHolder(e.target.value.toUpperCase()); if (errorMsg) setErrorMsg(null); }}
                  placeholder="e.g. AJAY M."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 dark:text-white uppercase outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Expiry Date and Current Balance Row */}
              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 text-center"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Chip Balance (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={cardBalance}
                      onChange={(e) => setCardBalance(e.target.value)}
                      placeholder="100.00"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Issuing Bank Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1 flex items-center gap-1.5">
                  <Landmark size={12} className="text-indigo-500" /> Issuing Bank / Transit Authority
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

              {/* Card Nickname Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Card Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={cardNickName}
                  onChange={(e) => setCardNickName(e.target.value)}
                  placeholder="e.g. My BMRCL Metro Card"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaved}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:bg-emerald-600"
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Card Details Saved Successfully!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Save & Link Physical NCMC Card</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
