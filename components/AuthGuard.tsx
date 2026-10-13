"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { setUserName } = useAppStore();

  useEffect(() => {
    // If already on the login page, allow rendering immediately
    if (pathname === "/login") {
      setIsAuthorized(true);
      setShowSplash(false);
      return;
    }

    const checkAuth = async () => {
      // 1. Check if OAuth redirect tokens exist in URL hash or query params
      if (typeof window !== "undefined") {
        const hash = window.location.hash;
        const search = window.location.search;
        if (hash.includes("access_token") || search.includes("code") || hash.includes("refresh_token")) {
          // Explicitly exchange PKCE auth code if present in query parameters
          const urlParams = new URLSearchParams(search);
          const code = urlParams.get("code");
          if (code) {
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code);
              if (data?.session?.user) {
                sessionStorage.setItem("bv-auth", "true");
                const userObj = data.session.user;
                const displayName = userObj.user_metadata?.full_name || 
                                    userObj.user_metadata?.name || 
                                    (userObj.email ? userObj.email.split("@")[0] : "Commuter");
                setUserName(displayName);
                setIsAuthorized(true);
                setShowSplash(false);
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
              }
            } catch (e) {
              console.warn("exchangeCodeForSession check:", e);
            }
          }

          // Allow Supabase OAuth client to parse tokens from hash/session
          for (let attempt = 0; attempt < 5; attempt++) {
            try {
              const { data } = await supabase.auth.getSession();
              if (data.session?.user) {
                sessionStorage.setItem("bv-auth", "true");
                const userObj = data.session.user;
                const displayName = userObj.user_metadata?.full_name || 
                                    userObj.user_metadata?.name || 
                                    (userObj.email ? userObj.email.split("@")[0] : "Commuter");
                setUserName(displayName);
                setIsAuthorized(true);
                setShowSplash(false);
                window.history.replaceState({}, document.title, window.location.pathname);
                return;
              }
            } catch (e) {
              console.warn("OAuth session parsing check:", e);
            }
            await new Promise(r => setTimeout(r, 300));
          }
        }
      }

      // 2. Check active Supabase session
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          sessionStorage.setItem("bv-auth", "true");
          const userObj = data.session.user;
          const displayName = userObj.user_metadata?.full_name || 
                              userObj.user_metadata?.name || 
                              (userObj.email ? userObj.email.split("@")[0] : "Commuter");
          setUserName(displayName);
          setIsAuthorized(true);
          setShowSplash(false);
          return;
        }
      } catch (e) {
        console.warn("Supabase getSession failed:", e);
      }

      // 3. Check sessionStorage authentication flags
      const isSessionAuth = sessionStorage.getItem("bv-auth") || sessionStorage.getItem("bv-guest");
      if (isSessionAuth) {
        setIsAuthorized(true);
        setShowSplash(false);
        return;
      }

      // 4. Check persistent local storage from Zustand
      try {
        const localStore = localStorage.getItem("bharat-vision-storage");
        if (localStore) {
          const parsed = JSON.parse(localStore);
          if (parsed?.state?.userName && parsed.state.userName !== "Guest") {
            sessionStorage.setItem("bv-auth", "true");
            setIsAuthorized(true);
            setShowSplash(false);
            return;
          }
        }
      } catch (e) {
        // ignore
      }

      // If not authenticated, redirect to /login
      router.replace("/login");
    };

    // Real-time Supabase auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        sessionStorage.setItem("bv-auth", "true");
        const userObj = session.user;
        const displayName = userObj.user_metadata?.full_name || 
                            userObj.user_metadata?.name || 
                            (userObj.email ? userObj.email.split("@")[0] : "Commuter");
        setUserName(displayName);
        setIsAuthorized(true);
        setShowSplash(false);
      } else if (event === "SIGNED_OUT") {
        sessionStorage.removeItem("bv-auth");
        sessionStorage.removeItem("bv-guest");
        if (pathname !== "/login") {
          setIsAuthorized(false);
          router.replace("/login");
        }
      }
    });

    const isOAuthRedirect = typeof window !== "undefined" && 
      (window.location.hash.includes("access_token") || 
       window.location.search.includes("code") || 
       window.location.hash.includes("refresh_token"));

    const hasSeenSplash = sessionStorage.getItem("bv-splash-seen");
    if (isOAuthRedirect) {
      sessionStorage.setItem("bv-splash-seen", "true");
      setShowSplash(false);
      checkAuth();
    } else if (!hasSeenSplash && pathname === "/") {
      const timer = setTimeout(() => {
        sessionStorage.setItem("bv-splash-seen", "true");
        setShowSplash(false);
        checkAuth();
      }, 1800);
      return () => {
        clearTimeout(timer);
        authListener?.subscription.unsubscribe();
      };
    } else {
      setShowSplash(false);
      checkAuth();
    }

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname, router, setUserName]);

  if (showSplash && pathname === "/") {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950"
        >
          <motion.div className="flex flex-col items-center">
            <motion.div className="w-24 h-24 bg-emerald-500 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center mb-6 relative overflow-hidden">
              <Zap size={44} className="text-slate-900 dark:text-white relative z-10" fill="currentColor" />
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

  // Prevent flash of unauthorized content
  if (!isAuthorized && pathname !== "/login") {
    return <div className="min-h-screen bg-slate-50 dark:bg-slate-950" />;
  }

  return <>{children}</>;
}
