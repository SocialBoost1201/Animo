'use client';

import React, { useState } from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[var(--color-gray-light)] pb-24 flex items-center justify-center pt-32">
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-sm border border-gray-100 rounded-sm">
          <h2 className="text-2xl font-serif text-[#171717] mb-4">お問い合わせを送信しました</h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-sans">
            お問い合わせいただき誠にありがとうございます。<br />
            入力されたメールアドレス宛に控えのメールを送信しました。<br />
            数日以内に担当スタッフよりご連絡いたします。
          </p>
          <Button asChild onClick={() => setIsSuccess(false)}>
            <a href="/">トップページへ戻る</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[var(--color-gold)] font-serif text-3xl md:text-5xl mb-4 tracking-widest uppercase">
              <RevealText text="Contact" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              お問い合わせ
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-2xl">
          <FadeIn delay={0.2} className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
            <p className="text-sm text-gray-600 mb-10 leading-loose text-center font-sans">
              当店に関するご質問やご相談がございましたら、<br />
              以下のフォームよりお気軽にお問い合わせください。
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                  Name <span className="text-[var(--color-gold)] ml-1">*</span>
                </label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="山田 太郎" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                  Email <span className="text-[var(--color-gold)] ml-1">*</span>
                </label>
                <input required type="email" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="info@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                  Phone (Optional)
                </label>
                <input type="tel" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="090-1234-5678" />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                  Message <span className="text-[var(--color-gold)] ml-1">*</span>
                </label>
                <textarea required rows={6} className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm resize-none" placeholder="お問い合わせ内容をご記入ください" />
              </div>

              <div className="pt-6 text-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  size="lg" 
                  className="w-full md:w-auto md:min-w-[300px] text-lg tracking-widest"
                >
                  {isSubmitting ? 'Sending...' : '送信する'}
                </Button>
                <p className="text-xs text-gray-500 mt-4 font-sans">
                  送信ボタンを押すことで、<a href="/privacy" className="underline hover:text-[var(--color-gold)]">プライバシーポリシー</a>に同意したものとみなされます。
                </p>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
