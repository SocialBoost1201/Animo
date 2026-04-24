type DashboardEmptyStateProps = {
  description?: string;
  className?: string;
};

export function DashboardEmptyState({
  description = '実データが登録されると、こちらに自動で反映されます。',
  className = 'min-h-40',
}: DashboardEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#dfbd6924] bg-[#dfbd6908] px-5 py-6 text-center ${className}`}>
      <p className="text-[13px] font-bold tracking-[0.04em] text-[#dfbd69]">運用開始待ち</p>
      <p className="mt-2 max-w-[260px] text-[11px] font-medium leading-relaxed text-[#8a8478]">
        {description}
      </p>
    </div>
  );
}
