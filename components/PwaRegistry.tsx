"use client";

import { useEffect } from "react";

export default function PwaRegistry() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      }).catch((err) => {
        console.log("SW registration failed:", err);
      });
    }
  }, []);

  return null;
}
