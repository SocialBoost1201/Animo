import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  // サマリデータの取得 (件数など)
  const { count: castsCount } = await supabase.from('casts').select('*', { count: 'exact', head: true });
  const { count: applicationsCount } = await supabase.from('recruit_applications').select('*', { count: 'exact', head: true }).eq('is_read', false);
  const { count: inquiriesCount } = await supabase.from('contacts').select('*', { count: 'exact', head: true }).eq('is_read', false);

  // 本日出勤予定のキャストを取得
  const today = new Date().toISOString().split('T')[0];
  const { data: todayShifts } = await supabase
    .from('shifts')
    .select('*, casts(name)')
    .eq('date', today);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-2">サイトの現在のステータスと未読アクション</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 状態サマリカード */}
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold tracking-widest text-gray-500 uppercase">登録キャスト数</h3>
          <p className="text-4xl font-serif text-[#171717] mt-3">{castsCount || 0} <span className="text-sm text-gray-400 font-sans">名</span></p>
        </div>

        <div className="bg-white p-6 rounded-sm border border-[var(--color-gold)] shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold tracking-widest text-[var(--color-gold)] uppercase">新規の求人応募</h3>
          <p className="text-4xl font-serif text-[#171717] mt-3">{applicationsCount || 0} <span className="text-sm text-gray-400 font-sans">件 (未読)</span></p>
        </div>

        <div className="bg-white p-6 rounded-sm border border-[var(--color-gold)] shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-bold tracking-widest text-[var(--color-gold)] uppercase">新規の問い合わせ・予約</h3>
          <p className="text-4xl font-serif text-[#171717] mt-3">{inquiriesCount || 0} <span className="text-sm text-gray-400 font-sans">件 (未読)</span></p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-bold tracking-widest text-[#171717] uppercase">本日の出勤予定 ({today})</h3>
        </div>
        <div className="p-6">
          {todayShifts && todayShifts.length > 0 ? (
            <ul className="space-y-3">
              {todayShifts.map((shift: any) => (
                <li key={shift.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="font-bold text-[#171717]">{shift.casts?.name}</span>
                  <span className="text-sm text-gray-500">{shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">本日の出勤予定はまだ登録されていません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
