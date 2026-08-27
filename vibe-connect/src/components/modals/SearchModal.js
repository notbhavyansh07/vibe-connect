import { Search } from "lucide-react";

export default function SearchModal({ setShowSearch, searchQuery, handleSearch, searchResults }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSearch(false)} />
            <div className="bg-surface w-full max-w-lg rounded-3xl border border-white/10 shadow-2xl relative z-10 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Search size={18} className="text-primary" /> Search Vibes
                    </h2>
                    <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-white">✕</button>
                </div>
                <div className="relative mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search posts, vibes, or topics..."
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
                        autoFocus
                    />
                </div>
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
                    {searchResults && searchResults.length > 0 ? (
                        searchResults.map((post) => (
                            <div key={post._id} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs">
                                <p className="text-white font-medium">{post.content}</p>
                                {post.tag && <span className="text-[10px] text-primary">#{post.tag}</span>}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-xs text-gray-500 italic">
                            {searchQuery ? "No results found" : "Type to search..."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
