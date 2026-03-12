'use client'

import { createCast, updateCast } from '@/lib/actions/casts'
import { Button } from '@/components/ui/Button'
import { showToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Sparkles, Loader2 } from 'lucide-react'

const QUIZ_TAG_OPTIONS = [
  { value: 'gentle', label: '癒し系・優しい' },
  { value: 'cool', label: 'クール・大人っぽい' },
  { value: 'energetic', label: '元気・明るい' },
  { value: 'intellectual', label: 'インテリ・話が弾む' },
  { value: 'cute', label: 'キュート・ガーリー' },
  { value: 'sexy', label: 'セクシー・魅力的' },
  { value: 'funny', label: '笑いが絶えない' },
  { value: 'outdoor', label: 'アウトドア・スポーティ' },
  { value: 'music', label: '音楽好き' },
  { value: 'fashion', label: 'ファッション・おしゃれ' },
]

type Cast = {
  id: string;
  stage_name?: string;
  name?: string;
  name_kana?: string;
  slug?: string;
  age?: number | string;
  height?: number | string;
  hobby?: string;
  comment?: string;
  is_active?: boolean;
  quiz_tags?: string[];
  cast_images?: { is_primary: boolean; image_url: string }[];
}

export function CastForm({ initialData }: { initialData?: Cast }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [isAiGenerating, setIsAiGenerating] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.quiz_tags || [])
  const formRef = useRef<HTMLFormElement>(null)
  const isEditing = !!initialData

  const primaryImage = initialData?.cast_images?.find((img: { is_primary: boolean; image_url: string }) => img.is_primary) || initialData?.cast_images?.[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    if (!formData.get('is_active')) formData.set('is_active', 'false')

    // 圧縮済みの画像をFormDataに上書き
    if (compressedImage) {
      formData.set('image_file', compressedImage, 'profile.webp')
    }

    try {
      const result = isEditing && initialData?.id
        ? await updateCast(initialData.id, formData)
        : await createCast(formData)
      if (result.error) showToast(result.error, 'error')
      else router.push('/admin/casts')
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, 'error')
    } finally {
      setIsPending(false)
    }
  }

  async function handleGenerateAI() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    const stageName = formData.get('stage_name') as string;
    const age = formData.get('age') as string;
    const hobby = formData.get('hobby') as string;

    const baseInfo = [
      stageName ? `源氏名: ${stageName}` : '',
      age ? `年齢: ${age}歳` : '',
      hobby ? `趣味・特技: ${hobby}` : ''
    ].filter(Boolean).join('\n');

    if (!baseInfo) {
      showToast('自動生成には「源氏名」や「趣味」などの入力が必要です。', 'warning');
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: baseInfo, type: 'cast' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API Error');
      
      const commentInput = formRef.current.querySelector('textarea[name="comment"]') as HTMLTextAreaElement;
      if (commentInput) {
        commentInput.value = data.text;
      }
    } catch (err: unknown) {
      const error = err as Error;
      showToast(`自動生成に失敗しました: ${error.message}`, 'error');
    } finally {
      setIsAiGenerating(false);
    }
  }

  const inputClass = 'w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors'
  const labelClass = 'block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2'

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      setImagePreview(null)
      setCompressedImage(null)
      return
    }

    try {
      const { blob, dataUrl } = await resizeImage(file, 1200, 0.8)
      setImagePreview(dataUrl)
      setCompressedImage(blob)
    } catch (error) {
      showToast('画像の処理に失敗しました。別の画像をお試しください。', 'error')
      e.target.value = ''
      setImagePreview(null)
      setCompressedImage(null)
    }
  }

  // クライアントサイドでの画像リサイズ・WebP圧縮ユーティリティ
  const resizeImage = (file: File, maxWidth: number, quality: number): Promise<{ blob: Blob, dataUrl: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new window.Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // アスペクト比を維持してリサイズ
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas ctx null'))
          ctx.drawImage(img, 0, 0, width, height)

          // WebPフォーマットでBlob出力
          canvas.toBlob((blob) => {
            if (blob) {
              resolve({ blob, dataUrl: canvas.toDataURL('image/webp', quality) })
            } else {
              reject(new Error('Blob generation failed'))
            }
          }, 'image/webp', quality)
        }
        img.onerror = () => reject(new Error('Image Load Error'))
        if (event.target?.result) img.src = event.target.result as string
      }
      reader.onerror = () => reject(new Error('Reader Error'))
      reader.readAsDataURL(file)
    })
  }



  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/casts" className="inline-flex items-center text-sm text-gray-500 hover:text-[#171717] transition-colors">
          <ArrowLeft size={16} className="mr-1" /> 一覧へ戻る
        </Link>
      </div>

      <div className="bg-white dark:bg-[#141414] border border-gray-100 dark:border-white/5 shadow-sm rounded-sm p-5 md:p-8">
        <h2 className="text-xl font-serif tracking-widest text-[#171717] mb-8">
          {isEditing ? 'Edit Cast' : 'New Cast'}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">

          {/* 源氏名 + フリガナ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="stage_name" className={labelClass}>源氏名 (Stage Name) *</label>
              <input
                id="stage_name"
                name="stage_name"
                type="text"
                defaultValue={initialData?.stage_name || initialData?.name}
                required
                className={inputClass}
                placeholder="あいか"
              />
            </div>
            <div>
              <label htmlFor="name_kana" className={labelClass}>フリガナ (Name Kana) *</label>
              <input
                id="name_kana"
                name="name_kana"
                type="text"
                defaultValue={initialData?.name_kana}
                required
                pattern="^[ぁ-んァ-ンー]+$"
                className={inputClass}
                placeholder="アイカ"
                title="ひらがな・カタカナのみ"
              />
              <p className="text-[10px] text-gray-400 mt-1">あいうえお順の並び替えに使用します</p>
            </div>
          </div>

          {/* スラグ（自動生成または既存値引き継ぎ） */}
          {initialData?.slug && (
            <input type="hidden" name="slug" value={initialData.slug} />
          )}

          {/* 年齢 + 身長 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cast_age" className={labelClass}>年齢 (Age)</label>
              <input id="cast_age" name="age" type="number" min="18" max="99"
                defaultValue={initialData?.age} className={inputClass} placeholder="22" />
            </div>
            <div>
              <label htmlFor="cast_height" className={labelClass}>身長 (Height) / cm</label>
              <input id="cast_height" name="height" type="number" min="130" max="220"
                defaultValue={initialData?.height} className={inputClass} placeholder="160" />
            </div>
          </div>

          {/* 趣味 */}
          <div>
            <label htmlFor="hobby" className={labelClass}>趣味 (Hobby)</label>
            <input id="hobby" name="hobby" type="text" defaultValue={initialData?.hobby}
              className={inputClass} placeholder="旅行、カフェ巡り" />
          </div>

          {/* AI診断タグ */}
          <div>
            <label className={labelClass}>AI診断タグ (Quiz Tags)</label>
            <p className="text-[10px] text-gray-400 mb-3">お客様向けのキャスト診断で絞り込みに使用します。当てはまるものを複数選択してください。</p>
            <div className="grid grid-cols-2 gap-2">
              {QUIZ_TAG_OPTIONS.map((tag) => {
                const isChecked = selectedTags.includes(tag.value)
                return (
                  <label
                    key={tag.value}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-sm cursor-pointer text-sm transition-colors ${
                      isChecked
                        ? 'border-gold bg-gold/5 text-[#171717]'
                        : 'border-gray-200 text-gray-500 hover:border-gold/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="quiz_tags"
                      value={tag.value}
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTags(prev => [...prev, tag.value])
                        } else {
                          setSelectedTags(prev => prev.filter(t => t !== tag.value))
                        }
                      }}
                      className="accent-gold"
                    />
                    {tag.label}
                  </label>
                )
              })}
            </div>
          </div>

          {/* コメント */}
          <div>
            <div className="flex items-end justify-between mb-2">
              <label htmlFor="comment_input" className="block text-xs font-bold tracking-widest text-gray-500 uppercase">一言コメント (Comment)</label>
              <button 
                type="button" 
                onClick={handleGenerateAI}
                disabled={isAiGenerating}
                aria-label="AIで自動生成"
                className="flex items-center gap-1.5 text-xs font-bold text-gold hover:text-yellow-600 transition-colors disabled:opacity-50"
              >
                {isAiGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                AIで自動生成
              </button>
            </div>
            <textarea id="comment_input" name="comment" rows={6} defaultValue={initialData?.comment}
              className={inputClass} placeholder="お客様へのメッセージやプロフィール文" />
          </div>

          {/* 画像 アップロード */}
          <div>
            <label htmlFor="image_file" className={labelClass}>プロフィール画像 (Profile Image)</label>
            <div className="flex items-start gap-4">
              {(imagePreview || primaryImage?.image_url) && (
                <div className="shrink-0 mb-4 md:mb-0 relative w-24 h-24">
                  <Image 
                    src={imagePreview || primaryImage?.image_url || ''} 
                    alt="プレビュー" 
                    fill
                    unoptimized
                    className="object-cover rounded shadow-sm border border-gray-100" 
                  />
                  <p className="text-[10px] text-gray-400 mt-28 text-center">プレビュー</p>
                </div>
              )}
              <div className="flex-1">
                <input 
                  id="image_file"
                  name="image_file" 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  onChange={handleImageChange}
                  className={inputClass} 
                />
                <p className="text-[10px] text-gray-400 mt-2">
                  ※ 5MB以下の JPEG, PNG, WEBP 画像（省略可）<br />
                  ※ {isEditing ? '新しい画像を選択すると上書きされます。' : '後から追加することもできます。'}
                </p>
              </div>
            </div>
          </div>

          {/* 在籍フラグ */}
          <div className="border-t border-gray-100 pt-6">
            <label htmlFor="is_active" className="flex items-center gap-3 cursor-pointer">
              <input
                id="is_active"
                type="checkbox"
                name="is_active"
                defaultChecked={initialData ? (initialData.is_active ?? true) : true}
                value="true"
                className="w-5 h-5 accent-gold"
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
