'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setIsReady(true)
        return
      }

      const code = searchParams.get('code') || ''
      if (!code) {
        setError('リセットリンクが無効または期限切れです。再度お試しください。')
        return
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchangeError) {
        setError('リセットリンクが無効または期限切れです。再度お試しください。')
        return
      }

      setIsReady(true)
    }

    checkSession()
  }, [searchParams, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('パスワードが一致しません。')
      return
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上にしてください。')
      return
    }

    setIsLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setIsLoading(false)

    if (updateError) {
      setError('パスワードの更新に失敗しました。もう一度お試しください。')
      return
    }

    setMessage('パスワードを更新しました。新しいパスワードでログインしてください。')
    setTimeout(() => router.push('/admin/m/login'), 1500)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">
      <div
        className="w-full max-w-[420px] rounded-[16px] p-1"
        style={{
          background:
            'linear-gradient(131deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] px-8 py-10"
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
              パスワードを更新
            </p>
          </div>

          {error && (
            <p className="text-xs text-center rounded-lg py-2.5 px-4 mb-4" style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}>
              {error}
            </p>
          )}

          {message && (
            <p className="text-xs text-center rounded-lg py-2.5 px-4 mb-4" style={{ color: '#9f9fa9', background: 'rgba(63,63,71,0.35)' }}>
              {message}
            </p>
          )}

          {!isReady ? (
            <div className="py-10 text-center" style={{ color: '#9f9fa9' }}>
              確認中...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                  新しいパスワード
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="8文字以上"
                  style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
                />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#9f9fa9' }}>
                  パスワード（確認）
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
                  placeholder="再入力"
                  style={{ background: '#27272a', border: '0.617px solid #3f3f47' }}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-[48px] rounded-[10px] text-base font-semibold transition-opacity disabled:opacity-60"
                style={{
                  background:
                    'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                  color: '#18181b',
                }}
              >
                {isLoading ? '更新中...' : 'パスワードを更新する'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link href="/admin/m/login" className="block text-sm hover:underline" style={{ color: '#9f9fa9' }}>
              ← ログインへ戻る
            </Link>
            <Link href="/admin/reset-password" className="block text-sm hover:underline" style={{ color: '#9f9fa9' }}>
              PC版はこちら
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminResetPasswordMobilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center" style={{ color: '#9f9fa9' }}>
          読み込み中...
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}

