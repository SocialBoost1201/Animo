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
    <div className="min-h-screen bg-[var(--color-background)] pb-24">
      {/* Header */}
      <section className="bg-[var(--color-gray-light)] pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[#171717] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="Access" />
            </h1>
            <p className="text-gray-500 font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              アクセス・店舗情報
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <FadeIn>
              <h2 className="text-2xl font-serif text-[#171717] mb-8 tracking-widest uppercase border-b border-[var(--color-gold)] pb-4 inline-block">
                Store Info
              </h2>
              <dl className="space-y-6 text-sm md:text-base text-gray-700 font-sans">
                <div className="flex items-start">
                  <dt className="w-12 pt-1 text-[var(--color-gold)]"><MapPin className="w-5 h-5" /></dt>
                  <dd className="leading-relaxed">
                    〒231-0014<br />
                    神奈川県横浜市中区常盤町X-X-X<br />
                    アニモビル X階
                  </dd>
                </div>
                <div className="flex items-center">
                  <dt className="w-12 text-[var(--color-gold)]"><Phone className="w-5 h-5" /></dt>
                  <dd>
                    <a href="tel:045-xxxx-xxxx" className="hover:text-[var(--color-gold)] transition-colors">
                      045-XXXX-XXXX
                    </a>
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-12 pt-1 text-[var(--color-gold)]"><Clock className="w-5 h-5" /></dt>
                  <dd className="leading-relaxed">
                    20:00 - LAST<br />
                    <span className="text-xs text-gray-500">定休日：日曜日・祝日</span>
                  </dd>
                </div>
                <div className="flex items-start">
                  <dt className="w-12 pt-1 text-[var(--color-gold)]"><Train className="w-5 h-5" /></dt>
                  <dd className="leading-relaxed">
                    JR根岸線「関内駅」北口より徒歩3分<br />
                    横浜市営地下鉄「関内駅」X番出口より徒歩1分
                  </dd>
                </div>
              </dl>
            </FadeIn>

            <FadeIn delay={0.2} className="h-[400px] bg-gray-200 w-full overflow-hidden border border-gray-100 shadow-sm relative">
              {/* NOTE: Google Maps iframe would go here. Using a placeholder div for now. */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 font-sans text-sm">
                  Google Maps Iframe Placeholder<br/>
                  実際の運用時にGoogle Mapsの埋め込みタグを配置します。
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
