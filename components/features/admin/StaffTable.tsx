'use client'

import { useState } from 'react'
import { updateStaffRole, removeStaff } from '@/lib/actions/staffs'
import { showToast } from '@/components/ui/Toast'
import { Trash2 } from 'lucide-react'

type Profile = {
  id: string
  role: string
  display_name: string | null
  created_at: string
}

const ROLE_LABELS: Record<string, string> = {
  owner: 'Owner',
  manager: 'Manager',
  staff: 'Staff',
}

const ROLE_COLORS: Record<string, string> = {
  owner: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  staff: 'bg-gray-100 text-gray-800',
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
    <div className="bg-white border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-medium tracking-wider">ユーザー名</th>
              <th className="px-6 py-4 font-medium tracking-wider">現在の権限</th>
              <th className="px-6 py-4 font-medium tracking-wider">登録日</th>
              <th className="px-6 py-4 font-medium tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {profiles.length > 0 ? (
              profiles.map((profile) => {
                const isOwner = profile.role === 'owner'
                const isSelf = profile.id === currentUserId
                const isUpdating = updating === profile.id
                const isRemoving = removing === profile.id

                return (
                  <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#171717]">
                        {profile.display_name || '名前未設定'}
                        {isSelf && (
                          <span className="ml-2 text-xs text-gray-400 font-normal">（自分）</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {profile.id.substring(0, 13)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${ROLE_COLORS[profile.role] ?? 'bg-gray-100 text-gray-800'}`}>
                        {ROLE_LABELS[profile.role] ?? profile.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* 権限変更ドロップダウン */}
                        <select
                          defaultValue={profile.role}
                          disabled={isOwner || isUpdating}
                          onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                          className="text-sm border border-gray-200 rounded px-2 py-1 bg-white hover:border-gray-300 focus:outline-none focus:border-gold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="owner">Owner</option>
                          <option value="manager">Manager</option>
                          <option value="staff">Staff</option>
                        </select>
                        {isUpdating && (
                          <span className="text-xs text-gray-400">更新中...</span>
                        )}

                        {/* 削除ボタン（オーナー・自分自身は不可） */}
                        {!isOwner && !isSelf && (
                          <button
                            onClick={() => handleRemove(profile.id, profile.display_name ?? '未設定')}
                            disabled={isRemoving}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 p-1"
                            title="削除"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                  スタッフアカウントが見つかりません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
