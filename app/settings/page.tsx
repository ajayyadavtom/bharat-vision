"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Sun, Smartphone, Bell, Globe, Shield, User, ChevronRight } from "lucide-react";

export default function SettingsScreen() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 px-4 pt-8 pb-[120px]">
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
            
            <button className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
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

            <button className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
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

        {/* Account */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 px-2">Account</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            
            <button className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <User size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Commuter Profile</p>
                  <p className="text-xs text-slate-500">Edit personal details</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

            <button className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                  <Shield size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Privacy & Data</p>
                  <p className="text-xs text-slate-500">Location tracking, Waze telemetry</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

          </div>
        </section>

      </div>
    </div>
  );
}
