import React from 'react';
import Link from 'next/link';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Cast Recruit | Club Animo',
  description: '関内の高級クラブ「Club Animo」のキャスト求人。未経験者歓迎・高待遇でお迎えいたします。',
};

export default function CastRecruitPage() {
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
            <h1 className="text-[var(--color-gold)] font-serif text-4xl md:text-6xl lg:text-7xl tracking-[0.2em] mb-6 drop-shadow-md">
              <RevealText text="CAST RECRUIT" />
            </h1>
            <p className="text-white font-serif tracking-[0.3em] text-sm md:text-lg lg:text-xl drop-shadow mb-12">
              もっと輝く、新しい私へ。
            </p>
            <Button asChild size="lg" className="px-10 py-6 text-lg tracking-widest bg-white text-[#171717] hover:bg-white/90">
              <a href="#form">今すぐ応募する</a>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Concept */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="container mx-auto max-w-3xl">
          <FadeIn>
             <h2 className="text-2xl md:text-3xl font-serif text-[#171717] mb-8 tracking-widest uppercase">
              Club Animo が選ばれる理由
            </h2>
            <div className="w-12 h-[1px] bg-[var(--color-gold)] mx-auto mb-10" />
            <p className="text-gray-600 font-sans leading-loose md:text-lg">
              関内エリアトップクラスの集客力と、落ち着いた紳士的なお客様層。<br />
              未経験の方でも安心してスタートできるよう、専属スタッフが徹底的にサポートします。<br />
              あなたの魅力を最大限に引き出し、確かな収入へと繋げるお手伝いをいたします。
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Merits */}
      <section className="py-24 px-6 bg-[var(--color-gray-light)]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1} className="bg-white p-8 md:p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-[var(--color-gold)] w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl mb-4 text-[#171717]">圧倒的な高待遇</h3>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                時給保証制度あり。各種バックも充実しており、あなたの頑張りをしっかり評価し還元します。
              </p>
            </FadeIn>
            <FadeIn delay={0.2} className="bg-white p-8 md:p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-[var(--color-gold)] w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl mb-4 text-[#171717]">未経験者歓迎</h3>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                お酒の作り方から会話のコツまで、丁寧な事前研修をご用意。ノルマや罰金は一切ありません。
              </p>
            </FadeIn>
             <FadeIn delay={0.3} className="bg-white p-8 md:p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-[var(--color-gold)] w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl mb-4 text-[#171717]">自由シフト制</h3>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                週1回、1日3時間〜OK。学生さんやWワークの方でも、自分のペースで無理なく働けます。
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Apply Form Anchor */}
      <section id="form" className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-serif text-[#171717] mb-4 tracking-widest uppercase">
              Web Application
            </h2>
            <p className="text-gray-500 font-sans text-sm mb-4">WEB応募フォーム</p>
            <p className="text-gray-600">
              気になることやご質問だけでも構いません。お気軽にご応募ください。
            </p>
          </FadeIn>

          <FadeIn delay={0.2} className="bg-[var(--color-gray-light)] p-8 md:p-12 rounded-sm border border-gray-100">
             <form className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">お名前 <span className="text-[var(--color-gold)]">*</span></label>
                  <input required type="text" className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[var(--color-gold)] transition-colors rounded-sm" placeholder="山田 花子" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">年齢 <span className="text-[var(--color-gold)]">*</span></label>
                    <input required type="number" className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[var(--color-gold)] transition-colors rounded-sm" placeholder="20" min="20" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#171717] mb-2">電話番号 <span className="text-[var(--color-gold)]">*</span></label>
                    <input required type="tel" className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[var(--color-gold)] transition-colors rounded-sm" placeholder="090-1234-5678" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">ナイトワーク経験</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="exp" value="未経験" className="accent-[var(--color-gold)]" defaultChecked /> 初心者・未経験
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="exp" value="経験あり" className="accent-[var(--color-gold)]" /> 経験あり
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#171717] mb-2">ご質問・ご要望</label>
                  <textarea rows={4} className="w-full bg-white border border-gray-200 p-3 outline-none focus:border-[var(--color-gold)] transition-colors rounded-sm resize-none" placeholder="シフトの希望や、気になることがあればご記入ください" />
                </div>

                <div className="pt-6 text-center">
                  <Button type="button" size="lg" className="w-full md:w-auto md:min-w-[300px] text-lg tracking-widest py-6">
                    応募して面接に進む
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
             </form>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
