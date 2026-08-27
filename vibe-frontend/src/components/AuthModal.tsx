import React, { useState, useEffect } from 'react';
import { Sparkles, X, Lock, Mail, User, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { soundFx } from '../utils/audioEffects';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: { name: string; email: string; avatar: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundFx.playClick();
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setErrorMessage(null);
      (window as any).__setAuthTestError = (msg: string) => setErrorMessage(msg);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      delete (window as any).__setAuthTestError;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateInputs = (): boolean => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('[VALIDATION_ERROR] Please enter a valid email address format.');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('[SECURITY_ALERT] Password must contain at least 6 characters.');
      return false;
    }

    if (!isLogin && name.trim().length < 2) {
      setErrorMessage('[VALIDATION_ERROR] Display name must be at least 2 characters.');
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) {
      soundFx.playClick();
      return;
    }

    soundFx.playMatchChime();
    onLoginSuccess({
      name: name.trim() || (isLogin ? 'Alex Vibe' : 'New Viber'),
      email: email.trim() || 'alex@vibeconnect.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    });
    onClose();
  };

  const handleGuestLogin = () => {
    soundFx.playClick();
    onLoginSuccess({
      name: 'Guest Viber 🚀',
      email: 'guest@vibeconnect.io',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="section-matcher-deck w-full max-w-md p-6 relative border border-violet-500/40 shadow-2xl shadow-violet-500/20">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-violet-600 to-pink-500 p-[1.5px] mx-auto mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
          </div>

          <h3 id="auth-modal-title" className="text-2xl font-bold text-white font-heading">
            {isLogin ? 'Welcome Back to Vibe' : 'Create 3D Vibe Account'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 font-telemetry">
            {isLogin ? 'Sign in to access your spatial lounges & matches' : 'Join 100K+ vibers in the 3D ecosystem'}
          </p>
        </div>

        {/* Error Diagnostic Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300 font-mono">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Tab Switcher */}
        <div className="flex bg-slate-900/80 p-1 rounded-xl mb-6 border border-white/10">
          <button
            onClick={() => {
              soundFx.playClick();
              setIsLogin(true);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setIsLogin(false);
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-semibold text-slate-300 mb-1">Display Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Alex Vibe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="auth-email"
                type="text"
                placeholder="your.email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <button type="submit" className="w-full btn-hero-primary justify-center py-3 text-xs font-semibold mt-2">
            <span>{isLogin ? 'Sign In to 3D World' : 'Create Vibe Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <span className="relative bg-slate-950 px-3 text-[10px] text-slate-400 font-mono">OR QUICK ACCESS</span>
        </div>

        {/* Demo Guest Login */}
        <button
          onClick={handleGuestLogin}
          className="w-full btn-tactical justify-center py-2.5 text-xs font-mono"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>[CONTINUE_AS_GUEST_VIBER]</span>
        </button>

      </div>
    </div>
  );
};
