import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, MessageSquare, Shield, Activity } from 'lucide-react';
import { RadarChart5D } from './RadarChart5D';
import { soundFx } from '../utils/audioEffects';
import { formatCompactNumber } from '../utils/formatters';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1280);

  const userVector: [number, number, number, number, number] = [85, 70, 90, 80, 95];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleFollow = () => {
    soundFx.playClick();
    setIsFollowing(!isFollowing);
    setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      <div className="section-matcher-deck w-full max-w-lg p-6 relative border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          aria-label="Close profile modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              loading="lazy"
              decoding="async"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 flex-shrink-0"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[8px] text-white">
              ✓
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 id="profile-modal-title" className="text-xl font-bold text-white font-heading truncate">{user.name}</h3>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] px-2 py-0.5 rounded font-mono font-bold">
                [PRO_NODE]
              </span>
            </div>
            <p className="text-xs text-slate-300 truncate font-mono">{user.email}</p>
            <p className="text-[11px] text-emerald-400 font-mono mt-0.5">● BROADCASTING IN STUDIO_1</p>
          </div>
        </div>

        {/* Follow / Connect Actions */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleToggleFollow}
            className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all font-mono ${
              isFollowing
                ? 'bg-slate-800 border border-white/20 text-slate-300'
                : 'btn-hero-primary'
            }`}
            aria-label={isFollowing ? 'Unfollow resonance' : 'Follow resonance'}
          >
            {isFollowing ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>[FOLLOWING_VIBER]</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>[FOLLOW_RESONANCE]</span>
              </>
            )}
          </button>

          <button className="btn-tactical py-2.5 px-4 text-xs font-mono" aria-label="Send direct message">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>[DIRECT_DM]</span>
          </button>
        </div>

        {/* Stats Row with Compact Formatting */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-950 border border-white/10 text-center mb-6 font-mono">
          <div>
            <div className="text-base font-extrabold text-white">{formatCompactNumber(followersCount)}</div>
            <div className="text-[9px] text-slate-400 uppercase">Followers</div>
          </div>
          <div>
            <div className="text-base font-extrabold text-cyan-400">98.4%</div>
            <div className="text-[9px] text-slate-400 uppercase">Resonance</div>
          </div>
          <div>
            <div className="text-base font-extrabold text-violet-400">42</div>
            <div className="text-[9px] text-slate-400 uppercase">Transmissions</div>
          </div>
        </div>

        {/* Signature 5D Telemetry Radar */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-center mb-6">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> 5D VECTOR TELEMETRY
            </span>
            <span className="text-slate-300">CALIBRATED</span>
          </div>
          <RadarChart5D values={userVector} size={220} />
        </div>

        {/* Security / Encryption Badge */}
        <div className="flex items-center gap-2 text-[10px] text-slate-300 pt-3 border-t border-white/10 font-mono">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>CRYPTOGRAPHIC NODE ID: <code className="text-cyan-400">0x7F...9A42</code></span>
        </div>

      </div>
    </div>
  );
};
