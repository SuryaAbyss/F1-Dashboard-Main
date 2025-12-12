"use client";

import { useEffect, useState } from "react";
import { openF1 } from "@/lib/api";
import { Pit } from "@/types/openf1";

interface Props {
    sessionKey: number;
    driverNumber: number;
}

export function PitStopTable({ sessionKey, driverNumber }: Props) {
    const [pits, setPits] = useState<Pit[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await openF1.getPits(sessionKey, driverNumber);
            setPits(data);
        };
        load();
    }, [sessionKey, driverNumber]);

    if (!pits.length) return <div className="text-gray-500 text-sm p-4">No pit stops recorded.</div>;

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-2">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase border-b border-gray-800">
                    <tr>
                        <th className="px-3 py-2">Lap</th>
                        <th className="px-3 py-2">Duration</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {pits.map((pit, i) => (
                        <tr key={i} className="hover:bg-white/5">
                            <td className="px-3 py-2 text-white font-mono">{pit.lap_number}</td>
                            <td className="px-3 py-2 text-f1-red font-mono font-bold">{pit.pit_duration}s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
