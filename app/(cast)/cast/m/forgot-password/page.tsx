'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { castForgotPassword } from '@/lib/actions/cast-auth';
import { toast } from 'sonner';

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

export default function CastForgotPasswordMobilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await castForgotPassword(formData);
    if (result.success) {
      toast.success(result.message);
      setIsSent(true);
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-[408px] rounded-[16px] p-px"
          style={{
            background: 'linear-gradient(128deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
            boxShadow: '0 0 48px rgba(223,189,105,0.25)',
          }}
        >
          <div
            className="w-full rounded-[14px] px-8 py-10 text-center"
            style={{
              background: 'linear-gradient(128deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
              boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(223,189,105,0.15)' }}>
              <span className="text-2xl" style={{ color: '#dfbd69' }}>&#9993;</span>
            </div>
            <h2 className="text-xl font-bold tracking-widest text-white mb-4">メール送信完了</h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#9f9fa9' }}>
              パスワード再設定用のリンクを送信しました。<br />メールをご確認ください。
            </p>
            <Link
              href="/cast/m/login"
              className="inline-block w-full h-[48px] leading-[48px] rounded-[10px] text-base font-semibold text-center"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                color: '#18181b',
              }}
            >
              ログインへ戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-[408px] rounded-[16px] p-px"
        style={{
          background: 'linear-gradient(128deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] px-8 py-10"
          style={{
            background: 'linear-gradient(128deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
            boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-white text-sm tracking-[0.3em] uppercase font-light mb-1" style={{ fontFamily: 'var(--font-serif, serif)' }}>
              CLUB ANIMO
            </p>
            <h1 className="text-white text-2xl font-bold tracking-[0.2em] uppercase mb-4">ANIMO CMS</h1>
            <p
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              パスワードをリセット
            </p>
          </div>

          <p className="text-sm text-center mb-8" style={{ color: '#9f9fa9' }}>
            登録されたメールアドレスを入力してください。<br />
            パスワードリセット用のリンクをお送りします。
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                メールアドレス
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#71717b' }} aria-hidden>
                  <MailIcon />
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-[10px] pl-11 pr-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="example@email.com"
                  style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[48px] rounded-[10px] text-base font-semibold transition-opacity disabled:opacity-60"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                color: '#18181b',
              }}
            >
              {isLoading ? '送信中...' : 'リセットリンクを送信'}
            </button>

            <Link
              href="/cast/m/login"
              className="block w-full h-[49px] rounded-[10px] border text-center leading-[49px] text-base"
              style={{ borderColor: '#3f3f47', color: '#d4d4d8' }}
            >
              ← ログイン画面に戻る
            </Link>
          </form>

          <div className="mt-4 text-center">
            <Link href="/cast/forgot-password" className="text-sm hover:underline" style={{ color: '#9f9fa9' }}>
              PC版はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
