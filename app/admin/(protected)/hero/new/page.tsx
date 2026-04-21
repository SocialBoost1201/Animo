'use client'

import { createHeroMedia } from '@/lib/actions/inquiries'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { showToast } from '@/components/ui/Toast'

export default function NewHeroMediaPage() {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    
    const formData = new FormData(e.currentTarget)
    
    if (!formData.get('is_active')) {
      formData.set('is_active', '')
    }

    try {
      const result = await createHeroMedia(formData)
      if (result.error) {
        showToast(result.error, 'error')
      } else {
        router.push('/admin/hero')
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
      <div className="mb-6">
        <Link href="/admin/hero" className="inline-flex items-center text-sm text-gray-500 hover:text-[#171717] transition-colors">
          <ArrowLeft size={16} className="mr-1" /> 一覧へ戻る
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-8">
        <h2 className="text-xl font-serif tracking-widest text-[#171717] mb-6">ヒーロー画像・動画を追加</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="hero_type" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">種別 *</label>
              <select 
                id="hero_type"
                name="type"
                required
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors bg-white"
              >
                <option value="video">動画 - 推奨</option>
                <option value="image">静止画</option>
              </select>
            </div>
            <div>
              <label htmlFor="hero_title" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">タイトル（管理用） *</label>
              <input 
                id="hero_title"
                name="title"
                type="text" 
                required
                className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="巨大シャンデリアのパン"
              />
            </div>
          </div>

          <div>
            <label htmlFor="hero_url" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">メディアURL（mp4 / webm / jpg） *</label>
            <input 
              id="hero_url"
              name="url"
              type="url" 
              required
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="https://.../video.mp4"
            />
            <p className="text-xs text-gray-400 mt-1">ストレージにアップロードした動画ファイル等のURLを入力</p>
          </div>
          
          <div>
            <label htmlFor="hero_poster_url" className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">ポスター画像URL（動画用）</label>
            <input 
              id="hero_poster_url"
              name="poster_url"
              type="url"
              className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
              placeholder="https://.../poster.jpg"
            />
            <p className="text-xs text-gray-400 mt-1">動画の読み込みが間に合わない場合や、動きを減らす設定のユーザーに表示される画像です。</p>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-6">
            <div className="flex items-center h-full">
              <label htmlFor="is_active" className="flex items-center gap-3 cursor-pointer">
                <input 
                  id="is_active"
                  type="checkbox" 
                  name="is_active"
                  defaultChecked={true}
                  className="w-5 h-5 accent-gold rounded bg-gray-100 border-gray-300"
                />
                <span className="text-sm font-bold text-[#171717]">ローテーションを有効にする</span>
              </label>
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full pt-3 pb-3 font-bold tracking-widest text-sm"
              disabled={isPending}
            >
              {isPending ? '保存中...' : '登録する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
