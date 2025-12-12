"use client";

import { useEffect, useRef, useState } from "react";
import { openF1 } from "@/lib/api";
import { TrackLocation } from "@/types/openf1";
import { Card } from "@/components/ui/card";
import clsx from "clsx";
import Image from "next/image";
import CircuitImage from "../images/m1.png";

interface MiniMapProps {
    sessionKey: number;
    className?: string; // Add className prop
}

// --------------------------------------------------------------------------
// CONFIGURATION: Adjust these values to manually fit the image/track
// --------------------------------------------------------------------------
const IMAGE_SCALE = 1.0;     // Increase this (e.g., 1.1, 1.2) to scale up the background image
const TRACK_PADDING = 20;    // Decrease this (e.g., 10, 5) to make the track line fill more space
// --------------------------------------------------------------------------

export function MiniMap({ sessionKey, className }: MiniMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [trackData, setTrackData] = useState<TrackLocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // 1. Fetch Track Shape (One full lap of a driver, e.g. Max Verstappen '1')
    useEffect(() => {
        // ... (fetching logic remains same) ...
        const fetchTrack = async () => {
            try {
                // 1. Find the FASTEST lap for the best track shape. 
                // Using 'Fastest Lap' ensures we get a clean, full lap, unlike 'First Valid' which might be an outlap.
                let bestLap: any = null;
                let bestDriver = 1;

                // Check candidate drivers for their best laps
                const candidateDrivers = [1, 11, 16, 55, 44, 63, 4, 81, 14, 18];
                for (const driver of candidateDrivers) {
                    const laps = await openF1.getLaps(sessionKey, driver);
                    // RELAXED: Just check for valid duration, ignore sector segments as they might be missing in API
                    const validLaps = laps.filter(l => l.lap_duration && l.lap_duration > 60 && l.lap_duration < 200);

                    if (validLaps.length > 0) {
                        // Sort by duration ascending (fastest first)
                        validLaps.sort((a, b) => a.lap_duration - b.lap_duration);
                        const fastest = validLaps[0];

                        // If we don't have a best lap yet, or this one is faster, take it
                        if (!bestLap || fastest.lap_duration < bestLap.lap_duration) {
                            bestLap = fastest;
                            bestDriver = driver;
                        }
                    }
                }

                // Fallback to all drivers if top drivers failed
                if (!bestLap) {
                    console.log("MiniMap: Top drivers failed, fetching ALL laps...");
                    const allLaps = await openF1.getLaps(sessionKey);
                    const validLaps = allLaps.filter(l => l.lap_duration && l.lap_duration > 60 && l.lap_duration < 200);
                    if (validLaps.length > 0) {
                        validLaps.sort((a, b) => a.lap_duration - b.lap_duration);
                        bestLap = validLaps[0];
                        bestDriver = bestLap.driver_number;
                    }
                }

                if (!bestLap) {
                    console.warn("No valid lap found for track map generation");
                    setErrorMsg("NO VALID LAPS FOUND");
                    setTrackData([]);
                    setLoading(false);
                    return;
                }

                console.log(`MiniMap: Selected Fastest Lap: ${bestLap.lap_duration}s by Driver ${bestDriver}`);

                // Fetch locations for the best lap
                const start = new Date(bestLap.date_start);
                const end = new Date(start.getTime() + (bestLap.lap_duration * 1000));

                const locs = await openF1.getLocations(
                    sessionKey,
                    bestDriver,
                    bestLap.date_start,
                    end.toISOString()
                );

                console.log(`MiniMap: Fetched ${locs.length} locations`);

                if (locs.length < 50) {
                    console.warn("MiniMap: Insufficient data points");
                    setErrorMsg(`LOW DATA (${locs.length} pts)`);
                    setTrackData([]);
                    setLoading(false);
                    return;
                }

                setTrackData(locs);
                setErrorMsg(null);
            } catch (e) {
                console.error("Failed to load map", e);
            } finally {
                setLoading(false);
            }
        };
        fetchTrack();
    }, [sessionKey]);

    // 2. Draw Track Function
    const drawTrack = () => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to match container
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // Handle Empty Data
        if (!trackData.length && !loading) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#333";
            ctx.font = "12px monospace";
            ctx.textAlign = "center";
            ctx.fillText(errorMsg || "NO TRACK DATA", canvas.width / 2, canvas.height / 2);
            return;
        }

        if (!trackData.length) return;

        // Calculate bounds
        const xs = trackData.map(p => p.x);
        const ys = trackData.map(p => p.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const widthRange = maxX - minX;
        const heightRange = maxY - minY;

        const scaleX = widthRange === 0 ? 1 : (canvas.width - TRACK_PADDING * 2) / widthRange;
        const scaleY = heightRange === 0 ? 1 : (canvas.height - TRACK_PADDING * 2) / heightRange;
        const scale = Math.min(scaleX, scaleY);

        const offsetX = (canvas.width - (maxX - minX) * scale) / 2 - minX * scale;
        const offsetY = (canvas.height - (maxY - minY) * scale) / 2 - minY * scale;

        // Draw track
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        trackData.forEach((p, i) => {
            const x = p.x * scale + offsetX;
            const y = canvas.height - (p.y * scale + offsetY); // Flip Y (usually graphics coords are top-down)
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    };

    // 3. Effect to handle Resize and Data updates
    useEffect(() => {
        // Draw immediately if data changes
        drawTrack();

        // Setup ResizeObserver
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver(() => {
            drawTrack();
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
        };
    }, [trackData, loading]); // also dep on trackData so we redraw when data comes in

    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
    const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.5));
    const handleResetZoom = () => setZoom(1);

    return (
        <div ref={containerRef} className={clsx("w-full min-h-[450px] relative overflow-hidden bg-[#15151e]", className)}>
            {/* Zoomable Container for BOTH Image and Canvas */}
            <div
                className="absolute inset-0 transition-transform duration-200 flex items-center justify-center p-4 bg-[#15151e]"
                style={{ transform: `scale(${zoom})` }}
            >
                {/* 1. Circuit Image - Use object-contain so it fits without cropping */}
                <div
                    className="absolute inset-0 z-0 flex items-center justify-center"
                    style={{ transform: `scale(${IMAGE_SCALE})` }} // Manual image scale adjustment
                >
                    <div className="relative w-full h-full p-4">
                        <Image
                            src={CircuitImage}
                            alt="Circuit Map"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* 2. Canvas Layer */}
                <canvas
                    ref={canvasRef}
                    className="block relative z-10 w-full h-full pointer-events-none"
                    style={{ opacity: 0.9 }}
                />
            </div>

            {/* Zoom Controls (Fixed Position) */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-20 bg-surface-highlight/90 backdrop-blur rounded-lg p-1 border border-white/10">
                <button
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-white/10 rounded text-white font-bold"
                    title="Zoom In"
                >
                    +
                </button>
                <button
                    onClick={handleResetZoom}
                    className="p-1 hover:bg-white/10 rounded text-xs text-white/70"
                    title="Reset Zoom"
                >
                    ⟲
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-white/10 rounded text-white font-bold"
                    title="Zoom Out"
                >
                    −
                </button>
            </div>
        </div>
    );
}
