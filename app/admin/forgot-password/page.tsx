'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { adminForgotPasswordAction } from '@/lib/actions/admin-auth'

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
  )
}

export default function AdminForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(adminForgotPasswordAction, null)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div
        className="w-full max-w-[448px] rounded-[16px] p-1"
        style={{
          background:
            'linear-gradient(131deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] p-10"
          style={{
            background:
              'linear-gradient(131deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
            boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
          }}
        >
          <div className="text-center mb-6">
            <p
              className="text-white text-sm tracking-[0.3em] uppercase font-light mb-1"
              style={{ fontFamily: 'var(--font-serif, serif)' }}
            >
              CLUB ANIMO
            </p>
            <h1 className="text-white text-2xl font-bold tracking-[0.2em] uppercase mb-4">
              ANIMO CMS
            </h1>
            <p
              className="text-lg font-bold"
              style={{
                background:
                  'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
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

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                メールアドレス
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#71717b' }}
                  aria-hidden
                >
                  <MailIcon />
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-[10px] pl-11 pr-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="example@email.com"
                  style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
                />
              </div>
            </div>

            {(state?.error || state?.message) && (
              <p
                className="text-xs text-center rounded-lg py-2.5 px-4"
                style={{
                  color: state?.error ? '#f87171' : '#9f9fa9',
                  background: state?.error ? 'rgba(239,68,68,0.1)' : 'rgba(63,63,71,0.35)',
                }}
              >
                {state?.error ?? state?.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-[48px] rounded-[10px] text-base font-semibold transition-opacity disabled:opacity-60"
              style={{
                background:
                  'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                color: '#18181b',
              }}
            >
              {isPending ? '送信中...' : 'リセットリンクを送信'}
            </button>

            <Link
              href="/admin/login"
              className="block w-full h-[49px] rounded-[10px] border text-center leading-[49px] text-base"
              style={{ borderColor: '#3f3f47', color: '#d4d4d8' }}
            >
              ← ログイン画面に戻る
            </Link>
          </form>

          <div className="mt-4 text-center">
            <Link href="/admin/m/forgot-password" className="text-sm hover:underline" style={{ color: '#9f9fa9' }}>
              モバイル版はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

