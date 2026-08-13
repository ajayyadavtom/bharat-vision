"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Zap, User, Loader2, ArrowRight, Smartphone, Eye, EyeOff } from "lucide-react";
import { supabase } from "../../src/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<"email" | "phone">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getErrorMessage = (err: unknown) => (err instanceof Error ? err.message : "Connection error. Try Continue as Guest.");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authPayload = authMode === "email"
        ? { email: identifier, password }
        : { phone: identifier, password };

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp(authPayload);
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        if (data.user) {
          alert("Commuter ID created! You can now sign in.");
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword(authPayload);
        if (error) {
          setError(error.message);
          setLoading(false);
          return;
        }
        if (data.user) {
          sessionStorage.removeItem("bv-guest");
          router.push("/");
        }
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    sessionStorage.removeItem("bv-guest");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch {
      setError("Google login not configured. Use email or Continue as Guest.");
      setGoogleLoading(false);
    }
  };

    const handleGuestLogin = () => {
    sessionStorage.setItem("bv-guest", "true");
    router.push("/");
  };


  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-surface-black px-6 py-12 justify-center relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto relative z-10">
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

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            type="button"
            onClick={() => {
              setAuthMode("email");
              setIdentifier("");
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
              authMode === "email"
                ? "bg-brand-dark border-brand-base text-brand-accent"
                : "bg-surface-dark border-surface-dark text-gray-400"
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("phone");
              setIdentifier("");
              setError(null);
            }}
            className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
              authMode === "phone"
                ? "bg-brand-dark border-brand-base text-brand-accent"
                : "bg-surface-dark border-surface-dark text-gray-400"
            }`}
          >
            Phone
          </button>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              {authMode === "email" ? (
                <Mail size={18} className="text-gray-500 group-focus-within:text-brand-light transition-colors" />
              ) : (
                <Smartphone size={18} className="text-gray-500 group-focus-within:text-brand-light transition-colors" />
              )}
            </div>
            <input
              type={authMode === "email" ? "email" : "tel"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full bg-surface-dark/80 backdrop-blur-md text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-surface-dark focus:border-brand-base transition-all shadow-md placeholder-gray-500 text-sm"
              placeholder={authMode === "email" ? "Commuter Email" : "Phone Number (+91...)"}
            />
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-500 group-focus-within:text-brand-light transition-colors" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-dark/80 backdrop-blur-md text-white rounded-2xl py-4 pl-12 pr-12 outline-none border border-surface-dark focus:border-brand-base transition-all shadow-md placeholder-gray-500 text-sm"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-2xl shadow-[0_5px_20px_rgba(20,184,166,0.3)] active:scale-95 transition-transform mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>{isSignUp ? "Create Commuter ID" : "Secure Login"} <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-surface-dark flex-1"></div>
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Or</span>
          <div className="h-px bg-surface-dark flex-1"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-transform flex justify-center items-center gap-3 mb-3 disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )}
          Continue with Google
        </button>

        {/* Guest Login */}
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full bg-surface-dark/80 backdrop-blur-md border border-brand-dark/50 hover:border-brand-base text-white font-bold py-4 rounded-2xl shadow-md active:scale-95 transition-all flex justify-center items-center gap-2"
        >
          <User size={18} className="text-gray-400" />
          Continue as Guest
        </button>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-gray-400 hover:text-white transition-colors font-semibold"
          >
            {isSignUp ? "Already have an ID? Sign In" : "Need a Commuter ID? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
