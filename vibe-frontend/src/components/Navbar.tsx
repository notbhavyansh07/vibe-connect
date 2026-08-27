import React, { useState } from 'react';
import { Sparkles, Radio, Users, MessageSquare, Flame, Menu, X, LogIn } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAiAssistant: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  currentUser: { name: string; email: string; avatar: string } | null;
  isOnline?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiAssistant,
  onOpenAuth,
  onOpenProfile,
  currentUser,
  isOnline = true,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: '3D World', icon: Sparkles },
    { id: 'matcher', label: 'AI Vibe Matcher', icon: Flame },
    { id: 'lounge', label: 'Spatial Lounge', icon: Radio },
    { id: 'feed', label: 'Vibe Feed', icon: MessageSquare },
  ];

  return (
    <header className={`glass-nav fixed ${!isOnline ? 'top-12 md:top-10' : 'top-0'} left-0 right-0 z-40 px-4 lg:px-8 py-3.5 transition-all`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-violet-600 to-pink-500 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                VIBE<span className="text-gradient-cyan">CONNECT</span>
              </span>
              <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                3D
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">Next-Gen Spatial Social</p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white shadow-md shadow-violet-500/30 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth / Profile */}
        <div className="hidden lg:flex items-center gap-4">
          
          {/* Live Online Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Users className="w-3.5 h-3.5" />
            <span>12.4K Vibing</span>
          </div>

          {/* AI Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="btn-glow-secondary py-2 px-4 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Ask VibeAI</span>
          </button>

          {/* User Profile or Sign In */}
          {currentUser ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-slate-800/70 border border-white/10 hover:border-violet-500/50 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-violet-400/50"
              />
              <span className="text-xs font-semibold text-slate-200">{currentUser.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn-glow-primary py-2 px-4 text-xs font-semibold"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden pt-4 pb-6 px-2 space-y-2 border-t border-white/10 mt-3 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-violet-600 text-white'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10 space-y-2">
            {currentUser ? (
              <button
                onClick={() => {
                  onOpenProfile();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full btn-glow-secondary justify-center text-xs"
              >
                <span>View Profile ({currentUser.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full btn-glow-primary justify-center text-xs"
              >
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
