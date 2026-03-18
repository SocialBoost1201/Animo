'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createNotice } from '@/lib/actions/internal-notices';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';

export default function NewNoticePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createNotice(formData);
      if (result.success) {
        toast.success('お知らせを作成し、キャストに配信しました');
        router.push('/admin/internal-notices');
      } else {
        toast.error(result.error || '作成に失敗しました');
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
        <Link 
          href="/admin/internal-notices"
          className="p-2 text-gray-400 hover:text-[#171717] hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">New Notice</h1>
          <p className="text-sm text-gray-500 mt-1">新しいお知らせの作成・配信</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Helper Alert */}
        <div className="bg-blue-50/50 border-b border-blue-100 p-4 flex items-start gap-3 text-sm text-blue-800">
          <AlertCircle size={20} className="shrink-0 text-blue-500 mt-0.5" />
          <p>
            作成したお知らせは、キャスト全員のダッシュボードに「未読」として即時配信されます。
            <br className="hidden sm:block" />重要な伝達事項や今月のシフト提出ルールなどを記載してください。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          
          <div className="space-y-6">
            
            {/* Importance */}
            <div>
              <label className="block text-sm font-bold text-[#171717] mb-3">重要度</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors [&:has(input:checked)]:border-[#171717] [&:has(input:checked)]:bg-gray-50">
                  <input type="radio" name="importance" value="normal" defaultChecked className="w-4 h-4 text-[#171717] focus:ring-[#171717] border-gray-300" />
                  <span className="text-sm font-medium">通常</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-red-50 transition-colors [&:has(input:checked)]:border-red-600 [&:has(input:checked)]:bg-red-50">
                  <input type="radio" name="importance" value="high" className="w-4 h-4 text-red-600 focus:ring-red-600 border-gray-300" />
                  <span className="text-sm font-medium text-red-700">重要 (優先表示)</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-[#171717] mb-2">タイトル</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="例: 【重要】年末年始の営業スケジュールについて"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-bold text-[#171717] mb-2">
                本文
                <span className="text-xs font-normal text-gray-500 ml-2">※改行はそのまま反映されます</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                placeholder="キャストへのお知らせ内容を入力してください..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all resize-y"
              ></textarea>
            </div>

          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 bg-[#171717] hover:bg-gold text-white px-8 py-3.5 text-sm font-bold tracking-wider transition-all duration-300 disabled:opacity-50 rounded-xl shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isPending ? '配信中...' : 'お知らせを配信する'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
