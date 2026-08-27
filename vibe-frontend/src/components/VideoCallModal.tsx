import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Sparkles, Shield, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ isOpen, onClose, roomName }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [reaction, setReaction] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

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

  const requestMedia = React.useCallback(() => {
    setPermissionError(null);
    if (!isVideoOff) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          setHasCameraPermission(true);
          setPermissionError(null);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          setHasCameraPermission(false);
          setPermissionError('HARDWARE_ACCESS_DENIED: Camera/Mic permissions unavailable in current browser sandbox. Using synthetic 3D spatial avatar.');
        });
    }
  }, [isVideoOff]);

  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      return;
    }

    requestMedia();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, isVideoOff, requestMedia]);

  // Handle mute toggle on live audio track
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = !isMuted));
    }
  }, [isMuted]);

  if (!isOpen) return null;

  const handleReaction = (emoji: string) => {
    soundFx.playClick();
    setReaction(emoji);
    setTimeout(() => setReaction(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="section-matcher-deck w-full max-w-4xl p-6 relative border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 flex flex-col justify-between min-h-[550px]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <h3 id="video-modal-title" className="text-lg font-bold text-white font-heading">
                {roomName} — 3D Spatial Audio Stage
              </h3>
              <p className="text-xs text-slate-300 font-telemetry">
                Encrypted WebRTC Session • {hasCameraPermission ? 'Live Hardware Camera' : 'Synthetic 3D Node'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
            aria-label="Close spatial video room"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diagnostic Error Banner when Hardware Stream Denied */}
        {permissionError && (
          <div className="my-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-300 font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>[{permissionError}]</span>
            </div>
            <button
              onClick={requestMedia}
              className="p-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[10px] flex items-center gap-1 font-bold"
            >
              <RefreshCw className="w-3 h-3" /> RETRY
            </button>
          </div>
        )}

        {/* Video Feeds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 flex-1">
          
          {/* Participant 1 (You) - Live Camera or Fallback Avatar */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-slate-900 group">
            {isVideoOff ? (
              <div className="w-full h-full min-h-[180px] flex items-center justify-center bg-slate-950">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold font-mono">
                  [CAMERA_MUTED]
                </div>
              </div>
            ) : hasCameraPermission ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full min-h-[180px] object-cover"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                alt="Your synthetic avatar"
                loading="lazy"
                decoding="async"
                className="w-full h-full min-h-[180px] object-cover"
              />
            )}

            <div className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 backdrop-blur-md flex items-center gap-2 font-mono">
              <span>Alex Vibe (You)</span>
              {isMuted && <MicOff className="w-3 h-3 text-rose-400" />}
              {hasCameraPermission && <Camera className="w-3.5 h-3.5 text-cyan-400" />}
            </div>
          </div>

          {/* Participant 2 (Elena) */}
          <div className="relative rounded-2xl overflow-hidden border border-violet-500/40 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
              alt="Elena Rostova"
              loading="lazy"
              decoding="async"
              className="w-full h-full min-h-[180px] object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 backdrop-blur-md flex items-center gap-2 font-mono">
              <span>Elena Rostova</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            {/* Reaction Overlay */}
            {reaction && (
              <div className="absolute inset-0 flex items-center justify-center text-5xl animate-bounce">
                {reaction}
              </div>
            )}
          </div>

          {/* Participant 3 (Kai) */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
              alt="Kai Takahashi"
              loading="lazy"
              decoding="async"
              className="w-full h-full min-h-[180px] object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 backdrop-blur-md font-mono">
              <span>Kai Takahashi</span>
            </div>
          </div>

          {/* Screen Share Preview / Participant 4 */}
          <div className="relative rounded-2xl overflow-hidden border border-pink-500/40 bg-slate-950 flex items-center justify-center p-4">
            {isScreenSharing ? (
              <div className="text-center space-y-2">
                <Monitor className="w-10 h-10 text-pink-400 mx-auto animate-pulse" />
                <p className="text-xs font-semibold text-white">Sharing 3D WebGL Canvas Screen</p>
                <span className="text-[10px] text-pink-400 font-mono">1080p 60FPS Stream</span>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Sparkles className="w-8 h-8 text-cyan-400 mx-auto" />
                <p className="text-xs text-slate-300">Spatial 3D Audio Lounge Stage</p>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-slate-950/80 px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/10 backdrop-blur-md font-mono">
              <span>{isScreenSharing ? 'Screen Stream' : 'Stage Camera'}</span>
            </div>
          </div>

        </div>

        {/* Call Controls Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          
          {/* Left Reactions */}
          <div className="flex items-center gap-1.5">
            {['🔥', '👏', '💖', '🎉'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="w-9 h-9 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-sm hover:scale-125 transition-transform"
                aria-label={`Send ${emoji} reaction`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Middle Call Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsMuted(!isMuted);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsVideoOff(!isVideoOff);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isVideoOff ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              aria-label={isVideoOff ? 'Turn video on' : 'Turn video off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                setIsScreenSharing(!isScreenSharing);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isScreenSharing ? 'bg-pink-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              aria-label={isScreenSharing ? 'Stop screen sharing' : 'Start screen sharing'}
            >
              <Monitor className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/40"
              aria-label="Disconnect from call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>

          {/* Right Security Tag */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <Shield className="w-3.5 h-3.5" />
            <span>Encrypted WebRTC</span>
          </div>

        </div>

      </div>
    </div>
  );
};
