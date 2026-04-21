'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BellRing, History, LayoutGrid, MapPinned, PanelLeft, Sparkles } from 'lucide-react';

import { cn } from '@/lib/utils';

const navigationItems = [
  { href: '/growth-agent', label: 'Inbox', icon: LayoutGrid },
  { href: '/growth-agent/stores', label: 'Stores', icon: MapPinned },
  { href: '/growth-agent/history', label: 'History', icon: History },
  { href: '/growth-agent/notifications', label: 'Alerts', icon: BellRing },
];

export function GrowthAgentChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f4f0e8] text-[#1b1713]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 pb-24 pt-4 md:px-6 lg:px-8 lg:pb-8">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[280px] shrink-0 overflow-hidden rounded-[32px] border border-black/5 bg-[#17130f] text-white shadow-[0_30px_80px_-50px_rgba(0,0,0,0.85)] lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-[18px] bg-[#f4efe8] text-[#17130f] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)]">
                <Sparkles className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d4b27b]">
                  AI Growth Agent
                </p>
                <h1 className="truncate text-lg font-semibold tracking-[-0.04em] text-white">
                  Operations Dashboard
                </h1>
              </div>
            </div>
          </div>

          <div className="px-4 py-4">
            <div className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
                Control mode
              </p>
              <p className="mt-2 text-sm leading-6 text-white/80">
                Owner-reviewed publishing across SEO, MEO, and GEO workflows.
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === '/growth-agent'
                  ? pathname === item.href || pathname.startsWith('/growth-agent/recommendations/')
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-[20px] px-4 py-3 text-sm font-medium transition-all',
                    active
                      ? 'bg-[#f4efe8] text-[#17130f] shadow-[0_18px_40px_-26px_rgba(0,0,0,0.7)]'
                      : 'text-white/72 hover:bg-white/8 hover:text-white'
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 px-6 py-5">
            <div className="rounded-[24px] bg-[linear-gradient(180deg,rgba(244,239,232,0.12),rgba(244,239,232,0.04))] px-4 py-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d4b27b]">
                <PanelLeft className="size-3.5" />
                UI stance
              </div>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Dense dashboard layout on desktop, same workflow depth preserved on mobile.
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-4 z-30 mb-5 rounded-[28px] border border-black/5 bg-white/88 px-4 py-4 shadow-[0_24px_60px_-40px_rgba(15,15,15,0.6)] backdrop-blur md:px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-[16px] bg-[#17130f] text-[#f4efe8] lg:hidden">
                  <Sparkles className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8d6d3f]">
                    Growth operations
                  </p>
                  <h1 className="truncate text-lg font-semibold tracking-[-0.04em] text-[#171410] md:text-xl">
                    Dashboard workspace
                  </h1>
                </div>
              </div>

              <div className="hidden items-center gap-2 sm:flex lg:hidden">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    item.href === '/growth-agent'
                      ? pathname === item.href || pathname.startsWith('/growth-agent/recommendations/')
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'inline-flex items-center justify-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium transition-all',
                        active
                          ? 'bg-[#17130f] text-white'
                          : 'bg-[#f7f2ea] text-[#4c4136] hover:bg-[#eee5d8]'
                      )}
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-40 rounded-[26px] border border-black/5 bg-white/94 p-2 shadow-[0_24px_60px_-28px_rgba(15,15,15,0.45)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/growth-agent'
                ? pathname === item.href || pathname.startsWith('/growth-agent/recommendations/')
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-2 text-[11px] font-medium transition-all',
                  active ? 'bg-[#17130f] text-white' : 'text-[#5a4d41]'
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
