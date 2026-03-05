import { getCasts, deleteCast } from '@/lib/actions/casts'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function CastsPage() {
  const casts = await getCasts()

  async function handleDelete(data: FormData) {
    'use server'
    const id = data.get('id') as string
    await deleteCast(id)
    revalidatePath('/admin/casts')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Casts Management</h1>
          <p className="text-sm text-gray-500 mt-2">所属キャストの登録・編集・出勤状態の管理</p>
        </div>
        <Link 
          href="/admin/casts/new" 
          className="bg-[#171717] hover:bg-[var(--color-gold)] text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          新規登録
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs tracking-widest text-gray-500 uppercase">
              <th className="px-6 py-4 font-bold">Image</th>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Today's Shift</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {casts?.map((cast) => (
              <tr key={cast.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <img src={cast.image_url} alt={cast.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-[#171717]">{cast.name}</p>
                  <p className="text-xs text-gray-400">/{cast.slug}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    cast.status === 'public' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {cast.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    cast.is_today 
                      ? 'bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20' 
                      : 'text-gray-400'
                  }`}>
                    {cast.is_today ? '出勤' : '休み'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    <Link 
                      href={`/admin/casts/${cast.id}`}
                      className="p-2 text-gray-400 hover:text-[#171717] transition-colors rounded hover:bg-gray-100"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={cast.id} />
                      <button 
                        type="submit"
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                        onClick={(e) => {
                          if (!confirm(`${cast.name} を削除してもよろしいですか？`)) e.preventDefault()
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            
            {(!casts || casts.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  キャストが登録されていません。<br/>右上の「新規登録」ボタンから追加してください。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
