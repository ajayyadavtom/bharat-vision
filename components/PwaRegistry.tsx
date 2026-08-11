"use client";

import { useEffect } from "react";

export default function PwaRegistry() {
  useEffect(() => {
    // Only register if the browser supports Service Workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Offline Engine Active. Scope:', registration.scope);
        })
        .catch((error) => {
          console.error('❌ Offline Engine Failed:', error);
        });
    }
  }, []);

  // This component renders absolutely nothing to the screen
  return null; 
}