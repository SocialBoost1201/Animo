import { getContents, deleteContent } from '@/lib/actions/contents'
import Link from 'next/link'
import { Plus, Edit2, Trash2, Newspaper } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function ContentsPage() {
  const contents = await getContents()
  const filteredContents = contents?.filter(c => c.type === 'news' || c.type === 'event')

  async function handleDelete(data: FormData) {
    'use server'
    const id = data.get('id') as string
    await deleteContent(id)
    revalidatePath('/admin/contents')
  }

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">ニュース管理</h1>
          <p className="text-[11px] text-[#8a8478]">ニュース・イベント記事の管理と公開設定</p>
        </div>
        <Link
          href="/admin/contents/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[12px] font-semibold text-[#0b0b0d] transition-transform hover:scale-[1.02] whitespace-nowrap"
          style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
        >
          <Plus size={13} strokeWidth={3} />
          新規投稿
        </Link>
      </div>

      {/* ── Content Table ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1c1d22] border-b border-[#ffffff08]">
                <th className="px-5 py-3">
                  <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">種別</span>
                </th>
                <th className="px-5 py-3">
                  <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">タイトル</span>
                </th>
                <th className="px-5 py-3">
                  <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">日付</span>
                </th>
                <th className="px-5 py-3">
                  <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">ステータス</span>
                </th>
                <th className="px-5 py-3 text-right">
                  <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">操作</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff08]">
              {filteredContents?.map((content) => (
                <tr key={content.id} className="hover:bg-[#ffffff04] transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      content.type === 'event'
                        ? 'bg-[#a882d814] text-[#a882d8]'
                        : 'bg-[#6ab0d414] text-[#6ab0d4]'
                    }`}>
                      {content.type === 'event' ? 'EVENT' : 'NEWS'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[12px] font-semibold text-[#c7c0b2] line-clamp-1">{content.title}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] text-[#5a5650]">
                      {content.content_date ? content.content_date.slice(0, 10).replace(/-/g, '/') : '–'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      content.is_published
                        ? 'bg-[#72b89414] text-[#72b894]'
                        : 'bg-[#ffffff08] text-[#5a5650]'
                    }`}>
                      {content.is_published ? '公開中' : '下書き'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end items-center gap-1">
                      <Link
                        href={`/admin/contents/${content.id}/edit`}
                        className="p-2 text-[#5a5650] hover:text-[#c7c0b2] transition-colors rounded-[8px] hover:bg-[#ffffff08]"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={content.id} />
                        <button
                          type="submit"
                          className="p-2 text-[#5a5650] hover:text-[#d4785a] transition-colors rounded-[8px] hover:bg-[#d4785a10]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!filteredContents || filteredContents.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center">
                    <Newspaper size={24} className="mx-auto mb-3 text-[#5a5650]" />
                    <p className="text-[12px] text-[#5a5650] italic">記事が登録されていません</p>
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
