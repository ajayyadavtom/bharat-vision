"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if on login page
    if (pathname === "/login") {
      setIsAuthorized(true);
      setShowSplash(false);
      return;
    }

    const hasSeenSplash = sessionStorage.getItem("bv-splash-seen");
    const checkAuth = () => {
      const isAuthenticated = sessionStorage.getItem("bv-auth") || sessionStorage.getItem("bv-guest");
      if (!isAuthenticated) {
        router.replace("/login");
      } else {
        setIsAuthorized(true);
      }
    };

    if (!hasSeenSplash && pathname === "/") {
      // First visit splash screen
      const timer = setTimeout(() => {
        sessionStorage.setItem("bv-splash-seen", "true");
        setShowSplash(false);
        checkAuth();
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
      checkAuth();
    }
  }, [pathname, router]);

  if (showSplash && pathname === "/") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950"
        >
          <motion.div className="flex flex-col items-center">
            <motion.div className="w-24 h-24 bg-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center mb-6 relative overflow-hidden">
              <Zap size={44} className="text-white relative z-10" fill="currentColor" />
            </motion.div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Bharat <span className="text-emerald-500">Vision</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold tracking-[0.3em] uppercase">
              Smart Transit
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // If not authorized and not on login, don't render children to prevent flash
  if (!isAuthorized && pathname !== "/login") {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  return <>{children}</>;
}
