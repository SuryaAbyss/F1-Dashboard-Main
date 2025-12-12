import { openF1 } from "@/lib/api";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import clsx from "clsx";

export default async function DriversPage() {
    const session = await openF1.getLatestSession();
    if (!session) return <div>No session</div>;

    const drivers = await openF1.getDrivers(session.session_key);
    // Sort by number or team usually, here just number
    drivers.sort((a, b) => a.driver_number - b.driver_number);

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold uppercase italic text-white">Driver Grid</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {drivers.map(driver => (
                    <Link key={driver.driver_number} href={`/drivers/${driver.driver_number}`}>
                        <Card className="hover:border-f1-red transition-colors group cursor-pointer block">
                            <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 bg-surface-highlight rounded-full overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
                                    <img src={driver.headshot_url} alt={driver.name_acronym} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <div className="text-3xl font-bold italic text-white/10 absolute right-2 top-2 select-none group-hover:text-white/20 transition-colors">
                                        {driver.driver_number}
                                    </div>
                                    <div className="font-bold text-lg text-white group-hover:text-f1-red transition-colors">
                                        {driver.full_name}
                                    </div>
                                    <div className="text-xs uppercase text-gray-500 font-mono flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ background: `#${driver.team_colour}` }} />
                                        {driver.team_name}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
