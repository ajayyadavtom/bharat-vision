"use client";

import { useState } from "react";
import { ShieldAlert, PhoneCall, MessageSquareWarning, MapPin, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

// ABSOLUTE ALIAS PATHS
import { useAppStore } from "../../src/lib/store";

export default function SafetyScreen() {
  const { addKarma } = useAppStore();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [hazardCategory, setHazardCategory] = useState("Crowd Surge");
  const [hazardDescription, setHazardDescription] = useState("");
  const [hazardSubmitted, setHazardSubmitted] = useState(false);

  // Trigger emergency SMS URI fallback with live GPS coordinates
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
   <div className="flex flex-col h-screen overflow-y-auto no-scrollbar pb-[120px] bg-surface-black px-4 pt-8 [&>*]:shrink-0">
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert size={14} className="text-red-500" />
            <h1 className="text-[10px] uppercase tracking-widest text-red-400 font-bold">SafeKeep Protocol</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Emergency & Safety</h2>
        </div>
        <div className="bg-surface-dark border border-red-950 px-3 py-1.5 rounded-xl shadow-md text-right">
          <span className="text-[10px] text-gray-400 font-bold uppercase block">Mesh Status</span>
          <span className="text-emerald-400 font-black text-xs flex items-center gap-1">
            <ShieldCheck size={12} /> Offline SMS Ready
          </span>
        </div>
      </div>

      {/* SOS Panic Button */}
      <div className="bg-gradient-to-br from-red-950/40 via-surface-dark to-surface-black border-2 border-red-500/50 p-6 rounded-3xl shadow-[0_0_30px_rgba(239,68,68,0.2)] mb-6 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none"></div>

        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(239,68,68,0.6)] border-4 border-red-400 relative z-10">
          <ShieldAlert size={36} className="text-white animate-bounce" />
        </div>

        <h3 className="text-xl font-black text-white mb-1">Emergency SOS Panic Button</h3>
        <p className="text-xs text-gray-300 mb-6 max-w-xs">
          Instantly triggers zero-network SMS dispatch to 112 emergency response with your live GPS coordinates.
        </p>

        <button
          onClick={triggerOfflineSos}
          className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl text-sm shadow-[0_5px_25px_rgba(239,68,68,0.5)] active:scale-95 transition-transform flex items-center justify-center gap-2 relative z-10"
        >
          <PhoneCall size={18} />
          <span>Tap to Broadcast SOS via SMS</span>
        </button>
      </div>

      {/* Karma Hazard Reporting */}
      <div className="bg-surface-dark border border-brand-dark p-6 rounded-3xl shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquareWarning size={18} className="text-brand-accent" />
          <h3 className="text-base font-bold text-white">Report Transit Hazard</h3>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Help fellow commuters and earn Karma points by reporting overcrowding, lighting issues, or delays.
        </p>

        <form onSubmit={handleHazardSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Category</label>
            <select
              value={hazardCategory}
              onChange={(e) => setHazardCategory(e.target.value)}
              className="w-full bg-surface-black text-white rounded-xl py-3 px-4 outline-none border border-surface-dark focus:border-brand-base text-xs font-semibold"
            >
              <option value="Crowd Surge">Severe Crowd Surge</option>
              <option value="Station Lighting">Station Lighting Failure</option>
              <option value="Bus Breakdown">Bus / Metro Delay or Breakdown</option>
              <option value="Medical Assistance">Medical Emergency</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1.5">Details & Location</label>
            <textarea
              value={hazardDescription}
              onChange={(e) => setHazardDescription(e.target.value)}
              required
              rows={3}
              className="w-full bg-surface-black text-white rounded-xl py-3 px-4 outline-none border border-surface-dark focus:border-brand-base text-xs font-semibold resize-none placeholder-gray-600"
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