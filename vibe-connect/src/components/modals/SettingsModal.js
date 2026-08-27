import { Settings, Shield, Moon, Bell } from "lucide-react";

export default function SettingsModal({ setShowSettings }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSettings(false)} />
            <div className="bg-surface w-full max-w-md rounded-3xl border border-white/10 shadow-2xl relative z-10 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Settings size={18} className="text-primary" /> Settings
                    </h2>
                    <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                        <span className="flex items-center gap-2 font-medium"><Shield size={16} /> Privacy Mode</span>
                        <input type="checkbox" defaultChecked className="accent-primary cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                        <span className="flex items-center gap-2 font-medium"><Bell size={16} /> Push Notifications</span>
                        <input type="checkbox" defaultChecked className="accent-primary cursor-pointer" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs">
                        <span className="flex items-center gap-2 font-medium"><Moon size={16} /> Dark Mode</span>
                        <input type="checkbox" defaultChecked disabled className="accent-primary cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
}
