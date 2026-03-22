'use client'

import { useState, useTransition } from 'react'
import { StaffSlave, createStaff, updateStaff, deleteStaff } from '@/lib/actions/staffs'
import { Plus, Edit2, Trash2, CheckCircle, XCircle, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
  initialStaffs: StaffSlave[]
}

export function StaffList({ initialStaffs }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editingStaff, setEditingStaff] = useState<StaffSlave | null>(null)
  const [showForm, setShowForm] = useState(false)

  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold/30 focus:border-gold outline-none transition-all'

  const handleToggleActive = (staff: StaffSlave) => {
    const fd = new FormData()
    fd.set('name', staff.name)
    fd.set('display_name', staff.display_name)
    fd.set('role', staff.role || '')
    fd.set('is_active', (!staff.is_active).toString())

    startTransition(async () => {
      const result = await updateStaff(staff.id, fd)
      if (result.error) toast.error(result.error)
      else {
        toast.success(`${staff.display_name}のステータスを更新しました`)
        router.refresh()
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    
    startTransition(async () => {
      let result
      if (editingStaff) {
        result = await updateStaff(editingStaff.id, fd)
      } else {
        result = await createStaff(fd)
      }

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(editingStaff ? '更新しました' : '登録しました')
        setShowForm(false)
        setEditingStaff(null)
        router.refresh()
      }
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`${name}を削除してよろしいですか？（通常は「非在籍」への切り替えを推奨します）`)) return
    startTransition(async () => {
      const result = await deleteStaff(id)
      if (result.error) toast.error(result.error)
      else {
        toast.success('削除しました')
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!showForm && !editingStaff && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#171717] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gold transition-colors shadow-sm"
          >
            <Plus size={16} />
            スタッフを追加
          </button>
        )}
      </div>

      {(showForm || editingStaff) && (
        <div className="bg-white border-2 border-gold/20 rounded-2xl p-6 shadow-xl mb-6 max-w-lg">
          <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <UserCheck className="text-gold" />
            {editingStaff ? 'スタッフ編集' : 'スタッフ新規登録'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">名前（本名・内部用）</label>
              <input name="name" defaultValue={editingStaff?.name} required className={inputClass} placeholder="例: 佐藤 健司" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">表示名（ダッシュボード・LINE用）</label>
              <input name="display_name" defaultValue={editingStaff?.display_name} required className={inputClass} placeholder="例: さとうさん / ケンちゃん" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">役割（任意）</label>
              <input name="role" defaultValue={editingStaff?.role} className={inputClass} placeholder="例: 店長 / 黒服 / 裏方" />
            </div>
            <div className="flex items-center gap-4 py-2">
              <span className="text-xs font-bold text-gray-500">在籍ステータス</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="is_active" value="true" defaultChecked={editingStaff ? editingStaff.is_active : true} className="w-4 h-4 accent-[#171717]" />
                <span className="text-sm">在籍中</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="is_active" value="false" defaultChecked={editingStaff ? !editingStaff.is_active : false} className="w-4 h-4 accent-gray-400" />
                <span className="text-sm text-gray-400">非在籍</span>
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-[#171717] text-white py-2.5 rounded-lg text-sm font-bold hover:bg-gold transition-colors disabled:opacity-50"
              >
                {isPending ? '保存中...' : (editingStaff ? '更新する' : '登録する')}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingStaff(null) }}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-400 hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">表示名 / 名前</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">役割</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">ステータス</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialStaffs.map((staff) => (
                <tr key={staff.id} className={`group hover:bg-gray-50/50 transition-colors ${!staff.is_active ? 'opacity-60 grayscale' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#171717]">{staff.display_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{staff.name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {staff.role || <span className="text-gray-300">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(staff)}
                      disabled={isPending}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
                        staff.is_active 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {staff.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {staff.is_active ? '在籍中' : '非在籍'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditingStaff(staff)}
                        className="p-2 text-gray-400 hover:text-gold transition-colors"
                        title="編集"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(staff.id, staff.display_name)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="削除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialStaffs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">
                    登録されているスタッフはいません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
