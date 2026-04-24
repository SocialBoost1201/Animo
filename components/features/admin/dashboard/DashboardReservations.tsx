import { getDashboardReservations } from '@/lib/actions/dashboard';
import Link from 'next/link';
import { DashboardEmptyState } from './DashboardEmptyState';
import { Plus, Calendar } from 'lucide-react';

const STATUS_CONFIG = {
  confirmed: {
    label: '確認済',
    bg: 'bg-[#50a06414]',
    border: 'border-[#50a0642e]',
    textColor: 'text-[#72b894]',
    dot: 'bg-[#72b894]',
  },
  unconfirmed: {
    label: '要確認',
    bg: 'bg-[#c8823214]',
    border: 'border-[#c882322e]',
    textColor: 'text-[#c8884d]',
    dot: 'bg-[#c8884d]',
  },
  pending: {
    label: '保留',
    bg: 'bg-[#8a847814]',
    border: 'border-[#8a84782e]',
    textColor: 'text-[#8a8478]',
    dot: 'bg-[#8a8478]',
  },
} as const;

export async function DashboardReservations() {
  const reservations = (await getDashboardReservations()) || [];

  const confirmedCount = reservations.filter((r) => r.status === 'confirmed').length;
  const unconfirmedCount = reservations.filter((r) => r.status === 'unconfirmed').length;

  return (
    <div className="flex flex-col rounded-[18px] font-sans h-full card-premium-skin">
      <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
      {/* Header (Matching AnalyticsSectionSubsection:383) */}
      <div className="flex flex-wrap items-center justify-between px-6 h-[56px] border-b-[0.56px] border-[#ffffff0f] gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
             <Calendar size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-bold text-[#f4f1ea] tracking-[-0.08px] leading-tight">来店予定一覧</p>
            <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight font-medium">
              確認済 {confirmedCount}件 / 要確認 {unconfirmedCount}件
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {confirmedCount > 0 && (
            <div className={`hidden sm:flex items-center px-2 py-1 ${STATUS_CONFIG.confirmed.bg} rounded-[8px] h-[30px]`}>
              <span className={`text-[10px] font-bold whitespace-nowrap tracking-[0.12px] ${STATUS_CONFIG.confirmed.textColor}`}>確認済 {confirmedCount}</span>
            </div>
          )}
          {unconfirmedCount > 0 && (
            <div className={`hidden sm:flex items-center px-2 py-1 ${STATUS_CONFIG.unconfirmed.bg} rounded-[8px] h-[30px]`}>
              <span className={`text-[10px] font-bold whitespace-nowrap tracking-[0.12px] ${STATUS_CONFIG.unconfirmed.textColor}`}>要確認 {unconfirmedCount}</span>
            </div>
          )}
          <Link
            href="/admin/today"
            className="flex items-center gap-1.5 px-3 h-[30px] rounded-[8px] bg-[#ffffff0a] border-[1.5px] border-[#dfbd6940] text-[11px] font-bold text-[#8a8478] hover:text-[#f4f1ea] transition-all"
          >
            <Plus size={12} className="-mt-px shadow-sm" />
            <span>追加</span>
          </Link>
        </div>
      </div>

      {/* Table (Matching AnalyticsSectionSubsection:424-532) */}
      {reservations.length === 0 ? (
        <div className="flex-1 p-5">
          <DashboardEmptyState className="min-h-40 h-full" />
        </div>
      ) : (
      <div className="flex-1 overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px]">
          {/* Table Header Row */}
          <div className="flex items-center h-[42px] border-t border-b border-[#ffffff0a] px-6">
            <div className="w-section-mobile text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase">来店時刻</div>
            <div className="flex-1 text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase px-4 text-center sm:text-left">お客様名</div>
            <div className="w-[60px] text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase text-center">人数</div>
            <div className="w-[180px] text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase px-4">担当キャスト</div>
            <div className="w-[110px] text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase text-center">確認状態</div>
            <div className="w-[150px] text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase px-4">備考</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#ffffff0a]">
            {reservations.map((r) => {
                const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
                return (
                  <div
                    key={r.id}
                    className="flex items-center min-h-[52px] hover:bg-[#ffffff05] transition-colors px-6"
                  >
                    {/* Time */}
                    <div className="w-section-mobile text-[12px] font-bold text-[#dfbd69]">{r.visitTime}</div>
                    
                    {/* Guest Name */}
                    <div className="flex-1 text-[12px] font-bold text-[#cbc3b3] truncate px-4">
                      {r.guestName} 様
                    </div>
                    
                    {/* Guest Count */}
                    <div className="w-[60px] text-[12px] font-medium text-[#8a8478] text-center">
                      <span className="text-[#c7c0b2] font-bold">{r.guestCount}</span>名
                    </div>
                    
                    {/* Cast Name */}
                    <div className="w-[180px] px-4 overflow-hidden">
                      <div className="flex items-center gap-2">
                        {r.castName !== '—' ? (
                          <>
                            <div className="w-5 h-5 rounded-full bg-[#dfbd691a] flex items-center justify-center shrink-0 border border-[#dfbd6920]">
                               <span className="text-[9px] font-bold text-[#dfbd69]">{r.castName.charAt(0)}</span>
                            </div>
                            <span className="text-[12px] font-bold text-[#cbc3b3] truncate">{r.castName}</span>
                          </>
                        ) : (
                          <span className="text-[11px] text-[#5a5650]">—</span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="w-[110px] flex justify-center">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 ${cfg.bg} rounded-[20px] border-[0.56px] ${cfg.border} min-w-[76px] justify-center`}>
                        <div className={`w-[5px] h-[5px] rounded-full ${cfg.dot}`} />
                        <span className={`text-[10px] font-bold tracking-[0.12px] ${cfg.textColor}`}>{cfg.label}</span>
                      </div>
                    </div>

                    {/* Note */}
                    <div className="w-[150px] px-4 overflow-hidden">
                      <p className="text-[11px] text-[#5a5650] truncate font-sans" title={r.note ?? ''}>
                        {r.note || '—'}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      )}
      </div>
    </div>
  );
}
