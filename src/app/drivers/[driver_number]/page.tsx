import { openF1 } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { DriverLapChart } from "@/components/charts/driver-lap-chart";
import { PitStopTable } from "@/components/dashboard/pit-stop-table";
import { TeamRadioList } from "@/components/dashboard/team-radio-list";
import { StintHistory } from "@/components/dashboard/stint-history";
import { notFound } from "next/navigation";

// Next.js 15+ params type is a Promise
interface PageProps {
    params: Promise<{ driver_number: string }>;
}

export default async function DriverDetailPage(props: PageProps) {
    const params = await props.params;
    const driverNumber = parseInt(params.driver_number);
    if (isNaN(driverNumber)) return <div className="p-10 text-red-500">Invalid Driver Number: {params.driver_number}</div>;

    const session = await openF1.getLatestSession();
    if (!session) return <div className="p-10 text-red-500">No active session found</div>;

    const drivers = await openF1.getDrivers(session.session_key);
    const driver = drivers.find(d => d.driver_number === driverNumber);

    if (!driver) {
        return (
            <div className="p-10 text-red-500 font-mono">
                <h1 className="text-xl font-bold">Driver Not Found</h1>
                <p>Looking for Driver #: {driverNumber}</p>
                <p>Session Key: {session.session_key}</p>
                <p>Available Drivers: {drivers.map(d => d.driver_number).join(', ')}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen">
            <header className="flex items-center gap-6 border-b border-gray-800 pb-6">
                <div className="w-32 h-32 bg-surface-highlight rounded-lg overflow-hidden border-4" style={{ borderColor: `#${driver.team_colour}` }}>
                    <img src={driver.headshot_url} alt={driver.name_acronym} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="text-5xl font-bold uppercase italic text-white flex items-center gap-4">
                        {driver.last_name}
                        <span className="text-transparent stroke-text text-2xl opacity-50 font-mono">#{driver.driver_number}</span>
                    </h1>
                    <div className="text-xl text-gray-400 mt-2 flex items-center gap-3">
                        <span className="bg-white/10 px-3 py-1 rounded text-sm uppercase tracking-wider text-white">
                            {driver.team_name}
                        </span>
                        <span className="font-mono text-sm">{driver.name_acronym}</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Lap Time Evolution - Large */}
                <Card title="Lap Time Evolution" className="lg:col-span-2 h-[400px]">
                    <DriverLapChart sessionKey={session.session_key} driverNumber={driverNumber} />
                </Card>

                {/* Stints - Top Right */}
                <Card title="Tyre Strategy" className="h-[400px]">
                    <StintHistory sessionKey={session.session_key} driverNumber={driverNumber} />
                </Card>

                {/* Pit Stop History */}
                <Card title="Pit Stops" className="h-[350px]">
                    <PitStopTable sessionKey={session.session_key} driverNumber={driverNumber} />
                </Card>

                {/* Team Radio */}
                <Card title="Team Radio" className="h-[350px] lg:col-span-2">
                    <TeamRadioList sessionKey={session.session_key} driverNumber={driverNumber} />
                </Card>
            </div>
        </div>
    );
}
