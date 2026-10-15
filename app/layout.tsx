import type { Metadata, Viewport } from "next";
import "./globals.css";

import BottomNav from "../src/components/navigation/BottomNav";
import DesktopNav from "../src/components/navigation/DesktopNav";
import PwaRegistry from "../components/PwaRegistry";

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Bharat Vision | Namma Bengaluru",
  description: "Next-generation civic transit platform for Bengaluru.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bharat Vision",
  },
};

import { ThemeProvider } from "../components/ThemeProvider";
import AuthGuard from "../components/AuthGuard";
import MobileScrollLock from "../components/MobileScrollLock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="/leaflet/leaflet.css" />
      </head>
      <body 
        className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          <AuthGuard>
            <PwaRegistry />
            <MobileScrollLock />
            <main className="w-full max-w-md md:max-w-none mx-auto h-[100dvh] md:h-screen relative shadow-2xl md:shadow-none bg-white dark:bg-slate-900 md:bg-slate-50 md:dark:bg-slate-950 overflow-hidden md:flex md:flex-col">
              <DesktopNav />
              <div className="flex-1 w-full h-full overflow-hidden relative">
                {children}
              </div>
              <BottomNav />
            </main>
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
