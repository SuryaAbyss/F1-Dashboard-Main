"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { RaceControl as RaceControlData } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import clsx from "clsx";

interface RaceControlPanelProps {
    sessionKey: number;
}

export function RaceControlPanel({ sessionKey }: RaceControlPanelProps) {
    const [messages, setMessages] = useState<RaceControlData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await openF1.getRaceControl(sessionKey);
                // Sort by date desc
                const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setMessages(sorted);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        const interval = setInterval(loadData, 10000);
        return () => clearInterval(interval);
    }, [sessionKey]);

    const getIcon = (flag: string, category: string) => {
        if (flag === "RED") return <AlertOctagon className="w-5 h-5 text-f1-red" />;
        if (flag === "YELLOW" || category === "SafetyCar") return <AlertTriangle className="w-5 h-5 text-neon-yellow" />;
        if (flag === "GREEN") return <Flag className="w-5 h-5 text-neon-green" />;
        return <Info className="w-5 h-5 text-gray-400" />;
    };

    return (
        <Card title="Race Control" className="h-full overflow-hidden flex flex-col" noPadding>
            <div className="overflow-y-auto flex-1 custom-scrollbar p-0">
                {loading && !messages.length ? (
                    <div className="p-4 space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {messages.map((msg, idx) => (
                            <div key={idx} className="p-3 flex gap-3 text-sm hover:bg-white/10 transition-all duration-200 backdrop-blur-sm border-l-2 border-transparent hover:border-f1-red/50">
                                <div className="mt-0.5 shrink-0">
                                    {getIcon(msg.flag, msg.category)}
                                </div>
                                <div>
                                    <div className="text-white font-mono text-xs mb-0.5">
                                        {new Date(msg.date).toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit" })}
                                        {msg.lap_number && <span className="text-gray-500 ml-2">Lap {msg.lap_number}</span>}
                                    </div>
                                    <div className="text-gray-300 leading-tight">
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!loading && messages.length === 0 && (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                No race control messages.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
