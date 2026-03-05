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
      <div className="min-h-screen bg-[var(--color-gray-light)] pb-24 flex items-center justify-center pt-32">
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-sm border border-gray-100 rounded-sm">
          <h2 className="text-2xl font-serif text-[#171717] mb-4">ご応募ありがとうございます</h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-sans">
            入力いただいた情報が送信されました。<br />
            数日以内に採用担当より面接等のご案内をご連絡いたします。
          </p>
          <Button asChild onClick={() => setIsSuccess(false)}>
            <a href="/">トップページへ戻る</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-light)]">
      {/* Hero Section */}
      <section className="bg-[#111] pt-24 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <PlaceholderImage 
            ratio="16:9" 
            alt="Staff Recruit" 
            placeholderText="Bar & Management" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl lg:text-6xl mb-4 tracking-widest uppercase">
              <RevealText text="STAFF RECRUIT" />
            </h1>
            <p className="text-gray-300 font-sans tracking-[0.2em] text-sm md:text-base uppercase mb-8">
              幹部候補・ホールスタッフ求人
            </p>
            <p className="text-white md:text-xl font-serif tracking-widest">
              関内トップクラスの店舗で、あなたの実力を試しませんか。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
             <h2 className="text-2xl md:text-3xl font-serif text-[#171717] mb-8 tracking-widest uppercase">
              次世代の店舗運営を担う人材へ
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-10" />
            <p className="text-gray-600 font-sans leading-loose md:text-lg">
              Club Animoでは、単なる接客業務に留まらず、<br />
              店舗マネジメントやキャストのマネジメントなど、<br />
              経営的な視点を持った「幹部候補」を積極的に採用・育成しています。<br />
              年齢や過去の経歴に関係なく、実力とやる気次第でスピード昇格が可能です。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Position list */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl space-y-8">
          
          <FadeIn delay={0.1} className="bg-white border flex flex-col md:flex-row border-gray-100 rounded-sm shadow-sm overflow-hidden">
             <div className="bg-[#171717] text-[var(--color-gold)] p-8 md:w-1/3 flex flex-col justify-center items-center text-center">
                <Briefcase className="w-12 h-12 mb-4" />
                <h3 className="font-serif text-2xl tracking-widest mb-2">幹部候補</h3>
                <p className="text-xs text-gray-400 font-sans">店舗運営・マネジメント</p>
             </div>
             <div className="p-8 md:w-2/3">
                <div className="mb-6">
                  <span className="text-[#171717] font-bold text-xl font-sans">月給 350,000円〜</span>
                  <span className="text-xs text-gray-500 ml-2">+ 歩合・各種手当</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 font-sans mb-6">
                  <li>・店舗の売上管理、企画立案</li>
                  <li>・キャストのマネジメント、出勤調整</li>
                  <li>・ホール業務全般、VIP対応</li>
                </ul>
             </div>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-white border flex flex-col md:flex-row border-gray-100 rounded-sm shadow-sm overflow-hidden">
             <div className="bg-[#171717] text-white p-8 md:w-1/3 flex flex-col justify-center items-center text-center">
                <Briefcase className="w-12 h-12 mb-4" />
                <h3 className="font-serif text-2xl tracking-widest mb-2">ホールスタッフ</h3>
                <p className="text-xs text-gray-400 font-sans">未経験からのスタート</p>
             </div>
             <div className="p-8 md:w-2/3">
                <div className="mb-6">
                  <span className="text-[#171717] font-bold text-xl font-sans">[正] 月給 300,000円〜</span><br />
                  <span className="text-[#171717] font-bold font-sans">[ア] 時給 1,500円〜</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 font-sans mb-6">
                  <li>・お客様のご案内、オーダー受付</li>
                  <li>・ドリンクの配膳、テーブルセッティング</li>
                  <li>・店舗内の清掃業務</li>
                </ul>
             </div>
          </FadeIn>

        </div>
      </section>

      {/* Apply Form Anchor */}
      <section className="py-24 px-6 bg-white border-t border-gray-100">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-serif text-[#171717] mb-4 tracking-widest uppercase">
              Web Application
            </h2>
            <p className="text-gray-500 font-sans text-sm mb-4">WEB応募フォーム</p>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-[var(--color-gray-light)] p-8 md:p-12 rounded-sm border border-gray-100">
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-200 rounded-sm text-center">
                {errorMessage}
              </div>
            )}
            
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-[#171717] mb-2">お名前 <span className="text-[var(--color-gold)]">*</span></label>
                  <input required id="name" name="name" type="text" className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="山田 太郎" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="age" className="block text-sm font-bold text-[#171717] mb-2">年齢 <span className="text-[var(--color-gold)]">*</span></label>
                    <input required id="age" name="age" type="number" className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" min="18" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-[#171717] mb-2">電話番号 <span className="text-[var(--color-gold)]">*</span></label>
                    <input required id="phone" name="phone" type="tel" className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="090-1234-5678" />
                  </div>
                </div>
                <div>
                  <label htmlFor="experience" className="block text-sm font-bold text-[#171717] mb-2">希望職種 <span className="text-[var(--color-gold)]">*</span></label>
                  {/* experienceにスタッフの希望職種をマッピング */}
                  <select required id="experience" name="experience" className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm text-[#171717]">
                    <option value="">選択してください</option>
                    <option value="幹部候補">幹部候補（正社員）</option>
                    <option value="ホールスタッフ（正）">ホールスタッフ（正社員）</option>
                    <option value="ホールスタッフ（ア）">ホールスタッフ（アルバイト）</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-[#171717] mb-2">自己PR・経歴など</label>
                  <textarea id="message" name="message" rows={4} className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm resize-none" placeholder="過去の経歴や意気込み等があればご記入ください" />
                </div>

                <div className="pt-6 text-center">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    size="lg" 
                    className="w-full md:w-auto md:min-w-[300px] text-lg tracking-widest py-6"
                  >
                    {isSubmitting ? 'Sending...' : '応募して面接に進む'}
                    {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                </div>
             </form>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
