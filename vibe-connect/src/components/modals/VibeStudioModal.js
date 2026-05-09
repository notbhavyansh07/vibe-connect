import { Zap, Sparkles, ImagePlus, Settings, Clock, ShieldCheck } from "lucide-react";

export default function VibeStudioModal({ setShowVibeStudio, vibeTokens }) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setShowVibeStudio(false)} />
            <div className="bg-[#0e0e0f] w-full max-w-4xl h-[85vh] rounded-[40px] border border-white/5 shadow-[0_0_80px_rgba(0,255,255,0.15)] relative z-10 overflow-hidden flex flex-col p-10 group selection:bg-cyan-500/30">
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-cyan-500/10 blur-[100px] group-hover:bg-cyan-500/20 transition-all duration-1000" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 blur-[100px] group-hover:bg-purple-500/20 transition-all duration-1000" />

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">Vibe Studio <span className="text-cyan-400 not-italic font-light">BETA</span></h2>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mt-2">Powered by Antigravity & Stitch</p>
                        </div>
                        <button onClick={() => setShowVibeStudio(false)} className="p-4 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">✕</button>
                    </div>

                    <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden">
                        <div className="col-span-4 space-y-6">
                            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-md relative overflow-hidden group/card text-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                <Zap className="mx-auto text-cyan-400 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" size={32} fill="currentColor" />
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Global Vibe Tokens</h3>
                                <div className="text-4xl font-black text-white">{vibeTokens.toLocaleString()} <span className="text-xs text-cyan-400">$VIBE</span></div>
                                <button className="mt-6 w-full py-3 bg-cyan-400 text-black text-xs font-black uppercase rounded-xl hover:bg-cyan-300 transition-all shadow-[0_10px_20px_rgba(34,211,238,0.2)]">Mining Sync</button>
                            </div>

                            <div className="bg-white/5 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">AI Model Status</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-300">Antigravity Core</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-black animate-pulse">ACTIVE</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-300">Stitch Design Engine</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-full font-black">READY</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-8 flex flex-col gap-6 overflow-hidden">
                            <div className="flex-1 bg-white/5 border border-white/5 rounded-3xl p-8 backdrop-blur-md relative flex flex-col overflow-hidden">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-cyan-400/20 flex items-center justify-center text-cyan-400">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white">AI UI Architect</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Generate components via Stitch</p>
                                    </div>
                                </div>

                                <textarea 
                                    placeholder="Describe the UI component you want to manifest... (e.g., 'A holographic profile card for a cyber-social app')"
                                    className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-gray-200 focus:outline-none focus:border-cyan-400/50 transition-all resize-none placeholder:text-gray-700 font-medium"
                                />

                                <div className="mt-6 flex gap-4">
                                    <button className="flex-1 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-black uppercase rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(34,211,238,0.25)]">
                                        Initialize Manifestation
                                    </button>
                                    <button className="px-6 border border-white/10 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                                        <Settings size={20} />
                                    </button>
                                </div>

                                <div className="mt-10 border-t border-white/5 pt-8">
                                    <h5 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">Neural Drafts</h5>
                                    <div className="flex gap-4">
                                        <div className="w-24 aspect-square bg-black/60 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer flex items-center justify-center group/draft">
                                            <ImagePlus size={20} className="text-gray-800 group-hover/draft:text-cyan-400 transition-colors" />
                                        </div>
                                        <div className="w-24 aspect-square bg-black/60 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition-all cursor-pointer overflow-hidden p-2">
                                            <div className="w-full h-full bg-cyan-400/10 rounded-lg flex items-center justify-center text-[10px] font-black text-cyan-400/50 italic py-2 text-center">Login Manifest #1</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center justify-between text-gray-600">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Clock size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Last Sync: 2m ago</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck size={12} className="text-green-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Neural Link Secure</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em]">Antigravity Unification v1.0.4</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
