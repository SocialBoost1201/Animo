import { getStaffs } from '@/lib/actions/staffs'
import { StaffList } from '@/components/features/admin/staffs/StaffList'
import { InviteStaffButton } from '@/components/features/admin/InviteStaffButton'

export const dynamic = 'force-dynamic'

export default async function StaffsPage() {
  const staffsData = await getStaffs(true)

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 py-2">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">スタッフ管理</h1>
          <p className="text-[11px] text-[#8a8478]">
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
