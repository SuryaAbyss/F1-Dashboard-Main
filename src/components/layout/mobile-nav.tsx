"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Activity, Settings } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
    { name: "Live", href: "/", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: Activity },
    { name: "Drivers", href: "/drivers", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card-strong border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 relative",
                                isActive ? "text-f1-red" : "text-gray-400 hover:text-white"
                            )}
                        >
                            <div className={clsx(
                                "p-1.5 rounded-full transition-all",
                                isActive && "bg-f1-red/10"
                            )}>
                                <item.icon className={clsx("w-5 h-5", isActive && "stroke-[2.5px]")} />
                            </div>
                            <span className="text-[10px] font-medium tracking-wide">{item.name}</span>

                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-f1-red shadow-[0_0_8px_rgba(255,24,1,0.5)]" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
