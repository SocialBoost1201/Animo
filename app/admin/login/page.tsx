'use client';

import React, { useActionState } from 'react';
import { login } from '@/lib/actions/auth';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-light)] p-6">
      <div className="w-full max-w-sm bg-white border border-gray-100 shadow-sm p-8 rounded-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif tracking-widest text-[#171717] text-2xl uppercase mb-2">Club Animo</h1>
          <p className="text-xs text-gray-500 tracking-widest uppercase">Admin System</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Email</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full border-b-2 border-gray-200 py-3 min-h-[48px] text-sm focus:outline-none focus:border-gold focus:ring-0 transition-colors bg-transparent"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Password</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full border-b-2 border-gray-200 py-3 min-h-[48px] text-sm focus:outline-none focus:border-gold focus:ring-0 transition-colors bg-transparent"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <p className="text-red-500 text-xs text-center">{state.error}</p>
          )}

          <Button 
            type="submit" 
            className="w-full pt-4 pb-4 font-bold tracking-widest text-sm"
            disabled={isPending}
          >
            {isPending ? '認証中...' : 'LOGIN'}
          </Button>
        </form>
      </div>
    </div>
  );
}
