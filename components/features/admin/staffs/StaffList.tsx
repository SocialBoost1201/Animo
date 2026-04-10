'use client'

import Link from 'next/link'
import { useState } from 'react'
import { UserCheck, Edit, Plus, User, Shield } from 'lucide-react'
import { type StaffSlave } from '@/lib/actions/staffs'

interface StaffListProps {
  initialStaffs: StaffSlave[]
}

export function StaffList({ initialStaffs }: StaffListProps) {
  const [staffs] = useState<StaffSlave[]>(initialStaffs)

  if (staffs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-[#17181c] rounded-[18px] border border-[#ffffff0f]">
        <div className="w-[64px] h-[64px] rounded-full bg-[#ffffff05] flex items-center justify-center border border-[#ffffff0f] mb-6">
          <UserCheck size={32} strokeWidth={1} className="text-[#5a5650]" />
        </div>
        <p className="text-[14px] font-medium text-[#c7c0b2] tracking-[0.1em]">スタッフが登録されていません</p>
        <Link
          href="/admin/human-resources/staffs/new"
          className="mt-6 flex items-center gap-2 bg-[#f4f1ea] hover:bg-white text-[#0b0b0d] text-[12px] font-bold px-5 h-[37px] rounded-[10px] tracking-tight transition-transform hover:scale-[1.02]"
        >
          <Plus size={14} strokeWidth={3} />
          スタッフを登録する
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-[14px]">
      <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#ffffff08] bg-[#ffffff02]">
                <th className="px-6 py-4 text-[10px] font-bold text-[#5a5650] uppercase tracking-[0.1em]">名前</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#5a5650] uppercase tracking-[0.1em]">表示名</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#5a5650] uppercase tracking-[0.1em]">役割</th>
                <th className="px-6 py-4 text-[10px] font-bold text-[#5a5650] uppercase tracking-[0.1em]">ステータス</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff05]">
              {staffs.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#ffffff02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-[32px] h-[32px] rounded-[8px] bg-[#ffffff05] flex items-center justify-center border border-[#ffffff0f]">
                        <User size={14} className="text-[#8a8478]" />
                      </div>
                      <p className="text-[13px] font-bold text-[#f4f1ea]">{staff.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[12px] font-medium text-[#c7c0b2]">{staff.display_name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield size={12} className="text-[#5a5650]" />
                      <span className="text-[11px] font-bold text-[#f4f1ea] uppercase tracking-wider">{staff.role ?? 'STAFF'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${staff.is_active ? 'bg-[#72b894]' : 'bg-[#5a5650]'}`} />
                      <span className={`text-[11px] font-bold ${staff.is_active ? 'text-[#72b894]' : 'text-[#5a5650]'}`}>
                        {staff.is_active ? '在勤中' : '退職'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/human-resources/staffs/${staff.id}`}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#5a5650] hover:text-[#dfbd69] transition-colors"
                    >
                      <Edit size={12} />
                      編集
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
