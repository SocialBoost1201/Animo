'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitRecruitApplication } from '@/lib/actions/public/submit';

export default function CastRecruitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    formData.append('type', 'cast');
    
    // Server Action呼び出し
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
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-luxury border border-[var(--color-gold)]/20 relative">
          <h2 className="text-xl font-serif text-[#171717] mb-6 luxury-tracking">ご応募ありがとうございます</h2>
          <p className="text-gray-500 mb-10 leading-[2.5] font-serif luxury-tracking text-xs">
            入力いただいた情報が送信されました。<br />
            数日以内に採用担当より面接等のご案内をご連絡いたします。
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
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center overflow-hidden">
        <PlaceholderImage 
          ratio="16:9" 
          alt="Recruit Hero" 
          placeholderText="Elegant Chandelier" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-white" />
        
        <div className="relative z-10 text-center px-6">
          <FadeIn>
            <h1 className="text-[var(--color-gold)] font-serif text-4xl md:text-6xl lg:text-7xl luxury-tracking-super mb-6 drop-shadow-md">
              <RevealText text="CAST RECRUIT" />
            </h1>
            <p className="text-white font-serif luxury-tracking-super text-xs md:text-sm drop-shadow mb-12">
              もっと輝く、新しい私へ。
            </p>
            <Button asChild size="lg" className="px-12 py-5 text-xs font-serif luxury-tracking uppercase bg-white text-[#171717] hover:bg-white/90">
              <a href="#form">今すぐ応募する</a>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Concept */}
      <section className="py-32 px-6 bg-white text-center">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
             <h2 className="text-xl md:text-2xl font-serif text-[#171717] mb-8 luxury-tracking uppercase">
              Club Animo が選ばれる理由
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-10" />
            <p className="text-gray-600 font-serif leading-[2.5] luxury-tracking text-xs md:text-sm">
              関内エリアトップクラスの集客力と、落ち着いた紳士的なお客様層。<br />
              未経験の方でも安心してスタートできるよう、専属スタッフが徹底的にサポートします。<br />
              あなたの魅力を最大限に引き出し、確かな収入へと繋げるお手伝いをいたします。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Merits */}
      <section className="py-32 px-6 bg-white border-y border-[var(--color-gold)]/20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FadeIn delay={0.1} className="bg-white p-8 md:p-12 text-center shadow-luxury border border-[var(--color-gold)]/20 relative hover:-translate-y-2 transition-all duration-700">
              <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-[var(--color-gold)] w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg mb-6 text-[#171717] luxury-tracking">圧倒的な高待遇</h3>
              <p className="font-serif text-xs text-gray-500 leading-[2.5] luxury-tracking">
                時給保証制度あり。各種バックも充実しており、あなたの頑張りをしっかり評価し還元します。
              </p>
            </FadeIn>
            <FadeIn delay={0.2} className="bg-white p-8 md:p-12 text-center shadow-luxury border border-[var(--color-gold)]/20 relative hover:-translate-y-2 transition-all duration-700">
              <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-[var(--color-gold)] w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg mb-6 text-[#171717] luxury-tracking">未経験者歓迎</h3>
              <p className="font-serif text-xs text-gray-500 leading-[2.5] luxury-tracking">
                お酒の作り方から会話のコツまで、丁寧な事前研修をご用意。ノルマや罰金は一切ありません。
              </p>
            </FadeIn>
             <FadeIn delay={0.3} className="bg-white p-8 md:p-12 text-center shadow-luxury border border-[var(--color-gold)]/20 relative hover:-translate-y-2 transition-all duration-700">
              <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="text-[var(--color-gold)] w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg mb-6 text-[#171717] luxury-tracking">自由シフト制</h3>
              <p className="font-serif text-xs text-gray-500 leading-[2.5] luxury-tracking">
                週1回、1日3時間〜OK。学生さんやWワークの方でも、自分のペースで無理なく働けます。
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 応募の流れ */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-serif luxury-tracking uppercase text-[#171717] mb-4">
              応募の流れ
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto" />
          </div>

          <div className="relative">
            {/* 縦ライン */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-[var(--color-gold)]/20 hidden md:block" />

            <div className="space-y-8">
              {[
                { step: '01', title: 'WEB応募', desc: '下記フォームから、お気軽にご応募ください。お名前と電話番号だけでOKです。' },
                { step: '02', title: 'ご連絡', desc: '採用担当より2営業日以内にお電話またはLINEにてご連絡いたします。' },
                { step: '03', title: '面接', desc: '横浜・関内の店舗、またはご希望の場所でお気軽にお話しましょう。服装は自由です。' },
                { step: '04', title: '体験入店', desc: 'まずはお試しで。ノルマなし・アフターなしで雰囲気を体感してください。' },
                { step: '05', title: '本入店', desc: 'ご自身のペースでシフトを決めて、いよいよスタートです。' },
              ].map((item, i) => (
                <div key={i} className={`flex gap-8 items-start md:items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 bg-white p-6 border border-[var(--color-gold)]/20 shadow-sm ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <p className="text-[10px] text-[var(--color-gold)] font-serif luxury-tracking uppercase mb-1">Step {item.step}</p>
                    <h3 className="font-serif luxury-tracking text-base text-[#171717] mb-2">{item.title}</h3>
                    <p className="text-xs text-gray-500 font-serif leading-[2.2] luxury-tracking">{item.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 flex items-center justify-center shrink-0 md:mx-4">
                    <span className="text-[10px] font-serif text-[var(--color-gold)] luxury-tracking">{item.step}</span>
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apply Form Anchor */}

      <section id="form" className="py-32 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-[#171717] mb-6 luxury-tracking uppercase">
              Web Application
            </h2>
            <p className="text-[var(--color-gold)] font-serif text-xs luxury-tracking mb-6">WEB応募フォーム</p>
            <p className="text-gray-500 font-serif text-xs leading-[2.5] luxury-tracking">
              気になることやご質問だけでも構いません。<br/>お気軽にご応募ください。
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-white p-8 md:p-16 shadow-luxury border-y border-[var(--color-gold)]/20 md:border md:rounded-sm relative">
            {errorMessage && (
              <div className="mb-8 p-4 bg-red-50/50 text-red-600 text-xs font-serif luxury-tracking border border-red-100 text-center">
                {errorMessage}
              </div>
            )}
            
             <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <label htmlFor="name" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">お名前 <span className="text-[var(--color-gold)] ml-1">*</span></label>
                  <input required id="name" name="name" type="text" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="山田 花子" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label htmlFor="age" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">年齢 <span className="text-[var(--color-gold)] ml-1">*</span></label>
                    <input required id="age" name="age" type="number" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="20" min="20" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">電話番号 <span className="text-[var(--color-gold)] ml-1">*</span></label>
                    <input required id="phone" name="phone" type="tel" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="090-1234-5678" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-4 uppercase">ナイトワーク経験</label>
                  <div className="flex gap-8">
                    <label className="flex items-center gap-3 cursor-pointer text-xs font-serif luxury-tracking text-gray-500 hover:text-[var(--color-gold)] transition-colors">
                      <input type="radio" name="experience" value="未経験" className="accent-[var(--color-gold)] scale-110" defaultChecked /> 初心者・未経験
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer text-xs font-serif luxury-tracking text-gray-500 hover:text-[var(--color-gold)] transition-colors">
                      <input type="radio" name="experience" value="経験あり" className="accent-[var(--color-gold)] scale-110" /> 経験あり
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">ご質問・ご要望</label>
                  <textarea id="message" name="message" rows={4} className="w-full bg-transparent border border-gray-200 p-4 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none resize-none bg-gray-50/30" placeholder="シフトの希望や、気になることがあればご記入ください" />
                </div>

                <div className="pt-8 text-center">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    size="lg" 
                    className="w-full md:w-auto md:min-w-[300px] text-xs font-serif luxury-tracking uppercase px-12 py-4"
                  >
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
