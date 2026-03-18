'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // URLのハッシュ・クエリパラメータからセッションを確認
    // Supabaseはリセットリンク経由でアクセスされると自動的にセッションを設定する
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsReady(true);
      } else {
        // ハッシュ内のトークンを処理
        const { error } = await supabase.auth.exchangeCodeForSession(
          searchParams.get('code') || ''
        );
        if (!error) {
          setIsReady(true);
        } else {
          toast.error('リセットリンクが無効または期限切れです。再度お試しください。');
        }
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('パスワードが一致しません。');
      return;
    }
    if (password.length < 8) {
      toast.error('パスワードは8文字以上にしてください。');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      toast.error('パスワードの更新に失敗しました。もう一度お試しください。');
    } else {
      toast.success('パスワードを更新しました。新しいパスワードでログインしてください。');
      setTimeout(() => router.push('/cast/login'), 2000);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-serif text-2xl tracking-[0.3em] text-[#171717] font-bold">
            パスワード再設定
          </h1>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-2 font-serif">
            Reset Password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">
              新しいパスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="8文字以上"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">
              パスワード（確認）
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="再入力"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#171717] hover:bg-gold text-white font-bold tracking-[0.2em] uppercase text-xs rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? '更新中...' : 'パスワードを更新する'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/cast/login" className="text-[11px] text-gray-400 hover:text-gold transition-colors tracking-wider">
            ← ログインへ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
