import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
}

interface CommentDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
  postAuthor: string;
  postContent: string;
}

export const CommentDrawerModal: React.FC<CommentDrawerModalProps> = ({
  isOpen,
  onClose,
  postAuthor,
  postContent,
}) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      user: 'Sophia Chen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      text: 'This 3D shader aesthetic looks super clean! 🔥',
      time: '15m ago',
      likes: 4,
    },
    {
      id: 'c2',
      user: 'Kai Takahashi',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      text: 'Are you using Three.js or WebGL raw shaders for the node mesh?',
      time: '10m ago',
      likes: 2,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  if (!isOpen) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        user: 'Alex Vibe (You)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        text: newComment,
        time: 'Just now',
        likes: 0,
      },
    ]);
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-lg p-6 relative border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white font-heading">Comments on {postAuthor}'s Vibe</h3>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original Post Snippet */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 mb-4 italic leading-relaxed">
          "{postContent}"
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-slate-900/50 border border-white/5 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={c.avatar} alt={c.user} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-200">{c.user}</span>
                </div>
                <span className="text-[10px] text-slate-500">{c.time}</span>
              </div>
              <p className="text-xs text-slate-300 pl-8">{c.text}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-3 border-t border-white/10">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <button type="submit" className="btn-glow-primary py-2.5 px-4 text-xs">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
