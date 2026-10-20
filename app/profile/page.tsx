"use client";

import { useState, useRef, useEffect } from "react";
import { 
  User, Terminal, Moon, Sun, Bell, Shield, Globe, LogOut, MapPin, 
  ShieldCheck, Leaf, Medal, Receipt, ChevronRight, ScanFace, Upload, 
  CheckCircle2, AlertTriangle, Loader2, X, Settings, Image as ImageIcon, 
  Pencil, Check, Bus, Car, TrainFront, Ticket, Sparkles, RefreshCcw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAppStore } from "@/lib/store";

export default function ProfileScreen() {
  const { 
    userName, 
    setUserName, 
    carbonSavedGrams, 
    karmaPoints, 
    profilePictureUrl, 
    setProfilePictureUrl, 
    rideHistory,
    isStudentVerified,
    studentDetails,
    setStudentVerification
  } = useAppStore();

  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "bus" | "metro" | "auto" | "pass">("all");
  
  // Real-time OCR scanning states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [scanError, setScanError] = useState<string | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compress and resize image to lightweight, persistent base64 data URI
  const compressAndResizeImage = (file: File, maxDim: number = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(readerEvent.target?.result as string);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => {
          resolve(readerEvent.target?.result as string);
        };
        img.src = readerEvent.target?.result as string;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      setIsUploadingImage(true);
      try {
        const dataUrl = await compressAndResizeImage(file, 320);
        await setProfilePictureUrl(dataUrl);
      } catch (err) {
        console.error("Error processing profile picture:", err);
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  // Real-time Student ID Card Upload & OCR Pipeline
  const handleIdCardSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      setScanError("Please select an image file (PNG, JPG, or WEBP).");
      return;
    }

    setIsScanning(true);
    setScanError(null);
    setScanStep("Reading image file...");

    try {
      // 1. Process & compress image for high OCR fidelity
      const dataUrl = await compressAndResizeImage(file, 1024);
      setUploadedPreview(dataUrl);

      setScanStep("Analyzing document geometry & running OCR...");

      // 2. Transmit to real-time verification endpoint
      const response = await fetch("/api/verify-student-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      const result = await response.json();

      if (!response.ok || !result.isStudentId) {
        // Document failed verification (e.g. Aadhaar, PAN card, selfie, non-student card)
        setScanError(
          result.error ||
          "Uploaded image could not be verified as a valid Student ID Card. Please ensure the college name, student name, and date of birth are clearly legible."
        );
        setIsScanning(false);
        return;
      }

      // 3. Document successfully identified as authentic Student ID Card
      setScanStep("Institutional validation passed! Provisioning 75% concession...");

      const verifiedData = {
        name: result.data.name,
        dob: result.data.dob,
        college: result.data.college,
        university: result.data.university,
        studentIdNumber: result.data.studentIdNumber,
        validUntil: result.data.validUntil,
        verifiedAt: Date.now(),
      };

      setStudentVerification(true, verifiedData);
      if (verifiedData.name && (!userName || userName.toLowerCase() === "guest")) {
        setUserName(verifiedData.name);
      }

      setIsScanning(false);
    } catch (err: any) {
      console.error("Error during real-time student ID verification:", err);
      setScanError("Network or processing error during OCR analysis. Please try again with a clear photo.");
      setIsScanning(false);
    } finally {
      if (idCardInputRef.current) idCardInputRef.current.value = "";
    }
  };

  const handleToggleTheme = () => {
    const current = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(current);
  };

  return (
    <div className="flex flex-col h-[100dvh] md:h-full overflow-y-auto no-scrollbar pb-[120px] md:pb-8 bg-slate-50 dark:bg-slate-950 px-4 md:px-10 xl:px-14 pt-8 md:pt-6 [&>*]:shrink-0 relative transition-colors duration-200 md:max-w-[1500px] xl:max-w-[1640px] md:mx-auto md:w-full">
      
      {/* Header with Quick Theme Toggle */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User size={28} className="text-slate-900 dark:text-white" />
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Profile</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage identity, passes, and transit impact</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mounted && (
            <button
              type="button"
              onClick={handleToggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`}
              className="p-2.5 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <Link 
            href="/settings" 
            className="p-2.5 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      {/* Identity Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm mb-6 flex items-center gap-4 relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col items-center">
          <div 
            onClick={() => !isUploadingImage && fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full border-2 border-emerald-500 flex items-center justify-center bg-slate-100 dark:bg-slate-800 relative z-10 shadow-sm cursor-pointer overflow-hidden group"
            title="Click to update profile picture"
          >
            {isUploadingImage ? (
              <Loader2 size={24} className="text-emerald-500 animate-spin" />
            ) : profilePictureUrl ? (
              <img 
                src={profilePictureUrl} 
                alt="Profile" 
                className="w-full h-full object-cover" 
                onError={() => setProfilePictureUrl(null)}
              />
            ) : (
              <User size={32} className="text-slate-400" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ImageIcon size={20} className="text-white" />
            </div>
          </div>
          {profilePictureUrl && !isUploadingImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setProfilePictureUrl(null);
              }}
              className="text-[10px] text-red-500 hover:text-red-600 font-semibold mt-1 relative z-10 active:scale-95 transition-transform cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
        
        {/* Hidden File Input for Avatar */}
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleProfileImageUpload} 
          className="hidden" 
        />
        
        <div className="relative z-10 flex-1">
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (editName.trim()) setUserName(editName);
                    setIsEditingName(false);
                  }
                }}
                onBlur={() => {
                  if (editName.trim()) setUserName(editName);
                  setIsEditingName(false);
                }}
                autoFocus
                className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-2 py-1 rounded border border-slate-300 dark:border-slate-700 outline-none w-full max-w-[150px] text-lg font-bold"
              />
            </div>
          ) : (
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>{studentDetails?.name || ((!userName || userName.toLowerCase() === "guest") ? "Ajay M." : userName)}</span>
              <button 
                onClick={() => { 
                  setEditName(studentDetails?.name || ((!userName || userName.toLowerCase() === "guest") ? "Ajay M." : userName)); 
                  setIsEditingName(true); 
                }}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Edit Name"
              >
                <Pencil size={14} className="text-slate-500 dark:text-slate-400" />
              </button>
              <ShieldCheck size={16} className="text-emerald-500 ml-1" />
            </h3>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
            <MapPin size={12} className="text-emerald-500" /> Yelahanka, Bengaluru
          </p>
        </div>
      </div>

      {/* Verification Banner */}
      {!isStudentVerified ? (
        <button 
          onClick={() => {
            setScanError(null);
            setShowScanner(true);
          }}
          className="w-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/50 p-4 rounded-2xl shadow-sm mb-6 flex items-center justify-between group active:scale-95 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <ScanFace size={22} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center gap-1.5">
                <span>Verify Student ID</span>
                <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-1.5 py-0.2 rounded-md">Real-Time OCR</span>
              </h4>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-300">Unlock 75% BMTC & Namma Metro Concessions</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <div 
          onClick={() => setShowScanner(true)}
          className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/50 p-4 rounded-2xl shadow-sm mb-6 flex items-center justify-between cursor-pointer group active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2.5 rounded-xl text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={22} />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Student Concession Active</h4>
                <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded">75% OFF</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5 font-medium truncate max-w-[240px]">
                {studentDetails?.college || "East West College of Engineering"}
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
        </div>
      )}

      {/* Transit Impact Stats */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Your Transit Impact</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm transition-colors">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-2">
            <Leaf size={16} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {(carbonSavedGrams / 1000).toFixed(1)} <span className="text-sm text-slate-500 dark:text-slate-400 font-bold">kg</span>
          </p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">Carbon Offset</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm transition-colors">
          <div className="bg-amber-50 dark:bg-amber-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-2">
            <Medal size={16} className="text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {karmaPoints} <span className="text-sm text-slate-500 dark:text-slate-400 font-bold">pts</span>
          </p>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mt-1">Rank: Bronze</p>
        </div>
      </div>

      {/* Action List */}
      <div className="flex flex-col gap-3 mb-6">
        <button 
          onClick={() => setShowHistory(true)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 p-4 rounded-2xl flex items-center justify-between transition-colors shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Receipt size={18} className="text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Ride History & Receipts</span>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>

        <Link
          href="/pass"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 p-4 rounded-2xl flex items-center justify-between transition-colors shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Ticket size={18} className="text-teal-600 dark:text-teal-400" />
            <div>
              <span className="text-sm font-bold text-slate-900 dark:text-white block">Smart Passes & Concessions</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isStudentVerified ? "75% Student Concession Active on Passes" : "View NCMC & BMTC digital passes"}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </Link>
      </div>

      {/* Ride History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Ride History</h3>
                <button 
                  onClick={() => setShowHistory(false)} 
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  title="Close history"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mode Filter Tabs */}
              {(() => {
                const historyList = rideHistory || [];
                const busCount = historyList.filter((r) => r.category === "bus").length;
                const metroCount = historyList.filter((r) => r.category === "metro").length;
                const autoCount = historyList.filter((r) => r.category === "auto").length;
                const passCount = historyList.filter((r) => r.category === "pass").length;

                const filterButtons: { key: "all" | "metro" | "bus" | "auto" | "pass"; label: string; count: number }[] = [
                  { key: "all", label: "All", count: historyList.length },
                  { key: "metro", label: "Metro", count: metroCount },
                  { key: "bus", label: "Bus", count: busCount },
                  { key: "auto", label: "Auto/Cab", count: autoCount },
                  { key: "pass", label: "Passes", count: passCount },
                ];

                const filtered = historyList.filter((ride) => {
                  if (historyFilter === "all") return true;
                  return ride.category === historyFilter;
                });

                return (
                  <>
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
                      {filterButtons.map((btn) => (
                        <button
                          key={btn.key}
                          type="button"
                          onClick={() => setHistoryFilter(btn.key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border flex items-center gap-1.5 ${
                            historyFilter === btn.key
                              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white shadow-xs"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                          }`}
                        >
                          <span>{btn.label}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                              historyFilter === btn.key
                                ? "bg-white/20 text-white dark:bg-black/20 dark:text-slate-900 font-bold"
                                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {btn.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="overflow-y-auto no-scrollbar flex-1 pr-0.5 space-y-2.5">
                      {filtered.length === 0 ? (
                        <div className="text-center py-12 text-slate-400">
                          <Receipt size={40} className="mx-auto mb-2 opacity-30" />
                          <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
                            No {historyFilter === "all" ? "" : historyFilter} records found
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Purchased tickets and booked rides will be automatically tracked here.
                          </p>
                        </div>
                      ) : (
                        filtered.map((ride, idx) => {
                          const isMetro = ride.category === "metro";
                          const isBus = ride.category === "bus";
                          const isAuto = ride.category === "auto";
                          const isPass = ride.category === "pass";

                          const iconBg = isMetro
                            ? "bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
                            : isBus
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                            : isAuto
                            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                            : "bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400";

                          return (
                            <div
                              key={ride.id || idx}
                              className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex items-start justify-between gap-3 shadow-xs"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                                  {isMetro && <TrainFront size={18} />}
                                  {isBus && <Bus size={18} />}
                                  {isAuto && <Car size={18} />}
                                  {isPass && <Ticket size={18} />}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                      {ride.type}
                                    </h4>
                                    {ride.quantity && ride.quantity > 1 && (
                                      <span className="text-[9px] font-black bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 rounded">
                                        {ride.quantity} Pax
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                                    {ride.network}
                                  </p>

                                  {(ride.origin || ride.destination || ride.route) && (
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 truncate">
                                      {ride.origin && ride.destination
                                        ? `${ride.origin} ➔ ${ride.destination}`
                                        : ride.route}
                                    </p>
                                  )}

                                  {ride.driver && (
                                    <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                                      Driver: {ride.driver}
                                    </p>
                                  )}

                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {ride.ticketId && (
                                      <span className="text-[9px] font-mono font-bold bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                                        {ride.ticketId}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                      {ride.dateString || (ride.timestamp ? new Date(ride.timestamp).toLocaleDateString() : "Recent")}
                                    </span>
                                    {ride.status && (
                                      <span
                                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                          ride.status === "Active"
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                            : ride.status === "Validated"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                                        }`}
                                      >
                                        {ride.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="font-black text-base text-emerald-600 dark:text-emerald-400 block">
                                  ₹{ride.fare}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Paid</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Real-Time Student ID OCR Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => {
                  setShowScanner(false);
                  setScanError(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>

              {/* Hidden File Input for Real ID Card Upload */}
              <input 
                type="file" 
                accept="image/*" 
                ref={idCardInputRef} 
                onChange={handleIdCardSelected} 
                className="hidden" 
              />

              {!isStudentVerified ? (
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-200 dark:border-indigo-500/50 flex items-center justify-center mb-4 relative overflow-hidden shadow-sm">
                    {isScanning && <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>}
                    <ScanFace size={32} className="text-indigo-600 dark:text-indigo-400 relative z-10" />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1.5">
                    {isScanning ? "Analyzing Student ID Card..." : "Real-Time Student Verification"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-xs leading-relaxed">
                    Upload your institutional student ID card. Our neural net will extract your full name, college, and DOB to unlock <span className="font-bold text-emerald-600 dark:text-emerald-400">75% BMTC & Metro concessions</span>.
                  </p>

                  {/* Error Notification Alert */}
                  {scanError && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-3.5 rounded-2xl mb-4 text-left flex items-start gap-3 shadow-xs"
                    >
                      <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200">Verification Rejected</h5>
                        <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-snug">
                          {scanError}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {isScanning ? (
                    <div className="flex flex-col items-center gap-3 w-full bg-slate-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <Loader2 size={28} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
                      <div className="text-center">
                        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 block">
                          Running Offline OCR Neural Net...
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block font-mono">
                          {scanStep || "Processing image data"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col gap-2.5">
                      <button
                        onClick={() => idCardInputRef.current?.click()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 rounded-2xl text-sm active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload size={18} />
                        Upload Student ID Card
                      </button>

                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                        Accepts School, Pre-University, Degree, and University ID Cards. Government IDs (Aadhaar, PAN, DL) will be rejected.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center mt-2"
                >
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/60 rounded-full border border-emerald-300 dark:border-emerald-500/60 flex items-center justify-center mb-3 shadow-sm">
                    <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">ID Verified Successfully</h3>
                  <div className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold px-3 py-1 rounded-full mb-5 flex items-center gap-1.5">
                    <Sparkles size={14} /> 75% Student Concession Active on Passes
                  </div>

                  <div className="w-full bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left flex flex-col gap-3 shadow-xs">
                    <div className="border-b border-slate-200 dark:border-slate-700/60 pb-2">
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider block">
                        Verified Student Name
                      </span>
                      <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                        {studentDetails?.name || userName || "Ajay M."}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-b border-slate-200 dark:border-slate-700/60 pb-2">
                      <div>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider block">
                          Date of Birth
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                          {studentDetails?.dob || "07-07-2007"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider block">
                          USN / Roll Number
                        </span>
                        <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                          {studentDetails?.studentIdNumber || "1EW21CS042"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider block">
                        Educational Institution
                      </span>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
                        {studentDetails?.college || "East West College of Engineering"}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {studentDetails?.university || "Visvesvaraya Technological University (VTU)"}
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex gap-2 mt-5">
                    <button
                      onClick={() => idCardInputRef.current?.click()}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <RefreshCcw size={14} /> Re-Upload ID
                    </button>

                    <Link
                      href="/pass"
                      onClick={() => setShowScanner(false)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs active:scale-95 transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Buy Discounted Pass</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}