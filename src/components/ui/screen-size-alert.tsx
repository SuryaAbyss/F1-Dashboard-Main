"use client";

import { useEffect, useState } from "react";
import { X, Monitor, ZoomIn } from "lucide-react";
import clsx from "clsx";

export function ScreenSizeAlert() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check session storage so we don't annoy the user on every reload
        const hasSeenAlert = sessionStorage.getItem("hasSeenZoomAlert");
        if (!hasSeenAlert) {
            // Small delay for smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem("hasSeenZoomAlert", "true");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none px-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 animate-in fade-in" />

            {/* Modal */}
            <div className="pointer-events-auto max-w-md w-full glass-card-strong rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-300 border border-f1-red/20 relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-f1-red/20 rounded-full blur-3xl pointer-events-none" />

                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 shadow-[0_0_15px_rgba(255,24,1,0.2)]">
                        <Monitor className="w-8 h-8 text-f1-red" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white uppercase italic tracking-wide">
                            Optimal Viewing Experience
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            For the best dashboard layout and visibility, we recommend setting your browser zoom to <span className="text-neon-yellow font-bold">75%</span>.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-black/30 px-3 py-1.5 rounded border border-white/5">
                        <ZoomIn className="w-3 h-3" />
                        <span>CTRL + MINUS / CMD + MINUS</span>
                    </div>

                    <button
                        onClick={handleDismiss}
                        className="mt-2 text-sm font-semibold text-white bg-f1-red hover:bg-[#cc1200] px-6 py-2 rounded-lg transition-all shadow-[0_4px_12px_rgba(255,24,1,0.3)] hover:shadow-[0_4px_20px_rgba(255,24,1,0.5)] w-full"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
}
