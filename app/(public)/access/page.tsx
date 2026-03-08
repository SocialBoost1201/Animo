import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { MapPin, Phone, Clock, Train, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Access | Club Animo',
  description: '関内の高級クラブ「Club Animo」へのアクセス方法・店舗情報。〒231-0012 神奈川県横浜市中区相生町3丁目53 グランドパークビル2F',
};

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* Header */}
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-foreground font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="Access" />
            </h1>
            <div className="w-[1px] h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              アクセス・店舗情報
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl">

          {/* Store Info + Map Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Left: Store Info */}
            <FadeIn>
              <h2 className="text-xl font-serif text-foreground mb-12 luxury-tracking uppercase border-b border-gold/30 pb-4 inline-block">
                Store Info
              </h2>
              <dl className="space-y-10 text-sm text-gray-600 font-serif leading-[2.2] tracking-wider">

                {/* 住所 */}
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-gold shrink-0">
                    <MapPin className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose">
                    <span className="text-[10px] text-gold uppercase luxury-tracking block mb-1">Address</span>
                    〒231-0012<br />
                    神奈川県横浜市中区相生町３丁目５３<br />
                    グランドパークビル2F
                  </dd>
                </div>

                {/* ビル・フロア */}
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-gold shrink-0">
                    <Building2 className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose">
                    <span className="text-[10px] text-gold uppercase luxury-tracking block mb-1">Building</span>
                    グランドパークビル2F
                  </dd>
                </div>

                {/* 電話番号 */}
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-gold shrink-0">
                    <Phone className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd>
                    <span className="text-[10px] text-gold uppercase luxury-tracking block mb-1">Tel</span>
                    <a href="tel:045-263-6961" className="hover:text-gold transition-colors">
                      045-263-6961
                    </a>
                  </dd>
                </div>

                {/* 営業時間 */}
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-gold shrink-0">
                    <Clock className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose">
                    <span className="text-[10px] text-gold uppercase luxury-tracking block mb-1">Open Hours</span>
                    19:00 – LAST
                  </dd>
                </div>

                {/* 最寄駅 */}
                <div className="flex items-start gap-4">
                  <dt className="pt-1 text-gold shrink-0">
                    <Train className="w-5 h-5 opacity-70" />
                  </dt>
                  <dd className="leading-loose">
                    <span className="text-[10px] text-gold uppercase luxury-tracking block mb-1">Nearest Station</span>
                    JR根岸線・横浜市営地下鉄<br />
                    <strong className="text-foreground font-serif font-normal">「関内駅」</strong>より徒歩 約5分<br />
                    <span className="text-[10px] text-gray-400 mt-1 block">Kannai Station — 5 min walk</span>
                  </dd>
                </div>

              </dl>
            </FadeIn>

            {/* Right: Google Map */}
            <FadeIn delay={0.2} className="flex flex-col gap-4">
              <div className="overflow-hidden border border-gold/20 shadow-aura rounded-sm w-full h-[420px] relative">
                <iframe
                  title="Club Animo アクセスマップ"
                  src="https://maps.google.com/maps?q=%E7%A5%9E%E5%A5%88%E5%B7%9D%E7%9C%8C%E6%A8%AA%E6%B5%9C%E5%B8%82%E4%B8%AD%E5%8C%BA%E7%9B%B8%E7%94%9F%E7%94%BA3%E4%B8%81%E7%9B%AE53+%E3%82%B0%E3%83%A9%E3%83%B3%E3%83%89%E3%83%91%E3%83%BC%E3%82%AF%E3%83%93%E3%83%AB&output=embed&hl=ja"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href="https://maps.google.com/maps?q=神奈川県横浜市中区相生町3丁目53+グランドパークビル2F"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-center text-gold font-serif luxury-tracking uppercase hover:underline transition-all"
              >
                Google Mapsで開く →
              </a>
            </FadeIn>

          </div>

          {/* Divider */}
          <div className="w-full h-[1px] bg-linear-to-r from-transparent via-gold/30 to-transparent mt-24 mb-16" />

          {/* 周辺情報（最寄駅アクセス詳細） */}
          <FadeIn delay={0.3} className="max-w-2xl mx-auto">
            <h2 className="text-xl font-serif text-foreground mb-12 luxury-tracking uppercase border-b border-gold/30 pb-4 inline-block">
              How to Access
            </h2>
            <ul className="space-y-6 text-sm text-gray-600 font-serif leading-[2.2] tracking-wider">
              <li className="flex items-start gap-4 border-b border-gray-100/50 pb-6">
                <span className="text-gold text-xl mt-1">—</span>
                <div>
                  <p className="text-foreground font-serif mb-1">
                    JR根岸線「関内駅」北口より <strong className="text-gold">徒歩 約5分</strong>
                  </p>
                  <p className="text-[11px] text-gray-400">Kannai Station (JR Negishi Line) North Exit — 5 min walk</p>
                </div>
              </li>
              <li className="flex items-start gap-4 border-b border-gray-100/50 pb-6">
                <span className="text-gold text-xl mt-1">—</span>
                <div>
                  <p className="text-foreground font-serif mb-1">
                    横浜市営地下鉄ブルーライン「関内駅」より <strong className="text-gold">徒歩 約5分</strong>
                  </p>
                  <p className="text-[11px] text-gray-400">Kannai Station (Yokohama Subway Blue Line) — 5 min walk</p>
                </div>
              </li>
              <li className="flex items-start gap-4 border-b border-gray-100/50 pb-6">
                <span className="text-gold text-xl mt-1">—</span>
                <div>
                  <p className="text-foreground font-serif mb-1">
                    みなとみらい線「馬車道駅」より <strong className="text-gold">徒歩 約6分</strong>
                  </p>
                  <p className="text-[11px] text-gray-400">Bashamichi Station (Minatomirai Line) — 6 min walk</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-gold text-xl mt-1">—</span>
                <div>
                  <p className="text-foreground font-serif mb-1">
                    みなとみらい線「日本大通り駅」より <strong className="text-gold">徒歩 約8分</strong>
                  </p>
                  <p className="text-[11px] text-gray-400">Nihon-odori Station (Minatomirai Line) — 8 min walk</p>
                </div>
              </li>
            </ul>
          </FadeIn>

        </div>
      </section>
    </div>
  );
}

