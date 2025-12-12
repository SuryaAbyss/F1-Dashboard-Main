import { openF1 } from "@/lib/api";
import { DriverGrid } from "@/components/dashboard/driver-grid";
import { Card } from "@/components/ui/card";

export default async function AnalyticsPage() {
    const session = await openF1.getLatestSession();

    if (!session) {
        return (
            <div className="flex items-center justify-center h-[80vh] p-6">
                <Card className="max-w-md text-center p-8">
                    <h2 className="text-xl font-bold mb-2">Unavailable</h2>
                    <p className="text-gray-400">No active session data found for analytics.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8 min-h-screen flex flex-col gap-8">
            <header className="border-b border-gray-800 pb-6">
                <h1 className="text-4xl font-bold tracking-tight text-white uppercase italic">
                    Driver Analytics
                </h1>
                <p className="text-gray-400 mt-2 text-lg">Select a driver profile to view detailed performance metrics, strategy, and radio communications.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                <DriverGrid sessionKey={session.session_key} />
            </div>
        </div>
    );
}
