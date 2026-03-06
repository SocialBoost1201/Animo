import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarHeart } from 'lucide-react';

export const metadata = {
  title: 'Concept | Club Animo',
  description: '関内の大人の社交場 Club Animo。象徴的な大シャンデリアが輝く上質な空間で、極上の時間をお過ごしください。',
};

export default function ConceptPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Hero */}
      <section className="relative h-[70vh] overflow-hidden">
        <PlaceholderImage
          src="/images/chandelier.jpg"
          ratio="16:9"
          alt="Club Animo シャンデリア"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <FadeIn>
            <p className="text-[var(--color-gold)] font-serif luxury-tracking text-xs uppercase tracking-widest mb-6">
              Our Concept
            </p>
            <h1 className="text-white font-serif luxury-tracking-super text-4xl md:text-6xl uppercase mb-8">
              <GsapRevealTitle text="Club Animo" />
            </h1>
            <p className="text-white/80 font-serif luxury-tracking text-sm md:text-base max-w-lg leading-[2.5]">
              関内の大人の社交場
            </p>
          </FadeIn>
        </div>
      </section>

      {/* コンセプト本文 */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif luxury-tracking-super text-foreground uppercase mb-12">
              <GsapRevealTitle text="Concept" />
            </h2>
            <div className="w-px h-16 bg-linear-to-b from-gold to-transparent mx-auto mb-16 opacity-50" />
            <p className="text-xl md:text-2xl leading-loose font-serif mb-12 text-foreground luxury-tracking">
              煌びやかなシャンデリアの下で<br />
              特別な夜を。
            </p>
            <p className="text-sm md:text-base leading-[2.8] text-gray-500 font-serif luxury-tracking max-w-2xl mx-auto">
              Club Animoは、横浜・関内に位置する完全予約制のキャバクラです。<br />
              象徴的な大シャンデリアが輝くホールは、非日常の空間へとゲストを誘います。<br /><br />
              明るく洗練された店内で、個性豊かなキャストとともに<br />
              心ゆくまでくつろぎのひとときをお楽しみください。<br /><br />
              日常の喧騒を離れ、上質な会話と笑顔が溢れる場所。<br />
              それがClub Animoです。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 3つのキーワード */}
      <section className="py-24 px-6 bg-[#f9f7f4]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                en: 'Elegance',
                ja: '品のある空間',
                desc: '象徴的な大シャンデリアと落ち着いた内装が、格別な非日常を演出します。',
              },
              {
                en: 'Warmth',
                ja: '温かいもてなし',
                desc: '個性豊かなキャストと、きめ細やかなサービスで、心地よい時間をお届けします。',
              },
              {
                en: 'Privacy',
                ja: '安心の環境',
                desc: '完全予約制でご来店いただけます。半個室感のあるカーテンルームもご利用いただけます。',
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="bg-white p-10 border border-gold/10 text-center h-full">
                  <p className="text-[10px] text-gold font-serif luxury-tracking uppercase tracking-widest mb-3">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif luxury-tracking text-xl text-foreground mb-2">{item.en}</h3>
                  <p className="text-xs text-gold font-serif mb-6">{item.ja}</p>
                  <p className="text-xs text-gray-500 font-serif leading-[2.2] luxury-tracking">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 店内写真 */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FadeIn>
              <div className="overflow-hidden h-[300px] md:h-[400px]">
                <PlaceholderImage
                  src="/images/chandelier.jpg"
                  ratio="4:3"
                  alt="メインシャンデリア"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-xs text-gray-400 font-serif luxury-tracking mt-3 text-center">
                Main Chandelier — ホールを照らす象徴的なシャンデリア
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="overflow-hidden h-[300px] md:h-[400px]">
                <PlaceholderImage
                  src="/images/curtain_room.JPG"
                  ratio="4:3"
                  alt="カーテンルーム"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="text-xs text-gray-400 font-serif luxury-tracking mt-3 text-center">
                Curtain Room — 半個室感のあるカーテンルーム
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <FadeIn>
          <h2 className="font-serif luxury-tracking text-xl text-foreground mb-6">
            特別な夜を、Animoで。
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-12">
              <Link href="/reserve">
                <CalendarHeart className="w-4 h-4 mr-2" />
                WEB予約
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-12">
              <Link href="/guide">初めての方へ</Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
