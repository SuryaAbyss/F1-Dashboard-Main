"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Weather } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TrackConditionsProps {
    sessionKey: number;
}

export function TrackConditions({ sessionKey }: TrackConditionsProps) {
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadWeather = async () => {
            setLoading(true);
            try {
                const weatherData = await openF1.getWeather(sessionKey);
                // Get the latest weather reading
                if (weatherData.length > 0) {
                    setWeather(weatherData[weatherData.length - 1]);
                }
            } catch (e) {
                console.error("Failed to load weather:", e);
            } finally {
                setLoading(false);
            }
        };
        loadWeather();
    }, [sessionKey]);

    if (loading) {
        return (
            <Card title="Track Conditions" className="h-full">
                <Skeleton className="w-full h-full" />
            </Card>
        );
    }

    if (!weather) {
        return (
            <Card title="Track Conditions" className="h-full">
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                    No weather data available
                </div>
            </Card>
        );
    }

    const conditions = [
        {
            label: "Track Temp",
            value: `${weather.track_temperature?.toFixed(1) ?? "N/A"}°C`,
            icon: "🏁"
        },
        {
            label: "Air Temp",
            value: `${weather.air_temperature?.toFixed(1) ?? "N/A"}°C`,
            icon: "🌡️"
        },
        {
            label: "Humidity",
            value: `${weather.humidity?.toFixed(0) ?? "N/A"}%`,
            icon: "💧"
        },
        {
            label: "Pressure",
            value: `${weather.pressure?.toFixed(0) ?? "N/A"} mb`,
            icon: "🌀"
        },
        {
            label: "Wind Speed",
            value: `${weather.wind_speed?.toFixed(1) ?? "N/A"} m/s`,
            icon: "💨"
        },
        {
            label: "Wind Dir",
            value: `${weather.wind_direction ?? "N/A"}°`,
            icon: "🧭"
        },
        {
            label: "Rainfall",
            value: weather.rainfall ? "Yes" : "No",
            icon: weather.rainfall ? "🌧️" : "☀️"
        }
    ];

    return (
        <Card title="Track Conditions" className="h-full">
            <div className="grid grid-cols-2 gap-3 p-4 overflow-y-auto max-h-full custom-scrollbar">
                {conditions.map((condition, idx) => (
                    <div
                        key={idx}
                        className="bg-surface-highlight/30 rounded-lg p-3 border border-gray-800"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{condition.icon}</span>
                            <span className="text-xs text-gray-400 uppercase font-mono">
                                {condition.label}
                            </span>
                        </div>
                        <div className="text-xl font-bold text-white font-mono">
                            {condition.value}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
