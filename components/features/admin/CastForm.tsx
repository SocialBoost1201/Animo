'use client'

import { createCast, updateCast } from '@/lib/actions/casts'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

type Cast = any

export function CastForm({ initialData }: { initialData?: Cast }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const isEditing = !!initialData

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)

    const formData = new FormData(e.currentTarget)

    // チェックボックスが未選択の場合 false を明示
    if (!formData.get('is_active')) {
      formData.set('is_active', 'false')
    }

    try {
      let result;
      if (isEditing) {
        result = await updateCast(initialData.id, formData)
      } else {
        result = await createCast(formData)
      }

      if (result.error) {
        alert(result.error)
      } else {
        router.push('/admin/casts')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setIsPending(false)
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors'
  const labelClass = 'block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2'

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/casts" className="inline-flex items-center text-sm text-gray-500 hover:text-[#171717] transition-colors">
          <ArrowLeft size={16} className="mr-1" /> 一覧へ戻る
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-8">
        <h2 className="text-xl font-serif tracking-widest text-[#171717] mb-6">
          {isEditing ? 'Edit Cast' : 'New Cast'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 源氏名 */}
          <div>
            <label className={labelClass}>源氏名 (Stage Name) *</label>
            <input
              name="stage_name"
              type="text"
              defaultValue={initialData?.stage_name || initialData?.name}
              required
              className={inputClass}
              placeholder="あいか"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 年齢 */}
            <div>
              <label className={labelClass}>年齢 (Age)</label>
              <input
                name="age"
                type="number"
                min="18"
                max="99"
                defaultValue={initialData?.age}
                className={inputClass}
                placeholder="22"
              />
            </div>

            {/* 表示順 */}
            <div>
              <label className={labelClass}>表示順 (Display Order)</label>
              <input
                name="display_order"
                type="number"
                min="0"
                defaultValue={initialData?.display_order ?? 0}
                className={inputClass}
                placeholder="0"
              />
            </div>
          </div>

          {/* 趣味 */}
          <div>
            <label className={labelClass}>趣味 (Hobby)</label>
            <input
              name="hobby"
              type="text"
              defaultValue={initialData?.hobby}
              className={inputClass}
              placeholder="旅行、カフェ巡り"
            />
          </div>

          {/* コメント */}
          <div>
            <label className={labelClass}>一言コメント (Comment)</label>
            <textarea
              name="comment"
              rows={4}
              defaultValue={initialData?.comment}
              className={inputClass}
              placeholder="お客様へのメッセージ"
            />
          </div>

          {/* 画像 URL */}
          <div>
            <label className={labelClass}>画像 URL (Image URL)</label>
            <input
              name="image_url"
              type="text"
              defaultValue={initialData?.image_url}
              className={inputClass}
              placeholder="https://..."
            />
          </div>

          {/* 在籍フラグ */}
          <div className="border-t border-gray-100 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={initialData ? (initialData.is_active ?? true) : true}
                value="true"
                className="w-5 h-5 accent-[var(--color-gold)] rounded bg-gray-100 border-gray-300"
              />
              <span className="text-sm font-bold text-[#171717]">在籍中（公開する）</span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-8">オフにすると公開ページに表示されなくなります</p>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full pt-3 pb-3 font-bold tracking-widest text-sm"
              disabled={isPending}
            >
              {isPending ? '保存中...' : (isEditing ? '更新する' : '登録する')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
