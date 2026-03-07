import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { ShiftTable } from '@/components/features/shift/ShiftTable';
import { getPublicCasts, getPublicShifts } from '@/lib/actions/public/data';

export default async function ShiftPage() {
  const [casts, shifts] = await Promise.all([
    getPublicCasts(),
    getPublicShifts(),
  ]);

  return (
    <div className="bg-white min-h-screen pt-24 pb-[var(--spacing-section)] px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 to-transparent pointer-events-none h-[50vh]" />
      <div className="container mx-auto max-w-5xl relative z-10">
        <FadeIn className="text-center mb-24">
          <h1 className="text-3xl md:text-5xl font-serif luxury-tracking-super text-[#171717] uppercase mb-6">
            Schedule
          </h1>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-6 opacity-50" />
          <p className="text-xs text-[var(--color-gold)] font-serif luxury-tracking uppercase">
            キャストの出勤スケジュール<br />
            （急な変更がある場合もございます。詳細は店舗またはご予約時にお尋ねください）
          </p>
        </FadeIn>

        <div className="bg-white shadow-luxury border-y border-[var(--color-gold)]/20 md:border md:rounded-sm overflow-hidden">
           <ShiftTable initialCasts={casts} initialShifts={shifts} />
        </div>
      </div>
    </div>
  );
}
