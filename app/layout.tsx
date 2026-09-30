import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SphereRoom | Intelligent Meeting Display & Room Kiosk",
  description: "Enterprise tablet display for instant meeting room booking and schedule management",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full w-full antialiased dark overflow-hidden`}
    >
      <body className="h-full w-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden">
        {children}
      </body>
    </html>
  );
}


