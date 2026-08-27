import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Sparkles, Image, Video, Flame, RadioTower } from 'lucide-react';
import { CommentDrawerModal } from './CommentDrawerModal';
import { soundFx } from '../utils/audioEffects';

interface Story {
  id: string;
  user: string;
  avatar: string;
  hasUnseen: boolean;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  tag: string;
  content: string;
  mediaUrl?: string;
  likes: number;
  commentsCount: number;
  category: string;
  isLiked?: boolean;
}

const INITIAL_STORIES: Story[] = [
  { id: '1', user: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', hasUnseen: false },
  { id: '2', user: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', hasUnseen: true },
  { id: '3', user: 'Kai T.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', hasUnseen: true },
  { id: '4', user: 'Sophia C.', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', hasUnseen: true },
  { id: '5', user: 'Marcus B.', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', hasUnseen: false },
];

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    time: '20m ago',
    tag: '3D Design',
    category: 'Trending',
    content: 'Just finished rendering our new 3D spatial avatar node inside Vibe Connect! What do you think of this cybernetic aesthetic? 🚀✨',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    likes: 142,
    commentsCount: 28,
  },
  {
    id: 'post-2',
    author: 'Kai Takahashi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    time: '1h ago',
    tag: 'Vibe Matching',
    category: 'Trending',
    content: 'Hit a 98% Vibe Match today with @Elena in the Lo-Fi Lounge. We ended up discussing generative 3D shaders for 3 hours straight! 🎧💻',
    likes: 89,
    commentsCount: 14,
  },
];

export const FeedAndStories: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [activeFilter, setActiveFilter] = useState('Trending');
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);

  const filteredPosts = posts.filter(
    (p) => activeFilter === 'Trending' || p.category === activeFilter
  );

  const handleLike = (id: string) => {
    soundFx.playClick();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            isLiked: !p.isLiked,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    soundFx.playClick();
    const newP: Post = {
      id: Date.now().toString(),
      author: 'Alex Vibe (You)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      time: 'Just now',
      tag: 'General Vibe',
      category: activeFilter,
      content: newPostText,
      likes: 1,
      commentsCount: 0,
      isLiked: true,
    };

    setPosts([newP, ...posts]);
    setNewPostText('');
  };

  return (
    <section className="space-y-6" aria-labelledby="community-feed-heading">
      
      {/* Section Eyebrow Header */}
      <div className="section-header-divider">
        <div className="eyebrow-pill bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
          <Flame className="w-3.5 h-3.5 text-emerald-400" />
          <span>TRANSMISSION_STREAM // CHRONOLOGICAL NODES</span>
        </div>
        <div className="line" />
      </div>

      <div className="space-y-6">
        
        {/* Stream Filter Toolbar */}
        <div className="flex items-center justify-between">
          <h2 id="community-feed-heading" className="text-xl md:text-2xl font-extrabold text-white font-heading">
            Live Community <span className="text-emerald-400">Stream</span>
          </h2>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs font-mono">
            {['Trending', 'Near You', 'AI Picks'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  soundFx.playClick();
                  setActiveFilter(tab);
                }}
                className={`px-3 py-1 rounded-lg transition-all ${
                  activeFilter === tab
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={activeFilter === tab}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Horizontal Nodes Bar */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center gap-4 overflow-x-auto no-scrollbar">
          {INITIAL_STORIES.map((st, idx) => (
            <div key={st.id} className="flex flex-col items-center gap-1.5 cursor-pointer group flex-shrink-0">
              <div
                className={`p-[2px] rounded-xl transition-transform group-hover:scale-105 ${
                  idx === 0
                    ? 'bg-slate-700'
                    : 'bg-gradient-to-tr from-cyan-400 to-emerald-400 animate-pulse'
                }`}
              >
                <div className="relative">
                  <img
                    src={st.avatar}
                    alt={st.user}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-[10px] object-cover border border-slate-950"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] border border-slate-950">
                      +
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-300 truncate w-14 text-center">{st.user}</span>
            </div>
          ))}
        </div>

        {/* Create Transmission Card */}
        <div className="section-stream p-4">
          <form onSubmit={handleCreatePost} className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Your avatar"
                loading="lazy"
                decoding="async"
                className="w-9 h-9 rounded-xl object-cover border border-emerald-400/40 flex-shrink-0"
              />
              <textarea
                rows={2}
                placeholder="Broadcast a new transmission to the spatial network..."
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none font-body"
                aria-label="Write a transmission message"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-slate-400">
                <button type="button" className="p-1.5 hover:bg-white/5 rounded-lg flex items-center gap-1.5 text-xs font-mono" aria-label="Add photo">
                  <Image className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[PHOTO]</span>
                </button>
                <button type="button" className="p-1.5 hover:bg-white/5 rounded-lg flex items-center gap-1.5 text-xs font-mono" aria-label="Add 3D clip">
                  <Video className="w-3.5 h-3.5 text-violet-400" />
                  <span>[3D_CLIP]</span>
                </button>
              </div>

              <button type="submit" className="btn-hero-primary py-1.5 px-4 text-xs font-mono" aria-label="Transmit post">
                <span>[TRANSMIT]</span>
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </form>
        </div>

        {/* Posts Stream */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="section-stream p-5 space-y-3">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      loading="lazy"
                      decoding="async"
                      className="w-9 h-9 rounded-xl object-cover border border-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white font-heading truncate">{post.author}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {post.time} • <span className="text-emerald-400 font-bold">#{post.tag}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-body break-words">{post.content}</p>

                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-white/10 max-h-80">
                    <img
                      src={post.mediaUrl}
                      alt="Post Attachment"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-slate-300 text-xs font-mono">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                      post.isLiked ? 'text-pink-400 font-bold bg-pink-500/10' : 'hover:bg-white/5'
                    }`}
                    aria-label={`Like post, currently ${post.likes} likes`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-pink-400' : ''}`} />
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => setSelectedPostForComments(post)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label={`View comments, currently ${post.commentsCount} comments`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsCount}</span>
                  </button>

                  <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors" aria-label="Share post">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          /* Non-happy path: Empty feed filter state */
          <div className="p-8 rounded-2xl bg-slate-950/80 border border-dashed border-white/10 text-center space-y-3">
            <RadioTower className="w-8 h-8 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-heading">[NO_TRANSMISSIONS_ON_{activeFilter.toUpperCase().replace(/\s+/g, '_')}]</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto font-telemetry">
                No signals found on this frequency channel yet. Be the pioneer to transmit a node!
              </p>
            </div>
            <button
              onClick={() => setActiveFilter('Trending')}
              className="btn-hero-primary py-2 px-4 text-xs font-mono"
            >
              <span>[SWITCH_TO_TRENDING]</span>
            </button>
          </div>
        )}

      </div>

      {/* Comment Drawer Modal */}
      {selectedPostForComments && (
        <CommentDrawerModal
          isOpen={!!selectedPostForComments}
          onClose={() => setSelectedPostForComments(null)}
          postAuthor={selectedPostForComments.author}
          postContent={selectedPostForComments.content}
        />
      )}

    </section>
  );
};
