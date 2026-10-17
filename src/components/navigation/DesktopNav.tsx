"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Map as MapIcon, 
  QrCode, 
  MessageCircle, 
  ShieldAlert, 
  TrainFront, 
  CreditCard, 
  Wallet, 
  Leaf, 
  Sun, 
  Moon, 
  Plus, 
  Crosshair, 
  User, 
  Sparkles,
  Bus
} from "lucide-react";
import { useTheme } from "next-themes";
import { useAppStore } from "@/lib/store";
import { getCityData, CITIES } from "@/lib/cityData";
import { requestBrowserLocation, reverseGeocodeCoordinates } from "@/lib/location";
import UpiGateway from "@/components/UpiGateway";

export default function DesktopNav() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const {
    userName,
    walletBalance,
    carbonSavedGrams,
    currentCity,
    setCurrentCity,
    addMoney,
    profilePictureUrl,
  } = useAppStore();

  const cityData = getCityData(currentCity);
  const [mounted, setMounted] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsLocationName, setGpsLocationName] = useState<string | null>(null);

  // Client-side hydration safeguard
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname === "/login") {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "Live Track", href: "/track", icon: MapIcon, badge: "BMTC GTFS" },
    { name: "Namma Metro", href: "/metro", icon: TrainFront, badge: "BMRCL" },
    { name: "Pass & NCMC", href: "/pass", icon: QrCode },
    { name: "SafeKeep", href: "/safety", icon: ShieldAlert },
    { name: "Vanara AI", href: "/chat", icon: MessageCircle, isVanara: true },
  ];

  const handleAcquireLocation = async () => {
    try {
      setIsLocating(true);
      const coords = await requestBrowserLocation();
      const geoInfo = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      setGpsLocationName(geoInfo.locality || geoInfo.city);
    } catch (e) {
      console.warn("GPS acquire error:", e);
    } finally {
      setIsLocating(false);
    }
  };

  const handlePaymentSuccess = () => {
    addMoney(500);
    setIsTopUpOpen(false);
  };

  return (
    <>
      <header className="hidden md:flex sticky top-0 z-[110] w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs select-none">
        <div className="max-w-[1720px] mx-auto w-full px-6 lg:px-10 xl:px-14 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Identity & City Selection */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Bus size={22} className="text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base tracking-tight text-slate-900 dark:text-white leading-none">
                    BHARAT <span className="text-emerald-600 dark:text-emerald-400">VISION</span>
                  </span>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight mt-0.5">
                  Bengaluru Transit Hub
                </span>
              </div>
            </Link>

            {/* City & Live GPS Selector */}
            <div className="h-6 w-px bg-slate-200 dark:border-slate-800" />
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700/60">
              <select
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-transparent outline-none cursor-pointer pr-1"
              >
                {Object.values(CITIES).map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleAcquireLocation}
                disabled={isLocating}
                title="Detect GPS Location"
                className="text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer"
              >
                <Crosshair size={13} className={isLocating ? "animate-spin text-emerald-500" : (gpsLocationName ? "text-emerald-500" : "")} />
              </button>

              {gpsLocationName && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold max-w-[90px] truncate">
                  {gpsLocationName}
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item.isVanara ? (
                    <img
                      src="/vanara-logo.png"
                      alt="Vanara AI"
                      className={`w-4 h-4 object-contain dark:invert ${isActive ? "opacity-100" : "opacity-70"}`}
                    />
                  ) : (
                    <Icon size={16} />
                  )}
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="hidden xl:inline text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase tracking-tighter font-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop User Telemetry & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wallet Widget */}
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 pl-3 pr-1 py-1 rounded-xl">
              <Wallet size={14} className="text-emerald-600 dark:text-emerald-400" />
              <div className="text-left">
                <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-200 block leading-none">
                  ₹{(walletBalance || 0).toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsTopUpOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-2 py-0.5 text-[10px] font-black tracking-tight transition-colors flex items-center gap-0.5 cursor-pointer shadow-xs active:scale-95"
              >
                <Plus size={11} /> Top Up
              </button>
            </div>

            {/* Carbon Saved Pill */}
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700" title="Total Carbon Offset">
              <Leaf size={14} className="text-emerald-500" />
              <span>{((carbonSavedGrams || 0) / 1000).toFixed(1)}kg CO₂</span>
            </div>

            {/* Dark / Light Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Toggle Theme"
            >
              {mounted && resolvedTheme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-700 dark:text-slate-300" />}
            </button>

            {/* User Profile Avatar Link */}
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-1 group"
              title="View Profile & Transit Pass"
            >
              <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-emerald-500/40 overflow-hidden flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <User size={16} className="text-slate-600 dark:text-slate-300" />
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 line-clamp-1 leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {userName ? (userName.toLowerCase() === "guest" ? "Jenny" : userName.split(" ")[0]) : "Jenny"}
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 leading-none">
                  Commuter
                </span>
              </div>
            </Link>
          </div>

        </div>
      </header>

      {/* Top Up UPI Gateway Modal */}
      {isTopUpOpen && (
        <UpiGateway
          isOpen={isTopUpOpen}
          amount={500}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setIsTopUpOpen(false)}
        />
      )}
    </>
  );
}
