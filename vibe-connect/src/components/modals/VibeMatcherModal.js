import { ZapOff, HeartHandshake, Zap } from "lucide-react";

export default function VibeMatcherModal({ setShowVibeMatcher, vibeProfiles, currentVibeCard, setCurrentVibeCard }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowVibeMatcher(false)} />
            <div className="w-full max-w-sm aspect-[3/4] bg-surface rounded-[40px] border border-white/10 shadow-2xl relative z-10 overflow-hidden flex flex-col p-6 group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-black/80 z-0" />
                
                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-[10px] font-black tracking-[0.3em] uppercase text-primary">Soulmatch AI</div>
                        <button onClick={() => setShowVibeMatcher(false)} className="text-gray-500 hover:text-white">✕</button>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        {currentVibeCard < vibeProfiles.length ? (
                            <div className="w-full aspect-square rounded-3xl bg-zinc-900 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-500" key={currentVibeCard}>
                                <h4 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">"{vibeProfiles[currentVibeCard].vibe}"</h4>
                                <p className="text-gray-400 text-xs italic font-medium leading-relaxed">{vibeProfiles[currentVibeCard].desc}</p>
                                <p className="mt-4 text-[10px] font-black text-primary uppercase tracking-widest">— {vibeProfiles[currentVibeCard].name}</p>
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px]" />
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-xs text-gray-500 italic">No more vibes in your area... Check back later!</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-6">
                        <button onClick={() => setCurrentVibeCard(prev => prev + 1)} className="p-5 rounded-full bg-white/5 border border-white/10 text-gray-500 hover:text-red-400 hover:border-red-400/50 hover:bg-red-400/10 transition-all active:scale-90 shadow-xl">
                            <ZapOff size={28} />
                        </button>
                        <button onClick={() => { alert("IT'S A SOULMATCH! ⚡"); setCurrentVibeCard(prev => prev + 1); }} className="p-6 rounded-full bg-primary text-white shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] hover:scale-110 active:scale-95 transition-all">
                            <HeartHandshake size={32} />
                        </button>
                        <button onClick={() => setCurrentVibeCard(prev => prev + 1)} className="p-5 rounded-full bg-white/5 border border-white/10 text-gray-500 hover:text-primary hover:border-primary/50 hover:bg-primary/10 transition-all active:scale-90 shadow-xl">
                            <Zap size={28} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
