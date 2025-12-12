"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Driver } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart2 } from "lucide-react";
import Link from "next/link";

interface DriverAnalyticsSelectorProps {
    sessionKey: number;
}

export function DriverAnalyticsSelector({ sessionKey }: DriverAnalyticsSelectorProps) {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDrivers = async () => {
            try {
                const data = await openF1.getDrivers(sessionKey);

                // Define team priority (top teams first)
                // Using normalized team names for matching
                const getTeamPriority = (teamName: string): number => {
                    const normalized = teamName.toLowerCase();
                    if (normalized.includes('red bull')) return 1;
                    if (normalized.includes('mclaren')) return 2;
                    if (normalized.includes('ferrari')) return 3;
                    if (normalized.includes('mercedes')) return 4;
                    if (normalized.includes('williams')) return 5;
                    if (normalized.includes('aston martin')) return 6;
                    return 99; // Other teams
                };

                // Debug: Log team names
                console.log('Team names from API:', [...new Set(data.map(d => d.team_name))]);

                // Sort by team priority, then by driver number
                data.sort((a, b) => {
                    const priorityA = getTeamPriority(a.team_name);
                    const priorityB = getTeamPriority(b.team_name);

                    if (priorityA !== priorityB) {
                        return priorityA - priorityB;
                    }
                    return a.driver_number - b.driver_number;
                });

                // Debug: Log sorted result
                console.log('Sorted drivers:', data.map(d => `${d.broadcast_name} (${d.team_name}) - Priority: ${getTeamPriority(d.team_name)}`));

                setDrivers(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadDrivers();
    }, [sessionKey]);

    return (
        <Card title="Driver Analytics" className="h-full overflow-hidden flex flex-col" noPadding>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                {loading ? (
                    <div className="p-4 space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {drivers.map((driver) => (
                            <div key={driver.driver_number} className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 rounded-full" style={{ backgroundColor: `#${driver.team_colour}` }}></div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{driver.broadcast_name}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">{driver.team_name}</div>
                                    </div>
                                </div>

                                <Link href={`/drivers/${driver.driver_number}`}>
                                    <button className="h-7 text-xs flex items-center gap-1 px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all opacity-0 group-hover:opacity-100">
                                        <BarChart2 className="w-3 h-3" />
                                        Analyze
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
