import { Bell } from "lucide-react";

export default function NotificationsModal({ setShowNotifications, notifications }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowNotifications(false)} />
            <div className="bg-surface w-full max-w-md rounded-3xl border border-white/10 shadow-2xl relative z-10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Bell size={18} className="text-primary" /> Notifications
                    </h2>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {notifications && notifications.length > 0 ? (
                        notifications.map((n, i) => (
                            <div key={n._id || i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                                <p className="text-white font-medium">{n.message || n.content || "New notification"}</p>
                                <span className="text-[9px] text-gray-500 mt-1 block">
                                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : "Just now"}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-xs text-gray-500 italic">No new notifications</div>
                    )}
                </div>
            </div>
        </div>
    );
}
