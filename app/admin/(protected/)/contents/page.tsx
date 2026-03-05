import { getContents, deleteContent } from '@/lib/actions/contents'
import Link from 'next/link'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function ContentsPage() {
  // News, Event を取得
  const contents = await getContents()
  const filteredContents = contents?.filter(c => c.type === 'news' || c.type === 'event')

  async function handleDelete(data: FormData) {
    'use server'
    const id = data.get('id') as string
    await deleteContent(id)
    revalidatePath('/admin/contents')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">News & Events</h1>
          <p className="text-sm text-gray-500 mt-2">ニュースとお知らせ、各種イベントの管理</p>
        </div>
        <Link 
          href="/admin/contents/new" 
          className="bg-[#171717] hover:bg-[var(--color-gold)] text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          新規投稿
        </Link>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs tracking-widest text-gray-500 uppercase">
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold">Title</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredContents?.map((content) => (
              <tr key={content.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    content.type === 'event' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {content.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-[#171717] line-clamp-1">{content.title}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {content.content_date ? content.content_date.slice(0, 10).replace(/-/g, '/') : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                    content.is_published 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {content.is_published ? '公開中' : '下書き'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end items-center gap-2">
                    {/* Placeholder action icons */}
                    <button className="p-2 text-gray-400 hover:text-[#171717] transition-colors rounded hover:bg-gray-100">
                      <Edit2 size={16} />
                    </button>
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={content.id} />
                      <button 
                        type="submit"
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                        onClick={(e) => {
                          if (!confirm(`削除してもよろしいですか？`)) e.preventDefault()
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            
            {(!filteredContents || filteredContents.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  記事が登録されていません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
