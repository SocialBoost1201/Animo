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

  const primaryImage = initialData?.cast_images?.find((img: any) => img.is_primary) || initialData?.cast_images?.[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    if (!formData.get('is_active')) formData.set('is_active', 'false')

    try {
      const result = isEditing
        ? await updateCast(initialData.id, formData)
        : await createCast(formData)
      if (result.error) alert(result.error)
      else router.push('/admin/casts')
    } catch (err: any) {
      alert(err.message)
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
        <h2 className="text-xl font-serif tracking-widest text-[#171717] mb-8">
          {isEditing ? 'Edit Cast' : 'New Cast'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 源氏名 + slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className={labelClass}>スラグ (URL用) *</label>
              <input
                name="slug"
                type="text"
                defaultValue={initialData?.slug}
                required
                pattern="^[a-zA-Z0-9-]+$"
                className={inputClass}
                placeholder="aika"
                title="半角英数字とハイフンのみ"
              />
              <p className="text-[10px] text-gray-400 mt-1">/cast/aika のように URL になります</p>
            </div>
          </div>

          {/* 年齢 + 表示順 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>年齢 (Age)</label>
              <input name="age" type="number" min="18" max="99"
                defaultValue={initialData?.age} className={inputClass} placeholder="22" />
            </div>
            <div>
              <label className={labelClass}>表示順 (Order)</label>
              <input name="display_order" type="number" min="0"
                defaultValue={initialData?.display_order ?? 0} className={inputClass} placeholder="0" />
            </div>
          </div>

          {/* 趣味 */}
          <div>
            <label className={labelClass}>趣味 (Hobby)</label>
            <input name="hobby" type="text" defaultValue={initialData?.hobby}
              className={inputClass} placeholder="旅行、カフェ巡り" />
          </div>

          {/* コメント */}
          <div>
            <label className={labelClass}>一言コメント (Comment)</label>
            <textarea name="comment" rows={4} defaultValue={initialData?.comment}
              className={inputClass} placeholder="お客様へのメッセージ" />
          </div>

          {/* 画像 URL */}
          <div>
            <label className={labelClass}>画像 URL (Image URL)</label>
            {primaryImage && (
              <div className="mb-2">
                <img src={primaryImage.image_url} alt="現在の画像" className="w-16 h-16 object-cover rounded border border-gray-100" />
              </div>
            )}
            <input name="image_url" type="text"
              defaultValue={primaryImage?.image_url || ''}
              className={inputClass} placeholder="https://..." />
          </div>

          {/* 在籍フラグ */}
          <div className="border-t border-gray-100 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={initialData ? (initialData.is_active ?? true) : true}
                value="true"
                className="w-5 h-5 accent-[var(--color-gold)]"
              />
              <span className="text-sm font-bold text-[#171717]">在籍中（公開する）</span>
            </label>
            <p className="text-xs text-gray-400 mt-1 ml-8">オフにすると公開ページに表示されません</p>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full py-3 font-bold tracking-widest text-sm" disabled={isPending}>
              {isPending ? '保存中...' : (isEditing ? '更新する' : '登録する')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
