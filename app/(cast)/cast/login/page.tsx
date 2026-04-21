'use client';

import { type FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { castSendLoginOtp } from '@/lib/actions/cast-auth';
import { toast } from 'sonner';

export default function CastLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('reauth') === '1') {
      toast.info('14日以上アクセスがなかったため、SMS認証をお願いします。');
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set('phone', phone);
      const result = await castSendLoginOtp(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(result.message ?? 'SMS認証コードを送信しました。');
      router.push(`/cast/verify?phone=${encodeURIComponent(phone)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div
        className="w-full max-w-[448px] rounded-[16px] p-1"
        style={{
          background: 'linear-gradient(128deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] p-10"
          style={{
            background: 'linear-gradient(128deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
            boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
          }}
        >
          <div className="text-center mb-8">
            <p
              className="text-white text-sm tracking-[0.3em] uppercase font-light mb-1"
              style={{ fontFamily: 'var(--font-serif, serif)' }}
            >
              CLUB ANIMO
            </p>
            <h1 className="text-white text-3xl font-bold tracking-[0.2em] uppercase mb-5">
              ANIMO CMS
            </h1>
            <p
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              SMS Login
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="cast-phone"
                className="block text-sm mb-2"
                style={{ color: '#9f9fa9' }}
              >
                電話番号
              </label>
              <input
                id="cast-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                inputMode="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="090-1234-5678"
                style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
              />
            </div>

            <p className="text-xs leading-relaxed" style={{ color: '#9f9fa9' }}>
              初回ログイン時と、14日以上アクセスがなかった場合にSMS認証が必要です。
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] rounded-[10px] text-base font-semibold transition-opacity disabled:opacity-60"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                color: '#18181b',
              }}
            >
              {isLoading ? '送信中...' : 'SMSを送信'}
            </button>
          </form>

          <div className="mt-7 text-center space-y-3">
            <p className="text-sm tracking-wide" style={{ color: '#9f9fa9' }}>
              アカウントをお持ちでない方は{' '}
              <Link href="/cast/register" className="font-medium transition-colors hover:underline" style={{ color: '#dfbd69' }}>
                新規登録
              </Link>
            </p>
            <Link href="/cast/m/login" className="block text-sm hover:underline" style={{ color: '#9f9fa9' }}>
              モバイル版はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
