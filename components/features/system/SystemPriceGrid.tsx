import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';

export const SystemPriceGrid = () => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-16">
      {/* Block1: 営業時間 */}
      <FadeIn delay={0.1}>
        <div className="text-center">
          <h2 className="text-sm md:text-base font-serif text-[var(--color-gold)] uppercase luxury-tracking mb-4">
            Open Hours
          </h2>
          <p className="text-2xl md:text-3xl font-serif text-foreground tracking-widest">
            19:00 <span className="text-sm md:text-lg text-gray-400 mx-2">～</span> LAST
          </p>
        </div>
      </FadeIn>

      {/* Block2: セット料金 */}
      <FadeIn delay={0.2}>
        <h2 className="text-sm md:text-base font-serif text-[var(--color-gold)] uppercase luxury-tracking mb-8 text-center">
          Set Charge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/40 backdrop-blur-md border border-[var(--color-gold)]/20 p-8 shadow-aura flex flex-col items-center text-center">
            <h3 className="text-xl font-serif text-foreground mb-4 luxury-tracking uppercase">Member</h3>
            <p className="text-3xl font-sans text-foreground">
              ¥6,000
            </p>
          </div>
          <div className="bg-white/40 backdrop-blur-md border border-[var(--color-gold)]/20 p-8 shadow-aura flex flex-col items-center text-center">
            <h3 className="text-xl font-serif text-foreground mb-4 luxury-tracking uppercase">Visitor</h3>
            <p className="text-3xl font-sans text-foreground">
              ¥7,000
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Block3〜6: 延長・指名・同伴・TAX */}
      <FadeIn delay={0.3}>
        <div className="bg-white/40 backdrop-blur-md border border-white/20 p-8 md:p-12 shadow-aura mix-blend-multiply rounded-sm">
          <ul className="space-y-8">
            {/* 延長料金 */}
            <li className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100/50 pb-6">
              <span className="text-foreground font-serif luxury-tracking md:text-lg mb-2 md:mb-0 uppercase">Extension <span className="text-[10px] text-gray-400 ml-2">延長料金</span></span>
              <span className="text-xl md:text-2xl font-normal font-sans tracking-wide text-foreground">
                ¥3,500 <span className="text-xs font-serif text-gray-400">/ 30min</span>
              </span>
            </li>

            {/* 指名料金 */}
            <li className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100/50 pb-6">
              <div className="flex flex-col mb-2 md:mb-0">
                <span className="text-foreground font-serif luxury-tracking md:text-lg uppercase">Nomination <span className="text-[10px] text-gray-400 ml-2">指名料金</span></span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-base md:text-lg font-normal font-sans tracking-wide text-foreground flex items-center justify-between w-full md:w-auto md:gap-8">
                  <span className="text-xs font-serif text-gray-400 mr-4">本指名</span>¥3,000
                </span>
                <span className="text-base md:text-lg font-normal font-sans tracking-wide text-foreground flex items-center justify-between w-full md:w-auto md:gap-8">
                  <span className="text-xs font-serif text-gray-400 mr-4">場内指名</span>¥2,500
                </span>
              </div>
            </li>

            {/* 同伴料金 */}
            <li className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100/50 pb-6">
              <span className="text-foreground font-serif luxury-tracking md:text-lg mb-2 md:mb-0 uppercase">Accompaniment <span className="text-[10px] text-gray-400 ml-2">同伴料金</span></span>
              <span className="text-xl md:text-2xl font-normal font-sans tracking-wide text-foreground">
                ¥5,000
              </span>
            </li>

            {/* TAX / SC */}
            <li className="flex flex-col md:flex-row md:items-center justify-between pt-2">
              <span className="text-foreground font-serif luxury-tracking md:text-lg mb-2 md:mb-0 uppercase">Tax / Service Charge <span className="text-[10px] text-gray-400 ml-2">税・サービス料</span></span>
              <span className="text-xl md:text-2xl font-normal font-sans tracking-wide text-foreground">
                30%
              </span>
            </li>
          </ul>

          <div className="mt-12 text-center text-xs text-gray-500 font-serif leading-[2] luxury-tracking">
            ※当店は自動延長制となっております。
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
