'use client'

import React, { useState } from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight, CheckCircle2, Phone, Instagram,
  ChevronDown, ChevronUp, CalendarHeart, Briefcase,
  Users, User, MapPin
} from 'lucide-react';
import { submitRecruitApplication } from '@/lib/actions/public/submit';
import { RecruitTable, RecruitTableData, RecruitTag } from '@/components/features/recruit/RecruitTable';

// ─── データ定義 ────────────────────────────────────────────────

const POSITIONS = {
  staff: {
    tab: 'スタッフ',
    sub: '店長候補・社員・アルバイト',
    icon: Briefcase,
    hero: '関内トップクラスの店舗で、あなたの実力を試しませんか。',
    roles: [
      {
        badge: '店長候補',
        title: '店長候補・マネージャー（正社員）',
        duties: 'キャストのシフト管理・指導・接客マネジメント・売上管理全般',
        salary: '月給 30万円〜 / 能力考慮',
        conditions: [
          '未経験可（業界経験者優遇）',
          '月給30万円〜（スタート）',
          'インセンティブ・昇給あり',
          '残業手当あり',
        ],
      },
      {
        badge: '社員',
        title: 'ホールスタッフ（正社員）',
        duties: 'お客様へのドリンク・フード対応、フロアオペレーション、キャストサポート',
        salary: '月給 25万円〜',
        conditions: [
          '未経験者大歓迎',
          '月給25万円〜',
          '昇給あり',
        ],
      },
      {
        badge: 'アルバイト',
        title: 'ホールスタッフ（アルバイト）',
        duties: 'ドリンク・フード対応、フロアサポート業務',
        salary: '1,400円〜（研修期間あり）/ 週1日・3h〜',
        conditions: [
          '週1日・3時間〜OK',
          '1,400円〜（研修期間あり）',
          '学生・Wワーク歓迎',
          '終電上がりOK',
        ],
      },
    ],
    benefits: [
      '送迎完備',
      '学生・Wワーク歓迎',
      '昇進・昇給あり',
      '研修・OJT制度あり',
    ],
    faq: [
      { q: '未経験でも応募できますか？', a: '可能です。水商売の経験は不問です。ホテルや飲食店での接客経験がある方は優遇します。' },
      { q: '仕事内容を具体的に教えてください。', a: 'ドリンク・フードのご提供、フロア管理、キャストのサポートが主な業務です。マネージャー職ではシフト管理・指導・売上管理も担当します。' },
      { q: 'お客様に怖い方はいますか？', a: '紳士的な方が多く、素行の悪い方はお断りしています。安心してお仕事いただける環境です。' },
      { q: '将来のキャリアアップは？', a: '実績によりホールスタッフ→チーフ→店長候補への昇格があります。若くして幹部になったスタッフも在籍しています。' },
      { q: '副業・Wワークは可能ですか？', a: 'アルバイトであれば副業・Wワーク歓迎です。' },
    ],
    formRole: 'staff',
    points: [
      '不正解雇・打ち切り一切なし・安定した勤務環境',
      '学歴・職歴・業界経験一切不問（異業種転職大歓迎）',
      'アルバイトは週１日・3時間〜自由なシフトに調整可能',
      'マネージャー・店長候補への昇格実績多数・独立支援あり',
      '安心の文化：素行の悪いお客様はお断り',
      'スマホ応募OK',
    ],
    tableData: [
      { label: '仕事内容', value: '店長候補・マネージャー(正社員)\nホールスタッフ(正社員/アルバイト)', subColumn: { label: 'エリア', value: '関内' } },
      { label: '給与', value: '【正社員】月給 25万円〜35万円以上\n【アルバイト】1,400円〜（研修期間あり）\n■昇給・昇格随時\n■深夜手当あり\n■大入賞・各種歩合あり' },
      { label: '応募条件', value: '18歳以上（高校生不可）\n【学歴・職歴・業界経験一切不問！】\n■ナイトワーク未経験の方も歓迎します。\n■異業種からの転職者も多数活躍中！\n■接客やマネジメントに興味がある方歓迎。' },
      { label: '勤務時間', value: '19:00〜LAST\n（実働8時間 / アルバイトは週1・3h〜）' },
    ] as RecruitTableData[],
    tableTags: [
      { label: '未経験者歓迎', active: true },
      { label: '経験者優遇', active: true },
      { label: '独立支援あり', active: true },

      { label: '駅近', active: true },
    ] as RecruitTag[],
  },
  escort: {
    tab: 'エスコート',
    sub: '女性アルバイトスタッフ',
    icon: User,
    hero: 'キャストとは別の形で、Club Animoを支えてくれる女性スタッフを募集しています。',
    roles: [
      {
        badge: 'アルバイト',
        title: 'エスコートレディ（女性アルバイト）',
        duties: 'お客様のご案内（席へのエスコート）・ご予約受付・お荷物お預かり・電話対応',
        salary: '時給 1,400円〜 / 週1日・3h〜',
        conditions: [
          '週1日・3時間〜OK',
          '時給1,400円〜',
          '送り完備',
          '終電上がりOK',
          '未経験歓迎',
        ],
      },
    ],
    benefits: [
      '送迎完備',
      '週1日・3時間〜OK',
      '学生・Wワーク歓迎',
      'キャストとは別の立場で働ける',
      '接客経験が積める',
    ],
    faq: [
      { q: 'キャストと何が違いますか？', a: 'エスコートはお客様をお席へご案内・ご予約受付・お荷物お預かりが主な業務です。お客様の横に座ることはありません。接客業に自信がない方や、水商売は初めての方にもおすすめです。' },
      { q: '未経験でも大丈夫ですか？', a: 'はい。笑顔でハキハキとご挨拶ができれば大丈夫です。丁寧にお教えします。' },
      { q: '学生・Wワークでも働けますか？', a: '週1日・3時間〜の短時間勤務OKです。授業・他の仕事と両立している方が多いです。' },
    ],
    formRole: 'escort',
    points: [
      'お客様の横に座ることはなし！ご案内・受付・お荷物お預かりがメイン業務',
      '外見に自信がなくても大丈夫',
      '水商売未経験＋お酒が苦手な方も大歓迎',
      '週1日・3時間〜の短時間勤務OK（授業・Wワーク両立可）',
      'お客様と接する接客スキルが自然に身につく',
      '終電上がりOK＋毎回送迎完備',
      'ノルマ一切なし・安心の勤務環境',
      'スマホ応募OK・履歴書不要（要身分証）',
    ],
    tableData: [
      { label: '仕事内容', value: 'エスコートレディ（女性アルバイト）', subColumn: { label: 'エリア', value: '関内' } },
      { label: '給与', value: '時給 1,400円〜\n■昇給随時' },
      { label: '応募条件', value: '18歳以上（高校生不可）\n■ナイトワーク未経験の方・お酒が飲めない方大歓迎！\n■学生・Wワーク希望の方歓迎\n■接客業の経験がある方優遇。' },
      { label: '勤務時間', value: '19:30〜LAST\n（週1日・3時間〜OK）\n※シフト自由の自己申告制\n※終電時間での退勤OK\n※週末のみの勤務も歓迎' },
    ] as RecruitTableData[],
    tableTags: [
      { label: '未経験者歓迎', active: true },
      { label: 'Wワーク歓迎', active: true },
      { label: 'お酒飲めなくて可', active: true },
      { label: '送りあり', active: true },
      { label: 'シフト自由', active: true },
      { label: 'ノルマなし', active: true },
      { label: '友達と応募可', active: true },
    ] as RecruitTag[],
  },
};

// ─── メインコンポーネント ──────────────────────────────────────

export default function StaffRecruitPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'escort'>('staff');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const data = POSITIONS[activeTab];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    formData.append('type', data.formRole);
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
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-luxury border border-gold/20">
          <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="text-xl font-serif text-foreground mb-6 luxury-tracking">ご応募ありがとうございます</h2>
          <p className="text-gray-500 mb-10 leading-[2.5] font-serif luxury-tracking text-xs">
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
      <section className="bg-foreground pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <PlaceholderImage
            ratio="16:9"
            alt="Staff Recruit"
            placeholderText="Bar & Management"
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="container mx-auto relative z-10 text-center">
          <FadeIn>
            <h1 className="text-gold font-serif text-3xl md:text-5xl lg:text-6xl mb-4 luxury-tracking-super uppercase">
              <RevealText text="STAFF RECRUIT" />
            </h1>
            <div className="w-12 h-px bg-gold mx-auto mb-6 opacity-50" />
            <p className="text-white/70 font-serif luxury-tracking text-xs uppercase mb-8">
              幹部候補・ホールスタッフ・エスコートレディ
            </p>
            <p className="text-white font-serif luxury-tracking text-sm md:text-base leading-loose max-w-xl mx-auto mb-10">
              {data.hero}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <a href="#form" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gold text-white font-serif luxury-tracking text-xs uppercase hover:bg-white hover:text-foreground transition-all duration-300">
                <CalendarHeart className="w-4 h-4" />
                今すぐWEB応募
              </a>
              <a href="tel:045-263-6961" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/40 text-white font-serif luxury-tracking text-xs uppercase hover:bg-white/10 transition-colors">
                <Phone className="w-4 h-4" />
                電話で相談
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ② 職種タブ切り替え */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gold/20 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex">
            {(Object.keys(POSITIONS) as Array<'staff' | 'escort'>).map((key) => {
              const p = POSITIONS[key];
              const Icon = p.icon;
              return (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setOpenFaq(null); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 font-serif luxury-tracking text-xs uppercase transition-all border-b-2 ${
                    activeTab === key
                      ? 'border-gold text-gold'
                      : 'border-transparent text-gray-400 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{p.tab}</span>
                  <span className="hidden sm:inline text-[9px] text-gray-400">／ {p.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ③ 職種詳細カード */}
      <section className="py-20 px-6 bg-[#f9f7f4]">
        <div className="container mx-auto max-w-5xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-foreground mb-2">募集職種</h2>
            <p className="text-xs text-gold font-serif luxury-tracking">{data.sub}</p>
          </FadeIn>

          <div className="space-y-6">
            {data.roles.map((role, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-gold/20 shadow-sm">
                  <div className="flex items-start gap-4 p-6 md:p-8 border-b border-gold/10">
                    <span className="text-[10px] font-serif luxury-tracking text-gold border border-gold/40 px-2 py-1 shrink-0 uppercase">
                      {role.badge}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-serif text-base md:text-lg text-foreground luxury-tracking mb-2">{role.title}</h3>
                      <p className="text-xs text-gray-500 font-serif luxury-tracking leading-[2]">{role.duties}</p>
                    </div>
                    <div className="hidden md:block shrink-0 text-right">
                      <p className="text-xs text-gray-400 font-serif luxury-tracking mb-1">給与目安</p>
                      <p className="text-sm font-serif text-gold luxury-tracking">{role.salary}</p>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <p className="text-[10px] text-gray-400 font-serif luxury-tracking uppercase mb-3">勤務条件</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {role.conditions.map((c, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs font-serif text-gray-600 luxury-tracking">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold shrink-0" />
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ④ 特典リスト */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <FadeIn className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-foreground mb-2">Benefits</h2>
            <p className="text-xs text-gold font-serif luxury-tracking">充実した待遇・環境</p>
          </FadeIn>
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#f9f7f4] p-4 border border-gold/10">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                  <span className="text-xs font-serif luxury-tracking text-gray-600">{b}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ④.5 ここがポイント！ */}
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
              {data.points.map((point: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-white border border-gold/15 px-5 py-4 shadow-sm">
                  <span className="text-gold font-serif text-base leading-none shrink-0 mt-0.5">★</span>
                  <span className="text-sm font-serif leading-relaxed luxury-tracking text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ⑤ 募集要項 */}
      <section className="py-20 px-6 bg-[#f9f7f4]">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <RecruitTable title={`募集要項（${data.tab}）`} data={data.tableData} tags={data.tableTags} />
          </FadeIn>
        </div>
      </section>

      {/* ⑤ Q&A */}
      <section className="py-20 px-6 bg-[#f9f7f4]">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-foreground mb-2">FAQ</h2>
            <p className="text-xs text-gold font-serif luxury-tracking">よくあるご質問</p>
          </FadeIn>
          <div className="divide-y divide-gray-200 bg-white border border-gold/10">
            {data.faq.map((item, i) => (
              <FadeIn key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex items-start justify-between gap-4 hover:bg-gold/5 transition-colors group"
                >
                  <span className="flex items-start gap-3">
                    <span className="text-gold font-serif text-xs luxury-tracking shrink-0 mt-0.5">Q.</span>
                    <span className="font-serif text-sm text-foreground luxury-tracking">{item.q}</span>
                  </span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pl-12">
                    <p className="text-xs text-gray-500 font-serif leading-[2.5] luxury-tracking">{item.a}</p>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ⑥ 複数CTA */}
      <section className="py-14 px-6 bg-foreground text-white text-center">
        <FadeIn>
          <h2 className="text-xl md:text-2xl font-serif luxury-tracking mb-6">まずはお気軽にご連絡ください</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <a href="#form" className="flex-1 inline-flex items-center justify-center gap-2 py-4 bg-gold text-white font-serif luxury-tracking text-xs uppercase hover:bg-white hover:text-foreground transition-all duration-300">
              <CalendarHeart className="w-4 h-4" />
              WEBで今すぐ応募
            </a>
            <a href="tel:045-263-6961" className="flex-1 inline-flex items-center justify-center gap-2 py-4 border border-white/40 text-white font-serif luxury-tracking text-xs uppercase hover:bg-white/10 transition-colors">
              <Phone className="w-4 h-4" />
              電話で相談（無料）
            </a>
            <a href="https://ig.me/m/kannai_club_animo" target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-4 border border-white/40 text-white font-serif luxury-tracking text-xs uppercase hover:bg-white/10 transition-colors">
              <Instagram className="w-4 h-4" />
              DMで相談
            </a>
          </div>
        </FadeIn>
      </section>

      {/* ⑦ 応募フォーム */}
      <section id="form" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <p className="text-gold font-serif luxury-tracking text-xs uppercase mb-3">{data.tab} 応募フォーム</p>
            <h2 className="text-2xl md:text-3xl font-serif text-foreground mb-4 luxury-tracking uppercase">
              Web Application
            </h2>
            <p className="text-gray-500 font-serif text-xs leading-[2.5] luxury-tracking">
              質問だけでも構いません。お気軽にご連絡ください。
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="bg-white p-8 md:p-16 shadow-luxury border-y border-gold/20 md:border">
            {errorMessage && (
              <div className="mb-8 p-4 bg-red-50 text-red-600 text-xs font-serif luxury-tracking border border-red-100 text-center">
                {errorMessage}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 職種選択 */}
              <div>
                <label className="block text-xs font-serif luxury-tracking text-foreground mb-4 uppercase">
                  応募職種 <span className="text-gold ml-1">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.roles.map((role, i) => (
                    <label key={i} className="flex items-center gap-3 cursor-pointer border border-gray-100 p-4 hover:border-gold transition-colors">
                      <input type="radio" name="position" value={role.title} className="accent-gold" defaultChecked={i === 0} />
                      <span className="text-xs font-serif luxury-tracking text-gray-600">
                        <span className="text-gold">{role.badge}</span> {role.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="name" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">
                  お名前 <span className="text-gold ml-1">*</span>
                </label>
                <input required id="name" name="name" type="text"
                  className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none"
                  placeholder="山田 太郎" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label htmlFor="age" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">
                    年齢 <span className="text-gold ml-1">*</span>
                  </label>
                  <input required id="age" name="age" type="number" min="18"
                    className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none"
                    placeholder="25" />
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
                <label className="block text-xs font-serif luxury-tracking text-foreground mb-4 uppercase">業界経験</label>
                <div className="flex gap-8">
                  {['未経験', '経験あり'].map((v) => (
                    <label key={v} className="flex items-center gap-3 cursor-pointer text-xs font-serif luxury-tracking text-gray-500 hover:text-gold transition-colors">
                      <input type="radio" name="experience" value={v} className="accent-gold scale-110" defaultChecked={v === '未経験'} />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-serif luxury-tracking text-foreground mb-3 uppercase">ご質問・ご要望</label>
                <textarea id="message" name="message" rows={4}
                  className="w-full bg-gray-50/30 border border-gray-200 p-4 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none resize-none"
                  placeholder="シフト希望、気になる点など、お気軽にご記入ください" />
              </div>

              <div className="pt-6 text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full md:w-auto md:min-w-[300px] text-xs font-serif luxury-tracking uppercase px-12 py-4"
                >
                  {isSubmitting ? 'Sending...' : '応募して面接に進む'}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 ml-4" />}
                </Button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
