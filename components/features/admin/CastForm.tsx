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
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null)
  const isEditing = !!initialData

  const primaryImage = initialData?.cast_images?.find((img: any) => img.is_primary) || initialData?.cast_images?.[0]

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
      alert('画像の処理に失敗しました。別の画像をお試しください。')
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
        const img = new Image()
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

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm p-5 md:p-8">
        <h2 className="text-xl font-serif tracking-widest text-[#171717] mb-8">
          {isEditing ? 'Edit Cast' : 'New Cast'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 源氏名 + フリガナ */}
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
              <label className={labelClass}>フリガナ (Name Kana) *</label>
              <input
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

          {/* スラグ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            {/* 右側は空けておく */}
            <div></div>
          </div>

          {/* 年齢 + 身長 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>年齢 (Age)</label>
              <input name="age" type="number" min="18" max="99"
                defaultValue={initialData?.age} className={inputClass} placeholder="22" />
            </div>
            <div>
              <label className={labelClass}>身長 (Height) / cm</label>
              <input name="height" type="number" min="130" max="220"
                defaultValue={initialData?.height} className={inputClass} placeholder="160" />
            </div>
          </div>

          {/* 趣味 */}
          <div>
            <label className={labelClass}>趣味 (Hobby)</label>
            <input name="hobby" type="text" defaultValue={initialData?.hobby}
              className={inputClass} placeholder="旅行、カフェ巡り" />
          </div>

          {/* Night Style 診断タグ */}
          <div className="border-t border-gray-100 pt-6">
            <label className={labelClass}>Night Style 診断タグ</label>
            <p className="text-[10px] text-gray-400 mb-4">
              AI診断でマッチングされるタグを設定します。複数選択可。
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">目的タグ（どんな来店目的の方に合う？）</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'purpose_business', label: '接待・おもてなし' },
                    { value: 'purpose_party',   label: 'パーティー・盛り上がり' },
                    { value: 'purpose_solo',    label: 'ひとり・まったり' },
                  ] as const).map((tag) => (
                    <label key={tag.value} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 border border-gray-100 rounded-sm px-3 py-3 hover:border-gold/40 transition-colors active:bg-gold/5">
                      <input
                        type="checkbox"
                        name="quiz_tags"
                        value={tag.value}
                        defaultChecked={initialData?.quiz_tags?.includes(tag.value)}
                        className="accent-gold"
                      />
                      {tag.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">雰囲気タグ（どんな雰囲気のキャスト？）</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'atm_calm',      label: '清楚・落ち着き' },
                    { value: 'atm_cheerful',  label: '明るい・ノリが良い' },
                    { value: 'atm_healing',   label: '聞き上手・癒やし' },
                  ] as const).map((tag) => (
                    <label key={tag.value} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 border border-gray-100 rounded-sm px-3 py-3 hover:border-gold/40 transition-colors active:bg-gold/5">
                      <input
                        type="checkbox"
                        name="quiz_tags"
                        value={tag.value}
                        defaultChecked={initialData?.quiz_tags?.includes(tag.value)}
                        className="accent-gold"
                      />
                      {tag.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">見た目タグ</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'look_elegant', label: '清楚系・上品' },
                    { value: 'look_cute',    label: 'キュート・可愛い' },
                    { value: 'look_cool',    label: 'クール・スタイリッシュ' },
                  ] as const).map((tag) => (
                    <label key={tag.value} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 border border-gray-100 rounded-sm px-3 py-3 hover:border-gold/40 transition-colors active:bg-gold/5">
                      <input
                        type="checkbox"
                        name="quiz_tags"
                        value={tag.value}
                        defaultChecked={initialData?.quiz_tags?.includes(tag.value)}
                        className="accent-gold"
                      />
                      {tag.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">会話スタイルタグ</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'talk_funny',        label: '盛り上げ上手' },
                    { value: 'talk_intellectual', label: '知的・深い話' },
                    { value: 'talk_quiet',       label: '落ち着いて聞く' },
                  ] as const).map((tag) => (
                    <label key={tag.value} className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 border border-gray-100 rounded-sm px-3 py-3 hover:border-gold/40 transition-colors active:bg-gold/5">
                      <input
                        type="checkbox"
                        name="quiz_tags"
                        value={tag.value}
                        defaultChecked={initialData?.quiz_tags?.includes(tag.value)}
                        className="accent-gold"
                      />
                      {tag.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* コメント */}
          <div>
            <label className={labelClass}>一言コメント (Comment)</label>
            <textarea name="comment" rows={4} defaultValue={initialData?.comment}
              className={inputClass} placeholder="お客様へのメッセージ" />
          </div>

          {/* 画像 アップロード */}
          <div>
            <label className={labelClass}>プロフィール画像 (Profile Image) {isEditing ? '' : '*'}</label>
            <div className="flex items-start gap-4">
              {(imagePreview || primaryImage?.image_url) && (
                <div className="shrink-0 mb-4 md:mb-0">
                  <img 
                    src={imagePreview || primaryImage?.image_url} 
                    alt="プレビュー" 
                    className="w-24 h-24 object-cover rounded shadow-sm border border-gray-100" 
                  />
                  <p className="text-[10px] text-gray-400 mt-1 text-center">プレビュー</p>
                </div>
              )}
              <div className="flex-1">
                <input 
                  name="image_file" 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"

                  onChange={handleImageChange}
                  required={!isEditing}
                  className={inputClass} 
                />
                <p className="text-[10px] text-gray-400 mt-2">
                  ※ 5MB以下の JPEG, PNG, WEBP 画像<br />
                  ※ {isEditing ? '新しい画像を選択すると上書きされます。' : '最低1枠登録が必要です。'}
                </p>
              </div>
            </div>
          </div>

          {/* 在籍フラグ */}
          <div className="border-t border-gray-100 pt-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
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
