import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import StickyFooter from "@/components/layout/footer";
import MouseFollow from "@/components/ui/mouse-follow";
import MouseHoverEffect from "@/components/ui/mouse-hover-effect";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Name | Portfolio",
  description: "Award-winning portfolio showcasing my work and skills",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Mouse animation components */}
        <MouseFollow size={300} color="#3b82f6" blur={120} opacity={0.15} />
        <MouseHoverEffect />
        
        <Header />
        <main className="pt-24 pb-16">
          {children}
        </main>
        <StickyFooter />
      </body>
    </html>
  );
}