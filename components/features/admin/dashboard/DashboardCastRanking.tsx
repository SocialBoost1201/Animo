import { getDashboardCastRanking } from '@/lib/actions/dashboard';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export async function DashboardCastRanking() {
  const ranking = await getDashboardCastRanking();

  return (
    <div className="flex flex-col rounded-[18px] font-sans h-full card-premium-skin">
      <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
      {/* Header (Matching AnalyticsSectionSubsection:382 style container) */}
      <div className="flex items-center justify-between px-6 h-[64px] border-b-[0.56px] border-[#ffffff0f] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
            <Trophy size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-bold text-[#f4f1ea] tracking-[-0.08px] leading-tight">キャスト行動成績評価</p>
            <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">ブログ投稿数・出勤日数・場内指名本数を管理参考用に可視化</p>
          </div>
        </div>
        <Link href="/admin/analytics" className="text-[11px] font-bold text-[#dfbd69] hover:underline">
          詳細を見る
        </Link>
      </div>

      {/* Table-like Content (Matching AnalyticsSectionSubsection:830-924) */}
      <div className="flex-1 flex flex-col p-5.5 min-w-0">
        {/* Table Headers (Simplified for Dashboard) */}
        <div className="flex items-center h-[34px] border-b border-[#ffffff0a] mb-2 px-1">
          <div className="w-section-mobile">
             <span className="text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase">キャスト名</span>
          </div>
          <div className="flex-1 min-w-0">
             <span className="text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase ml-1">スコア</span>
          </div>
          <div className="w-[34px] text-center">
             <span className="text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase">BLG</span>
          </div>
          <div className="w-[34px] text-center">
             <span className="text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase">出勤</span>
          </div>
          <div className="w-[34px] text-center">
             <span className="text-[9px] font-bold tracking-[0.71px] text-[#5a5650] uppercase">指名</span>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          {ranking.length === 0 ? (
            <div className="h-40 flex items-center justify-center italic">
               <p className="text-[12px] text-[#5a5650]">データがありません</p>
            </div>
          ) : (
            ranking.map((r, index) => (
              <div key={r.castId} className="group flex items-center h-[36px] hover:bg-[#ffffff05] transition-colors rounded-sm px-1">
                {/* Name */}
                <div className="w-section-mobile flex items-center gap-2 overflow-hidden">
                  <span className={`text-[11px] font-bold w-4 ${index < 3 ? 'text-[#dfbd69]' : 'text-[#5a5650]'}`}>{r.rank || index + 1}</span>
                  <span className="text-[12px] font-medium text-[#cbc3b3] truncate">{r.castName}</span>
                </div>

                {/* Score Bar (Matching AnalyticsSectionSubsection:864) */}
                <div className="flex-1 flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="flex-1 h-[3px] bg-[#ffffff0f] rounded-sm overflow-hidden mt-px">
                    <div
                      className="h-full rounded-sm bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]"
                      style={{ width: `${Math.min(r.score, 100)}%` }}
                    />
                  </div>
                  <span className="w-[20px] text-[10px] font-bold text-[#f4f1ea] text-right font-sans leading-none">
                    {r.score}
                  </span>
                </div>

                {/* BLG */}
                <div className="w-[34px] text-center">
                   <span className="text-[10px] font-normal text-[#8a8478]">{r.blogCount}</span>
                </div>

                {/* Attendance */}
                <div className="w-[34px] text-center">
                   <span className="text-[10px] font-normal text-[#8a8478]">{r.shiftDays}</span>
                </div>

                {/* Nomination */}
                <div className="w-[34px] text-center">
                   <span className="text-[10px] font-semibold text-[#c7c0b2]">{r.nominations}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      </div>
    </div>
  );
}
