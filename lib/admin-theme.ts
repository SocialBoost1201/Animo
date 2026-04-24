// ── Admin Design Tokens ────────────────────────────────────────────────────
// Shared by AdminLayout, CastForm, SettingsForm, and any admin component.

export const SIDEBAR_DARK = {
  pageBg:           'bg-[#121111]',
  sidebarBg:        'bg-black',
  sidebarBorder:    'border-[#ffffff10]',
  divider:          'bg-white/5',
  sectionLabel:     'text-[#5a5650]',
  navInactive:      'text-[#8a8478] hover:bg-white/5 hover:text-[#f4f1ea]',
  navIconInactive:  'text-[#8a8478] group-hover:text-[#f4f1ea]',
  footerBorder:     'border-white/5',
  toggleWrap:       'bg-white/5 border border-[#ffffff10]',
  toggleInactive:   'text-[#5a5650] hover:text-[#8a8478]',
  toggleLightActive:'bg-white/10 text-[#f4f1ea]',
  userCard:         'bg-white/5 border border-[#ffffff10]',
  userName:         'text-[#c7c0b2]',
  userSub:          'text-[#5a5650]',
  primaryText:      'text-[#f4f1ea]',
  mobileHeader:     'bg-black border-[#ffffff10]',
  mobileTab:        'bg-black border-[#ffffff10]',
  mobileMenuBtn:    'text-[#5a5650] hover:text-[#8a8478]',
  mobileTabActive:  'text-gold',
  mobileTabInactive:'text-[#8a8478]',
};

export const SIDEBAR_LIGHT = {
  pageBg:           'bg-[#efe9e0]',                                              // ① warmer page bg
  sidebarBg:        'bg-[#f9f6f1]',
  sidebarBorder:    'border-[#00000008]',                                        // ② reduced border strength
  divider:          'bg-[#00000008]',                                            // ② softer divider
  sectionLabel:     'text-[#9a9080]',                                            // ⑤ slightly stronger section label
  navInactive:      'text-[#5a5348] hover:bg-[#0000000a] hover:text-[#1a1710]',  // ⑤ tighter inactive contrast
  navIconInactive:  'text-[#7a7268] group-hover:text-[#1a1710]',                 // ⑤ darker inactive icon
  footerBorder:     'border-[#00000008]',                                        // ② softer
  toggleWrap:       'bg-[#efe9e0] border border-[#0000000a]',                    // ② reduced
  toggleInactive:   'text-[#9a9080] hover:text-[#5a5348]',                       // ⑤ tighter
  toggleLightActive:'bg-white text-[#1a1710] shadow-sm',
  userCard:         'bg-[#efe9e0] border border-[#0000000a]',                    // ① match page bg
  userName:         'text-[#2e2b26]',
  userSub:          'text-[#9a9080]',                                            // ⑤ slightly stronger
  primaryText:      'text-[#1a1710]',
  mobileHeader:     'bg-[#f9f6f1] border-[#00000008]',
  mobileTab:        'bg-[#f9f6f1] border-[#00000008]',
  mobileMenuBtn:    'text-[#9a9080] hover:text-[#5a5348]',                       // ⑤ tighter
  mobileTabActive:  'text-[#7a5820]',                                            // ④ stronger gold active
  mobileTabInactive:'text-[#9a9080]',                                            // ⑤ tighter
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
  card:        'bg-black/94 border border-[#ffffff10] rounded-[18px] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] backdrop-blur-md',
  input:       'w-full bg-white/5 border border-[#ffffff10] rounded-[8px] px-4 py-2.5 text-sm text-[#f4f1ea] placeholder-[#5a5650] focus:outline-none focus:border-gold/50 transition-all outline-none',
  label:       'block text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase mb-2',
  heading:     'text-[#f4f1ea] font-serif tracking-tight',
  subtle:      'text-[#5a5650]',
  divider:     'border-white/5',
  snsSection:  'bg-white/[0.02] border border-white/5 rounded-[8px] p-6 space-y-6',
  backLink:    'inline-flex items-center text-xs font-bold tracking-widest text-[#8a8478] hover:text-[#f4f1ea] transition-all group',
  activeLabel: 'text-[#f4f1ea] font-bold',
  tagInactive: 'border-[#ffffff10] text-[#8a8478] hover:border-gold/40 transition-all',
  tagActive:   'border-gold bg-gold/10 text-[#f4f1ea] shadow-[0_0_15px_rgba(223,189,105,0.1)]',
  error:       'rounded-[8px] border border-red-500/20 bg-red-500/5 px-4 py-3 text-[11px] font-bold tracking-wide text-red-400',
  noteText:    'text-[10px] text-[#5a5650] italic',
};

export const FORM_LIGHT: AdminFormTokens = {
  card:        'bg-white border border-[#00000008] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.03)]', // ③ stronger surface separation
  input:       'w-full bg-white border border-[#00000012] rounded-lg px-3 py-2 text-sm text-[#2e2b26] placeholder-[#9a9080] focus:outline-none focus:border-[#7a5820] transition-colors', // ④ stronger focus gold
  label:       'block text-xs font-bold tracking-widest text-[#5a5348] uppercase mb-2', // ⑤ tighter label
  heading:     'text-[#1a1710]',
  subtle:      'text-[#9a9080]',
  divider:     'border-[#00000008]',                                             // ② softer
  snsSection:  'bg-[#f5f1ea] border border-[#00000008] rounded-xl p-4 space-y-4', // ① warmer tint
  backLink:    'inline-flex items-center text-sm text-[#5a5348] hover:text-[#1a1710] transition-colors', // ⑤ tighter
  activeLabel: 'text-[#1a1710]',
  tagInactive: 'border-[#00000010] text-[#5a5348] hover:border-[#7a582040]',    // ⑤ tighter
  tagActive:   'border-[#7a5820] bg-[#7a582010] text-[#1a1710]',                // ④ stronger gold
  error:       'rounded-lg border border-[#c0503a30] bg-[#c0503a08] px-4 py-3 text-sm text-[#c0503a]',
  noteText:    'text-xs text-[#5a5348]',                                         // ⑤ tighter
};
