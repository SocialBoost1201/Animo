import { getContents, deleteContent } from '@/lib/actions/contents'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { Plus, Edit2, Trash2, Newspaper, CalendarDays, CheckCircle2, FileText, Tag } from 'lucide-react'

export default async function ContentsPage() {
  const contents = await getContents()
  const allContents = contents?.filter((c) => c.type === 'news' || c.type === 'event') ?? []

  const published  = allContents.filter((c) => c.is_published)
  const drafts     = allContents.filter((c) => !c.is_published)
  const newsItems  = allContents.filter((c) => c.type === 'news')
  const eventItems = allContents.filter((c) => c.type === 'event')

  async function handleDelete(data: FormData) {
    'use server'
    const id = data.get('id') as string
    await deleteContent(id)
    revalidatePath('/admin/contents')
  }

  const kpis = [
    { label: '総コンテンツ', value: allContents.length, icon: FileText, color: 'text-[#dfbd69]', bg: 'bg-[#dfbd6914]' },
    { label: '公開中',       value: published.length,   icon: CheckCircle2, color: 'text-[#72b894]', bg: 'bg-[#72b89414]' },
    { label: 'NEWS',         value: newsItems.length,   icon: Newspaper,    color: 'text-[#6ab0d4]', bg: 'bg-[#6ab0d414]' },
    { label: 'EVENT',        value: eventItems.length,  icon: CalendarDays, color: 'text-[#a882d8]', bg: 'bg-[#a882d814]' },
  ]

  return (
    <div className="space-y-5 font-inter">

      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4
                      rounded-[20px] border border-[#dfbd69]/22
                      bg-[linear-gradient(135deg,#181510_0%,#131313_50%,#101010_100%)]
                      px-6 py-5">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold tracking-[-0.31px] text-[#f4f1ea]">ニュース・イベント管理</h1>
          <p className="text-[11px] text-[#8a8478]">公開サイトのニュース・イベント記事の管理と公開設定</p>
        </div>
        <Link
          href="/admin/contents/new"
          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[12px] px-5 py-2.5
                     text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.02] active:scale-[0.98]
                     shadow-[0_4px_16px_rgba(223,189,105,0.2)]"
          style={{ background: 'linear-gradient(90deg,rgba(223,189,105,1) 0%,rgba(146,111,52,1) 100%)' }}
        >
          <Plus size={14} strokeWidth={3} />
          新規投稿
        </Link>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] px-4 py-4 flex items-center gap-3"
          >
            <div className={`flex h-[36px] w-[36px] items-center justify-center rounded-[10px] ${k.bg} shrink-0`}>
              <k.icon size={16} className={k.color} strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[10px] text-[#5a5650] uppercase tracking-wider font-medium">{k.label}</p>
              <p className={`text-[22px] font-bold leading-none mt-0.5 ${k.color}`}>{k.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Status Summary Bar ── */}
      {allContents.length > 0 && (
        <div className="flex items-center gap-3 rounded-[14px] border border-[#ffffff08] bg-[#17181c] px-5 py-3">
          <div className="flex-1 h-[6px] rounded-full bg-[#ffffff08] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round((published.length / (allContents.length || 1)) * 100)}%`,
                background: 'linear-gradient(90deg,#72b894,#4a9870)',
              }}
            />
          </div>
          <p className="text-[11px] font-medium text-[#8a8478] shrink-0">
            公開率{' '}
            <span className="text-[#72b894] font-bold">
              {Math.round((published.length / (allContents.length || 1)) * 100)}%
            </span>
            <span className="ml-2 text-[#5a5650]">
              ({published.length}/{allContents.length}件)
            </span>
          </p>
          {drafts.length > 0 && (
            <span className="rounded-full bg-[#ffffff08] px-2 py-0.5 text-[10px] font-bold text-[#8a8478]">
              下書き {drafts.length}件
            </span>
          )}
        </div>
      )}

      {/* ── Content Table ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        <div className="flex items-center gap-3 px-5 h-[52px] border-b border-[#ffffff08]">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] bg-[#dfbd6914]">
            <Tag size={13} className="text-[#dfbd69]" />
          </div>
          <p className="text-[12px] font-semibold text-[#f4f1ea]">コンテンツ一覧</p>
          <span className="ml-auto text-[10px] text-[#5a5650]">{allContents.length}件</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1c1d22] border-b border-[#ffffff08]">
                {['種別', 'タイトル', '日付', 'ステータス', '操作'].map((h, i) => (
                  <th key={i} className={`px-5 py-3 ${i === 4 ? 'text-right' : ''}`}>
                    <span className="text-[9px] font-bold tracking-[0.8px] text-[#5a5650] uppercase">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff06]">
              {allContents.map((content) => (
                <tr key={content.id} className="hover:bg-[#ffffff04] transition-colors group">
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        content.type === 'event'
                          ? 'bg-[#a882d814] text-[#a882d8]'
                          : 'bg-[#6ab0d414] text-[#6ab0d4]'
                      }`}
                    >
                      {content.type === 'event' ? 'EVENT' : 'NEWS'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 max-w-[260px]">
                    <p className="truncate text-[12px] font-semibold text-[#c7c0b2] group-hover:text-[#f4f1ea] transition-colors">
                      {content.title}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] text-[#5a5650]">
                      {content.content_date
                        ? content.content_date.slice(0, 10).replace(/-/g, '/')
                        : '–'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        content.is_published
                          ? 'bg-[#72b89414] text-[#72b894]'
                          : 'bg-[#ffffff08] text-[#5a5650]'
                      }`}
                    >
                      {content.is_published ? '公開中' : '下書き'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end items-center gap-1">
                      <Link
                        href={`/admin/contents/${content.id}/edit`}
                        className="rounded-[8px] p-1.5 text-[#5a5650] transition-colors hover:bg-[#dfbd6914] hover:text-[#dfbd69]"
                        title="編集"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <form action={handleDelete}>
                        <input type="hidden" name="id" value={content.id} />
                        <button
                          type="submit"
                          className="rounded-[8px] p-1.5 text-[#5a5650] transition-colors hover:bg-[#d4785a14] hover:text-[#d4785a]"
                          title="削除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}

              {allContents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <Newspaper size={24} className="mx-auto mb-3 text-[#5a5650]" />
                    <p className="text-[12px] text-[#5a5650] italic mb-4">記事が登録されていません</p>
                    <Link
                      href="/admin/contents/new"
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#dfbd69] hover:underline"
                    >
                      <Plus size={13} />
                      最初の記事を投稿する
                    </Link>
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
