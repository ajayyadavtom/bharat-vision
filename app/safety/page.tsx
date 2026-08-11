"use client";

import { useState } from "react";
import { ShieldAlert, AlertTriangle, Phone, Radio, Activity, MapPin, Award, Plus, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

// FIXED PATHS: Up two folders (../../) to root, then into src/lib
import { useAppStore } from "../../src/lib/store"; 
import { calculateLevel, processHazardReport, HazardReport } from "../../src/lib/karmaEngine";

export default function SafetyScreen() {
  const { karmaPoints, addKarma } = useAppStore();
  const userLevel = calculateLevel(karmaPoints);

  const [activeHazards, setActiveHazards] = useState<HazardReport[]>([
    { id: "h1", type: "Waterlogging", location: "Silk Board Underpass", verified: 124, time: "2m ago" },
    { id: "h2", type: "Heavy Congestion", location: "Hebbal Flyover", verified: 89, time: "15m ago" }
  ]);

  const handleReportHazard = () => {
    const newTotal = processHazardReport(karmaPoints);
    const pointsEarned = newTotal - karmaPoints;
    
    addKarma(pointsEarned);

    const newReport: HazardReport = {
      id: `h${Date.now()}`,
      type: "Broken Down Bus",
      location: "Yelahanka New Town",
      verified: 1,
      time: "Just now"
    };
    
    setActiveHazards(prev => [newReport, ...prev]);
  };

  // ZERO-NETWORK ENGINE: Native SMS intent for SOS
  const handleSOS = () => {
    const emergencyNumber = "112";
    const message = encodeURIComponent("EMERGENCY SOS: I am a commuter using Bharat Vision. I need immediate assistance. My last known location is near Yelahanka, Bengaluru.");
    window.location.href = `sms:${emergencyNumber}?body=${message}`;
  };

  // ZERO-NETWORK ENGINE: Native SMS intent for offline ticketing
  const handleOfflineTicketSMS = () => {
    const phoneNumber = "161"; 
    const message = encodeURIComponent("TICKET GREEN LINE");
    window.location.href = `sms:${phoneNumber}?body=${message}`;
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-24 bg-surface-black px-4 pt-8">
      
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
            <ShieldAlert className="text-alert-red" size={28} /> SafeKeep
          </h1>
          <p className="text-xs text-gray-400">Emergency SOS & Live Hazard Engine</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="bg-brand-dark border border-brand-base px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2">
            <Award size={16} className="text-brand-accent" />
            <span className="text-white font-black">{karmaPoints} <span className="text-[10px] text-brand-light font-normal">pts</span></span>
          </div>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Rank: {userLevel}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-10">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-alert-red rounded-full z-0"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1.5], opacity: [0.8, 0.4, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-alert-red rounded-full z-0"
          />
          
          {/* WIRED UP SOS BUTTON */}
          <button 
            onClick={handleSOS}
            className="relative z-10 w-36 h-36 bg-gradient-to-b from-red-500 to-alert-red rounded-full shadow-[0_0_30px_rgba(239,68,68,0.4)] flex flex-col items-center justify-center border-4 border-surface-black active:scale-95 transition-transform"
          >
            <Phone size={40} className="text-white mb-1" fill="currentColor" />
            <span className="text-white font-black tracking-widest text-lg">SOS</span>
          </button>
        </div>
        
        <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mt-6 flex items-center gap-1 bg-surface-dark px-3 py-1.5 rounded-full border border-surface-dark">
          <Radio size={12} className="text-brand-accent" />
          Offline SMS Fallback Active
        </p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle size={18} className="text-alert-orange" /> Active Hazards
          </h3>
          <button 
            onClick={handleReportHazard}
            className="bg-brand-accent text-surface-black text-xs font-black px-4 py-2 rounded-lg shadow-md active:scale-95 transition-transform flex items-center gap-1"
          >
            <Plus size={14} strokeWidth={3} /> Report 
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-4">
          {activeHazards.map((hazard, index) => (
            <motion.div 
              key={hazard.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-dark p-4 rounded-2xl border border-alert-orange/20 flex flex-col gap-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="bg-alert-orange/10 p-1.5 rounded-md">
                    <Activity size={16} className="text-alert-orange" />
                  </div>
                  <span className="font-bold text-white text-sm">{hazard.type}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium">{hazard.time}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-gray-400">
                <MapPin size={12} />
                <span className="text-xs">{hazard.location}</span>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-5 h-5 rounded-full bg-surface-black border border-surface-dark"></div>
                  <div className="w-5 h-5 rounded-full bg-surface-black border border-surface-dark"></div>
                  <div className="w-5 h-5 rounded-full bg-surface-black border border-surface-dark"></div>
                </div>
                <span className="text-[10px] text-brand-accent font-semibold">
                  Verified by {hazard.verified} commuters
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* OFFLINE TICKET BUTTON */}
        <button 
          onClick={handleOfflineTicketSMS}
          className="w-full bg-surface-dark p-4 rounded-2xl flex items-center gap-4 border border-surface-dark hover:border-brand-dark transition-colors text-left"
        >
          <div className="bg-brand-900/30 p-3 rounded-full">
            <MessageSquare size={20} className="text-brand-accent" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">SMS Ticket Fallback</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Buy BMTC/Metro pass via text message</p>
          </div>
        </button>

      </div>
    </div>
  );
}