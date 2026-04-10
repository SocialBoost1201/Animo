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
    <div className="flex flex-col bg-[#17181c] rounded-[18px] overflow-hidden border border-[#8a8478] font-inter h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-6 h-[64px] border-b border-[#8a847830] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
            <Users size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-[#f4f1ea] tracking-[-0.08px] leading-tight">本日の出勤キャスト</p>
            <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">
              確定 {confirmedCount}名
              {lateCount > 0 && ` / 遅刻 ${lateCount}名`}
              {trialCount > 0 && ` / 体験 ${trialCount}名`}
            </p>
          </div>
        </div>
        <Link
          href="/admin/today"
          className="flex items-center gap-1 px-3 h-[24px] rounded-[8px] bg-[#ffffff06] border border-[#ffffff0f] text-[11px] font-medium text-[#8a8478] hover:text-[#f4f1ea] transition-all"
        >
          <span>詳細</span>
          <ChevronRight size={12} className="-mt-px" />
        </Link>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="min-w-[700px]">
          {/* Table Header Row */}
          <div className="flex items-center h-[42px] border-t border-b border-[#8a847830] px-6">
            <div className="w-[200px] text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase">キャスト名</div>
            <div className="w-[120px] text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase px-4">出勤時間</div>
            <div className="w-[110px] text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase text-center">ステータス</div>
            <div className="flex-1 text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase px-4">タグ / 備考</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#8a847820]">
            {casts.length === 0 ? (
              <div className="h-40 flex items-center justify-center italic">
                <p className="text-[12px] text-[#5a5650]">出勤登録がありません</p>
              </div>
            ) : (
              casts.map((cast) => {
                const cfg = STATUS_CONFIG[cast.status] || STATUS_CONFIG.pending;
                return (
                  <div
                    key={cast.castId}
                    className="flex items-center min-h-[52px] hover:bg-[#ffffff05] transition-colors px-6"
                  >
                    <div className="w-[200px] flex items-center gap-3 shrink-0">
                      <div className="w-8 h-8 rounded-full bg-[#1c1d22] border-[0.56px] border-[#ffffff0a] flex items-center justify-center shrink-0 overflow-hidden relative">
                        {cast.avatarUrl ? (
                           <img 
                             src={cast.avatarUrl} 
                             alt={cast.castName} 
                             className="w-full h-full object-cover" 
                             referrerPolicy="no-referrer"
                           />
                        ) : (
                          <span className="text-[10px] font-bold text-[#5a5650]">{cast.initial}</span>
                        )}
                      </div>
                      <span className="text-[12px] font-semibold text-[#f4f1ea] truncate">{cast.castName}</span>
                    </div>
                    
                    {/* Time */}
                    <div className="w-[120px] px-4">
                      <div className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#dfbd69] font-inter">
                        <span>{cast.startTime}</span>
                        <span className="text-[#5a5650] font-normal">—</span>
                        <span className="text-[#8a8478] font-normal">{cast.endTime || 'Last'}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="w-[110px] flex justify-center">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 ${cfg.bg} rounded-[20px] border-[0.56px] ${cfg.border} min-w-[76px] justify-center`}>
                        <div className={`w-[5px] h-[5px] rounded-full ${cfg.dot}`} />
                        <span className={`text-[10px] font-semibold tracking-[0.12px] ${cfg.textColor}`}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex-1 px-4 flex flex-wrap gap-1.5">
                      {cast.tags.length > 0 ? (
                        cast.tags.map((tag, i) => (
                          <span
                             key={i}
                             className="px-1.5 py-px bg-[#ffffff05] border border-[#ffffff0a] rounded-[4px] text-[9px] font-medium text-[#8a8478] tracking-[0.06px]"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-[#5a5650]">—</span>
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
  );
}
