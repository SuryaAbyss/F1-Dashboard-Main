"use client";

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CarData } from "@/types/openf1";

interface TelemetryChartProps {
    data: CarData[];
}

export function TelemetryChart({ data }: TelemetryChartProps) {
    if (!data.length) return <div className="h-full flex items-center justify-center text-gray-500 text-xs">No telemetry data</div>;

    // Downsample for performance if needed, or take last N points
    const recentData = data.slice(-100);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={recentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis yAxisId="speed" domain={[0, 350]} hide />
                <YAxis yAxisId="rpm" domain={[0, 15000]} hide />
                <Tooltip
                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #333', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ padding: 0 }}
                    labelStyle={{ display: 'none' }}
                />
                <Line
                    yAxisId="speed"
                    type="monotone"
                    dataKey="speed"
                    stroke="#00F0FF"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                />
                <Line
                    yAxisId="rpm"
                    type="monotone"
                    dataKey="rpm"
                    stroke="#FF1801"
                    strokeWidth={1}
                    dot={false}
                    opacity={0.7}
                    animationDuration={300}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
