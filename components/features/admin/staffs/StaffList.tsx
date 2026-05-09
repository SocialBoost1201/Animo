'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { UserCheck, Edit, Plus, Clock, StickyNote } from 'lucide-react';
import { toast } from 'sonner';
import {
  setStaffTodayAttendance,
  type StaffWithTodayAttendance,
} from '@/lib/actions/staffs';
import { splitStaffFullName } from '@/lib/staff-name';

interface StaffListProps {
  initialStaffs: StaffWithTodayAttendance[];
}

type LocalAttendance = {
  status: 'working' | 'absent' | 'undecided';
  start_time: string;
  end_time: string;
  note: string;
};

function namePartsForRow(staff: StaffWithTodayAttendance): { family: string; given: string } {
  if (
    (staff.family_name != null && staff.family_name.trim() !== '') ||
    (staff.given_name != null && staff.given_name.trim() !== '')
  ) {
    return { family: staff.family_name?.trim() ?? '', given: staff.given_name?.trim() ?? '' };
  }
  return splitStaffFullName(staff.name);
}

function toLocalAttendance(attendance: StaffWithTodayAttendance['today_attendance']): LocalAttendance {
  if (!attendance) {
    return { status: 'undecided', start_time: '20:00', end_time: '', note: '' };
  }
  return {
    status: 'working',
    start_time: (attendance.start_time ?? '20:00').slice(0, 5),
    end_time: (attendance.end_time ?? '').slice(0, 5),
    note: attendance.note ?? '',
  };
}

function StaffRow({ staff }: { staff: StaffWithTodayAttendance }) {
  const [local, setLocal] = useState<LocalAttendance>(() => toLocalAttendance(staff.today_attendance));
  const [isPending, startTransition] = useTransition();
  const p = namePartsForRow(staff);

  const persist = (next: LocalAttendance) => {
    startTransition(async () => {
      const result = await setStaffTodayAttendance({
        staffId: staff.id,
        status: next.status === 'absent' ? 'absent' : 'working',
        startTime: next.start_time || '20:00',
        endTime: next.end_time || null,
        note: next.note || null,
      });
      if (!result.success) {
        toast.error(result.error || '出勤情報の更新に失敗しました');
        return;
      }
      const label = next.status === 'absent' ? '休み' : '出勤';
      toast.success(`${staff.display_name} を${label}に設定しました`);
    });
  };

  const handleToggle = (status: 'working' | 'absent') => {
    if (local.status === status) return;
    const next: LocalAttendance = { ...local, status };
    setLocal(next);
    if (status === 'absent') {
      persist({ ...next, start_time: '', end_time: '', note: '' });
    } else {
      persist(next);
    }
  };

  const handleTimeChange = (field: 'start_time' | 'end_time', value: string) => {
    const next = { ...local, [field]: value };
    setLocal(next);
    if (next.status === 'working') persist(next);
  };

  const handleNoteBlur = () => {
    if (local.status === 'working') persist(local);
  };

  return (
    <tr className="group hover:bg-[#181818] transition-all duration-300">
      <td className="px-6 py-6">
        <span className="font-bold text-[#f4f1ea] text-[15px] tracking-tight group-hover:text-gold transition-colors">{p.family || '—'}</span>
      </td>
      <td className="px-6 py-6 text-[#e2ddd4] text-[14px] font-medium">{p.given || '—'}</td>
      <td className="px-6 py-6 text-[#e2ddd4] text-[14px] font-medium">{staff.display_name}</td>
      <td className="px-6 py-6 text-[#c7c0b2] text-[13px]">{staff.mobile_phone?.trim() || '—'}</td>
      <td className="px-6 py-6">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-[1px] uppercase border transition-all ${
            staff.is_active
              ? 'bg-green-500/10 text-green-500 border-green-500/20'
              : 'bg-[#1a1c22] text-[#c7c0b2] border-[#dfbd69]/14'
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${staff.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-[#c7c0b2]'}`} />
          {staff.is_active ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </td>
      <td className="px-6 py-6">
        <div className="flex flex-col gap-2 min-w-[280px]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleToggle('working')}
              disabled={isPending}
              aria-pressed={local.status === 'working'}
              className={`min-h-9 min-w-[58px] rounded-[8px] border px-3 text-[11px] font-black transition-colors ${
                local.status === 'working'
                  ? 'border-green-500/35 bg-green-500/14 text-green-300'
                  : 'border-[#ffffff10] bg-white/4 text-[#c7c0b2] hover:border-green-500/25 hover:text-green-300'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              出勤
            </button>
            <button
              type="button"
              onClick={() => handleToggle('absent')}
              disabled={isPending}
              aria-pressed={local.status === 'absent'}
              className={`min-h-9 min-w-[58px] rounded-[8px] border px-3 text-[11px] font-black transition-colors ${
                local.status === 'absent'
                  ? 'border-red-500/35 bg-red-500/14 text-red-300'
                  : 'border-[#ffffff10] bg-white/4 text-[#c7c0b2] hover:border-red-500/25 hover:text-red-300'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              休み
            </button>
          </div>

          {local.status === 'working' && (
            <>
              <div className="flex items-center gap-1.5">
                <Clock size={11} className="text-[#5a5650] shrink-0" />
                <input
                  type="time"
                  value={local.start_time}
                  onChange={(e) => handleTimeChange('start_time', e.target.value)}
                  disabled={isPending}
                  aria-label="開始時刻"
                  className="w-[88px] bg-[#1c1d22] border border-[#ffffff14] rounded-[6px] px-2 py-1 text-[11px] text-[#f4f1ea] outline-none focus:border-[#dfbd6950]"
                />
                <span className="text-[10px] text-[#5a5650]">〜</span>
                <input
                  type="time"
                  value={local.end_time}
                  onChange={(e) => handleTimeChange('end_time', e.target.value)}
                  disabled={isPending}
                  aria-label="終了時刻"
                  className="w-[88px] bg-[#1c1d22] border border-[#ffffff14] rounded-[6px] px-2 py-1 text-[11px] text-[#f4f1ea] outline-none focus:border-[#dfbd6950]"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <StickyNote size={11} className="text-[#5a5650] shrink-0" />
                <input
                  type="text"
                  value={local.note}
                  onChange={(e) => setLocal({ ...local, note: e.target.value })}
                  onBlur={handleNoteBlur}
                  disabled={isPending}
                  placeholder="備考"
                  aria-label="備考"
                  className="flex-1 bg-[#1c1d22] border border-[#ffffff14] rounded-[6px] px-2 py-1 text-[11px] text-[#f4f1ea] outline-none focus:border-[#dfbd6950]"
                />
              </div>
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-6 text-right">
        <Link
          href={`/admin/staffs/${staff.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] text-[12px] font-bold text-[#f4f1ea] bg-[#171717] border border-[#dfbd69]/18 hover:border-gold/50 hover:bg-[#1c1c1c] transition-all group/edit"
        >
          <Edit size={13} className="group-hover/edit:text-gold transition-colors" />
          編集
        </Link>
      </td>
    </tr>
  );
}

export function StaffList({ initialStaffs }: StaffListProps) {
  const [staffs] = useState<StaffWithTodayAttendance[]>(initialStaffs);

  if (staffs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[22px] border border-[#dfbd69]/18 bg-[#121212] py-20 text-[#c7c0b2]">
        <UserCheck size={48} strokeWidth={1} className="mb-4 opacity-50 text-[#dfbd69]" />
        <p className="text-sm tracking-widest">スタッフが登録されていません</p>
        <Link
          href="/admin/staffs/new"
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
          href="/admin/staffs/new"
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
              <th className="text-left px-6 py-5 font-black text-[#a89d8a] tracking-[2px] text-[10px] uppercase">苗字</th>
              <th className="text-left px-6 py-5 font-black text-[#a89d8a] tracking-[2px] text-[10px] uppercase">名前</th>
              <th className="text-left px-6 py-5 font-black text-[#a89d8a] tracking-[2px] text-[10px] uppercase">芸名</th>
              <th className="text-left px-6 py-5 font-black text-[#a89d8a] tracking-[2px] text-[10px] uppercase">携帯</th>
              <th className="text-left px-6 py-5 font-black text-[#a89d8a] tracking-[2px] text-[10px] uppercase">ステータス</th>
              <th className="text-left px-6 py-5 font-black text-[#a89d8a] tracking-[2px] text-[10px] uppercase">本日の出勤</th>
              <th className="px-6 py-5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dfbd69]/10">
            {staffs.map((staff) => (
              <StaffRow key={staff.id} staff={staff} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
