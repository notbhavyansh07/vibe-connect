/**
 * VIBE CONNECT — CANONICAL LAYOUT TOKENS & SYSTEM CONTRACT
 * ============================================================================
 * SINGLE SOURCE OF TRUTH FOR ALL GRID, COLUMN, AND BREAKPOINT DECLARATIONS.
 * 
 * Rules for contributors:
 * 1. NEVER invent ad-hoc breakpoint / col-span pairs directly in components.
 * 2. Reference these canonical layout tokens and utility classes.
 * 3. All desktop 3-column splits MUST use `LAYOUT_CLASSES.dashboardGrid`.
 * 4. All 2-column bento grids MUST use `LAYOUT_CLASSES.bentoGrid2Col`.
 * ============================================================================
 */

export const BREAKPOINTS = {
  sm: 640,   // Mobile landscape / phablet
  md: 768,   // Tablet
  lg: 1024,  // Desktop 3-column split floor
  xl: 1280,  // Standard desktop
  '2xl': 1536, // Wide display / TV
} as const;

export const CONTAINER_MAX_WIDTHS = {
  dashboard: 'max-w-[1600px]',
  landingSection: 'max-w-6xl',
  bentoGrid: 'max-w-5xl',
  textHeader: 'max-w-2xl',
  modal: 'max-w-lg',
} as const;

export const LAYOUT_CLASSES = {
  // Top-Level Dashboard 3-Column Split (3 Cols Left / 6 Cols Center / 3 Cols Right)
  dashboardContainer: 'max-w-[1600px] mx-auto px-4 lg:px-8 pb-12',
  dashboardGrid: 'grid grid-cols-1 lg:grid-cols-12 gap-6 items-start',
  dashboardLeftRail: 'hidden lg:block lg:col-span-3',
  dashboardCenterMain: 'col-span-1 lg:col-span-6 space-y-8 min-w-0',
  dashboardRightRail: 'hidden lg:block lg:col-span-3',

  // Landing Bento 2-Column Grid (2x2 equal height cards)
  bentoSection: 'border-t border-white/10 bg-slate-950/70 py-20 px-4 lg:px-8',
  bentoGrid2Col: 'grid-bento-2col grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch',
  bentoCard: 'glass-card p-8 relative overflow-hidden flex flex-col justify-between h-full group hover:border-cyan-400/50 transition-all duration-300 border border-white/10 bg-slate-900/60',

  // Telemetry 3-Column Stats
  statsGrid3Col: 'pt-6 grid grid-cols-3 gap-3',

  // Soundstage Channel Selector (2 cols on mobile, 4 cols on tablet/desktop)
  loungeChannelsGrid: 'grid grid-cols-2 sm:grid-cols-4 gap-3',

  // Matcher Control Deck Split (7 cols Faders / 5 cols Radar on Desktop)
  matcherDeckGrid: 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-center',
  matcherFadersCol: 'lg:col-span-7 space-y-5',
  matcherRadarCol: 'lg:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20',

  // Horizontal Story Circles Row
  storiesRow: 'p-3 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center gap-4 overflow-x-auto no-scrollbar',

  // Footer Responsive Multi-Column Grid (5 cols / 2 cols / 2 cols / 3 cols)
  footerGrid: 'max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-12',
  footerBrandCol: 'md:col-span-5 space-y-4',
  footerLinksCol1: 'md:col-span-2 space-y-3',
  footerLinksCol2: 'md:col-span-2 space-y-3',
  footerSubscribeCol: 'md:col-span-3 space-y-3',
} as const;
