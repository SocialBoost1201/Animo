'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UserCheck, Edit, Plus } from 'lucide-react';
import { type StaffSlave } from '@/lib/actions/staffs';

interface StaffListProps {
  initialStaffs: StaffSlave[];
}

export function StaffList({ initialStaffs }: StaffListProps) {
  const [staffs] = useState<StaffSlave[]>(initialStaffs);

  if (staffs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[22px] border border-[#dfbd69]/18 bg-[#121212] py-20 text-[#c7c0b2]">
        <UserCheck size={48} strokeWidth={1} className="mb-4 opacity-50 text-[#dfbd69]" />
        <p className="text-sm tracking-widest">スタッフが登録されていません</p>
        <Link
          href="/admin/human-resources/staffs/new"
          className="mt-6 flex items-center gap-2 rounded-[10px] border border-[#dfbd69]/22 bg-[#171717] px-4 py-2 text-xs tracking-widest text-[#f4f1ea] hover:bg-gold hover:text-[#0b0b0d] transition-colors"
        >
          <Plus size={14} />
          スタッフを登録する
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/human-resources/staffs/new"
          className="flex items-center gap-2.5 px-6 py-3 rounded-[12px] text-[13px] font-bold text-[#0b0b0d] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-gold/20"
          style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
        >
          <Plus size={18} strokeWidth={3} />
          スタッフ登録
        </Link>
      </div>
      <div className="overflow-hidden rounded-[20px] border border-[#dfbd69]/18 bg-[#111111] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)]">
        <table className="w-full">
          <thead className="bg-[#171717] border-b border-[#dfbd69]/12">
            <tr>
              <th className="text-left px-10 py-6 font-black text-[#a89d8a] tracking-[2px] text-[11px] uppercase">名前</th>
              <th className="text-left px-10 py-6 font-black text-[#a89d8a] tracking-[2px] text-[11px] uppercase">表示名</th>
              <th className="text-left px-10 py-6 font-black text-[#a89d8a] tracking-[2px] text-[11px] uppercase">役職</th>
              <th className="text-left px-10 py-6 font-black text-[#a89d8a] tracking-[2px] text-[11px] uppercase">ステータス</th>
              <th className="px-10 py-6" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfbd69]/10">
            {staffs.map((staff) => (
              <tr key={staff.id} className="group hover:bg-[#181818] transition-all duration-300">
                <td className="px-10 py-8">
                  <span className="font-bold text-[#f4f1ea] text-[16px] tracking-tight group-hover:text-gold transition-colors">{staff.name}</span>
                </td>
                <td className="px-10 py-8 text-[#e2ddd4] text-[15px] font-medium">{staff.display_name}</td>
                <td className="px-10 py-8">
                  <span className="inline-flex items-center px-3 py-1 bg-[#dfbd69]/10 rounded-[6px] text-[#f0d898] text-[12px] font-bold border border-[#dfbd69]/20">
                    {staff.role ?? '一般スタッッフ'}
                  </span>
                </td>
                <td className="px-10 py-8">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black tracking-[1px] uppercase border transition-all ${
                      staff.is_active
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-[#1a1c22] text-[#c7c0b2] border-[#dfbd69]/14'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${staff.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-[#c7c0b2]'}`} />
                    {staff.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-10 py-8 text-right">
                  <Link
                    href={`/admin/human-resources/staffs/${staff.id}`}
                    className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-[10px] text-[12px] font-bold text-[#f4f1ea] bg-[#171717] border border-[#dfbd69]/18 hover:border-gold/50 hover:bg-[#1c1c1c] transition-all group/edit"
                  >
                    <Edit size={14} className="group-hover/edit:text-gold transition-colors" />
                    編集
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
