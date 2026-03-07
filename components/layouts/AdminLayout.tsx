'use client';

import React from 'react';
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
  LogOut
} from 'lucide-react';
import { logout } from '@/lib/actions/auth';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/casts', icon: Users, label: 'Casts' },
  { href: '/admin/shifts', icon: Calendar, label: 'Shifts' },
  { href: '/admin/contents', icon: FileText, label: 'News & Events' },
  { href: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { href: '/admin/hero', icon: ImageIcon, label: 'Hero Media' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminLayout({ 
  children,
  unreadCount = 0
}: { 
  children: React.ReactNode,
  unreadCount?: number
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-[#f8f9fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-gray-100 px-6">
          <Link href="/admin/dashboard" className="font-serif tracking-widest text-lg font-bold">
            ANIMO <span className="text-[var(--color-gold)]">CMS</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-colors text-sm ${
                  isActive 
                    ? 'bg-[var(--color-gray-light)] text-[var(--color-gold)] font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-[#171717]'
                }`}
              >
                <Icon size={18} />
                <span className="tracking-wide flex-1">{item.label}</span>
                {item.href === '/admin/inquiries' && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <form action={logout}>
            <button 
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="tracking-wide">Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-8 md:hidden">
           <Link href="/admin/dashboard" className="font-serif tracking-widest font-bold">
            ANIMO <span className="text-[var(--color-gold)]">CMS</span>
          </Link>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
