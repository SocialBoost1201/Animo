import { createClient } from '@/lib/supabase/server';
import { ShieldAlert, UserPlus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StaffsPage() {
  const supabase = await createClient();

  // プロフィール一覧を取得（このページはMiddlewareで owner / manager しか見れない）
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, role, display_name, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif tracking-widest text-[#171717]">スタッフ管理</h1>
          <p className="text-sm text-gray-500 mt-2">システムを利用するスタッフ・管理者の権限設定</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-[#171717] hover:bg-gold text-white px-4 py-2 rounded-sm text-sm font-bold tracking-widest flex items-center gap-2 transition-colors">
            <UserPlus size={16} />
            新規スタッフ招待
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex items-start gap-3">
        <ShieldAlert className="text-amber-500 mt-0.5 shrink-0" size={20} />
        <div className="text-sm text-amber-800 space-y-1">
          <p className="font-bold">このページは「オーナー（owner）」および「マネージャー（manager）」専用です。</p>
          <p>スタッフ（staff）権限のユーザーは本ページや「サイト設定」にアクセスできません。アカウントを追加するには、新規にSupabase Authでサインアップしたユーザーに対し、ここで権限を割り当てます。</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">ユーザー名</th>
                <th className="px-6 py-4 font-medium tracking-wider">現在の権限</th>
                <th className="px-6 py-4 font-medium tracking-wider">登録日</th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profiles && profiles.length > 0 ? (
                profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#171717]">
                        {profile.display_name || '名前未設定'}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {profile.id.substring(0, 13)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        profile.role === 'owner' ? 'bg-purple-100 text-purple-800' :
                        profile.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {profile.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        defaultValue={profile.role}
                        className="text-sm border border-gray-200 rounded px-2 py-1 bg-white hover:border-gray-300 focus:outline-none focus:border-gold"
                        disabled={profile.role === 'owner'} // オーナーの権限変更はUIからは塞ぐ簡易実装
                      >
                        <option value="owner">Owner</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    スタッフアカウントが見つかりません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
