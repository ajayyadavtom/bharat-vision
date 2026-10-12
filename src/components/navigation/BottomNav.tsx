"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map as MapIcon, QrCode, MessageCircle, ShieldAlert } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Track", href: "/track", icon: MapIcon },
    { name: "Pass", href: "/pass", icon: QrCode },
    { name: "Chat", href: "/chat", icon: MessageCircle }, 
    { name: "SafeKeep", href: "/safety", icon: ShieldAlert },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 pt-2 pb-[max(12px,env(safe-area-inset-bottom))] z-[100]">
      <div className="flex justify-around items-center px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center w-16 gap-1 group"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isActive 
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" 
                  : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              }`}>
                {item.name === "Chat" ? (
                  <img
                    src="/vanara-logo.png"
                    alt="Vanara AI"
                    className={`w-5 h-5 object-contain transition-transform group-active:scale-95 dark:invert ${
                      isActive ? "opacity-100 scale-110" : "opacity-40"
                    }`}
                  />
                ) : (
                  <Icon size={isActive ? 22 : 20} className="transition-transform group-active:scale-95" strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>
              <span className={`text-[9px] transition-colors ${
                isActive ? "font-black text-slate-900 dark:text-white" : "font-semibold text-slate-400 dark:text-slate-500"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
