"use client";

import { useEffect } from "react";

/**
 * MobileScrollLock
 * - Prevents mobile viewport lifting / rubber-band dragging.
 * - Prevents pinch-to-zoom and multi-touch zoom distortion that hides UI details.
 * - Translates 2-finger touch swipes on mobile touchscreens into smooth vertical scrolling,
 *   making 2-finger scrolling behave just like a laptop trackpad.
 * - Leaves single-finger touch scrolling completely native for full 120Hz momentum.
 */
export default function MobileScrollLock() {
  useEffect(() => {
    // Only engage mobile scroll lock on mobile screens (< 768px)
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      return;
    }

    let twoFingerStartY: number | null = null;
    let targetScrollContainer: HTMLElement | null = null;

    // Helper to find the nearest vertically scrollable parent container
    const findScrollableParent = (el: HTMLElement | null): HTMLElement | null => {
      let current = el;
      while (current && current !== document.body && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        const overflowY = style.overflowY;
        if (
          (overflowY === "auto" || overflowY === "scroll") &&
          current.scrollHeight > current.clientHeight
        ) {
          return current;
        }
        current = current.parentElement;
      }
      // Fallback: look for primary app view container
      return (
        document.querySelector<HTMLElement>(".overflow-y-auto") ||
        document.querySelector<HTMLElement>("main")
      );
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Average Y coordinate of both fingers
        twoFingerStartY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        targetScrollContainer = findScrollableParent(e.target as HTMLElement);
      } else {
        twoFingerStartY = null;
        targetScrollContainer = null;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // If user places 2 fingers on mobile screen
      if (e.touches.length === 2 && twoFingerStartY !== null) {
        // Prevent browser from treating this as pinch-to-zoom or viewport lifting
        if (e.cancelable) {
          e.preventDefault();
        }

        const currentY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const deltaY = twoFingerStartY - currentY;

        if (targetScrollContainer) {
          targetScrollContainer.scrollTop += deltaY;
        }

        twoFingerStartY = currentY;
      }
    };

    const handleTouchEnd = () => {
      twoFingerStartY = null;
      targetScrollContainer = null;
      // Guarantee window is always anchored at 0, 0
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    // Block Apple Safari / WebKit gesture zooming
    const handleGesture = (e: Event) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    // Ensure window never stays scrolled/lifted
    const handleScroll = () => {
      if (window.scrollY !== 0 || window.scrollX !== 0) {
        window.scrollTo(0, 0);
      }
    };

    // Register active & passive touch listeners
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    document.addEventListener("gesturestart", handleGesture);
    document.addEventListener("gesturechange", handleGesture);
    document.addEventListener("gestureend", handleGesture);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("scroll", handleScroll);

      document.removeEventListener("gesturestart", handleGesture);
      document.removeEventListener("gesturechange", handleGesture);
      document.removeEventListener("gestureend", handleGesture);
    };
  }, []);

  return null;
}
