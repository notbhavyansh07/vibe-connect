export default function NotificationsModal({ setShowNotifications, notifications }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNotifications(false)} />
            <div className="bg-surface w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl relative z-10 p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 underline underline-offset-8 decoration-primary">Notifications</h2>
                    <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/5 rounded-full">✕</button>
                </div>
                {notifications.length === 0 ? (
                    <div className="py-10 text-center text-gray-500 text-sm">No new vibes yet.</div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map(n => (
                            <div key={n._id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent" />
                                <div className="flex-1">
                                    <p className="text-[13px]"><span className="font-bold">{n.senderId?.handle || "User"}</span> {n.type === 'LIKE' ? 'liked your post' : 'sent you a vibe'}</p>
                                    <p className="text-[11px] text-gray-500">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
