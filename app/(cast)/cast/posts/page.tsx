import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentCast, getMyCastPosts } from '@/lib/actions/cast-auth';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, PenLine } from 'lucide-react';

export default async function CastPostsPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const { data: posts } = await getMyCastPosts(cast.id);

  const statusConfig: Record<string, { label: string; color: string }> = {
    published: { label: '公開中', color: 'bg-green-50 text-green-600' },
    pending: { label: '承認待ち', color: 'bg-yellow-50 text-yellow-600' },
    draft: { label: '下書き', color: 'bg-gray-50 text-gray-400' },
  };

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/cast/dashboard" className="inline-flex items-center text-xs text-gray-400 hover:text-gold transition-colors tracking-wider mb-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Link>
          <h1 className="font-serif text-xl tracking-widest text-[#171717]">My Posts</h1>
        </div>
        <Link href="/cast/post" className="flex items-center gap-2 px-4 py-2 bg-[#171717] text-white text-xs tracking-widest uppercase rounded-xl hover:bg-gold transition-all">
          <PenLine className="w-3.5 h-3.5" /> 投稿する
        </Link>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post: any) => {
            const status = statusConfig[post.status] || statusConfig.draft;
            return (
              <div key={post.id} className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                  <Image src={post.image_url} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <p className="text-xs text-gray-600 line-clamp-2 wrap-break-word">{post.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${status.color}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-gray-300 font-mono">
                      {new Date(post.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm text-gray-400 mb-6">まだ投稿がありません</p>
          <Link href="/cast/post" className="inline-flex items-center gap-2 px-6 py-3 bg-[#171717] text-white text-xs tracking-widest uppercase rounded-xl hover:bg-gold transition-all">
            <PenLine className="w-4 h-4" /> 最初の投稿を作成する
          </Link>
        </div>
      )}
    </div>
  );
}
