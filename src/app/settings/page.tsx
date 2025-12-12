import { Card } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6 min-h-screen p-6">
            <header className="border-b border-gray-800 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-white uppercase italic">
                    Settings
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Configure your dashboard preferences
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Display Settings">
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                Theme
                            </label>
                            <select className="w-full bg-surface-highlight border border-gray-700 rounded px-3 py-2 text-white">
                                <option>Dark (Default)</option>
                                <option>Light</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-300 mb-2 block">
                                Refresh Interval
                            </label>
                            <select className="w-full bg-surface-highlight border border-gray-700 rounded px-3 py-2 text-white">
                                <option>5 seconds</option>
                                <option>10 seconds</option>
                                <option>30 seconds</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <Card title="Data Preferences">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Show Team Colors</span>
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Auto-refresh Data</span>
                            <input type="checkbox" defaultChecked className="w-4 h-4" />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Enable Notifications</span>
                            <input type="checkbox" className="w-4 h-4" />
                        </div>
                    </div>
                </Card>

                <Card title="About">
                    <div className="space-y-2 text-sm text-gray-400">
                        <p><strong className="text-white">Application:</strong> FormulaF1 Dash</p>
                        <p><strong className="text-white">Created By:</strong> Surya</p>
                        <p><strong className="text-white">Version:</strong> 1.0.0</p>
                        <p><strong className="text-white">Data Source:</strong> OpenF1 API</p>
                        <p><strong className="text-white">Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    </div>
                </Card>

                <Card title="Support">
                    <div className="space-y-3 text-sm">
                        <p className="text-gray-400">
                            For issues or feature requests, please contact support.
                        </p>
                        <button className="w-full bg-f1-red hover:bg-f1-red/80 text-white px-4 py-2 rounded font-semibold transition-colors">
                            Report an Issue
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
