import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Using JetBrains Mono for a more "engineering" feel than Geist Mono
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "FormulaF1 Dash By Surya",
  description: "Real-time F1 Telemetry & Analytics Dashboard",
};

import { ScreenSizeAlert } from "@/components/ui/screen-size-alert";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-text-primary antialiased flex flex-col md:flex-row`}
        suppressHydrationWarning={true}
      >
        <ScreenSizeAlert />

        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-4 md:p-6 overflow-y-auto min-h-screen pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Navigation - Visible on Mobile */}
        <MobileNav />
      </body>
    </html>
  );
}
