'use client'

import { createCast, updateCast } from '@/lib/actions/casts'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

type Cast = any // DB Schema Type

export function CastForm({ initialData }: { initialData?: Cast }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const isEditing = !!initialData

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    
    // Checkbox workaround for FormData
    if (!formData.get('is_today')) {
      formData.set('is_today', '')
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Name *</label>
              <input 
                name="name"
                type="text" 
                defaultValue={initialData?.name}
                required
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                placeholder="あいか"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Slug (URL) *</label>
              <input 
                name="slug"
                type="text" 
                defaultValue={initialData?.slug}
                required
                pattern="^[a-zA-Z0-9-]+$"
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                placeholder="aika"
                title="半角英数字とハイフンのみ"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Age</label>
              <input 
                name="age"
                type="number" 
                defaultValue={initialData?.age}
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                placeholder="22"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Height (cm)</label>
              <input 
                name="height"
                type="number" 
                defaultValue={initialData?.height}
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
                placeholder="160"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Hobby</label>
            <input 
              name="hobby"
              type="text" 
              defaultValue={initialData?.hobby}
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              placeholder="旅行、カフェ巡り"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Comment</label>
            <textarea 
              name="comment"
              rows={4}
              defaultValue={initialData?.comment}
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              placeholder="お客様へのメッセージ"
            />
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Status</label>
              <select 
                name="status"
                defaultValue={initialData?.status || 'public'}
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-colors bg-white"
              >
                <option value="public">Public (公開)</option>
                <option value="private">Private (非公開)</option>
              </select>
            </div>

            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_today"
                  defaultChecked={initialData?.is_today}
                  className="w-5 h-5 accent-[var(--color-gold)] rounded bg-gray-100 border-gray-300"
                />
                <span className="text-sm font-bold text-[#171717]">本日の出勤にする (Today's Shift)</span>
              </label>
            </div>
          </div>

          <div className="pt-6">
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
