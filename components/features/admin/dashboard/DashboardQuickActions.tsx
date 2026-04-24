import Link from 'next/link';
import { Plus, Calendar, Users, Briefcase, Bell } from 'lucide-react';

const QUICK_ACTIONS = [
  {
    href: '/admin/today',
    icon: Plus,
    label: '来店予定を登録',
    sub: '新規登録',
    accent: true,
  },
  {
    href: '/admin/shift-requests',
    icon: Calendar,
    label: '出勤調整',
    sub: '承認・変更',
  },
  {
    href: '/admin/human-resources',
    icon: Users,
    label: 'キャスト管理',
    sub: 'プロフィール',
  },
  {
    href: '/admin/applications',
    icon: Briefcase,
    label: '求人応募',
    sub: '確認・返信',
  },
  {
    href: '/admin/internal-notices',
    icon: Bell,
    label: '通知管理',
    sub: '一覧を見る',
  },
];

export function DashboardQuickActions() {
  return (
    <div className="flex flex-col rounded-[18px] font-sans h-full card-premium-skin">
      <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[56px] border-b-[0.56px] border-[#ffffff0f] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#dfbd691a] rounded-[7px] shrink-0">
              <Plus size={16} className="text-[#dfbd69]" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-[#f4f1ea] tracking-[-0.08px] leading-tight">クイックアクション</p>
              <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">よく使う操作</p>
            </div>
          </div>
        </div>

        {/* Action List */}
        <div className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                prefetch={false}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] transition-all duration-150 group ${
                  action.accent
                    ? 'bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)] text-[#0b0b0d] shadow-md shadow-[#dfbd691a]'
                    : 'text-[#8a8478] hover:bg-[#ffffff08] hover:text-[#f4f1ea]'
                }`}
              >
                <Icon
                  size={14}
                  strokeWidth={action.accent ? 2.5 : 2}
                  className={`shrink-0 ${action.accent ? 'text-[#0b0b0d]' : 'text-[#8a8478] group-hover:text-[#f4f1ea]'}`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] font-semibold tracking-tight leading-tight ${action.accent ? '' : ''}`}>
                    {action.label}
                  </p>
                  <p className={`text-[10px] tracking-[0.06px] leading-tight ${action.accent ? 'text-[#0b0b0d]/60' : 'text-[#5a5650]'}`}>
                    {action.sub}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
