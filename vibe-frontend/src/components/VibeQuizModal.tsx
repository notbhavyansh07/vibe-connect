import React, { useState } from 'react';
import { X, Flame, ArrowRight } from 'lucide-react';

interface VibeQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteQuiz: (scores: { music: number; energy: number; gaming: number; deepTalks: number; night: number }) => void;
}

export const VibeQuizModal: React.FC<VibeQuizModalProps> = ({ isOpen, onClose, onCompleteQuiz }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    genre: 'synthwave',
    energy: 'chill',
    time: 'night',
    interest: 'coding',
  });

  if (!isOpen) return null;

  const handleFinish = () => {
    onCompleteQuiz({
      music: answers.genre === 'synthwave' ? 95 : 80,
      energy: answers.energy === 'chill' ? 65 : 95,
      gaming: answers.interest === 'coding' ? 90 : 75,
      deepTalks: 85,
      night: answers.time === 'night' ? 98 : 40,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-md p-6 relative border border-violet-500/40 shadow-2xl shadow-violet-500/20">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase mb-2">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Step {step} of 3</span>
          </div>
          <h3 className="text-xl font-bold text-white font-heading">AI Vibe Diagnostic Quiz</h3>
          <p className="text-xs text-slate-400 mt-1">Calibrate your neural spatial vectors</p>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200">What is your primary acoustic vibe?</label>
            {[
              { id: 'synthwave', label: '🎧 Synthwave & Cyberpunk Ambient' },
              { id: 'lofi', label: '☕ Lo-Fi Beats & Chill Hop' },
              { id: 'techno', label: '⚡ Underground Techno & Electronic' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswers({ ...answers, genre: opt.id })}
                className={`w-full p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                  answers.genre === opt.id
                    ? 'bg-gradient-to-r from-cyan-600/30 to-violet-600/30 border-cyan-400 text-white'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}

            <button onClick={() => setStep(2)} className="w-full btn-glow-primary justify-center py-2.5 text-xs mt-4">
              <span>Next Vector</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200">What hours are you most active?</label>
            {[
              { id: 'night', label: '🌙 Late Night Owl (11 PM - 4 AM)' },
              { id: 'evening', label: '🌆 Sunset Vibe (6 PM - 11 PM)' },
              { id: 'day', label: '☀️ Early Morning (6 AM - 12 PM)' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswers({ ...answers, time: opt.id })}
                className={`w-full p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                  answers.time === opt.id
                    ? 'bg-gradient-to-r from-cyan-600/30 to-violet-600/30 border-cyan-400 text-white'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}

            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="btn-glow-secondary py-2.5 text-xs flex-1 justify-center">Back</button>
              <button onClick={() => setStep(3)} className="btn-glow-primary py-2.5 text-xs flex-1 justify-center">Next Vector</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-200">What is your core creative focus?</label>
            {[
              { id: 'coding', label: '💻 3D Dev & Creative Coding' },
              { id: 'gaming', label: '🎮 Competitive & Cozy Gaming' },
              { id: 'art', label: '🎨 AI Art & Digital Modeling' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setAnswers({ ...answers, interest: opt.id })}
                className={`w-full p-3 rounded-xl text-xs font-semibold text-left border transition-all ${
                  answers.interest === opt.id
                    ? 'bg-gradient-to-r from-cyan-600/30 to-violet-600/30 border-cyan-400 text-white'
                    : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {opt.label}
              </button>
            ))}

            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(2)} className="btn-glow-secondary py-2.5 text-xs flex-1 justify-center">Back</button>
              <button onClick={handleFinish} className="btn-glow-primary py-2.5 text-xs flex-1 justify-center">Calibrate Vectors ✨</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
