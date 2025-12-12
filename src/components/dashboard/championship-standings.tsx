"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Driver, Position } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

interface ChampionshipStandingsProps {
    sessionKey: number;
}

export function ChampionshipStandings({ sessionKey }: ChampionshipStandingsProps) {
    const [standings, setStandings] = useState<{ driver: Driver, points: number, text: string, position: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const POINTS_SYSTEM = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

    useEffect(() => {
        const loadStandings = async () => {
            try {
                // We don't have historical season points, so we project points for THIS race.
                const [drivers, positions] = await Promise.all([
                    openF1.getDrivers(sessionKey),
                    openF1.getPositions(sessionKey)
                ]);

                // Get latest positions
                const latestPos: Record<number, number> = {};
                positions.forEach(p => { latestPos[p.driver_number] = p.position; });

                // Assign points
                const raceStandings = drivers
                    .map(d => {
                        const pos = latestPos[d.driver_number] || 99;
                        const pts = pos <= 10 ? POINTS_SYSTEM[pos - 1] : 0;
                        return {
                            driver: d,
                            points: pts,
                            text: pos <= 10 ? `+${pts} PTS` : "-",
                            position: pos
                        };
                    })
                    .sort((a, b) => a.position - b.position)
                    .slice(0, 10); // Show top 10 scoring

                setStandings(raceStandings);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadStandings();
    }, [sessionKey]);

    return (
        <Card title="Projected Points (Top 10)" className="h-full flex flex-col" noPadding>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : (
                    <div className="divide-y divide-gray-800">
                        {standings.map((item, idx) => (
                            <div key={item.driver.driver_number} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="font-mono text-gray-500 w-6 text-right">P{item.position}</div>
                                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: `#${item.driver.team_colour}` }}></div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{item.driver.name_acronym}</div>
                                        <div className="text-[10px] text-gray-500 uppercase">{item.driver.team_name}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {idx === 0 && <Trophy className="w-3 h-3 text-yellow-400" />}
                                    <span className="font-mono font-bold text-f1-red text-sm">{item.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
