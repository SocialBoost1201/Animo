'use client';

import React, { useActionState, useState } from 'react';
import Link from 'next/link';
import { login } from '@/lib/actions/auth';

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Card (Figma-like) */}
      <div
        className="w-full max-w-[448px] rounded-[16px] p-1"
        style={{
          background:
            'linear-gradient(128deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] p-10"
          style={{
            background:
              'linear-gradient(128deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
            boxShadow:
              '0px 25px 50px 0px rgba(0,0,0,0.25)',
          }}
        >
        {/* Header */}
        <div className="text-center mb-8">
          <p
            className="text-sm tracking-[0.3em] uppercase font-light mb-1 bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] bg-clip-text text-transparent"
            style={{ fontFamily: 'var(--font-serif, serif)' }}
          >
            CLUB ANIMO
          </p>
          <h1
            className="text-3xl font-bold tracking-[0.2em] uppercase mb-5 bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] bg-clip-text text-transparent"
          >
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
            Welcome to Animo Dashboard
          </p>
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-5">
          {/* Login ID */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-sm mb-2"
              style={{ color: '#9f9fa9' }}
            >
              ログインID
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
              placeholder="IDを入力してください"
              style={{
                background: '#27272a',
                border: '0.556px solid #3f3f47',
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm mb-2"
              style={{ color: '#9f9fa9' }}
            >
              ログインパスワード
            </label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="w-full rounded-[10px] px-4 py-3 pr-12 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                placeholder="パスワードを入力してください"
                style={{
                  background: '#27272a',
                  border: '0.556px solid #3f3f47',
                }}
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

          {/* Error */}
          {state?.error && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 rounded-lg py-2.5 px-4">
              {state.error}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            id="admin-login-submit"
            disabled={isPending}
            className="w-full h-[48px] rounded-[10px] text-base font-semibold transition-opacity disabled:opacity-60 mt-2"
            style={{
              background:
                'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
              color: '#18181b',
            }}
          >
            {isPending ? '認証中...' : 'ログイン'}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-7 text-center space-y-3">
          <Link
            href="/admin/forgot-password"
            className="block text-sm transition-colors"
            style={{ color: '#9f9fa9' }}
          >
            パスワードを忘れた方はこちら
          </Link>
          <p className="text-sm tracking-wide" style={{ color: '#9f9fa9' }}>
            アカウントをお持ちでない方は{' '}
            <Link
              href="/admin/register"
              className="font-medium transition-colors hover:underline"
              style={{ color: '#dfbd69' }}
            >
              新規登録
            </Link>
          </p>
          <Link
            href="/admin/m/login"
            className="block text-sm hover:underline"
            style={{ color: '#9f9fa9' }}
          >
            モバイル版はこちら
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
