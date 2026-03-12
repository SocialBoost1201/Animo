'use client'

import { useState } from 'react'
import { UserPlus, X, Copy, Check } from 'lucide-react'
import { showToast } from '@/components/ui/Toast'

export function InviteStaffButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/admin/login`
    : '/admin/login'

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      showToast('URLをコピーしました', 'success')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('コピーに失敗しました', 'error')
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
              <h2 className="text-base font-bold tracking-widest text-[#171717]">新規スタッフ招待</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-[#171717] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 text-sm text-amber-800">
                <p className="font-bold mb-1">招待手順</p>
                <ol className="list-decimal list-inside space-y-1 text-xs leading-relaxed">
                  <li>下記の管理画面URLをスタッフに共有してください</li>
                  <li>スタッフが同URLからメールアドレス＋パスワードでサインアップを行います</li>
                  <li>サインアップ後、このスタッフ管理画面に自動的に追加されます</li>
                  <li>ここで権限を「Manager」または「Staff」に設定してください</li>
                </ol>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">
                  管理画面 URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inviteUrl}
                    readOnly
                    className="flex-1 border border-gray-200 rounded-sm px-3 py-2 text-sm bg-gray-50 text-gray-600 select-all"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-sm text-sm hover:border-gold hover:text-gold transition-colors"
                  >
                    {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied ? 'コピー済' : 'コピー'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-sm p-4 text-xs text-gray-500 space-y-1">
                <p className="font-bold text-gray-700">権限の違い</p>
                <p><span className="font-semibold text-purple-700">Owner</span> — 全機能＋スタッフ管理・設定が可能</p>
                <p><span className="font-semibold text-blue-700">Manager</span> — 全機能が利用可能（スタッフ管理・設定除く）</p>
                <p><span className="font-semibold text-gray-700">Staff</span> — 基本的な管理のみ（ニュース・シフト・予約確認等）</p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 border border-gray-200 text-sm text-gray-600 hover:border-gray-400 transition-colors rounded-sm"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
