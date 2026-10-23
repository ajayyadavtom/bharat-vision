// Bharat Vision — High-Reliability Client-Side Notification & Chime Engine

export type NotificationPermissionStatus = "granted" | "denied" | "default" | "unsupported";

/**
 * Checks if browser supports the Web Notification API
 */
export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Checks current notification permission without triggering prompt
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) return "unsupported";
  return Notification.permission as NotificationPermissionStatus;
}

/**
 * Requests browser permission to show system push notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) return "unsupported";
  try {
    const res = await Notification.requestPermission();
    return res as NotificationPermissionStatus;
  } catch (err) {
    console.warn("Notification permission request error:", err);
    return getNotificationPermission();
  }
}

/**
 * Synthesizes a crisp, pleasant 2-tone transit announcement chime via Web Audio API
 * Tone 1: D5 (587.33 Hz) -> Tone 2: A5 (880.00 Hz)
 */
export function playTransitChime(): void {
  if (typeof window === "undefined") return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    // Tone 1: D5
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Tone 2: A5
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880.0, now + 0.22);
    gain2.gain.setValueAtTime(0.3, now + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.22);
    osc2.stop(now + 0.65);
  } catch (e) {
    console.warn("Audio chime synthesis notice:", e);
  }
}

/**
 * Triggers safe haptic vibration pulse
 */
export function triggerVibration(pattern: number[] = [200, 100, 200]): boolean {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch (e) {
      console.warn("Vibration notice:", e);
    }
  }
  return false;
}

/**
 * Deboarding spoken speech synthesis alert
 */
export function speakAnnouncement(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis notice:", e);
  }
}

export interface SendNotificationOptions {
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: unknown;
  requireInteraction?: boolean;
}

/**
 * Sends a real-time system/browser notification using ServiceWorker if registered,
 * or standard Notification constructor as fallback.
 */
export async function sendSystemNotification(
  title: string,
  options: SendNotificationOptions = {}
): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  if (Notification.permission !== "granted") return false;

  const defaultIcon = "/icon.png";
  const defaultBadge = "/icon.png";

  const notifOptions: NotificationOptions = {
    body: options.body || "Live transit update from Bharat Vision.",
    icon: options.icon || defaultIcon,
    badge: options.badge || defaultBadge,
    tag: options.tag || "bharat-vision-transit",
    requireInteraction: options.requireInteraction || false,
    data: options.data,
  };

  try {
    // 1. Try via Service Worker Registration (PWA background notifications)
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && "showNotification" in reg) {
        await reg.showNotification(title, notifOptions);
        return true;
      }
    }

    // 2. Fallback to standard Window Notification
    const notif = new Notification(title, notifOptions);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    return true;
  } catch (err) {
    console.warn("Failed to dispatch system notification:", err);
    return false;
  }
}
