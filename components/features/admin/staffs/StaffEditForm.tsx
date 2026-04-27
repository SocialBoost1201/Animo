'use client';

import { type ReactElement, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Save, Tag, ToggleLeft, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { deleteStaff, type StaffSlave, updateStaff } from '@/lib/actions/staffs';

const ROLE_OPTIONS = [
  { value: '', label: '一般スタッフ' },
  { value: 'manager', label: 'マネージャー' },
  { value: 'owner', label: 'オーナー' },
] as const;

const inputCls =
  'w-full bg-[#1c1d22] border border-[#ffffff0f] rounded-[10px] px-4 py-2.5 text-[13px] text-[#f4f1ea] placeholder-[#5a5650] outline-none focus:border-[#dfbd6950] focus:bg-[#1f2028] transition-colors';

function FieldLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>
  label: string
}): ReactElement {
  return (
    <div className="flex items-center gap-2 mb-2">
      <Icon size={12} className="text-[#5a5650]" />
      <span className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#5a5650]">{label}</span>
    </div>
  );
}

type StaffEditFormProps = {
  staff: StaffSlave
};

export function StaffEditForm({ staff }: StaffEditFormProps): ReactElement {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleting] = useTransition();
  const [isActive, setIsActive] = useState<boolean>(staff.is_active);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set('is_active', String(isActive));

    startTransition(async () => {
      const result = await updateStaff(staff.id, fd);
      if (result.error) {
        setError(result.error);
        return;
      }

      toast.success('スタッフ情報を更新しました');
      router.push('/admin/staffs');
      router.refresh();
    });
  };

  const handleDelete = (): void => {
    setError(null);
    const ok = window.confirm('このスタッフを削除しますか？この操作は取り消せません。');
    if (!ok) return;

    startDeleting(async () => {
      const result = await deleteStaff(staff.id);
      if (result.error) {
        setError(result.error);
        return;
      }

      toast.success('スタッフを削除しました');
      router.push('/admin/staffs');
      router.refresh();
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-4 py-2">
        <Link
          href="/admin/staffs"
          className="flex items-center gap-1.5 text-[12px] text-[#8a8478] hover:text-[#f4f1ea] transition-colors"
        >
          <ArrowLeft size={13} />
          スタッフ一覧に戻る
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting || isPending}
          className="inline-flex items-center gap-2 rounded-[10px] border border-[#d4785a40] bg-[#d4785a10] px-3 py-2 text-[12px] font-semibold text-[#d4785a] hover:bg-[#d4785a18] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          {isDeleting ? '削除中...' : '削除'}
        </button>
      </div>

      <div>
        <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">スタッフ情報を編集</h1>
        <p className="text-[11px] text-[#8a8478] mt-1">登録済みスタッフ情報を更新します</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-6 space-y-5">
          <div>
            <FieldLabel icon={User} label="氏名（必須）" />
            <input name="name" placeholder="例：山田 花子" required defaultValue={staff.name} className={inputCls} />
          </div>

          <div>
            <FieldLabel icon={User} label="表示名（必須）" />
            <input
              name="display_name"
              placeholder="例：はなこ"
              required
              defaultValue={staff.display_name}
              className={inputCls}
            />
          </div>

          <div>
            <FieldLabel icon={Tag} label="役職" />
            <select name="role" className={inputCls} defaultValue={staff.role ?? ''}>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel icon={ToggleLeft} label="ステータス" />
            <div className="flex gap-2">
              {[{ value: true, label: 'アクティブ' }, { value: false, label: '非アクティブ' }].map((opt) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => setIsActive(opt.value)}
                  className={`flex-1 py-2 rounded-[10px] border text-[12px] font-bold transition-all ${
                    isActive === opt.value
                      ? opt.value
                        ? 'border-green-500/40 text-green-500 bg-[#17181c] shadow-inner'
                        : 'border-[#dfbd69]/40 text-[#dfbd69] bg-[#17181c] shadow-inner'
                      : 'border-[#ffffff0a] text-[#5a5650] hover:border-[#ffffff18]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-[12px] text-[#f87171] bg-[#f871711a] border border-[#f8717130] rounded-[10px] px-4 py-2.5">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Link
            href="/admin/staffs"
            className="flex-1 text-center py-2.5 rounded-[12px] border border-[#ffffff0f] text-[13px] text-[#8a8478] hover:text-[#f4f1ea] hover:border-[#ffffff18] transition-all"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            disabled={isPending || isDeleting}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(90deg,rgba(223,189,105,1) 0%,rgba(146,111,52,1) 100%)' }}
          >
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isPending ? '保存中...' : '更新する'}
          </button>
        </div>
      </form>
    </div>
  );
}
