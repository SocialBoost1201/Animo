import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarHeart } from 'lucide-react';

import { SystemPriceGrid } from '@/components/features/system/SystemPriceGrid';
import { PriceSimulator } from '@/components/features/system/PriceSimulator';

export const metadata = {
  title: 'System | Club Animo',
  description: 'Club Animoの料金システム。明朗会計で安心してご利用いただけます。',
};

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* Header Section */}
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-foreground font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="System" />
            </h1>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-[var(--color-gold)] font-serif luxury-tracking text-xs md:text-sm uppercase">
              料金システム
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-6">
        <div className="container mx-auto">
          
          {/* Static Price Grid */}
          <SystemPriceGrid />

          {/* Interactive Price Simulator */}
          <PriceSimulator />

          <FadeIn delay={0.6} className="text-center mt-32 mb-10 py-16 px-6 relative overflow-hidden bg-white/40 backdrop-blur-md shadow-aura border border-white/20 max-w-4xl mx-auto rounded-sm">
            <h3 className="text-xl font-serif text-foreground mb-6 luxury-tracking uppercase">Reservation</h3>
            <p className="text-xs text-gray-500 mb-10 max-w-md mx-auto leading-[2.5] font-serif luxury-tracking">
              週末は混雑が予想されます。<br/>
              ゆったりとしたお席をご用意するため、<br/>事前にご予約されることをお勧めいたします。
            </p>
            <Button asChild size="lg" className="btn-sheen px-12">
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
