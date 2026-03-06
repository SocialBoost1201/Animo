import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { GsapRevealTitle } from '@/components/motion/GsapRevealTitle';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { CalendarHeart, Phone, MapPin, CreditCard, HelpCircle, Footprints } from 'lucide-react';

export const metadata = {
  title: '初めての方へ | Club Animo',
  description: '初めてClub Animoをご利用の方へ。ご来店の流れ・料金目安・アクセス方法をご案内します。関内の高級クラブ「Club Animo」',
};

const STEPS = [
  {
    num: '01',
    title: 'ご予約（任意）',
    desc: 'WEB予約またはお電話にてご予約いただけます。\nご予約なしのご来店も歓迎しております。',
  },
  {
    num: '02',
    title: 'ご来店・受付',
    desc: 'グランドパークビルへお越しください。\nスタッフがお席までご案内いたします。',
  },
  {
    num: '03',
    title: 'お席でお楽しみください',
    desc: '選りすぐりのキャストとの会話をお楽しみください。\nお飲み物は飲み放題です。',
  },
  {
    num: '04',
    title: 'ご精算',
    desc: 'セット料金 + ご利用内容に応じたお会計となります。\nお支払い方法は各種対応しております。',
  },
];

const FAQ_ITEMS = [
  {
    q: 'どのような服装で行けばいいですか？',
    a: '特にドレスコードはございません。普段着でも問題ありませんが、清潔感ある服装でお越しいただけるとより快適にお過ごしいただけます。',
  },
  {
    q: '予約なしでも入れますか？',
    a: 'はい、ご予約なしでもご来店いただけます。ただし混雑時はお待ちいただく場合がございますので、ご予約をおすすめします。',
  },
  {
    q: '料金の目安を教えてください',
    a: 'セット料金はMember ¥6,000 / Visitor ¥7,000（60分）です。別途、指名料・延長料・TAX 30% が加算されます。詳しくは料金シミュレーターをご利用ください。',
  },
  {
    q: '年齢制限はありますか？',
    a: '20歳未満の方のご入店はお断りしております。ご入店時に年齢確認をさせていただく場合がございます。',
  },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-transparent pb-32">
      {/* Header */}
      <section className="bg-transparent pt-32 pb-16 px-6 relative">
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-foreground font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="First Visit Guide" />
            </h1>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-[var(--color-gold)] font-serif luxury-tracking text-xs md:text-sm uppercase">
              初めての方へ
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <FadeIn>
            <p className="text-sm md:text-base leading-[2.5] text-gray-500 font-serif luxury-tracking">
              Club Animoは、関内エリアの大人の社交場です。<br />
              初めてのお客様にも安心してお楽しみいただけるよう、<br />
              ご来店の流れや料金について、ご案内いたします。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ご来店の流れ */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif luxury-tracking-super text-foreground uppercase mb-4">
              <GsapRevealTitle text="Flow" />
            </h2>
            <p className="text-xs text-gray-400 font-serif luxury-tracking uppercase">ご来店の流れ</p>
          </FadeIn>

          <div className="space-y-0">
            {STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.1}>
                <div className="flex gap-6 md:gap-10 py-10 border-b border-[var(--color-gold)]/10">
                  <div className="shrink-0 w-12 md:w-16">
                    <span className="text-3xl md:text-4xl font-serif text-[var(--color-gold)]/30 font-bold">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-serif text-foreground mb-3 luxury-tracking">{step.title}</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-serif leading-[2.2] luxury-tracking whitespace-pre-line">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 料金目安 */}
      <section className="py-16 px-6 bg-[var(--color-gold)]/5">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-[var(--color-gold)]" />
              <h2 className="text-xl md:text-2xl font-serif luxury-tracking-super text-foreground uppercase">Price Guide</h2>
            </div>
            <p className="text-xs text-gray-400 font-serif luxury-tracking">料金の目安</p>
          </FadeIn>

          <FadeIn>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white p-6 border border-[var(--color-gold)]/20 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Member</p>
                <p className="text-2xl font-serif text-foreground">¥6,000<span className="text-xs text-gray-400 ml-1">/ 60分</span></p>
              </div>
              <div className="bg-white p-6 border border-[var(--color-gold)]/20 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Visitor</p>
                <p className="text-2xl font-serif text-foreground">¥7,000<span className="text-xs text-gray-400 ml-1">/ 60分</span></p>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-6 font-serif luxury-tracking">
              ※ 上記にTAX/サービス料 30% が加算されます。指名料・延長料は別途。
            </p>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/system" className="px-10 luxury-tracking font-serif text-xs uppercase">
                  料金シミュレーターで確認する
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-[var(--color-gold)]" />
              <h2 className="text-xl md:text-2xl font-serif luxury-tracking-super text-foreground uppercase">FAQ</h2>
            </div>
            <p className="text-xs text-gray-400 font-serif luxury-tracking">よくあるご質問</p>
          </FadeIn>

          <div className="space-y-0">
            {FAQ_ITEMS.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="py-8 border-b border-gray-100">
                  <h3 className="text-sm font-serif text-foreground mb-3 luxury-tracking flex items-start gap-3">
                    <span className="text-[var(--color-gold)] shrink-0 text-xs mt-0.5">Q.</span>
                    {item.q}
                  </h3>
                  <p className="text-xs text-gray-500 font-serif leading-[2.2] luxury-tracking pl-6">
                    {item.a}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3} className="mt-8 text-center">
            <Link href="/faq" className="text-xs font-serif text-[var(--color-gold)] luxury-tracking uppercase hover:underline underline-offset-4">
              その他のご質問はこちら →
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* アクセス（要約） */}
      <section className="py-16 px-6 bg-[var(--color-gold)]/5">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Footprints className="w-5 h-5 text-[var(--color-gold)]" />
              <h2 className="text-xl md:text-2xl font-serif luxury-tracking-super text-foreground uppercase">Access</h2>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="bg-white p-6 md:p-8 border border-[var(--color-gold)]/20">
              <div className="flex items-start gap-4 mb-6">
                <MapPin className="w-5 h-5 text-[var(--color-gold)] shrink-0 mt-1" />
                <div className="text-sm font-serif text-gray-600 leading-loose">
                  〒231-0012 神奈川県横浜市中区相生町３丁目５３<br />
                  グランドパークビル
                </div>
              </div>
              <div className="text-xs text-gray-500 font-serif leading-[2.2] space-y-1 pl-9">
                <p>JR根岸線「関内駅」 徒歩 約5分</p>
                <p>横浜市営地下鉄「関内駅」 徒歩 約5分</p>
                <p>みなとみらい線「馬車道駅」 徒歩 約6分</p>
                <p>みなとみらい線「日本大通り駅」 徒歩 約8分</p>
              </div>
              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link href="/access" className="px-10 luxury-tracking font-serif text-xs uppercase">詳しく見る</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 予約CTA */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-serif luxury-tracking-super text-foreground uppercase mb-6">
              Reserve
            </h2>
            <p className="text-sm text-gray-500 font-serif luxury-tracking leading-relaxed mb-10">
              ご予約・お問い合わせはこちらから。<br />
              皆様のご来店をお待ちしております。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="luxury-tracking font-medium bg-[#171717] text-white border-transparent hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)]">
                <Link href="/reserve">
                  <CalendarHeart className="mr-3 w-4 h-4" />
                  WEB予約
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="luxury-tracking font-medium border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white">
                <a href="tel:045-263-6961">
                  <Phone className="mr-3 w-4 h-4" />
                  045-263-6961
                </a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
