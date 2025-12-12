"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Lap } from "@/types/openf1";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface DriverLapChartProps {
    sessionKey: number;
    driverNumber: number;
}

export function DriverLapChart({ sessionKey, driverNumber }: DriverLapChartProps) {
    const [laps, setLaps] = useState<Lap[]>([]);

    useEffect(() => {
        const fetchLaps = async () => {
            const data = await openF1.getLaps(sessionKey, driverNumber);
            setLaps(data.filter(l => l.lap_duration)); // Filter invalid laps
        };
        fetchLaps();
    }, [sessionKey, driverNumber]);

    return (
        <div className="w-full h-full p-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={laps}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="lap_number" stroke="#666" />
                    <YAxis domain={['auto', 'auto']} stroke="#666" hide />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333' }}
                        labelStyle={{ color: '#888' }}
                    />
                    <Line type="monotone" dataKey="lap_duration" stroke="#FF1801" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
