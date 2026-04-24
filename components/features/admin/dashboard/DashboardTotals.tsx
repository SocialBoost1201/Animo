import { createClient } from '@/lib/supabase/server';
import { DashboardEmptyState } from './DashboardEmptyState';
import { Briefcase } from 'lucide-react';

export async function DashboardTotals() {
  const supabase = await createClient();

  const [
    { count: totalApps },
  ] = await Promise.all([
    supabase.from('recruit_applications').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="bg-black/94 border-[1.5px] border-[#ffffff10] shadow-[0_8px_16px_-4px_rgba(0,0,0,0.4)] p-6 rounded-[18px] font-sans">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={14} className="text-[#8a8478]" />
          <p className="text-[11px] font-bold tracking-widest text-[#8a8478] uppercase">累計求人応募</p>
        </div>
        {(totalApps ?? 0) > 0 ? (
          <p className="text-2xl font-bold text-[#f4f1ea]">{totalApps}<span className="text-sm text-[#8a8478] ml-1 font-normal">件</span></p>
        ) : (
          <DashboardEmptyState className="min-h-28" />
        )}
      </div>
    </div>
  );
}
