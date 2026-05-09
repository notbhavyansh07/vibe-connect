"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Zap, Home, Search, MessageSquare, Bell, User, MoreHorizontal, Settings, LogOut, Compass, MapPin, Calendar, Link as LinkIcon, Music, Edit, Heart, Share2
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";

export default function Profile() {
    const { data: session } = useSession();
    const { handle } = useParams();
    const [activeTab, setActiveTab] = useState("posts");
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [vibePrompt, setVibePrompt] = useState("");

    useEffect(() => {
        if (handle) {
            fetchProfile();
        }
    }, [handle]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`/api/users/${handle}`);
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const checkFollowStatus = () => {}; // Requires backend

    const handleFollow = () => {
        alert('Follow feature requires backend deployment.');
    };

    const toggleLike = async (postId) => {
        try {
            await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
            fetchProfile();
        } catch (err) {
            console.error('Like toggle failed:', err);
        }
    };

    const handleGenerateVibeAvatar = () => {
        alert('✨ AI Vibe Avatar feature requires backend deployment.');
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/login" });
    };

    const user = session?.user;
    const isOwnProfile = user?.handle?.replace('@', '') === handle;
    const displayUser = profile?.user || (isOwnProfile ? user : null);

    if (loading && !profile) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Vibing...</div>;
    }

    if (!displayUser && !loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">User not found</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Left Sidebar - Consistent with Feed */}
            <aside className="w-72 border-r border-white/10 hidden md:flex flex-col h-screen sticky top-0 p-4 gap-6">
                <div className="flex items-center gap-2 px-2 py-3">
                    <Zap className="text-primary w-8 h-8 fill-primary/10" />
                    <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">VibeConnect</span>
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

                        <Link href={`/profile/${user?.handle?.replace('@', '')}`} className="w-full mt-4 btn btn-outline py-2 text-xs justify-center hover:bg-white/5 transition-all">
                            View Profile
                        </Link>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem icon={<Home size={20} />} label="Home Feed" href="/" />
                    <SidebarItem icon={<Compass size={20} />} label="Explore Vibes" onClick={() => alert('Search feature active on Home Page')} />
                    <SidebarItem icon={<Bell size={20} />} label="Notifications" badge="0" />
                    <SidebarItem icon={<MessageSquare size={20} />} label="Messages" onClick={() => alert('Messages coming soon')} />
                    <div className="my-4 border-t border-white/5" />
                    <SidebarItem icon={<Settings size={20} />} label="Settings" onClick={() => alert('Settings coming soon')} />
                    <SidebarItem icon={<User size={20} />} label="Profile" active href={displayUser ? `/profile/${(displayUser.handle || '').replace('@', '')}` : '#'} />
                    <button onClick={handleLogout} className="flex items-center gap-4 w-full p-3 rounded-xl transition-colors hover:bg-red-500/5 text-gray-500 hover:text-red-400">
                        <LogOut size={20} />
                        <span className="font-medium text-sm">Log Out</span>
                    </button>
                </nav>
            </aside>

            {/* Main Profile Content */}
            <main className="flex-1 w-full border-r border-white/10 overflow-y-auto h-screen">
                {/* Profile Header */}
                <div className="relative">
                    {/* Cover Image */}
                    <div className="h-48 w-full bg-gradient-to-r from-purple-900 to-indigo-900 overflow-hidden relative">
                        {profile?.user?.coverImage ? (
                           <Image src={profile.user.coverImage} fill className="object-cover" alt="Vibe Cover" />
                        ) : (
                           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </div>

                    <div className="px-6 pb-6 relative -mt-16 flex flex-col md:flex-row items-end md:items-start gap-6">
                        <div className="w-32 h-32 rounded-full border-4 border-black bg-black p-1 shadow-2xl z-10 flex-shrink-0">
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-4xl font-bold">
                                {displayUser?.name?.[0] || "V"}
                            </div>
                        </div>

                        <div className="flex-1 pt-16 md:pt-0 mt-2 md:mt-20">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold">{displayUser?.name}</h1>
                                    <div className="text-gray-400">{displayUser?.handle}</div>
                                </div>
                                {isOwnProfile ? (
                                    <div className="flex gap-2">
                                        <button 
                                            id="generate-vibe-avatar-btn"
                                            onClick={handleGenerateVibeAvatar}
                                            disabled={isGenerating}
                                            className="btn bg-primary/10 border border-primary/20 hover:bg-primary/20 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2"
                                        >
                                            {isGenerating ? "✨ Vibing..." : "✨ AI Vibe Avatar"}
                                        </button>
                                        <button className="btn btn-outline px-6 py-2 rounded-full text-sm font-bold hover:bg-white/10 transition-colors flex items-center gap-2">
                                            <Edit size={16} /> Edit Profile
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleFollow}
                                        className={`btn ${isFollowing ? 'btn-outline border-primary text-primary' : 'btn-primary'} px-8 py-2 rounded-full text-sm font-bold transition-all`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                )}
                            </div>

                            <p className="mt-4 text-gray-200 max-w-2xl leading-relaxed">
                                {displayUser?.bio || "No bio yet. Vibing in the shadows. 🌑"}
                            </p>

                            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
                                <div className="flex items-center gap-1"><MapPin size={16} /> Tokyo, Japan</div>
                                <div className="flex items-center gap-1"><LinkIcon size={16} className="text-primary" /> <a href="#" className="text-primary hover:underline">vibeconnect.com</a></div>
                                <div className="flex items-center gap-1"><Calendar size={16} /> Joined February 2026</div>
                            </div>

                            <div className="flex gap-6 mt-6 border-b border-white/10 pb-6">
                                <div className="flex gap-1 hover:underline cursor-pointer"><span className="font-bold text-white">{profile?.stats?.following || 0}</span> <span className="text-gray-500">Following</span></div>
                                <div className="flex gap-1 hover:underline cursor-pointer"><span className="font-bold text-white">{profile?.stats?.followers || 0}</span> <span className="text-gray-500">Followers</span></div>
                                <div className="flex gap-1 hover:underline cursor-pointer"><span className="font-bold text-white">{profile?.stats?.postCount || 0}</span> <span className="text-gray-500">Posts</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Tabs */}
                <div className="sticky top-0 bg-black/80 backdrop-blur-xl z-30 border-b border-white/10 px-6">
                    <div className="flex gap-8">
                        {['Posts', 'Vibes', 'Media', 'Likes'].map((tab) => (
                            <button
                                key={tab}
                                className={`py-4 font-medium relative transition-colors ${activeTab === tab.toLowerCase() ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_0_10px_var(--primary-glow)]" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 pb-20">
                    {activeTab === 'posts' && (
                        <div className="space-y-6">
                            {profile?.posts?.length > 0 ? (
                                profile.posts.map(post => (
                                    <PostCard
                                        key={post._id}
                                        user={profile.user}
                                        content={post.content}
                                        timestamp={formatTimestamp(post.createdAt)}
                                        likes={post.likesCount || 0}
                                        onLike={() => toggleLike(post._id)}
                                        track={post.trackTitle ? { title: post.trackTitle, artist: post.trackArtist } : null}
                                        tag={post.tag}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500 text-sm">No vibes yet.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'vibes' && (
                        <div className="grid grid-cols-2 gap-4">
                            <VibeCard title="Music" value="Synthwave / Lo-Fi" color="from-purple-500 to-indigo-500" />
                            <VibeCard title="Hobby" value="Photography" color="from-pink-500 to-rose-500" />
                            <VibeCard title="Personality" value="INFJ-T" color="from-cyan-500 to-blue-500" />
                            <VibeCard title="Style" value="Cyberpunk" color="from-emerald-500 to-teal-500" />
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar - Suggestions */}
            <aside className="w-80 hidden lg:block p-6 sticky top-0 h-screen overflow-y-auto">
                <div className="bg-surface/50 border border-white/5 rounded-2xl p-5 mb-6 backdrop-blur-sm">
                    <h2 className="font-bold text-lg mb-4">You might know</h2>
                    <div className="space-y-4">
                        <SuggestedProfile name="Alex Rivera" mutuals="2" />
                        <SuggestedProfile name="Sarah Chen" mutuals="5" />
                    </div>
                </div>

                <div className="bg-surface/50 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
                    <h2 className="font-bold text-lg mb-4">Profile Strength</h2>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                        <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-[85%]" />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mb-4">
                        <span>Optimized</span>
                        <span>85%</span>
                    </div>
                    <button className="w-full btn btn-outline py-2 text-sm justify-center border-white/10 hover:bg-white/5">Complete Profile</button>
                </div>
            </aside>
        </div>
    );
}

function SidebarItem({ icon, label, active, badge, href, onClick }) {
    const content = (
        <>
            <div className={`transition-transform group-hover:scale-110 ${active ? 'scale-110' : ''}`}>
                {icon}
            </div>
            <span className="font-medium">{label}</span>
            {badge && (
                <span className="ml-auto bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_var(--primary-glow)]">
                    {badge}
                </span>
            )}
        </>
    );

    const className = `flex items-center gap-4 w-full p-3 rounded-xl transition-all group ${active ? 'bg-primary/10 text-primary font-bold border border-primary/20' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`;

    if (href) {
        return <Link href={href} className={className}>{content}</Link>;
    }

    return <button className={className} onClick={onClick}>{content}</button>;
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

function PostCard({ user, content, timestamp, likes, comments, image, track, tag, onLike }) {
    return (
        <div className="p-4 border border-white/10 rounded-xl hover:bg-white/[0.02] transition-colors cursor-pointer bg-surface/30">
            <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-full ${user.color || "bg-gradient-to-br from-accent to-primary"} flex-shrink-0 border border-white/10`} />
                <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center mb-1">
                        <span className="font-bold hover:underline text-white text-sm truncate">{user.name}</span>
                        <span className="text-gray-500 text-xs truncate">{user.handle}</span>
                        <span className="text-gray-500 text-xs shrink-0">· {timestamp}</span>
                        <button className="ml-auto text-gray-600 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors shrink-0">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>

                    <p className="mb-3 text-gray-200 leading-relaxed text-[13px]">{content}</p>

                    {track && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface/40 border border-white/5 mb-3 hover:border-primary/40 transition-all group/track">
                            <div className="w-9 h-9 bg-black/60 rounded-lg flex items-center justify-center text-primary group-hover/track:scale-105 transition-transform border border-white/10 shadow-inner">
                                <Music size={16} />
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-xs text-white truncate">{track.title}</div>
                                <div className="text-[10px] text-gray-500 truncate">{track.artist}</div>
                            </div>
                            <div className="ml-auto opacity-0 group-hover/track:opacity-100 transition-opacity">
                                <div className="p-1 px-3 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase tracking-tighter">Listen</div>
                            </div>
                        </div>
                    )}

                    {tag && (
                        <span className="inline-block px-2.5 py-0.5 bg-accent/5 text-accent text-[10px] rounded-full font-bold mb-3 border border-accent/10 uppercase tracking-tighter">
                            #{tag}
                        </span>
                    )}

                    {image && (
                        <div className="w-full h-48 bg-gray-800 rounded-xl mb-3 flex items-center justify-center text-gray-600">
                            [Image Placeholder]
                        </div>
                    )}

                    <div className="flex justify-between max-w-sm text-gray-500 mt-2">
                        <div className="flex items-center gap-2 hover:text-blue-400 cursor-pointer group">
                            <div className="p-2 rounded-full group-hover:bg-sky-500/10 transition-colors">
                                <MessageSquare size={16} />
                            </div>
                            <span className="text-xs font-semibold">{comments}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-pink-500 cursor-pointer group" onClick={onLike}>
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                                <Heart size={16} className={likes > 0 ? "fill-pink-500 text-pink-500" : ""} />
                            </div>
                            <span className="text-xs font-semibold">{likes}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-emerald-400 cursor-pointer group">
                            <div className="p-2 rounded-full group-hover:bg-emerald-500/10 transition-colors">
                                <Share2 size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VibeCard({ title, value, color }) {
    return (
        <div className="bg-surface/30 border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div className="text-sm text-gray-400">{title}</div>
            <div className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${color}`}>{value}</div>
        </div>
    )
}

function SuggestedProfile({ name, mutuals }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700" />
                <div>
                    <div className="font-bold text-sm text-white group-hover:text-primary transition-colors">{name}</div>
                    <div className="text-xs text-gray-400">{mutuals} mutual friends</div>
                </div>
            </div>
            <button className="text-xs font-bold text-primary border border-primary/50 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all">Follow</button>
        </div>
    );
}
