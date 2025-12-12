import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google"; // Changed from Geist
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

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
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-background text-text-primary antialiased flex`}
        suppressHydrationWarning={true}
      >
        <ScreenSizeAlert />
        <Sidebar />
        <main className="flex-1 ml-16 md:ml-64 p-6 overflow-y-auto min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
