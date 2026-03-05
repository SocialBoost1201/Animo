import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { ShiftTable } from '@/components/features/shift/ShiftTable';

export default async function ShiftPage() {
  // Client Componentである ShiftTable 内でデータフェッチを行う構成にする（要件に応じて適宜選定可能）
  // 今回はUI/UX側をリッチにするためShiftTable側にAPI取得を委譲した設計とする。
  // (もしここでServerから流し込む場合は getWeeklyShifts() を利用)

  return (
    <div className="bg-[var(--color-gray-light)] min-h-screen pt-24 pb-[var(--spacing-section)] px-6">
      <div className="container mx-auto max-w-5xl">
        <FadeIn className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif tracking-widest text-[#171717] uppercase mb-4">
            Schedule
          </h1>
          <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-6" />
          <p className="text-sm text-gray-500 font-sans tracking-wide">
            キャストの出勤スケジュール<br />
            （急な変更がある場合もございます。詳細は店舗またはご予約時にお尋ねください）
          </p>
        </FadeIn>

        {/* 出勤表コンポーネント (現在Client側でモックデータが動いているため、DBデータに繋ぎ替える) */}
        <div className="bg-white shadow-sm border border-gray-100 rounded-sm overflow-hidden">
           <ShiftTable />
        </div>
      </div>
    </div>
  );
}
