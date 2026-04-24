'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { castRegister } from '@/lib/actions/cast-auth';
import { formatJapaneseMobilePhone } from '@/lib/utils/phone';
import { toast } from 'sonner';

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function CastRegisterMobilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedMessage, setCompletedMessage] = useState(
    '登録が完了しました。ログイン画面からSMS認証を行ってください。'
  );
  const [feedback, setFeedback] = useState<{
    type: 'error' | 'success';
    title: string;
    message: string;
  } | null>(null);

  const errorTitleMap: Record<string, string> = {
    NO_MATCH: '照合失敗',
    ALREADY_REGISTERED: '既登録',
    AUTH_SIGNUP_FAILED: 'Auth作成失敗',
    AUTH_RATE_LIMIT: '送信上限',
    AUTH_USER_MISSING: 'Auth作成失敗',
    ROLE_INSERT_FAILED: '権限付与失敗',
    CAST_LINK_FAILED: 'キャスト紐付け失敗',
    MATCH_LOOKUP_FAILED: '照合処理失敗',
    MULTIPLE_MATCHES: '重複候補',
    UNEXPECTED: '想定外エラー',
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await castRegister(formData);
      if (result.success) {
        const successMessage = result.message ?? 'アカウントを登録しました。ログイン画面からSMS認証を行ってください。';
        toast.success(successMessage);
        setFeedback({
          type: 'success',
          title: '登録完了',
          message: successMessage,
        });
        setCompletedMessage(successMessage);
        setIsCompleted(true);
      } else {
        const errorMessage = result.error ?? '登録に失敗しました。時間をおいて再度お試しください。';
        const title = errorTitleMap[result.code ?? 'UNEXPECTED'] ?? '登録失敗';
        toast.error(errorMessage);
        setFeedback({
          type: 'error',
          title,
          message: errorMessage,
        });
      }
    } catch {
      const message = '想定外のエラーが発生しました。時間をおいて再度お試しください。';
      toast.error(message);
      setFeedback({
        type: 'error',
        title: '想定外エラー',
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
        <div
          className="w-full max-w-[420px] rounded-[16px] p-1"
          style={{
            background: 'linear-gradient(124deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
            boxShadow: '0 0 48px rgba(223,189,105,0.25)',
          }}
        >
          <div
            className="w-full rounded-[14px] px-6 py-6 text-center"
            style={{
              background: 'linear-gradient(124deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
              boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
            }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'rgba(223,189,105,0.15)' }}>
              <span className="text-2xl" style={{ color: '#dfbd69' }}>&#10003;</span>
            </div>
            <h2 className="text-xl font-bold tracking-widest text-white mb-4">登録完了</h2>
            <p className="text-sm leading-relaxed mb-8" style={{ color: '#9f9fa9' }}>
              {completedMessage}
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
      {isLoading && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: '#dfbd69', borderTopColor: 'transparent' }} />
          <p className="text-sm tracking-widest" style={{ color: '#dfbd69' }}>登録処理中...</p>
        </div>
      )}

      <div
        className="w-full max-w-[420px] rounded-[16px] p-1"
        style={{
          background: 'linear-gradient(124deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] px-6 py-6"
          style={{
            background: 'linear-gradient(124deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
            boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
          }}
        >
          <div className="text-center mb-4">
            <p
              className="text-white text-xs tracking-[0.3em] uppercase font-light mb-1"
              style={{ fontFamily: 'var(--font-serif, serif)' }}
            >
              CLUB ANIMO
            </p>
            <h1 className="text-white text-xl font-bold tracking-[0.2em] uppercase mb-3">
              ANIMO CMS
            </h1>
            <p
              className="text-lg font-bold"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Sign Up
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#9f9fa9' }}>
                  苗字
                </label>
                <input
                  name="lastName"
                  required
                  className="w-full rounded-[10px] px-[10px] py-[6px] text-sm text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="山田"
                  style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#9f9fa9' }}>
                  名前
                </label>
                <input
                  name="firstName"
                  required
                  className="w-full rounded-[10px] px-[10px] py-[6px] text-sm text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="太郎"
                  style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#9f9fa9' }}>
                源氏名
              </label>
              <input
                name="stageName"
                required
                className="w-full rounded-[10px] px-[10px] py-[6px] text-sm text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="源氏名を入力してください"
                style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#9f9fa9' }}>
                携帯番号
              </label>
              <input
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(formatJapaneseMobilePhone(e.target.value))}
                required
                className="w-full rounded-[10px] px-[10px] py-[6px] text-sm text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="090-1234-5678"
                style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
              />
            </div>

            <div>
              <label className="block text-xs mb-1.5" style={{ color: '#9f9fa9' }}>
                LINE ID
              </label>
              <input
                name="lineId"
                type="text"
                required
                className="w-full rounded-[10px] px-[10px] py-[6px] text-sm text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="@your-line-id"
                style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
              />
              <p className="text-[10px] mt-1" style={{ color: '#52525b' }}>
                LINE アプリ → プロフィール → ID で確認できます。LINE ID はログインには使用しません。
              </p>
            </div>

            {feedback && (
              <p
                className="text-xs text-center rounded-lg py-2 px-3"
                style={{
                  color: feedback.type === 'error' ? '#f87171' : '#9f9fa9',
                  background: feedback.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(63,63,71,0.35)',
                }}
              >
                {feedback.title}: {feedback.message}
              </p>
            )}

            <p className="text-[11px] leading-relaxed" style={{ color: '#9f9fa9' }}>
              事前登録済みのキャストのみ利用できます。登録後のログインは電話番号へのSMS認証で行います。
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[36px] rounded-[10px] text-sm font-semibold transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                color: '#18181b',
              }}
            >
              {isLoading ? '登録中...' : (
                <>
                  新規登録
                  <ArrowRightIcon />
                </>
              )}
            </button>

            <Link
              href="/cast/m/login"
              className="block w-full h-[37px] rounded-[10px] border text-center leading-[37px] text-sm"
              style={{ borderColor: '#3f3f47', color: '#d4d4d8' }}
            >
              Login
            </Link>
          </form>

          <div className="mt-3 text-center">
            <Link href="/cast/register" className="text-sm hover:underline" style={{ color: '#9f9fa9' }}>
              PC版はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
