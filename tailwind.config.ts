import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0A0A0A",
                surface: "#1A1A1A",
                "surface-highlight": "#2A2A2A",
                "f1-red": "#FF1801",
                "neon-cyan": "#00F0FF",
                "neon-yellow": "#FFF500",
                "neon-green": "#39FF14",
                "text-primary": "#FFFFFF",
                "text-secondary": "#A1A1AA",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                mono: ["var(--font-jetbrains)", "monospace"],
            },
            keyframes: {
                shimmer: {
                    "100%": { transform: "translateX(100%)" },
                },
                liquidRotate: {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
                "light-sequence": {
                    "0%, 15%": { opacity: "0", boxShadow: "none" },
                    "20%, 85%": { opacity: "1", boxShadow: "0 0 15px 2px #FF1801" }, // Lights ON
                    "90%, 100%": { opacity: "0", boxShadow: "none" }, // Lights OFF
                },
            },
            animation: {
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                shimmer: "shimmer 3s infinite",
                liquidRotate: "liquidRotate 4s linear infinite",
                "light-sequence": "light-sequence 2s linear infinite",
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '12px',
                lg: '16px',
                xl: '24px',
            },
        },
    },
    plugins: [],
};
export default config;
