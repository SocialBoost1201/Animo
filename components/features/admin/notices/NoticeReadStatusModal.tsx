'use client'

import { useState } from 'react'
import { Users, X, CheckCircle2, Clock, Eye, Loader2 } from 'lucide-react'
import { getNoticeReadStatus } from '@/lib/actions/internal-notices'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export function NoticeReadStatusModal({ 
  notice 
}: { 
  notice: { id: string; title: string; reads_count: number; total_casts: number; } 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statuses, setStatuses] = useState<any[]>([])

  const openModal = async () => {
    setIsOpen(true)
    if (statuses.length === 0) {
      setLoading(true)
      const data = await getNoticeReadStatus(notice.id)
      setStatuses(data)
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={openModal}
        className="flex items-center gap-1.5 h-[33px] px-4 rounded-[8px] bg-[#ffffff08] border border-[#ffffff0f] text-[11px] font-bold text-[#c7c0b2] hover:bg-[#ffffff0f] hover:text-[#f4f1ea] transition-all"
      >
        <Eye size={13} />
        既読状況
      </button>
    )
  }

  const readCasts = statuses.filter(s => s.is_read)
  const unreadCasts = statuses.filter(s => !s.is_read)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl bg-[#1c1d22] border border-[#ffffff0f] rounded-t-[24px] sm:rounded-[18px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-5 duration-300">

        {/* Header */}
        <div className="px-6 py-5 border-b border-[#ffffff08] flex items-start justify-between shrink-0">
          <div>
            <h3 className="text-[14px] font-bold text-[#f4f1ea] tracking-tight flex items-center gap-2">
              <Users size={16} className="text-[#8a8478]" /> 既読ステータス
            </h3>
            <p className="text-[11px] text-[#5a5650] mt-0.5 truncate max-w-[280px]">{notice.title}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-[30px] h-[30px] flex items-center justify-center text-[#5a5650] hover:text-[#f4f1ea] bg-[#ffffff06] hover:bg-[#ffffff0f] rounded-full transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-5 h-5 text-[#dfbd69] animate-spin" />
              <p className="text-[12px] font-medium text-[#5a5650]">読み込み中...</p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Unread Section */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-[#ffffff08] pb-3">
                  <h4 className="text-[12px] font-bold text-[#d4785a] flex items-center gap-2">
                    <Clock size={13} /> 未読メンバー
                  </h4>
                  <span className="text-[10px] font-bold bg-[#d4785a14] text-[#d4785a] px-2.5 py-1 rounded-full border border-[#d4785a30]">
                    {unreadCasts.length} 名
                  </span>
                </div>

                {unreadCasts.length === 0 ? (
                  <p className="text-[12px] text-[#72b894] py-4 text-center bg-[#72b8940a] rounded-[12px] border border-[#72b89420]">
                    すべてのキャストが既読です 🎉
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {unreadCasts.map(c => (
                      <div key={c.cast_id} className="flex items-center gap-3 p-3 bg-[#d4785a08] rounded-[10px] border border-[#d4785a20]">
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#ffffff0f] bg-[#ffffff05]">
                          {c.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#5a5650] text-xs">{c.stage_name[0]}</div>
                          )}
                        </div>
                        <span className="font-bold text-[#f4f1ea] text-[13px] truncate">{c.stage_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Read Section */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-[#ffffff08] pb-3">
                  <h4 className="text-[12px] font-bold text-[#72b894] flex items-center gap-2">
                    <CheckCircle2 size={13} /> 既読メンバー
                  </h4>
                  <span className="text-[10px] font-bold bg-[#72b8940a] text-[#72b894] px-2.5 py-1 rounded-full border border-[#72b89430]">
                    {readCasts.length} 名
                  </span>
                </div>

                {readCasts.length === 0 ? (
                  <p className="text-[12px] text-[#5a5650] py-4 text-center bg-[#ffffff03] rounded-[12px] border border-[#ffffff08]">
                    まだ誰も読んでいません
                  </p>
                ) : (
                  <div className="space-y-2">
                    {readCasts.map(c => (
                      <div key={c.cast_id} className="flex items-center justify-between p-3 bg-[#ffffff03] rounded-[10px] border border-[#ffffff08] hover:bg-[#ffffff06] transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-[#ffffff0f] bg-[#ffffff05]">
                            {c.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#5a5650] text-xs">{c.stage_name[0]}</div>
                            )}
                          </div>
                          <span className="font-bold text-[#f4f1ea] text-[13px]">{c.stage_name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-[#5a5650] font-bold uppercase tracking-widest">READ AT</span>
                          <p className="text-[11px] font-bold text-[#c7c0b2]">
                            {c.read_at ? format(new Date(c.read_at), 'MM/dd HH:mm', { locale: ja }) : '–'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Mobile Safe Area */}
        <div className="h-6 sm:hidden bg-[#1c1d22]" />
      </div>
    </div>
  )
}
