"use client";

import { Home, Map as MapIcon, QrCode, MessageCircle, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Clean, uniform 5-item array with SafeKeep restored
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Track", href: "/track", icon: MapIcon },
    { name: "Pass", href: "/pass", icon: QrCode },
    { name: "Chat", href: "/chat", icon: MessageCircle }, 
    { name: "SafeKeep", href: "/safety", icon: ShieldAlert },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-surface-black/95 backdrop-blur-md border-t border-surface-dark pb-safe pt-2 px-2 z-50">
      <div className="flex w-full justify-between items-center max-w-md mx-auto relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link href={item.href} key={item.name} className="flex-1 flex flex-col items-center gap-1 p-2">
              <Icon
                size={22}
                className={`transition-colors ${isActive ? "text-brand-accent" : "text-gray-500 hover:text-gray-400"}`}
              />
              <span className={`text-[10px] font-semibold ${isActive ? "text-brand-accent" : "text-gray-500"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}