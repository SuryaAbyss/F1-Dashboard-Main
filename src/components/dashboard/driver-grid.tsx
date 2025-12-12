"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Driver } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2, User } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

interface DriverGridProps {
    sessionKey: number;
}

export function DriverGrid({ sessionKey }: DriverGridProps) {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDrivers = async () => {
            try {
                const data = await openF1.getDrivers(sessionKey);
                // Sort by Team Name then Driver Number
                data.sort((a, b) => a.team_name.localeCompare(b.team_name) || a.driver_number - b.driver_number);
                setDrivers(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadDrivers();
    }, [sessionKey]);

    if (loading) {
        return Array.from({ length: 20 }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse bg-surface-highlight/10 border-0" title="">
                <div />
            </Card>
        ));
    }

    return (
        <>
            {drivers.map((driver) => (
                <Card key={driver.driver_number} className="overflow-hidden group hover:border-white/20 transition-all hover:-translate-y-1 duration-300" noPadding>
                    <div className="match-team-color h-2 w-full" style={{ backgroundColor: `#${driver.team_colour}` }}></div>
                    <div className="p-6 flex flex-col h-full bg-surface">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-highlight border-2" style={{ borderColor: `#${driver.team_colour}` }}>
                                <img src={driver.headshot_url} alt={driver.name_acronym} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold font-mono text-white italic">#{driver.driver_number}</div>
                                <div className="text-sm font-bold text-gray-500">{driver.name_acronym}</div>
                            </div>
                        </div>

                        <div className="mb-6 flex-1">
                            {/* Uses broadcast_name or full_name splitting if first_name not in type */}
                            <h3 className="text-xl font-bold text-white leading-tight mb-1">{driver.broadcast_name}</h3>
                            <div className="text-xs uppercase tracking-wider text-gray-400 font-mono truncate">{driver.team_name}</div>
                        </div>

                        <Link href={`/drivers/${driver.driver_number}`} className="w-full">
                            <button className="w-full py-2 bg-white/5 hover:bg-f1-red text-white text-sm font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 group-hover:bg-f1-red">
                                <BarChart2 className="w-4 h-4" />
                                Analyze Profile
                            </button>
                        </Link>
                    </div>
                </Card>
            ))}
        </>
    );
}
