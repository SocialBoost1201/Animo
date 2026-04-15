'use client';

import { useState } from 'react';
import { Users, X, CheckCircle2, Clock, Eye, Sparkles } from 'lucide-react';
import { getNoticeReadStatus, type NoticeReadStatus } from '@/lib/actions/internal-notices';
import { format } from 'date-fns';

export function NoticeReadStatusModal({ 
  notice 
}: { 
  notice: { id: string; title: string; reads_count: number; total_casts: number; } 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<NoticeReadStatus[]>([]);

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
        className="flex items-center gap-2.5 px-6 py-3 bg-black border border-white/10 text-[#f4f1ea] rounded-sm text-[11px] font-bold tracking-[1.5px] hover:bg-white/5 hover:border-gold/30 transition-all shadow-xl active:scale-95 group"
      >
        <Eye size={14} className="text-[#8a8478] group-hover:text-gold transition-colors" />
        既読状況を確認
      </button>
    );
  }

  // Read: is_read === true
  // Unread: is_read === false
  const readCasts = statuses.filter((status) => status.is_read);
  const unreadCasts = statuses.filter((status) => !status.is_read);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-500"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal */}
      <div className="relative w-full sm:max-w-xl bg-black border-t sm:border border-white/10 sm:rounded-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[80vh] animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 bg-white/[0.02] flex items-start justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-[3px] text-gold uppercase mb-2 block">ADMIN NOTICE</span>
            <h3 className="text-xl font-serif font-bold text-[#f4f1ea] tracking-tight">
              既読ステータス
            </h3>
            <p className="text-[11px] text-[#5a5650] truncate max-w-[280px] mt-1 font-medium italic">対象: {notice.title}</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-[#8a8478] hover:text-[#f4f1ea] hover:bg-white/10 rounded-full transition-all border border-transparent hover:border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 bg-transparent custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#5a5650]">
              <div className="w-1 track-h-16 bg-white/5 rounded-full overflow-hidden mb-6 relative">
                 <div className="absolute inset-0 bg-gold animate-progress-vertical"></div>
              </div>
              <p className="text-[11px] font-bold tracking-widest uppercase animate-pulse">Establishing Connection...</p>
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* Unread Section */}
              <section>
                <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                  <h4 className="text-[10px] font-bold tracking-[2px] text-red-500/80 flex items-center gap-2 uppercase">
                    <Clock size={14} /> Unread Members
                  </h4>
                  <span className="text-[10px] font-bold bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20">
                    {unreadCasts.length}
                  </span>
                </div>
                
                {unreadCasts.length === 0 ? (
                  <div className="p-10 text-center bg-white/[0.02] rounded-sm border border-white/5 shadow-inner">
                    <p className="text-xs text-[#8a8478] font-medium tracking-wide">
                      すべてのキャストが既読です
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {unreadCasts.map(c => (
                      <div key={c.cast_id} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-sm border border-white/5 group hover:border-red-500/30 transition-all">
                        <div className="w-10 h-10 rounded-full bg-black overflow-hidden shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform">
                          {c.image_url ? (
                            <img src={c.image_url} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#5a5650] text-xs font-serif italic">{c.stage_name[0]}</div>
                          )}
                        </div>
                        <span className="font-bold text-[#8a8478] group-hover:text-[#f4f1ea] text-sm truncate transition-colors font-serif">{c.stage_name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Read Section */}
              <section>
                <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                  <h4 className="text-[10px] font-bold tracking-[2px] text-green-500/80 flex items-center gap-2 uppercase">
                    <CheckCircle2 size={14} /> Read Members
                  </h4>
                  <span className="text-[10px] font-bold bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                    {readCasts.length}
                  </span>
                </div>
                
                {readCasts.length === 0 ? (
                  <div className="p-10 text-center bg-white/[0.02] rounded-sm border border-white/5 shadow-inner">
                    <p className="text-xs text-[#5a5650] italic"> まだ誰も読んでいません </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {readCasts.map(c => (
                      <div key={c.cast_id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-sm border border-white/5 transition-all hover:bg-white/[0.05] hover:border-gold/20 group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black overflow-hidden shrink-0 border border-white/10 shadow-lg group-hover:border-gold/30 transition-all">
                            {c.image_url ? (
                              <img src={c.image_url} alt="" className="w-full h-full object-cover transition-all duration-700" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#5a5650] text-xs font-serif italic">{c.stage_name[0]}</div>
                            )}
                          </div>
                          <span className="font-bold text-[#f4f1ea] text-sm font-serif">{c.stage_name}</span>
                        </div>
                        <div className="text-right flex flex-col items-end gap-1">
                          <span className="text-[9px] text-gold/60 font-bold tracking-[2px] uppercase">CONFIRMED</span>
                          <p className="text-[11px] font-bold text-[#8a8478] tracking-widest tabular-nums">
                            {c.read_at ? format(new Date(c.read_at), 'MM/dd HH:mm') : '-'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          )}
        </div>
        
        {/* Footer info/padding */}
        <div className="px-8 py-4 border-t border-white/5 bg-black/50 text-center">
            <p className="text-[10px] text-[#5a5650] uppercase tracking-widest">End of Report</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress-vertical {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .animate-progress-vertical {
          animation: progress-vertical 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
