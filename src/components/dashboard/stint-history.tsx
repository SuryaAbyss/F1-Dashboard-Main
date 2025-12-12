"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Stint } from "@/types/openf1";
import { Skeleton } from "@/components/ui/skeleton";

interface StintHistoryProps {
    sessionKey: number;
    driverNumber: number;
}

export function StintHistory({ sessionKey, driverNumber }: StintHistoryProps) {
    const [stints, setStints] = useState<Stint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStints = async () => {
            try {
                const data = await openF1.getStints(sessionKey, driverNumber);
                data.sort((a, b) => a.stint_number - b.stint_number);
                setStints(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchStints();
    }, [sessionKey, driverNumber]);

    const getCompoundColor = (compound: string) => {
        switch (compound) {
            case 'SOFT': return '#ff3333';
            case 'MEDIUM': return '#ffff33';
            case 'HARD': return '#ffffff';
            case 'INTERMEDIATE': return '#33cc33';
            case 'WET': return '#3366ff';
            default: return '#999';
        }
    };

    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-4">
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ) : stints.length === 0 ? (
                <div className="text-center text-gray-500">No stint data available.</div>
            ) : (
                <div className="space-y-4">
                    {stints.map((stint) => (
                        <div key={stint.stint_number} className="flex items-center gap-4 bg-surface-highlight/10 p-3 rounded border border-white/5">
                            <div className="text-xl font-bold text-gray-400 w-8">#{stint.stint_number}</div>

                            <div className="flex flex-col items-center">
                                <div
                                    className="w-8 h-8 rounded-full border-4 shadow-lg flex items-center justify-center text-[10px] font-bold bg-gray-800"
                                    style={{ borderColor: getCompoundColor(stint.compound), color: getCompoundColor(stint.compound) }}
                                >
                                    {stint.compound[0]}
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1">{stint.compound}</span>
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">Laps</span>
                                    <span className="text-white font-mono">{stint.lap_start} - {stint.lap_end || "Current"}</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                                    <div className="h-full bg-white/20" style={{ width: '100%' }}></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-right">
                                    Total: {(stint.lap_end || 0) - stint.lap_start} laps
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
