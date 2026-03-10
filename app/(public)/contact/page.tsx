'use client';

import React, { useState } from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { submitContact } from '@/lib/actions/public/submit';
import { trackContactSubmit } from '@/lib/analytics';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!executeRecaptcha) {
      setErrorMessage('スパム対策システムの読み込みに失敗しました。時間をおいて再度お試しください。');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const token = await executeRecaptcha('contact_submit');
      const formData = new FormData(e.currentTarget);
      formData.append('type', 'contact');
      formData.append('recaptchaToken', token);
      
      // Server Action呼び出し
      const result = await submitContact(formData);
    
    setIsSubmitting(false);

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setIsSuccess(true);
        trackContactSubmit();
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('予期せぬエラーが発生しました。');
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white pb-32 flex items-center justify-center pt-32">
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-luxury border border-gold/20 relative">
          <h2 className="text-xl font-serif text-[#171717] mb-6 luxury-tracking">お問い合わせを送信しました</h2>
          <p className="text-gray-500 mb-10 leading-[2.5] font-serif luxury-tracking text-xs">
            お問い合わせいただき誠にありがとうございます。<br />
            ご入力の内容は正常に送信されました。<br />
            数日以内に担当スタッフよりご連絡いたします。
          </p>
          <Button asChild className="px-10 text-xs font-serif luxury-tracking">
            <Link href="/">トップページへ戻る</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <section className="bg-white pt-24 pb-16 px-6 border-b border-gold/20 relative">
        <div className="absolute inset-0 bg-linear-to-b from-gold/5 to-transparent pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[#171717] font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="Contact" />
            </h1>
            <div className="w-px h-12 bg-linear-to-b from-gold to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-gold font-serif luxury-tracking text-xs md:text-sm uppercase">
              お問い合わせ
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-2xl">
          <FadeIn delay={0.2} className="bg-white p-8 md:p-16 shadow-luxury border-y border-gold/20 md:border md:rounded-sm relative">
            <p className="text-xs text-gold mb-12 leading-[2] text-center font-serif luxury-tracking">
              当店に関するご質問やご相談がございましたら、<br />
              以下のフォームよりお気軽にお問い合わせください。
            </p>

            {errorMessage && (
              <div className="mb-8 p-4 bg-red-50/50 text-red-600 text-xs font-serif luxury-tracking border border-red-100 text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <label htmlFor="name" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                  Name <span className="text-gold ml-1">*</span>
                </label>
                <input required id="name" name="name" type="text" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="山田 太郎" />
              </div>
              
              <div>
                <label htmlFor="contactMethod" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                  Email <span className="text-gold ml-1">*</span>
                </label>
                <input required id="contactMethod" name="contactMethod" type="email" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="info@example.com" />
              </div>

              <div>
                <label htmlFor="lineId" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                  LINE ID <span className="text-gray-400 text-[10px] ml-1 normal-case">(任意)</span>
                </label>
                <input id="lineId" name="lineId" type="text" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="@your_line_id" />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                  Phone <span className="text-gray-400 text-[10px] ml-1 normal-case">(任意)</span>
                </label>
                <input id="phone" name="phone" type="tel" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="090-1234-5678" />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                  Message <span className="text-gold ml-1">*</span>
                </label>
                <textarea required id="message" name="message" rows={6} className="w-full bg-gray-50/30 border border-gray-200 p-4 outline-none focus:border-gold transition-colors text-sm font-serif luxury-tracking rounded-none resize-none" placeholder="お問い合わせ内容をご記入ください" />
              </div>

              <div className="pt-8 text-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  size="lg" 
                  className="w-full md:w-auto md:min-w-[300px] text-xs font-serif luxury-tracking uppercase px-12 py-4"
                >
                  {isSubmitting ? 'Sending...' : '送信する'}
                </Button>
                <p className="text-[10px] text-gray-400 mt-6 font-serif luxury-tracking">
                  送信ボタンを押すことで、<Link href="/privacy" className="underline hover:text-gold">プライバシーポリシー</Link>に同意したものとみなされます。
                </p>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
