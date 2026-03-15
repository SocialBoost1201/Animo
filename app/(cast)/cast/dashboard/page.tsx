import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { getMyCastPosts } from '@/lib/actions/cast-auth';
import { createClient } from '@/lib/supabase/server';
import { PenLine, FileText, User, LogOut, CalendarDays } from 'lucide-react';
import { castLogout } from '@/lib/actions/cast-auth';
import Image from 'next/image';

export default async function CastDashboardPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const supabase = await createClient();

  // 最新の投稿3件を取得
  const { data: recentPosts } = await supabase
    .from('cast_posts')
    .select('*')
    .eq('cast_id', cast.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // 本日の出勤
  const today = new Date().toISOString().split('T')[0];
  const { data: todayShift } = await supabase
    .from('shifts')
    .select('*')
    .eq('cast_id', cast.id)
    .eq('date', today)
    .maybeSingle();

  const menuItems = [
    { href: '/cast/post', icon: PenLine, label: '新規投稿', desc: '日記を投稿する', accent: true },
    { href: '/cast/posts', icon: FileText, label: '投稿一覧', desc: '過去の投稿を見る', accent: false },
    { href: '/cast/profile', icon: User, label: 'プロフィール', desc: '自分の情報を確認', accent: false },
  ];

  return (
    <div className="px-5 py-8 max-w-lg mx-auto space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl tracking-widest text-[#171717]">{cast.stage_name || cast.name}</h1>
          <p className="text-[10px] text-gray-400 tracking-wider mt-1 uppercase font-serif">Cast Dashboard</p>
        </div>
        <form action={castLogout}>
          <button type="submit" className="p-2 text-gray-300 hover:text-red-400 transition-colors" title="ログアウト">
            <LogOut className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* 本日の出勤 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <CalendarDays className="w-4 h-4 text-gold" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-serif">Today&apos;s Schedule</span>
        </div>
        {todayShift ? (
          <p className="text-sm text-[#171717] font-bold">
            {todayShift.start_time?.slice(0, 5)} 〜 {todayShift.end_time?.slice(0, 5)}
          </p>
        ) : (
          <p className="text-sm text-gray-400">本日の出勤予定はありません</p>
        )}
      </div>

      {/* Menu */}
      <div className="grid grid-cols-1 gap-3">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all active:scale-[0.98] ${
              item.accent
                ? 'bg-[#171717] text-white border-transparent shadow-lg hover:bg-gold'
                : 'bg-white text-[#171717] border-gray-100 shadow-sm hover:border-gold/30'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.accent ? 'text-gold' : 'text-gold/60'}`} />
            <div>
              <div className={`text-sm font-bold tracking-widest ${item.accent ? '' : 'text-[#171717]'}`}>{item.label}</div>
              <div className={`text-[10px] mt-0.5 tracking-wider ${item.accent ? 'text-white/60' : 'text-gray-400'}`}>{item.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-serif mb-4">最近の投稿</h2>
        {recentPosts && recentPosts.length > 0 ? (
          <div className="space-y-3">
            {recentPosts.map((post: any) => (
              <div key={post.id} className="flex items-start gap-4 bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                  <Image src={post.image_url} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">{post.content}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      post.status === 'published' ? 'bg-green-50 text-green-600' :
                      post.status === 'pending' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {post.status === 'published' ? '公開中' : post.status === 'pending' ? '承認待ち' : '下書き'}
                    </span>
                    <span className="text-[9px] text-gray-300 font-mono">
                      {new Date(post.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">まだ投稿がありません</p>
        )}
      </div>
    </div>
  );
}
