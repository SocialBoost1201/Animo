'use client';

import { useState } from 'react';
import { Users, X, CheckCircle2, Clock, Eye, Sparkles } from 'lucide-react';
import { getNoticeReadStatus } from '@/lib/actions/internal-notices';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export function NoticeReadStatusModal({ 
  notice 
}: { 
  notice: { id: string; title: string; reads_count: number; total_casts: number; } 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<any[]>([]);

  const openModal = async () => {
    setIsOpen(true);
    if (statuses.length === 0) {
      setLoading(true);
      const data = await getNoticeReadStatus(notice.id);
      setStatuses(data);
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={openModal}
        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Eye size={16} />
        既読状況を見る
      </button>
    );
  }

  // Read: is_read === true
  // Unread: is_read === false
  const readCasts = statuses.filter(s => s.is_read);
  const unreadCasts = statuses.filter(s => !s.is_read);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl bg-white rounded-t-[32px] sm:rounded-[24px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-5 duration-300">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white/50 backdrop-blur-md flex items-start justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-[#171717] tracking-tight mb-1 flex items-center gap-2">
              <Users size={18} className="text-gray-400" /> 既読ステータス
            </h3>
            <p className="text-xs text-gray-500 truncate max-w-[280px]">対象: {notice.title}</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Sparkles className="w-6 h-6 animate-pulse mb-3" />
              <p className="text-sm font-medium">読み込み中...</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Unread Section */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-red-600 flex items-center gap-2">
                    <Clock size={16} /> 未読メンバー
                  </h4>
                  <span className="text-xs font-bold bg-red-50 text-red-600 px-2.5 py-1 rounded-full border border-red-100">
                    {unreadCasts.length} 名
                  </span>
                </div>
                
                {unreadCasts.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                    すべてのキャストが既読です 🎉
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unreadCasts.map(c => (
                      <div key={c.cast_id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-red-100 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          {c.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-serif">{c.stage_name[0]}</div>
                          )}
                        </div>
                        <span className="font-bold text-gray-700 text-sm truncate">{c.stage_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Read Section */}
              <div>
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-green-700 flex items-center gap-2">
                    <CheckCircle2 size={16} /> 既読メンバー
                  </h4>
                  <span className="text-xs font-bold bg-green-50 text-green-700 px-2.5 py-1 rounded-full border border-green-200">
                    {readCasts.length} 名
                  </span>
                </div>
                
                {readCasts.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
                    まだ誰も読んでいません
                  </p>
                ) : (
                  <div className="space-y-2">
                    {readCasts.map(c => (
                      <div key={c.cast_id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm transition-colors hover:border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                            {c.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={c.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-serif">{c.stage_name[0]}</div>
                            )}
                          </div>
                          <span className="font-bold text-gray-700 text-sm">{c.stage_name}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 font-medium tracking-wider">READ AT</span>
                          <p className="text-xs font-bold text-gray-600">
                            {c.read_at ? format(new Date(c.read_at), 'MM/dd HH:mm') : '-'}
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
        
        {/* Mobile Safe Area Padding */}
        <div className="h-6 bg-gray-50/50 sm:hidden"></div>
      </div>
    </div>
  );
}
