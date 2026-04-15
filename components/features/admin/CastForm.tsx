'use client'

import { createCast, updateCast } from '@/lib/actions/casts'
import { Button } from '@/components/ui/Button'
import { showToast } from '@/components/ui/Toast'
import {
  validateCastProfileInput,
  type CastProfileFieldErrors,
} from '@/lib/validators/cast-profile'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState, useRef } from 'react'
import Image from 'next/image'

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

type CastPrivateInfo = {
  real_name: string
  date_of_birth: string
  phone?: string | null
  email?: string | null
}

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
  sns_x?: string;
  sns_instagram?: string;
  sns_tiktok?: string;
  cast_private_info?: CastPrivateInfo | CastPrivateInfo[] | null;
}

function normalizePrivateInfo(raw: Cast['cast_private_info']): CastPrivateInfo | null {
  if (!raw) return null
  if (Array.isArray(raw)) return raw[0] ?? null
  return raw
}

export function CastForm({ initialData }: { initialData?: Cast }) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.quiz_tags || [])
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<CastProfileFieldErrors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const isEditing = !!initialData

  const privateInfo = normalizePrivateInfo(initialData?.cast_private_info)

  // --- フリガナ自動生成用ステート ---
  const [stageName, setStageName] = useState(initialData?.stage_name || initialData?.name || '')
  const [nameKana, setNameKana] = useState(initialData?.name_kana || '')
  const [realName, setRealName] = useState(privateInfo?.real_name || '')
  const [dateOfBirth, setDateOfBirth] = useState(privateInfo?.date_of_birth || '')
  const [phone, setPhone] = useState(privateInfo?.phone || '')
  const [email, setEmail] = useState(privateInfo?.email || '')
  // もともとデータがない新規登録時のみ、自動入力をONにする
  const [isAutoKana, setIsAutoKana] = useState(!initialData?.name_kana)

  const clearFieldError = (field: keyof CastProfileFieldErrors) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const validateAllFields = () => {
    const result = validateCastProfileInput({
      real_name: realName,
      name_kana: nameKana,
      stage_name: stageName,
      date_of_birth: dateOfBirth,
      phone,
      email,
    })
    setFieldErrors(result.fieldErrors)
    return {
      isValid: Object.keys(result.fieldErrors).length === 0,
      values: result.values,
    }
  }

  const validateSingleField = (field: keyof CastProfileFieldErrors) => {
    const result = validateCastProfileInput({
      real_name: realName,
      name_kana: nameKana,
      stage_name: stageName,
      date_of_birth: dateOfBirth,
      phone,
      email,
    })
    const message = result.fieldErrors[field]
    setFieldErrors((prev) => {
      const next = { ...prev }
      if (message) next[field] = message
      else delete next[field]
      return next
    })
  }

  const handleStageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setStageName(val)
    clearFieldError('stage_name')
    
    // 手動で編集されていなければ、ひらがな/カタカナ入力時に自動カタカナ変換する
    if (isAutoKana) {
      // 全て平仮名・カタカナ・長音記号だけで構成されているかチェック
      const isKanaOnly = /^[ぁ-んァ-ンー\s　]*$/.test(val)
      if (isKanaOnly) {
        // ひらがなをカタカナに変換してセット
        const katakana = val.replace(/[\u3041-\u3096]/g, match => 
          String.fromCharCode(match.charCodeAt(0) + 0x60)
        )
        setNameKana(katakana)
      }
    }
  }

  const primaryImage = initialData?.cast_images?.find((img: { is_primary: boolean; image_url: string }) => img.is_primary) || initialData?.cast_images?.[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)

    const validation = validateAllFields()
    if (!validation.isValid) {
      setFormError('入力内容を確認してください。')
      return
    }

    setIsPending(true)
    const formData = new FormData(e.currentTarget)
    if (!formData.get('is_active')) formData.set('is_active', 'false')
    formData.set('real_name', validation.values.realName)
    formData.set('name_kana', validation.values.nameKana)
    formData.set('stage_name', validation.values.stageName)
    formData.set('date_of_birth', validation.values.dateOfBirth)
    formData.set('phone', validation.values.phone)
    formData.set('email', validation.values.email)

    // 圧縮済みの画像をFormDataに上書き
    if (compressedImage) {
      formData.set('image_file', compressedImage, 'profile.webp')
    }

    try {
      const result = isEditing && initialData?.id
        ? await updateCast(initialData.id, formData)
        : await createCast(formData)
      if (result.error) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors)
          setFormError(result.error)
        } else {
          showToast(result.error, 'error')
          setFormError(result.error)
        }
      } else {
        router.push('/admin/human-resources')
        router.refresh()
      }
    } catch (err: unknown) {
      const error = err as Error;
      showToast(error.message, 'error')
      setFormError(error.message)
    } finally {
      setIsPending(false)
    }
  }

  const inputClass = 'w-full bg-[#0e0e10] border border-[#ffffff10] rounded-lg px-3 py-2 text-sm text-[#c7c0b2] placeholder-[#3a3830] focus:outline-none focus:border-[#dfbd69] transition-colors'
  const labelClass = 'block text-xs font-bold tracking-widest text-[#8a8478] uppercase mb-2'

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
    } catch {
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
        <Link prefetch={false} href="/admin/human-resources" className="inline-flex items-center text-sm text-[#8a8478] hover:text-[#f4f1ea] transition-colors">
          <ArrowLeft size={16} className="mr-1" /> 一覧へ戻る
        </Link>
      </div>

      <div className="bg-[#18181c] border border-[#ffffff10] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] p-5 md:p-8">
        <h2 className="text-xl font-serif tracking-widest text-[#f4f1ea] mb-8">
          {isEditing ? 'Edit Cast' : 'New Cast'}
        </h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="rounded-lg border border-[#d4785a40] bg-[#d4785a10] px-4 py-3 text-sm text-[#d4785a]">
              {formError}
            </div>
          )}

          {/* 必須項目 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="real_name" className={labelClass}>名前 *</label>
              <input
                id="real_name"
                name="real_name"
                type="text"
                value={realName}
                onChange={(e) => {
                  setRealName(e.target.value)
                  clearFieldError('real_name')
                }}
                onBlur={() => validateSingleField('real_name')}
                required
                className={inputClass}
                placeholder="山田 花子"
                autoComplete="off"
              />
              {fieldErrors.real_name && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.real_name}</p>
              )}
            </div>
            <div>
              <label htmlFor="name_kana" className={labelClass}>フリガナ *</label>
              <input
                id="name_kana"
                name="name_kana"
                type="text"
                value={nameKana}
                onChange={(e) => {
                  setNameKana(e.target.value)
                  setIsAutoKana(false)
                  clearFieldError('name_kana')
                }}
                onBlur={() => validateSingleField('name_kana')}
                required
                className={inputClass}
                placeholder="ヤマダ ハナコ"
                title="全角カタカナで入力してください"
              />
              {fieldErrors.name_kana && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.name_kana}</p>
              )}
            </div>
            <div>
              <label htmlFor="stage_name" className={labelClass}>源氏名 *</label>
              <input
                id="stage_name"
                name="stage_name"
                type="text"
                value={stageName}
                onChange={handleStageNameChange}
                onBlur={() => validateSingleField('stage_name')}
                required
                className={inputClass}
                placeholder="あいか"
              />
              {fieldErrors.stage_name && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.stage_name}</p>
              )}
            </div>
            <div>
              <label htmlFor="date_of_birth" className={labelClass}>生年月日 *</label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => {
                  setDateOfBirth(e.target.value)
                  clearFieldError('date_of_birth')
                }}
                onBlur={() => validateSingleField('date_of_birth')}
                required
                className={inputClass}
              />
              {fieldErrors.date_of_birth && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.date_of_birth}</p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>電話番号 *</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  clearFieldError('phone')
                }}
                onBlur={() => validateSingleField('phone')}
                required
                className={inputClass}
                placeholder="090-1234-5678"
                autoComplete="tel"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>メールアドレス *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  clearFieldError('email')
                }}
                onBlur={() => validateSingleField('email')}
                required
                className={inputClass}
                placeholder="cast@example.com"
                autoComplete="email"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>
          </div>

          {/* スラグ（自動生成または既存値引き継ぎ） */}
          {initialData?.slug && (
            <input type="hidden" name="slug" value={initialData.slug} />
          )}

          <p className="text-xs text-[#5a5650]">
            名前・生年月日・電話番号・メールアドレスは管理者専用情報です。公開ページには表示されません。
          </p>

          {/* 任意項目 */}
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

          {/* SNS連携（任意） */}
          <div className="bg-[#0e0e10] border border-[#ffffff08] rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5a5650] tracking-widest uppercase">SNS連携 (Optional)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="sns_x" className={labelClass}>X (Twitter) ID</label>
                <input id="sns_x" name="sns_x" type="text" defaultValue={initialData?.sns_x}
                  className={inputClass} placeholder="@username" />
              </div>
              <div>
                <label htmlFor="sns_instagram" className={labelClass}>Instagram ID</label>
                <input id="sns_instagram" name="sns_instagram" type="text" defaultValue={initialData?.sns_instagram}
                  className={inputClass} placeholder="username" />
              </div>
              <div>
                <label htmlFor="sns_tiktok" className={labelClass}>TikTok ID</label>
                <input id="sns_tiktok" name="sns_tiktok" type="text" defaultValue={initialData?.sns_tiktok}
                  className={inputClass} placeholder="username" />
              </div>
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
            <p className="text-xs text-[#5a5650] mb-3">お客様向けのキャスト診断で絞り込みに使用します。当てはまるものを複数選択してください。</p>
            <div className="grid grid-cols-2 gap-2">
              {QUIZ_TAG_OPTIONS.map((tag) => {
                const isChecked = selectedTags.includes(tag.value)
                return (
                  <label
                    key={tag.value}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                      isChecked
                        ? 'border-[#dfbd69] bg-[#dfbd6910] text-[#f4f1ea]'
                        : 'border-[#ffffff10] text-[#8a8478] hover:border-[#dfbd6940]'
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
              <label htmlFor="comment_input" className="block text-xs font-bold tracking-widest text-[#8a8478] uppercase">一言コメント (Comment)</label>
            </div>
            <textarea id="comment_input" name="comment" rows={6} defaultValue={initialData?.comment}
              className={inputClass} placeholder="お客様へのメッセージやプロフィール文" />
          </div>

          {!isEditing && (
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
                      className="object-cover rounded shadow-sm border border-[#ffffff10]"
                    />
                    <p className="text-xs text-gray-400 mt-28 text-center">プレビュー</p>
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
                  <p className="text-xs text-[#5a5650] mt-2">
                    ※ 5MB以下の JPEG, PNG, WEBP 画像（省略可）<br />
                    ※ 後から追加することもできます。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 在籍フラグ */}
          <div className="border-t border-[#ffffff08] pt-6">
            <label htmlFor="is_active" className="flex items-center gap-3 cursor-pointer">
              <input
                id="is_active"
                type="checkbox"
                name="is_active"
                defaultChecked={initialData ? (initialData.is_active ?? true) : true}
                value="true"
                className="w-5 h-5 accent-gold"
              />
              <span className="text-sm font-bold text-[#f4f1ea]">在籍中（公開する）</span>
            </label>
            <p className="text-xs text-[#5a5650] mt-1 ml-8">オフにすると公開ページに表示されません</p>
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
