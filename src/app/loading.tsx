export default function Loading() {
    return (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0d0d12] text-white">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-f1-red/10 via-transparent to-transparent opacity-50 blur-3xl animate-pulse" />

            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Logo/Text */}
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-bold italic tracking-tighter animate-in fade-in zoom-in duration-700">
                        FORMULA<span className="text-f1-red">F1</span> DASH
                    </h1>
                    <p className="text-[10px] tracking-[0.2em] text-white/40 font-mono mt-2 uppercase animate-in slide-in-from-bottom-2 duration-1000 delay-300">
                        Designed by <span className="text-neon-cyan font-bold glow-text">Surya</span>
                    </p>
                </div>

                {/* Starting Lights Container */}
                <div className="flex gap-3 p-4 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-2xl">
                    {/* Light 1 */}
                    <div className="w-4 h-12 rounded-full border border-gray-700 bg-[#1a1a1a] overflow-hidden relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-f1-red h-full rounded-full animate-light-sequence opacity-0" style={{ animationDelay: '0s' }} />
                    </div>
                    {/* Light 2 */}
                    <div className="w-4 h-12 rounded-full border border-gray-700 bg-[#1a1a1a] overflow-hidden relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-f1-red h-full rounded-full animate-light-sequence opacity-0" style={{ animationDelay: '0.4s' }} />
                    </div>
                    {/* Light 3 */}
                    <div className="w-4 h-12 rounded-full border border-gray-700 bg-[#1a1a1a] overflow-hidden relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-f1-red h-full rounded-full animate-light-sequence opacity-0" style={{ animationDelay: '0.8s' }} />
                    </div>
                    {/* Light 4 */}
                    <div className="w-4 h-12 rounded-full border border-gray-700 bg-[#1a1a1a] overflow-hidden relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-f1-red h-full rounded-full animate-light-sequence opacity-0" style={{ animationDelay: '1.2s' }} />
                    </div>
                    {/* Light 5 */}
                    <div className="w-4 h-12 rounded-full border border-gray-700 bg-[#1a1a1a] overflow-hidden relative group">
                        <div className="absolute inset-x-0 bottom-0 bg-f1-red h-full rounded-full animate-light-sequence opacity-0" style={{ animationDelay: '1.6s' }} />
                    </div>
                </div>

                <div className="text-xs text-gray-500 font-mono animate-pulse">
                    INITIALIZING TELEMETRY...
                </div>
            </div>
        </div>
    );
}
