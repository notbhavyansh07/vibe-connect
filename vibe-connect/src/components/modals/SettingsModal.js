export default function SettingsModal({ setShowSettings }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
            <div className="bg-surface w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl relative z-10 p-6">
                <h2 className="text-xl font-bold mb-6">Vibe Settings</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span>Private Profile</span>
                        <div className="w-10 h-6 bg-primary/20 rounded-full p-1"><div className="w-4 h-4 bg-primary rounded-full transition-all ml-4" /></div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span>Notifications</span>
                        <div className="w-10 h-6 bg-primary/20 rounded-full p-1"><div className="w-4 h-4 bg-primary rounded-full transition-all ml-4" /></div>
                    </div>
                    <button className="w-full mt-4 btn btn-primary py-2 text-sm justify-center" onClick={() => setShowSettings(false)}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}
