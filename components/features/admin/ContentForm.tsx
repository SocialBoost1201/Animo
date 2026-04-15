'use client'

import { createContent } from '@/lib/actions/contents'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { showToast } from '@/components/ui/Toast'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState, useRef } from 'react'

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
  const formRef = useRef<HTMLFormElement>(null)

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
        showToast(result.error, 'error')
      } else {
        router.push(contentType === 'gallery' ? '/admin/gallery' : '/admin/contents')
      }
    } catch (error: unknown) {
      const err = error as Error;
      showToast(err.message, 'error')
    } finally {
      setIsPending(false)
    }
  }



  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link 
          href={contentType === 'gallery' ? '/admin/gallery' : '/admin/contents'} 
          className="inline-flex items-center text-xs font-bold tracking-widest text-[#8a8478] hover:text-[#f4f1ea] transition-all group"
        >
          <ArrowLeft size={14} className="mr-2 transition-transform group-hover:-translate-x-1" /> 一覧へ戻る
        </Link>
      </div>

      <div className="bg-black/95 border border-white/10 shadow-2xl rounded-sm p-8 sm:p-10">
        <h2 className="text-xl font-serif font-bold tracking-tight text-[#f4f1ea] mb-8 pb-6 border-b border-white/5">
          {isEditing ? 'Edit Content' : 'New Content'}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="contentType" className="block text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase">Type *</label>
              <div className="relative">
                <select 
                  id="contentType"
                  name="type"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-[#f4f1ea] focus:outline-none focus:border-gold/50 transition-all appearance-none outline-none"
                >
                  <option value="news">ニュース (News)</option>
                  <option value="event">イベント (Event)</option>
                  <option value="gallery">ギャラリー (Gallery)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5a5650]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            {contentType === 'event' && (
              <div className="space-y-2">
                <label htmlFor="content_date" className="block text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase">Event Date</label>
                <input 
                  id="content_date"
                  name="content_date"
                  type="date" 
                  defaultValue={initialData?.content_date?.slice(0, 10)}
                  className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-[#f4f1ea] focus:outline-none focus:border-gold/50 transition-all outline-none"
                />
              </div>
            )}
            
            {contentType === 'gallery' && (
              <div className="space-y-2">
                <label htmlFor="category" className="block text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase">Category (Tag)</label>
                <div className="relative">
                  <select 
                    id="category"
                    name="category"
                    defaultValue={initialData?.category || 'floor'}
                    className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-2.5 text-sm text-[#f4f1ea] focus:outline-none focus:border-gold/50 transition-all appearance-none outline-none"
                  >
                    <option value="floor">メインフロア (Floor)</option>
                    <option value="curtain">カーテンルーム (Curtain Room)</option>
                    <option value="chandelier">シャンデリア (Chandelier)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5a5650]">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase">
              {contentType === 'gallery' ? 'Caption' : 'Title *'}
            </label>
            <input 
              id="title"
              name="title"
              type="text" 
              defaultValue={initialData?.title}
              required={contentType !== 'gallery'}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-[#f4f1ea] focus:outline-none focus:border-gold/50 transition-all outline-none placeholder:text-[#5a5650]"
              placeholder={contentType === 'gallery' ? "美しい大シャンデリア" : "記事のタイトル"}
            />
          </div>

          {contentType !== 'gallery' && (
            <div className="space-y-2">
              <label htmlFor="description" className="block text-[10px] font-bold tracking-[2px] text-[#8a8478] uppercase">Description / Content</label>
              <textarea 
                id="description"
                name="description"
                rows={10}
                defaultValue={initialData?.description}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm text-[#f4f1ea] focus:outline-none focus:border-gold/50 transition-all outline-none placeholder:text-[#5a5650] resize-none"
                placeholder="本文を入力してください。"
              />
            </div>
          )}

          <div className="border-t border-white/5 pt-8">
            <label htmlFor="is_published" className="flex items-center gap-4 cursor-pointer group w-fit">
              <div className="relative flex items-center">
                <input 
                  id="is_published"
                  type="checkbox" 
                  name="is_published"
                  defaultChecked={initialData?.is_published ?? true}
                  className="w-5 h-5 accent-gold bg-[#1a1a1b] border-white/10 rounded transition-all cursor-pointer"
                />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#8a8478] group-hover:text-[#f4f1ea] transition-colors">公開する (Published)</span>
            </label>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full py-6 font-bold tracking-[3px] text-xs uppercase bg-gold hover:bg-gold/90 text-black shadow-lg shadow-gold/10 transition-all active:scale-[0.99]"
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
