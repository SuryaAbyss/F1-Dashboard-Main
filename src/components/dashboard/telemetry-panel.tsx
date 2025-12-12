"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { CarData, Lap } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TelemetryChart } from "./telemetry-chart";
import { Activity, Gauge, Timer } from "lucide-react";

interface TelemetryPanelProps {
    sessionKey: number;
    driverNumber?: number; // Default to '1' or dynamic later
}

export function TelemetryPanel({ sessionKey, driverNumber = 1 }: TelemetryPanelProps) {
    const [carData, setCarData] = useState<CarData[]>([]);
    const [lastLap, setLastLap] = useState<Lap | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch last lap
                const laps = await openF1.getLaps(sessionKey, driverNumber);
                const last = laps[laps.length - 1];
                setLastLap(last);

                if (last) {
                    const startDate = new Date(last.date_start);
                    const endDate = new Date(startDate.getTime() + (last.lap_duration * 1000));

                    // Fetch car telemetry (heavy) for just this lap
                    const telemetry = await openF1.getCarData(
                        sessionKey,
                        driverNumber,
                        last.date_start,
                        endDate.toISOString()
                    );
                    setCarData(telemetry);
                }

                // Fallback or full fetch if we want (but full fetch causes 422)
                // So we MUST use date filtering.

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // Polling loop
        const interval = setInterval(loadData, 15000); // 15s polling for simple updates
        return () => clearInterval(interval);
    }, [sessionKey, driverNumber]);

    return (
        <Card title={`Telemetry - Driver #${driverNumber}`} className="h-[350px] flex flex-col">
            <div className="grid grid-cols-3 gap-4 mb-4 border-b border-gray-800 pb-4">
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                        <Timer className="w-3 h-3" /> Last Lap
                    </span>
                    <span className="text-xl font-mono text-white font-bold">
                        {lastLap ? lastLap.lap_duration.toFixed(3) : "--.---"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                        <Gauge className="w-3 h-3" /> Top Speed
                    </span>
                    <span className="text-xl font-mono text-neon-cyan font-bold">
                        {carData.length ? Math.max(...carData.map(d => d.speed)) + " km/h" : "---"}
                    </span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 uppercase flex items-center gap-1">
                        <Activity className="w-3 h-3" /> RPM
                    </span>
                    <span className="text-xl font-mono text-f1-red font-bold">
                        {carData.length ? carData[carData.length - 1].rpm : "---"}
                    </span>
                </div>
            </div>
            <div className="flex-1 min-h-0 relative">
                {loading && !carData.length && (
                    <Skeleton className="absolute inset-0 h-full w-full bg-surface/50" />
                )}
                <TelemetryChart data={carData} />
            </div>
        </Card>
    );
}
