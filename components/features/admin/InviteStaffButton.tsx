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
        className="bg-gold hover:bg-[#d4b35a] text-black px-6 py-2.5 rounded-full text-sm font-bold tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-gold/20"
      >
        <UserPlus size={16} />
        新規スタッフ招待
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-500" 
            onClick={handleClose} 
          />
          <div className="relative bg-black/95 border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.01]">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-[#f4f1ea]">スタッフ招待</h2>
                <p className="text-[10px] font-black tracking-[2px] text-[#5a5650] uppercase">System Invitation</p>
              </div>
              <button onClick={handleClose} className="w-10 h-10 rounded-full flex items-center justify-center text-[#5a5650] hover:text-[#f4f1ea] hover:bg-white/5 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            {sent ? (
              // 送信完了画面
              <div className="px-8 py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto border border-gold/20 shadow-lg shadow-gold/5">
                  <Send size={28} className="text-gold" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-bold text-[#f4f1ea]">招待メールを送信しました</p>
                  <p className="text-sm text-[#8a8478] leading-relaxed px-4">
                    <span className="font-bold text-gold underline underline-offset-4 decoration-white/10">{email}</span> に招待リンクを送信しました。
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full py-3.5 bg-white/5 border border-white/10 text-sm text-[#f4f1ea] hover:bg-white/10 transition-all rounded-xl font-bold tracking-[2px] uppercase active:scale-95"
                >
                  Close
                </button>
              </div>
            ) : (
              // 招待フォーム
              <div className="px-8 py-8 space-y-8">
                {/* メールアドレス入力 */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase px-1">
                    Email Address <span className="text-gold">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="staff@example.com"
                    className="w-full bg-black/40 border border-white/10 text-[#f4f1ea] rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-[#3a3630] font-medium"
                  />
                </div>

                {/* 権限選択 */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase px-1">
                    Access Permission <span className="text-gold">*</span>
                  </label>
                  <div className="space-y-3">
                    {ROLE_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className={`group relative flex items-start gap-4 px-5 py-4 border rounded-2xl cursor-pointer transition-all duration-300 ${
                          role === option.value
                            ? 'border-gold/50 bg-gold/[0.04] shadow-lg shadow-gold/5'
                            : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          role === option.value ? 'border-gold bg-gold shadow-[0_0_10px_rgba(223,189,105,0.4)]' : 'border-[#3a3630] bg-transparent'
                        }`}>
                          {role === option.value && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                        </div>
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={role === option.value}
                          onChange={() => setRole(option.value)}
                          className="sr-only"
                        />
                        <div className="space-y-1">
                          <p className={`text-sm font-bold tracking-wide transition-colors ${role === option.value ? 'text-[#f4f1ea]' : 'text-[#8a8478] group-hover:text-[#f4f1ea]'}`}>{option.label}</p>
                          <p className="text-[11px] text-[#5a5650] leading-relaxed font-medium">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-white/[0.02] rounded-xl border border-white/5 border-dashed">
                  <Loader2 size={12} className="text-[#3a3630]" />
                  <p className="text-[9px] text-[#5a5650] leading-none font-bold uppercase tracking-wider">
                    Invitation link expires in 24 hours
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            {!sent && (
              <div className="px-8 pb-10 flex gap-4">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3.5 border border-white/10 text-xs text-[#8a8478] hover:text-[#f4f1ea] hover:bg-white/5 transition-all rounded-xl font-black tracking-[2px] uppercase active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  disabled={isSending || !email.trim()}
                  className="flex-1 py-3.5 bg-gold hover:bg-[#d4b35a] text-black text-xs font-black tracking-[2px] uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:grayscale rounded-xl active:scale-95 shadow-lg shadow-gold/20"
                >
                  {isSending ? (
                    <><Loader2 size={14} className="animate-spin" /> Sending</>
                  ) : (
                    <><Send size={14} /> Send Invitation</>
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
