import { Zap } from "lucide-react";

export default function VibeShopModal({ setShowVibeShop, vibeTokens, setVibeTokens, purchasedEffects, setPurchasedEffects }) {
    return (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowVibeShop(false)} />
            <div className="bg-surface w-full max-w-xl rounded-3xl border border-white/10 shadow-2xl relative z-10 p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black italic uppercase text-white">Vibe Shop</h2>
                    <div className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
                        <Zap size={14} className="text-primary fill-primary" />
                        <span className="text-xs font-black text-primary">{vibeTokens.toLocaleString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: 'neon_border', name: 'Neon Aura', price: 500, icon: '✨' },
                        { id: 'glitch_text', name: 'Glitch Mode', price: 1200, icon: '👾' },
                        { id: 'cyber_badge', name: 'Elite Badge', price: 2000, icon: '💎' },
                        { id: 'dark_theme', name: 'Deep Void', price: 5000, icon: '🌌' }
                    ].map(item => (
                        <div key={item.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-primary/50 transition-all group flex flex-col justify-between aspect-video">
                            <div className="flex justify-between">
                                <span className="text-2xl">{item.icon}</span>
                                {purchasedEffects.includes(item.id) ? (
                                    <span className="text-[9px] font-black text-green-500 uppercase">Owned</span>
                                ) : (
                                    <span className="text-[9px] font-black text-gray-500 tracking-widest uppercase">{item.price} TK</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.name}</h4>
                                <button 
                                    disabled={vibeTokens < item.price || purchasedEffects.includes(item.id)}
                                    onClick={() => {
                                        setVibeTokens(prev => prev - item.price);
                                        setPurchasedEffects(prev => [...prev, item.id]);
                                    }}
                                    className="w-full mt-3 btn btn-primary py-1.5 text-[10px] font-black uppercase disabled:bg-white/5 disabled:text-gray-600 shadow-none border-none h-auto"
                                >
                                    {purchasedEffects.includes(item.id) ? 'Active' : 'Buy Vibe'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
