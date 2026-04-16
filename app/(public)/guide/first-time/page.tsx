import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { Clock3, CreditCard, HelpCircle, MapPin, Phone, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: '初めての方向け来店ガイド｜関内キャバクラ CLUB Animo',
  description:
    'CLUB Animoを初めてご利用の方へ。来店の流れ、料金の見方、店内での過ごし方、アクセスまでを分かりやすくご案内します。',
  alternates: {
    canonical: 'https://club-animo.jp/guide/first-time',
  },
};

const BASE_URL = 'https://club-animo.jp';
const PAGE_URL = `${BASE_URL}/guide/first-time`;
const IMAGE_URL = `${BASE_URL}/images/animo-main-chandelier-interior.jpg`;

const FIRST_TIME_FAQS = [
  {
    question: '初めてでも一人で入れますか？',
    answer:
      'はい。お一人でご来店されるお客様も多く、スタッフがご案内からシステム説明まで丁寧に対応いたします。',
  },
  {
    question: '料金はどのくらい見ておけばよいですか？',
    answer:
      '基本のセット料金は60分で Member ¥6,000、Visitor ¥7,000 です。指名料や延長料、TAX・サービス料が加算されますので、詳しくは料金案内をご確認ください。',
  },
  {
    question: '予約なしでも入れますか？',
    answer:
      'ご予約なしでもご来店いただけます。混雑状況や当日の出勤状況を確認したい場合は、お電話にてお問い合わせください。',
  },
];

const FLOW_ITEMS = [
  {
    title: 'ご来店とご案内',
    body: '入口でスタッフがお迎えし、お席までご案内します。初めてのご来店でも落ち着いてお過ごしいただけるよう、最初のご説明から丁寧に進めます。',
  },
  {
    title: 'システム説明',
    body: 'セット料金、延長、指名、ドリンクなどの基本ルールをその場でご説明します。不明点があれば遠慮なくスタッフにお声がけください。',
  },
  {
    title: 'キャストとの時間',
    body: '雰囲気や会話を楽しみながら、CLUB Animoらしい上質な時間をお過ごしいただけます。出勤中のキャストは当日のシフトページでも確認できます。',
  },
  {
    title: 'ご精算',
    body: 'お時間終了前後にスタッフがご案内します。明朗な料金表示を大切にしており、料金の目安は事前にシミュレーターでもご確認いただけます。',
  },
];

const CHECK_POINTS = [
  {
    label: 'ご来店前に見るページ',
    value: '料金が気になる方は「料金ガイド」、出勤状況を見たい方は「本日の出勤」を先に確認するのがおすすめです。',
  },
  {
    label: '服装と雰囲気',
    value: '過度に気負う必要はありませんが、清潔感のある服装でのご来店がおすすめです。落ち着いた大人のお客様が多い空間です。',
  },
  {
    label: 'アクセス',
    value: '関内駅から徒歩約5分、馬車道駅から徒歩約6分です。初来店の際はアクセスページで建物情報まで確認すると安心です。',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${PAGE_URL}#faq`,
  url: PAGE_URL,
  name: '初めての方向け来店ガイド',
  description: metadata.description,
  image: IMAGE_URL,
  inLanguage: 'ja-JP',
  mainEntity: FIRST_TIME_FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${PAGE_URL}#breadcrumb`,
  url: PAGE_URL,
  name: '初めての方向け来店ガイド パンくず',
  description: 'CLUB Animo 初来店ガイドのパンくずリスト',
  image: IMAGE_URL,
  inLanguage: 'ja-JP',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'HOME',
      item: BASE_URL,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'GUIDE',
      item: `${BASE_URL}/guide`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '初めての方向け来店ガイド',
      item: PAGE_URL,
    },
  ],
};

export default function FirstTimeGuidePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-foreground font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="First Time Guide" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              初めての方向け来店ガイド
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="text-sm md:text-base leading-[2.5] text-gray-500 font-serif luxury-tracking">
              CLUB Animoが初めての方でも、来店前に流れを把握しておくと
              <br />
              当日の時間がより心地よくなります。
              <br />
              料金、過ごし方、アクセスまで、必要な情報を一つにまとめました。
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Visit Flow" />
            </h2>
            <p className="text-xs text-gray-400 font-serif luxury-tracking uppercase">ご来店の流れ</p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FLOW_ITEMS.map((item, index) => (
              <FadeIn key={item.title} delay={index * 0.05}>
                <div className="h-full border border-gold/15 bg-white/80 p-6 md:p-8">
                  <p className="text-gold/50 text-xs uppercase tracking-[0.25em] mb-3">
                    0{index + 1}
                  </p>
                  <h3 className="text-lg font-serif text-foreground mb-4 luxury-tracking">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-serif leading-[2.1] luxury-tracking">
                    {item.body}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gold/5">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="text-xl md:text-2xl font-serif luxury-tracking-super text-foreground uppercase">
                Before You Visit
              </h2>
            </div>
            <p className="text-xs text-gray-400 font-serif luxury-tracking">来店前に確認したいこと</p>
          </FadeIn>

          <div className="space-y-4">
            {CHECK_POINTS.map((item, index) => (
              <FadeIn key={item.label} delay={index * 0.05}>
                <div className="border border-gold/15 bg-white p-6">
                  <h3 className="text-sm font-serif text-foreground mb-2 luxury-tracking">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-500 font-serif leading-loose luxury-tracking">
                    {item.value}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2} className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline">
                <Link href="/guide/price" className="px-8 luxury-tracking font-serif text-xs uppercase">
                  料金ガイド
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/shift" className="px-8 luxury-tracking font-serif text-xs uppercase">
                  本日の出勤
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/access" className="px-8 luxury-tracking font-serif text-xs uppercase">
                  アクセス
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-gold" />
              <h2 className="text-xl md:text-2xl font-serif luxury-tracking-super text-foreground uppercase">FAQ</h2>
            </div>
            <p className="text-xs text-gray-400 font-serif luxury-tracking">初来店前のよくある質問</p>
          </FadeIn>

          <div className="space-y-0">
            {FIRST_TIME_FAQS.map((item, index) => (
              <FadeIn key={item.question} delay={index * 0.05}>
                <div className="py-8 border-b border-gray-100">
                  <h3 className="text-sm font-serif text-foreground mb-3 luxury-tracking flex items-start gap-3">
                    <span className="text-gold shrink-0 text-xs mt-0.5">Q.</span>
                    {item.question}
                  </h3>
                  <p className="text-xs text-gray-500 font-serif leading-[2.2] luxury-tracking pl-6">
                    {item.answer}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gold/5">
        <div className="container mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-serif luxury-tracking-super text-foreground uppercase mb-6">
              Ready To Visit
            </h2>
            <p className="text-sm text-gray-500 font-serif luxury-tracking leading-relaxed mb-10">
              当日の出勤やご来店前の確認事項は、
              <br />
              お電話または関連ページからご確認いただけます。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild variant="outline" size="lg" className="luxury-tracking font-medium border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white">
                <a href="tel:045-263-6961">
                  <Phone className="mr-3 w-4 h-4" />
                  045-263-6961
                </a>
              </Button>
              <Button asChild size="lg" className="btn-sheen px-10">
                <Link href="/shift">
                  <Clock3 className="mr-3 w-4 h-4" />
                  本日の出勤を見る
                </Link>
              </Button>
            </div>
            <div className="mt-6">
              <Button asChild variant="ghost" size="sm" className="text-gray-500 hover:text-gold">
                <Link href="/system">
                  <CreditCard className="mr-2 w-4 h-4" />
                  料金シミュレーターも確認する
                </Link>
              </Button>
            </div>
            <div className="mt-3">
              <Button asChild variant="ghost" size="sm" className="text-gray-500 hover:text-gold">
                <Link href="/access">
                  <MapPin className="mr-2 w-4 h-4" />
                  アクセスを見る
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
