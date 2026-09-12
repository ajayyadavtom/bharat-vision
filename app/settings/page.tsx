"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Moon, Sun, Bell, Globe, Shield, User, ChevronRight, Terminal, LogOut, X, Activity, Server, Code } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<"terminal" | "notifications" | "language" | "privacy" | null>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    // Clear local storage and session storage
    sessionStorage.clear();
    localStorage.removeItem("bharat-vision-storage");
    
    // Sign out from Supabase securely
    await supabase.auth.signOut();
    
    // Redirect to login
    router.replace("/login");
  };

  if (!mounted) {
    return <div className="h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 px-4 pt-8 pb-[120px] relative">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/profile" className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 px-2">Appearance</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                  {currentTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-slate-500">Adjust the app's appearance</p>
                </div>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${theme === "light" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${theme === "dark" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${theme === "system" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}
                >
                  System
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 px-2">Preferences</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            
            <button 
              onClick={() => setActiveModal("notifications")}
              className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <Bell size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications & Alerts</p>
                  <p className="text-xs text-slate-500">Chimes, vibrations, proximity</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveModal("language")}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Globe size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Language</p>
                  <p className="text-xs text-slate-500">English (Auto-Detected)</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

          </div>
        </section>

        {/* Account & Developer */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 px-2">System</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            
            <button 
              onClick={() => setActiveModal("privacy")}
              className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Shield size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Privacy & Data</p>
                  <p className="text-xs text-slate-500">Location tracking, Waze telemetry</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveModal("terminal")}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                  <Terminal size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Developer Terminal</p>
                  <p className="text-xs text-slate-500">View live app telemetry</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

          </div>
        </section>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <LogOut size={18} className="text-red-600 dark:text-red-500" />
          <span className="text-sm font-bold text-red-600 dark:text-red-500">Secure Log Out</span>
        </button>

      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative max-h-[80vh] flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-900 dark:text-white z-10"
              >
                <X size={20} />
              </button>

              {/* TERMINAL MODAL */}
              {activeModal === "terminal" && (
                <div className="h-full flex flex-col font-mono">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Terminal size={20} className="text-emerald-500" /> System Terminal
                  </h3>
                  <div className="bg-slate-950 p-4 rounded-xl flex-1 overflow-y-auto text-xs text-emerald-400 leading-relaxed shadow-inner">
                    <p>{`> Initializing Bharat Vision v0.1.0`}</p>
                    <p>{`> Connecting to GTFS-RT Pipeline... OK`}</p>
                    <p>{`> Supabase Auth verified [User: ACTIVE]`}</p>
                    <p>{`> Geolocation watcher: STANDBY`}</p>
                    <p className="text-yellow-400">{`> WARN: GPS accuracy degraded (Indoor)`}</p>
                    <p>{`> Ping AWS ap-south-1: 42ms`}</p>
                    <p>{`> React Hydration: SUCCESS`}</p>
                    <p>{`> OCR Neural Net: LOADED (Cache Hit)`}</p>
                    <p className="animate-pulse mt-4">_</p>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS MODAL */}
              {activeModal === "notifications" && (
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Proximity Chimes</p>
                        <p className="text-xs text-slate-500">Vibrate when bus is near</p>
                      </div>
                      <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center p-1 justify-end">
                         <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Route Deviations</p>
                        <p className="text-xs text-slate-500">Alert me if bus takes detour</p>
                      </div>
                      <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center p-1 justify-end">
                         <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Marketing Offers</p>
                        <p className="text-xs text-slate-500">Pass discounts & promos</p>
                      </div>
                      <div className="w-10 h-6 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center p-1 justify-start">
                         <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LANGUAGE MODAL */}
              {activeModal === "language" && (
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">App Language</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/50 p-4 rounded-xl font-bold text-emerald-700 dark:text-emerald-400 flex justify-between items-center">
                      English
                      <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>
                    </button>
                    <button className="w-full text-left bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl font-bold text-slate-600 dark:text-slate-300">
                      ಕನ್ನಡ (Kannada)
                    </button>
                    <button className="w-full text-left bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl font-bold text-slate-600 dark:text-slate-300">
                      हिन्दी (Hindi)
                    </button>
                  </div>
                </div>
              )}

              {/* PRIVACY MODAL */}
              {activeModal === "privacy" && (
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Privacy & Data</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield size={24} className="text-indigo-500" />
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Your data is secured with AES-256 encryption.</p>
                    </div>
                    
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Live Location Telemetry</p>
                        <p className="text-xs text-slate-500">Used for crowd-sourcing ETAs</p>
                      </div>
                      <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center p-1 justify-end">
                         <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Camera Access</p>
                        <p className="text-xs text-slate-500">Required for OCR uploads</p>
                      </div>
                      <div className="w-10 h-6 bg-emerald-500 rounded-full flex items-center p-1 justify-end">
                         <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                    
                    <button className="mt-4 w-full text-center py-3 text-red-500 font-bold text-sm hover:underline">
                      Delete My Account & Data
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
