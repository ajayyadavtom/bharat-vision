"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowDown, RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  threshold?: number;
}

export default function PullToRefresh({
  children,
  onRefresh,
  threshold = 68,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [pullStatus, setPullStatus] = useState<"idle" | "pulling" | "ready" | "refreshing">("idle");
  const [isPulling, setIsPulling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);

  // Check if any scrollable container or the window is currently scrolled down (> 0)
  const isScrolledDown = (el: HTMLElement | null): boolean => {
    if (typeof window !== "undefined" && (window.scrollY > 0 || window.pageYOffset > 0)) {
      return true;
    }
    let current: HTMLElement | null = el;
    while (current && current !== document.body && current !== document.documentElement) {
      if (current.scrollTop > 0) {
        return true;
      }
      current = current.parentElement;
    }
    // Also check primary scrollable page containers
    if (typeof document !== "undefined") {
      const scrollables = document.querySelectorAll<HTMLElement>(".overflow-y-auto, .overflow-y-scroll");
      for (let i = 0; i < scrollables.length; i++) {
        if (scrollables[i].scrollTop > 0) {
          return true;
        }
      }
    }
    return false;
  };

  // Exclude interactive elements like maps, text inputs, sliders
  const isExcludedElement = (el: HTMLElement | null, isMouse = false): boolean => {
    if (!el) return false;
    const isMapOrInput = Boolean(
      el.closest(".leaflet-container") ||
      el.closest(".mapboxgl-map") ||
      el.closest(".maplibregl-map") ||
      el.closest("input") ||
      el.closest("textarea") ||
      el.closest("select") ||
      el.closest('[role="slider"]')
    );
    if (isMapOrInput) return true;

    // For mouse clicks, prevent accidental drag triggers on clickable buttons & links
    if (isMouse) {
      return Boolean(el.closest("button") || el.closest("a") || el.closest('[role="button"]'));
    }

    return false;
  };

  const triggerHaptic = (ms: number = 20) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (e) {
        // Ignore vibration errors if unsupported or denied
      }
    }
  };

  const handleRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    setPullStatus("refreshing");
    setPullDistance(52); // Keep indicator visibly anchored during refresh

    triggerHaptic(30);

    try {
      if (onRefresh) {
        await onRefresh();
      } else {
        // Smooth delay so the user experiences the reassuring visual transition
        await new Promise((r) => setTimeout(r, 480));
        if (typeof window !== "undefined") {
          window.location.reload();
          return;
        }
      }
    } catch (err) {
      console.warn("Pull to refresh error:", err);
    } finally {
      setTimeout(() => {
        setPullDistance(0);
        setPullStatus("idle");
        setIsPulling(false);
        isRefreshingRef.current = false;
      }, 300);
    }
  }, [onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Single-finger Touch Handlers for Mobile ---
    const onTouchStart = (e: TouchEvent) => {
      if (isRefreshingRef.current) return;
      if (e.touches.length !== 1) {
        startYRef.current = null;
        return;
      }

      const target = e.target as HTMLElement;
      if (isExcludedElement(target, false)) {
        startYRef.current = null;
        return;
      }

      // If user is scrolled down anywhere in the page, do not engage pull-to-refresh
      if (isScrolledDown(target)) {
        startYRef.current = null;
        return;
      }

      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      setIsPulling(false);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (startYRef.current === null || isRefreshingRef.current) return;

      const target = e.target as HTMLElement;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = currentY - startYRef.current;
      const deltaX = Math.abs(currentX - (startXRef.current || 0));

      // If moving up (scrolling down into page) and not already pulling down, cancel gesture
      if (deltaY <= 0 && !isPulling) {
        startYRef.current = null;
        return;
      }

      // If user is swiping horizontally more than vertically, ignore
      if (deltaX > Math.abs(deltaY) && !isPulling) {
        startYRef.current = null;
        return;
      }

      // If the page is scrolled down at all, cancel pull-to-refresh
      if (isScrolledDown(target)) {
        if (isPulling) {
          setPullDistance(0);
          setPullStatus("idle");
          setIsPulling(false);
        }
        startYRef.current = null;
        return;
      }

      // Only pull down when at the top and pulling downward
      if (deltaY > 0) {
        // Prevent native overscroll jitter once pulling has begun
        if (deltaY > 6 && e.cancelable) {
          e.preventDefault();
        }

        // Apply progressive elastic damping
        const damped = Math.min(105, Math.pow(deltaY, 0.82) * 1.6);
        setPullDistance(damped);
        setIsPulling(true);

        if (damped >= threshold) {
          if (pullStatus !== "ready") {
            triggerHaptic(18);
            setPullStatus("ready");
          }
        } else {
          setPullStatus("pulling");
        }
      } else {
        if (isPulling) {
          setPullDistance(0);
          setPullStatus("idle");
          setIsPulling(false);
        }
      }
    };

    const onTouchEnd = () => {
      if (startYRef.current === null || isRefreshingRef.current) return;
      startYRef.current = null;
      startXRef.current = null;

      if (pullDistance >= threshold) {
        handleRefresh();
      } else {
        setPullDistance(0);
        setPullStatus("idle");
        setIsPulling(false);
      }
    };

    // --- Mouse Drag Support for Desktop & Touchpad ---
    const onMouseDown = (e: MouseEvent) => {
      if (isRefreshingRef.current || e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (isExcludedElement(target, true)) return;

      if (isScrolledDown(target)) {
        startYRef.current = null;
        return;
      }

      startYRef.current = e.clientY;
      startXRef.current = e.clientX;
      setIsPulling(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (startYRef.current === null || isRefreshingRef.current) return;

      const target = e.target as HTMLElement;
      const currentY = e.clientY;
      const currentX = e.clientX;
      const deltaY = currentY - startYRef.current;
      const deltaX = Math.abs(currentX - (startXRef.current || 0));

      if (deltaY <= 0 && !isPulling) {
        startYRef.current = null;
        return;
      }

      if (deltaX > Math.abs(deltaY) && !isPulling) {
        startYRef.current = null;
        return;
      }

      if (isScrolledDown(target)) {
        if (isPulling) {
          setPullDistance(0);
          setPullStatus("idle");
          setIsPulling(false);
        }
        startYRef.current = null;
        return;
      }

      if (deltaY > 6) {
        const damped = Math.min(105, Math.pow(deltaY, 0.82) * 1.6);
        setPullDistance(damped);
        setIsPulling(true);

        if (damped >= threshold) {
          setPullStatus("ready");
        } else {
          setPullStatus("pulling");
        }
      }
    };

    const onMouseUp = () => {
      if (startYRef.current === null || isRefreshingRef.current) return;
      startYRef.current = null;
      startXRef.current = null;

      if (pullDistance >= threshold) {
        handleRefresh();
      } else {
        setPullDistance(0);
        setPullStatus("idle");
        setIsPulling(false);
      }
    };

    // Touch listeners
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });

    // Desktop mouse listeners
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);

      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [threshold, pullDistance, pullStatus, isPulling, handleRefresh]);

  const rotationDeg = Math.min(180, (pullDistance / threshold) * 180);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${isPulling ? "select-none cursor-grabbing" : ""}`}
    >
      {/* Floating Pull-to-Refresh Indicator Capsule */}
      <div
        style={{
          transform: `translate3d(-50%, ${
            pullDistance > 0 ? Math.min(pullDistance, 70) - 52 : -60
          }px, 0)`,
          opacity: pullDistance > 10 ? Math.min(1, (pullDistance - 8) / 30) : 0,
          transition: isPulling ? "none" : "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="fixed top-3 md:top-20 left-1/2 z-[999] pointer-events-none select-none"
      >
        <div
          className={`backdrop-blur-xl border shadow-2xl rounded-full px-4 py-2 flex items-center gap-2.5 transition-all duration-200 ${
            pullStatus === "ready" || pullStatus === "refreshing"
              ? "bg-emerald-500/95 text-white border-emerald-400 shadow-emerald-500/30 scale-105"
              : "bg-white/95 dark:bg-slate-900/95 border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 shadow-slate-900/10"
          }`}
        >
          {pullStatus === "refreshing" ? (
            <>
              <RefreshCw size={15} className="text-white animate-spin" />
              <span className="text-xs font-black tracking-tight">
                Refreshing page...
              </span>
            </>
          ) : pullStatus === "ready" ? (
            <>
              <div className="w-4 h-4 rounded-full bg-white/25 flex items-center justify-center text-white text-[10px] font-black animate-bounce">
                ✓
              </div>
              <span className="text-xs font-black tracking-tight">
                Release to refresh
              </span>
            </>
          ) : (
            <>
              <ArrowDown
                size={15}
                className="text-slate-500 dark:text-slate-400 transition-transform duration-75"
                style={{
                  transform: `rotate(${rotationDeg}deg)`,
                }}
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Pull down to refresh
              </span>
            </>
          )}
        </div>
      </div>

      {/* Dynamic Elastic Content Wrapper */}
      <div
        style={{
          transform:
            pullDistance > 0 ? `translate3d(0, ${pullDistance * 0.42}px, 0)` : undefined,
          transition: isPulling ? "none" : "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: pullDistance > 0 ? "transform" : "auto",
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
}
