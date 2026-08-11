"use client";

import { useState, useEffect } from "react";
import { User, ShieldCheck, Leaf, Award, MapPin, Ticket, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "../../src/lib/store";
import { calculateLevel } from "../../src/lib/karmaEngine";

export default function ProfileScreen() {
  const { userName, karmaPoints, carbonSavedGrams, fetchUserData } = useAppStore();
  const [isStudentVerified, setIsStudentVerified] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const userLevel = calculateLevel(karmaPoints);
  const carbonKg = (carbonSavedGrams / 1000).toFixed(1);

  const handleVerifyStudent = () => {
    // In production, this would trigger an Aadhaar/Seva Sindhu API verification
    setIsStudentVerified(true);
    alert("Student ID Verified via Seva Sindhu! BMTC Student Pass unlocked.");
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
          <User className="text-brand-accent" size={28} /> My Profile
        </h1>
        <p className="text-xs text-gray-400">Manage identity, passes, and transit impact</p>
      </div>

      {/* Identity Card */}
      <div className="bg-surface-dark border border-brand-dark p-5 rounded-3xl mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-surface-black border-2 border-brand-accent rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.3)]">
            <User size={32} className="text-brand-light" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-1">
              {userName || "Ajay M."} <ShieldCheck size={16} className="text-brand-accent" />
            </h2>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin size={12} /> Yelahanka, Bengaluru
            </p>
          </div>
        </div>

        {/* Student Verification Engine */}
        <div className="mt-5 pt-5 border-t border-surface-black">
          {!isStudentVerified ? (
            <button 
              onClick={handleVerifyStudent}
              className="w-full bg-indigo-900/40 border border-indigo-500/50 py-3 rounded-xl flex items-center justify-between px-4 active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-3">
                <GraduationCap size={18} className="text-indigo-400" />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Verify Student ID</p>
                  <p className="text-[10px] text-indigo-300">Unlock free/discounted BMTC passes</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-indigo-400" />
            </button>
          ) : (
            <div className="w-full bg-emerald-900/30 border border-emerald-500/50 py-3 rounded-xl flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Student Verified</p>
                  <p className="text-[10px] text-emerald-300">Valid until March 2027</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Impact Stats Grid */}
      <h3 className="text-lg font-bold text-white mb-3">Your Transit Impact</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-dark border border-surface-dark p-4 rounded-3xl shadow-md flex flex-col gap-2">
          <div className="bg-emerald-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-1">
            <Leaf size={16} className="text-emerald-400" />
          </div>
          <span className="text-2xl font-black text-white">{carbonKg} <span className="text-xs font-normal text-gray-400">kg</span></span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Carbon Offset</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface-dark border border-surface-dark p-4 rounded-3xl shadow-md flex flex-col gap-2">
          <div className="bg-amber-900/30 w-8 h-8 rounded-full flex items-center justify-center mb-1">
            <Award size={16} className="text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white">{karmaPoints} <span className="text-xs font-normal text-gray-400">pts</span></span>
          <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-wider">Rank: {userLevel}</span>
        </motion.div>
      </div>

      {/* History Menu */}
      <div className="flex flex-col gap-2">
        <button className="bg-surface-dark p-4 rounded-2xl flex items-center justify-between border border-surface-dark hover:border-brand-dark transition-colors">
          <div className="flex items-center gap-3">
            <Ticket size={18} className="text-brand-light" />
            <span className="text-sm font-bold text-gray-200">Ride History & Receipts</span>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

    </div>
  );
}