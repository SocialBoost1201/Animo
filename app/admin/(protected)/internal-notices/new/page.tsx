'use client';

import { useTransition } from 'react';
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
    <div className="max-w-3xl mx-auto space-y-6 font-inter">

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#ffffff0f] pb-5">
        <Link
          href="/admin/internal-notices"
          className="p-2 text-[#5a5650] hover:text-[#f4f1ea] hover:bg-[#ffffff08] rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">新規お知らせ</h1>
          <p className="text-[11px] text-[#8a8478] mt-0.5">新しいお知らせの作成・配信</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">

        {/* Helper Alert */}
        <div className="bg-[#dfbd690d] border-b border-[#dfbd6920] p-4 flex items-start gap-3 text-[12px] text-[#c7c0b2] leading-relaxed">
          <AlertCircle size={18} className="shrink-0 text-[#dfbd69] mt-0.5" />
          <p>
            作成したお知らせは、キャスト全員のダッシュボードに「未読」として即時配信されます。
            <br className="hidden sm:block" />重要な伝達事項や今月のシフト提出ルールなどを記載してください。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">

          <div className="space-y-6">

            {/* Importance */}
            <div>
              <label className="block text-[12px] font-semibold text-[#f4f1ea] mb-3">重要度</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-[#ffffff14] bg-[#1c1d22] rounded-[10px] text-[#c7c0b2] hover:bg-[#ffffff05] transition-colors [&:has(input:checked)]:border-[#dfbd69] [&:has(input:checked)]:bg-[#dfbd6914] [&:has(input:checked)]:text-[#f4f1ea]">
                  <input type="radio" name="importance" value="normal" defaultChecked className="w-4 h-4 accent-[#dfbd69]" />
                  <span className="text-[12px] font-medium">通常</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-[#ffffff14] bg-[#1c1d22] rounded-[10px] text-[#c8884d] hover:bg-[#c8323208] transition-colors [&:has(input:checked)]:border-[#c8884d] [&:has(input:checked)]:bg-[#c8323214]">
                  <input type="radio" name="importance" value="high" className="w-4 h-4 accent-[#c8884d]" />
                  <span className="text-[12px] font-medium">重要 (優先表示)</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-[12px] font-semibold text-[#f4f1ea] mb-2">タイトル</label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="例: 【重要】年末年始の営業スケジュールについて"
                className="w-full px-4 py-3 bg-[#1c1d22] border border-[#ffffff14] rounded-[10px] text-[13px] text-[#f4f1ea] placeholder:text-[#5a5650] focus:outline-none focus:ring-2 focus:ring-[#dfbd6940] focus:border-[#dfbd69] transition-all"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-[12px] font-semibold text-[#f4f1ea] mb-2">
                本文
                <span className="text-[10px] font-normal text-[#8a8478] ml-2">※改行はそのまま反映されます</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                placeholder="キャストへのお知らせ内容を入力してください..."
                className="w-full px-4 py-3 bg-[#1c1d22] border border-[#ffffff14] rounded-[10px] text-[13px] text-[#f4f1ea] placeholder:text-[#5a5650] focus:outline-none focus:ring-2 focus:ring-[#dfbd6940] focus:border-[#dfbd69] transition-all resize-y leading-relaxed"
              ></textarea>
            </div>

          </div>

          <div className="flex justify-end pt-6 border-t border-[#ffffff0f]">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-[10px] text-[12px] font-bold text-[#0b0b0d] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 w-full sm:w-auto"
              style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
            >
              {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isPending ? '配信中...' : 'お知らせを配信する'}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
