import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarHeart } from 'lucide-react';

import { SystemPriceGrid } from '@/components/features/system/SystemPriceGrid';
import { PriceSimulator } from '@/components/features/system/PriceSimulator';

import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '料金システム・相場｜関内キャバクラ CLUB Animo',
  description: '関内・馬車道エリアの高級キャバクラ「CLUB Animo」の料金システム。関内キャバクラの相場や、初めての方でも安心な明朗会計についてご案内します。',
};

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: 'SYSTEM', item: 'https://club-animo.com/system' }
      ]} />
      {/* Header Section */}
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-foreground font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="System" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
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
            <h3 className="text-xl font-serif text-foreground mb-6 luxury-tracking uppercase">Recruit</h3>
            <p className="text-xs text-gray-500 mb-10 max-w-md mx-auto leading-[2.5] font-serif luxury-tracking">
              一緒にお店を盛り上げてくれる<br/>
              キャスト・スタッフを募集しています。
            </p>
            <Button asChild size="lg" className="btn-sheen px-12">
              <Link href="/recruit/cast">
                求人情報を見る
              </Link>
            </Button>
          </FadeIn>

        </div>
      </section>
    </div>
  );
}
