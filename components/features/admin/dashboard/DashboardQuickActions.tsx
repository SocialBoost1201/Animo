import Link from 'next/link';
import {
  Zap,
  Calendar,
  ChevronRight,
  UserCheck,
  Briefcase,
  UserPlus,
  Megaphone,
} from 'lucide-react';

const ACTIONS = [
  {
    label: '来店予定を登録',
    icon: Calendar,
    href: '/admin/today',
    isPrimary: true,
  },
  {
    label: '本日の出勤確認',
    icon: UserCheck,
    href: '/admin/today',
    isPrimary: false,
  },
  {
    label: '求人応募を確認',
    icon: Briefcase,
    href: '/admin/applications',
    isPrimary: false,
  },
  {
    label: 'キャストを追加',
    icon: UserPlus,
    href: '/admin/human-resources',
    isPrimary: false,
  },
  {
    label: 'お知らせを投稿',
    icon: Megaphone,
    href: '/admin/internal-notices',
    isPrimary: false,
  },
] as const;

export function DashboardQuickActions() {
  return (
    <div className="bg-[#17181c] rounded-[18px] border border-[#8a8478] font-inter overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-[6px] px-[19px] pt-[15px] pb-[12px] border-b border-[#ffffff08]">
        <Zap size={10} className="text-[#8a8478]" strokeWidth={2.5} />
        <span className="text-[9px] font-bold tracking-[1.12px] text-[#8a8478] uppercase">
          クイックアクション
        </span>
      </div>

      {/* Action list */}
      <div className="flex flex-col gap-[6px] p-[12px]">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          if (action.isPrimary) {
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-[8px] h-[33px] px-[12px] rounded-[11px] transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
              >
                <Icon size={12} className="text-[#0b0b0d] shrink-0" strokeWidth={2.5} />
                <span className="flex-1 text-[11px] font-semibold text-[#0b0b0d] leading-[15.4px] tracking-[0.06px] whitespace-nowrap">
                  {action.label}
                </span>
                <ChevronRight size={10} className="text-[#0b0b0d]" strokeWidth={2.5} />
              </Link>
            );
          }
          return (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-[8px] h-[34px] px-[12px] rounded-[11px] bg-[#ffffff06] border border-[#ffffff0f] hover:bg-[#ffffff0e] transition-colors"
            >
              <Icon size={12} className="text-[#8a8478] shrink-0" strokeWidth={2} />
              <span className="flex-1 text-[11px] font-normal text-[#c7c0b2] leading-[15.4px] tracking-[0.06px] whitespace-nowrap">
                {action.label}
              </span>
              <ChevronRight size={10} className="text-[#5a5650]" strokeWidth={2} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
