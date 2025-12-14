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
  await new Promise((resolve) => setTimeout(resolve, 3000));

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
      <header className="flex justify-between items-end border-b border-white/10 pb-4 glass-card-subtle rounded-lg px-6 py-4 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">
            {session.meeting_key ? `${session.circuit_short_name} GP` : "Grand Prix"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Latest Race</p>
          <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
            <span className="bg-surface-highlight px-2 py-0.5 rounded text-xs font-mono text-white">  {session.year}</span>
            <span>{session.session_name}</span>
            <span className="text-xs">•</span>
            <span className="font-mono">{new Date(session.date_start).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-f1-red font-bold uppercase tracking-widest mb-1 animate-pulse">Live Timing</div>
          <div className="text-xl font-mono tabular-nums text-white">00:00:00</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 pt-4 items-start">
        {/* Left Col: Leaderboard - h-fit to show all drivers without scroll */}
        <div className="lg:col-span-3 flex flex-col h-fit">
          <Leaderboard sessionKey={session.session_key} />
        </div>

        {/* Middle Col: Map & Race Control */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <TrackMapSection sessionKey={session.session_key} />
          <div className="h-[500px]">
            <RaceControlPanel sessionKey={session.session_key} />
          </div>
        </div>

        {/* Right Col: Standings & Gap Chart */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-fit">
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
