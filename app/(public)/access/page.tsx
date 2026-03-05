import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { MapPin, Phone, Clock, Train } from 'lucide-react';

export const metadata = {
  title: 'Access | Club Animo',
  description: '関内の高級クラブ「Club Animo」へのアクセス方法・店舗情報。',
};

export default function AccessPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header */}
      <section className="bg-white pt-24 pb-16 px-6 border-b border-[var(--color-gold)]/20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 to-transparent pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[#171717] font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="Access" />
            </h1>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-[var(--color-gold)] font-serif luxury-tracking text-xs md:text-sm uppercase">
              アクセス・店舗情報
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <FadeIn>
              <h2 className="text-xl font-serif text-[#171717] mb-12 luxury-tracking uppercase border-b border-[var(--color-gold)]/30 pb-4 inline-block">
                Store Info
              </h2>
              <dl className="space-y-8 text-xs md:text-sm text-gray-600 font-serif leading-[2.2] tracking-wider">
                <div className="flex items-start">
                  <dt className="w-12 pt-1 text-[var(--color-gold)]"><MapPin className="w-5 h-5 mx-auto opacity-70" /></dt>
                  <dd className="leading-relaxed">
                    〒231-0014<br />
                    神奈川県横浜市中区常盤町X-X-X<br />
                    アニモビル X階
                  </dd>
                </div>
                <div className="flex items-center">
                  <dt className="w-12 text-[var(--color-gold)]"><Phone className="w-5 h-5 mx-auto opacity-70" /></dt>
                  <dd>
                    <a href="tel:045-xxxx-xxxx" className="hover:text-[var(--color-gold)] transition-colors">
                      045-XXXX-XXXX
                    </a>
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-12 pt-1 text-[var(--color-gold)]"><Clock className="w-5 h-5 mx-auto opacity-70" /></dt>
                  <dd className="leading-relaxed">
                    20:00 - LAST<br />
                    <span className="text-[10px] text-gray-400 font-serif luxury-tracking mt-2 block">定休日：日曜日・祝日</span>
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-12 pt-1 text-[var(--color-gold)]"><Train className="w-5 h-5 mx-auto opacity-70" /></dt>
                  <dd className="leading-relaxed">
                    JR根岸線「関内駅」北口より徒歩3分<br />
                    横浜市営地下鉄「関内駅」X番出口より徒歩1分
                  </dd>
                </div>
              </dl>
            </FadeIn>

            <FadeIn delay={0.2} className="h-[400px] bg-white w-full overflow-hidden border border-[var(--color-gold)]/20 shadow-luxury relative mt-8 md:mt-0">
              {/* NOTE: Google Maps iframe would go here. Using a placeholder div for now. */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-12 h-12 text-[var(--color-gold)] mb-6 opacity-30" />
                <p className="text-[10px] text-[var(--color-gold)] font-serif luxury-tracking leading-[2]">
                  Google Maps Iframe Placeholder<br/>
                  実際の運用時にGoogle Mapsの<br/>埋め込みタグを配置します。
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
