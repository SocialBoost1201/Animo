'use client'

import React, { useActionState, useState } from 'react'
import Link from 'next/link'
import { adminRegisterAction } from '@/lib/actions/admin-auth'

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
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
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

export default function AdminRegisterPage() {
  const [state, formAction, isPending] = useActionState(adminRegisterAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div
        className="w-full max-w-[448px] rounded-[16px] p-1"
        style={{
          background:
            'linear-gradient(117deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] p-8"
          style={{
            background:
              'linear-gradient(117deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
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
              className="text-xl font-bold"
              style={{
                background:
                  'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Sign Up
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                  苗字
                </label>
                <input
                  name="lastName"
                  required
                  className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="山田"
                  style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                  名前
                </label>
                <input
                  name="firstName"
                  required
                  className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="太郎"
                  style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                源氏名
              </label>
              <input
                name="stageName"
                required
                className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="源氏名を入力してください"
                style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                携帯番号
              </label>
              <input
                name="phone"
                inputMode="tel"
                required
                className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="090-1234-5678"
                style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                メールアドレス
              </label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="example@email.com"
                style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
              />
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                パスワード
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-[10px] px-4 py-3 pr-12 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="パスワードを入力"
                  style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                パスワード確認
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="w-full rounded-[10px] px-4 py-3 pr-12 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="パスワードを再入力"
                  style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  aria-label={showConfirmPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
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
              {isPending ? '送信中...' : '新規登録'}
            </button>

            <Link
              href="/admin/login"
              className="block w-full h-[49px] rounded-[10px] border text-center leading-[49px] text-base"
              style={{ borderColor: '#3f3f47', color: '#d4d4d8' }}
            >
              Login
            </Link>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link href="/admin/m/register" className="text-sm hover:underline" style={{ color: '#9f9fa9' }}>
              モバイル版はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

