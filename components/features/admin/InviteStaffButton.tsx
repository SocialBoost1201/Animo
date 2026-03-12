'use client'

import { useState } from 'react'
import { UserPlus, X, Send, Loader2 } from 'lucide-react'
import { showToast } from '@/components/ui/Toast'
import { createClient } from '@/lib/supabase/client'

type Role = 'manager' | 'staff'

const ROLE_OPTIONS: { value: Role; label: string; description: string }[] = [
  {
    value: 'manager',
    label: 'Manager（マネージャー）',
    description: '全管理機能を利用可能。スタッフ管理・設定を除く。',
  },
  {
    value: 'staff',
    label: 'Staff（スタッフ）',
    description: 'キャスト・シフト・予約確認などの基本操作のみ。',
  },
]

export function InviteStaffButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('staff')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  function handleClose() {
    setIsOpen(false)
    setEmail('')
    setRole('staff')
    setSent(false)
  }

  async function handleInvite() {
    if (!email.trim()) {
      showToast('メールアドレスを入力してください', 'error')
      return
    }

    setIsSending(true)
    try {
      // 現在のセッションのJWTトークンを取得
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        showToast('ログインセッションが切れました', 'error')
        return
      }

      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email: email.trim(), role }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '招待に失敗しました')

      setSent(true)
    } catch (err: unknown) {
      const error = err as Error
      showToast(error.message, 'error')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#171717] hover:bg-gold text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors"
      >
        <UserPlus size={16} />
        新規スタッフ招待
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-sm shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold tracking-widest text-[#171717]">スタッフ招待</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-[#171717] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            {sent ? (
              // 送信完了画面
              <div className="px-6 py-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <Send size={24} className="text-green-600" />
                </div>
                <p className="text-base font-bold text-[#171717]">招待メールを送信しました</p>
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-[#171717]">{email}</span> に招待メールを送信しました。<br />
                  対象者がリンクをクリックしてパスワードを設定すると、<br />
                  スタッフ一覧に自動的に追加されます。
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full py-2.5 border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition-colors rounded-sm"
                >
                  閉じる
                </button>
              </div>
            ) : (
              // 招待フォーム
              <div className="px-6 py-6 space-y-5">
                {/* メールアドレス入力 */}
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                    招待するメールアドレス *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@example.com"
                    className="w-full border border-gray-200 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                {/* 権限選択 */}
                <div>
                  <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                    付与する権限 *
                  </label>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 px-4 py-3 border rounded-sm cursor-pointer transition-colors ${
                          role === option.value
                            ? 'border-gold bg-gold/5'
                            : 'border-gray-200 hover:border-gold/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={role === option.value}
                          onChange={() => setRole(option.value)}
                          className="mt-0.5 accent-gold"
                        />
                        <div>
                          <p className="text-sm font-bold text-[#171717]">{option.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-400">
                  招待メールの有効期限は24時間です。期限切れの場合は再度招待してください。
                </p>
              </div>
            )}

            {/* Footer */}
            {!sent && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition-colors rounded-sm"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleInvite}
                  disabled={isSending || !email.trim()}
                  className="flex-1 py-2.5 bg-[#171717] hover:bg-gold text-white text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                >
                  {isSending ? (
                    <><Loader2 size={14} className="animate-spin" /> 送信中...</>
                  ) : (
                    <><Send size={14} /> 招待メールを送信</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
