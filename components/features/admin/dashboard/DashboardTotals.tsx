import { createClient } from '@/lib/supabase/server';
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
      <div className="bg-[rgba(0,0,0,0.80)] border-[1.5px] border-[#927624] shadow-[4px_4px_10px_0_#A68A32] p-6 rounded-[18px]">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={14} className="text-[#8a8478]" />
          <p className="text-[11px] tracking-widest text-[#8a8478] uppercase">累計求人応募</p>
        </div>
        <p className="text-2xl font-bold text-[#f4f1ea]">{totalApps ?? 0}<span className="text-sm text-[#8a8478] ml-1">件</span></p>
      </div>
    </div>
  );
}
