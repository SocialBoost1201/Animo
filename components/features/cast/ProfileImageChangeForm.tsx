'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Loader2, CheckCircle2 } from 'lucide-react'
import { requestProfileImageChange } from '@/lib/actions/cast-images'
import { toast } from 'sonner'

export function ProfileImageChangeForm() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreviewUrl(URL.createObjectURL(selected))
    setSubmitted(false)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!file) {
      toast.error('画像を選択してください')
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const result = await requestProfileImageChange(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('申請を送信しました。店長が確認後に反映されます。')
        setSubmitted(true)
        setFile(null)
        setPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 画像選択エリア */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="relative flex w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed py-8 transition-colors"
        style={{ borderColor: previewUrl ? 'rgba(201,167,106,0.5)' : 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}
      >
        {previewUrl ? (
          <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full border-2" style={{ borderColor: 'rgba(201,167,106,0.5)' }}>
            <Image src={previewUrl} alt="プレビュー" fill className="object-cover" />
          </div>
        ) : (
          <>
            <Camera className="h-[28px] w-[28px] text-[#c9a76a]" strokeWidth={1.5} />
            <span className="text-[12px] text-[#6b7280]">タップして画像を選択</span>
            <span className="text-[10px] text-[#4b5563]">JPEG / PNG / WebP · 5MB 以内</span>
          </>
        )}
        {previewUrl && (
          <span className="mt-2 text-[11px] text-[#c9a76a]">タップして選び直す</span>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {submitted && (
        <div className="flex items-center gap-2 rounded-[12px] px-4 py-3" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
          <CheckCircle2 className="h-[14px] w-[14px] flex-shrink-0 text-green-400" />
          <span className="text-[12px] text-green-400">申請を受け付けました。店長の確認後に反映されます。</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!file || isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-[14px] py-3 text-[13px] font-bold transition-opacity disabled:opacity-40"
        style={{
          background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          color: '#0b0b0d',
        }}
      >
        {isSubmitting ? (
          <><Loader2 className="h-[14px] w-[14px] animate-spin" /> 送信中…</>
        ) : (
          '変更を申請する'
        )}
      </button>
    </form>
  )
}
