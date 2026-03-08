import { createClient } from '@/lib/supabase/server';
import { TrendingUp, Briefcase } from 'lucide-react';

export async function DashboardTotals() {
  const supabase = await createClient();

  const [
    { count: totalContacts },
    { count: totalApps },
  ] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('recruit_applications').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-gray-400" />
          <p className="text-xs tracking-widest text-gray-400 uppercase">累計お問い合わせ</p>
        </div>
        <p className="text-2xl font-serif text-[#171717]">{totalContacts ?? 0}<span className="text-sm text-gray-400 ml-1">件</span></p>
      </div>
      <div className="bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <Briefcase size={14} className="text-gray-400" />
          <p className="text-xs tracking-widest text-gray-400 uppercase">累計求人応募</p>
        </div>
        <p className="text-2xl font-serif text-[#171717]">{totalApps ?? 0}<span className="text-sm text-gray-400 ml-1">件</span></p>
      </div>
    </div>
  );
}
