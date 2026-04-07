'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Calendar, Settings, MessageSquare,
  LogOut, Briefcase, Menu, ChevronRight, X, Bell, ClipboardList,
  UserCheck, BarChart2, Palette, BookOpen, Newspaper, Moon, Sun, List,
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';

const NAV_ITEMS = [
  // ── OVERVIEW ──────────────────────────────────────────────────────────────
  { href: '/admin/today',              icon: ClipboardList,   label: '本日の営業状況', section: 'overview' },
  { href: '/admin/dashboard',          icon: LayoutDashboard, label: 'ダッシュボード', section: 'overview' },

  // ── OPERATIONS ────────────────────────────────────────────────────────────
  { href: '/admin/human-resources',    icon: Users,           label: 'キャスト管理',   section: 'operations' },
  { href: '/admin/staffs',             icon: UserCheck,       label: 'スタッフ管理',   section: 'operations' },
  { href: '/admin/shift-requests',     icon: ClipboardList,   label: '出勤調整',       section: 'operations', badge: 'shifts' },
  { href: '/admin/monthly-shifts',     icon: Calendar,        label: 'シフト管理',     section: 'operations' },
  { href: '/admin/internal-notices',   icon: Bell,            label: '通知',           section: 'operations' },

  // ── CUSTOMER ──────────────────────────────────────────────────────────────
  { href: '/admin/customers',          icon: BookOpen,        label: '顧客データ',     section: 'customer' },

  // ── RECRUITMENT ───────────────────────────────────────────────────────────
  { href: '/admin/applications',       icon: Briefcase,       label: '求人応募',       section: 'recruitment', badge: 'applications' },

  // ── CONTENT ───────────────────────────────────────────────────────────────
  { href: '/admin/posts',              icon: MessageSquare,   label: 'キャスト投稿',   section: 'content', badge: 'posts' },
  { href: '/admin/contents',           icon: Newspaper,       label: 'ニュース',       section: 'content' },
  { href: '/admin/analytics',          icon: BarChart2,       label: 'サイト分析',     section: 'content' },

  // ── SYSTEM ────────────────────────────────────────────────────────────────
  { href: '/admin/design',             icon: Palette,         label: 'デザイン',       section: 'system' },
  { href: '/admin/settings',           icon: Settings,        label: '設定',           section: 'system', roles: ['owner', 'manager'] },
];

const SECTIONS: Record<string, string> = {
  overview:    'OVERVIEW',
  operations:  'OPERATIONS',
  customer:    'CUSTOMER',
  recruitment: 'RECRUITMENT',
  content:     'CONTENT',
  system:      'SYSTEM',
};

const BOTTOM_TAB_ITEMS = [
  { href: '/admin/today',           icon: ClipboardList,   label: '今日' },
  { href: '/admin/dashboard',       icon: LayoutDashboard, label: 'ホーム' },
  { href: '/admin/human-resources', icon: Users,           label: 'キャスト' },
  { href: '/admin/monthly-shifts',  icon: Calendar,        label: 'シフト' },
  { href: '/admin/applications',    icon: Briefcase,       label: '応募' },
];

export function AdminLayout({
  children,
  pendingPostsCount    = 0,
  pendingShiftsCount   = 0,
  pendingApplicationsCount = 0,
  role = 'staff',
}: {
  children: React.ReactNode;
  pendingPostsCount?: number;
  pendingShiftsCount?: number;
  pendingApplicationsCount?: number;
  role?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const getBadgeCount = (badge?: string) => {
    if (badge === 'posts')        return pendingPostsCount;
    if (badge === 'shifts')       return pendingShiftsCount;
    if (badge === 'applications') return pendingApplicationsCount;
    return 0;
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0e0e10] font-inter border-r border-[#ffffff0f]">
      {/* Branding */}
      <div className="h-[72px] px-5 flex items-center gap-3 shrink-0">
        <Link prefetch={false} href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-[36px] h-[36px] flex items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0 shadow-lg transition-transform hover:scale-105">
            <LayoutDashboard size={17} className="text-[#0b0b0d]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-[#5a5650] tracking-[2.2px] leading-none uppercase">CLUB ANIMO</span>
            <span className="text-[13px] font-bold bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] bg-clip-text text-transparent tracking-[1.3px] leading-none">ANIMO CMS</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden ml-auto p-1 text-[#5a5650] hover:text-[#8a8478] transition-colors"
        >
          <X size={17} />
        </button>
      </div>

      <div className="mx-4 h-px bg-[#ffffff08]" />

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto space-y-5 custom-scrollbar">
        {Object.keys(SECTIONS).map((section) => {
          const items = NAV_ITEMS.filter((i) => {
            if (i.section !== section) return false;
            const itemRoles = (i as { roles?: string[] }).roles;
            if (itemRoles && !itemRoles.includes(role)) return false;
            return true;
          });
          if (items.length === 0) return null;

          return (
            <div key={section} className="space-y-0.5">
              <div className="px-3 mb-2">
                <p className="text-[9px] font-bold tracking-[1.6px] text-[#5a5650] uppercase leading-none">
                  {SECTIONS[section]}
                </p>
              </div>

              {items.map((item) => {
                // treat /admin/shift-requests as active for that href
                const isActive = pathname === item.href ||
                  (item.href !== '/admin/dashboard' && item.href !== '/admin/today' && pathname.startsWith(item.href + '/'));
                const Icon = item.icon;
                const badgeCount = getBadgeCount((item as { badge?: string }).badge);

                return (
                  <Link
                    key={`${section}-${item.href}`}
                    href={item.href}
                    prefetch={false}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 text-xs font-medium group relative ${
                      isActive
                        ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-md shadow-[#dfbd691a]'
                        : 'text-[#8a8478] hover:bg-[#ffffff06] hover:text-[#cbc3b3]'
                    }`}
                  >
                    <Icon
                      size={13}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`shrink-0 ${isActive ? 'text-[#0b0b0d]' : 'text-[#8a8478] group-hover:text-[#cbc3b3]'}`}
                    />
                    <span className="flex-1 tracking-tight truncate">{item.label}</span>

                    {badgeCount > 0 && (
                      <div className={`flex items-center justify-center h-[16px] min-w-[16px] px-1 rounded-full text-[9px] font-bold ${
                        isActive ? 'bg-[#0b0b0d]/15 text-[#0b0b0d]' : 'bg-[#dfbd6920] text-[#dfbd69]'
                      }`}>
                        {badgeCount}
                      </div>
                    )}

                    {isActive && <ChevronRight size={10} className="opacity-50 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3.5 border-t border-[#ffffff08] space-y-3">
        {/* Mode Switch */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <List size={10} className="text-[#5a5650]" />
            <span className="text-[9px] font-bold tracking-[1.4px] text-[#5a5650] uppercase leading-none">モード選択</span>
          </div>
          <div className="flex items-center bg-[#ffffff07] rounded-[10px] border border-[#ffffff08] p-1 gap-1">
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[7px] text-[11px] font-semibold transition-all duration-150 ${
                theme === 'dark'
                  ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-sm'
                  : 'text-[#5a5650] hover:text-[#8a8478]'
              }`}
            >
              <Moon size={11} />
              ダーク
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[7px] text-[11px] font-semibold transition-all duration-150 ${
                theme === 'light'
                  ? 'bg-[#ffffff15] text-[#f4f1ea] shadow-sm'
                  : 'text-[#5a5650] hover:text-[#8a8478]'
              }`}
            >
              <Sun size={11} />
              ライト
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 bg-[#ffffff07] rounded-[11px] border border-[#ffffff08]">
          <div className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0">
            <span className="text-[10px] font-bold text-[#0b0b0d]">店</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-[#c7c0b2] truncate leading-none mb-0.5">田中 マネージャー</p>
            <p className="text-[9px] text-[#5a5650] truncate leading-none">Club Animo · 管理者</p>
          </div>
          <form action={logout}>
            <button type="submit" className="p-1.5 text-[#5a5650] hover:text-[#d4785a] transition-colors rounded-lg hover:bg-[#d4785a10]" title="ログアウト">
              <LogOut size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#121316] text-[#f4f1ea]">
      {/* Desktop Sidebar */}
      <aside className="w-[220px] flex-col hidden md:flex shrink-0 sticky top-0 h-screen">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-[220px] z-50 md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 bg-[#121316]">
        {/* Mobile Header */}
        <header className="h-14 bg-[#0e0e10] border-b border-[#ffffff0f] flex items-center justify-between px-4 md:hidden sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-[#5a5650] hover:text-[#8a8478] transition-colors"
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>
          <Link prefetch={false} href="/admin/dashboard" className="font-inter tracking-widest text-sm font-bold">
            <span className="bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] bg-clip-text text-transparent uppercase">ANIMO</span>
          </Link>
        </header>

        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0e0e10] border-t border-[#ffffff0f] pb-safe font-inter">
        <div className="flex items-center">
          {BOTTOM_TAB_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                onClick={() => setMobileOpen(false)}
                className={`flex-1 flex flex-col items-center justify-center py-3 min-h-[60px] gap-1 transition-all relative ${
                  isActive ? 'text-[#dfbd69]' : 'text-[#8a8478]'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#dfbd69] rounded-b-full" />
                )}
                <Icon size={19} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
