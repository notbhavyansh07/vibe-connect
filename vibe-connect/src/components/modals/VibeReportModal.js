export default function VibeReportModal({ setShowVibeReport }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowVibeReport(false)} />
            <div className="bg-surface w-full max-w-lg rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(var(--primary-rgb),0.2)] relative z-10 p-8 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] group-hover:bg-primary/40 transition-all" />
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Weekly Vibe Report</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">AI-Gnerated Summary</p>
                    </div>
                    <button onClick={() => setShowVibeReport(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500">✕</button>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Top Vibe-Mates</h3>
                        <div className="flex gap-4">
                            {['David', 'Anya', 'Jessica'].map(name => (
                                <div key={name} className="flex flex-col items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border border-white/10 flex items-center justify-center text-xs font-black">{name[0]}</div>
                                    <span className="text-[9px] font-bold text-gray-500 uppercase">{name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-4 rounded-2xl">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Collective Mood</h3>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">🌃</div>
                            <div>
                                <p className="text-sm font-bold text-white">Techno-Optimistic</p>
                                <p className="text-[10px] text-gray-500 leading-tight mt-1">You and your matches are focused on building and futuristic aesthetics this week.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl text-center">
                        <p className="text-xs text-primary font-bold italic">"Your digital heartbeat is synchronizing with the neon night. Keep building."</p>
                    </div>
                </div>

                <button 
                    className="w-full mt-8 btn btn-primary py-4 rounded-full text-sm font-bold shadow-[0_10px_20px_rgba(var(--primary-rgb),0.3)]"
                    onClick={() => setShowVibeReport(false)}
                >
                    Sync Next Week
                </button>
            </div>
        </div>
    );
}
