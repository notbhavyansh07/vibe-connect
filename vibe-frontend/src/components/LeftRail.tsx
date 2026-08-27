import React from 'react';
import { Sparkles, Flame, Radio, MessageSquare, Shield, Activity } from 'lucide-react';
import { RadarChart5D } from './RadarChart5D';
import { soundFx } from '../utils/audioEffects';

interface LeftRailProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  currentUser: { name: string; email: string; avatar: string } | null;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  currentUser,
}) => {
  const navItems = [
    { id: 'home', label: '3D Spatial Space', icon: Sparkles, tag: 'WEBGL' },
    { id: 'matcher', label: '5D Neural Matcher', icon: Flame, tag: 'VECTOR' },
    { id: 'lounge', label: 'Spatial Soundstage', icon: Radio, tag: '96kHz' },
    { id: 'feed', label: 'Community Stream', icon: MessageSquare, tag: 'FEED' },
  ];

  const defaultUserVector: [number, number, number, number, number] = [85, 70, 90, 80, 95];

  return (
    <div className="space-y-5 sticky top-24">
      
      {/* Profile HUD Card */}
      {currentUser && (
        <div 
          onClick={() => {
            soundFx.playClick();
            onOpenProfile();
          }}
          className="hud-rail-card p-4 cursor-pointer hover:border-cyan-500/40 transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-11 h-11 rounded-xl object-cover border border-cyan-400 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center text-[8px] text-white">
                ✓
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-white font-heading truncate group-hover:text-cyan-400 transition-colors">
                {currentUser.name}
              </h3>
              <p className="text-[10px] text-emerald-400 font-mono">● LIVE_NODE // STUDIO_1</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-center">
            <div className="bg-slate-950 p-1.5 rounded-lg border border-white/5">
              <div className="text-xs font-mono font-bold text-cyan-400">98.4%</div>
              <div className="text-[8px] text-slate-500 uppercase font-mono">RESONANCE</div>
            </div>
            <div className="bg-slate-950 p-1.5 rounded-lg border border-white/5">
              <div className="text-xs font-mono font-bold text-violet-400">1.2K</div>
              <div className="text-[8px] text-slate-500 uppercase font-mono">CONNECTIONS</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <div className="hud-rail-card p-2 space-y-1">
        <div className="px-3 py-1.5 text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">
          {'> SYSTEM_NAVIGATION'}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-violet-600/20 border border-cyan-400/40 text-cyan-300'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="font-heading text-xs">{item.label}</span>
              </div>
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                isActive ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-900 text-slate-500'
              }`}>
                {item.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Compact Signature 5D Telemetry Radar */}
      <div className="hud-rail-card p-3 space-y-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 border-b border-white/5 pb-1.5">
          <span className="flex items-center gap-1 text-cyan-400">
            <Activity className="w-3 h-3" /> 5D VECTOR RADAR
          </span>
          <span className="text-[9px] text-emerald-400 font-bold">CALIBRATED</span>
        </div>

        <div className="scale-90 -my-3">
          <RadarChart5D values={defaultUserVector} size={200} />
        </div>
      </div>

      {/* Cryptographic Node Verification */}
      <div className="flex items-center gap-2 text-[9px] text-slate-500 px-3 font-mono">
        <Shield className="w-3 h-3 text-emerald-400" />
        <span>NODE: 0x7F...9A42 (ZERO-TRUST)</span>
      </div>

    </div>
  );
};
