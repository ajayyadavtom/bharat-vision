"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Zap } from "lucide-react";

// STRICT ALIAS PATH: Connects directly to your existing src/lib/supabase.ts
import { supabase } from "@/lib/supabase"; 

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Creates the user in Supabase Auth
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Commuter ID created successfully! Please sign in.");
        setIsSignUp(false);
      } else {
        // Logs the user in and generates the secure JWT session token
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        // Push the user to the Bharat Vision Home Dashboard
        router.push("/");
      }
    } catch (error: any) {
      alert(`Authentication Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-black px-6 py-12 justify-center relative">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm mx-auto relative z-10"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-brand-base to-brand-dark rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center justify-center mb-4 border border-brand-light/20 relative overflow-hidden">
            <Zap size={32} className="text-white relative z-10" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Bharat <span className="text-brand-accent">Vision</span>
          </h1>
          <p className="text-xs text-gray-400 mt-2 font-bold uppercase tracking-widest flex items-center gap-1">
            <ShieldCheck size={14} className="text-brand-accent" /> Secure Commuter Portal
          </p>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-500 group-focus-within:text-brand-light transition-colors" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-dark/80 backdrop-blur-md text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-surface-dark focus:border-brand-base transition-all shadow-md placeholder-gray-500 text-sm"
              placeholder="Commuter Email"
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-500 group-focus-within:text-brand-light transition-colors" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-dark/80 backdrop-blur-md text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-surface-dark focus:border-brand-base transition-all shadow-md placeholder-gray-500 text-sm"
              placeholder="Password"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-2xl shadow-[0_5px_20px_rgba(20,184,166,0.3)] active:scale-95 transition-transform mt-2 disabled:opacity-50"
          >
            {loading ? "Authenticating..." : (isSignUp ? "Create Commuter ID" : "Secure Login")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-gray-400 hover:text-white transition-colors font-semibold"
          >
            {isSignUp ? "Already have an ID? Sign In" : "Need a Commuter ID? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}