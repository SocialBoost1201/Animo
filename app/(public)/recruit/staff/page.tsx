'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Briefcase } from 'lucide-react';
import { submitRecruitApplication } from '@/lib/actions/public/submit';

export default function StaffRecruitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    formData.append('type', 'staff');
    
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
      <section className="bg-[#111] pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <PlaceholderImage 
            ratio="16:9" 
            alt="Staff Recruit" 
            placeholderText="Bar & Management" 
            className="w-full h-full object-cover grayscale"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl lg:text-6xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="STAFF RECRUIT" />
            </h1>
            <p className="text-[var(--color-gold)] font-serif luxury-tracking text-xs md:text-sm uppercase mb-12 opacity-80">
              幹部候補・ホールスタッフ求人
            </p>
            <p className="text-white md:text-xl font-serif luxury-tracking leading-loose">
              関内トップクラスの店舗で、あなたの実力を試しませんか。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 px-6 bg-white text-center">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
             <h2 className="text-xl md:text-2xl font-serif text-[#171717] mb-8 luxury-tracking uppercase">
              次世代の店舗運営を担う人材へ
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-10" />
            <p className="text-gray-600 font-serif leading-[2.5] luxury-tracking text-xs md:text-sm">
              Club Animoでは、単なる接客業務に留まらず、<br />
              店舗マネジメントやキャストのマネジメントなど、<br />
              経営的な視点を持った「幹部候補」を積極的に採用・育成しています。<br />
              年齢や過去の経歴に関係なく、実力とやる気次第でスピード昇格が可能です。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Position list */}
      <section className="py-16 px-6 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 to-transparent pointer-events-none h-1/2" />
        <div className="container mx-auto max-w-4xl space-y-12 relative z-10">
          
          <FadeIn delay={0.1} className="bg-white flex flex-col md:flex-row shadow-luxury border border-[var(--color-gold)]/20 relative">
             <div className="bg-[#171717] text-[var(--color-gold)] p-12 md:w-1/3 flex flex-col justify-center items-center text-center">
                <Briefcase className="w-10 h-10 mb-6 font-light opacity-80" />
                <h3 className="font-serif text-xl luxury-tracking mb-4 text-white">幹部候補</h3>
                <p className="text-[10px] text-[var(--color-gold)] font-serif luxury-tracking opacity-80">店舗運営・マネジメント</p>
             </div>
             <div className="p-10 md:p-14 md:w-2/3 flex flex-col justify-center">
                <div className="mb-8 border-b border-[var(--color-gold)]/20 pb-6">
                  <span className="text-[#171717] font-serif luxury-tracking text-2xl">月給 350,000円〜</span>
                  <span className="text-xs text-[var(--color-gold)] font-serif luxury-tracking ml-4 block mt-2 md:inline md:mt-0">+ 歩合・各種手当</span>
                </div>
                <ul className="space-y-4 text-xs tracking-wider leading-relaxed text-gray-500 font-serif mb-6">
                  <li>・店舗の売上管理、企画立案</li>
                  <li>・キャストのマネジメント、出勤調整</li>
                  <li>・ホール業務全般、特別ルーム（カーテンルーム）対応</li>
                </ul>
             </div>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-white flex flex-col md:flex-row shadow-luxury border border-[var(--color-gold)]/20 relative">
             <div className="bg-[#171717] text-white p-12 md:w-1/3 flex flex-col justify-center items-center text-center">
                <Briefcase className="w-10 h-10 mb-6 font-light opacity-80" />
                <h3 className="font-serif text-xl luxury-tracking mb-4 text-white">ホールスタッフ</h3>
                <p className="text-[10px] text-gray-400 font-serif luxury-tracking opacity-80">未経験からのスタート</p>
             </div>
             <div className="p-10 md:p-14 md:w-2/3 flex flex-col justify-center">
                <div className="mb-8 border-b border-[var(--color-gold)]/20 pb-6 space-y-3">
                  <div className="font-serif luxury-tracking"><span className="text-[10px] text-[var(--color-gold)] mr-2">[正社員]</span><span className="text-xl text-[#171717]">月給 300,000円〜</span></div>
                  <div className="font-serif luxury-tracking"><span className="text-[10px] text-[var(--color-gold)] mr-2">[アルバイト]</span><span className="text-xl text-[#171717]">時給 1,500円〜</span></div>
                </div>
                <ul className="space-y-4 text-xs tracking-wider leading-relaxed text-gray-500 font-serif mb-6">
                  <li>・お客様のご案内、オーダー受付</li>
                  <li>・ドリンクの配膳、テーブルセッティング</li>
                  <li>・店舗内の清掃業務</li>
                </ul>
             </div>
          </FadeIn>

        </div>
      </section>

      {/* Apply Form Anchor */}
      <section className="py-32 px-6 bg-white border-t border-[var(--color-gold)]/20 mt-16">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-serif text-[#171717] mb-6 luxury-tracking uppercase">
              Web Application
            </h2>
            <p className="text-[var(--color-gold)] font-serif text-xs luxury-tracking mb-6">WEB応募フォーム</p>
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
                  <input required id="name" name="name" type="text" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="山田 太郎" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label htmlFor="age" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">年齢 <span className="text-[var(--color-gold)] ml-1">*</span></label>
                    <input required id="age" name="age" type="number" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" min="18" placeholder="20" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">電話番号 <span className="text-[var(--color-gold)] ml-1">*</span></label>
                    <input required id="phone" name="phone" type="tel" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="090-1234-5678" />
                  </div>
                </div>
                <div>
                  <label htmlFor="experience" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">希望職種 <span className="text-[var(--color-gold)] ml-1">*</span></label>
                  {/* experienceにスタッフの希望職種をマッピング */}
                  <div className="relative">
                    <select required id="experience" name="experience" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none appearance-none">
                      <option value="">選択してください</option>
                      <option value="幹部候補">幹部候補（正社員）</option>
                      <option value="ホールスタッフ（正）">ホールスタッフ（正社員）</option>
                      <option value="ホールスタッフ（ア）">ホールスタッフ（アルバイト）</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-[10px] font-serif luxury-tracking text-[#171717] mb-3 uppercase">自己PR・経歴など</label>
                  <textarea id="message" name="message" rows={4} className="w-full bg-transparent border border-gray-200 p-4 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none resize-none bg-gray-50/30" placeholder="過去の経歴や意気込み等があればご記入ください" />
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
