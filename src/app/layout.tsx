import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DVYA Basketball League",
  description: "Official app for the DVYA Basketball League",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "DVYA League",
  },
};

export const viewport: Viewport = {
  themeColor: "#000080",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50 text-navy selection:bg-gold selection:text-navy">
        <Navbar />
        <main className="md:pl-64 min-h-screen pb-16 md:pb-0">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {children}
          </div>
        </main>
        <Toaster position="top-right" expand={false} richColors theme="light" />
      </body>
    </html>
  );
}
