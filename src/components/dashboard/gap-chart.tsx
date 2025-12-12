"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Interval, Driver } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface GapChartProps {
    sessionKey: number;
}

export function GapChart({ sessionKey }: GapChartProps) {
    const [chartData, setChartData] = useState<any[]>([]);
    const [topDrivers, setTopDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Get Drivers
                const drivers = await openF1.getDrivers(sessionKey);
                // Filter for just top teams/drivers to avoid clutter
                // For MVP we just take top 5 based on live positions if possible, or just known top cars
                // Since this runs client side, let's fetch positions to determine 'top 5'
                const positions = await openF1.getPositions(sessionKey);
                console.log("GapChart: Fetched Positions:", positions.length);

                // Find latest position for each driver
                const latestPos: Record<number, number> = {};
                positions.forEach(p => { latestPos[p.driver_number] = p.position; });

                const relevantDrivers = drivers.filter(d => {
                    const pos = latestPos[d.driver_number];
                    // If we have positions, take top 8. If NO positions found (e.g. before race), take popular drivers (Verstappen, Hamilton, Norris) as fallback?
                    // Actually, if no positions, we might just show an empty chart or take the first 5 drivers in the list.
                    if (Object.keys(latestPos).length === 0) return [1, 44, 16, 4, 55].includes(d.driver_number);
                    return pos && pos <= 8;
                });
                console.log("GapChart: Relevant Drivers:", relevantDrivers.length);
                setTopDrivers(relevantDrivers);

                // 2. Get Intervals for these drivers ONLY (Parallel fetch)
                // Fetching ALL intervals is too heavy + slow
                const intervalPromises = relevantDrivers.map(d =>
                    openF1.getIntervals(sessionKey, d.driver_number)
                );

                const intervalsArrays = await Promise.all(intervalPromises);
                const intervals = intervalsArrays.flat();

                // Process into chart data: Array of { date, VER: gap, LEC: gap ... }
                // We simplify by grouping by 'minute' or roughly downsampling
                // Intervals come in stream.

                // Improved grouping: grouped by timestamp bucket (e.g. every 1 minute)
                const buckets: Record<string, any> = {};

                intervals.forEach(i => {
                    // Bucket by minute to reduce noise
                    const dateObj = new Date(i.date);
                    // Round to nearest minute
                    dateObj.setSeconds(0, 0);
                    const key = dateObj.toISOString();

                    if (!buckets[key]) buckets[key] = { date: key };

                    const driver = drivers.find(d => d.driver_number === i.driver_number);
                    if (driver) {
                        // Use 0 for leader gap if missing (implies leader)
                        const gap = i.gap_to_leader ?? 0;
                        buckets[key][driver.name_acronym] = gap;
                    }
                });

                const data = Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
                console.log("GapChart: Processed Data Points:", data.length);

                // Show last 100 points for better resolution
                setChartData(data.slice(-100));

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [sessionKey]);

    return (
        <Card title="Gap Analysis (Top 5)" className="h-full flex flex-col" noPadding>
            <div className="flex-1 min-h-[200px] p-2">
                {loading ? (
                    <Skeleton className="w-full h-full" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        {chartData.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                                No gap data available for this session.
                            </div>
                        ) : (
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="date" hide />
                                <YAxis stroke="#666" fontSize={10} width={30} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff', fontSize: '12px' }}
                                    itemStyle={{ padding: 0 }}
                                />
                                <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                {topDrivers.map((d, i) => (
                                    <Line
                                        key={d.driver_number}
                                        type="monotone"
                                        dataKey={d.name_acronym}
                                        stroke={`#${d.team_colour}`}
                                        strokeWidth={2}
                                        dot={false}
                                        connectNulls
                                    />
                                ))}
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                )}
            </div>
        </Card>
    );
}
