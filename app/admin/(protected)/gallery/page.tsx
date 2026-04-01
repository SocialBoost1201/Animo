import { getContents } from '@/lib/actions/contents'
import { PauseCircle } from 'lucide-react'

export default async function GalleryPage() {
  const contents = await getContents('gallery')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Gallery</h1>
          <p className="text-sm text-gray-500 mt-2">公開ギャラリー確認用の一覧です</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-sm border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold tracking-widest text-amber-800">
          <PauseCircle size={16} />
          静的運用中
        </div>
      </div>

      <div className="rounded-sm border border-amber-200 bg-amber-50 p-4">
        <p className="text-xs font-bold tracking-widest text-amber-800 uppercase">公開反映は停止中です</p>
        <p className="mt-2 text-sm leading-6 text-amber-900">
          現在の公開 <span className="font-bold">/gallery</span> は静的データで固定運用しています。
          この管理画面の登録内容は公開サイトへ反映されないため、追加・編集・削除は一時停止しています。
        </p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs tracking-widest text-gray-500 uppercase">
              <th className="px-6 py-4 font-bold">Image</th>
              <th className="px-6 py-4 font-bold">Caption</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Operation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {contents?.map((content) => (
              <tr key={content.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-20 h-14 rounded-sm overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <img src={content.image_url} alt={content.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-[#171717]">{content.title}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                    {content.category}
                  </span>
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
                  <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-bold tracking-wider text-gray-500">
                    停止中
                  </span>
                </td>
              </tr>
            ))}
            
            {(!contents || contents.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">
                  ギャラリー画像が登録されていません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
