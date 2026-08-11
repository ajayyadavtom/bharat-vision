import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Kept YOUR exact working import path
import BottomNav from "@/components/navigation/BottomNav";
// IMPORTING THE NEW OFFLINE REGISTRY
import PwaRegistry from "../components/PwaRegistry";

const inter = Inter({ subsets: ["latin"] });

// The PWA Viewport Configuration
export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Manifest Link 
export const metadata: Metadata = {
  title: "Bharat Vision | Namma Bengaluru",
  description: "Next-generation civic transit platform for Bengaluru.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bharat Vision",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-surface-black text-white antialiased`}>
        {/* Invisible Offline Engine */}
        <PwaRegistry />
        
        {/* Kept YOUR exact max-width mobile container styling */}
        <main className="max-w-md mx-auto min-h-screen relative pb-16 shadow-2xl bg-surface-black">
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}