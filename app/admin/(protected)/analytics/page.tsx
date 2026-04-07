import { getAnalyticsSummary } from '@/lib/actions/analytics'
import { BarChart2, TrendingUp, TrendingDown, Eye, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'

function StatCard({
  label, value, unit = '', sub = '', trend = null,
}: {
  label: string
  value: string | number
  unit?: string
  sub?: string
  trend?: 'up' | 'down' | null
}) {
  return (
    <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] px-5 py-5">
      <p className="text-[10px] font-medium text-[#5a5650] tracking-[0.6px] uppercase mb-2">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[28px] font-bold text-[#f4f1ea] leading-none">{value}</span>
        {unit && <span className="text-[12px] text-[#8a8478]">{unit}</span>}
        {trend === 'up'   && <TrendingUp  size={14} className="text-[#72b894] mb-0.5" />}
        {trend === 'down' && <TrendingDown size={14} className="text-[#d4785a] mb-0.5" />}
      </div>
      {sub && <p className="text-[11px] text-[#8a8478] mt-1">{sub}</p>}
    </div>
  )
}

export default async function AnalyticsPage() {
  const analytics = await getAnalyticsSummary()
  const { todayPv, yesterdayPv, activeUsers } = analytics

  const pvDiff   = todayPv - yesterdayPv
  const pvChange = yesterdayPv > 0
    ? ((pvDiff / yesterdayPv) * 100).toFixed(1)
    : null

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5 py-2">
        <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">サイト分析</h1>
        <p className="text-[11px] text-[#8a8478]">サイトトラフィックとコンテンツパフォーマンス</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="本日のPV" value={todayPv} unit="PV" sub="本日累計" trend={pvDiff > 0 ? 'up' : pvDiff < 0 ? 'down' : null} />
        <StatCard label="昨日のPV" value={yesterdayPv} unit="PV" sub="前日比較" />
        <StatCard label="アクティブ" value={activeUsers} unit="名" sub="直近5分" trend={activeUsers > 0 ? 'up' : null} />
        <StatCard
          label="PV変化率"
          value={pvChange !== null ? `${pvChange > '0' ? '+' : ''}${pvChange}` : '–'}
          unit={pvChange !== null ? '%' : ''}
          sub="前日比"
          trend={pvChange !== null ? (parseFloat(pvChange) >= 0 ? 'up' : 'down') : null}
        />
      </div>

      {/* ── Traffic Overview ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        <div className="flex items-center gap-3 px-5 h-[56px] border-b border-[#ffffff08]">
          <div className="w-[28px] h-[28px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px]">
            <BarChart2 size={14} className="text-[#dfbd69]" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#f4f1ea]">トラフィック概要</p>
            <p className="text-[10px] text-[#5a5650]">本日のアクセス状況</p>
          </div>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: '本日のページビュー',   value: todayPv,     icon: Eye,      color: 'text-[#dfbd69]', bg: 'bg-[#dfbd6914]' },
            { label: '昨日のページビュー',   value: yesterdayPv, icon: Eye,      color: 'text-[#8a8478]', bg: 'bg-[#ffffff08]' },
            { label: 'アクティブユーザー',   value: activeUsers, icon: Activity, color: 'text-[#72b894]', bg: 'bg-[#72b89414]' },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3 h-[44px] px-3 rounded-[10px] hover:bg-[#ffffff04] transition-colors">
              <div className={`w-[30px] h-[30px] flex items-center justify-center rounded-[8px] ${row.bg} shrink-0`}>
                <row.icon size={14} className={row.color} />
              </div>
              <span className="text-[12px] text-[#c7c0b2] flex-1">{row.label}</span>
              <span className={`text-[14px] font-bold ${row.color}`}>{row.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Data Source Note ── */}
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] p-5">
        <p className="text-[11px] text-[#5a5650] leading-relaxed">
          ※ アクセスデータは <code className="text-[#dfbd69] bg-[#dfbd6910] px-1.5 py-0.5 rounded text-[10px]">site_analytics</code> テーブルから取得しています。
          リアルタイムのアクティブユーザーは直近5分以内のアクセスを集計しています。
        </p>
      </div>
    </div>
  )
}
