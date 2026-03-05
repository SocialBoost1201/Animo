import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarHeart } from 'lucide-react';

export const metadata = {
  title: 'System | Club Animo',
  description: 'Club Animoの料金システム。明朗会計で安心してご利用いただけます。',
};

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      {/* Header Section */}
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="System" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              料金システム
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          
          <FadeIn delay={0.2} className="mb-16">
            <h2 className="text-2xl font-serif text-[#171717] mb-8 text-center tracking-widest uppercase border-b border-[var(--color-gold)] pb-4 inline-block flex flex-col items-center w-full max-w-xs mx-auto">
              Basic Charge
              <span className="text-[10px] text-gray-500 tracking-widest mt-2 uppercase font-sans">基本料金</span>
            </h2>
            
            <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[#171717] font-serif tracking-widest md:text-lg">20:00 - 20:59</span>
                  <span className="text-xl md:text-2xl font-bold font-sans">¥ 8,000 <span className="text-sm font-normal text-gray-400">/ 60min</span></span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[#171717] font-serif tracking-widest md:text-lg">21:00 - LAST</span>
                  <span className="text-xl md:text-2xl font-bold font-sans">¥ 10,000 <span className="text-sm font-normal text-gray-400">/ 60min</span></span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[#171717] font-serif tracking-widest md:text-lg">延長料金</span>
                  <span className="text-xl md:text-2xl font-bold font-sans">¥ 4,000 <span className="text-sm font-normal text-gray-400">/ 30min</span></span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[#171717] font-serif tracking-widest md:text-lg">指名料</span>
                  <span className="text-xl md:text-2xl font-bold font-sans">¥ 3,000</span>
                </div>
                <div className="flex justify-between items-center py-4 border-b border-gray-50">
                  <span className="text-[#171717] font-serif tracking-widest md:text-lg">同伴料</span>
                  <span className="text-xl md:text-2xl font-bold font-sans">¥ 5,000</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-[#171717] font-serif tracking-widest md:text-lg">TAX / SC</span>
                  <span className="text-xl md:text-2xl font-bold font-sans">20% / 10%</span>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 leading-relaxed font-sans">
                ※ 各種クレジットカード、PayPay等ご利用いただけます。<br />
                ※ SET料金にはハウスボトル（焼酎・ウイスキー）、ミネラル、アイス、チャームが含まれます。
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="mb-16">
             <h2 className="text-2xl font-serif text-[#171717] mb-8 text-center tracking-widest uppercase border-b border-[var(--color-gold)] pb-4 inline-block flex flex-col items-center w-full max-w-xs mx-auto">
              Estimate Case
              <span className="text-[10px] text-gray-500 tracking-widest mt-2 uppercase font-sans">お見積り目安</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Case 1 */}
              <div className="bg-white border border-[var(--color-gold)] p-8 rounded-sm shadow-sm relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-gold)] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1">
                  Case 01. 1名様でのご来店
                </div>
                <ul className="space-y-3 mt-4 mb-6">
                  <li className="flex justify-between text-sm"><span className="text-gray-600">SET (21:00~)</span><span className="font-sans">¥10,000</span></li>
                  <li className="flex justify-between text-sm"><span className="text-gray-600">本指名 (1名)</span><span className="font-sans">¥3,000</span></li>
                  <li className="flex justify-between text-sm"><span className="text-gray-600">小計</span><span className="font-sans">¥13,000</span></li>
                  <li className="flex justify-between text-sm text-gray-400"><span className="">TAX/SC (30%)</span><span className="font-sans">¥3,900</span></li>
                </ul>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <span className="font-serif tracking-widest text-[#171717]">Total</span>
                  <span className="text-2xl font-bold text-[var(--color-gold)] font-sans">¥16,900</span>
                </div>
              </div>

              {/* Case 2 */}
              <div className="bg-white border border-[var(--color-gold)] p-8 rounded-sm shadow-sm relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-gold)] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1">
                  Case 02. 3名様でのご来店
                </div>
                <ul className="space-y-3 mt-4 mb-6">
                  <li className="flex justify-between text-sm"><span className="text-gray-600">SET (21:00~) ×3</span><span className="font-sans">¥30,000</span></li>
                  <li className="flex justify-between text-sm"><span className="text-gray-600">本指名 (2名)</span><span className="font-sans">¥6,000</span></li>
                  <li className="flex justify-between text-sm"><span className="text-gray-600">小計</span><span className="font-sans">¥36,000</span></li>
                  <li className="flex justify-between text-sm text-gray-400"><span className="">TAX/SC (30%)</span><span className="font-sans">¥10,800</span></li>
                </ul>
                <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                  <span className="font-serif tracking-widest text-[#171717]">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[var(--color-gold)] font-sans">¥46,800</span>
                    <p className="text-[10px] text-gray-500 mt-1">1名様あたり 約¥15,600</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-gray-500 mt-6 font-sans">
              ※ キャストドリンクや別注文のボトル代は含まれておりません。<br />
              ※ 特別イベント日は料金が異なる場合がございます。
            </p>
          </FadeIn>

          <FadeIn delay={0.6} className="text-center mt-12 bg-white p-8 md:p-12 shadow-sm rounded-sm border border-gray-100">
            <h3 className="text-xl font-serif text-[#171717] mb-6">Reservation</h3>
            <p className="text-sm text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              当店は会員制ではございませんが、週末は混雑が予想されます。
              ゆったりとしたお席をご用意するため、事前のご予約をお勧めいたします。
            </p>
            <Button asChild size="lg" className="px-12">
              <Link href="/reserve">
                <CalendarHeart className="mr-2 w-5 h-5" />
                WEB予約はこちら
              </Link>
            </Button>
          </FadeIn>

        </div>
      </section>
    </div>
  );
}
