'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight, CheckCircle2, Phone, Instagram,
  ChevronDown, ChevronUp, CalendarHeart, Star, MapPin
} from 'lucide-react';
import { submitRecruitApplication } from '@/lib/actions/public/submit';
import { RecruitTable, RecruitTableData, RecruitTag } from '@/components/features/recruit/RecruitTable';

// ─── データ定義 ────────────────────────────────────────────────

const MERITS = [
  {
    title: '圧倒的な高待遇',
    desc: '体験入店の時給から高額保証。指名・ドリンク・ボトルのバックも充実。頑張りをしっかり還元します。',
    note: '体入時給 保証あり',
  },
  {
    title: '未経験者歓迎',
    desc: 'お酒の作り方から会話の極意まで、事前研修を丁寧にご用意。ノルマ・強制は一切ありません。',
    note: '研修制度あり',
  },
  {
    title: '自由シフト制',
    desc: '週1回・1日3時間〜OK。学生・Wワーク・扶養内希望の方も、自分のペースで無理なく働けます。',
    note: '週1日〜 / 3h〜',
  },
];

const BENEFITS = [
  '送迎完備（終電後もOK）',
  '学生・Wワーク歓迎',
  '研修制度あり（未経験歓迎）',
  '個人ロッカー・更衣室完備',
  '女性専用トイレ完備',
];

const VOICES = [
  {
    name: 'ゆい',
    age: 22,
    period: '在籍1年',
    text: '最初は不安でしたが、スタッフさんが親切に教えてくれて、すぐに慣れました。お客様もみなさん紳士的で、安心して働けています。',
  },
  {
    name: 'りな',
    age: 20,
    period: '在籍6ヶ月',
    text: 'Wワークでも働きやすくて、週2〜3で入れています。バックの率が良いので、他のお店より稼げています。',
  },
  {
    name: 'みく',
    age: 24,
    period: '在籍2年',
    text: 'ノルマが一切ないので、自分のペースで楽しく働けています。スタッフとの仲が良く、アットホームな雰囲気が気に入っています。',
  },
];

const TRIAL_STEPS = [
  { step: '01', title: 'WEB応募または電話', desc: 'フォームまたはお電話から。お名前と電話番号のみでOKです。' },
  { step: '02', title: '採用担当よりご連絡', desc: '2営業日以内にLINEまたはお電話でご連絡いたします。' },
  { step: '03', title: '面接', desc: '関内の店舗またはご希望の場所で。気になることを何でもご質問ください。' },
  { step: '04', title: '体験入店', desc: '実際の雰囲気を体感。当日の時給は全額日払いでお渡しします。' },
  { step: '05', title: '本入店', desc: 'シフトはご自身のペースで決めていただけます。' },
];

const FAQ_ITEMS = [
  { q: '未経験でも大丈夫ですか？', a: 'はい、経験は不問です。事前研修でお酒の作り方や接客マナーをお伝えします。まずはお気軽にご応募ください。' },
  { q: 'ノルマはありますか？', a: '強制同伴・アフター・ノルマは一切ありません。繁盛店ですので自然と指名が増える環境です。' },
  { q: '時給・収入の目安は？', a: '体験入店は時給保証あり。本入店後は時給＋各種バック（指名・ドリンク・ボトル）が加算されます。' },
  { q: 'お客様層はどのような方ですか？', a: '関内エリアという土地柄、上場企業の経営者・士業・医師など紳士的なお客様が多くいらっしゃいます。' },
  { q: 'タトゥーがあっても働けますか？', a: '小さめのものや見えない箇所であれば問題ありません。詳しくは面接時にご相談ください。' },
  { q: 'ドレスは自分で用意しますか？', a: '店舗にドレスをご用意していますので、手ぶらでお越しいただけます。体験入店も手ぶらでOKです。' },
  { q: '送りは毎回ありますか？', a: 'はい、毎回スタッフが送迎いたします。終電を過ぎた時間でも安心してください。' },
  { q: '学生・Wワークでも大丈夫ですか？', a: '週1日・3時間〜の勤務が可能です。扶養内希望の方も歓迎します。' },
];

const CAST_POINTS = [
  'ノルマ・強制一切なし',
  '週1日・3時間〜の出勤でもOK',
  '終電上がりOK・遅出出勤OK',
  '体験入店は2回まで可能（当日日払い）',
  'お酒が飲めなくてもOK（ノンアルコール対応あり）',
  'ドレス・ロッカー無料完備',
  '安心の毎回送迎完備',
  'スマホ応募OK・履歴書不要（要身分証）',
];

const RECRUIT_DETAILS_DATA: RecruitTableData[] = [
  { label: '仕事内容', value: 'フロアレディ（キャスト）', subColumn: { label: 'エリア', value: '関内' } },
  { label: '給与', value: '時給 4,000円〜 + 各種バック\n※経験や能力により優遇いたします。\n■日払い可（規定あり）\n■体験入店時の時給保証あり\n■ノルマ一切なし' },
  { label: '応募条件', value: '18歳以上（高校生不可）\n【未経験者・経験者ともに大歓迎！】\n■学生・Wワークの方、フリーターの方歓迎\n■お酒が飲めなくてもOK\n■友達同士の応募も歓迎' },
  { label: '勤務時間', value: '20:00〜LAST\n（週1日・3時間〜OK）\n※シフトは完全自由の自己申告制\n※終電上がりOK、遅出出勤OK' },
];

const RECRUIT_DETAILS_TAGS: RecruitTag[] = [
  { label: '日払い可', active: true },
  { label: '帰送車あり', active: true },
  { label: 'シフト自由', active: true },
  { label: 'ノルマなし', active: true },
  { label: '1日体験入店あり', active: true },
  { label: '昇給随時あり', active: true },
  { label: 'お酒飲めなくても可', active: true },
  { label: '友達同士で勤務可', active: true },
  { label: '未経験者歓迎', active: true },
  { label: 'Wワーク歓迎', active: true },
  { label: '寮紹介あり', active: false },
  { label: '託児所紹介あり', active: false },
  { label: '駅近', active: true },
  { label: '短期可', active: true },
  { label: '手ぶら出勤可', active: true },
];

// ─── メインコンポーネント ──────────────────────────────────────

export default function CastRecruitPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    formData.append('type', 'cast');
    const result = await submitRecruitApplication(formData);
    setIsSubmitting(false);
    if (result.error) {
      setErrorMessage(result.error);
    } else {
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white pb-32 flex items-center justify-center pt-32">
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-luxury border border-gold/20 relative">
          <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="text-xl font-serif text-foreground mb-6 luxury-tracking">ご応募ありがとうございます</h2>
          <p className="text-gray-500 mb-10 leading-[2.5] font-serif luxury-tracking text-xs">
            入力いただいた情報が送信されました。<br />
            2営業日以内に採用担当よりご連絡いたします。
          </p>
          <Button asChild className="px-10 text-xs font-serif luxury-tracking">
            <a href="/">トップページへ戻る</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ① Hero */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <PlaceholderImage
          ratio="16:9"
          alt="Recruit Hero"
          placeholderText="Elegant Chandelier"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-white" />
        <div className="relative z-10 text-center px-6">
          <FadeIn>
            <p className="text-gold font-serif luxury-tracking text-xs uppercase tracking-widest mb-4">
              Cast Recruit
            </p>
            <h1 className="text-gold font-serif text-4xl md:text-6xl lg:text-7xl luxury-tracking-super mb-4 drop-shadow-md">
              <RevealText text="CAST RECRUIT" />
            </h1>
            <p className="text-white font-serif luxury-tracking text-xs md:text-sm drop-shadow mb-10">
              もっと輝く、新しい私へ。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" className="px-10 py-5 text-xs font-serif luxury-tracking uppercase bg-white text-foreground hover:bg-white/90">
                <a href="#form">
                  <CalendarHeart className="w-4 h-4 mr-2" />
                  今すぐWEB応募
                </a>
              </Button>
              <a
                href="tel:045-263-6961"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/60 text-white font-serif luxury-tracking text-xs uppercase hover:bg-white/10 transition-colors"
              >
                <Phone className="w-4 h-4" />
                電話で相談
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ② 待遇ハイライト（数字で明示） */}
      <section className="py-16 px-6 bg-foreground text-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-white/10">
            {[
              { label: '体験入店', value: '時給保証', unit: '日払いOK' },
              { label: 'シフト', value: '週1日〜', unit: '3時間〜OK' },
              { label: '同伴・アフター', value: 'ノルマ', unit: '一切なし' },
              { label: '送り', value: '毎回完備', unit: '終電後もOK' },
            ].map((item, i) => (
              <div key={i} className="text-center py-6 px-4">
                <p className="text-gold font-serif text-[10px] luxury-tracking uppercase mb-2">{item.label}</p>
                <p className="text-white font-serif text-xl md:text-2xl luxury-tracking mb-1">{item.value}</p>
                <p className="text-white/50 font-serif text-[10px] luxury-tracking">{item.unit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 選ばれる理由 */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
            <h2 className="text-xl md:text-2xl font-serif text-foreground mb-4 luxury-tracking uppercase">
              Club Animo が選ばれる理由
            </h2>
            <div className="w-12 h-px bg-gold mx-auto mb-10" />
            <p className="text-gray-600 font-serif leading-[2.5] luxury-tracking text-xs md:text-sm">
              関内エリアトップクラスの集客力と、落ち着いた紳士的なお客様層。<br />
              未経験の方でも安心してスタートできるよう、専属スタッフが徹底サポートします。<br />
              あなたの魅力を最大限に引き出し、確かな収入へと繋げます。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ④ 3つのメリット */}
      <section className="py-16 px-6 bg-white border-y border-gold/20 relative">
        <div className="absolute inset-0 bg-linear-to-b from-gold/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MERITS.map((merit, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="bg-white p-8 md:p-10 text-center shadow-luxury border border-gold/20 relative hover:-translate-y-2 transition-all duration-700 h-full">
                  <div className="w-14 h-14 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-gold w-6 h-6" />
                  </div>
                  <p className="text-[10px] text-gold font-serif luxury-tracking uppercase mb-2">{merit.note}</p>
                  <h3 className="font-serif text-base mb-4 text-foreground luxury-tracking">{merit.title}</h3>
                  <p className="font-serif text-xs text-gray-500 leading-[2.5] luxury-tracking">{merit.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 特典リスト */}
      <section className="py-24 px-6 bg-[#f9f7f4]">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-foreground mb-3">Benefits</h2>
            <p className="text-xs text-gold font-serif luxury-tracking">充実した待遇・環境</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BENEFITS.map((b, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 border border-gold/10">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span className="text-xs font-serif luxury-tracking text-gray-600">{b}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑥ 在籍キャストの声 */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-foreground mb-3">Cast Voice</h2>
            <p className="text-xs text-gold font-serif luxury-tracking">在籍キャストの声</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VOICES.map((voice, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#f9f7f4] p-8 border border-gold/10 h-full">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 font-serif leading-[2.5] luxury-tracking mb-6">
                    &ldquo;{voice.text}&rdquo;
                  </p>
                  <div className="border-t border-gold/20 pt-4">
                    <p className="font-serif text-sm text-foreground luxury-tracking">{voice.name}</p>
                    <p className="text-[10px] text-gray-400 font-serif luxury-tracking">{voice.age}歳 / {voice.period}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥.5 ここがポイント！ */}
      <section className="py-16 px-6 bg-[#fffdf8] border-y border-gold/20">
        <div className="container mx-auto max-w-4xl">
          <FadeIn>
            <div className="text-center mb-10">
              <span className="inline-block text-[10px] font-serif tracking-widest uppercase text-gold border border-gold/40 px-4 py-1.5 mb-4">
                Point
              </span>
              <h2 className="text-xl md:text-2xl font-serif luxury-tracking text-foreground">ここがポイント！</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CAST_POINTS.map((point, i) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-gold/15 px-5 py-4 shadow-sm">
                  <span className="text-gold font-serif text-base leading-none shrink-0 mt-0.5">★</span>
                  <span className="text-sm font-serif leading-relaxed luxury-tracking text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑦ 募集要項 */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <RecruitTable title="募集要項" data={RECRUIT_DETAILS_DATA} tags={RECRUIT_DETAILS_TAGS} />
          </FadeIn>
        </div>
      </section>

      {/* ⑦ 応募の流れ */}
      <section className="py-24 px-6 bg-[#f9f7f4]">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-foreground mb-3">Flow</h2>
            <p className="text-xs text-gold font-serif luxury-tracking">応募から入店まで</p>
          </FadeIn>
          <div className="space-y-4">
            {TRIAL_STEPS.map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="flex gap-6 items-start bg-white p-6 border border-gold/10">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-serif text-gold luxury-tracking">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-sm text-foreground luxury-tracking mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-serif leading-[2.2] luxury-tracking">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ⑧ Q&A */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-foreground mb-3">FAQ</h2>
            <p className="text-xs text-gold font-serif luxury-tracking">よくあるご質問</p>
          </FadeIn>
          <div className="divide-y divide-gray-100">
            {FAQ_ITEMS.map((item, i) => (
              <FadeIn key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left py-6 flex items-start justify-between gap-4 hover:text-gold transition-colors group"
                >
                  <span className="flex items-start gap-3">
                    <span className="text-gold font-serif text-xs luxury-tracking shrink-0 mt-0.5">Q.</span>
                    <span className="font-serif text-sm text-foreground luxury-tracking group-hover:text-gold transition-colors">{item.q}</span>
                  </span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                  }
                </button>
                {openFaq === i && (
                  <div className="pb-6 pl-6">
                    <p className="text-xs text-gray-500 font-serif leading-[2.5] luxury-tracking">{item.a}</p>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ⑨ 複数CTA */}
      <section className="py-16 px-6 bg-foreground text-white text-center">
        <FadeIn>
          <p className="text-gold font-serif luxury-tracking text-xs uppercase tracking-widest mb-4">Contact</p>
          <h2 className="text-2xl md:text-3xl font-serif luxury-tracking-super mb-8">まずはお気軽にご連絡ください</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <a
              href="#form"
              className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-gold text-white font-serif luxury-tracking text-xs uppercase hover:bg-white hover:text-foreground transition-all duration-300"
            >
              <CalendarHeart className="w-4 h-4" />
              WEBで今すぐ応募
            </a>
            <a
              href="tel:045-263-6961"
              className="flex-1 inline-flex items-center justify-center gap-2 py-4 border border-white/40 text-white font-serif luxury-tracking text-xs uppercase hover:bg-white/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              電話で相談（無料）
            </a>
            <a
              href="https://ig.me/m/kannai_club_animo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-4 border border-white/40 text-white font-serif luxury-tracking text-xs uppercase hover:bg-white/10 transition-colors"
            >
              <Instagram className="w-4 h-4" />
              DMで相談
            </a>
          </div>
        </FadeIn>
      </section>

      {/* ⑩ 応募フォーム */}
      <section id="form" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4 luxury-tracking uppercase">
              Web Application
            </h2>
            <p className="text-gold font-serif text-xs luxury-tracking mb-4">WEB応募フォーム</p>
            <p className="text-gray-500 font-serif text-xs leading-[2.5] luxury-tracking">
              気になることやご質問だけでも構いません。<br />お気軽にご応募ください。
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-white p-8 md:p-16 shadow-luxury border-y border-gold/20 md:border md:rounded-sm relative">
            {errorMessage && (
              <div className="mb-8 p-4 bg-red-50/50 text-red-600 text-xs font-serif luxury-tracking border border-red-100 text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <label htmlFor="name" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">
                  お名前 <span className="text-gold ml-1">*</span>
                </label>
                <input required id="name" name="name" type="text"
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none"
                  placeholder="山田 花子" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label htmlFor="age" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">
                    年齢 <span className="text-gold ml-1">*</span>
                  </label>
                  <input required id="age" name="age" type="number" min="20"
                    className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none"
                    placeholder="20" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">
                    電話番号 <span className="text-gold ml-1">*</span>
                  </label>
                  <input required id="phone" name="phone" type="tel"
                    className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none"
                    placeholder="090-1234-5678" />
                </div>
              </div>

              {/* Email & LINE ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="email" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">
                    メールアドレス <span className="text-gold ml-1">*</span>
                  </label>
                  <input required id="email" name="email" type="email"
                    className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none"
                    placeholder="example@gmail.com" />
                </div>
                <div>
                  <label htmlFor="lineId" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">
                    LINE ID <span className="text-gray-400 text-[10px] ml-1 normal-case">(任意)</span>
                  </label>
                  <input id="lineId" name="lineId" type="text"
                    className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none"
                    placeholder="@your_line_id" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-serif luxury-tracking text-foreground mb-4 uppercase">ナイトワーク経験</label>
                <div className="flex gap-8">
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-serif luxury-tracking text-gray-500 hover:text-gold transition-colors">
                    <input type="radio" name="experience" value="未経験" className="accent-gold scale-110" defaultChecked />
                    初心者・未経験
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer text-xs font-serif luxury-tracking text-gray-500 hover:text-gold transition-colors">
                    <input type="radio" name="experience" value="経験あり" className="accent-gold scale-110" />
                    経験あり
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">ご質問・ご要望</label>
                <textarea id="message" name="message" rows={4}
                  className="w-full bg-gray-50/30 border border-gray-200 p-4 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none resize-none"
                  placeholder="シフトの希望や、気になることがあればご記入ください" />
              </div>

              <div className="pt-6 text-center">
                <Button type="submit" disabled={isSubmitting} size="lg"
                  className="w-full md:w-auto md:min-w-[300px] text-xs font-serif luxury-tracking uppercase px-12 py-4">
                  {isSubmitting ? 'Sending...' : '応募して面接に進む'}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 ml-4 font-light" />}
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
