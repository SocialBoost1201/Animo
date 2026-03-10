'use client'

import { createContent } from '@/lib/actions/contents'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

type ContentData = {
  type?: string;
  content_date?: string;
  category?: string;
  title?: string;
  description?: string;
  is_published?: boolean;
};

export function ContentForm({ initialData }: { initialData?: ContentData | null }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const isEditing = !!initialData

  const [contentType, setContentType] = useState(initialData?.type || 'news')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    
    // Checkbox boolean
    if (!formData.get('is_published')) {
      formData.set('is_published', '')
    }

    try {
      let result;
      if (isEditing) {
        // Edit action would be here
        result = { error: 'Not implemented. Please use new.' }
      } else {
        result = await createContent(formData)
      }

      if (result.error) {
        alert(result.error)
      } else {
        router.push(contentType === 'gallery' ? '/admin/gallery' : '/admin/contents')
      }
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link 
          href={contentType === 'gallery' ? '/admin/gallery' : '/admin/contents'} 
          className="inline-flex items-center text-sm text-gray-500 hover:text-[#171717] transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> 一覧へ戻る
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-8">
        <h2 className="text-xl font-serif tracking-widest text-[#171717] mb-6">
          {isEditing ? 'Edit Content' : 'New Content'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Type *</label>
              <select 
                name="type"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors bg-white"
              >
                <option value="news">ニュース (News)</option>
                <option value="event">イベント (Event)</option>
                <option value="gallery">ギャラリー (Gallery)</option>
              </select>
            </div>

            {contentType === 'event' && (
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Event Date</label>
                <input 
                  name="content_date"
                  type="date" 
                  defaultValue={initialData?.content_date?.slice(0, 10)}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            )}
            
            {contentType === 'gallery' && (
              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Category (Tag)</label>
                <select 
                  name="category"
                  defaultValue={initialData?.category || 'floor'}
                  className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors bg-white"
                >
                  <option value="floor">メインフロア (Floor)</option>
                  <option value="curtain">カーテンルーム (Curtain Room)</option>
                  <option value="chandelier">シャンデリア (Chandelier)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
              {contentType === 'gallery' ? 'Caption' : 'Title *'}
            </label>
            <input 
              name="title"
              type="text" 
              defaultValue={initialData?.title}
              required={contentType !== 'gallery'}
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder={contentType === 'gallery' ? "美しい大シャンデリア" : "記事のタイトル"}
            />
          </div>

          {contentType !== 'gallery' && (
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Description / Content</label>
              <textarea 
                name="description"
                rows={8}
                defaultValue={initialData?.description}
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="本文を入力してください"
              />
            </div>
          )}

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center h-full">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_published"
                  defaultChecked={initialData?.is_published ?? true}
                  className="w-5 h-5 accent-gold rounded bg-gray-100 border-gray-300"
                />
                <span className="text-sm font-bold text-[#171717]">公開する (Published)</span>
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
