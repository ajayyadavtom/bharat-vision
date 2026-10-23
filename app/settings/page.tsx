"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Shield, 
  User, 
  ChevronRight, 
  Terminal, 
  LogOut, 
  X, 
  Activity, 
  Server, 
  Code,
  Volume2,
  Smartphone,
  Mic,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Info,
  Send,
  Tag
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/lib/store";
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  sendSystemNotification, 
  playTransitChime, 
  triggerVibration, 
  speakAnnouncement,
  NotificationPermissionStatus 
} from "@/lib/notifications";

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { 
    privacyLiveLocation, 
    setPrivacyLiveLocation, 
    privacyCamera, 
    setPrivacyCamera,
    notificationSettings,
    setNotificationSettings,
    appLang, 
    setAppLang 
  } = useAppStore();
  
  // Modals state
  const [activeModal, setActiveModal] = useState<"terminal" | "notifications" | "language" | "privacy" | null>(null);
  
  // Notification permission & test states
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>("default");
  const [testToast, setTestToast] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const lang = appLang;

  const t = {
    en: {
      settings: 'Settings',
      profile: 'Profile & Account',
      manageId: 'Manage your identity',
      appearance: 'Appearance',
      theme: 'Dark/Light Theme',
      notifications: 'Notifications',
      alerts: 'Alerts, Chimes & Offers',
      appLang: 'App Language',
      english: 'English',
      privacy: 'Privacy & Data',
      security: 'Security & Telemetry',
      devConsole: 'Developer Console',
      advDebug: 'Advanced debugging',
      signOut: 'Sign Out',
      pushAlerts: 'Push Notifications',
      pushDesc: 'Lockscreen & system tray alerts',
      proximity: 'Proximity Chimes',
      proxDesc: 'Alert & vibrate when stop is ~300m away',
      deviations: 'Route Deviations',
      devDesc: 'Alert if bus detours off planned corridor',
      soundChimes: 'Transit Audio Chimes',
      soundDesc: '2-tone synthesized arrival chime (D5/A5)',
      vibration: 'Haptic Vibration',
      vibDesc: 'Physical vibration pattern on devices',
      voiceAnnounce: 'Voice Deboarding Guidance',
      voiceDesc: 'Speech synthesis upcoming stop announcements',
      marketing: 'Pass Discounts & Offers',
      markDesc: 'Concessions, passes & karma alerts',
      testNotif: 'Send Test Notification',
      permGranted: 'Active & Granted',
      permBlocked: 'Blocked in Browser',
      permDefault: 'Enable Browser Alerts',
      dataSecured: 'Your data is secured with AES-256 encryption.',
      liveLoc: 'Live Location Telemetry',
      liveLocDesc: 'Used for crowd-sourcing ETAs',
      camAccess: 'Camera Access',
      camDesc: 'Required for OCR uploads',
      delAcc: 'Delete My Account & Data',
      kannada: 'ಕನ್ನಡ (Kannada)',
      hindi: 'हिन्दी (Hindi)'
    },
    kn: {
      settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
      profile: 'ಪ್ರೊಫೈಲ್ ಮತ್ತು ಖಾತೆ',
      manageId: 'ನಿಮ್ಮ ಗುರುತನ್ನು ನಿರ್ವಹಿಸಿ',
      appearance: 'ಗೋಚರತೆ',
      theme: 'ಡಾರ್ಕ್/ಲೈಟ್ ಥೀಮ್',
      notifications: 'ಅಧಿಸೂಚನೆಗಳು',
      alerts: 'ಎಚ್ಚರಿಕೆಗಳು, ಕೊಡುಗೆಗಳು',
      appLang: 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ',
      english: 'ಆಂಗ್ಲ',
      privacy: 'ಗೌಪ್ಯತೆ ಮತ್ತು ಡೇಟಾ',
      security: 'ಭದ್ರತೆ ಮತ್ತು ಟೆಲಿಮೆಟ್ರಿ',
      devConsole: 'ಡೆವಲಪರ್ ಕನ್ಸೋಲ್',
      advDebug: 'ಸುಧಾರಿತ ಡಿಬಗ್ಗಿಂಗ್',
      signOut: 'ಸೈನ್ ಔಟ್',
      pushAlerts: 'ಪುಶ್ ಅಧಿಸೂಚನೆಗಳು',
      pushDesc: 'ಲಾಕ್‌ಸ್ಕ್ರೀನ್ ಮತ್ತು ಸಿಸ್ಟಮ್ ಎಚ್ಚರಿಕೆಗಳು',
      proximity: 'ಸಾಮೀಪ್ಯ ಚೈಮ್ಸ್',
      proxDesc: 'ನಿಲುಗಡೆ 300 ಮೀಟರ್ ಸಮೀಪವಿದ್ದಾಗ ಎಚ್ಚರಿಸಿ',
      deviations: 'ಮಾರ್ಗ ವಿಚಲನಗಳು',
      devDesc: 'ಬಸ್ ಮಾರ್ಗ ಬದಲಿಸಿದರೆ ಎಚ್ಚರಿಸಿ',
      soundChimes: 'ಧ್ವನಿ ಚೈಮ್ಸ್',
      soundDesc: 'ಆಗಮನಕ್ಕೆ ಮಧುರ ಧ್ವನಿ (D5/A5)',
      vibration: 'ಕಂಪನ (Haptics)',
      vibDesc: 'ಮೌನ ಎಚ್ಚರಿಕೆಗಳಿಗೆ ಮೊಬೈಲ್ ಕಂಪನ',
      voiceAnnounce: 'ಧ್ವನಿ ಪ್ರಕಟಣೆಗಳು',
      voiceDesc: 'ಮುಂದಿನ ನಿಲ್ದಾಣದ ಮಾತನಾಡುವ ಮಾರ್ಗದರ್ಶನ',
      marketing: 'ಪಾಸ್ ರಿಯಾಯಿತಿಗಳು',
      markDesc: 'ರಿಯಾಯಿತಿಗಳು ಮತ್ತು ಕೊಡುಗೆಗಳು',
      testNotif: 'ಪರೀಕ್ಷಾ ಅಧಿಸೂಚನೆ ಕಳುಹಿಸಿ',
      permGranted: 'ಸಕ್ರಿಯ ಮತ್ತು ಅನುಮೋದಿಸಲಾಗಿದೆ',
      permBlocked: 'ಬ್ರೌಸರ್‌ನಲ್ಲಿ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ',
      permDefault: 'ಅಧಿಸೂಚನೆ ಸಕ್ರಿಯಗೊಳಿಸಿ',
      dataSecured: 'ನಿಮ್ಮ ಡೇಟಾವನ್ನು ಸುರಕ್ಷಿತಗೊಳಿಸಲಾಗಿದೆ.',
      liveLoc: 'ಲೈವ್ ಸ್ಥಳ',
      liveLocDesc: 'ETA ಗಳಿಗಾಗಿ ಬಳಸಲಾಗುತ್ತದೆ',
      camAccess: 'ಕ್ಯಾಮೆರಾ ಪ್ರವೇಶ',
      camDesc: 'OCR ಗಾಗಿ ಅಗತ್ಯವಿದೆ',
      delAcc: 'ನನ್ನ ಖಾತೆಯನ್ನು ಅಳಿಸಿ',
      kannada: 'ಕನ್ನಡ (Kannada)',
      hindi: 'ಹಿಂದಿ (Hindi)'
    },
    hi: {
      settings: 'सेटिंग्स',
      profile: 'प्रोफ़ाइल और खाता',
      manageId: 'अपनी पहचान प्रबंधित करें',
      appearance: 'दिखावट',
      theme: 'डार्क/लाइट थीम',
      notifications: 'सूचनाएं',
      alerts: 'अलर्ट, चाइम्स और ऑफ़र',
      appLang: 'ऐप की भाषा',
      english: 'अंग्रेज़ी',
      privacy: 'गोपनीयता और डेटा',
      security: 'सुरक्षा और टेलीमेट्री',
      devConsole: 'डेवलपर कंसोल',
      advDebug: 'उन्नत डिबगिंग',
      signOut: 'साइन आउट',
      pushAlerts: 'पुश सूचनाएं',
      pushDesc: 'लॉकस्क्रीन और सिस्टम ट्रे अलर्ट',
      proximity: 'प्रॉक्सिमिटी चाइम्स',
      proxDesc: 'स्टॉप 300 मीटर पास होने पर अलर्ट और कंपन',
      deviations: 'रूट विचलन',
      devDesc: 'बस के रास्ता बदलने पर तुरंत अलर्ट करें',
      soundChimes: 'ट्रांजिट ऑडियो चाइम्स',
      soundDesc: 'मधुर 2-टोन आगमन चाइम (D5/A5)',
      vibration: 'हैप्टिक कंपन',
      vibDesc: 'साइलेंट अलर्ट के लिए मोबाइल कंपन',
      voiceAnnounce: 'वॉयस घोषणाएं',
      voiceDesc: 'आवाज द्वारा अगले स्टॉप का मार्गदर्शन',
      marketing: 'पास छूट और ऑफ़र',
      markDesc: 'रियायती पास और कर्मा रिवार्ड्स',
      testNotif: 'परीक्षण सूचना भेजें',
      permGranted: 'सक्रिय और स्वीकृत',
      permBlocked: 'ब्राउज़र में अवरुद्ध है',
      permDefault: 'ब्राउज़र अलर्ट चालू करें',
      dataSecured: 'आपका डेटा सुरक्षित है।',
      liveLoc: 'लाइव लोकेशन',
      liveLocDesc: 'ईटीए के लिए उपयोग किया जाता है',
      camAccess: 'कैमरा एक्सेस',
      camDesc: 'ओसीआर के लिए आवश्यक',
      delAcc: 'मेरा खाता हटाएं',
      kannada: 'कन्नड़ (Kannada)',
      hindi: 'हिन्दी (Hindi)'
    }
  };


  // Prevent hydration mismatch & sync browser permission status
  useEffect(() => {
    setMounted(true);
    setPermissionStatus(getNotificationPermission());
  }, []);

  const handleRequestPermission = async () => {
    const status = await requestNotificationPermission();
    setPermissionStatus(status);
    if (status === "granted") {
      setNotificationSettings({ pushEnabled: true });
      sendSystemNotification("Bharat Vision • Notifications Enabled! 🎉", {
        body: "Proximity chimes, route deviations, and live transit alerts are active.",
        icon: "/icon.png"
      });
      setTestToast("Push notifications enabled & active!");
      setTimeout(() => setTestToast(null), 3500);
    }
  };

  const handleTestNotification = async () => {
    setIsTesting(true);

    // 1. Audio transit chime
    if (notificationSettings?.soundChimes) {
      playTransitChime();
    }

    // 2. Physical haptic vibration
    if (notificationSettings?.vibration) {
      triggerVibration([250, 100, 250]);
    }

    // 3. Voice deboarding announcement
    if (notificationSettings?.voiceAnnouncements) {
      speakAnnouncement("Approaching Kempegowda Majestic Station. Please prepare to deboard.");
    }

    // 4. System lockscreen / browser push notification
    let pushDelivered = false;
    if (notificationSettings?.pushEnabled && permissionStatus === "granted") {
      pushDelivered = await sendSystemNotification("Bharat Vision • Live Transit Alert 🔔", {
        body: "Approaching Kempegowda Majestic Station (~300m). Route 500D is on schedule.",
        tag: "test-alert",
        icon: "/icon.png"
      });
    }

    if (pushDelivered) {
      setTestToast("Test alert delivered to system tray & audio chime played!");
    } else if (permissionStatus === "denied") {
      setTestToast("Chime & vibration tested! (Browser blocked push notifications)");
    } else if (permissionStatus === "default") {
      setTestToast("Chime & vibration tested! Tap 'Enable Browser Alerts' for system push.");
    } else {
      setTestToast("Test chime and haptics triggered successfully!");
    }

    setTimeout(() => {
      setIsTesting(false);
      setTimeout(() => setTestToast(null), 3500);
    }, 600);
  };

  const handleLogout = async () => {
    // Preserve active profile picture in durable cache before session reset
    if (typeof window !== "undefined") {
      try {
        const state = useAppStore.getState();
        if (state.profilePictureUrl && !state.profilePictureUrl.startsWith("blob:")) {
          const cache = JSON.parse(localStorage.getItem("bv_user_avatars") || "{}");
          cache["last"] = state.profilePictureUrl;
          if (state.userName) cache[state.userName] = state.profilePictureUrl;
          localStorage.setItem("bv_user_avatars", JSON.stringify(cache));
        }
      } catch (e) {}
    }

    // Clear local storage and session storage
    sessionStorage.clear();
    localStorage.removeItem("bharat-vision-storage");
    
    // Sign out from Supabase securely
    await supabase.auth.signOut();
    
    // Redirect to login
    router.replace("/login");
  };

  if (!mounted) {
    return <div className="h-[100dvh] bg-slate-50 dark:bg-slate-950" />;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-full md:h-full overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-950 px-4 md:px-10 xl:px-14 pt-8 md:pt-6 pb-[120px] md:pb-8 relative md:max-w-4xl lg:max-w-5xl md:mx-auto md:w-full">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/profile" className="p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{t[lang as keyof typeof t].settings}</h1>
      </div>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 px-2">{t[lang as keyof typeof t].appearance}</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                  {currentTheme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Dark Mode</p>
                  <p className="text-xs text-slate-500">Adjust the app's appearance</p>
                </div>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-0.5">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    theme === "light"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    theme === "dark"
                      ? "bg-slate-700 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                    theme === "system"
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  System
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Preferences */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 px-2">Preferences</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            
            <button 
              onClick={() => setActiveModal("notifications")}
              className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <Bell size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications & Alerts</p>
                  <p className="text-xs text-slate-500">
                    {notificationSettings?.proximity ? "Proximity chimes active" : "Silent mode"} · {permissionStatus === "granted" ? "Push enabled" : "In-app alerts"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  permissionStatus === "granted" 
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}>
                  {permissionStatus === "granted" ? "Active" : "Configure"}
                </span>
                <ChevronRight size={18} className="text-slate-400" />
              </div>
            </button>

            <button 
              onClick={() => setActiveModal("language")}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Globe size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Language</p>
                  <p className="text-xs text-slate-500">English (Auto-Detected)</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

          </div>
        </section>

        {/* Account & Developer */}
        <section>
          <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-3 px-2">System</h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            
            <button 
              onClick={() => setActiveModal("privacy")}
              className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Shield size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{t[lang as keyof typeof t].privacy}</p>
                  <p className="text-xs text-slate-500">Location tracking, Waze telemetry</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

            <button 
              onClick={() => setActiveModal("terminal")}
              className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
                  <Terminal size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Developer Terminal</p>
                  <p className="text-xs text-slate-500">View live app telemetry</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </button>

          </div>
        </section>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 p-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <LogOut size={18} className="text-red-600 dark:text-red-500" />
          <span className="text-sm font-bold text-red-600 dark:text-red-500">Secure Log Out</span>
        </button>

      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[85vh] flex flex-col overflow-hidden"
            >
              <button 
                onClick={() => setActiveModal(null)} 
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-900 dark:text-white z-10"
              >
                <X size={20} />
              </button>

              {/* TERMINAL MODAL */}
              {activeModal === "terminal" && (
                <div className="h-full flex flex-col font-mono">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Terminal size={20} className="text-emerald-500" /> System Terminal
                  </h3>
                  <div className="bg-slate-950 p-4 rounded-xl flex-1 overflow-y-auto no-scrollbar text-xs text-emerald-400 leading-relaxed shadow-inner">
                    <p>{`> Initializing Bharat Vision v0.1.0`}</p>
                    <p>{`> Connecting to GTFS-RT Pipeline... OK`}</p>
                    <p>{`> Supabase Auth verified [User: ACTIVE]`}</p>
                    <p>{`> Geolocation watcher: STANDBY`}</p>
                    <p className="text-yellow-400">{`> WARN: GPS accuracy degraded (Indoor)`}</p>
                    <p>{`> Ping AWS ap-south-1: 42ms`}</p>
                    <p>{`> React Hydration: SUCCESS`}</p>
                    <p>{`> OCR Neural Net: LOADED (Cache Hit)`}</p>
                    <p className="animate-pulse mt-4">_</p>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS MODAL */}
              {activeModal === "notifications" && (
                <div className="h-full flex flex-col min-h-0">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4 shrink-0 pr-8">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Bell size={20} className="text-emerald-500" />
                        {t[lang as keyof typeof t].notifications}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Manage transit alarms, chimes, and system push alerts
                      </p>
                    </div>
                  </div>

                  {/* Scrollable Settings Content */}
                  <div className="space-y-3 overflow-y-auto no-scrollbar flex-1 pr-1 pb-2">
                    
                    {/* Browser Push Permission Status Card */}
                    <div className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                      permissionStatus === "granted"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60"
                        : permissionStatus === "denied"
                        ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/60"
                        : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/60"
                    }`}>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {permissionStatus === "granted" ? (
                            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400" />
                          ) : permissionStatus === "denied" ? (
                            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400" />
                          ) : (
                            <Info size={16} className="text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className={`text-xs font-black ${
                            permissionStatus === "granted" 
                              ? "text-emerald-900 dark:text-emerald-300"
                              : permissionStatus === "denied"
                              ? "text-amber-900 dark:text-amber-300"
                              : "text-blue-900 dark:text-blue-300"
                          }`}>
                            {permissionStatus === "granted" 
                              ? t[lang as keyof typeof t].permGranted 
                              : permissionStatus === "denied" 
                              ? t[lang as keyof typeof t].permBlocked 
                              : t[lang as keyof typeof t].pushAlerts}
                          </p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight mt-0.5">
                            {permissionStatus === "granted"
                              ? "Lockscreen alerts & background deboarding notifications are active."
                              : permissionStatus === "denied"
                              ? "System alerts are blocked in site settings. Click site lock icon to allow."
                              : "Allow browser push notifications for background transit updates."}
                          </p>
                        </div>
                      </div>

                      {permissionStatus !== "granted" && permissionStatus !== "denied" && (
                        <button
                          type="button"
                          onClick={handleRequestPermission}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer shadow-xs"
                        >
                          {t[lang as keyof typeof t].permDefault}
                        </button>
                      )}
                    </div>

                    {/* Master Push Notification Toggle */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                          <Bell size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].pushAlerts}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t[lang as keyof typeof t].pushDesc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (permissionStatus === "default") {
                            handleRequestPermission();
                          } else {
                            setNotificationSettings({ pushEnabled: !notificationSettings?.pushEnabled });
                          }
                        }}
                        className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                          notificationSettings?.pushEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                        title="Toggle System Push Alerts"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>

                    {/* Proximity Deboarding Alerts */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                          <Sparkles size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].proximity}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t[lang as keyof typeof t].proxDesc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationSettings({ proximity: !notificationSettings?.proximity })}
                        className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                          notificationSettings?.proximity ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                        title="Toggle Proximity Deboarding Alerts"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>

                    {/* Route Deviation Alerts */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400">
                          <AlertTriangle size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].deviations}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t[lang as keyof typeof t].devDesc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationSettings({ deviations: !notificationSettings?.deviations })}
                        className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                          notificationSettings?.deviations ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                        title="Toggle Route Deviation Alerts"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>

                    {/* Transit Audio Chimes */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/40 rounded-xl text-teal-600 dark:text-teal-400">
                          <Volume2 size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].soundChimes}</p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                playTransitChime();
                              }}
                              className="text-[9px] font-black uppercase text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-md hover:underline cursor-pointer border border-teal-200 dark:border-teal-800"
                            >
                              Play Chime
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t[lang as keyof typeof t].soundDesc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationSettings({ soundChimes: !notificationSettings?.soundChimes })}
                        className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                          notificationSettings?.soundChimes ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                        title="Toggle Transit Audio Chimes"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>

                    {/* Haptic Vibration */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
                          <Smartphone size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].vibration}</p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerVibration([200, 100, 200]);
                              }}
                              className="text-[9px] font-black uppercase text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md hover:underline cursor-pointer border border-purple-200 dark:border-purple-800"
                            >
                              Test Haptic
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t[lang as keyof typeof t].vibDesc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationSettings({ vibration: !notificationSettings?.vibration })}
                        className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                          notificationSettings?.vibration ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                        title="Toggle Haptic Vibration"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>

                    {/* Voice Deboarding Announcements */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-sky-100 dark:bg-sky-900/40 rounded-xl text-sky-600 dark:text-sky-400">
                          <Mic size={18} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].voiceAnnounce}</p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                speakAnnouncement("Approaching Silk Board Junction. Prepare to deboard.");
                              }}
                              className="text-[9px] font-black uppercase text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md hover:underline cursor-pointer border border-sky-200 dark:border-sky-800"
                            >
                              Test Speech
                            </button>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t[lang as keyof typeof t].voiceDesc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationSettings({ voiceAnnouncements: !notificationSettings?.voiceAnnouncements })}
                        className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                          notificationSettings?.voiceAnnouncements ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                        title="Toggle Voice Deboarding Announcements"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>

                    {/* Pass Discounts & Marketing */}
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/40 rounded-xl text-rose-600 dark:text-rose-400">
                          <Tag size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].marketing}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t[lang as keyof typeof t].markDesc}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setNotificationSettings({ marketing: !notificationSettings?.marketing })}
                        className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors cursor-pointer ${
                          notificationSettings?.marketing ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                        }`}
                        title="Toggle Pass Discounts & Promotions"
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>

                  </div>

                  {/* Feedback Toast */}
                  {testToast && (
                    <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>{testToast}</span>
                    </div>
                  )}

                  {/* Bottom Multi-Channel Test Button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleTestNotification}
                      disabled={isTesting}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold p-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 text-xs"
                    >
                      <Send size={15} />
                      <span>{isTesting ? "Testing Audio, Haptics & Push..." : t[lang as keyof typeof t].testNotif}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LANGUAGE MODAL */}
              {activeModal === "language" && (
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">{t[lang as keyof typeof t].appLang}</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setAppLang("en")}
                      className={`w-full text-left p-4 rounded-xl font-bold flex justify-between items-center transition-colors ${lang === 'en' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/50 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      English
                      {lang === 'en' && <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>}
                    </button>
                    <button 
                      onClick={() => setAppLang("kn")}
                      className={`w-full text-left p-4 rounded-xl font-bold flex justify-between items-center transition-colors ${lang === 'kn' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/50 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      ಕನ್ನಡ (Kannada)
                      {lang === 'kn' && <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>}
                    </button>
                    <button 
                      onClick={() => setAppLang("hi")}
                      className={`w-full text-left p-4 rounded-xl font-bold flex justify-between items-center transition-colors ${lang === 'hi' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-500/50 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                    >
                      हिन्दी (Hindi)
                      {lang === 'hi' && <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-sm"></div>}
                    </button>
                  </div>
                </div>
              )}

              {/* PRIVACY MODAL */}
              {activeModal === "privacy" && (
                <div className="h-full flex flex-col">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">{t[lang as keyof typeof t].privacy}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield size={24} className="text-indigo-500" />
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{t[lang as keyof typeof t].dataSecured}</p>
                    </div>
                    
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].liveLoc}</p>
                        <p className="text-xs text-slate-500">{t[lang as keyof typeof t].liveLocDesc}</p>
                      </div>
                      <button 
                        onClick={() => {
                        setPrivacyLiveLocation(!privacyLiveLocation);
                        if (!privacyLiveLocation && typeof window !== 'undefined' && 'geolocation' in navigator) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => console.log('Location accessed:', pos),
                            (err) => console.error('Location error:', err)
                          );
                        }
                      }}
                        className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${privacyLiveLocation ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'}`}
                      >
                         <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{t[lang as keyof typeof t].camAccess}</p>
                        <p className="text-xs text-slate-500">{t[lang as keyof typeof t].camDesc}</p>
                      </div>
                      <button 
                        onClick={() => setPrivacyCamera(!privacyCamera)}
                        className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${privacyCamera ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'}`}
                      >
                         <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </button>
                    </div>
                    
                    <button className="mt-4 w-full text-center py-3 text-red-500 font-bold text-sm hover:underline">
                      Delete My Account & Data
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
