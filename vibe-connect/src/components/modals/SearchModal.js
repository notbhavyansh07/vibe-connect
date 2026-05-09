import { Search } from "lucide-react";
import Link from "next/link";

export default function SearchModal({ setShowSearch, searchQuery, handleSearch, searchResults }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pt-20">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSearch(false)} />
            <div className="w-full max-w-2xl relative z-10 h-full flex flex-col">
                <div className="relative mb-8">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-6 h-6" />
                    <input
                        id="search-input"
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search vibes, tracks, or people..."
                        className="w-full bg-surface/50 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-2xl focus:outline-none focus:border-primary/50 transition-all font-light tracking-tight shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    />
                    <button onClick={() => setShowSearch(false)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">Esc</button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pb-10">
                    {searchResults.length > 0 ? (
                        searchResults.map(post => (
                            <div key={post._id} className="glass p-5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg border border-white/10" />
                                    <div>
                                        <Link href={`/profile/${(post.authorId?.handle || '').replace('@', '')}`} className="font-bold text-sm hover:text-primary transition-colors cursor-pointer block">
                                            {post.authorId?.handle}
                                        </Link>
                                        <p className="text-gray-300 text-sm mt-1">{post.content}</p>
                                        {post.tag && <span className="text-xs text-primary font-bold">#{post.tag}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : searchQuery.length > 1 ? (
                        <div className="text-center py-10 text-gray-500">No vibes matched your search.</div>
                    ) : (
                        <div className="text-center py-10 text-gray-600 font-medium tracking-widest text-xs uppercase">Start typing to see the vibe...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
