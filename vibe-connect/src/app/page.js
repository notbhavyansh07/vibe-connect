"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";
import {
    Zap, Home, Search, MessageSquare, Bell, User, MoreHorizontal, Heart, Share2, Music, Settings, LogOut, Compass, ImagePlus, X, BarChart3, Clock, Sparkles, Mic, Trash2, HeartHandshake, ZapOff, Users, Play, Send, PartyPopper, ShoppingBag, CloudRain, Sun, Moon, ShieldCheck, Ticket, Volume2, Video
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { io } from "socket.io-client";

const VibeReportModal = dynamic(() => import('../components/modals/VibeReportModal'), { ssr: false });
const VibePartyModal = dynamic(() => import('../components/modals/VibePartyModal'), { ssr: false });
const VibeShopModal = dynamic(() => import('../components/modals/VibeShopModal'), { ssr: false });
const VibeStudioModal = dynamic(() => import('../components/modals/VibeStudioModal'), { ssr: false });
const VibeMatcherModal = dynamic(() => import('../components/modals/VibeMatcherModal'), { ssr: false });
const NotificationsModal = dynamic(() => import('../components/modals/NotificationsModal'), { ssr: false });
const SettingsModal = dynamic(() => import('../components/modals/SettingsModal'), { ssr: false });
const SearchModal = dynamic(() => import('../components/modals/SearchModal'), { ssr: false });

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

// Graceful fetcher — returns empty array if backend is offline
const fetcher = async (url, token) => {
    if (!url || !API_BASE) return [];
    try {
        const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        if (!res.ok) return [];
        const data = await res.json();
        return data.posts || data || [];
    } catch { return []; }
};
const trendingFetcher = async (url) => {
    if (!url || !API_BASE) return [];
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        return await res.json();
    } catch { return []; }
};

export default function Feed() {
    const { data: session } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("for-you");
    const [showVibeStudio, setShowVibeStudio] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [newPost, setNewPost] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [postImage, setPostImage] = useState(null);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [mongoUser, setMongoUser] = useState(null);
    const [vibeMatches, setVibeMatches] = useState([]);
    const [recommendedSong, setRecommendedSong] = useState(null);
    const [popularHashtags, setPopularHashtags] = useState([]);
    const [selectedStyle, setSelectedStyle] = useState('lofi');
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);
    const [isDigitalSunset, setIsDigitalSunset] = useState(false);
    const [ambientTheme, setAmbientTheme] = useState('bg-black');
    const [isGhostMode, setIsGhostMode] = useState(false);
    const [selectedCircle, setSelectedCircle] = useState('Public');
    const [vibeTokens, setVibeTokens] = useState(1240);
    const [showVibeReport, setShowVibeReport] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzingVoice, setIsAnalyzingVoice] = useState(false);
    const [showVibeMatcher, setShowVibeMatcher] = useState(false);
    const [currentVibeCard, setCurrentVibeCard] = useState(0);
    const [token, setToken] = useState(null);
    const [globalListenCount, setGlobalListenCount] = useState(42);
    
    // Mock profiles for Soulmatch
    const vibeProfiles = [
        { name: "Jessica", vibe: "Cyberpunk Glitch", desc: "Coding in neon rain. Recharging on electric dreams. #matrix #neon" },
        { name: "David", vibe: "Lofi Study", desc: "Rainy windows and 24/7 beats. Finding peace in the static. #lofi #chill" },
        { name: "Anya", vibe: "Vaporwave Pink", desc: "90s mall aesthetics and marble statues. Everything is aesthetic. #retro" }
    ];
    const [showVibeParty, setShowVibeParty] = useState(false);
    const [partyMessages, setPartyMessages] = useState([]);
    const [partyMessage, setPartyMessage] = useState("");
    const [roomVibe, setRoomVibe] = useState("bg-black");
    const [showVibeShop, setShowVibeShop] = useState(false);
    const [purchasedEffects, setPurchasedEffects] = useState([]);
    const [isVibeChecking, setIsVibeChecking] = useState(false);
    const [isARActive, setIsARActive] = useState(false);

    const user = session?.user || {};

    // Use internal Next.js API routes (work on Vercel without backend)
    const { data: posts = [], isLoading: loading, mutate: mutatePosts } = useSWR(
        '/api/posts',
        (url) => fetch(url).then(r => r.json()).then(d => d.posts || [])
    );

    const trending = [];

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    useEffect(() => {
        setMounted(true);
        if (session?.user?.email) {
            syncUser();
        }
        fetchPopularHashtags();
        
        // Digital Sunset Check: Enable after 8 PM
        const hour = new Date().getHours();
        if (hour >= 20 || hour < 6) {
            setIsDigitalSunset(true);
        }
    }, [session]);

    useEffect(() => {
        const themes = {
            cyberpunk: 'bg-[#050505] shadow-[inset_0_0_100px_rgba(255,0,255,0.05)]',
            lofi: 'bg-[#0a0a0c] shadow-[inset_0_0_100px_rgba(147,197,253,0.05)]',
            minimalist: 'bg-black',
            dark_academia: 'bg-[#0d0c0b] shadow-[inset_0_0_100px_rgba(120,113,108,0.05)]',
            vaporwave: 'bg-[#08050a] shadow-[inset_0_0_100px_rgba(34,211,238,0.05)]'
        };
        setAmbientTheme(themes[selectedStyle] || 'bg-black');
    }, [selectedStyle]);

    useEffect(() => {
        if (showVibeParty && SOCKET_URL) {
            const { io: socketIo } = require('socket.io-client');
            const s = socketIo(SOCKET_URL, { autoConnect: true });
            if (mongoUser?._id) s.emit('register-user', mongoUser._id);
            s.emit('join-chat', 'global-party');
            s.on('new-message', (msg) => {
                setPartyMessages(prev => [...prev, msg]);
            });
            return () => {
                s.off('new-message');
                s.disconnect();
            };
        }
    }, [showVibeParty, mongoUser]);

    const syncUser = async () => {
        // Session user is already synced via NextAuth + Prisma
        // No need to call external backend
        setMongoUser({
            _id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            handle: session.user.handle,
        });
    };

    const fetchVibeMatches = () => {}; // Requires backend
    const fetchRecommendedSong = () => {}; // Requires backend
    const fetchPopularHashtags = () => {}; // Requires backend

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPostImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const fetchNotifications = () => {}; // Requires backend

    const handleSearch = async (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (q.length < 2) { setSearchResults([]); return; }
        try {
            const res = await fetch(`/api/posts/search?q=${encodeURIComponent(q)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.posts || []);
            }
        } catch { setSearchResults([]); }
    };

    const handlePost = async () => {
        if (!newPost.trim() && !postImage) return;

        // Vibe Check Interceptor (More Sensitive)
        const badVibes = ["hate", "bad", "worst", "unhappy", "toxic", "angry"];
        if (badVibes.some(word => newPost.toLowerCase().includes(word))) {
            setIsVibeChecking(true);
            alert("⚠️ VIBE CHECK! Your post contains low-frequency energy. Sanity check in progress...");
            setTimeout(() => {
                alert("✨ Vibe Sanitized! We've elevated your message to a higher frequency.");
                let sanitized = newPost;
                badVibes.forEach(word => {
                    sanitized = sanitized.replace(new RegExp(word, 'gi'), "ascending");
                });
                setNewPost(sanitized);
                setIsVibeChecking(false);
            }, 1500);
            return;
        }

        // AI Logic: Detect hashtag
        const tagMatch = newPost.match(/#(\w+)/);
        const tag = tagMatch ? tagMatch[1] : null;

        const finalContent = newPost.trim() || 'Aesthetic visual 📸';

        try {
            const res = await fetch('/api/posts', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: finalContent, image: postImage, tag }),
            });
            if (res.ok) {
                setNewPost("");
                setPostImage(null);
                mutatePosts();
            }
        } catch (err) {
            console.error("Failed to post:", err);
        }
    };

    const handleEnhanceVibe = async () => {
        if (!newPost.trim()) return;
        setIsEnhancing(true);
        // AI enhance requires backend - show friendly message
        setTimeout(() => {
            setNewPost(prev => prev + " ✨");
            setIsEnhancing(false);
        }, 800);
    };

    const handleGenerateHashtags = async () => {
        if (!newPost.trim()) return;
        setIsGeneratingTags(true);
        // Simple client-side hashtag suggestions
        const words = newPost.toLowerCase().split(/\s+/).filter(w => w.length > 4);
        const tags = words.slice(0, 3).map(w => `#${w.replace(/[^a-z0-9]/g, '')}`).join(' ');
        setTimeout(() => {
            if (tags) setNewPost(prev => prev + ' ' + tags);
            setIsGeneratingTags(false);
        }, 500);
    };


    const handleVoiceAnalyze = async () => {
        setIsAnalyzingVoice(true);
        // Simulate real analysis time
        setTimeout(async () => {
             try {
                const res = await fetch("http://localhost:5000/api/ai/analyze-voice", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ duration: 5 }), // Simulating data
                });
                const data = await res.json();
                if (res.ok && data.style) {
                    setSelectedStyle(data.style);
                    alert(data.message);
                }
            } catch (err) {
                console.error("Voice analysis failed:", err);
            } finally {
                setIsAnalyzingVoice(false);
                setIsRecording(false);
            }
        }, 1500);
    };
    
    const toggleLike = async (postId) => {
        try {
            await fetch(`/api/posts/${postId}/like`, { method: "POST" });
            mutatePosts();
        } catch (err) {
            console.error("Like toggle failed:", err);
        }
    };

    const handleNarrate = (text) => {
        // Narration requires backend - feature coming soon
        alert(`🎙️ AI Narrate: "${text.substring(0, 60)}..." — feature coming soon!`);
    };

    if (!mounted) return null;


    return (
        <div 
            className={`min-h-screen ${ambientTheme} text-white flex selection:bg-primary/30 transition-all duration-1000 relative overflow-x-hidden`} 
            suppressHydrationWarning
        >
            {/* Digital Sunset Overlay */}
            {isDigitalSunset && (
                <div className="fixed inset-0 pointer-events-none z-[999] bg-orange-500/5 mix-blend-multiply transition-opacity duration-1000" />
            )}
            
            {/* Ambient Background Glow */}
            <div className={`fixed -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] transition-all duration-1000 ${selectedStyle === 'cyberpunk' ? 'bg-pink-500' : selectedStyle === 'lofi' ? 'bg-blue-400' : selectedStyle === 'vaporwave' ? 'bg-cyan-400' : 'bg-primary/20'}`} />
            <div className={`fixed -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] transition-all duration-1000 ${selectedStyle === 'cyberpunk' ? 'bg-cyan-500' : selectedStyle === 'lofi' ? 'bg-purple-400' : selectedStyle === 'vaporwave' ? 'bg-pink-400' : 'bg-secondary/20'}`} />
            {/* Vibe Report Modal */}
            {showVibeReport && <VibeReportModal setShowVibeReport={setShowVibeReport} />}
            
            {/* Vibe Matcher Modal */}
            {showVibeMatcher && (
                <VibeMatcherModal 
                    setShowVibeMatcher={setShowVibeMatcher} 
                    vibeProfiles={vibeProfiles} 
                    currentVibeCard={currentVibeCard} 
                    setCurrentVibeCard={setCurrentVibeCard} 
                />
            )}

            {/* Vibe Party Modal */}
            {showVibeParty && (
                <VibePartyModal 
                    setShowVibeParty={setShowVibeParty} 
                    roomVibe={roomVibe} 
                    setRoomVibe={setRoomVibe} 
                    partyMessages={partyMessages} 
                    partyMessage={partyMessage} 
                    setPartyMessage={setPartyMessage} 
                    socket={socket} 
                    mongoUser={mongoUser} 
                    user={user} 
                />
            )}
            
            {/* Vibe Shop Modal */}
            {showVibeShop && (
                <VibeShopModal 
                    setShowVibeShop={setShowVibeShop} 
                    vibeTokens={vibeTokens} 
                    setVibeTokens={setVibeTokens} 
                    purchasedEffects={purchasedEffects} 
                    setPurchasedEffects={setPurchasedEffects} 
                />
            )}
            
            {showVibeStudio && (
                <VibeStudioModal 
                    setShowVibeStudio={setShowVibeStudio} 
                    vibeTokens={vibeTokens} 
                />
            )}
            
            {showNotifications && (
                <NotificationsModal 
                    setShowNotifications={setShowNotifications} 
                    notifications={notifications} 
                />
            )}

            {showSettings && (
                <SettingsModal 
                    setShowSettings={setShowSettings} 
                />
            )}

            {showSearch && (
                <SearchModal 
                    setShowSearch={setShowSearch} 
                    searchQuery={searchQuery} 
                    handleSearch={handleSearch} 
                    searchResults={searchResults} 
                />
            )}

            {/* Left Sidebar */}
            <aside className="w-72 border-r border-white/10 hidden md:flex flex-col h-screen sticky top-0 p-4 gap-6">
                <div className="flex items-center gap-2 px-2 py-3">
                    <Zap className="text-primary w-8 h-8 fill-primary/10" id="brand-logo-icon" />
                    <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent" id="main-heading">VibeConnect</h1>
                </div>

                <div className="glass p-5 rounded-2xl relative overflow-hidden group border-white/5">
                    <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary/10 to-secondary/10 opacity-30" />
                    <div className="relative z-10 pt-4 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full border border-white/10 bg-surface mb-3 p-1">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-xl font-bold">
                                {user?.name?.[0] || "V"}
                            </div>
                        </div>
                        <h3 className="font-bold text-base">{user?.name || "Guest"}</h3>
                        <p className="text-xs text-gray-500 mb-4">{user?.handle || "@guest"}</p>

                        <div className="grid grid-cols-2 w-full gap-2 py-2 bg-black/40 rounded-xl border border-white/5 px-2">
                            <div className="text-center border-r border-white/5">
                                <span className="font-bold block text-white text-sm">0</span>
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Following</span>
                            </div>
                            <div className="text-center">
                                <span className="font-bold block text-white text-sm">0</span>
                                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Followers</span>
                            </div>
                        </div>
                        
                        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between group cursor-help transition-all hover:bg-primary/10 w-full">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.4)] group-hover:scale-110 transition-transform">
                                    <Zap size={14} fill="currentColor" />
                                </div>
                                <div className="text-left">
                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block">Vibe Tokens</span>
                                    <span className="text-xs font-black text-white">{vibeTokens.toLocaleString()}</span>
                                </div>
                            </div>
                            <button className="text-[9px] font-black text-primary hover:underline uppercase tracking-tighter">Shop</button>
                        </div>

                        <Link href={mongoUser ? `/profile/${(mongoUser.handle || '').replace('@', '')}` : '#'} className="w-full mt-4 btn btn-outline py-2 text-xs justify-center hover:bg-white/5 transition-all">
                            View Profile
                        </Link>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem id="nav-home" icon={<Home size={20} />} label="Home Feed" active href="/" />
                    <SidebarItem id="nav-explore" icon={<Search size={20} />} label="Explore Vibes" onClick={() => setShowSearch(true)} />
                    <SidebarItem id="nav-notifications" icon={<Bell size={20} />} label="Notifications" badge={notifications.length} onClick={() => setShowNotifications(true)} />
                    <SidebarItem id="nav-messages" icon={<MessageSquare size={20} />} label="Messages" onClick={() => alert('Messages feature coming soon!')} />
                    <div className="my-4 border-t border-white/5" />
                    <SidebarItem id="nav-settings" icon={<Settings size={20} />} label="Settings" onClick={() => setShowSettings(true)} />
                    <SidebarItem id="nav-vibe-report" icon={<BarChart3 size={20} />} label="Vibe Report" onClick={() => setShowVibeReport(true)} />
                    <SidebarItem id="nav-soulmatch" icon={<HeartHandshake size={20} />} label="Soulmatch AI" onClick={() => setShowVibeMatcher(true)} />
                    <SidebarItem id="nav-vibe-party" icon={<PartyPopper size={20} />} label="Vibe Party" onClick={() => setShowVibeParty(true)} />
                    <SidebarItem id="nav-vibe-studio" icon={<Sparkles size={20} className="text-secondary" />} label="Vibe Studio" onClick={() => setShowVibeStudio(true)} />
                    
                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <div className="px-3 flex items-center justify-between group">
                            <div className="flex items-center gap-3 text-gray-500 group-hover:text-white transition-colors">
                                <span className={`w-2 h-2 rounded-full ${isGhostMode ? 'bg-gray-600' : 'bg-green-500 animate-pulse'} shadow-[0_0_8px_currentColor]`} />
                                <span className="text-[10px] font-black uppercase tracking-widest leading-none">Ghost Mode</span>
                            </div>
                            <button 
                                onClick={() => setIsGhostMode(!isGhostMode)}
                                className={`w-9 h-4 rounded-full relative transition-all duration-300 ${isGhostMode ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all duration-300 ${isGhostMode ? 'right-0.5 shadow-[-2px_0_5px_rgba(0,0,0,0.5)]' : 'left-0.5'}`} />
                            </button>
                        </div>
                        
                        <div className="px-3 pt-2">
                             <button onClick={() => setShowVibeShop(true)} className="w-full btn btn-outline border-primary/20 text-primary py-2 text-[10px] uppercase font-black tracking-widest hover:bg-primary/10 flex items-center justify-center gap-2">
                                <ShoppingBag size={12} /> Vibe Shop
                             </button>
                        </div>
                        
                        <div className="pt-4 space-y-1">
                            <SidebarItem id="nav-profile" icon={<User size={20} />} label="Profile" href={mongoUser ? `/profile/${(mongoUser.handle || '').replace('@', '')}` : '#'} />
                            <button id="nav-logout" onClick={handleLogout} className="flex items-center gap-4 w-full p-3 rounded-xl transition-colors hover:bg-red-500/5 text-gray-500 hover:text-red-400">
                                <LogOut size={20} />
                                <span className="font-medium text-sm">Log Out</span>
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Main Feed */}
            <main className="flex-1 w-full max-w-2xl border-r border-white/10 pb-20 md:pb-0">
                <header className="sticky top-0 bg-black/80 backdrop-blur-md z-40 border-b border-white/10">
                    <div className="flex items-center justify-between px-2 w-full">
                        <div className="flex flex-1">
                            {['for-you', 'following', 'discovery'].map(tab => (
                                <button
                                    key={tab}
                                    id={`tab-${tab}`}
                                    className={`flex-1 py-4 text-center text-[9px] uppercase tracking-widest font-black relative transition-all ${activeTab === tab ? 'text-primary' : 'text-gray-600 hover:text-gray-400'}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.replace('-', ' ')}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_var(--primary-glow)]" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="px-4 border-l border-white/5 h-10 flex items-center gap-4 text-gray-500">
                             <button className="hover:text-primary transition-colors" title="Chronological"><Clock size={16} /></button>
                             <button className="hover:text-primary transition-colors text-primary" title="AI Curated"><Sparkles size={16} /></button>
                        </div>
                    </div>
                </header>

                <div className="p-4 flex gap-4 overflow-x-auto pb-6 border-b border-white/10 scrollbar-hide">
                    <StoryCard name="You" isUser />
                    <StoryCard name="Jessica" color="bg-orange-600" style="cyberpunk" unread />
                    <StoryCard name="David" color="bg-blue-600" style="lofi" unread />
                    <StoryCard name="Anya" color="bg-purple-600" style="vaporwave" unread />
                    <StoryCard name="Raj" color="bg-teal-600" style="minimalist" />
                    <StoryCard name="Milo" color="bg-rose-600" style="dark_academia" unread />
                </div>

                <div className="p-4 border-b border-white/10">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {user?.name?.[0] || "V"}
                        </div>
                        <div className="flex-1">
                            <textarea
                                id="new-post-input"
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                placeholder="What's your vibe today?"
                                className="w-full bg-transparent border-none focus:ring-0 text-lg placeholder-gray-500 resize-none min-h-[100px] mt-2"
                            />

                            <div className={`relative mt-2 mb-4 group ${isARActive ? 'ring-2 ring-primary ring-offset-4 ring-offset-black rounded-2xl overflow-hidden' : ''}`}>
                                {isARActive && (
                                    <div className="absolute inset-0 z-10 pointer-events-none">
                                        <div className="absolute inset-0 bg-[#ff00ff]/10 mix-blend-overlay animate-pulse" />
                                        <div className="absolute top-4 left-4 flex items-center gap-2 text-[10px] font-black text-red-500">
                                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            <span>LIVE VIBE-AR</span>
                                        </div>
                                    </div>
                                )}
                                {postImage && (
                                    <div className="relative group/img ring-1 ring-white/10 rounded-2xl overflow-hidden" id="post-image-preview-container">
                                        <button
                                            id="remove-post-image-btn"
                                            onClick={() => setPostImage(null)}
                                            className="absolute top-2 right-2 z-10 p-1.5 bg-black/60 rounded-full hover:bg-black/90 text-white transition-all shadow-xl"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className={`relative w-full h-64 sm:h-80 ${isARActive ? 'hue-rotate-90 contrast-125 saturate-200' : ''}`}>
                                            <Image src={postImage} alt="Post preview" fill className="object-cover" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                                {['cyberpunk', 'lofi', 'minimalist', 'dark_academia', 'vaporwave'].map(style => (
                                    <button
                                        key={style}
                                        onClick={() => setSelectedStyle(style)}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${selectedStyle === style ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'}`}
                                    >
                                        {style.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-white/5 gap-2">
                                <div className="flex gap-1 flex-wrap">
                                    <label className="p-2 hover:bg-primary/10 rounded-full text-primary cursor-pointer transition-colors group" htmlFor="post-image-upload">
                                        <input type="file" id="post-image-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
                                        <ImagePlus size={18} className="group-hover:scale-110 transition-transform" />
                                    </label>
                                    <button onClick={() => setIsARActive(!isARActive)} className={`p-2 rounded-full transition-all ${isARActive ? 'bg-primary/20 text-primary animate-pulse' : 'hover:bg-primary/10 text-primary'}`} title="AR Filter">
                                        <Video size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (isRecording) { handleVoiceAnalyze(); }
                                            else { setIsRecording(true); setTimeout(() => handleVoiceAnalyze(), 3000); }
                                        }}
                                        disabled={isAnalyzingVoice}
                                        className={`p-2 rounded-full transition-all ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'hover:bg-primary/10 text-primary'}`}
                                    >
                                        <Mic size={18} className={isRecording ? 'scale-110' : ''} />
                                    </button>
                                    <select
                                        value={selectedCircle}
                                        onChange={(e) => setSelectedCircle(e.target.value)}
                                        className="bg-transparent border-none text-[10px] font-bold text-gray-500 focus:ring-0 cursor-pointer hover:text-primary transition-colors"
                                    >
                                        <option value="Public">🌍 Public</option>
                                        <option value="Friends">🫂 Friends</option>
                                        <option value="Deep Web">🕳️ Deep Web</option>
                                    </select>
                                </div>
                                <div className="flex gap-1.5 flex-wrap justify-end">
                                    <button
                                        onClick={handleGenerateHashtags}
                                        disabled={!newPost.trim() || isGeneratingTags}
                                        className="px-2 py-1.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 hover:border-primary/30 text-white transition-all disabled:opacity-50"
                                    >
                                        {isGeneratingTags ? "🏷️..." : "#️⃣ Tags"}
                                    </button>
                                    <button
                                        id="enhance-vibe-btn"
                                        onClick={handleEnhanceVibe}
                                        disabled={!newPost.trim() || isEnhancing}
                                        className="px-2 py-1.5 rounded-full text-[10px] font-bold bg-white/5 border border-primary/20 hover:bg-primary/10 text-white transition-all disabled:opacity-50"
                                    >
                                        {isEnhancing ? "✨..." : "✨ Enhance"}
                                    </button>
                                    <button
                                        id="submit-post-btn"
                                        onClick={handlePost}
                                        disabled={!newPost.trim() && !postImage}
                                        className="btn btn-primary px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 disabled:shadow-none"
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="pb-4 space-y-6">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-surface/20 border border-white/5 p-5 rounded-2xl animate-pulse">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-white/5 rounded-full" />
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-white/5 rounded w-1/4" />
                                            <div className="h-3 bg-white/5 rounded w-1/6" />
                                        </div>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="h-3 bg-white/5 rounded w-full" />
                                        <div className="h-3 bg-white/5 rounded w-5/6" />
                                        <div className="h-3 bg-white/5 rounded w-4/6" />
                                    </div>
                                    <div className="mt-6 w-full h-48 bg-white/5 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {posts.map(post => (
                                <motion.div 
                                    key={post._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="post-list-item"
                                >
                                    <PostCard
                                        post={post}
                                        onLike={() => toggleLike(post._id)}
                                        session={session}
                                        refreshFeed={mutatePosts}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 hidden lg:block p-6 sticky top-0 h-screen overflow-y-auto">
                <div className="bg-surface/20 border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-sm group hover:border-primary/20 transition-all flex flex-col">
                    <h2 className="font-bold text-xs uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center justify-between">
                        Pulse
                        <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    </h2>
                    <div className="relative h-20 flex items-end gap-1 px-2">
                        {[40, 70, 45, 90, 65, 80, 55, 100, 75, 50].map((h, i) => (
                            <div 
                                key={i} 
                                className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-sm animate-pulse"
                                style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                            />
                        ))}
                    </div>
                    <p className="mt-4 text-[10px] text-center text-gray-500 font-medium tracking-tight">The world is feeling <span className="text-white font-bold">#CyberpunkDreams</span> 🤖</p>
                </div>

                <div className="bg-surface/20 border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-sm">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <Heart size={14} className="fill-secondary text-secondary" /> Vibe Matches
                    </h2>
                    <div className="space-y-4">
                        {vibeMatches.length > 0 ? vibeMatches.map(match => (
                            <SuggestedMatch
                                key={match._id}
                                name={match.name}
                                vibe={match.handle}
                                match={`${Math.floor(Math.random() * 20) + 75}%`}
                                color="bg-primary/20"
                            />
                        )) : (
                            <div className="text-[10px] text-gray-600 text-center py-4 italic font-light">
                                Analyzing your vibes for matches...
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-white/5 rounded-2xl p-4 mb-6 relative overflow-hidden group">
                    <div className="absolute top-2 right-4 flex items-center gap-1.5 animate-pulse">
                        <Users size={10} className="text-primary" />
                        <span className="text-[9px] font-black text-primary uppercase">{globalListenCount} Vibing</span>
                    </div>
                    <h3 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Vibe Lobby</h3>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-black/60 rounded-xl flex items-center justify-center text-primary border border-white/10 shadow-inner group-hover:rotate-[360deg] transition-all duration-1000 relative">
                            <div className="absolute inset-2 border border-primary/20 rounded-full animate-spin" />
                            <Music size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-bold text-sm text-white truncate">{recommendedSong?.recommendation?.title || "Starboy"}</div>
                            <div className="text-[10px] text-gray-500 truncate">{recommendedSong?.recommendation?.artist || "The Weeknd"}</div>
                        </div>
                        <button className="p-2 bg-primary/20 rounded-full text-primary hover:bg-primary hover:text-white transition-all">
                            <Play size={16} fill="currentColor" />
                        </button>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border border-black bg-zinc-800 flex items-center justify-center text-[8px] font-bold overflow-hidden relative"><Image src={`https://i.pravatar.cc/50?u=${i}`} alt="Avatar" fill className="object-cover" /></div>)}
                        </div>
                        <div className="text-[9px] text-gray-500 font-medium">Synced with everyone online</div>
                    </div>
                </div>

                <div className="bg-surface/20 border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-sm">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4">Trending</h2>
                    <div className="space-y-1">
                        {trending.length > 0 ? trending.map((t, idx) => (
                            <TrendingTopic key={t._id} rank={idx + 1} topic={`#${t._id}`} posts={`${t.count}`} />
                        )) : <div className="text-xs text-gray-600">No trends yet.</div>}
                    </div>
                </div>

                <div className="bg-surface/20 border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h2 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <Sun size={14} className="text-yellow-500" /> Vibe Forecast
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                🌃
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Tomorrow's Vibe</span>
                                <span className="text-xs font-bold text-white">85% Cyberpunk Glitch</span>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full w-[85%] shadow-[0_0_10px_var(--primary-glow)]" />
                        </div>
                        <p className="text-[9px] text-gray-500 italic leading-tight">"A surge of high-energy creativity is predicted. Prepare your neon assets."</p>
                    </div>
                </div>

                <div className="bg-surface/20 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                    <h2 className="font-bold text-sm uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                        ✨ AI Viral Tags
                    </h2>
                    <div className="space-y-1">
                        {popularHashtags.map((h, idx) => (
                            <TrendingTopic key={idx} rank={idx + 1} topic={`#${h.tag}`} posts={`Score: ${h.score}`} />
                        ))}
                    </div>
                </div>
            </aside>
            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-2 py-2 safe-area-bottom">
                <button id="mob-nav-home" onClick={() => {}} className="flex flex-col items-center gap-1 p-2 text-primary">
                    <Home size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
                </button>
                <button id="mob-nav-search" onClick={() => setShowSearch(true)} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
                    <Search size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Explore</span>
                </button>
                <button id="mob-nav-notifications" onClick={() => setShowNotifications(true)} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors relative">
                    <Bell size={20} />
                    {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    <span className="text-[9px] font-black uppercase tracking-widest">Alerts</span>
                </button>
                <button id="mob-nav-soulmatch" onClick={() => setShowVibeMatcher(true)} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
                    <HeartHandshake size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Match</span>
                </button>
                <button id="mob-nav-profile" onClick={() => router.push(mongoUser ? `/profile/${(mongoUser.handle || '').replace('@', '')}` : '#')} className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-white transition-colors">
                    <User size={20} />
                    <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
                </button>
            </nav>
        </div>
    );
}

function StoryCard({ name, color, isUser, unread, style }) {
    return (
        <div 
            className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
            onClick={() => alert(`Opening ${name}'s ${style || 'vibe'} story...`)}
        >
            <div className={`p-0.5 rounded-full transition-all duration-300 group-hover:scale-105 ${isUser ? 'border border-dashed border-gray-700' : (unread ? 'bg-gradient-to-tr from-yellow-400 to-primary p-[2px] shadow-[0_0_15px_var(--primary-glow)] border-2 border-white/20' : 'border border-white/10')}`}>
                <div className={`w-14 h-14 rounded-full border-2 border-black ${color || 'bg-zinc-800'} flex items-center justify-center overflow-hidden relative`}>
                    {isUser && <span className="text-xl text-gray-500 font-light">+</span>}
                    {style === 'cyberpunk' && <div className="absolute inset-0 bg-pink-500/20 mix-blend-overlay animate-pulse" />}
                    {style === 'vaporwave' && <div className="absolute inset-0 bg-cyan-500/20 mix-blend-color animate-pulse" />}
                </div>
            </div>
            <span className="text-[10px] text-center font-bold text-gray-500 group-hover:text-white transition-colors text-ellipsis overflow-hidden w-16 px-1">{name}</span>
        </div>
    );
}

function SidebarItem({ icon, label, active, badge, href, onClick, id }) {
    const item = (
        <div id={id} className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 group ${active ? 'bg-primary/5 text-primary active:scale-95' : 'hover:bg-white/5 text-gray-500 hover:text-white'}`}>
            <div className={`transition-all duration-300 group-hover:scale-110 ${active ? 'scale-110 drop-shadow-[0_0_5px_var(--primary-glow)]' : ''}`}>
                {icon}
            </div>
            <span className={`text-sm ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
            {(badge !== undefined && badge !== null && badge !== 0) && (
                <span className="ml-auto bg-primary text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-black animate-pulse">
                    {badge}
                </span>
            )}
        </div>
    );

    return href ? <Link href={href} className="block">{item}</Link> : <button className="w-full text-left" onClick={onClick}>{item}</button>;
}

const formatTimestamp = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
};

function PostCard({ post, onLike, session, refreshFeed }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const author = post.authorId || { name: "User", handle: "@user" };
    const timestamp = formatTimestamp(post.createdAt);

    const toggleComments = async () => {
        if (!showComments && comments.length === 0) {
            try {
                const res = await fetch(`${API_BASE}/posts/${post._id}/comments`);
                const data = await res.json();
                if (res.ok) setComments(data.comments || data);
            } catch (err) {
                console.error("Fetch comments failed:", err);
            }
        }
        setShowComments(!showComments);
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !token) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE}/posts/${post._id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({ content: commentText }),
            });
            if (res.ok) {
                setCommentText("");
                const updated = await fetch(`${API_BASE}/posts/${post._id}/comments`).then(r => r.json());
                setComments(updated.comments || updated);
            }
        } catch (err) {
            console.error("Comment failed:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-5 border-b border-white/5 hover:bg-white/[0.02] transition-all bg-surface/10 rounded-2xl mb-4 group/post">
            <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-full ${author.color || "bg-gradient-to-br from-primary to-accent"} flex-shrink-0 shadow-xl border border-white/10`} />
                <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center mb-1">
                        <Link href={`/profile/${author.handle?.replace('@', '')}`} className="font-bold hover:underline text-white text-[15px] truncate">{author.name}</Link>
                        <span className="text-gray-500 text-xs truncate">{author.handle}</span>
                        <span className="text-gray-500 text-[10px] shrink-0">· {timestamp}</span>
                    </div>

                    <p className="mb-4 text-gray-200 leading-relaxed text-sm">{post.content}</p>

                    {post.image && (
                        <div className="w-full relative mt-4 mb-3 border border-white/5 rounded-2xl overflow-hidden group/img cursor-zoom-in shadow-2xl h-64 sm:h-96 max-h-[600px]">
                            <Image src={post.image} alt="Vibe Content" fill className="object-cover transition-transform duration-700 group-hover/img:scale-105" />
                        </div>
                    )}

                    <div className="flex justify-between max-w-sm text-gray-500 mt-4 border-t border-white/5 pt-3">
                        <ActionBtn
                            icon={<MessageSquare size={18} />}
                            count={comments.length || post._count?.comments || 0}
                            onClick={toggleComments}
                            color="hover:text-primary"
                            active={showComments}
                        />
                        <ActionBtn
                            icon={<Heart size={18} />}
                            count={post.likesCount || post._count?.likes || 0}
                            onClick={onLike}
                            color="hover:text-pink-500"
                            active={post.isLiked}
                        />
                        <ActionBtn icon={<Share2 size={18} />} color="hover:text-secondary" />
                        <ActionBtn
                            icon={<Volume2 size={18} />}
                            onClick={() => handleNarrate(post.content, post.tag || 'minimalist')}
                            color="hover:text-amber-500"
                            tooltip="AI Narrate"
                        />
                        <button 
                            onClick={(e) => { e.preventDefault(); alert("💎 MINTED! This post is now a Legacy Vibe on the blockchain."); }}
                            className="flex items-center gap-1.5 text-[10px] font-black uppercase text-accent border border-accent/20 px-2 py-0.5 rounded-full hover:bg-accent/10 transition-all opacity-0 group-hover/post:opacity-100"
                        >
                            <Ticket size={12} /> Mint
                        </button>
                    </div>

                    {showComments && (
                        <div className="mt-5 space-y-4 animate-in slide-in-from-top-4 duration-300">
                            <div className="flex flex-col gap-4 bg-white/5 p-4 rounded-xl border border-white/5 shadow-inner">
                                <form onSubmit={handleComment} className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface border border-white/10 flex items-center justify-center text-[10px] font-bold">
                                        {session?.user?.name?.[0]}
                                    </div>
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a vibe..."
                                        className="flex-1 bg-black/40 border border-white/10 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-primary/50 transition-all text-gray-200"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !commentText.trim()}
                                        className="text-primary text-xs font-bold hover:text-white transition-colors disabled:opacity-30"
                                    >
                                        Post
                                    </button>
                                </form>

                                <div className="space-y-4">
                                    {comments.map((c) => (
                                        <div key={c._id} className="flex gap-3 text-xs">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/5" />
                                            <div className="flex-1 bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5">
                                                <div className="flex justify-between mb-1">
                                                    <span className="font-bold text-gray-300">{c.authorId?.name}</span>
                                                    <span className="text-[9px] text-gray-600">{formatTimestamp(c.createdAt)}</span>
                                                </div>
                                                <p className="text-gray-400 leading-normal">{c.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ActionBtn({ icon, count, color, onClick, active }) {
    return (
        <button
            className={`flex items-center gap-1.5 transition-all group ${color} ${active ? 'text-primary' : ''}`}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onClick) onClick();
            }}
        >
            <div className="p-2 rounded-full group-hover:bg-white/5 transition-colors">
                {icon}
            </div>
            {count && <span className="text-xs font-semibold">{count}</span>}
        </button>
    );
}

function SuggestedMatch({ name, vibe, match, color }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${color} shadow-inner border border-white/10`} />
                <div>
                    <div className="font-bold text-xs text-white group-hover:text-primary transition-colors">{name}</div>
                    <div className="text-[10px] text-gray-500">{vibe}</div>
                </div>
            </div>
            <div className="text-[10px] font-black text-accent bg-accent/5 border border-accent/10 px-2 py-0.5 rounded-full">{match}</div>
        </div>
    );
}

function TrendingTopic({ rank, topic, posts }) {
    return (
        <div className="flex justify-between items-center hover:bg-white/5 p-2 rounded-xl cursor-pointer transition-all group">
            <div className="flex gap-3">
                <span className="text-[10px] font-black text-gray-700 w-4 py-1">{rank}</span>
                <div>
                    <div className="font-bold text-xs text-white group-hover:text-primary transition-colors">{topic}</div>
                    <div className="text-[9px] font-semibold text-gray-500 uppercase tracking-tighter shrink-0">{posts} Posts</div>
                </div>
            </div>
            <MoreHorizontal size={14} className="text-gray-700 opacity-0 group-hover:opacity-100" />
        </div>
    );
}

