"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, QrCode, MessageSquare, ShieldAlert } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-black/95 backdrop-blur-lg border-t border-white/5 pt-2 pb-2 z-[100]">
        <div className="flex justify-around items-center px-2">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <Home size={20} className={pathname === "/" ? "text-white" : "text-gray-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/" ? "text-white" : "text-gray-500"}`}>Home</span>
          </Link>

          <Link href="/track" className="flex flex-col items-center gap-0.5">
            <Map size={20} className={pathname === "/track" ? "text-white" : "text-gray-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/track" ? "text-white" : "text-gray-500"}`}>Track</span>
          </Link>

          <Link href="/pass" className="flex flex-col items-center gap-0.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${pathname === "/pass" ? "bg-brand-accent text-brand-dark" : "bg-brand-dark text-brand-accent"}`}>
              <QrCode size={18} />
            </div>
            <span className={`text-[9px] font-bold ${pathname === "/pass" ? "text-brand-accent" : "text-gray-500"}`}>Pass</span>
          </Link>

          <Link href="/chat" className="flex flex-col items-center gap-0.5">
            <MessageSquare size={20} className={pathname === "/chat" ? "text-white" : "text-gray-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/chat" ? "text-white" : "text-gray-500"}`}>Chat</span>
          </Link>

          <Link href="/safety" className="flex flex-col items-center gap-0.5">
            <ShieldAlert size={20} className={pathname === "/safety" ? "text-white" : "text-gray-500"} />
            <span className={`text-[9px] font-bold ${pathname === "/safety" ? "text-white" : "text-gray-500"}`}>SafeKeep</span>
          </Link>
        </div>
      </div>
    </>
  );
}
