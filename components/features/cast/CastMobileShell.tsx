'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Bell, ClipboardCheck, FileText, Home, UserRound, CalendarDays } from 'lucide-react';

type CastMobileShellProps = {
  children: ReactNode;
  showBottomNav?: boolean;
};

type CastMobileHeaderProps = {
  rightSlot?: ReactNode;
};

type CastMobileBackLinkProps = {
  href: string;
  label: string;
};

const navItems = [
  { href: '/cast/dashboard', label: 'ホーム', icon: Home, match: ['/cast/dashboard'] },
  { href: '/cast/shift', label: 'シフト', icon: CalendarDays, match: ['/cast/shift', '/cast/monthly-shift'] },
  { href: '/cast/posts', label: 'ブログ', icon: FileText, match: ['/cast/posts', '/cast/post'] },
  { href: '/cast/today', label: '今日の確認', icon: ClipboardCheck, match: ['/cast/today'] },
  { href: '/cast/profile', label: 'プロフィール', icon: UserRound, match: ['/cast/profile'] },
];

function isActivePath(pathname: string, match: string[]) {
  return match.some((candidate) => pathname === candidate || pathname.startsWith(`${candidate}/`));
}

export function CastMobileShell({ children, showBottomNav = true }: CastMobileShellProps) {
  return (
    <div className="min-h-screen bg-[#0b0d12] text-[#f7f4ed]">
      {children}
      {showBottomNav ? <CastMobileBottomNav /> : null}
    </div>
  );
}

export function CastMobileHeader({ rightSlot }: CastMobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/7 bg-[#0b0d12]/95 backdrop-blur">
      <div className="relative flex h-12 items-center justify-center px-4">
        <div className="font-serif text-[16px] font-medium tracking-[0.18em] text-[#f7f4ed]">ANIMO</div>
        {rightSlot ? <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div> : null}
      </div>
    </header>
  );
}

export function CastMobileHeaderBell({ href = '/cast/notices' }: { href?: string }) {
  return (
    <Link
      href={href}
      className="relative flex h-7 w-7 items-center justify-center rounded-full text-[#a9afbc] transition-colors hover:text-[#f7f4ed]"
      aria-label="お知らせ"
    >
      <Bell className="h-4 w-4" />
      <span className="absolute right-0.5 top-1 h-1.5 w-1.5 rounded-full bg-[#e06a6a]" />
    </Link>
  );
}

export function CastMobileBackLink({ href, label }: CastMobileBackLinkProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 text-[14px] font-medium leading-[21px] text-[#a9afbc] transition-colors hover:text-[#f7f4ed]">
      <span aria-hidden="true">‹</span>
      {label}
    </Link>
  );
}

export function CastMobileSectionTitle({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6b7280]">{eyebrow}</div>
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[28px] font-bold leading-[1.3] text-[#f7f4ed]">{title}</h1>
          {description ? <p className="text-sm leading-6 text-[#8f96a3]">{description}</p> : null}
        </div>
        {action}
      </div>
    </div>
  );
}

export function CastMobileCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`rounded-[20px] border border-white/8 bg-[#131720] card-premium-skin ${className}`.trim()}>{children}</div>;
}

function CastMobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/7 bg-[#0d0f16]/98 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] pt-1 backdrop-blur">
      <div className="mx-auto flex max-w-[422px]">
        {navItems.map((item) => {
          const active = isActivePath(pathname, item.match);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-[3px] px-2 py-[11px] text-center"
            >
              {active ? <span className="absolute top-0 h-0.5 w-7 rounded-full bg-[#c9a76a]" /> : null}
              <Icon className={`h-5 w-5 ${active ? 'text-[#c9a76a]' : 'text-[#6b7280]'}`} strokeWidth={1.8} />
              <span className={`text-[9px] tracking-[0.01em] ${active ? 'font-bold text-[#c9a76a]' : 'text-[#6b7280]'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
