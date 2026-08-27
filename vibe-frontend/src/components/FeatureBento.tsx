import React from 'react';
import { Sparkles, Radio, Shield, Cpu, Layers } from 'lucide-react';
import { LAYOUT_CLASSES } from '../styles/layout';

export const FeatureBento: React.FC = () => {
  return (
    <div className="w-full space-y-12">
      
      {/* Section Eyebrow & Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="eyebrow-pill bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 inline-flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>NEXT-GENERATION ARCHITECTURE</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
          Engineered for <span className="text-cyan-400">Spatial Connection</span>
        </h2>
        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          Combining real-time WebGL 3D rendering, 96kHz binaural audio, and 5D neural matching algorithms into one seamless social platform.
        </p>
      </div>

      {/* 2x2 Bento Grid Container */}
      <div className={LAYOUT_CLASSES.bentoGrid2Col}>
        
        {/* Card 1: 3D Spatial Canvas */}
        <div className={LAYOUT_CLASSES.bentoCard}>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl group-hover:bg-cyan-500/25 transition-colors pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="eyebrow-pill bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              REAL-TIME WEBGL 3D
            </span>
            <h3 className="text-2xl font-bold text-white font-heading">
              Interactive 3D Spatial Matrix
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-body">
              Step into an immersive 3D canvas powered by Three.js where users appear as dynamic glowing orbital nodes. Move through the space and discover people who share your vibe visually.
            </p>
          </div>
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-[10px] text-cyan-400 font-mono">
            <span>● 60 FPS GPU ACCELERATED</span>
          </div>
        </div>

        {/* Card 2: Spatial Audio */}
        <div className={LAYOUT_CLASSES.bentoCard}>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-violet-500/15 rounded-full blur-3xl group-hover:bg-violet-500/25 transition-colors pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-400/40 flex items-center justify-center text-violet-400 shadow-lg shadow-violet-500/20">
              <Radio className="w-6 h-6" />
            </div>
            <span className="eyebrow-pill bg-violet-500/10 border border-violet-500/30 text-violet-300">
              BINAURAL SOUND
            </span>
            <h3 className="text-2xl font-bold text-white font-heading">
              3D Spatial Audio Lounges
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-body">
              Experience directional audio where sound changes volume and pan based on your avatar's 3D position in the room with 96kHz lossless DSP.
            </p>
          </div>
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-[10px] text-violet-400 font-mono">
            <span>● 96kHz / 24-BIT LOSSLESS</span>
          </div>
        </div>

        {/* Card 3: AI Neural Vibe Matching */}
        <div className={LAYOUT_CLASSES.bentoCard}>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl group-hover:bg-pink-500/25 transition-colors pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-400 shadow-lg shadow-pink-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="eyebrow-pill bg-pink-500/10 border border-pink-500/30 text-pink-300">
              AI MACHINE INTELLIGENCE
            </span>
            <h3 className="text-2xl font-bold text-white font-heading">
              Neural Trait Matching
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-body">
              Our 5-dimensional cosine similarity model matches users across acoustic resonance, conversational depth, social intensity, and activity frequency.
            </p>
          </div>
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-[10px] text-pink-400 font-mono">
            <span>● 5D COSINE SIMILARITY</span>
          </div>
        </div>

        {/* Card 4: Security & Encryption */}
        <div className={LAYOUT_CLASSES.bentoCard}>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl group-hover:bg-emerald-500/25 transition-colors pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <span className="eyebrow-pill bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              ZERO TRUST PRIVACY
            </span>
            <h3 className="text-2xl font-bold text-white font-heading">
              End-to-End Cryptographic Privacy
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-body">
              Every message transmission, audio stream, and WebRTC video call is protected with military-grade ECDH key exchange and JWT verification.
            </p>
          </div>
          <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center gap-2 text-[10px] text-emerald-400 font-mono">
            <span>● ECDH 256-BIT ENCRYPTION</span>
          </div>
        </div>

      </div>

    </div>
  );
};
