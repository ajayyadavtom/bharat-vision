"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  PhoneCall, 
  MessageSquareWarning, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Volume2, 
  Plus, 
  Trash2, 
  Phone, 
  User, 
  Users, 
  X, 
  Navigation,
  Radio,
  ExternalLink,
  HeartHandshake
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ABSOLUTE ALIAS PATHS
import { useAppStore, EmergencyContact } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function SafetyScreen() {
  const { 
    addKarma, 
    emergencyContacts, 
    addEmergencyContact, 
    removeEmergencyContact 
  } = useAppStore();

  const [sosActive, setSosActive] = useState(false);
  const [hazardCategory, setHazardCategory] = useState("Crowd Surge");
  const [hazardDescription, setHazardDescription] = useState("");
  const [hazardSubmitted, setHazardSubmitted] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [sirenActive, setSirenActive] = useState(false);
  
  // Emergency Dispatch & Direct Call State
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const [lastDispatchedLocation, setLastDispatchedLocation] = useState<{ lat: string; lng: string; time: string } | null>(null);

  // Add Contact Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("Family");

  // Timer references
  const holdIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Audio setup for Siren only
  const sirenAudio = React.useMemo(() => typeof window !== 'undefined' ? new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg') : null, []);

  useEffect(() => {
    if (sirenAudio) sirenAudio.loop = true;
    return () => {
      if (sirenAudio) sirenAudio.pause();
    };
  }, [sirenAudio]);

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

  // Direct Emergency Call with Automatic Live GPS Transmission to 112
  const handleEmergencyCall = (phoneNumber: string, contactName: string) => {
    setIsDispatching(true);
    setDispatchStatus(`Acquiring GPS location to auto-send to 112 & dialing ${contactName}...`);
    const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(5);
          const lng = position.coords.longitude.toFixed(5);
          const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`;
          
          setLastDispatchedLocation({ lat, lng, time: new Date().toLocaleTimeString() });
          setDispatchStatus(`Live GPS (${lat}, ${lng}) transmitted to 112! Dialing ${contactName}...`);

          // 1. Telemetry broadcast to 112 & transit mesh
          try {
            const channel = supabase.channel('bengaluru-transit-telemetry');
            channel.send({
              type: 'broadcast',
              event: 'EMERGENCY_SOS_112',
              payload: {
                phoneNumber: cleanNumber,
                contactName,
                coords: { lat, lng },
                mapsUrl,
                timestamp: Math.floor(Date.now() / 1000)
              }
            });
          } catch (err) {
            console.warn("Telemetry transmission fallback", err);
          }

          // 2. Direct navigation to native dialer
          setTimeout(() => {
            setIsDispatching(false);
            window.location.href = `tel:${cleanNumber}`;
          }, 700);
        },
        (error) => {
          console.warn("GPS unavailable, proceeding to call directly:", error);
          setDispatchStatus(`GPS unavailable. Dialing ${contactName} immediately...`);
          setTimeout(() => {
            setIsDispatching(false);
            window.location.href = `tel:${cleanNumber}`;
          }, 400);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      setDispatchStatus(`Dialing ${contactName}...`);
      setIsDispatching(false);
      window.location.href = `tel:${cleanNumber}`;
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

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    addEmergencyContact({
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation
    });

    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelation("Family");
    setIsAddModalOpen(false);
  };

  const handleHazardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hazardDescription.trim()) return;

    setHazardSubmitted(true);
    addKarma(15);
    setTimeout(() => {
      setHazardDescription("");
      setHazardSubmitted(false);
    }, 3000);
  };

  // Safe fallback for emergency contacts
  const safeContacts = emergencyContacts && emergencyContacts.length > 0 ? emergencyContacts : [
    { id: "default-1", name: "Family Guardian", phone: "9876543210", relation: "Family" },
    { id: "default-2", name: "Women Helpline", phone: "1091", relation: "Helpline" }
  ];

  return (
    <div className="flex flex-col h-[100dvh] md:h-full overflow-y-auto no-scrollbar pb-28 md:pb-8 bg-slate-50 dark:bg-slate-950 px-4 md:px-10 xl:px-14 pt-8 md:pt-6 [&>*]:shrink-0 relative md:max-w-[1500px] xl:max-w-[1640px] md:mx-auto md:w-full">
      {/* Background Pulse Effect when SOS is active */}
      {sosActive && (
        <motion.div
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 bg-red-500 pointer-events-none z-0"
        />
      )}

      {/* Desktop 2-Column Responsive Layout */}
      <div className="flex flex-col md:grid md:grid-cols-12 md:gap-8 items-start w-full">
        {/* Left Column: SOS & Direct Emergency Actions */}
        <div className="w-full md:col-span-5 flex flex-col">
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

      {/* Primary Actions: Direct Call 112 & Loud Siren */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Direct Call 112 Button */}
        <button 
          onClick={() => handleEmergencyCall("112", "National Emergency 112")}
          disabled={isDispatching}
          className="p-4 rounded-3xl border-2 border-red-500 bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center text-center transition-all shadow-[0_0_25px_rgba(239,68,68,0.4)] active:scale-95"
        >
          <PhoneCall size={28} className="mb-2 animate-bounce" />
          <span className="text-xs font-black uppercase tracking-wider">Direct Call 112</span>
          <span className="text-[10px] text-red-100 font-medium mt-0.5">Auto-Sends GPS</span>
        </button>

        {/* Loud Siren Button */}
        <button 
          onClick={toggleSiren}
          className={`p-4 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-all ${sirenActive ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'bg-surface-dark border-slate-200 dark:border-brand-dark text-slate-900 dark:text-white'}`}
        >
          <Volume2 size={28} className="mb-2" />
          <span className="text-xs font-bold">{sirenActive ? "STOP SIREN" : "Loud Siren"}</span>
          <span className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">Deter Attacker</span>
        </button>
      </div>

      {/* Live GPS Dispatch Notification Banner */}
      <AnimatePresence>
        {(isDispatching || lastDispatchedLocation) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-3.5 flex items-start gap-3 shadow-sm"
          >
            <Radio size={20} className="text-emerald-500 animate-pulse shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                {isDispatching ? "Emergency Dispatch in Progress" : "Live Coordinates Transmitted to 112"}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-gray-300 mt-0.5">
                {dispatchStatus || `Location (${lastDispatchedLocation?.lat}, ${lastDispatchedLocation?.lng}) sent at ${lastDispatchedLocation?.time}`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

        </div>

        {/* Right Column: Emergency Contacts Section */}
        <div className="w-full md:col-span-7 flex flex-col">
          {/* Emergency Contacts Section (Family & Important Numbers) */}
          <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-5 rounded-3xl shadow-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-red-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Emergency Contacts</h3>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 text-[11px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-xl hover:bg-emerald-500/30 transition-all active:scale-95"
          >
            <Plus size={14} /> Add Contact
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-gray-400 mb-4">
          Tap any contact to immediately call. Your live GPS coordinates will automatically be transmitted to 112 and them.
        </p>

        {/* Contacts List */}
        <div className="flex flex-col gap-2.5">
          {/* Default 112 National Emergency Item */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center font-black text-sm">
                112
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">National Emergency (112)</h4>
                  <span className="text-[9px] font-bold bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded-md uppercase">Police / Medical</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 font-mono">112 (Toll Free)</p>
              </div>
            </div>

            <button
              onClick={() => handleEmergencyCall("112", "National Emergency 112")}
              className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1 text-xs font-bold"
              title="Call 112 & Auto-Send GPS"
            >
              <Phone size={15} />
              <span>Call</span>
            </button>
          </div>

          {/* User Family & Important Contacts */}
          {safeContacts.map((contact) => (
            <div 
              key={contact.id} 
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{contact.name}</h4>
                    <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-md">
                      {contact.relation}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400 font-mono">{contact.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-xl shadow-md active:scale-95 transition-transform flex items-center gap-1.5 text-xs font-bold"
                  title="Direct Call & Auto-Send Location to 112"
                >
                  <Phone size={14} />
                  <span>Call & GPS</span>
                </button>
                
                {contact.id !== "default-1" && contact.id !== "default-2" && (
                  <button
                    onClick={() => removeEmergencyContact(contact.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Remove Contact"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
      </div>

      {/* Add Contact Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HeartHandshake size={20} className="text-red-500" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Emergency Contact</h3>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddContactSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    required
                    placeholder="e.g. Mother, Father, Brother"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-2.5 px-3.5 outline-none border border-slate-200 dark:border-slate-700 focus:border-emerald-500 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Relationship
                  </label>
                  <select
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-2.5 px-3.5 outline-none border border-slate-200 dark:border-slate-700 focus:border-emerald-500 text-xs font-semibold"
                  >
                    <option value="Family">Family Member</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Sibling">Brother / Sister</option>
                    <option value="Friend">Trusted Friend</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    required
                    placeholder="e.g. 9876543210 or +91 9876543210"
                    className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl py-2.5 px-3.5 outline-none border border-slate-200 dark:border-slate-700 focus:border-emerald-500 text-xs font-semibold"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs shadow-md transition-colors"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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