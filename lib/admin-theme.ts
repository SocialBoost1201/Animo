// ── Admin Design Tokens ────────────────────────────────────────────────────
// Shared by AdminLayout, CastForm, SettingsForm, and any admin component.

export const SIDEBAR_DARK = {
  pageBg:           'bg-[#121111]',
  sidebarBg:        'bg-black',
  sidebarBorder:    'border-white/10',
  divider:          'bg-white/5',
  sectionLabel:     'text-[#5a5650]',
  navInactive:      'text-[#8a8478] hover:bg-white/5 hover:text-[#f4f1ea]',
  navIconInactive:  'text-[#8a8478] group-hover:text-[#f4f1ea]',
  footerBorder:     'border-white/5',
  toggleWrap:       'bg-white/5 border border-white/10',
  toggleInactive:   'text-[#5a5650] hover:text-[#8a8478]',
  toggleLightActive:'bg-white/10 text-[#f4f1ea]',
  userCard:         'bg-white/5 border border-white/10',
  userName:         'text-[#c7c0b2]',
  userSub:          'text-[#5a5650]',
  primaryText:      'text-[#f4f1ea]',
  mobileHeader:     'bg-black border-white/10',
  mobileTab:        'bg-black border-white/10',
  mobileMenuBtn:    'text-[#5a5650] hover:text-[#8a8478]',
  mobileTabActive:  'text-gold',
  mobileTabInactive:'text-[#8a8478]',
};

export const SIDEBAR_LIGHT = {
  pageBg:           'bg-[#f0ece5]',
  sidebarBg:        'bg-[#faf8f4]',
  sidebarBorder:    'border-[#0000000f]',
  divider:          'bg-[#0000000a]',
  sectionLabel:     'text-[#b0a898]',
  navInactive:      'text-[#7a7268] hover:bg-[#00000008] hover:text-[#1a1710]',
  navIconInactive:  'text-[#b0a898] group-hover:text-[#1a1710]',
  footerBorder:     'border-[#0000000a]',
  toggleWrap:       'bg-[#f0ece5] border border-[#0000000f]',
  toggleInactive:   'text-[#b0a898] hover:text-[#7a7268]',
  toggleLightActive:'bg-white text-[#1a1710] shadow-sm',
  userCard:         'bg-[#f0ece5] border border-[#0000000f]',
  userName:         'text-[#2e2b26]',
  userSub:          'text-[#b0a898]',
  primaryText:      'text-[#1a1710]',
  mobileHeader:     'bg-[#faf8f4] border-[#0000000f]',
  mobileTab:        'bg-[#faf8f4] border-[#0000000f]',
  mobileMenuBtn:    'text-[#b0a898] hover:text-[#7a7268]',
  mobileTabActive:  'text-[#926f34]',
  mobileTabInactive:'text-[#b0a898]',
};

// ── Form / Page tokens ──────────────────────────────────────────────────────

export type AdminFormTokens = {
  card:        string;
  input:       string;
  label:       string;
  heading:     string;
  subtle:      string;
  divider:     string;
  snsSection:  string;
  backLink:    string;
  activeLabel: string;
  tagInactive: string;
  tagActive:   string;
  error:       string;
  noteText:    string;
};

export const FORM_DARK: AdminFormTokens = {
  card:        'bg-black/94 border border-white/10 rounded-sm shadow-2xl backdrop-blur-md',
  input:       'w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-[#f4f1ea] placeholder-[#5a5650] focus:outline-none focus:border-gold/50 transition-all outline-none',
  label:       'block text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-2',
  heading:     'text-[#f4f1ea] font-serif tracking-tight',
  subtle:      'text-[#5a5650]',
  divider:     'border-white/5',
  snsSection:  'bg-white/[0.02] border border-white/5 rounded-sm p-6 space-y-6',
  backLink:    'inline-flex items-center text-xs font-bold tracking-widest text-[#8a8478] hover:text-[#f4f1ea] transition-all group',
  activeLabel: 'text-[#f4f1ea] font-bold',
  tagInactive: 'border-white/10 text-[#8a8478] hover:border-gold/40 transition-all',
  tagActive:   'border-gold bg-gold/10 text-[#f4f1ea] shadow-[0_0_15px_rgba(223,189,105,0.1)]',
  error:       'rounded-sm border border-red-500/20 bg-red-500/5 px-4 py-3 text-[11px] font-bold tracking-wide text-red-400',
  noteText:    'text-[10px] text-[#5a5650] italic',
};

export const FORM_LIGHT: AdminFormTokens = {
  card:        'bg-[#faf8f4] border border-[#00000012] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]',
  input:       'w-full bg-white border border-[#00000018] rounded-lg px-3 py-2 text-sm text-[#2e2b26] placeholder-[#b0a898] focus:outline-none focus:border-[#926f34] transition-colors',
  label:       'block text-xs font-bold tracking-widest text-[#7a7268] uppercase mb-2',
  heading:     'text-[#1a1710]',
  subtle:      'text-[#b0a898]',
  divider:     'border-[#0000000a]',
  snsSection:  'bg-[#f0ece5] border border-[#0000000a] rounded-xl p-4 space-y-4',
  backLink:    'inline-flex items-center text-sm text-[#7a7268] hover:text-[#1a1710] transition-colors',
  activeLabel: 'text-[#1a1710]',
  tagInactive: 'border-[#00000015] text-[#7a7268] hover:border-[#926f3440]',
  tagActive:   'border-[#926f34] bg-[#926f3410] text-[#1a1710]',
  error:       'rounded-lg border border-[#d4785a40] bg-[#d4785a10] px-4 py-3 text-sm text-[#d4785a]',
  noteText:    'text-xs text-[#7a7268]',
};
