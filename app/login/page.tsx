"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Lock, Zap, User, Loader2, ArrowRight, Eye, EyeOff, Phone, KeyRound } from "lucide-react";
import { supabase } from "../../src/lib/supabase";

type LoginMode = "email" | "phone";

export default function LoginScreen() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<LoginMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (loginMode === "phone") {
        if (!otpSent) {
          // Send OTP
          const { error } = await supabase.auth.signInWithOtp({
            phone: phone,
            options: { shouldCreateUser: true },
          });
          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }
          setOtpSent(true);
          setError(null);
        } else {
          // Verify OTP
          const { data, error } = await supabase.auth.verifyOtp({
            phone: phone,
            token: otp,
            type: "sms",
          });
          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }
          if (data.user) {
            router.push("/");
          }
        }
      } else {
        // Email login/signup
        if (isSignUp) {
          const { data, error } = await supabase.auth.signUp({ email, password });
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
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            setError(error.message);
            setLoading(false);
            return;
          }
          if (data.user) {
            router.push("/");
          }
        }
      }
    } catch (err: any) {
      setError(err?.message || "Connection error. Try Continue as Guest.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        setError(error.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setError("Google login failed. Try email or Continue as Guest.");
      setGoogleLoading(false);
    }
  };

  const handleGuestLogin = () => {
    sessionStorage.setItem("bv-guest", "true");
    router.push("/");
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Enter your email first, then click Forgot Password.");
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });
      if (error) {
        setError(error.message);
      } else {
        alert("Password reset link sent to your email!");
      }
    } catch (err: any) {
      setError("Could not send reset email. Try again later.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface-black px-6 py-12 justify-center relative">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm mx-auto relative z-10">
        {/* Logo */}
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

        {/* Error box */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs p-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        {/* Mode Toggle — Email vs Phone */}
        <div className="flex bg-surface-dark p-1 rounded-xl mb-6 border border-brand-dark">
          <button
            type="button"
            onClick={() => { setLoginMode("email"); setError(null); setOtpSent(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${loginMode === "email" ? "bg-brand-dark text-white shadow-md" : "text-gray-400"}`}
          >
            <Mail size={14} /> Email
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode("phone"); setError(null); setOtpSent(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${loginMode === "phone" ? "bg-brand-dark text-white shadow-md" : "text-gray-400"}`}
          >
            <Phone size={14} /> Mobile
          </button>
        </div>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {loginMode === "email" ? (
            <>
              {/* Email field */}
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

              {/* Password field with eye icon */}
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-brand-light transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot Password */}
              {!isSignUp && (
                <div className="text-right -mt-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-brand-light hover:text-brand-accent transition-colors font-semibold"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-2xl shadow-[0_5px_20px_rgba(20,184,166,0.3)] active:scale-95 transition-transform mt-1 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>{isSignUp ? "Create Commuter ID" : "Secure Login"} <ArrowRight size={18} /></>}
              </button>
            </>
          ) : (
            <>
              {/* Phone field */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-500 group-focus-within:text-brand-light transition-colors" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={otpSent}
                  className="w-full bg-surface-dark/80 backdrop-blur-md text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-surface-dark focus:border-brand-base transition-all shadow-md placeholder-gray-500 text-sm disabled:opacity-50"
                  placeholder="+91 98765 43210"
                />
              </div>

              {otpSent && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <KeyRound size={18} className="text-gray-500 group-focus-within:text-brand-light transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full bg-surface-dark/80 backdrop-blur-md text-white rounded-2xl py-4 pl-12 pr-4 outline-none border border-surface-dark focus:border-brand-base transition-all shadow-md placeholder-gray-500 text-sm text-center tracking-[0.5em] font-bold"
                    placeholder="Enter 6-digit OTP"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-accent text-brand-dark font-black py-4 rounded-2xl shadow-[0_5px_20px_rgba(20,184,166,0.3)] active:scale-95 transition-transform mt-1 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>{otpSent ? "Verify OTP & Login" : "Send OTP"} <ArrowRight size={18} /></>}
              </button>
            </>
          )}
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

        {/* Register toggle */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setOtpSent(false); }}
            className="text-xs text-gray-400 hover:text-white transition-colors font-semibold"
          >
            {isSignUp ? "Already have an ID? Sign In" : "Need a Commuter ID? Register"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
