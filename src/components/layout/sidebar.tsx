"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, Settings, Flag } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
    { name: "Live Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Drivers", href: "/drivers", icon: Users },
    { name: "Analytics", href: "/analytics", icon: Activity },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-16 md:w-64 glass-card-strong border-r border-white/10 flex flex-col z-50 transition-all">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
                <Flag className="w-6 h-6 text-f1-red mr-0 md:mr-3" />
                <div className="hidden md:block">
                    <div className="font-bold text-lg tracking-tight italic leading-tight overflow-hidden">
                        <span className="typewriter-text inline-block">
                            FORMULA<span className="text-f1-red">F1</span> DASH
                        </span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono -mt-0.5 overflow-hidden">
                        <span className="typewriter-subtext inline-block">
                            DESIGNED BY <span className="text-f1-red italic">SURYA</span>
                        </span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes typewriter {
                    0% { 
                        width: 0;
                        opacity: 0;
                    }
                    28.5% { 
                        width: 100%;
                        opacity: 1;
                    }
                    100% {
                        width: 100%;
                        opacity: 1;
                    }
                }
                
                @keyframes typewriterSub {
                    0%, 28.5% { 
                        width: 0;
                        opacity: 0;
                    }
                    50% { 
                        width: 100%;
                        opacity: 1;
                    }
                    100% {
                        width: 100%;
                        opacity: 1;
                    }
                }
                
                @keyframes blink {
                    0%, 100% { border-right-color: transparent; }
                    50% { border-right-color: #E10600; }
                }
                
                .typewriter-text {
                    white-space: nowrap;
                    overflow: hidden;
                    border-right: 2px solid #E10600;
                    animation: typewriter 7s steps(16) infinite, blink 0.75s step-end infinite;
                }
                
                .typewriter-subtext {
                    white-space: nowrap;
                    overflow: hidden;
                    animation: typewriterSub 7s steps(18) infinite;
                }
            `}</style>

            <nav className="flex-1 py-6 flex flex-col gap-2 px-2 md:px-4">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center p-3 rounded-md transition-all duration-200 group relative",
                                "backdrop-blur-sm",
                                isActive
                                    ? "bg-f1-red/20 text-f1-red border border-f1-red/30 glass-glow"
                                    : "text-gray-400 hover:bg-white/10 hover:text-white border border-transparent hover:border-white/10"
                            )}
                        >
                            <item.icon className={clsx("w-5 h-5", isActive ? "text-f1-red" : "group-hover:text-white")} />
                            <span className="hidden md:block ml-3 font-medium text-sm">{item.name}</span>
                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-f1-red rounded-r-full shadow-[0_0_10px_rgba(255,24,1,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
                <div className="glass-card-subtle rounded p-3 text-xs text-gray-500 mb-3 hidden md:block">
                    <p>Session Status</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                        <span className="text-white font-mono">LIVE FEED</span>
                    </div>
                </div>

                <a
                    href="https://www.linkedin.com/in/suryaprakash18/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-[#0A66C2] hover:bg-[#004182] transition-all text-white text-xs font-semibold group glass-hover shadow-lg"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="hidden md:inline">Connect on LinkedIn</span>
                    <span className="md:hidden">LinkedIn</span>
                </a>
            </div>
        </aside>
    );
}
