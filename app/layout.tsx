import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import BottomNav from "../src/components/navigation/BottomNav";
import PwaRegistry from "../components/PwaRegistry";

const inter = Inter({ subsets: ["latin"] });

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

import { ThemeProvider } from "next-themes";
import AuthGuard from "../components/AuthGuard";
import MobileScrollLock from "../components/MobileScrollLock";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthGuard>
            <PwaRegistry />
            <MobileScrollLock />
            <main className="max-w-md mx-auto h-[100dvh] h-screen relative shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
              {children}
              <BottomNav />
            </main>
          </AuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
