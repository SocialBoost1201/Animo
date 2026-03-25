import * as React from 'react';

import { cn } from '@/lib/utils';

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  width?: 'narrow' | 'default' | 'wide' | 'full';
  padded?: boolean;
};

const widthClasses = {
  narrow: 'max-w-3xl',
  default: 'max-w-5xl',
  wide: 'max-w-7xl',
  full: 'max-w-none',
};

export function PageShell({
  children,
  className,
  width = 'default',
  padded = false,
}: PageShellProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        widthClasses[width],
        padded && 'px-4 py-6 md:px-6 md:py-8',
        className
      )}
    >
      {children}
    </div>
  );
}

type PageHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-[0_20px_45px_-30px_rgba(15,15,15,0.35)] backdrop-blur md:flex-row md:items-end md:justify-between md:p-7',
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="max-w-3xl text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#171717]">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-gray-500 md:text-[15px]">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'subtle' | 'accent' | 'danger';
};

const toneClasses = {
  default: 'border-black/5 bg-white',
  subtle: 'border-black/5 bg-[#fbfaf8]',
  accent: 'border-gold/20 bg-linear-to-br from-[#1d1a15] to-[#111111] text-white',
  danger: 'border-red-100 bg-red-50',
};

export function SectionCard({
  children,
  className,
  tone = 'default',
}: SectionCardProps) {
  return (
    <section
      className={cn(
        'rounded-[24px] border p-5 shadow-[0_18px_40px_-32px_rgba(15,15,15,0.45)] md:p-6',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 md:flex-row md:items-start md:justify-between', className)}>
      <div className="space-y-1">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/90">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-current md:text-xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
};

export function StatCard({ label, value, meta, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-black/5 bg-white px-4 py-4 shadow-[0_16px_34px_-30px_rgba(15,15,15,0.55)]',
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
        {label}
      </p>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#171717]">
        {value}
      </div>
      {meta ? <div className="mt-2 text-sm text-gray-500">{meta}</div> : null}
    </div>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-dashed border-black/10 bg-white/70 px-5 py-10 text-center',
        className
      )}
    >
      <p className="text-sm font-semibold text-[#171717]">{title}</p>
      {description ? <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p> : null}
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'accent';
  className?: string;
};

const statusClasses = {
  neutral: 'bg-gray-100 text-gray-600',
  success: 'bg-green-50 text-green-700',
  warning: 'bg-yellow-50 text-yellow-700',
  danger: 'bg-red-50 text-red-700',
  accent: 'bg-gold/10 text-gold',
};

export function StatusBadge({
  children,
  tone = 'neutral',
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase',
        statusClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
