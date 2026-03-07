'use client';

import React, { useState, Suspense } from 'react';
import { FadeIn } from '@/components/motion/FadeIn';
import { RevealText } from '@/components/motion/RevealText';
import { Button } from '@/components/ui/Button';
import { CalendarHeart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { submitContact } from '@/lib/actions/public/submit';

function ReserveForm() {
  const searchParams = useSearchParams();
  const defaultCastName = searchParams.get('cast') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    const formData = new FormData(e.currentTarget);
    formData.append('type', 'reserve');
    
    // Server Action呼び出し
    const result = await submitContact(formData);
    
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
          <CalendarHeart className="w-12 h-12 mx-auto text-[var(--color-gold)] mb-8 opacity-80" />
          <h2 className="text-xl font-serif text-[#171717] mb-6 luxury-tracking">予約リクエストを送信しました</h2>
          <p className="text-gray-500 mb-10 leading-[2.5] font-serif luxury-tracking text-xs">
            この度はご予約ありがとうございます。<br />
            ご入力の内容は正常に送信されました。<br />
            追ってスタッフより予約確定のご連絡を申し上げます。
          </p>
          <Button asChild className="px-10 text-xs font-serif luxury-tracking">
            <a href="/">トップページへ戻る</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      <section className="bg-white pt-24 pb-16 px-6 border-b border-[var(--color-gold)]/20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-gold)]/5 to-transparent pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <FadeIn direction="down" className="text-center">
            <h1 className="text-[#171717] font-serif text-3xl md:text-5xl mb-6 luxury-tracking-super uppercase">
              <RevealText text="Reserve" />
            </h1>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[var(--color-gold)] to-transparent mx-auto mb-6 opacity-50" />
            <p className="text-[var(--color-gold)] font-serif luxury-tracking text-xs md:text-sm uppercase">
              来店予約
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn delay={0.2} className="bg-white p-8 md:p-16 shadow-luxury border-y border-[var(--color-gold)]/20 md:border md:rounded-sm relative">
            <p className="text-xs text-[var(--color-gold)] mb-12 leading-[2] text-center font-serif luxury-tracking">
              以下のフォームよりご予約リクエストを承ります。<br />
              当日のご予約はお電話にてお問い合わせくださいませ。
            </p>

            {errorMessage && (
              <div className="mb-8 p-4 bg-red-50/50 text-red-600 text-xs font-serif luxury-tracking border border-red-100 text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
              {/* Name & Furigana */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                    Name <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="name" name="name" type="text" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="山田 太郎" />
                </div>
                <div>
                  {/* contactMethodとしてメールアドレスやLINE ID等を共用 */}
                  <label htmlFor="contactMethod" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                    Contact Method <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="contactMethod" name="contactMethod" type="text" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="info@example.com / LINE ID" />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                    Phone <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="phone" name="phone" type="tel" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="090-1234-5678" />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <label htmlFor="date" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                    Reserve Date <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="date" name="date" type="date" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none text-[#171717]" />
                </div>
                <div>
                  <label htmlFor="time" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                    Time <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <select required id="time" name="time" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none text-[#171717]">
                    <option value="">--:--</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                    <option value="21:30">21:30</option>
                    <option value="22:00">22:00</option>
                    <option value="22:30">22:30</option>
                    <option value="23:00">23:00</option>
                    <option value="23:30">23:30</option>
                    <option value="24:00">0:00</option>
                  </select>
                </div>
              </div>

               {/* People & Cast */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="people" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                    Number of People <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <select required id="people" name="people" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none text-[#171717]">
                    {[1,2,3,4,5,6,7,8,"9名以上"].map(n => <option key={n} value={n}>{n}{typeof n === 'number' ? '名' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="castName" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                    Cast Nomination
                  </label>
                  <input id="castName" name="castName" defaultValue={defaultCastName} type="text" className="w-full bg-transparent border-b border-gray-200 py-3 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none" placeholder="指名 キャスト名（任意）" />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-xs font-serif luxury-tracking text-[#171717] mb-3 uppercase">
                  Message / Remarks
                </label>
                <textarea id="message" name="message" rows={4} className="w-full bg-transparent border border-gray-200 p-4 outline-none focus:border-[var(--color-gold)] transition-colors text-sm font-serif luxury-tracking rounded-none resize-none bg-gray-50/30" placeholder="ご要望やご質問がございましたらご記入ください" />
              </div>

              {/* Submit */}
              <div className="pt-8 text-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  size="lg" 
                  className="w-full md:w-auto md:min-w-[300px] text-xs font-serif luxury-tracking uppercase px-12 py-4"
                >
                  {isSubmitting ? 'Sending...' : '予約をリクエストする'}
                </Button>
                <p className="text-[10px] text-gray-400 mt-6 font-serif luxury-tracking">
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

// Suspense wrap needed for next/navigation hooks in Next.js 13+
export default function ReservePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <ReserveForm />
    </Suspense>
  )
}
