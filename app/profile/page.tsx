"use client";

import { useState, useRef } from "react";
import { User, Terminal, Moon, Bell, Shield, Globe, LogOut, MapPin, ShieldCheck, Leaf, Medal, Receipt, ChevronRight, ScanFace, Upload, CheckCircle2, Loader2, X, Settings, Image as ImageIcon, Pencil, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAppStore } from "@/lib/store";

export default function ProfileScreen() {
  const { userName, setUserName, carbonSavedGrams, karmaPoints, profilePictureUrl, setProfilePictureUrl, rideHistory } = useAppStore();
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated AI OCR Data Extraction
  const [scannedData, setScannedData] = useState<{name: string; dob: string; college: string; university: string; status: string} | null>(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setScannedData({
        name: userName || "Ajay M.",
        dob: "07-07-2007",
        college: "East West College of Engineering",
        university: "Visvesvaraya Technological University (VTU)",
        status: "Eligible for 75% BMTC Concession"
      });
      setIsScanning(false);
      setIsVerified(true);
    }, 2500);
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Compress and resize image to lightweight, persistent base64 data URI (survives restarts)
  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 320;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
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
          const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
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
        const dataUrl = await compressAndResizeImage(file);
        await setProfilePictureUrl(dataUrl);
      } catch (err) {
        console.error("Error processing profile picture:", err);
      } finally {
        setIsUploadingImage(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-[120px] bg-slate-50 dark:bg-slate-950 px-4 pt-8 [&>*]:shrink-0 relative">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User size={28} className="text-slate-900 dark:text-white" />
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Profile</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Manage identity, passes, and transit impact</p>
          </div>
        </div>
        <Link href="/settings" className="p-2 bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-full">
          <Settings size={20} className="text-slate-600 dark:text-slate-300" />
        </Link>
      </div>

      {/* Identity Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm mb-6 flex items-center gap-4 relative overflow-hidden">
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
              className="text-[10px] text-red-500 hover:text-red-600 font-semibold mt-1 relative z-10 active:scale-95 transition-transform"
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
                  if (e.key === 'Enter') {
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
              <span>{(!userName || userName.toLowerCase() === "guest") ? "Jenny" : userName}</span>
              <button 
                onClick={() => { setEditName((!userName || userName.toLowerCase() === "guest") ? "Jenny" : userName); setIsEditingName(true); }}
                className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Edit Name"
              >
                <Pencil size={14} className="text-slate-500 dark:text-slate-400" />
              </button>
              <ShieldCheck size={16} className="text-emerald-500 ml-1" />
            </h3>
          )}
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
            <MapPin size={12} className="text-emerald-500" /> Yelahanka, Bengaluru
          </p>
        </div>
      </div>

      {/* Verification Banner */}
      {!isVerified ? (
        <button 
          onClick={() => setShowScanner(true)}
          className="w-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/50 p-4 rounded-2xl shadow-sm mb-6 flex items-center justify-between group active:scale-95 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 dark:bg-indigo-500/20 p-2 rounded-lg text-indigo-600 dark:text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <ScanFace size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100">Verify Student ID</h4>
              <p className="text-[10px] text-indigo-500 dark:text-indigo-300">Unlock 75% BMTC & Metro Concessions</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/50 p-4 rounded-2xl shadow-sm mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-lg text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-100">Student Concession Active</h4>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-300">ID Validated via e-KYC OCR</p>
            </div>
          </div>
        </div>
      )}

      {/* Transit Impact Stats */}
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Your Transit Impact</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="bg-emerald-50 dark:bg-emerald-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-2">
            <Leaf size={16} className="text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {(carbonSavedGrams / 1000).toFixed(1)} <span className="text-sm text-slate-400 font-bold">kg</span>
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Carbon Offset</p>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between shadow-sm">
          <div className="bg-amber-50 dark:bg-amber-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-2">
            <Medal size={16} className="text-amber-500 dark:text-amber-400" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            {karmaPoints} <span className="text-sm text-slate-400 font-bold">pts</span>
          </p>
          <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1">Rank: Bronze</p>
        </div>
      </div>

      {/* Action List */}
      <div className="flex flex-col gap-3 mb-6">
        <button 
          onClick={() => setShowHistory(true)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 p-4 rounded-2xl flex items-center justify-between transition-colors shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Receipt size={18} className="text-slate-500 dark:text-slate-400" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">Ride History & Receipts</span>
          </div>
          <ChevronRight size={16} className="text-slate-400" />
        </button>
      </div>

      {/* Ride History Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-2xl relative max-h-[85vh] flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Transit & Ride History</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Unified records for Metro, Bus, Auto/Cab, and Passes
                  </p>
                </div>
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
                          <p className="text-xs text-slate-400 mt-0.5">
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
                                <span className="text-[10px] font-semibold text-slate-400 block">Paid</span>
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

      {/* AI e-KYC Scanner Modal */}
      <AnimatePresence>
        {showScanner && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setShowScanner(false)}
                className="absolute top-4 right-4 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:text-white"
              >
                <X size={20} />
              </button>

              {!isVerified ? (
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="w-16 h-16 bg-indigo-900/40 rounded-2xl border border-indigo-500/50 flex items-center justify-center mb-4 relative overflow-hidden">
                    {isScanning && <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>}
                    <ScanFace size={32} className="text-indigo-400 relative z-10" />
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    {isScanning ? "Analyzing ID..." : "Upload Institutional ID"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-6">
                    Our AI will extract your details to instantly provision your student transit pass.
                  </p>

                  {isScanning ? (
                    <div className="flex flex-col items-center gap-3 w-full bg-black/50 p-4 rounded-xl border border-slate-800">
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
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">ID Verified Successfully</h3>
                  <p className="text-xs text-emerald-400 mb-6">Concession framework active.</p>

                  <div className="w-full bg-black/50 p-4 rounded-xl border border-slate-800 text-left flex flex-col gap-2">
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Commuter Name</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{scannedData?.name}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Date of Birth</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{scannedData?.dob}</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-500 uppercase font-bold">Institution</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{scannedData?.college}</p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">{scannedData?.university}</p>
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