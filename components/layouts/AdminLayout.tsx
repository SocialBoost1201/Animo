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
  ChevronRight,
  Bell,
  X,
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard',   section: 'main' },
  { href: '/admin/casts',     icon: Users,           label: 'キャスト管理', section: 'main' },
  { href: '/admin/staffs',    icon: Users,           label: 'スタッフ管理', section: 'main', roles: ['owner', 'manager'] },
  { href: '/admin/shifts',    icon: Calendar,        label: 'シフト',       section: 'main' },
  { href: '/admin/applications', icon: Briefcase,    label: '求人応募',     badge: 'applications', section: 'crm' },
  { href: '/admin/posts',        icon: MessageSquare, label: 'キャスト投稿', badge: 'posts', section: 'content' },
  { href: '/admin/contents',  icon: FileText,        label: 'ニュース',      section: 'content' },
  { href: '/admin/gallery',   icon: ImageIcon,       label: 'ギャラリー',   section: 'content' },
  { href: '/admin/hero',      icon: ImageIcon,       label: 'ヒーロー',     section: 'content' },
  { href: '/admin/settings',  icon: Settings,        label: '設定',         section: 'system', roles: ['owner', 'manager'] },
];

const SECTION_LABELS: Record<string, string> = {
  main:    '管理',
  crm:     '顧客・応募',
  content: 'コンテンツ',
  system:  'システム',
};

const BOTTOM_TAB_ITEMS = [
  { href: '/admin/dashboard',    icon: LayoutDashboard, label: 'Home' },
  { href: '/admin/casts',        icon: Users,           label: 'キャスト' },
  { href: '/admin/shifts',       icon: Calendar,        label: 'シフト' },
  { href: '/admin/applications', icon: Briefcase,       label: '応募' },
];

export function AdminLayout({
  children,
  unreadCount = 0,
  pendingPostsCount = 0,
  role = 'staff',
}: {
  children: React.ReactNode;
  unreadCount?: number;
  pendingPostsCount?: number;
  role?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // pathnameが変わったら即座にいったん非表示（トランジション発動用）
    // NOTE: レンダリングのカスケードを防ぐため setTimeout で処理をずらす
    const tHide = setTimeout(() => setIsVisible(false), 0);
    const tShow = setTimeout(() => setIsVisible(true), 10);
    return () => {
      clearTimeout(tHide);
      clearTimeout(tShow);
    };
  }, [pathname]);

  useEffect(() => {
    // ページ遷移時にモバイルメニューを閉じる
    // NOTE: レンダリングのカスケードを防ぐため setTimeout で処理をずらす
    const t = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  const sections = ['main', 'crm', 'content', 'system'];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <Link href="/admin/dashboard" className="font-serif tracking-widest text-base font-bold text-white">
          ANIMO <span className="text-gold">CMS</span>
        </Link>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <div className="flex items-center gap-1">
              <Bell size={13} className="text-gold animate-pulse" />
              <span className="text-[11px] font-bold text-gold">{unreadCount}</span>
            </div>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-white/30 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((i) => {
            if (i.section !== section) return false;
            // 権限設定がある場合はチェック
            const itemRoles = (i as { roles?: string[] }).roles;
            if (itemRoles && !itemRoles.includes(role)) return false;
            return true;
          });
          if (items.length === 0) return null; // セクション内に表示アイテムがない場合はセクション自体を非表示

          return (
            <div key={section}>
              <p className="text-[9px] font-bold tracking-[0.2em] text-white/25 uppercase px-3 mb-1.5">
                {SECTION_LABELS[section]}
              </p>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  const badgeCount = 
                    item.badge === 'all' ? unreadCount :
                    item.badge === 'posts' ? pendingPostsCount :
                    0;

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
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white/25 hover:text-white/50 transition-colors rounded-md hover:bg-white/5"
        >
          <span>← サイトを表示</span>
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-white/40 hover:text-red-400 transition-colors rounded-md hover:bg-white/5"
          >
            <LogOut size={16} />
            <span className="tracking-wide">ログアウト</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f5f5f7] dark:bg-[#0c0c0c] dark:text-gray-100">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="w-60 bg-[#0f0f0f] flex-col hidden md:flex shrink-0 sticky top-0 h-screen">
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
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f0f0f] z-50 md:hidden transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent()}
      </aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {/* Mobile Header */}
        <header className="h-14 bg-white/80 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 md:hidden sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin/dashboard" className="font-serif tracking-widest text-sm font-bold dark:text-white">
            ANIMO <span className="text-gold">CMS</span>
          </Link>
          <Link href="/admin/inquiries" className="relative p-2" aria-label="受信箱へ">
            <Bell size={18} className="text-gray-500 dark:text-gray-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </Link>
        </header>

        {/* Desktop Header Bar */}
        <header className="h-14 bg-white/80 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/5 hidden md:flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Club ANIMO</span>
            <span>/</span>
            <span className="text-[#171717] dark:text-gray-200 font-medium">
              {NAV_ITEMS.find((i) => pathname.startsWith(i.href))?.label ?? 'Admin'}
            </span>
          </div>
          {unreadCount > 0 && (
            <Link href="/admin/inquiries" className="flex items-center gap-2 text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
              <Bell size={14} className="animate-pulse" />
              <span className="font-bold">未読 {unreadCount}件</span>
            </Link>
          )}
        </header>

        {/* Page Content with fade-in animation */}
        <div
          className="p-4 md:p-8 max-w-7xl mx-auto"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
          }}
        >
          {children}
        </div>
      </main>

      {/* ─── Mobile Bottom Tab ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-t border-gray-100 dark:border-white/5 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-none">
        <div className="flex items-center">
          {BOTTOM_TAB_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            const isInbox = item.href === '/admin/inquiries' || item.href === '/admin/applications';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors relative ${
                  isActive ? 'text-[#171717] dark:text-gold' : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold rounded-b" />
                )}
                {/* Unread badge */}
                {isInbox && unreadCount > 0 && (
                  <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
                )}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
                <span className={`text-[10px] tracking-wide ${isActive ? 'font-bold' : ''}`}>
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
