'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { castLogin } from '@/lib/actions/cast-auth';
import { toast } from 'sonner';

export default function CastLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await castLogin(formData);
      if (result && !result.success) {
        toast.error(result.error);
      }
      // 成功時は redirect されるため通常ここには到達しない
    } catch {
      // redirect は throw するため正常
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl tracking-[0.4em] text-[#171717] font-bold">ANIMO</h1>
          <p className="text-[10px] text-gold tracking-[0.3em] uppercase mt-2 font-serif">Cast Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="cast@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-serif">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#171717] hover:bg-gold text-white font-bold tracking-[0.2em] uppercase text-xs rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <Link href="/cast/forgot-password" className="block text-[11px] text-gray-400 hover:text-gold transition-colors tracking-wider">
            パスワードを忘れた方はこちら
          </Link>
          <Link href="/cast/register" className="block text-[11px] text-gold hover:text-[#171717] transition-colors tracking-wider font-bold">
            新規登録はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
