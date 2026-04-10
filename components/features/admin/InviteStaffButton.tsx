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
        className="flex items-center justify-center gap-1.5 h-[37px] px-5 rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
      >
        <UserPlus size={13} strokeWidth={3} />
        新規スタッフ招待
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1c1d22] rounded-[18px] border border-[#ffffff0f] shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffffff08]">
              <h2 className="text-[14px] font-bold tracking-tight text-[#f4f1ea]">スタッフ招待</h2>
              <button onClick={handleClose} className="text-[#5a5650] hover:text-[#f4f1ea] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            {sent ? (
              <div className="px-6 py-10 text-center space-y-4">
                <div className="w-[56px] h-[56px] rounded-full bg-[#72b8941a] flex items-center justify-center mx-auto border border-[#72b89430]">
                  <Send size={24} className="text-[#72b894]" />
                </div>
                <p className="text-[15px] font-bold text-[#f4f1ea]">招待メールを送信しました</p>
                <p className="text-[12px] text-[#8a8478] leading-relaxed">
                  <span className="font-bold text-[#dfbd69]">{email}</span> に送信完了。<br />
                  参加者がリンクから登録すると、<br />
                  管理画面へアクセス可能になります。
                </p>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full h-[40px] rounded-[10px] bg-[#ffffff08] border border-[#ffffff0f] text-[12px] font-semibold text-[#c7c0b2] hover:bg-[#ffffff0f] transition-colors"
                >
                  閉じる
                </button>
              </div>
            ) : (
              <div className="px-6 py-6 space-y-5">
                {/* Email input */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.1em] text-[#5a5650] uppercase mb-2">
                    メールアドレス
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@example.com"
                    className="w-full bg-[#0e0e10] border border-[#ffffff14] rounded-[10px] px-4 py-2.5 text-[13px] text-[#f4f1ea] placeholder-[#5a5650] focus:outline-none focus:border-[#dfbd6940] transition-colors"
                  />
                </div>

                {/* Role selection */}
                <div>
                  <label className="block text-[10px] font-bold tracking-[0.1em] text-[#5a5650] uppercase mb-2">
                    権限
                  </label>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 px-4 py-3 border rounded-[12px] cursor-pointer transition-all ${
                          role === option.value
                            ? 'border-[#dfbd6940] bg-[#dfbd690a]'
                            : 'border-[#ffffff08] bg-[#ffffff02] hover:bg-[#ffffff05]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={role === option.value}
                          onChange={() => setRole(option.value)}
                          className="mt-1 accent-[#dfbd69]"
                        />
                        <div>
                          <p className="text-[13px] font-bold text-[#f4f1ea]">{option.label}</p>
                          <p className="text-[11px] text-[#8a8478] mt-0.5 leading-relaxed">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-[#5a5650] leading-relaxed">
                  ※招待メールの有効期限は24時間です。
                </p>
              </div>
            )}

            {/* Footer */}
            {!sent && (
              <div className="px-6 pb-6 flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 h-[40px] border border-[#ffffff0f] text-[12px] font-semibold text-[#c7c0b2] hover:bg-[#ffffff08] transition-colors rounded-[10px]"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleInvite}
                  disabled={isSending || !email.trim()}
                  className="flex-1 h-[40px] bg-[#f4f1ea] hover:bg-white text-[#0b0b0d] text-[12px] font-bold tracking-tight flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 rounded-[10px]"
                >
                  {isSending ? (
                    <><Loader2 size={13} className="animate-spin" /> 送信中...</>
                  ) : (
                    <><Send size={13} /> 招待を送る</>
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
