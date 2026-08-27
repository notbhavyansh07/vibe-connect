import React, { useState } from 'react';
import { Mic, MicOff, Video, Send, Volume2, Smile, Image, Disc3, RadioTower, MessageSquareOff } from 'lucide-react';
import { VideoCallModal } from './VideoCallModal';
import { soundFx } from '../utils/audioEffects';

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  time: string;
  text: string;
  isSelf?: boolean;
}

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'Lo-Fi Chill Lounge': [
    {
      id: '1',
      user: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: '19:42',
      text: 'Tuning into the 96kHz binaural stream! The 3D audio separation is stunning 🎧',
    },
    {
      id: '2',
      user: 'Kai Takahashi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      time: '19:43',
      text: 'Feels like sitting around the same studio console table.',
    },
  ],
  'Cyberpunk Gaming': [],
  'Deep Philosophy': [],
  'Code & 3D Devs': [],
};

export const LiveChatLounge: React.FC = () => {
  const [activeChannel, setActiveChannel] = useState('Lo-Fi Chill Lounge');
  const [messagesByChannel, setMessagesByChannel] = useState(INITIAL_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const channels = [
    { name: 'Lo-Fi Chill Lounge', users: 14, icon: '☕', freq: '88.4 MHz' },
    { name: 'Cyberpunk Gaming', users: 28, icon: '🎮', freq: '94.2 MHz' },
    { name: 'Deep Philosophy', users: 9, icon: '🌌', freq: '101.5 MHz' },
    { name: 'Code & 3D Devs', users: 22, icon: '💻', freq: '107.8 MHz' },
  ];

  const currentMessages = messagesByChannel[activeChannel] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    soundFx.playClick();
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'Alex Vibe (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputMessage,
      isSelf: true,
    };

    setMessagesByChannel((prev) => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), newMsg],
    }));
    setInputMessage('');
  };

  return (
    <section className="space-y-6" aria-labelledby="soundstage-heading">
      
      {/* Section Eyebrow Header */}
      <div className="section-header-divider">
        <div className="eyebrow-pill bg-violet-500/10 border border-violet-400/30 text-violet-300">
          <RadioTower className="w-3.5 h-3.5 text-violet-400" />
          <span>SPATIAL_SOUNDSTAGE // 96kHz BINAURAL ROOMS</span>
        </div>
        <div className="line" />
      </div>

      <div className="section-soundstage p-6 md:p-8 space-y-6">
        
        {/* Top Soundstage Console Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-400">
              <Disc3 className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h2 id="soundstage-heading" className="text-xl md:text-2xl font-extrabold text-white font-heading">
                Spatial Audio <span className="text-violet-400">Live Stage</span>
              </h2>
              <p className="text-xs text-slate-300 font-telemetry">Active Node Broadcast: 4 Studio Rooms</p>
            </div>
          </div>

          {/* Broadcaster Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsMicMuted(!isMicMuted);
              }}
              className={`p-2.5 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all ${
                isMicMuted
                  ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                  : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              }`}
              aria-label={isMicMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 animate-bounce" />}
              <span className="hidden sm:inline">{isMicMuted ? '[MIC_MUTED]' : '[MIC_LIVE]'}</span>
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsVideoModalOpen(true);
              }}
              className="btn-hero-primary py-2 px-4 text-xs font-mono"
              aria-label="Launch 3D Spatial Video Stage"
            >
              <Video className="w-4 h-4" />
              <span>[LAUNCH_3D_STAGE]</span>
            </button>
          </div>
        </div>

        {/* 24-Band Audio VU Spectrum Visualizer */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
            <span className="flex items-center gap-1.5 text-violet-300 font-bold">
              <Volume2 className="w-3.5 h-3.5" /> BINAURAL DSP SPECTRUM
            </span>
            <span className="text-emerald-400 font-bold">● 96kHz / 24-BIT LOSSLESS</span>
          </div>

          <div className="h-12 flex items-end justify-between gap-1 px-1">
            {[35, 60, 45, 85, 70, 95, 40, 80, 65, 90, 30, 75, 55, 88, 45, 92, 60, 78, 40, 85, 50, 70, 45, 80].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-full bg-gradient-to-t from-cyan-500 via-violet-500 to-pink-500 rounded-t-sm"
              />
            ))}
          </div>
        </div>

        {/* Studio Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {channels.map((ch) => {
            const isSelected = activeChannel === ch.name;
            return (
              <button
                key={ch.name}
                onClick={() => {
                  soundFx.playClick();
                  setActiveChannel(ch.name);
                }}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-violet-950/40 border-violet-400 text-white shadow-lg shadow-violet-500/20'
                    : 'bg-slate-950/40 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                }`}
                aria-pressed={isSelected}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-lg">{ch.icon}</span>
                  <span className="text-[9px] font-mono text-cyan-400 font-bold">{ch.freq}</span>
                </div>
                <div className="text-xs font-bold font-heading truncate">{ch.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5 font-bold">● {ch.users} Vibing</div>
              </button>
            );
          })}
        </div>

        {/* Live Chat Stream in Stage */}
        <div className="space-y-4 pt-4 border-t border-white/10">
          {currentMessages.length > 0 ? (
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 items-start ${msg.isSelf ? 'flex-row-reverse' : ''}`}
                >
                  <img
                    src={msg.avatar}
                    alt={msg.user}
                    loading="lazy"
                    decoding="async"
                    className="w-7 h-7 rounded-lg object-cover border border-violet-400/40 flex-shrink-0"
                  />
                  <div className={`max-w-md ${msg.isSelf ? 'text-right' : ''}`}>
                    <div className="text-[10px] font-mono text-slate-400 mb-0.5">
                      {msg.user} • {msg.time}
                    </div>
                    <div
                      className={`p-2.5 rounded-xl text-xs break-words ${
                        msg.isSelf
                          ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white'
                          : 'bg-slate-900 text-slate-200 border border-white/10'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Non-happy path: Empty room state */
            <div className="p-6 rounded-xl bg-slate-950/60 border border-dashed border-white/10 text-center space-y-2">
              <MessageSquareOff className="w-8 h-8 text-violet-400/60 mx-auto" />
              <div className="text-xs font-bold text-slate-200 font-mono">[SILENT_FREQUENCY // {activeChannel.toUpperCase()}]</div>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto font-telemetry">
                No active transmissions in this room yet. Send a broadcast below to start the frequency.
              </p>
            </div>
          )}

          {/* Chat Input Bar */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2">
            <button type="button" className="p-2 text-slate-400 hover:text-white rounded-lg" aria-label="Add emoji">
              <Smile className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 text-slate-400 hover:text-white rounded-lg" aria-label="Attach image">
              <Image className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Broadcast message to ${activeChannel}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-950 border border-white/15 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 font-body"
              aria-label={`Broadcast message to ${activeChannel}`}
            />

            <button type="submit" className="btn-hero-primary py-2 px-4 text-xs font-mono" aria-label="Send transmission">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>

      {/* 3D Video Call Stage Modal */}
      <VideoCallModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        roomName={activeChannel}
      />

    </section>
  );
};
