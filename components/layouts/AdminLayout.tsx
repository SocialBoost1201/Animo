'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  FileText,
  LogOut,
  UserCheck,
  Briefcase,
  Menu,
  X,
  ChevronRight,
  Bell,
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', section: 'main' },
  { href: '/admin/casts', icon: Users, label: 'キャスト管理', section: 'main' },
  { href: '/admin/shifts', icon: Calendar, label: 'シフト', section: 'main' },
  { href: '/admin/customers', icon: UserCheck, label: '顧客リスト', badge: 'contacts', section: 'crm' },
  { href: '/admin/applications', icon: Briefcase, label: '求人応募', badge: 'applications', section: 'crm' },
  { href: '/admin/inquiries', icon: MessageSquare, label: '受信箱', badge: 'all', section: 'crm' },
  { href: '/admin/contents', icon: FileText, label: 'ニュース・イベント', section: 'content' },
  { href: '/admin/gallery', icon: ImageIcon, label: 'ギャラリー', section: 'content' },
  { href: '/admin/hero', icon: ImageIcon, label: 'ヒーロー画像', section: 'content' },
  { href: '/admin/settings', icon: Settings, label: '設定', section: 'system' },
];

const SECTION_LABELS: Record<string, string> = {
  main: '管理',
  crm: '顧客・応募',
  content: 'コンテンツ',
  system: 'システム',
};

export function AdminLayout({
  children,
  unreadCount = 0,
}: {
  children: React.ReactNode;
  unreadCount?: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ルート変更でモバイルメニューを閉じる
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const sections = ['main', 'crm', 'content', 'system'];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <Link href="/admin/dashboard" className="font-serif tracking-widest text-base font-bold text-white">
          ANIMO <span className="text-gold">CMS</span>
        </Link>
        {unreadCount > 0 && (
          <div className="flex items-center gap-1">
            <Bell size={14} className="text-gold" />
            <span className="text-[11px] font-bold text-gold">{unreadCount}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((i) => i.section === section);
          return (
            <div key={section}>
              <p className="text-[9px] font-bold tracking-[0.2em] text-white/25 uppercase px-3 mb-1.5">
                {SECTION_LABELS[section]}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  const isCRM = item.section === 'crm';
                  const badgeCount = isCRM && item.badge === 'all' ? unreadCount : 0;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 text-sm group relative ${
                        isActive
                          ? 'bg-white/10 text-white border-l-2 border-gold pl-[10px]'
                          : 'text-white/50 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                      }`}
                    >
                      <Icon size={16} className={isActive ? 'text-gold' : 'text-white/40 group-hover:text-white/70'} />
                      <span className="flex-1 tracking-wide">{item.label}</span>
                      {badgeCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                          {badgeCount}
                        </span>
                      )}
                      {isActive && <ChevronRight size={14} className="text-gold/60" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
          >
            <LogOut size={16} />
            <span className="tracking-wide">ログアウト</span>
          </button>
        </form>
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white/25 hover:text-white/50 transition-colors mt-1"
        >
          <span>← サイトを表示</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f5f5f7]">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="w-60 bg-[#0f0f0f] flex-col hidden md:flex shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* ─── Mobile: Overlay + Drawer ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-[#0f0f0f] z-50 md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 min-w-0">
        {/* Mobile Header */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:hidden sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin/dashboard" className="font-serif tracking-widest text-sm font-bold">
            ANIMO <span className="text-gold">CMS</span>
          </Link>
          <div className="w-8" /> {/* spacer */}
        </header>

        {/* Desktop Header Bar */}
        <header className="h-14 bg-white border-b border-gray-100 hidden md:flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Club ANIMO</span>
            <span>/</span>
            <span className="text-[#171717] font-medium">
              {NAV_ITEMS.find((i) => pathname.startsWith(i.href))?.label ?? 'Admin'}
            </span>
          </div>
          {unreadCount > 0 && (
            <Link href="/admin/inquiries" className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 transition-colors">
              <Bell size={14} />
              <span className="font-bold">未読 {unreadCount}件</span>
            </Link>
          )}
        </header>

        {/* Page Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
