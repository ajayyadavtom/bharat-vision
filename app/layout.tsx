import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AppShell from "@/components/auth/AppShell";
import PwaRegistry from "../components/PwaRegistry";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
        <PwaRegistry />
        <main className="max-w-md mx-auto min-h-screen relative pb-16 shadow-2xl bg-surface-black">
          <AppShell>{children}</AppShell>
        </main>
      </body>
    </html>
  );
}
