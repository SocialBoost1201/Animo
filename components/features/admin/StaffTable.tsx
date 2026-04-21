'use client'

import { useState } from 'react'
import { updateStaffRole, removeStaff } from '@/lib/actions/staffs'
import { showToast } from '@/components/ui/Toast'
import { Trash2, Loader2 } from 'lucide-react'

type Profile = {
  id: string
  role: string
  display_name: string | null
  created_at: string
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'オーナー',
  manager: '管理者',
  staff: 'スタッフ',
}

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-gold/10 text-gold border border-gold/20',
  manager: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  staff: 'bg-white/5 text-[#f4f1ea] border border-white/10',
}

export function StaffTable({
  profiles,
  currentUserId,
}: {
  profiles: Profile[]
  currentUserId: string
}) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [removing, setRemoving] = useState<string | null>(null)

  async function handleRoleChange(id: string, role: string) {
    setUpdating(id)
    const result = await updateStaffRole(id, role)
    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast('権限を更新しました', 'success')
    }
    setUpdating(null)
  }

  async function handleRemove(id: string, name: string) {
    if (!confirm(`「${name}」のアカウントを削除しますか？`)) return
    setRemoving(id)
    const result = await removeStaff(id)
    if (result.error) {
      showToast(result.error, 'error')
    } else {
      showToast('スタッフを削除しました', 'success')
    }
    setRemoving(null)
  }

  return (
    <div className="bg-black/94 border border-white/10 overflow-hidden shadow-2xl rounded-2xl animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">ユーザー名</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">現在の権限</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap">登録日</th>
              <th className="px-8 py-5 text-[10px] font-black tracking-[3px] text-[#8a8478] uppercase whitespace-nowrap text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/3">
            {profiles.length > 0 ? (
              profiles.map((profile) => {
                const isOwner = profile.role === 'owner'
                const isSelf = profile.id === currentUserId
                const isUpdating = updating === profile.id
                const isRemoving = removing === profile.id

                return (
                  <tr key={profile.id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="font-bold text-[#f4f1ea] leading-none mb-1.5 flex items-center gap-2">
                        {profile.display_name || '名前未設定'}
                        {isSelf && (
                          <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[8px] font-black tracking-widest uppercase border border-gold/20">本人</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#5a5650] font-mono tracking-tighter">
                        {profile.id.substring(0, 18)}...
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase border ${ROLE_COLORS[profile.role] ?? 'bg-white/5 text-gray-500 border-white/10'}`}>
                        {ROLE_LABELS[profile.role] ?? profile.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-[#8a8478] font-medium tabular-nums">
                      {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-4 overflow-visible">
                        {/* 権限変更ドロップダウン */}
                        <div className="relative group/select">
                          <select
                            defaultValue={profile.role}
                            disabled={isOwner || isUpdating}
                            onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                            className="text-[11px] font-bold tracking-wider border border-white/10 rounded-lg px-4 py-2 bg-black/60 text-[#f4f1ea] hover:border-gold/50 focus:outline-none focus:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all outline-none appearance-none pr-10 cursor-pointer shadow-lg"
                          >
                            <option value="owner" className="bg-black text-white">オーナー</option>
                            <option value="manager" className="bg-black text-white">管理者</option>
                            <option value="staff" className="bg-black text-white">スタッフ</option>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5a5650] group-hover/select:text-gold transition-colors">
                            <svg className="w-4 h-4 fill-current opacity-50" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                          </div>
                        </div>
                        
                        {isUpdating && (
                          <div className="flex items-center gap-2 text-[10px] text-gold font-bold animate-pulse">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>更新中</span>
                          </div>
                        )}

                        {/* 削除ボタン（オーナー・自分自身は不可） */}
                        {!isOwner && !isSelf && (
                          <button
                            onClick={() => handleRemove(profile.id, profile.display_name ?? '未設定')}
                            disabled={isRemoving}
                            className="text-[#5a5650] hover:text-red-500 transition-all duration-300 disabled:opacity-50 p-2.5 rounded-xl hover:bg-red-500/10 hover:scale-110 active:scale-90"
                            title="削除"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center space-y-3">
                  <div className="text-[#3a3630] font-black text-2xl opacity-10 uppercase tracking-[10px]">未登録</div>
                  <p className="text-[#8a8478] text-sm italic font-medium">スタッフアカウントが見つかりません</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
