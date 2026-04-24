'use client'

import { createCast, updateCast } from '@/lib/actions/casts'
import { Button } from '@/components/ui/Button'
import { showToast } from '@/components/ui/Toast'
import {
  validateCastProfileInput,
  type CastProfileFieldErrors,
} from '@/lib/validators/cast-profile'
import { formatJapaneseMobilePhone } from '@/lib/utils/phone'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, Users, CheckCheck } from 'lucide-react'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { useAdminTheme } from '@/components/providers/AdminThemeProvider'

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
  line_id?: string | null
  line_user_id?: string | null
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
  const [phone, setPhone] = useState(formatJapaneseMobilePhone(privateInfo?.phone || ''))
  const [email, setEmail] = useState(privateInfo?.email || '')
  const [lineId, setLineId] = useState(privateInfo?.line_id || '')
  const [lineUserId, setLineUserId] = useState(privateInfo?.line_user_id || '')
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
    formData.set('email', validation.values.email ?? '')
    formData.set('line_id', lineId)
    formData.set('line_user_id', lineUserId)

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

  const { F } = useAdminTheme()
  const inputClass = F.input
  const labelClass = F.label

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
        <div className="max-w-4xl font-sans">
      <div className="mb-8">
        <Link prefetch={false} href="/admin/human-resources" className={F.backLink}>
          <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mr-3 transition-colors group-hover:border-gold/40">
            <ArrowLeft size={14} className="group-hover:text-gold transition-colors" />
          </div>
          <span className="uppercase font-bold tracking-[3px]">Back to list</span>
        </Link>
      </div>

      <div className={`${F.card} p-6 md:p-12 relative overflow-hidden`}>
        {/* Subtle accent line at the top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

        <div className="mb-12">
          <h2 className={`text-3xl font-serif tracking-tighter mb-2 ${F.heading}`}>
            {isEditing ? 'Edit Profile' : 'New Profile'}
          </h2>
          <p className="text-[10px] font-bold tracking-[3px] text-[#5a5650] uppercase italic">
            {isEditing ? 'Updating existing cast data' : 'Creating a new professional profile'}
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
          {formError && (
            <div className={F.error}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            </div>
          )}

          {/* 必須項目 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-bold tracking-[4px] text-[#5a5650] uppercase">Private Identity</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="group">
                <label htmlFor="real_name" className={labelClass}>名前 / Real Name <span className="text-red-500/50">*</span></label>
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
                {fieldErrors.real_name ? (
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">{fieldErrors.real_name}</p>
                ) : (
                  <p className="mt-2 text-[9px] text-[#5a5650] tracking-widest uppercase italic opacity-0 group-focus-within:opacity-100 transition-opacity">Private: only visible to admins</p>
                )}
              </div>
              <div className="group">
                <label htmlFor="name_kana" className={labelClass}>フリガナ / Phonetic <span className="text-red-500/50">*</span></label>
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
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">{fieldErrors.name_kana}</p>
                )}
              </div>
              <div>
                <label htmlFor="stage_name" className={labelClass}>源氏名 / Stage Name <span className="text-red-500/50">*</span></label>
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
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">{fieldErrors.stage_name}</p>
                )}
              </div>
              <div>
                <label htmlFor="date_of_birth" className={labelClass}>生年月日 / Date of Birth <span className="text-red-500/50">*</span></label>
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
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">{fieldErrors.date_of_birth}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className={labelClass}>電話番号 / Tel <span className="text-red-500/50">*</span></label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatJapaneseMobilePhone(e.target.value))
                    clearFieldError('phone')
                  }}
                  onBlur={() => validateSingleField('phone')}
                  required
                  className={inputClass}
                  placeholder="090-1234-5678"
                  autoComplete="tel"
                />
                {fieldErrors.phone && (
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">{fieldErrors.phone}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>メールアドレス / Email <span className="text-[#5a5650]">(任意)</span></label>
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
                  className={inputClass}
                  placeholder="cast@example.com"
                  autoComplete="email"
                />
                {fieldErrors.email && (
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">{fieldErrors.email}</p>
                )}
              </div>
            </div>
          </div>

          {/* スラグ */}
          {initialData?.slug && (
            <input type="hidden" name="slug" value={initialData.slug} />
          )}

          {/* 任意項目 */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-bold tracking-[4px] text-[#5a5650] uppercase">Public Profile</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label htmlFor="cast_age" className={labelClass}>年齢 / Age</label>
                <input id="cast_age" name="age" type="number" min="18" max="99"
                  defaultValue={initialData?.age} className={inputClass} placeholder="22" />
              </div>
              <div>
                <label htmlFor="cast_height" className={labelClass}>身長 / Height (cm)</label>
                <input id="cast_height" name="height" type="number" min="130" max="220"
                  defaultValue={initialData?.height} className={inputClass} placeholder="160" />
              </div>
            </div>

            {/* SNS連携 */}
            <div className={F.snsSection}>
              <div>
                <label htmlFor="sns_x" className={labelClass}>X (Twitter)</label>
                <input id="sns_x" name="sns_x" type="text" defaultValue={initialData?.sns_x}
                  className={inputClass} placeholder="@username" />
              </div>
              <div>
                <label htmlFor="sns_instagram" className={labelClass}>Instagram</label>
                <input id="sns_instagram" name="sns_instagram" type="text" defaultValue={initialData?.sns_instagram}
                  className={inputClass} placeholder="username" />
              </div>
              <div>
                <label htmlFor="sns_tiktok" className={labelClass}>TikTok</label>
                <input id="sns_tiktok" name="sns_tiktok" type="text" defaultValue={initialData?.sns_tiktok}
                  className={inputClass} placeholder="username" />
              </div>
            </div>

            {/* LINE 連携情報 */}
            <div className={F.snsSection}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-[2px] uppercase text-green-400/70">LINE</span>
                {lineUserId ? (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">Push 通知 連携済み ✓</span>
                ) : (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#5a5650]">未連携</span>
                )}
              </div>
              <div>
                <label htmlFor="line_id" className={labelClass}>
                  LINE ID（表示名・@ユーザー名）<span className="text-red-500/50"> *</span>
                </label>
                <input
                  id="line_id"
                  type="text"
                  value={lineId}
                  onChange={(e) => {
                    setLineId(e.target.value)
                    clearFieldError('line_id')
                  }}
                  required
                  className={inputClass}
                  placeholder="@your-line-id"
                />
                <p className={`${F.noteText} mt-1`}>キャスト自身が知っている LINE の表示 ID。ログインには使用しません。</p>
                {fieldErrors.line_id && (
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">{fieldErrors.line_id}</p>
                )}
              </div>
              <div>
                <label htmlFor="line_user_id" className={labelClass}>
                  LINE User ID（Push 通知用）
                </label>
                <input
                  id="line_user_id"
                  type="text"
                  value={lineUserId}
                  onChange={(e) => setLineUserId(e.target.value)}
                  className={inputClass}
                  placeholder="Uxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                <p className={`${F.noteText} mt-1`}>
                  キャストが Bot を友達追加 → 携帯番号を送信すると自動連携されます。手動入力も可。
                </p>
              </div>
            </div>

            {/* 趣味 */}
            <div>
              <label htmlFor="hobby" className={labelClass}>趣味 / Hobby</label>
              <input id="hobby" name="hobby" type="text" defaultValue={initialData?.hobby}
                className={inputClass} placeholder="旅行、カフェ巡り" />
            </div>

            {/* AI診断タグ */}
            <div className="space-y-4">
              <label className={labelClass}>AI診断タグ / Quiz Architecture</label>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                {QUIZ_TAG_OPTIONS.map((tag) => {
                  const isChecked = selectedTags.includes(tag.value)
                  return (
                    <label
                      key={tag.value}
                      className={`flex flex-col items-center justify-center gap-2 p-3 border rounded-sm cursor-pointer transition-all duration-300 ${
                        isChecked ? F.tagActive : F.tagInactive
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
                        className="hidden"
                      />
                      <span className="text-[10px] font-bold text-center leading-tight tracking-tighter">{tag.label}</span>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* コメント */}
            <div>
              <label htmlFor="comment_input" className={labelClass}>一言コメント / Public Memo</label>
              <textarea id="comment_input" name="comment" rows={6} defaultValue={initialData?.comment}
                className={`${inputClass} font-sans leading-relaxed`} placeholder="お客様へのメッセージやプロフィール文" />
            </div>

            {!isEditing && (
              <div className="space-y-4">
                <label htmlFor="image_file" className={labelClass}>プロフィール画像 / Visual Assets</label>
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className="w-48 h-64 bg-white/5 border border-white/10 rounded-sm overflow-hidden relative group">
                    {(imagePreview || primaryImage?.image_url) ? (
                      <Image
                        src={imagePreview || primaryImage?.image_url || ''}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 opacity-40">
                        <Users size={32} className="text-[#5a5650]" />
                        <span className="text-[8px] font-bold tracking-[2px] uppercase">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <p className="text-[8px] font-bold tracking-[2px] text-white uppercase text-center leading-relaxed">Visual will be optimized for premium display</p>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center h-64">
                    <input
                      id="image_file"
                      name="image_file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                      onChange={handleImageChange}
                      className={`${inputClass} h-auto py-8 border-dashed border-white/20 hover:border-gold/40 cursor-pointer`}
                    />
                    <div className="mt-4 space-y-1">
                      <p className={`${F.noteText} flex items-center gap-2`}>
                        <CheckCheck size={10} className="text-gold" />
                        <span>Recommended: High resolution portraits</span>
                      </p>
                      <p className={`${F.noteText} flex items-center gap-2`}>
                        <CheckCheck size={10} className="text-gold" />
                        <span>Formats: JPEG, PNG, WEBP (Auto-optimized)</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 在籍フラグ */}
          <div className={`border-t ${F.divider} pt-10 flex items-center justify-between`}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold tracking-[2px] text-[#f4f1ea] uppercase">Visibility Status</p>
              <p className={F.noteText}>Control whether this cast is visible on the public platform</p>
            </div>
            <label htmlFor="is_active" className="relative inline-flex items-center cursor-pointer group">
              <input
                id="is_active"
                type="checkbox"
                name="is_active"
                defaultChecked={initialData ? (initialData.is_active ?? true) : true}
                value="true"
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-white/5 border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#5a5650] after:border-white/10 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold/20 peer-checked:after:bg-gold"></div>
              <span className="ml-3 text-xs font-bold tracking-widest text-[#8a8478] peer-checked:text-gold uppercase transition-colors">
                {initialData ? (initialData.is_active ?? true ? 'Active' : 'Inactive') : 'Active'}
              </span>
            </label>
          </div>

          <div className="pt-8 pb-12">
            <button
              type="submit"
              disabled={isPending}
              className="w-full relative group h-14 bg-gold overflow-hidden rounded-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_30px_-10px_rgba(223,189,105,0.3)]"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-black text-xs font-bold tracking-[4px] uppercase">
                {isPending ? 'PROCESSING...' : (isEditing ? 'COMMIT CHANGES' : 'CREATE PROFILE')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
