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
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <UserCheck size={48} strokeWidth={1} className="mb-4 opacity-40" />
        <p className="text-sm tracking-widest">スタッフが登録されていません</p>
        <Link
          href="/admin/human-resources/staffs/new"
          className="mt-6 flex items-center gap-2 bg-[#171717] text-white text-xs px-4 py-2 rounded-sm tracking-widest hover:bg-gold transition-colors"
        >
          <Plus size={14} />
          スタッフを登録する
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-2">
        <Link
          href="/admin/human-resources/staffs/new"
          className="flex items-center gap-2 bg-[#171717] text-white text-xs px-4 py-2 rounded-sm tracking-widest hover:bg-gold transition-colors"
        >
          <Plus size={14} />
          スタッフ登録
        </Link>
      </div>
      <div className="bg-black/95 border border-[#ffffff10] rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-[#ffffff10]">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-[#5a5650] tracking-widest text-xs">名前</th>
              <th className="text-left px-4 py-3 font-medium text-[#5a5650] tracking-widest text-xs">表示名</th>
              <th className="text-left px-4 py-3 font-medium text-[#5a5650] tracking-widest text-xs">役職</th>
              <th className="text-left px-4 py-3 font-medium text-[#5a5650] tracking-widest text-xs">ステータス</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {staffs.map((staff) => (
              <tr key={staff.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 font-medium text-[#f4f1ea]">{staff.name}</td>
                <td className="px-4 py-3 text-[#c7c0b2]">{staff.display_name}</td>
                <td className="px-4 py-3 text-[#8a8478] text-xs">{staff.role ?? '—'}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      staff.is_active
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-white/5 text-[#8a8478]'
                    }`}
                  >
                    {staff.is_active ? '在籍' : '退職'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/human-resources/staffs/${staff.id}`}
                    className="inline-flex items-center gap-1 text-xs text-[#5a5650] hover:text-gold transition-colors"
                  >
                    <Edit size={13} />
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
