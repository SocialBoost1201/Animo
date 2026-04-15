'use client';

import { type ReactElement } from 'react';
import { CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis } from 'recharts';

export function DashboardChartsClient({
  monthlyData,
}: {
  monthlyData: { month: string; applications: number }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-6">


      {/* 求人応募グラフ */}
      <div className="bg-black/94 border-[1.5px] border-[#ffffff10] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] p-6 rounded-[18px] font-sans">
        <h2 className="text-[13px] font-bold text-[#f4f1ea] mb-6 flex items-center gap-2">
          <span className="w-0.5 h-3.5 bg-[linear-gradient(180deg,#dfbd69_0%,#926f34_100%)] inline-block rounded-full" />
          求人応募 推移（直近6ヶ月）
        </h2>
        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8a8478', fontSize: 10 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8a8478', fontSize: 10 }} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1c1d22', border: '1px solid #ffffff0f', borderRadius: '10px', fontSize: '12px', color: '#f4f1ea' }} 
                itemStyle={{ color: '#dfbd69' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', color: '#8a8478', fontSize: '10px' }} />
              <Line type="monotone" dataKey="applications" name="応募者数" stroke="#dfbd69" strokeWidth={3} dot={{ strokeWidth: 2, r: 4, fill: '#17181c', stroke: '#dfbd69' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
