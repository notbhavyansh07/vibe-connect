import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sliders, Zap, Music, Gamepad2, Moon, MessageSquareHeart, CheckCircle2, ArrowRight, HelpCircle, Activity, Cpu, RotateCcw, AlertTriangle } from 'lucide-react';
import { VibeQuizModal } from './VibeQuizModal';
import { RadarChart5D } from './RadarChart5D';
import { soundFx } from '../utils/audioEffects';

interface MatchCandidate {
  id: string;
  name: string;
  avatar: string;
  vibeScore: number;
  tags: string[];
  status: string;
  distance: string;
  bio: string;
  vector: [number, number, number, number, number];
}

const SAMPLE_MATCHES: MatchCandidate[] = [
  {
    id: '1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    vibeScore: 98,
    tags: ['Cyberpunk', 'Synthwave', 'Indie Games', 'AI Art'],
    status: 'Broadcasting in Studio #1',
    distance: '0.4 km // 12ms latency',
    bio: 'Looking for midnight chill sessions & ambient music lovers. Let’s build spatial web experiences.',
    vector: [90, 65, 85, 90, 95],
  },
  {
    id: '2',
    name: 'Kai Takahashi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    vibeScore: 94,
    tags: ['Valorant', 'Lo-Fi Chill', 'Deep Philosophy', 'Cozy Gaming'],
    status: 'Gaming Lounge #4',
    distance: '1.2 km // 24ms latency',
    bio: 'Late night coder & casual gamer. Let’s vibe on Discord or 3D Audio.',
    vector: [80, 85, 95, 70, 90],
  },
  {
    id: '3',
    name: 'Sophia Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    vibeScore: 91,
    tags: ['Techno', '3D Modeling', 'Coffee & Code', 'Anime'],
    status: 'Rendering 3D Post',
    distance: '3.1 km // 45ms latency',
    bio: 'UI designer fascinated by spatial web & interactive 3D aesthetics.',
    vector: [95, 70, 75, 85, 80],
  },
];

export const VibeMatcher: React.FC<{ onConnectInLounge?: (name: string) => void }> = ({ onConnectInLounge }) => {
  const [musicValue, setMusicValue] = useState(85);
  const [energyValue, setEnergyValue] = useState(70);
  const [gamingValue, setGamingValue] = useState(90);
  const [deepTalksValue, setDeepTalksValue] = useState(80);
  const [nightValue, setNightValue] = useState(95);

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [matchedCandidate, setMatchedCandidate] = useState<MatchCandidate | null>(SAMPLE_MATCHES[0]);
  const [isTransmitted, setIsTransmitted] = useState(false);

  const userVector: [number, number, number, number, number] = [
    musicValue,
    energyValue,
    gamingValue,
    deepTalksValue,
    nightValue,
  ];

  const handleCalculateMatch = () => {
    soundFx.playClick();
    setIsMatching(true);
    setIsTransmitted(false);

    setTimeout(() => {
      setIsMatching(false);
      // If faders are set very low (< 20 across all), show empty state to demonstrate non-happy path
      if (musicValue < 20 && energyValue < 20 && gamingValue < 20) {
        setMatchedCandidate(null);
        return;
      }

      const randomIndex = Math.floor(Math.random() * SAMPLE_MATCHES.length);
      const selected = SAMPLE_MATCHES[randomIndex];
      setMatchedCandidate(selected);
      soundFx.playMatchChime();

      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#8b5cf6', '#ff4d6d', '#f59e0b'],
      });
    }, 1000);
  };

  const handleResetFaders = () => {
    soundFx.playClick();
    setMusicValue(85);
    setEnergyValue(70);
    setGamingValue(90);
    setDeepTalksValue(80);
    setNightValue(95);
    setMatchedCandidate(SAMPLE_MATCHES[0]);
  };

  const handleCompleteQuiz = (scores: { music: number; energy: number; gaming: number; deepTalks: number; night: number }) => {
    setMusicValue(scores.music);
    setEnergyValue(scores.energy);
    setGamingValue(scores.gaming);
    setDeepTalksValue(scores.deepTalks);
    setNightValue(scores.night);
    handleCalculateMatch();
  };

  return (
    <section className="space-y-6" aria-labelledby="vibe-matcher-heading">
      
      {/* Section Eyebrow Header */}
      <div className="section-header-divider">
        <div className="eyebrow-pill bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>INSTRUMENT_DECK // 5D VECTOR ANALYZER</span>
        </div>
        <div className="line" />
      </div>

      <div className="section-matcher-deck p-6 md:p-8 space-y-8">
        
        {/* Top Deck Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h2 id="vibe-matcher-heading" className="text-2xl md:text-3xl font-extrabold text-white font-heading">
              5D Neural <span className="text-cyan-400">Resonance Matcher</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-telemetry">
              Calibrating 5-dimensional cosine similarity across 124,892 active nodes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuizOpen(true)}
              className="btn-tactical py-2 px-3.5 text-xs font-mono"
              aria-label="Open diagnostic vibe calibration quiz"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>[DIAGNOSTIC_QUIZ]</span>
            </button>

            <button
              onClick={handleResetFaders}
              className="btn-tactical py-2 px-3 text-xs font-mono"
              title="Reset faders to default"
              aria-label="Reset faders to default values"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Control Deck Grid: Faders on Left + Live 5D Radar on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Tactical Faders */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Fader 1: Music */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="fader-music" className="text-slate-200 font-semibold flex items-center gap-2">
                  <Music className="w-4 h-4 text-cyan-400" /> Acoustic Resonance (Synth / Lo-Fi)
                </label>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {musicValue}%
                </span>
              </div>
              <input
                id="fader-music"
                type="range"
                min="0"
                max="100"
                value={musicValue}
                aria-label="Acoustic Resonance fader"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={musicValue}
                onChange={(e) => setMusicValue(Number(e.target.value))}
                className="fader-track"
              />
            </div>

            {/* Fader 2: Energy */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="fader-energy" className="text-slate-200 font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" /> Social Energy (Chill vs Hyper)
                </label>
                <span className="font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {energyValue}%
                </span>
              </div>
              <input
                id="fader-energy"
                type="range"
                min="0"
                max="100"
                value={energyValue}
                aria-label="Social Energy fader"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={energyValue}
                onChange={(e) => setEnergyValue(Number(e.target.value))}
                className="fader-track"
              />
            </div>

            {/* Fader 3: Gaming */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="fader-gaming" className="text-slate-200 font-semibold flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-violet-400" /> Gaming & Co-Op Intensity
                </label>
                <span className="font-mono text-violet-400 font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                  {gamingValue}%
                </span>
              </div>
              <input
                id="fader-gaming"
                type="range"
                min="0"
                max="100"
                value={gamingValue}
                aria-label="Gaming Intensity fader"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={gamingValue}
                onChange={(e) => setGamingValue(Number(e.target.value))}
                className="fader-track"
              />
            </div>

            {/* Fader 4: Deep Talks */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="fader-deeptalks" className="text-slate-200 font-semibold flex items-center gap-2">
                  <MessageSquareHeart className="w-4 h-4 text-pink-400" /> Deep Talks & Philosophy
                </label>
                <span className="font-mono text-pink-400 font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                  {deepTalksValue}%
                </span>
              </div>
              <input
                id="fader-deeptalks"
                type="range"
                min="0"
                max="100"
                value={deepTalksValue}
                aria-label="Deep Talks and Philosophy fader"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={deepTalksValue}
                onChange={(e) => setDeepTalksValue(Number(e.target.value))}
                className="fader-track"
              />
            </div>

            {/* Fader 5: Night Owl */}
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-white/10">
              <div className="flex justify-between items-center text-xs">
                <label htmlFor="fader-night" className="text-slate-200 font-semibold flex items-center gap-2">
                  <Moon className="w-4 h-4 text-indigo-400" /> Night Frequency (Late Hours)
                </label>
                <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {nightValue}%
                </span>
              </div>
              <input
                id="fader-night"
                type="range"
                min="0"
                max="100"
                value={nightValue}
                aria-label="Night Frequency fader"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={nightValue}
                onChange={(e) => setNightValue(Number(e.target.value))}
                className="fader-track"
              />
            </div>

            {/* Compute Action Button (Single Primary Hero Action) */}
            <button
              onClick={handleCalculateMatch}
              disabled={isMatching}
              className="w-full btn-hero-primary justify-center py-3.5 text-sm"
              aria-label="Compute 5D Vector Resonance"
            >
              {isMatching ? (
                <>
                  <Cpu className="w-4 h-4 animate-spin text-white" />
                  <span>[SCANNING_124K_SPATIAL_NODES...]</span>
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4" />
                  <span>COMPUTE 5D VECTOR RESONANCE</span>
                </>
              )}
            </button>

          </div>

          {/* Right Column: Signature 5D Radar Graphic */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20">
            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
              [TELEMETRY_RADAR_5D]
            </div>
            <RadarChart5D
              values={userVector}
              comparisonValues={matchedCandidate?.vector}
              size={240}
              isLoading={isMatching}
            />
          </div>

        </div>

        {/* Calculated Result Card (With Warm Connection Accent) */}
        {matchedCandidate ? (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-pink-500/40 shadow-xl space-y-4 animate-fadeIn">
            
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-mono font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>[RESONANCE_MATCH: {matchedCandidate.vibeScore}%]</span>
              </div>
              <span className="text-xs text-slate-300 font-mono">{matchedCandidate.distance}</span>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={matchedCandidate.avatar}
                alt={matchedCandidate.name}
                loading="lazy"
                decoding="async"
                className="w-16 h-16 rounded-xl object-cover border-2 border-pink-400/80 shadow-lg flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-white font-heading truncate">{matchedCandidate.name}</h3>
                <p className="text-xs text-cyan-400 font-mono">{matchedCandidate.status}</p>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed break-words">{matchedCandidate.bio}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {matchedCandidate.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-900 border border-white/10 text-slate-300 text-xs px-3 py-1 rounded-full font-mono"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => onConnectInLounge?.(matchedCandidate.name)}
                className="btn-match-warm text-xs py-2.5 px-6"
                aria-label={`Enter spatial room with ${matchedCandidate.name}`}
              >
                <span>ENTER SPATIAL ROOM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsTransmitted(!isTransmitted);
                }}
                className={`btn-tactical text-xs py-2.5 px-4 ${isTransmitted ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10' : ''}`}
                aria-label="Transmit high-five to candidate"
              >
                <span>{isTransmitted ? 'TRANSMITTED HIGH-FIVE ✓' : 'TRANSMIT HIGH-FIVE ✋'}</span>
              </button>
            </div>

          </div>
        ) : (
          /* Non-happy path: Empty State */
          <div className="p-8 rounded-2xl bg-slate-950/90 border border-amber-500/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-heading">[NO_RESONANCE_DETECTED]</h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed font-telemetry">
                Current 5D vector coordinates did not align with active nodes. Adjust your frequency faders or calibrate via Diagnostic Quiz.
              </p>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleResetFaders}
                className="btn-hero-primary py-2 px-5 text-xs font-mono"
              >
                <span>[RECALIBRATE_DEFAULT_VECTOR]</span>
              </button>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="btn-tactical py-2 px-4 text-xs font-mono"
              >
                <span>[START_DIAGNOSTIC_QUIZ]</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Vibe Quiz Diagnostic Modal */}
      <VibeQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onCompleteQuiz={handleCompleteQuiz}
      />

    </section>
  );
};
