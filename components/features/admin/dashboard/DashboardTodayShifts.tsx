import { getDashboardCastShifts } from '@/lib/actions/dashboard';
import Link from 'next/link';
import { ChevronRight, Users } from 'lucide-react';

const STATUS_CONFIG = {
  confirmed: {
    label: '確定',
    bg: 'bg-[#50a06414]',
    border: 'border-[#50a0642e]',
    textColor: 'text-[#72b894]',
    dot: 'bg-[#72b894]',
  },
  late: {
    label: '予定遅刻',
    bg: 'bg-[#c8823214]',
    border: 'border-[#c882322e]',
    textColor: 'text-[#c8884d]',
    dot: 'bg-[#c8884d]',
  },
  trial: {
    label: '体験入店',
    bg: 'bg-[#dfbd6914]',
    border: 'border-[#dfbd692e]',
    textColor: 'text-[#dfbd69]',
    dot: 'bg-[#dfbd69]',
  },
  pending: {
    label: '確認待ち',
    bg: 'bg-[#8a847814]',
    border: 'border-[#8a84782e]',
    textColor: 'text-[#8a8478]',
    dot: 'bg-[#8a8478]',
  },
} as const;

export async function DashboardTodayShifts() {
  const casts = await getDashboardCastShifts();

  const confirmedCount = casts.filter((c) => c.status === 'confirmed').length;
  const lateCount = casts.filter((c) => c.status === 'late').length;
  const trialCount = casts.filter((c) => c.status === 'trial').length;

  return (
    <div className="flex flex-col rounded-[18px] font-sans h-full card-premium-skin">
      <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
      {/* Header */}
      <div className="flex items-center justify-between px-10 h-[88px] border-b border-[#ffffff0f] shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-[42px] h-[42px] flex items-center justify-center bg-[#dfbd691a] rounded-[10px] shrink-0">
            <Users size={20} className="text-[#dfbd69]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[17px] font-bold text-[#f4f1ea] tracking-[-0.1px] leading-tight">本日の出勤キャスト</p>
            <p className="text-[12px] text-[#8a8478] tracking-[0.08px] leading-tight opacity-70">
              確定 {confirmedCount}名
              {lateCount > 0 && ` / 遅刻 ${lateCount}名`}
              {trialCount > 0 && ` / 体験 ${trialCount}名`}
            </p>
          </div>
        </div>
        <Link
          href="/admin/today"
          className="flex items-center gap-2 px-5 h-[40px] rounded-[10px] bg-white/4 border border-gold/40 text-[12px] font-bold text-[#dfbd69] hover:bg-[#dfbd6910] transition-all"
        >
          <span>詳細を表示</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="min-w-[900px]">
          {/* Table Header Row */}
          <div className="flex items-center h-[56px] border-t border-b border-[#ffffff0a] px-10 bg-white/1">
            <div className="w-[280px] text-[10px] font-bold tracking-[1.5px] text-[#5a5650] uppercase">CAST NAME</div>
            <div className="w-section text-[10px] font-bold tracking-[1.5px] text-[#5a5650] uppercase px-6">SHIFT TIME</div>
            <div className="w-[140px] text-[10px] font-bold tracking-[1.5px] text-[#5a5650] uppercase text-center">STATUS</div>
            <div className="flex-1 text-[10px] font-bold tracking-[1.5px] text-[#5a5650] uppercase px-6">MEMO / TAGS</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#ffffff0a]">
            {casts.length === 0 ? (
              <div className="h-60 flex flex-col items-center justify-center italic gap-4">
                <Users size={32} className="text-[#1c1d22]" />
                <p className="text-[14px] text-[#5a5650]">本日の出勤登録はありません</p>
              </div>
            ) : (
              casts.map((cast) => {
                const cfg = STATUS_CONFIG[cast.status] || STATUS_CONFIG.pending;
                return (
                  <div
                    key={cast.castId}
                    className="flex items-center min-h-[72px] hover:bg-white/2 transition-colors px-10"
                  >
                    <div className="w-[280px] flex items-center gap-4 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#1c1d22] border border-[#ffffff0a] flex items-center justify-center shrink-0 overflow-hidden relative shadow-2xl">
                        {cast.avatarUrl ? (
                           <img 
                             src={cast.avatarUrl} 
                             alt={cast.castName} 
                             className="w-full h-full object-cover" 
                             referrerPolicy="no-referrer"
                           />
                        ) : (
                          <span className="text-[11px] font-bold text-[#5a5650]">{cast.initial}</span>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full" />
                      </div>
                      <span className="text-[14px] font-bold text-[#f4f1ea] tracking-tight">{cast.castName}</span>
                    </div>
                    
                    {/* Time */}
                    <div className="w-section px-6">
                      <div className="inline-flex items-center gap-2 text-[14px] font-bold text-gold font-sans bg-gold/5 px-3 py-1.5 rounded-[6px] border border-gold/10">
                        <span>{cast.startTime}</span>
                        <span className="text-[#5a5650] font-normal opacity-50">—</span>
                        <span className="text-[#8a8478] font-medium">{cast.endTime || 'LAST'}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="w-[140px] flex justify-center">
                      <div className={`flex items-center gap-2 px-4 py-1.5 ${cfg.bg} rounded-full border ${cfg.border} min-w-[90px] justify-center shadow-lg shadow-black/20`}>
                        <div className={`w-[6px] h-[6px] rounded-full ${cfg.dot}`} />
                        <span className={`text-[10px] font-bold tracking-[0.5px] uppercase ${cfg.textColor}`}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex-1 px-6 flex flex-wrap gap-2">
                      {cast.tags.length > 0 ? (
                        cast.tags.map((tag, i) => (
                          <span
                             key={i}
                             className="px-2.5 py-1 bg-white/3 border border-white/5 rounded-[6px] text-[10px] font-semibold text-[#8a8478] tracking-[0.2px] hover:text-[#dfbd69] transition-colors"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-[#5a5650] tracking-widest opacity-40">—</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
