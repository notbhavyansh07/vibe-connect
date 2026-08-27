import React from 'react';
import { Sparkles, Flame, Radio, MessageSquare, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  className = 'lg:hidden',
}) => {
  const items = [
    { id: 'home', label: '3D World', icon: Sparkles },
    { id: 'matcher', label: 'Matcher', icon: Flame },
    { id: 'lounge', label: 'Lounge', icon: Radio },
    { id: 'feed', label: 'Feed', icon: MessageSquare },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className={`${className} fixed bottom-0 left-0 right-0 z-50 bg-slate-950/90 border-t border-white/10 backdrop-blur-xl px-2 py-2 flex items-center justify-around`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-cyan-400 font-bold scale-110'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-heading">{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenProfile}
        className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200"
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-heading">Profile</span>
      </button>
    </nav>
  );
};
