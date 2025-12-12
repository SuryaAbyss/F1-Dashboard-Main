"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { TeamRadio } from "@/types/openf1";
import { Skeleton } from "@/components/ui/skeleton";
import { AudioPlayer } from "@/components/ui/audio-player";
import { Mic } from "lucide-react";

interface TeamRadioListProps {
    sessionKey: number;
    driverNumber: number;
}

export function TeamRadioList({ sessionKey, driverNumber }: TeamRadioListProps) {
    const [radios, setRadios] = useState<TeamRadio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRadios = async () => {
            try {
                const data = await openF1.getTeamRadio(sessionKey, driverNumber);
                // Sort descending time
                data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setRadios(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchRadios();
    }, [sessionKey, driverNumber]);

    // ... render ...
    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-0">
            {loading ? (
                <div className="space-y-2 p-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : radios.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No radio messages found.</div>
            ) : (
                <div className="divide-y divide-gray-800">
                    {radios.map((radio, idx) => (
                        <div key={idx} className="p-3 flex items-center gap-3 hover:bg-white/5 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-surface-highlight flex items-center justify-center shrink-0">
                                <Mic className="w-4 h-4 text-f1-red" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-xs text-gray-500 font-mono mb-0.5">
                                    {new Date(radio.date).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </div>
                                <AudioPlayer src={radio.recording_url} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
