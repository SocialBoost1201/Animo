import { getAnalyticsSummary } from '@/lib/actions/analytics'
import { getAdminPostRankings } from '@/lib/actions/posts-analytics'
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Eye,
  Activity,
  FileText,
  Trophy,
  Minus,
} from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const [analytics, rankingsResult] = await Promise.all([
    getAnalyticsSummary(),
    getAdminPostRankings(10),
  ])

  const { todayPv, yesterdayPv, activeUsers } = analytics
  const pvDiff    = todayPv - yesterdayPv
  const pvChange  = yesterdayPv > 0 ? ((pvDiff / yesterdayPv) * 100).toFixed(1) : null
  const rankedPosts = rankingsResult.success ? (rankingsResult.data ?? []) : []

  const kpis = [
    {
      label: '本日 PV',
      value: todayPv.toLocaleString(),
      unit: 'PV',
      sub: '本日累計',
      trend: pvDiff > 0 ? 'up' : pvDiff < 0 ? 'down' : 'flat',
      color: 'text-[#dfbd69]',
      bg: 'bg-[#dfbd6914]',
      icon: Eye,
    },
    {
      label: '昨日 PV',
      value: yesterdayPv.toLocaleString(),
      unit: 'PV',
      sub: '前日実績',
      trend: 'flat' as const,
      color: 'text-[#8a8478]',
      bg: 'bg-[#ffffff08]',
      icon: BarChart2,
    },
    {
      label: 'アクティブ',
      value: String(activeUsers),
      unit: '名',
      sub: '直近5分',
      trend: activeUsers > 0 ? 'up' : 'flat',
      color: 'text-[#72b894]',
      bg: 'bg-[#72b89414]',
      icon: Activity,
    },
    {
      label: 'PV変化率',
      value: pvChange !== null ? `${parseFloat(pvChange) >= 0 ? '+' : ''}${pvChange}` : '–',
      unit: pvChange !== null ? '%' : '',
      sub: '前日比',
      trend: pvChange !== null ? (parseFloat(pvChange) >= 0 ? 'up' : 'down') : 'flat',
      color: pvChange !== null && parseFloat(pvChange) >= 0 ? 'text-[#72b894]' : 'text-[#d4785a]',
      bg: pvChange !== null && parseFloat(pvChange) >= 0 ? 'bg-[#72b89414]' : 'bg-[#d4785a14]',
      icon: pvChange !== null && parseFloat(pvChange) >= 0 ? TrendingUp : TrendingDown,
    },
  ]

  return (
    <div className="space-y-5 font-inter">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-0.5 py-2">
        <h1 className="text-[17px] font-semibold tracking-[-0.31px] text-[#f4f1ea]">サイト分析</h1>
        <p className="text-[11px] text-[#8a8478]">サイトトラフィックとコンテンツパフォーマンス</p>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] px-5 py-4 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.6px] text-[#5a5650]">{k.label}</p>
              <div className={`flex h-[28px] w-[28px] items-center justify-center rounded-[8px] ${k.bg}`}>
                <k.icon size={13} className={k.color} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-[28px] font-bold leading-none ${k.color}`}>{k.value}</span>
              {k.unit && <span className="text-[12px] text-[#8a8478]">{k.unit}</span>}
              {k.trend === 'up'   && <TrendingUp  size={13} className="text-[#72b894]" />}
              {k.trend === 'down' && <TrendingDown size={13} className="text-[#d4785a]" />}
              {k.trend === 'flat' && <Minus size={13} className="text-[#5a5650]" />}
            </div>
            <p className="text-[10px] text-[#8a8478]">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Two-Column Layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">

        {/* Left: Traffic Overview */}
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
          <div className="flex items-center gap-3 px-5 h-[52px] border-b border-[#ffffff08]">
            <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] bg-[#dfbd6914]">
              <BarChart2 size={13} className="text-[#dfbd69]" />
            </div>
            <p className="text-[12px] font-semibold text-[#f4f1ea]">トラフィック概要</p>
          </div>

          <div className="p-5 space-y-2">
            {[
              { label: '本日のページビュー',   value: todayPv,     color: 'text-[#dfbd69]', bar: todayPv,     max: Math.max(todayPv, yesterdayPv) || 1 },
              { label: '昨日のページビュー',   value: yesterdayPv, color: 'text-[#8a8478]', bar: yesterdayPv, max: Math.max(todayPv, yesterdayPv) || 1 },
              { label: 'アクティブユーザー',   value: activeUsers, color: 'text-[#72b894]', bar: activeUsers,  max: Math.max(activeUsers, 1) },
            ].map((row) => (
              <div key={row.label} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#c7c0b2]">{row.label}</span>
                  <span className={`font-bold tabular-nums ${row.color}`}>{row.value.toLocaleString()}</span>
                </div>
                <div className="h-[4px] w-full rounded-full bg-[#ffffff08] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (row.bar / row.max) * 100)}%`,
                      background: row.label.includes('昨日') ? '#8a8478' : row.label.includes('アクティブ') ? '#72b894' : 'linear-gradient(90deg,#dfbd69,#926f34)',
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-3 rounded-[10px] border border-[#ffffff08] bg-[#1c1d22] px-4 py-3">
              <p className="text-[10px] text-[#5a5650] leading-relaxed">
                アクティブユーザーは直近5分以内のユニークアクセスを集計。
                PVは <code className="text-[#dfbd69] text-[9px]">site_analytics</code> テーブルから取得。
              </p>
            </div>
          </div>
        </div>

        {/* Right: Post Rankings */}
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
          <div className="flex items-center gap-3 px-5 h-[52px] border-b border-[#ffffff08]">
            <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] bg-[#a882d814]">
              <Trophy size={13} className="text-[#a882d8]" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-[#f4f1ea]">投稿 PV ランキング</p>
            </div>
            <span className="ml-auto text-[10px] text-[#5a5650]">TOP {rankedPosts.length}</span>
          </div>

          {rankedPosts.length === 0 ? (
            <div className="py-16 text-center">
              <FileText size={22} className="mx-auto mb-3 text-[#5a5650]" />
              <p className="text-[12px] text-[#5a5650] italic">投稿データがありません</p>
            </div>
          ) : (
            <div className="divide-y divide-[#ffffff06]">
              {rankedPosts.map((post, idx) => {
                const cast = post.casts
                const pv = post.view_count ?? 0
                const maxPv = rankedPosts[0]?.view_count ?? 1
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null
                return (
                  <div key={post.id} className="flex items-center gap-3 px-4 py-3 hover:bg-[#ffffff04] transition-colors">
                    {/* Rank */}
                    <div className="w-[22px] shrink-0 text-center">
                      {medal ? (
                        <span className="text-[14px]">{medal}</span>
                      ) : (
                        <span className="text-[11px] font-bold text-[#5a5650]">{idx + 1}</span>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div className="relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-[8px] bg-[#1c1d22]">
                      {post.image_url ? (
                        <Image src={post.image_url} alt="" fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <FileText size={14} className="text-[#5a5650]" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-[#c7c0b2]">
                        {cast?.stage_name ?? '–'}
                      </p>
                      <div className="mt-0.5 h-[3px] w-full rounded-full bg-[#ffffff08] overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (pv / (maxPv || 1)) * 100)}%`,
                            background: idx === 0 ? 'linear-gradient(90deg,#dfbd69,#926f34)' : '#5a5650',
                          }}
                        />
                      </div>
                    </div>

                    {/* PV */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Eye size={10} className="text-[#5a5650]" />
                      <span className="text-[12px] font-bold text-[#f4f1ea] tabular-nums">
                        {pv.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
