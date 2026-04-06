'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { castRegister } from '@/lib/actions/cast-auth';
import { toast } from 'sonner';

export default function CastRegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedMessage, setCompletedMessage] = useState(
    '確認メールを送信しました。メール内のリンクで認証を完了してからログインしてください。'
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
        const successMessage = result.message ?? 'アカウントを登録しました。確認メールをご確認ください。';
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
    }
    setIsLoading(false);
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[#FDFBF7]">
        <div className="w-full max-w-sm text-center bg-white p-10 rounded-2xl shadow-luxury">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <span className="text-gold text-2xl">✓</span>
          </div>
          <h2 className="font-serif text-xl tracking-widest text-[#171717] mb-4">登録完了</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">{completedMessage}</p>
          <Link href="/cast/login" className="inline-block px-8 py-3 bg-[#171717] text-white text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-gold transition-all">
            ログインへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[#FDFBF7] relative">
      {/* 登録中のフルスクリーンオーバーレイ */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-serif text-gold tracking-widest">登録処理中...</p>
        </div>
      )}
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-serif text-2xl tracking-[0.3em] text-[#171717] font-bold">新規登録</h1>
          <p className="text-xs text-gray-400 tracking-[0.2em] uppercase mt-2 font-serif">Cast Portal Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {feedback && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                feedback.type === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-green-200 bg-green-50 text-green-700'
              }`}
            >
              <p className="font-bold tracking-[0.12em] uppercase text-xs mb-1">{feedback.title}</p>
              <p>{feedback.message}</p>
            </div>
          )}

          {/* 本名（Real Name） */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">
              本名（Real Name）
            </label>
            <input
              name="realName"
              type="text"
              required
              autoComplete="name"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="山田 花子"
            />
            <p className="text-xs text-gray-300 mt-1.5">店舗に届け出た本名を入力してください（外部には一切表示されません）</p>
          </div>

          {/* 生年月日（Date of Birth） */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">
              生年月日（Date of Birth）
            </label>
            <input
              name="dateOfBirth"
              type="date"
              required
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="cast@example.com"
            />
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="8文字以上"
            />
          </div>

          {/* パスワード確認 */}
          <div>
            <label className="block text-xs uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="再入力"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#171717] hover:bg-gold text-white font-bold tracking-[0.2em] uppercase text-xs rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/cast/login" className="text-xs text-gray-400 hover:text-gold transition-colors tracking-wider">
            ← ログインへ戻る
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-300 leading-relaxed">
          ※ 本名・生年月日は本人確認のみに使用し、外部には一切表示されません。<br />
          ※ 登録後、確認メールで認証が完了するまでログインできません。
        </p>
      </div>
    </div>
  );
}
