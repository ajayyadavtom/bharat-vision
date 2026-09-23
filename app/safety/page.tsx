"use client";

import { useState } from "react";
import { ShieldAlert, PhoneCall, MessageSquareWarning, MapPin, CheckCircle2, AlertTriangle, ShieldCheck, Volume2, PhoneIncoming } from "lucide-react";
import { motion } from "framer-motion";

// ABSOLUTE ALIAS PATHS
import { useAppStore } from "@/lib/store";

export default function SafetyScreen() {
  const { addKarma } = useAppStore();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [hazardCategory, setHazardCategory] = useState("Crowd Surge");
  const [hazardDescription, setHazardDescription] = useState("");
  const [hazardSubmitted, setHazardSubmitted] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [sirenActive, setSirenActive] = useState(false);
  const [fakeCallStatus, setFakeCallStatus] = useState<"idle" | "waiting" | "ringing">("idle");
  
  // Timer references
  const holdIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const fakeCallTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  import React, { useEffect } from "react";
  
  // Audio setup for Siren and Fake Call
  const sirenAudio = React.useMemo(() => typeof window !== 'undefined' ? new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg') : null, []);
  const ringtoneAudio = React.useMemo(() => typeof window !== 'undefined' ? new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg') : null, []);

  useEffect(() => {
    if (sirenAudio) sirenAudio.loop = true;
    if (ringtoneAudio) ringtoneAudio.loop = true;
    return () => {
      if (sirenAudio) sirenAudio.pause();
      if (ringtoneAudio) ringtoneAudio.pause();
    };
  }, [sirenAudio, ringtoneAudio]);


  // Trigger emergency SMS URI fallback with live GPS coordinates
  
  const handlePointerDown = () => {
    setHoldProgress(0);
    let progress = 0;
    holdIntervalRef.current = setInterval(() => {
      progress += 2; // 50 steps = 3 seconds roughly
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(holdIntervalRef.current!);
        triggerOfflineSos();
        setHoldProgress(0);
      }
    }, 60);
  };

  const handlePointerUp = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      if (holdProgress < 100) {
        setHoldProgress(0);
      }
    }
  };

  const toggleSiren = () => {
    if (!sirenActive) {
      setSirenActive(true);
      sirenAudio?.play().catch(e => console.log('Audio play failed', e));
    } else {
      setSirenActive(false);
      sirenAudio?.pause();
      if (sirenAudio) sirenAudio.currentTime = 0;
    }
  };

  const triggerFakeCall = () => {
    if (fakeCallStatus === "idle") {
      setFakeCallStatus("waiting");
      fakeCallTimeoutRef.current = setTimeout(() => {
        setFakeCallStatus("ringing");
        ringtoneAudio?.play().catch(e => console.log('Audio play failed', e));
      }, 5000); // 5 seconds wait
    } else if (fakeCallStatus === "ringing") {
      setFakeCallStatus("idle");
      ringtoneAudio?.pause();
      if (ringtoneAudio) ringtoneAudio.currentTime = 0;
    } else {
      // cancel waiting
      clearTimeout(fakeCallTimeoutRef.current!);
      setFakeCallStatus("idle");
    }
  };

  const triggerOfflineSos = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          const emergencyMessage = encodeURIComponent(
            `SOS EMERGENCY! Commuter requires immediate assistance at Coordinates: ${lat}, ${lng}. Sent via Bharat Vision SafeKeep Offline Mesh.`
          );
          // Open native SMS app with pre-filled emergency helpline and coordinates
          window.location.href = `sms:112?body=${emergencyMessage}`;
        },
        (error) => {
          console.warn("GPS acquisition failed, dispatching general SOS:", error);
          window.location.href = `sms:112?body=SOS%20EMERGENCY!%20Commuter%20requires%20immediate%20assistance%20in%20Namma%20Bengaluru%20Transit.`;
        },
        { timeout: 5000 }
      );
    } else {
      window.location.href = `sms:112?body=SOS%20EMERGENCY!`;
    }
  };

  const handleHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardDescription.trim()) return;

    setHazardSubmitted(true);
    addKarma(15); // Reward commuter with Karma points for reporting safety hazards
    setTimeout(() => {
      setHazardDescription("");
      setHazardSubmitted(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-y-auto no-scrollbar pb-24 bg-slate-50 dark:bg-slate-950 px-4 pt-8 [&>*]:shrink-0 relative">
      {/* Background Pulse Effect when SOS is active */}
      {sosActive && (
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 pointer-events-none z-0"
        />
      )}

      {/* Header: Hold to SOS */}
      <div className="bg-gradient-to-br from-red-950/40 via-surface-dark to-white dark:to-surface-black border-2 border-red-500/50 p-6 rounded-3xl shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-4 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>

        {/* Hold to SOS Button */}
        <div className="relative mb-6">
          <svg className="absolute -inset-4 w-[112px] h-[112px] rotate-[-90deg] pointer-events-none">
            <circle cx="56" cy="56" r="50" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="6" fill="none" />
            <circle cx="56" cy="56" r="50" stroke="#ef4444" strokeWidth="6" fill="none" strokeDasharray="314" strokeDashoffset={314 - (314 * holdProgress) / 100} className="transition-all duration-75" />
          </svg>
          <motion.button
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)] border-4 border-red-400 relative z-10 touch-none select-none"
          >
            <ShieldAlert size={36} className="text-white animate-pulse" />
          </motion.button>
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Hold for SOS</h3>
        <p className="text-xs text-slate-600 dark:text-gray-300 mb-2 max-w-xs">
          Press and hold for 3 seconds to dispatch live GPS coordinates via SMS to 112.
        </p>
      </div>

      {/* Advanced Safety Tools */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button 
          onClick={toggleSiren}
          className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all ${sirenActive ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-surface-dark border-slate-200 dark:border-brand-dark text-slate-900 dark:text-white'}`}
        >
          <Volume2 size={28} className="mb-2" />
          <span className="text-xs font-bold">{sirenActive ? "STOP SIREN" : "Loud Siren"}</span>
        </button>

        <button 
          onClick={triggerFakeCall}
          className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all ${fakeCallStatus === 'ringing' ? 'bg-green-500 border-green-400 text-white animate-bounce' : fakeCallStatus === 'waiting' ? 'bg-amber-500 border-amber-400 text-white animate-pulse' : 'bg-surface-dark border-slate-200 dark:border-brand-dark text-slate-900 dark:text-white'}`}
        >
          <PhoneIncoming size={28} className="mb-2" />
          <span className="text-xs font-bold">
            {fakeCallStatus === 'ringing' ? "ANSWER CALL" : fakeCallStatus === 'waiting' ? "Calling in 5s..." : "Fake Call"}
          </span>
        </button>
      </div>

      {/* Karma Hazard Reporting */}
      <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquareWarning size={18} className="text-brand-accent" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Report Transit Hazard</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-4">
          Help fellow commuters and earn Karma points by reporting overcrowding, lighting issues, or delays.
        </p>

        <form onSubmit={handleHazardSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Category</label>
            <select
              value={hazardCategory}
              onChange={(e) => setHazardCategory(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl py-3 px-4 outline-none border border-slate-300 dark:border-slate-700 focus:border-brand-base text-xs font-semibold"
            >
              <option value="Crowd Surge" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Severe Crowd Surge</option>
              <option value="Station Lighting" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Station Lighting Failure</option>
              <option value="Bus Breakdown" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Bus / Metro Delay or Breakdown</option>
              <option value="Medical Assistance" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Medical Emergency</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Details & Location</label>
            <textarea
              value={hazardDescription}
              onChange={(e) => setHazardDescription(e.target.value)}
              required
              rows={3}
              className="w-full bg-surface-black text-slate-900 dark:text-white rounded-xl py-3 px-4 outline-none border border-slate-200 dark:border-surface-dark focus:border-brand-base text-xs font-semibold resize-none placeholder-gray-600"
              placeholder="Describe the hazard (e.g., Yelahanka Metro platform overcrowded)..."
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-accent text-brand-dark font-black py-3.5 rounded-xl text-xs shadow-lg active:scale-95 transition-transform mt-1"
          >
            Submit Report (+15 Karma Points)
          </button>

          {hazardSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs py-2 px-4 rounded-xl flex items-center gap-2 justify-center"
            >
              <CheckCircle2 size={16} />
              <span>Hazard successfully logged & Karma credited!</span>
            </motion.div>
          )}
        </form>
      </div>

    </div>
  );
}