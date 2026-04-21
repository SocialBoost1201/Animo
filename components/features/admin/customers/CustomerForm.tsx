'use client';

import type { ComponentType } from 'react';
import { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Save, Loader2, ArrowLeft, User, Phone, Mail, Star, FileText, Hash } from 'lucide-react';
import Link from 'next/link';
import { createCustomer, updateCustomerFull } from '@/lib/actions/customers';

type Customer = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  rank: string | null;
  note: string | null;
  total_visits: number | null;
};

const RANK_OPTIONS = [
  { value: 'normal', label: '一般', cls: 'border-[#ffffff20] text-[#8a8478]' },
  { value: 'regular', label: '常連', cls: 'border-[#72b89440] text-[#72b894]' },
  { value: 'vip',    label: '重要顧客', cls: 'border-[#dfbd6940] text-[#dfbd69]' },
];

type FieldLabelIcon = ComponentType<{
  className?: string;
  size?: string | number;
}>;

function FieldLabel({ icon: Icon, label }: { icon: FieldLabelIcon; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon size={12} className="text-[#5a5650]" />
      <span className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#5a5650]">{label}</span>
    </div>
  );
}

const inputCls =
  'w-full bg-[#1c1d22] border border-[#ffffff0f] rounded-[10px] px-4 py-2.5 text-[13px] text-[#f4f1ea] placeholder-[#5a5650] outline-none focus:border-[#dfbd6950] focus:bg-[#1f2028] transition-colors';

export function CustomerForm({ initialData }: { initialData?: Customer }) {
  const isEdit = !!initialData;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rank, setRank] = useState(initialData?.rank ?? 'normal');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set('rank', rank);

    startTransition(async () => {
      const result = isEdit
        ? await updateCustomerFull(initialData.id, fd)
        : await createCustomer(fd);

      if (!result.success) {
        setError(result.error ?? '操作に失敗しました');
        return;
      }

      toast.success(isEdit ? '顧客情報を更新しました' : '顧客を登録しました');
      router.push('/admin/customers');
      router.refresh();
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 py-2">
        <Link
          href="/admin/customers"
          className="flex items-center gap-1.5 text-[12px] text-[#8a8478] hover:text-[#f4f1ea] transition-colors"
        >
          <ArrowLeft size={13} />
          顧客一覧に戻る
        </Link>
      </div>

      <div>
        <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">
          {isEdit ? '顧客情報を編集' : '顧客を新規登録'}
        </h1>
        <p className="text-[11px] text-[#8a8478] mt-1">
          {isEdit ? `${initialData.name ?? '名称未設定'} の情報を変更します` : '新しい顧客データを登録します'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-6 space-y-5">
          {/* 顧客名 */}
          <div>
            <FieldLabel icon={User} label="顧客名（必須）" />
            <input
              name="name"
              defaultValue={initialData?.name ?? ''}
              placeholder="例：山田 太郎"
              required
              className={inputCls}
            />
          </div>

          {/* 電話 / メール */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel icon={Phone} label="電話番号" />
              <input
                name="phone"
                type="tel"
                defaultValue={initialData?.phone ?? ''}
                placeholder="090-0000-0000"
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel icon={Mail} label="メールアドレス" />
              <input
                name="email"
                type="email"
                defaultValue={initialData?.email ?? ''}
                placeholder="example@email.com"
                className={inputCls}
              />
            </div>
          </div>

          {/* ランク */}
          <div>
            <FieldLabel icon={Star} label="ランク" />
            <div className="flex gap-2">
              {RANK_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRank(opt.value)}
                  className={`flex-1 py-2 rounded-[10px] border text-[12px] font-bold transition-all ${
                    rank === opt.value
                      ? `${opt.cls} bg-[#17181c] shadow-inner`
                      : 'border-[#ffffff0a] text-[#5a5650] hover:border-[#ffffff18]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 来店回数（編集時のみ） */}
          {isEdit && (
            <div>
              <FieldLabel icon={Hash} label="来店回数" />
              <input
                name="total_visits"
                type="number"
                min="0"
                defaultValue={initialData.total_visits ?? 0}
                className={inputCls}
              />
            </div>
          )}

          {/* 備考 */}
          <div>
            <FieldLabel icon={FileText} label="備考メモ" />
            <textarea
              name="note"
              defaultValue={initialData?.note ?? ''}
              placeholder="重要顧客対応メモ、好みのキャスト、アレルギーなど"
              rows={4}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-[#f87171] bg-[#f871711a] border border-[#f8717130] rounded-[10px] px-4 py-2.5">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            href="/admin/customers"
            className="flex-1 text-center py-2.5 rounded-[12px] border border-[#ffffff0f] text-[13px] text-[#8a8478] hover:text-[#f4f1ea] hover:border-[#ffffff18] transition-all"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(90deg,rgba(223,189,105,1) 0%,rgba(146,111,52,1) 100%)' }}
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isPending ? '保存中...' : isEdit ? '変更を保存' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  );
}
