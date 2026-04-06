'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  MessageSquare,
  LogOut,
  Briefcase,
  Menu,
  ChevronRight,
  X,
  Bell,
  ClipboardList,
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';

const NAV_ITEMS = [
  { href: '/admin/today',              icon: ClipboardList,   label: '本日の営業状況', section: 'overview' },
  { href: '/admin/dashboard',          icon: LayoutDashboard, label: 'ダッシュボード', section: 'overview' },
  { href: '/admin/human-resources',    icon: Users,           label: 'キャスト管理',   section: 'operations' },
  { href: '/admin/monthly-shifts',     icon: Calendar,        label: 'シフト管理',     section: 'operations' },
  { href: '/admin/today',              icon: Calendar,        label: '来店予定',       section: 'operations' },
  { href: '/admin/posts',              icon: MessageSquare,   label: 'キャスト投稿',   badge: 'posts',         section: 'operations' },
  { href: '/admin/shift-requests',     icon: ClipboardList,   label: 'シフト提出承認', badge: 'shifts',       section: 'operations' },
  { href: '/admin/applications',       icon: Briefcase,       label: '求人応募',       badge: 'applications',  section: 'management' },
  { href: '/admin/internal-notices',   icon: Bell,            label: 'お知らせ',       section: 'management' },
  { href: '/admin/settings',           icon: Settings,        label: '設定',           section: 'management', roles: ['owner', 'manager'] },
];

const BOTTOM_TAB_ITEMS = [
  { href: '/admin/today',        icon: ClipboardList,   label: '今日' },
  { href: '/admin/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { href: '/admin/human-resources', icon: Users,        label: '人材' },
  { href: '/admin/monthly-shifts',       icon: Calendar,        label: 'シフト' },
  { href: '/admin/applications', icon: Briefcase,       label: '応募' },
];

export function AdminLayout({
  children,
  pendingPostsCount = 0,
  pendingShiftsCount = 0,
  role = 'staff',
}: {
  children: React.ReactNode;
  pendingPostsCount?: number;
  pendingShiftsCount?: number;
  role?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = ['overview', 'operations', 'management'];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0e0e10] font-inter border-r border-[#ffffff0f]">
      {/* Branding Header (Matching new-design/index.tsx:269) */}
      <div className="h-[84px] px-6 flex items-center gap-3 shrink-0">
        <Link prefetch={false} href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] flex items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0 shadow-lg transition-transform hover:scale-105">
             <LayoutDashboard size={18} className="text-[#0b0b0d]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-[#8a8478] tracking-[2.12px] leading-none uppercase">CLUB ANIMO</span>
            <span className="text-sm font-bold bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] bg-clip-text text-transparent tracking-[1.25px] leading-none">ANIMO CMS</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden ml-auto p-1 text-[#5a5650] hover:text-[#8a8478] transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mx-4.5 h-px bg-[#ffffff0f]" />

      {/* Navigation (Matching new-design/index.tsx categories) */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto space-y-7 custom-scrollbar transition-all">
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((i) => {
            if (i.section !== section) return false;
            const itemRoles = (i as { roles?: string[] }).roles;
            if (itemRoles && !itemRoles.includes(role)) return false;
            return true;
          });
          if (items.length === 0) return null;

          return (
            <div key={section} className="space-y-3.5">
              <div className="px-3 flex items-center">
                <p className="text-[9px] font-bold tracking-[1.61px] text-[#5a5650] uppercase leading-none">
                  {section === 'overview' ? 'OVERVIEW' : section === 'operations' ? 'OPERATIONS' : 'MANAGEMENT'}
                </p>
              </div>

              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  const badgeCount =
                    item.badge === 'posts' ? pendingPostsCount :
                    item.badge === 'shifts' ? pendingShiftsCount :
                    item.badge === 'applications' ? 0 : 
                    0;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={false}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-[11px] transition-all duration-200 text-xs font-medium group relative ${
                        isActive
                          ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-md shadow-[#dfbd691a]'
                          : 'text-[#8a8478] hover:bg-[#ffffff05] hover:text-[#cbc3b3]'
                      }`}
                    >
                      <div className={`w-[20px] h-[20px] flex items-center justify-center rounded-[4px] shrink-0 transition-colors ${
                        isActive ? 'text-[#0b0b0d]' : 'text-[#8a8478] group-hover:text-[#cbc3b3]'
                      }`}>
                        <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                      <span className="flex-1 tracking-tight">{item.label}</span>
                      
                      {badgeCount > 0 && (
                        <div className={`flex items-center justify-center h-[17px] min-w-[17px] px-1 rounded-lg text-[9px] font-bold ${
                          isActive ? 'bg-[#0b0b0d]/10 text-[#0b0b0d]' : 'bg-[#dfbd6924] text-[#dfbd69]'
                        }`}>
                          {badgeCount}
                        </div>
                      )}
                      
                      {isActive && <ChevronRight size={11} className="opacity-60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Area (Matching new-design/index.tsx:302) */}
      <div className="p-4 border-t border-[#ffffff0f] space-y-4">
        {/* Mode Selector (Simulated UI from Mockup) */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
             <Settings size={10} className="text-[#5a5650]" />
             <span className="text-[9px] font-bold text-[#5a5650] tracking-[1.43px] uppercase">モード選択</span>
          </div>
          <div className="flex gap-1.5 p-1 bg-[#ffffff05] rounded-[11px] border-[0.56px] border-[#ffffff0a]">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[9px] bg-[#dfbd691a] border-[0.56px] border-[#dfbd6959] text-[#dfbd69]">
              <div className="w-3 h-3 rounded-full border border-current flex items-center justify-center">
                 <div className="w-1 h-1 bg-current rounded-full" />
              </div>
              <span className="text-[10px] font-semibold">ダーク</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-[9px] text-[#8a8478] hover:text-[#cbc3b3] transition-colors">
              <span className="text-[10px] font-medium">ライト</span>
            </button>
          </div>
        </div>

        {/* User Profile (Matching new-design/index.tsx:435) */}
        <div className="p-2.5 flex items-center gap-2.5 bg-[#ffffff0a] rounded-xl border-[0.56px] border-[#ffffff0f]">
          <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] shrink-0">
             <span className="text-[11px] font-bold text-[#0b0b0d]">店</span>
          </div>
          <div className="flex-1 min-w-0 pr-1">
             <p className="text-[11px] font-medium text-[#c7c0b2] truncate leading-none mb-1">田中 マネージャー</p>
             <p className="text-[10px] text-[#8a8478] truncate leading-none">Club Animo · 管理者</p>
          </div>
          <form action={logout}>
            <button type="submit" className="p-1.5 text-[#5a5650] hover:text-red-400 transition-colors">
              <LogOut size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#121316] text-[#f4f1ea]">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="w-[249px] flex-col hidden md:flex shrink-0 sticky top-0 h-screen border-r border-[#ffffff0f]">
        {renderSidebarContent()}
      </aside>

      {/* ─── Mobile: Overlay + Drawer ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-[249px] z-50 md:hidden transition-transform duration-300 ease-out border-r border-[#ffffff0f] ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {/* ─── Main Content ─── */}
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

      {/* ─── Mobile Bottom Tab ─── */}
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
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#dfbd69] rounded-b-full shadow-[0_0_10px_rgba(223,189,105,0.5)]" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
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
