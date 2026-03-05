import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { ShiftTable } from '@/components/features/shift/ShiftTable';

export const metadata = {
  title: "Today's Shift | Club Animo",
  description: 'Club Animoの出勤情報ページです。本日の出勤キャストと週間スケジュールをご確認いただけます。',
};

export default function ShiftPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      {/* Header Section */}
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="Shift" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              出勤情報
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn delay={0.2}>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto leading-loose text-sm">
              スケジュールの変更により、実際の出勤と異なる場合がございます。<br />
              確実なご指名を希望される場合は、事前にお電話やWEBからご予約をお願いいたします。
            </p>
            <ShiftTable />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
