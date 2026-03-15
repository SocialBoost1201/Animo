'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { castForgotPassword } from '@/lib/actions/cast-auth';
import { toast } from 'sonner';

export default function CastForgotPasswordPage() {
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
      <div className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-sm text-center">
          <h2 className="font-serif text-xl tracking-widest text-[#171717] mb-4">メール送信完了</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            パスワード再設定用のリンクを送信しました。<br />メールをご確認ください。
          </p>
          <Link href="/cast/login" className="inline-block px-8 py-3 bg-[#171717] text-white text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-gold transition-all">
            ログインへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <h1 className="font-serif text-xl tracking-[0.2em] text-[#171717]">パスワード再設定</h1>
          <p className="text-[10px] text-gray-400 tracking-wider mt-2">登録したメールアドレスを入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">Email</label>
            <input name="email" type="email" required autoComplete="email"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="cast@example.com" />
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-4 bg-[#171717] hover:bg-gold text-white font-bold tracking-[0.2em] uppercase text-xs rounded-xl transition-all disabled:opacity-50">
            {isLoading ? '送信中...' : '再設定メールを送信'}
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
