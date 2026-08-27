import React, { useState } from 'react';
import { X, Send, Bot, User } from 'lucide-react';

interface AiVibeAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiVibeAssistantModal: React.FC<AiVibeAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am VibeAI, your 3D spatial companion. How can I help match your vibe today?',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Find me a Lo-Fi 3D Lounge',
    'Best icebreaker for Elena',
    'Analyze my Vibe Matrix score',
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Generate intelligent AI response
    setTimeout(() => {
      let botResponse = "Based on your 95% Night Owl vector and Synthwave interest, I recommend joining the 'Lo-Fi Chill Lounge'. Elena & Kai are currently active there!";
      if (text.toLowerCase().includes('icebreaker')) {
        botResponse = "For Elena, mention your favorite 3D shader aesthetic or ask about her latest cyberpunk render!";
      } else if (text.toLowerCase().includes('matrix')) {
        botResponse = "Your Vibe Matrix is currently 85% Music, 70% Energy, 90% Gaming, and 95% Night Owl — placing you in the top 5% of Spatial Creatives!";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-lg p-6 relative border border-cyan-500/40 shadow-2xl shadow-cyan-500/20">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center text-white">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">VibeAI Assistant</h3>
              <p className="text-[10px] text-cyan-400 font-mono">Neural Companion Active</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 mb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                m.sender === 'user' ? 'bg-violet-600 text-white' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                m.sender === 'user'
                  ? 'bg-violet-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="text-[10px] bg-slate-800/90 border border-white/10 hover:border-cyan-400/50 text-slate-300 px-2.5 py-1 rounded-full transition-colors"
            >
              ✨ {qp}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask VibeAI anything..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
          <button type="submit" className="btn-glow-primary py-2 px-4 text-xs">
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
};
