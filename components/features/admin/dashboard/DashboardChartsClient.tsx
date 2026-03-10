'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';

export function DashboardChartsClient({
  monthlyData,
}: {
  monthlyData: { month: string; inquiries: number; reserves: number; applications: number }[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 問い合わせ＆予約グラフ */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-sm">
        <h2 className="text-sm font-bold tracking-widest text-[#171717] mb-6 flex items-center gap-2">
          <span className="w-1 h-4 bg-gold inline-block" />
          問い合わせ・予約 推移（直近6ヶ月）
        </h2>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
              <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '4px', border: '1px solid #f3f4f6' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="inquiries" name="一般問い合わせ" stackId="a" fill="#1f2937" radius={[0, 0, 4, 4]} />
              <Bar dataKey="reserves" name="来店予約" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 求人応募グラフ */}
      <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-sm">
        <h2 className="text-sm font-bold tracking-widest text-[#171717] mb-6 flex items-center gap-2">
          <span className="w-1 h-4 bg-gold inline-block" />
          求人応募 推移（直近6ヶ月）
        </h2>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '4px', border: '1px solid #f3f4f6' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" dataKey="applications" name="応募者数" stroke="#d4af37" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
