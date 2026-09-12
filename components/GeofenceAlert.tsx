"use client";

import { useEffect, useState } from "react";
import { BellRing, MapPin, Volume2, Vibrate } from "lucide-react";

// Made props OPTIONAL so it works globally in layout.tsx without arguments
interface GeofenceAlertProps {
  destinationName?: string;
  targetLat?: number;
  targetLng?: number;
}

export default function GeofenceAlert({
  destinationName = "Destination",
  targetLat = 12.9716,
  targetLng = 77.5946
}: GeofenceAlertProps) {
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [activeTracking, setActiveTracking] = useState(false);

  useEffect(() => {
    if (!activeTracking || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;

        // Haversine formula to calculate real-world distance in meters
        const R = 6371e3;
        const φ1 = (currentLat * Math.PI) / 180;
        const φ2 = (targetLat * Math.PI) / 180;
        const Δφ = ((targetLat - currentLat) * Math.PI) / 180;
        const Δλ = ((targetLng - currentLng) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        setDistanceMeters(Math.round(distance));

        if (distance <= 300 && !alertTriggered) {
          setAlertTriggered(true);

          if (navigator.vibrate) {
            navigator.vibrate([500, 200, 500, 200, 800]);
          }

          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(
              `Alert. Approaching ${destinationName}. Please prepare to deboard at the next stop.`
            );
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
          }
        }
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [activeTracking, targetLat, targetLng, destinationName, alertTriggered]);

  return (
    <div className="bg-surface-dark border border-slate-200 dark:border-brand-dark p-5 rounded-3xl shadow-lg my-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-brand-accent" />
          <h4 className="text-slate-900 dark:text-white font-bold text-sm">Geofence Deboarding Guard</h4>
        </div>
        <button
          onClick={() => {
            setActiveTracking(!activeTracking);
            setAlertTriggered(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTracking
              ? "bg-red-500/20 text-red-400 border border-red-500"
              : "bg-brand-accent text-brand-dark"
          }`}
        >
          {activeTracking ? "Stop Guard" : "Activate Guard (300m)"}
        </button>
      </div>

      {activeTracking ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-slate-500 dark:text-gray-400">
            Monitoring proximity to <strong className="text-slate-900 dark:text-white">{destinationName}</strong>...
          </p>
          {distanceMeters !== null ? (
            <div className="flex justify-between items-center bg-surface-black p-3 rounded-xl border border-slate-200 dark:border-surface-dark">
              <span className="text-xs text-slate-600 dark:text-gray-300">Distance to destination:</span>
              <span className={`text-xs font-mono font-bold ${distanceMeters <= 300 ? "text-amber-400 animate-pulse" : "text-brand-accent"}`}>
                {distanceMeters} meters
              </span>
            </div>
          ) : (
            <p className="text-[10px] text-gray-500 italic">Acquiring high-accuracy GPS signal...</p>
          )}

          {alertTriggered && (
            <div className="bg-amber-500/20 border border-amber-500 p-3 rounded-xl flex items-center gap-2 text-amber-300 text-xs mt-2">
              <BellRing size={16} className="animate-bounce" />
              <span>Geofence breached! Vibration & voice warning dispatched.</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Activate this guard during your bus or metro commute to receive automated vibration and voice alerts 300 meters before your stop.
        </p>
      )}
    </div>
  );
}
