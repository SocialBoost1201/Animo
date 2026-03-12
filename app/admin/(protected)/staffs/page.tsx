import { createClient } from '@/lib/supabase/server';
import { ShieldAlert } from 'lucide-react';
import { StaffTable } from '@/components/features/admin/StaffTable';
import { InviteStaffButton } from '@/components/features/admin/InviteStaffButton';

export const dynamic = 'force-dynamic';

export default async function StaffsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, role, display_name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
  }

  const typedProfiles = (profiles ?? []).map((p) => ({
    id: p.id,
    role: p.role as string,
    display_name: p.display_name as string | null,
    created_at: p.created_at as string,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">スタッフ管理</h1>
          <p className="text-sm text-gray-500 mt-2">管理画面ユーザーの権限設定・招待</p>
        </div>
        <InviteStaffButton />
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
        <ShieldAlert className="text-amber-500 mt-0.5 shrink-0" size={20} />
        <div className="text-sm text-amber-800 space-y-1">
          <p className="font-bold">このページは「オーナー（owner）」専用です。</p>
          <p>招待したいスタッフのメールアドレスを入力してください。対象者がSupabaseアカウント登録後、自動的にこの一覧に表示されます。権限を「Staff」または「Manager」に設定してご利用ください。</p>
        </div>
      </div>

      <StaffTable
        profiles={typedProfiles}
        currentUserId={user?.id ?? ''}
      />
    </div>
  );
}
