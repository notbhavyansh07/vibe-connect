import React from 'react';
import { Users, Sparkles, TrendingUp, ArrowRight, RadioTower } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface RightRailProps {
  onOpenAiAssistant: () => void;
  onSelectChannel?: (channelName: string) => void;
}

export const RightRail: React.FC<RightRailProps> = ({ onOpenAiAssistant, onSelectChannel }) => {
  const onlineVibers = [
    { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', status: 'Studio #1', score: '98.4%', distance: '0.4km' },
    { name: 'Kai Takahashi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', status: 'Gaming Room', score: '94.1%', distance: '1.2km' },
    { name: 'Sophia Chen', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', status: '3D Node #4', score: '91.8%', distance: '3.1km' },
  ];

  const trendingTags = [
    { tag: '#Synthwave3D', posts: '12.4K' },
    { tag: '#LoFiChillLounge', posts: '8.9K' },
    { tag: '#CyberpunkVibes', posts: '15.1K' },
    { tag: '#CreativeCoding', posts: '6.2K' },
  ];

  return (
    <div className="space-y-5 sticky top-24">
      
      {/* Recommended 5D Matches */}
      <div className="hud-rail-card p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 border-b border-white/5 pb-1.5">
          <span className="flex items-center gap-1.5 text-pink-400">
            <Users className="w-3.5 h-3.5" /> {'> 5D_MATCH_CANDIDATES'}
          </span>
          <span className="text-slate-500 font-mono">NEARBY</span>
        </div>

        <div className="space-y-2">
          {onlineVibers.map((viber, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/80 border border-white/5 hover:border-pink-500/30 transition-all">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={viber.avatar}
                  alt={viber.name}
                  className="w-8 h-8 rounded-lg object-cover border border-white/10"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate font-heading">{viber.name}</h4>
                  <p className="text-[9px] text-pink-400 font-mono">{viber.score} • {viber.distance}</p>
                </div>
              </div>

              <button 
                onClick={() => soundFx.playClick()}
                className="p-1 rounded-md bg-pink-500/10 text-pink-400 hover:bg-pink-500 hover:text-white transition-colors text-xs"
              >
                ✋
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Audio Stages */}
      <div className="hud-rail-card p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 border-b border-white/5 pb-1.5">
          <span className="flex items-center gap-1.5 text-violet-400">
            <RadioTower className="w-3.5 h-3.5" /> {'> ACTIVE_SOUNDSTAGES'}
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          {[
            { name: 'Lo-Fi Chill Lounge', users: 14, icon: '☕', freq: '88.4M' },
            { name: 'Cyberpunk Gaming', users: 28, icon: '🎮', freq: '94.2M' },
            { name: 'Deep Philosophy', users: 9, icon: '🌌', freq: '101M' },
          ].map((ch) => (
            <div
              key={ch.name}
              onClick={() => {
                soundFx.playClick();
                onSelectChannel?.(ch.name);
              }}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-white/5 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span>{ch.icon}</span>
                <span className="font-semibold text-slate-300 text-[11px] font-heading">{ch.name}</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400">● {ch.users}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Signal Tags */}
      <div className="hud-rail-card p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 border-b border-white/5 pb-1.5">
          <span className="flex items-center gap-1.5 text-amber-400">
            <TrendingUp className="w-3.5 h-3.5" /> {'> TRENDING_FREQUENCIES'}
          </span>
        </div>

        <div className="space-y-1">
          {trendingTags.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[11px] p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer font-mono">
              <span className="text-cyan-400 font-medium">{item.tag}</span>
              <span className="text-[9px] text-slate-500">{item.posts} TX</span>
            </div>
          ))}
        </div>
      </div>


      {/* AI Assistant Callout */}
      <div className="hud-rail-card p-3.5 bg-gradient-to-tr from-violet-950/40 via-slate-950 to-cyan-950/40 border-cyan-500/20 text-center space-y-2.5">
        <Sparkles className="w-5 h-5 text-cyan-400 mx-auto animate-pulse" />
        <h4 className="text-xs font-bold text-white font-heading">AI Resonance Diagnosis</h4>
        <p className="text-[10px] text-slate-400 leading-relaxed font-telemetry">
          Diagnose 5D vector compatibility or generate conversational icebreakers.
        </p>
        <button
          onClick={() => {
            soundFx.playClick();
            onOpenAiAssistant();
          }}
          className="w-full btn-hero-primary py-2 text-xs justify-center font-mono"
        >
          <span>[OPEN_VIBE_AI]</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
