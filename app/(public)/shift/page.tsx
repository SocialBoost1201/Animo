import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { ShiftTable } from '@/components/features/shift/ShiftTable';
import { getPublicCasts, getPublicShifts } from '@/lib/actions/public/data';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: '本日の出勤情報・シフト｜関内キャバクラ CLUB Animo',
  description: '「CLUB Animo」本日の出勤キャスト一覧。関内・馬車道エリアでお探しの際はこちらから最新の出勤情報をご確認ください。',
};

export default async function ShiftPage() {
  const [casts, shifts] = await Promise.all([
    getPublicCasts(),
    getPublicShifts(),
  ]);

  return (
    <div className="bg-white min-h-screen pt-24 pb-[var(--spacing-section)] px-6 relative">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: 'SHIFT', item: 'https://club-animo.jp/shift' }
      ]} />
      <div className="absolute inset-0 bg-linear-to-b from-gold/5 to-transparent pointer-events-none h-[50vh]" />
      <div className="container mx-auto max-w-5xl relative z-10">
        <FadeIn className="text-center mb-24">
          <h1 className="text-3xl md:text-5xl font-serif luxury-tracking-super text-[#171717] uppercase mb-6">
            Schedule
          </h1>
          <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
          <p className="text-xs text-gold font-serif luxury-tracking uppercase">
            キャストの出勤スケジュール<br />
            （急な変更がある場合もございます。詳細は店舗またはご予約時にお尋ねください）
          </p>
        </FadeIn>

        <div className="bg-white shadow-luxury border-y border-gold/20 md:border md:rounded-sm overflow-hidden">
           <ShiftTable initialCasts={casts} initialShifts={shifts} />
        </div>
      </div>
    </div>
  );
}
