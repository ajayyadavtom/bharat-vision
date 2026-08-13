"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import BottomNav from "@/components/navigation/BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    let isMounted = true;

    const verifyAccess = async () => {
      if (isLoginPage) {
        if (!isMounted) return;
        setIsAuthorized(true);
        setIsCheckingAccess(false);
        return;
      }

      const guestMode =
        sessionStorage.getItem("bv-guest") === "true" ||
        localStorage.getItem("bv-guest") === "true";
      if (guestMode) {
        if (!isMounted) return;
        setIsAuthorized(true);
        setIsCheckingAccess(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          setIsAuthorized(false);
          setIsCheckingAccess(false);
          router.replace("/login");
          return;
        }

        setIsAuthorized(true);
      } catch {
        if (!isMounted) return;
        setIsAuthorized(false);
        router.replace("/login");
      } finally {
        if (!isMounted) return;
        setIsCheckingAccess(false);
      }
    };

    setIsCheckingAccess(true);
    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [isLoginPage, router, pathname]);

  if (!isLoginPage && (isCheckingAccess || !isAuthorized)) {
    return null;
  }

  return (
    <>
      {children}
      {!isLoginPage && <BottomNav />}
    </>
  );
}
