'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { adminProvisionCastAccount } from '@/lib/actions/cast-auth-admin'

type Props = {
  castId: string
  stageName: string
}

export function CastAccountProvisionButton({ castId, stageName }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleProvision = async () => {
    if (!window.confirm(`「${stageName}」のアカウントを作成しますか？\n\n作成後、本人が初回ログイン時に SMS 認証を行うとログインできるようになります。`)) {
      return
    }

    setIsLoading(true)
    try {
      const result = await adminProvisionCastAccount(castId)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('予期しないエラーが発生しました。時間をおいて再度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleProvision}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-60"
      style={{
        background: 'linear-gradient(90deg, #dfbd69 0%, #926f34 100%)',
        color: '#0b0b0d',
      }}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          作成中...
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          アカウントを作成する
        </>
      )}
    </button>
  )
}
