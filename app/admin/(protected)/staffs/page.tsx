import { getStaffs } from '@/lib/actions/staffs'
import { StaffList } from '@/components/features/admin/staffs/StaffList'
import { InviteStaffButton } from '@/components/features/admin/InviteStaffButton'

export const dynamic = 'force-dynamic'

export default async function StaffsPage() {
  const staffsData = await getStaffs(true)

  return (
    <div className="space-y-[14px] font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 h-[49px]">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[16px] font-semibold text-[#f4f1ea] tracking-[-0.31px] leading-[20.8px]">スタッフ管理</h1>
          <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-[16.5px]">
            スタッフ {staffsData.length}名 · 役割・スケジュールの管理
          </p>
        </div>
        <InviteStaffButton />
      </div>

      {/* ── Staff List ── */}
      <StaffList initialStaffs={staffsData} />
    </div>
  )
}
