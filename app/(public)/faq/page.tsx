import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Accordion } from '@/components/ui/Accordion';

export const metadata = {
  title: 'FAQ | Club Animo',
  description: 'Club Animoのご利用に関するよくある質問。初めての方でも安心してご利用いただけます。',
};

const FAQ_ITEMS = [
  {
    question: '初めての利用ですが、システムについて教えてもらえますか？',
    answer: 'ご来店時にスタッフが料金システムやお店のルールについて丁寧にご説明させていただきます。明朗会計を心がれておりますので、ご不明点がございましたらお気軽にスタッフへお尋ねください。',
  },
  {
    question: '予約は必要ですか？',
    answer: 'ご予約なしでもご案内可能ですが、週末（金曜・土曜）やイベント開催日は混雑が予想されます。お席を確実にご用意するためにも、事前のご予約をお勧めしております。WEB予約またはお電話にて承っております。',
  },
  {
    question: 'ドレスコードはありますか？',
    answer: '特に厳しいドレスコードはございませんが、スマートカジュアルを推奨しております。スウェットやジャージ、サンダル等、極度にラフな服装でのご入店はお断りさせていただく場合がございますのでご了承ください。',
  },
  {
    question: 'クレジットカードやQR決済は使えますか？',
    answer: 'はい、各種主要クレジットカード（VISA, MasterCard, JCB, AMEX, Diners）および、PayPay等のQRコード決済をご利用いただけます。',
  },
  {
    question: '領収書の発行は可能ですか？',
    answer: 'はい、お会計時にスタッフへお申し付けください。「飲食代」として発行させていただきます。手書きの領収書やインボイス対応領収書の発行も可能です。',
  },
  {
    question: '女性だけでも利用できますか？',
    answer: 'はい、女性のお客様だけでのご利用も大歓迎です。女子会や二次会など、様々なシーンでご活用ください。女性向けの特典をご用意している時期もございます。',
  },
  {
    question: '気になるキャストがいるのですが、出勤状況はどうやって確認できますか？',
    answer: '当サイトの「本日の出勤（Today\'s Shift）」ページにて当日の出勤予定キャストをご確認いただけます。また、確実なご指名の場合は事前のご予約をお勧めしております。',
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-32">
      {/* Header Section */}
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-gold font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="FAQ" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              よくある質問
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn delay={0.2} className="mb-12 text-center">
            <p className="text-sm md:text-base text-gray-600 leading-loose max-w-2xl mx-auto">
              お客様からよくいただくご質問をまとめました。<br />
              掲載されていない内容につきましては、お電話またはお問い合わせフォームよりお気軽にご連絡ください。
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            {/* Structured Data for SEO / GEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": FAQ_ITEMS.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": item.answer
                    }
                  }))
                })
              }}
            />
            
            <Accordion items={FAQ_ITEMS} />
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
