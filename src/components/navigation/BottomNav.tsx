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
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-white/5 pt-2 pb-2 z-[100]">
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
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}>
                <Icon size={isActive ? 22 : 20} className="transition-transform group-active:scale-95" />
              </div>
              <span className={`text-[9px] font-bold ${
                isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"
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
