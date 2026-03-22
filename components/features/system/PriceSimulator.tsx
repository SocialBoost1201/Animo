'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Phone, Users } from 'lucide-react';

type CustomerType = 'member' | 'visitor';
type Duration = 60 | 90 | 120 | 150 | 180;
type Nomination = 'none' | 'inside' | 'main' | 'escort';
type Accompaniment = boolean;

// Luxury Toggle Button Component
const ToggleButton = ({ 
  active, 
  onClick, 
  children 
}: { 
  active: boolean, 
  onClick: () => void, 
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={`relative w-full px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-serif tracking-widest transition-all duration-500 overflow-hidden outline-none ${
      active 
        ? 'text-[#171717] bg-gold/90 shadow-aura' 
        : 'text-foreground/70 border border-white/20 hover:border-gold/40 bg-white/10 hover:bg-white/20'
    }`}
  >
    <span className="relative z-10">{children}</span>
    {active && (
      <motion.div
        layoutId="active-bg"
        className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent w-full h-full"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      />
    )}
  </button>
);

export const PriceSimulator = () => {
  const [customerType, setCustomerType] = useState<CustomerType>('visitor');
  const [duration, setDuration] = useState<Duration>(60);
  const [nomination, setNomination] = useState<Nomination>('none');
  const [accompaniment, setAccompaniment] = useState<Accompaniment>(false);

  // Calculation Logic
  const calculateTotal = useMemo(() => {
    // 1. Basic Charge
    const baseFee = customerType === 'member' ? 6000 : 7000;

    // 2. Extension Charge
    let extensionFee = 0;
    if (duration > 60) {
      const extensionCount = (duration - 60) / 30;
      extensionFee = extensionCount * 3500;
    }

    // 3. Nomination Charge
    let nominationFee = 0;
    if (nomination === 'inside') nominationFee = 2500;
    if (nomination === 'main') nominationFee = 3000;
    if (nomination === 'escort') nominationFee = 5000;

    // 4. Accompaniment Charge
    const accompanimentFee = accompaniment ? 5000 : 0;

    // Subtotal
    const subTotal = baseFee + extensionFee + nominationFee + accompanimentFee;

    // 5. TAX & Service Charge (display: 30%, calculation: ×1.32)
    const totalWithTax = Math.round(subTotal * 1.32);

    // 6. 1000円単位で丸め（500円以上切り上げ、499円以下切り下げ）
    const roundedTotal = Math.round(totalWithTax / 1000) * 1000;

    return roundedTotal;
  }, [customerType, duration, nomination, accompaniment]);



  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-white/40 backdrop-blur-xl border border-gold/20 p-6 md:p-12 shadow-aura mix-blend-multiply rounded-sm">
        
        <div className="space-y-12">
          {/* 来店タイプ */}
          <FadeIn delay={0.2} className="flex flex-col space-y-4">
            <span className="text-sm font-serif text-gold uppercase luxury-tracking">Customer Type <span className="text-xs text-gray-400 ml-2">来店タイプ</span></span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleButton active={customerType === 'member'} onClick={() => setCustomerType('member')}>Member</ToggleButton>
              <ToggleButton active={customerType === 'visitor'} onClick={() => setCustomerType('visitor')}>Visitor</ToggleButton>
            </div>
          </FadeIn>

          {/* 滞在時間 */}
          <FadeIn delay={0.3} className="flex flex-col space-y-4">
            <span className="text-sm font-serif text-gold uppercase luxury-tracking">Expected Duration <span className="text-xs text-gray-400 ml-2">滞在時間</span></span>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[60, 90, 120, 150, 180].map((t) => (
                <ToggleButton key={t} active={duration === t} onClick={() => setDuration(t as Duration)}>
                  {t} MIN
                </ToggleButton>
              ))}
            </div>
          </FadeIn>

          {/* 指名 */}
          <FadeIn delay={0.4} className="flex flex-col space-y-4">
            <span className="text-sm font-serif text-gold uppercase luxury-tracking">Nomination <span className="text-xs text-gray-400 ml-2">指名</span></span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ToggleButton active={nomination === 'none'} onClick={() => setNomination('none')}>なし</ToggleButton>
              <ToggleButton active={nomination === 'inside'} onClick={() => setNomination('inside')}>場内指名</ToggleButton>
              <ToggleButton active={nomination === 'main'} onClick={() => setNomination('main')}>本指名</ToggleButton>
              <ToggleButton active={nomination === 'escort'} onClick={() => setNomination('escort')}>同伴</ToggleButton>
            </div>
          </FadeIn>

          {/* 同伴 */}
          <FadeIn delay={0.5} className="flex flex-col space-y-4">
            <span className="text-sm font-serif text-gold uppercase luxury-tracking">Accompaniment <span className="text-xs text-gray-400 ml-2">同伴</span></span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleButton active={!accompaniment} onClick={() => setAccompaniment(false)}>なし</ToggleButton>
              <ToggleButton active={accompaniment} onClick={() => setAccompaniment(true)}>あり</ToggleButton>
            </div>
          </FadeIn>
        </div>

        {/* Result Area */}
        <FadeIn delay={0.6} className="mt-20 pt-16 border-t border-gold/20 text-center">
          <span className="text-sm md:text-base font-serif text-gray-500 luxury-tracking uppercase mb-4 block">Estimate Total <span className="text-xs text-gray-400 ml-2">お見積り目安</span></span>
          <div className="flex items-end justify-center gap-2 mb-4">
            <span className="text-3xl font-sans text-foreground pb-2">¥</span>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={calculateTotal}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-6xl md:text-7xl font-sans font-light tracking-tight text-foreground bg-clip-text text-transparent bg-linear-to-b from-foreground to-gray-500"
              >
                {calculateTotal.toLocaleString()}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="text-xs md:text-xs text-gray-400 font-serif option-tracking leading-[2] mb-12">
            ※ 税・サービス料（30%）込みの金額です。<br />
            ※ キャストドリンク代やボトルの別注文料金は含まれておりません。<br />
            ※ あくまで目安料金となりますので、あらかじめご了承ください。
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Button asChild size="lg" className="btn-sheen px-12 h-14 w-full md:w-auto">
              <a href="tel:045-263-6961">
                <Phone className="mr-2 w-5 h-5" />
                お電話はこちら
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-12 h-14 w-full md:w-auto bg-transparent border-white/30 hover:bg-white/10 hover:text-gold">
              <Link href="/shift">
                <Users className="mr-2 w-5 h-5" />
                本日の出勤を見る
              </Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
