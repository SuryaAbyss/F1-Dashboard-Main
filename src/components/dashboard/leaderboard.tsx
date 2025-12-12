"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Driver, Interval } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import clsx from "clsx";

interface LeaderboardProps {
    sessionKey: number;
}

export function Leaderboard({ sessionKey }: LeaderboardProps) {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [positions, setPositions] = useState<Record<number, number>>({});
    const [intervals, setIntervals] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Initial load
    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch drivers once
                const driverData = await openF1.getDrivers(sessionKey);
                setDrivers(driverData);

                // Initial fetch of positions and intervals
                await updateLiveTiming();
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        const updateLiveTiming = async () => {
            try {
                const [positionData, intervalData] = await Promise.all([
                    openF1.getPositions(sessionKey),
                    openF1.getIntervals(sessionKey)
                ]);

                // Process positions (get latest)
                const latestPos: Record<number, number> = {};
                positionData.forEach(p => {
                    latestPos[p.driver_number] = p.position;
                });
                setPositions(latestPos);

                // Process intervals (get latest gap to leader)
                const latestIntervals: Record<number, string> = {};
                intervalData.forEach(i => {
                    // Try to get gap_to_leader, fallback to interval
                    // The API might return strings for numbers, so we must parse carefully
                    const rawVal = i.gap_to_leader ?? i.interval;

                    if (rawVal !== null && rawVal !== undefined) {
                        const val = typeof rawVal === 'string' ? parseFloat(rawVal) : rawVal;
                        if (!isNaN(val)) {
                            latestIntervals[i.driver_number] = `+${val.toFixed(3)}`;
                        }
                    }
                });
                setIntervals(latestIntervals);

            } catch (error) {
                console.error("Live Timing Update Failed:", error);
            }
        };

        loadData();

        // Poll for updates every 6s
        const interval = setInterval(updateLiveTiming, 6000);
        return () => clearInterval(interval);
    }, [sessionKey]);

    // Sort drivers by position
    const sortedDrivers = [...drivers].sort((a, b) => {
        const posA = positions[a.driver_number] || 99;
        const posB = positions[b.driver_number] || 99;
        return posA - posB;
    });

    return (
        <Card title="Leaderboard" className="h-full overflow-hidden flex flex-col" noPadding>
            <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 uppercase bg-surface-highlight/20 sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                            <th className="px-3 py-2">Pos</th>
                            <th className="px-3 py-2">Driver</th>
                            <th className="px-3 py-2 text-right">Gap</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            Array.from({ length: 20 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-3 py-3 w-8"><Skeleton className="h-4 w-4" /></td>
                                    <td className="px-3 py-3"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-3 py-3"><Skeleton className="h-4 w-10 ml-auto" /></td>
                                </tr>
                            ))
                        ) : (
                            sortedDrivers.map((driver, index) => {
                                const pos = positions[driver.driver_number] || index + 1;
                                const gap = intervals[driver.driver_number];

                                return (
                                    <tr
                                        key={driver.driver_number}
                                        className="hover:bg-white/5 transition-colors cursor-pointer group"
                                        onClick={() => router.push(`/drivers/${driver.driver_number}`)}
                                    >
                                        <td className="px-3 py-1.5 font-mono text-gray-400 group-hover:text-white w-10 text-center">
                                            {pos}
                                        </td>
                                        <td className="px-3 py-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-6 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: `#${driver.team_colour}` }}></div>
                                                <div className="flex flex-col justify-center">
                                                    <div className="font-bold text-white leading-none text-sm">{driver.name_acronym}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase hidden sm:block">{driver.team_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-1.5 text-right font-mono text-gray-400">
                                            {pos === 1 ? <span className="text-neon-yellow">LEADER</span> : (gap || "---")}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
