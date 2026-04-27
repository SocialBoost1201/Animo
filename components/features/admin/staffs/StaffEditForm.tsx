'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, AlertTriangle, Loader2, Save, Trash2, UserCheck } from 'lucide-react'
import { updateStaff, deleteStaff } from '@/lib/actions/staffs'
import { type StaffSlave } from '@/lib/actions/staffs'
import { showToast } from '@/components/ui/Toast'
import { useAdminTheme } from '@/components/providers/AdminThemeProvider'

const STAFF_LIST_PATH = '/admin/staffs'

const ROLE_OPTIONS = [
  { value: '', label: '未設定' },
  { value: '一般スタッフ', label: '一般スタッフ' },
  { value: 'ホールスタッフ', label: 'ホールスタッフ' },
  { value: 'マネージャー', label: 'マネージャー' },
  { value: 'レセプション', label: 'レセプション' },
]

type StaffFieldErrors = {
  name?: string
  displayName?: string
}

export function StaffEditForm({ staff }: { staff: StaffSlave }) {
  const router = useRouter()
  const { F } = useAdminTheme()
  const [name, setName] = useState(staff.name)
  const [displayName, setDisplayName] = useState(staff.display_name)
  const [role, setRole] = useState(staff.role ?? '')
  const [isActive, setIsActive] = useState(staff.is_active)
  const [isPending, setIsPending] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<StaffFieldErrors>({})

  const inputClass = F.input
  const labelClass = F.label

  function validateFields() {
    const nextErrors: StaffFieldErrors = {}
    if (!name.trim()) nextErrors.name = '名前を入力してください。'
    if (!displayName.trim()) nextErrors.displayName = '表示名を入力してください。'
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    if (!validateFields()) {
      setFormError('入力内容を確認してください。')
      return
    }
    setIsPending(true)
    const formData = new FormData(event.currentTarget)
    formData.set('name', name.trim())
    formData.set('display_name', displayName.trim())
    formData.set('role', role)
    formData.set('is_active', isActive ? 'true' : 'false')

    try {
      const result = await updateStaff(staff.id, formData)
      if (result.error) {
        setFormError(result.error)
        showToast(result.error, 'error')
        return
      }
      showToast('スタッフ情報を更新しました', 'success')
      router.push(STAFF_LIST_PATH)
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'スタッフ更新に失敗しました。'
      setFormError(message)
      showToast(message, 'error')
    } finally {
      setIsPending(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`「${staff.name}」を削除しますか？この操作は取り消せません。`)) return
    setIsDeleting(true)
    try {
      const result = await deleteStaff(staff.id)
      if (result.error) {
        showToast(result.error, 'error')
        return
      }
      showToast('スタッフを削除しました', 'success')
      router.push(STAFF_LIST_PATH)
      router.refresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'スタッフ削除に失敗しました。'
      showToast(message, 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl font-sans">
      <div className="mb-8">
        <Link prefetch={false} href={STAFF_LIST_PATH} className={F.backLink}>
          <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center mr-3 transition-colors group-hover:border-gold/40">
            <ArrowLeft size={14} className="group-hover:text-gold transition-colors" />
          </div>
          <span className="uppercase font-bold tracking-[3px]">Back to staff list</span>
        </Link>
      </div>

      <div className={`${F.card} p-6 md:p-12 relative overflow-hidden`}>
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />

        <div className="mb-12 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-gold/20 bg-gold/10 text-gold">
              <UserCheck size={18} />
            </div>
            <div>
              <h2 className={`text-3xl font-serif tracking-tighter ${F.heading}`}>Edit Staff</h2>
              <p className="text-[10px] font-bold tracking-[3px] text-[#5a5650] uppercase italic">
                {staff.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-red-500/20 text-red-400/70 text-xs font-bold uppercase tracking-[2px] hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/5 transition-all disabled:opacity-40"
          >
            {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Delete
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {formError && (
            <div className={F.error}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-bold tracking-[4px] text-[#5a5650] uppercase">Staff Profile</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <label htmlFor="staff_name" className={labelClass}>
                  名前 / Name <span className="text-red-500/50">*</span>
                </label>
                <input
                  id="staff_name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  required
                  className={inputClass}
                  autoComplete="off"
                />
                {fieldErrors.name && (
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="staff_display_name" className={labelClass}>
                  表示名 / Display Name <span className="text-red-500/50">*</span>
                </label>
                <input
                  id="staff_display_name"
                  name="display_name"
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, displayName: undefined }))
                  }}
                  required
                  className={inputClass}
                  autoComplete="off"
                />
                {fieldErrors.displayName && (
                  <p className="mt-2 text-[10px] font-bold text-red-400 bg-red-400/5 px-2 py-1 rounded-sm inline-block tracking-wider">
                    {fieldErrors.displayName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="staff_role" className={labelClass}>役職 / Role</label>
                <select
                  id="staff_role"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option.label} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="staff_is_active" className={labelClass}>ステータス / Status</label>
                <label className="flex min-h-12 items-center gap-3 rounded-sm border border-white/10 bg-black/30 px-4 text-sm text-[#f4f1ea] transition-colors hover:border-gold/30">
                  <input
                    id="staff_is_active"
                    name="is_active"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 accent-[#dfbd69]"
                  />
                  <span className="font-bold tracking-wider">有効なスタッフとして登録する</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={STAFF_LIST_PATH}
              className="inline-flex h-11 items-center justify-center rounded-sm border border-white/10 px-6 text-xs font-black uppercase tracking-[2px] text-[#8a8478] transition-all hover:bg-white/5 hover:text-[#f4f1ea]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-sm bg-gold px-6 text-xs font-black uppercase tracking-[2px] text-black shadow-lg shadow-gold/20 transition-all hover:bg-[#d4b35a] active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
