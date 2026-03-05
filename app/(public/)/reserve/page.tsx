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
      <div className="min-h-screen bg-[var(--color-gray-light)] pb-24 flex items-center justify-center pt-32">
        <div className="bg-white p-12 max-w-lg w-full text-center shadow-sm border border-gray-100 rounded-sm">
          <CalendarHeart className="w-16 h-16 mx-auto text-[var(--color-gold)] mb-6" />
          <h2 className="text-2xl font-serif text-[#171717] mb-4">予約リクエストを送信しました</h2>
          <p className="text-gray-600 mb-8 leading-relaxed font-sans">
            この度はご予約ありがとうございます。<br />
            ご入力の内容は正常に送信されました。<br />
            追ってスタッフより予約確定のご連絡を申し上げます。
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
              <RevealText text="Reserve" />
            </h1>
            <p className="text-[#171717] font-sans tracking-[0.2em] text-sm md:text-base uppercase">
              来店予約
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn delay={0.2} className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
            <p className="text-sm text-gray-600 mb-10 leading-loose text-center font-sans">
              以下のフォームよりご予約リクエストを承ります。<br />
              当日のご予約はお電話にてお問い合わせくださいませ。
            </p>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm border border-red-200 rounded-sm text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
              {/* Name & Furigana */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                    Name <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="name" name="name" type="text" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="山田 太郎" />
                </div>
                <div>
                  {/* contactMethodとしてメールアドレスやLINE ID等を共用 */}
                  <label htmlFor="contactMethod" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                    Contact Method <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="contactMethod" name="contactMethod" type="text" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="info@example.com (メール/LINE等)" />
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                    Phone <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="phone" name="phone" type="tel" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="090-1234-5678" />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="date" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                    Reserve Date <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <input required id="date" name="date" type="date" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm text-[#171717]" />
                </div>
                <div>
                  <label htmlFor="time" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                    Time <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <select required id="time" name="time" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm text-[#171717]">
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
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="people" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                    Number of People <span className="text-[var(--color-gold)] ml-1">*</span>
                  </label>
                  <select required id="people" name="people" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm text-[#171717]">
                    {[1,2,3,4,5,6,7,8,"9名以上"].map(n => <option key={n} value={n}>{n}{typeof n === 'number' ? '名' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="castName" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                    Cast Nomination
                  </label>
                  <input id="castName" name="castName" defaultValue={defaultCastName} type="text" className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm" placeholder="指名するキャスト名（任意）" />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-bold text-[#171717] mb-2 uppercase tracking-wide">
                  Message / Remarks
                </label>
                <textarea id="message" name="message" rows={4} className="w-full bg-gray-50 border border-gray-200 p-3 outline-none focus:border-[#171717] transition-colors rounded-sm resize-none" placeholder="ご要望やご質問がございましたらご記入ください" />
              </div>

              {/* Submit */}
              <div className="pt-6 text-center">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  size="lg" 
                  className="w-full md:w-auto md:min-w-[300px] text-lg tracking-widest"
                >
                  {isSubmitting ? 'Sending...' : '予約をリクエストする'}
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

// Suspense wrap needed for next/navigation hooks in Next.js 13+
export default function ReservePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-gray-light)]"></div>}>
      <ReserveForm />
    </Suspense>
  )
}
