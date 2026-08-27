import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LeftRail } from './components/LeftRail';
import { RightRail } from './components/RightRail';
import { BottomNav } from './components/BottomNav';
import { ThreeCanvas } from './components/ThreeCanvas';
import { VibeMatcher } from './components/VibeMatcher';
import { LiveChatLounge } from './components/LiveChatLounge';
import { FeedAndStories } from './components/FeedAndStories';
import { FeatureBento } from './components/FeatureBento';
import { AiVibeAssistantModal } from './components/AiVibeAssistantModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { Footer } from './components/Footer';
import { Sparkles, Flame, Radio, ArrowRight, RadioTower, WifiOff, RefreshCw } from 'lucide-react';
import { soundFx } from './utils/audioEffects';
import { LAYOUT_CLASSES } from './styles/layout';

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  const [currentUser, setCurrentUser] = useState<UserData | null>({
    name: 'Alex Vibe',
    email: 'alex@vibeconnect.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  });

  useEffect(() => {
    (window as any).__openAuthModal = () => setIsAuthModalOpen(true);
    (window as any).__openProfileModal = () => setIsProfileModalOpen(true);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleConnectInLounge = () => {
    soundFx.playClick();
    setActiveTab('lounge');
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-body relative overflow-x-hidden pb-16 lg:pb-0">
      
      {/* Network Offline / Reconnecting Telemetry Banner */}
      {!isOnline && (
        <div className="fixed top-0 inset-x-0 z-50 bg-amber-500/90 backdrop-blur-md text-slate-950 px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span>[SIGNAL_DISRUPTION // OFFLINE_MODE] Reconnecting to spatial cluster nodes...</span>
          <button
            onClick={() => setIsOnline(navigator.onLine)}
            className="ml-2 px-2 py-0.5 rounded bg-slate-950 text-amber-300 text-[10px] flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> RETRY
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => {
          soundFx.playClick();
          setIsAiModalOpen(true);
        }}
        onOpenAuth={() => {
          soundFx.playClick();
          setIsAuthModalOpen(true);
        }}
        onOpenProfile={() => {
          soundFx.playClick();
          setIsProfileModalOpen(true);
        }}
        currentUser={currentUser}
        isOnline={isOnline}
      />

      {/* Top-level layout container — Desktop ≥1024px / ≥1280px */}
      <div className={`${LAYOUT_CLASSES.dashboardContainer} transition-all ${!isOnline ? 'pt-32' : 'pt-24'}`}>
        <div className={LAYOUT_CLASSES.dashboardGrid}>
          
          {/* Left Column (Desktop 3 Cols) */}
          <aside className={LAYOUT_CLASSES.dashboardLeftRail}>
            <LeftRail
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenProfile={() => {
                soundFx.playClick();
                setIsProfileModalOpen(true);
              }}
              currentUser={currentUser}
            />
          </aside>

          {/* Center Column (Desktop 6 Cols) — Content stacked inside this column only */}
          <main className={LAYOUT_CLASSES.dashboardCenterMain}>
            
            {/* HERO SECTION ('home' tab) */}
            {activeTab === 'home' && (
              <section className="section-hero-frame relative min-h-[500px] flex items-center justify-center p-6 md:p-10 overflow-hidden">
                
                {/* 3D WebGL Canvas Background */}
                <div className="absolute inset-0 z-0 opacity-85">
                  <ThreeCanvas interactive={true} />
                </div>

                {/* Hero Interactive Card Content */}
                <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                  
                  <div className="eyebrow-pill bg-slate-950/90 border border-cyan-400/40 text-cyan-300 shadow-lg shadow-cyan-500/10">
                    <RadioTower className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span>SPATIAL_FREQUENCY // LIVE_BROADCAST</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading tracking-tight text-white leading-tight">
                    Resonate in <span className="text-cyan-400">3D Spatial Space</span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                    Powered by interactive WebGL 3D particle nodes, 96kHz binaural spatial audio, and 5D cosine similarity matching.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab('matcher');
                      }}
                      className="btn-hero-primary text-xs py-3 px-6 group w-full sm:w-auto"
                      aria-label="Calibrate 5D Vibe"
                    >
                      <Flame className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                      <span>[CALIBRATE_5D_VIBE]</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab('lounge');
                      }}
                      className="btn-tactical text-xs py-3 px-6 w-full sm:w-auto font-mono"
                      aria-label="Enter Spatial Soundstage"
                    >
                      <Radio className="w-4 h-4 text-cyan-400" />
                      <span>[ENTER_SOUNDSTAGE]</span>
                    </button>
                  </div>

                  {/* Telemetry Counter Metrics */}
                  <div className="pt-6 grid grid-cols-3 gap-3">
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                      <div className="text-lg font-extrabold font-mono text-cyan-400">124.8K</div>
                      <div className="text-[9px] text-slate-400 font-mono uppercase">ONLINE_NODES</div>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                      <div className="text-lg font-extrabold font-mono text-violet-400">99.8%</div>
                      <div className="text-[9px] text-slate-400 font-mono uppercase">VECTOR_ACCURACY</div>
                    </div>
                    <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/5">
                      <div className="text-lg font-extrabold font-mono text-pink-400">50M+</div>
                      <div className="text-[9px] text-slate-400 font-mono uppercase">SPATIAL_TX</div>
                    </div>
                  </div>

                </div>
              </section>
            )}

            {/* TAB 1: 5D Vibe Matcher */}
            {(activeTab === 'home' || activeTab === 'matcher') && (
              <div id="matcher">
                <VibeMatcher onConnectInLounge={handleConnectInLounge} />
              </div>
            )}

            {/* TAB 2: Spatial Audio Lounge */}
            {(activeTab === 'home' || activeTab === 'lounge') && (
              <div id="lounge">
                <LiveChatLounge />
              </div>
            )}

            {/* TAB 3: Community Vibe Feed */}
            {(activeTab === 'home' || activeTab === 'feed') && (
              <div id="feed">
                <FeedAndStories />
              </div>
            )}

          </main>

          {/* Right Column (Desktop 3 Cols) */}
          <aside className={LAYOUT_CLASSES.dashboardRightRail}>
            <RightRail
              onOpenAiAssistant={() => {
                soundFx.playClick();
                setIsAiModalOpen(true);
              }}
              onSelectChannel={() => {
                soundFx.playClick();
                setActiveTab('lounge');
              }}
            />
          </aside>

        </div>
      </div>

      {/* 3D Bento Feature Grid (Full-Width Landing Section) */}
      {activeTab === 'home' && (
        <section id="bento" className={LAYOUT_CLASSES.bentoSection}>
          <FeatureBento />
        </section>
      )}

      {/* Mobile Bottom Navigation Bar (<1024px) */}
      <BottomNav
        className="lg:hidden"
        activeTab={activeTab}
        setActiveTab={(tab) => {
          soundFx.playClick();
          setActiveTab(tab);
        }}
        onOpenProfile={() => {
          soundFx.playClick();
          setIsProfileModalOpen(true);
        }}
      />

      {/* Floating AI Companion Trigger Button */}
      <button
        onClick={() => {
          soundFx.playClick();
          setIsAiModalOpen(true);
        }}
        className="fixed bottom-20 lg:bottom-6 right-6 z-40 btn-hero-primary py-3 px-5 text-xs shadow-2xl shadow-cyan-500/40 animate-signal touch-target-44"
        aria-label="Open Vibe AI Assistant"
      >
        <Sparkles className="w-4 h-4 text-pink-300" />
        <span className="hidden sm:inline font-mono font-bold">[VIBE_AI_ASSISTANT]</span>
      </button>

      {/* AI Assistant Modal */}
      <AiVibeAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Auth Login / Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />

      {/* User Profile Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={currentUser}
        />
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
