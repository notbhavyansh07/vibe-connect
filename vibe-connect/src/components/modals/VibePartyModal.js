import { Send } from "lucide-react";

export default function VibePartyModal({ 
    setShowVibeParty, 
    roomVibe, 
    setRoomVibe, 
    partyMessages, 
    partyMessage, 
    setPartyMessage, 
    socket, 
    mongoUser, 
    user 
}) {
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowVibeParty(false)} />
            <div className={`w-full max-w-4xl h-[80vh] ${roomVibe} rounded-[40px] border border-white/10 shadow-[0_0_100px_rgba(var(--primary-rgb),0.3)] relative z-10 overflow-hidden flex transition-all duration-1000`}>
                {/* 3D Generative Background */}
                <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)] animate-pulse" />
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0%,_var(--secondary)_50%,_transparent_100%)] animate-[spin_10s_linear_infinite]" />
                </div>

                {/* Left Side: Party Visuals */}
                <div className="w-1/2 p-12 flex flex-col justify-between relative z-20">
                    <div>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">The Vibe Party</h2>
                        <p className="text-gray-400 text-xs font-bold tracking-[0.3em] uppercase mt-2">Live with 8 others</p>
                    </div>
                    
                    <div className="flex -space-x-4">
                        {[1,2,3,4,5].map(i => <div key={i} className="w-12 h-12 rounded-full border-4 border-black bg-zinc-800 flex items-center justify-center text-xs font-bold overflow-hidden shadow-2xl transition-transform hover:scale-110"><img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" /></div>)}
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                            <h3 className="text-[10px] font-black text-primary uppercase mb-2">Room Vibe Selector</h3>
                            <div className="flex gap-2 text-[10px]">
                                 <button onClick={() => setRoomVibe("bg-[#050505] shadow-[inset_0_0_50px_rgba(255,0,255,0.1)]")} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full hover:bg-primary/20 transition-all">Neon Cyber</button>
                                 <button onClick={() => setRoomVibe("bg-black")} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full">Pure Void</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Vibe Chat */}
                <div className="w-1/2 border-l border-white/10 p-8 flex flex-col relative z-20 bg-black/40 backdrop-blur-2xl">
                     <div className="flex-1 overflow-y-auto space-y-4 pr-4 no-scrollbar">
                         {partyMessages.length === 0 ? (
                             <div className="h-full flex items-center justify-center text-gray-600 text-xs font-medium italic">Drop a vibe in the chat...</div>
                         ) : (
                             partyMessages.map((msg, i) => (
                                 <div key={i} className={`animate-in slide-in-from-right-4 duration-300`}>
                                     <span className="text-[10px] font-black text-primary uppercase mr-2">{msg.author}:</span>
                                     <span className="text-xs text-white leading-relaxed">{msg.text}</span>
                                 </div>
                             ))
                         )}
                     </div>

                     <div className="mt-6 flex gap-3">
                         <input 
                            type="text" 
                            value={partyMessage}
                            onChange={(e) => setPartyMessage(e.target.value)}
                            placeholder="Neon text only..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-primary transition-all text-white"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && partyMessage.trim()) {
                                    const msg = { chatId: 'global-party', content: partyMessage, senderId: mongoUser?._id };
                                    socket.emit('send-message', msg);
                                    socket.emit('new-message', { author: user?.name || "Viber", text: partyMessage });
                                    setPartyMessage("");
                                }
                            }}
                         />
                         <button className="p-3 bg-primary text-white rounded-full shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all active:scale-90" onClick={() => {
                             if (partyMessage.trim()) {
                                const msg = { chatId: 'global-party', content: partyMessage, senderId: mongoUser?._id };
                                socket.emit('send-message', msg);
                                socket.emit('new-message', { author: user?.name || "Viber", text: partyMessage });
                                setPartyMessage("");
                            }
                         }}>
                             <Send size={18} />
                         </button>
                     </div>
                </div>
            </div>
        </div>
    );
}
