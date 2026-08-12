"use client";

import { useEffect, useRef, useState } from "react";
import { Navigation, MapPin, ArrowUp, X, Scan, ShieldCheck, VideoOff } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ARNavigatorScreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [distance, setDistance] = useState(120); // Simulated distance to platform in meters

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Request rear-facing camera for AR view
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera access denied or unavailable:", err);
        setHasPermission(false);
      }
    };

    startCamera();

    // Simulate walking towards the platform by decreasing distance
    const interval = setInterval(() => {
      setDistance((prev) => (prev > 5 ? prev - 2 : 0));
    }, 2000);

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden flex flex-col font-sans">
      
      {/* Live Camera Feed Background */}
      {hasPermission ? (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : hasPermission === false ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-black z-0 px-6 text-center">
          <VideoOff size={48} className="text-gray-600 mb-4" />
          <h3 className="text-white font-bold text-lg mb-2">Camera Access Required</h3>
          <p className="text-gray-400 text-xs">Please allow camera permissions in your browser to use the AR Spatial Navigator.</p>
        </div>
      ) : null}

      {/* AR Gradient Overlays for Readability */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none"></div>

      {/* Top HUD Overlay */}
      <div className="relative z-20 flex justify-between items-start p-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-[10px] font-bold tracking-widest text-white uppercase drop-shadow-md">
              Live AR Tracking
            </span>
          </div>
          <h2 className="text-2xl font-black text-white drop-shadow-lg">Platform 3</h2>
          <p className="text-xs font-bold text-brand-light drop-shadow-md">Purple Line Towards Whitefield</p>
        </div>
        
        <Link href="/" className="bg-black/40 backdrop-blur-md p-3 rounded-full border border-white/20 text-white hover:bg-black/60 transition-colors">
          <X size={20} />
        </Link>
      </div>

      {/* Center AR Waypoint Marker */}
      {hasPermission && (
        <div className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Floating Directional Chevron */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="bg-brand-accent/20 backdrop-blur-md p-4 rounded-full border-2 border-brand-accent shadow-[0_0_30px_rgba(20,184,166,0.6)] mb-4"
            >
              <ArrowUp size={48} className="text-brand-accent drop-shadow-lg" />
            </motion.div>

            {/* Target Information */}
            <div className="bg-black/60 backdrop-blur-md border border-brand-base/50 px-6 py-3 rounded-2xl flex flex-col items-center">
              <span className="text-[10px] text-brand-light font-bold uppercase tracking-widest mb-1">
                Distance to Target
              </span>
              <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                {distance} <span className="text-lg text-gray-300">m</span>
              </span>
            </div>
          </motion.div>

          {/* Scanning Reticle */}
          <Scan size={300} className="absolute text-white/10" strokeWidth={1} />
        </div>
      )}

      {/* Bottom HUD Information */}
      <div className="relative z-20 p-6 mt-auto">
        <div className="bg-surface-dark/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
              <MapPin size={24} className="text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Majestic Interchange</h4>
              <p className="text-xs text-gray-400 mt-0.5">Proceed straight towards Concourse A</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <ShieldCheck size={18} className="text-emerald-400 mb-1" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Secure Path</span>
          </div>
        </div>
      </div>

    </div>
  );
}