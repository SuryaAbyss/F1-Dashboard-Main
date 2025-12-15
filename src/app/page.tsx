import { openF1 } from "@/lib/api";

export const dynamic = 'force-dynamic';

import { Leaderboard } from "@/components/dashboard/leaderboard";
import { MiniMap } from "@/components/dashboard/minimap";
import { RaceControlPanel } from "@/components/dashboard/race-control";
import { TrackConditions } from "@/components/dashboard/track-conditions";
import { ChampionshipStandings } from "@/components/dashboard/championship-standings";
import { Card } from "@/components/ui/card";
import { TrackMapSection } from "@/components/dashboard/track-map-section";
export default async function DashboardPage() {
  // Artificial delay to show loading animation
  await new Promise((resolve) => setTimeout(resolve, 3500));

  const session = await openF1.getLatestSession();

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Card className="max-w-md text-center p-8">
          <h2 className="text-xl font-bold mb-2">No Active Session Found</h2>
          <p className="text-gray-400">Could not retrieve recent F1 session data. The API might be down or no season data available.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen p-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-4 glass-card-subtle rounded-lg px-4 md:px-6 py-4 shadow-lg gap-4 md:gap-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white uppercase italic">
            {session.meeting_key ? `${session.circuit_short_name} GP` : "Grand Prix"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Latest Race</p>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-gray-400 mt-1">
            <span className="bg-surface-highlight px-2 py-0.5 rounded text-xs font-mono text-white">  {session.year}</span>
            <span>{session.session_name}</span>
            <span className="text-xs hidden md:inline">•</span>
            <span className="font-mono">{new Date(session.date_start).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-end items-center md:items-end border-t border-white/5 md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
          <div className="text-xs text-f1-red font-bold uppercase tracking-widest mb-0 md:mb-1 animate-pulse">Live Timing</div>
          <div className="text-lg md:text-xl font-mono tabular-nums text-white">00:00:00</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 pt-4 items-start">
        {/* Left Col: Leaderboard - h-fit to show all drivers without scroll */}
        <div className="lg:col-span-3 flex flex-col h-fit order-2 lg:order-1">
          <Leaderboard sessionKey={session.session_key} />
        </div>

        {/* Middle Col: Map & Race Control */}
        <div className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
          <TrackMapSection sessionKey={session.session_key} />
          <div className="h-[400px] md:h-[500px]">
            <RaceControlPanel sessionKey={session.session_key} />
          </div>
        </div>

        {/* Right Col: Standings & Gap Chart */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-fit order-3">
          <div className="h-[300px]">
            <ChampionshipStandings sessionKey={session.session_key} />
          </div>
          <div className="h-[300px]">
            <TrackConditions sessionKey={session.session_key} />
          </div>
        </div>
      </div>
    </div>
  );
}
