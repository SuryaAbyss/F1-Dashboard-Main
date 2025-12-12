"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Lap } from "@/types/openf1";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

interface Props {
    sessionKey: number;
}

export function TireDegradationChart({ sessionKey }: Props) {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
            // Compare top 2 drivers for simplified view
            // In real app, we fetch all stints and map laps
            // Here: Fetch laps for driver 1 and driver 44/16/11
            const d1Laps = await openF1.getLaps(sessionKey, 1);
            const d2Laps = await openF1.getLaps(sessionKey, 44); // Hamilton default
            // We assume lap number effectively correlates to tire age for the first stint 
            // (Simulated logic: Lap # in stint vs Lap Time)

            // Simple mapping: lap_number vs lap_duration
            const d1Points = d1Laps.filter(l => l.lap_duration).map(l => ({ x: l.lap_number, y: l.lap_duration, driver: 'VER' }));
            const d2Points = d2Laps.filter(l => l.lap_duration).map(l => ({ x: l.lap_number, y: l.lap_duration, driver: 'HAM' }));

            setData([...d1Points, ...d2Points]);
        };
        load();
    }, [sessionKey]);

    return (
        <div className="p-4 w-full h-full">
            <ResponsiveContainer>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" dataKey="x" name="Lap Number" stroke="#666" />
                    <YAxis type="number" dataKey="y" name="Time (s)" domain={['auto', 'auto']} stroke="#666" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#1A1A1A' }} />
                    <Legend />
                    <Scatter name="VER" data={data.filter(d => d.driver === 'VER')} fill="#00F0FF" />
                    <Scatter name="HAM" data={data.filter(d => d.driver === 'HAM')} fill="#FF1801" />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}
