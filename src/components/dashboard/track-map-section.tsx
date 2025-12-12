"use client";

import { Card } from "@/components/ui/card";
import { MiniMap } from "@/components/dashboard/minimap";

interface TrackMapSectionProps {
    sessionKey: number;
}

export function TrackMapSection({ sessionKey }: TrackMapSectionProps) {
    const handleOverviewClick = () => {
        window.open('https://www.youtube.com/watch?v=Qri19Co3fV8', '_blank');
    };

    return (
        <Card
            title="Track Map"
            noPadding
            actions={
                <button
                    onClick={handleOverviewClick}
                    className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded bg-f1-red/20 hover:bg-f1-red/30 text-f1-red transition-colors"
                >
                    Overview
                </button>
            }
        >
            <MiniMap sessionKey={sessionKey} />
        </Card>
    );
}
