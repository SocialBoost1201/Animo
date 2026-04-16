'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Calendar, Settings, MessageSquare,
  LogOut, Briefcase, Menu, ChevronRight, X, Bell, ClipboardList,
  UserCheck, BarChart2, Palette, BookOpen, Newspaper, Moon, Sun, List,
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { AdminThemeProvider, useAdminTheme } from '@/components/providers/AdminThemeProvider';

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

type AdminLayoutProps = {
  children: React.ReactNode;
  pendingPostsCount?: number;
  pendingShiftsCount?: number;
  pendingApplicationsCount?: number;
  role?: string;
};

// ── AdminLayout: wraps children with theme provider ──────────────────────────
export function AdminLayout(props: AdminLayoutProps) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner {...props} />
    </AdminThemeProvider>
  );
}

function AdminLayoutInner({
  children,
  pendingPostsCount    = 0,
  pendingShiftsCount   = 0,
  pendingApplicationsCount = 0,
  role = 'staff',
}: AdminLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { T, isDark, theme, setTheme } = useAdminTheme();
  const [pendingCounts, setPendingCounts] = useState({
    pendingPostsCount,
    pendingShiftsCount,
    pendingApplicationsCount,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch('/api/admin/pending-counts', { cache: 'no-store' });
        if (!res.ok) return;
        const data = (await res.json()) as {
          pendingPostsCount?: number;
          pendingShiftsCount?: number;
        };
        if (cancelled) return;
        setPendingCounts((prev) => ({
          ...prev,
          pendingPostsCount: data.pendingPostsCount ?? prev.pendingPostsCount,
          pendingShiftsCount: data.pendingShiftsCount ?? prev.pendingShiftsCount,
        }));
      } catch {
        // ignore
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getBadgeCount = (badge?: string) => {
    if (badge === 'posts') return pendingCounts.pendingPostsCount;
    if (badge === 'shifts') return pendingCounts.pendingShiftsCount;
    if (badge === 'applications') return pendingCounts.pendingApplicationsCount;
    return 0;
  };

  const renderSidebarContent = () => (
    <div className={`flex flex-col h-full font-sans border-r transition-colors duration-200 ${T.sidebarBg} ${T.sidebarBorder}`}>
      {/* Branding */}
      <div className="h-[88px] px-6 flex items-center gap-4 shrink-0">
        <Link prefetch={false} href="/admin/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-4">
          <div className="w-[42px] h-[42px] flex items-center justify-center rounded-[12px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0 shadow-xl transition-transform hover:scale-105">
            <LayoutDashboard size={20} className="text-[#0b0b0d]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className={`text-[10px] font-bold tracking-[2.8px] leading-none uppercase ${T.sectionLabel}`}>CLUB ANIMO</span>
            <span className="text-[15px] font-bold bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] bg-clip-text text-transparent tracking-[1.5px] leading-none">ANIMO CMS</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className={`md:hidden ml-auto p-1 transition-colors ${T.mobileMenuBtn}`}
        >
          <X size={20} />
        </button>
      </div>

      <div className={`mx-6 h-px ${T.divider}`} />

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
                <p className={`text-[9px] font-bold tracking-[1.6px] uppercase leading-none ${T.sectionLabel}`}>
                  {SECTIONS[section]}
                </p>
              </div>

              {items.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/admin/dashboard' && item.href !== '/admin/today' && pathname.startsWith(item.href + '/'));
                const Icon = item.icon;
                const badgeCount = getBadgeCount((item as { badge?: string }).badge);

                return (
                  <Link
                    key={`${section}-${item.href}`}
                    href={item.href}
                    prefetch={false}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 text-xs font-medium group relative ${
                      isActive
                        ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-md shadow-[#dfbd691a]'
                        : T.navInactive
                    }`}
                  >
                    <Icon
                      size={13}
                      strokeWidth={isActive ? 2.5 : 2}
                      className={`shrink-0 ${isActive ? 'text-[#0b0b0d]' : T.navIconInactive}`}
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
      <div className={`p-3.5 border-t space-y-3 ${T.footerBorder}`}>
        {/* Mode Switch */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <List size={10} className={T.sectionLabel} />
            <span className={`text-[9px] font-bold tracking-[1.4px] uppercase leading-none ${T.sectionLabel}`}>モード選択</span>
          </div>
          <div className={`flex items-center rounded-[10px] border p-1 gap-1 ${T.toggleWrap}`}>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[7px] text-[11px] font-semibold transition-all duration-150 ${
                isDark
                  ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-sm'
                  : T.toggleInactive
              }`}
            >
              <Moon size={11} />
              ダーク
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[7px] text-[11px] font-semibold transition-all duration-150 ${
                !isDark
                  ? T.toggleLightActive
                  : T.toggleInactive
              }`}
            >
              <Sun size={11} />
              ライト
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className={`flex items-center gap-2.5 px-2.5 py-2 rounded-[11px] border ${T.userCard}`}>
          <div className="w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0">
            <span className="text-[10px] font-bold text-[#0b0b0d]">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[11px] font-semibold truncate leading-none mb-0.5 ${T.userName}`}>ANIMO CMS 管理者</p>
            <p className={`text-[9px] truncate leading-none ${T.userSub}`}>Club Animo · 管理アカウント</p>
          </div>
          <form action={logout}>
            <button type="submit" className={`p-1.5 transition-colors rounded-lg hover:bg-[#d4785a10] hover:text-[#d4785a] ${T.userSub}`} title="ログアウト">
              <LogOut size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${T.pageBg} ${T.primaryText}`}>
      {/* Desktop Sidebar */}
      <aside className="w-[260px] flex-col hidden md:flex shrink-0 sticky top-0 h-screen">
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
        className={`fixed top-0 left-0 h-full w-[260px] z-50 md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 transition-colors duration-200 ${T.pageBg}`}>
        {/* Mobile Header */}
        <header className={`h-14 border-b flex items-center justify-between px-4 md:hidden sticky top-0 z-30 ${T.mobileHeader}`}>
          <button
            onClick={() => setMobileOpen(true)}
            className={`p-2 rounded-md transition-colors ${T.mobileMenuBtn}`}
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>
          <Link prefetch={false} href="/admin/dashboard" className="font-sans tracking-widest text-sm font-bold">
            <span className="bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] bg-clip-text text-transparent uppercase">ANIMO</span>
          </Link>
        </header>

        <div className="p-6 md:p-10 lg:p-14 max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab */}
      <nav className={`fixed bottom-0 left-0 right-0 z-30 md:hidden border-t pb-safe font-inter ${T.mobileTab}`}>
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
                  isActive ? T.mobileTabActive : T.mobileTabInactive
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
