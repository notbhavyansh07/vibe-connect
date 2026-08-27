import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { LAYOUT_CLASSES } from '../styles/layout';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 pt-16 pb-12 px-4">
      <div className={LAYOUT_CLASSES.footerGrid}>
        
        {/* Brand Col */}
        <div className={LAYOUT_CLASSES.footerBrandCol}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              VIBE<span className="text-gradient-cyan">CONNECT</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            The world's first 3D spatial social ecosystem with real-time neural trait matching, binaural audio lounges, and WebGL particle environments.
          </p>

          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>All Systems Operational (99.99% Uptime)</span>
          </div>
        </div>

        {/* Links Col 1 */}
        <div className={LAYOUT_CLASSES.footerLinksCol1}>
          <h4 className="text-xs font-bold text-slate-200 font-heading uppercase tracking-wider">Spatial Features</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#matcher" className="hover:text-cyan-400 transition-colors">3D Vibe Matcher</a></li>
            <li><a href="#lounge" className="hover:text-cyan-400 transition-colors">Spatial Audio Lounge</a></li>
            <li><a href="#feed" className="hover:text-cyan-400 transition-colors">Community Feed</a></li>
            <li><a href="#bento" className="hover:text-cyan-400 transition-colors">Neural Architecture</a></li>
          </ul>
        </div>

        {/* Links Col 2 */}
        <div className={LAYOUT_CLASSES.footerLinksCol2}>
          <h4 className="text-xs font-bold text-slate-200 font-heading uppercase tracking-wider">Developers</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">UI UX Pro Max</a></li>
            <li><a href="https://21st.dev" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors">21st.dev Registry</a></li>
            <li><a href="#mcp" className="hover:text-cyan-400 transition-colors">MCP Endpoint</a></li>
          </ul>
        </div>

        {/* Links Col 3 */}
        <div className={LAYOUT_CLASSES.footerSubscribeCol}>
          <h4 className="text-xs font-bold text-slate-200 font-heading uppercase tracking-wider">Stay Connected</h4>
          <p className="text-xs text-slate-400">Join 100K+ vibers receiving weekly spatial updates.</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email..."
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 w-full"
            />
            <button className="btn-glow-primary px-4 py-2 text-xs font-bold">
              Join
            </button>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Vibe Connect Inc. Built with 3D WebGL & AI Intelligence.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for the Spatial Web
          </span>
        </div>
      </div>
    </footer>
  );
};
