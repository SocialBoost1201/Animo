import { getDashboardKPIs } from '@/lib/actions/dashboard';
import { AlertTriangle } from 'lucide-react';

type AlertItem = {
  label: string;
  detail: string;
  level: 'danger' | 'warn' | 'muted';
};

export async function DashboardAlertCard() {
  const kpi = await getDashboardKPIs();

  const alerts: AlertItem[] = [];

  if (kpi.shiftMissingCount > 0)
    alerts.push({ label: 'シフト未提出', detail: `${kpi.shiftMissingCount}名が今週未提出`, level: 'warn' });
  if (kpi.unconfirmedCount > 0)
    alerts.push({ label: '来店予定未確定', detail: `${kpi.unconfirmedCount}名が確認待ち`, level: 'danger' });
  if (kpi.unreadApplications > 0)
    alerts.push({ label: '未返信案件', detail: `応募返信待ち ${kpi.unreadApplications}件`, level: 'warn' });

  const LEVEL_STYLES = {
    danger: {
      border: 'border-[#d4785a30]',
      bg: 'bg-[#d4785a14]',
      dot: 'bg-[#d4785a]',
      label: 'text-[#d4785a]',
    },
    warn: {
      border: 'border-[#c8884d30]',
      bg: 'bg-[#c8884d14]',
      dot: 'bg-[#c8884d]',
      label: 'text-[#c8884d]',
    },
    muted: {
      border: 'border-[#5a565030]',
      bg: 'bg-[#5a565014]',
      dot: 'bg-[#5a5650]',
      label: 'text-[#5a5650]',
    },
  };

  return (
    <div className="flex flex-col rounded-[18px] font-sans h-full card-premium-skin">
      <div className="card-premium-skin__surface flex flex-col flex-1 overflow-hidden rounded-[18px]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-[64px] border-b-[0.56px] border-[#ffffff0f] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-[33px] h-[33px] flex items-center justify-center bg-[#d4785a1a] rounded-[7px] shrink-0">
            <AlertTriangle size={16} className="text-[#d4785a]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-[#f4f1ea] tracking-[-0.08px] leading-tight">重要アラート</p>
            <p className="text-[11px] text-[#8a8478] tracking-[0.06px] leading-tight">要対応の項目</p>
          </div>
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 p-4 space-y-2.5 overflow-y-auto custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-[12px] text-[#5a5650] italic">現在アラートはありません</p>
          </div>
        ) : (
          alerts.map((a) => {
            const s = LEVEL_STYLES[a.level];
            return (
              <div
                key={a.label}
                className={`rounded-[12px] border p-3.5 ${s.border} ${s.bg}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${s.dot}`} />
                  <p className={`text-[12px] font-bold ${s.label}`}>{a.label}</p>
                </div>
                <p className="text-[11px] text-[#8a8478] pl-[13px]">{a.detail}</p>
              </div>
            );
          })
        )}
      </div>
      </div>
    </div>
  );
}
