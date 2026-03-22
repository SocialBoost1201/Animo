import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { updateCastPostStatus, deleteCastPost } from '@/lib/actions/cast-posts';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, XCircle, Trash2, Clock, MessageSquare, Eye } from 'lucide-react';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'キャスト投稿管理 | Animo CMS',
};

export default async function AdminCastPostsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = 'pending' } = await searchParams;
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('cast_posts')
    .select('*, casts(name, stage_name)')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-6 text-red-500">Error: {error.message}</div>;
  }

  // Action: 公開承認
  const handleApprove = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await updateCastPostStatus(id, 'published');
    revalidatePath('/admin/posts');
  };

  // Action: 非公開（下書きへ戻す）
  const handleReject = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await updateCastPostStatus(id, 'draft');
    revalidatePath('/admin/posts');
  };

  // Action: 削除
  const handleDelete = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await deleteCastPost(id);
    revalidatePath('/admin/posts');
  };

  const tabs = [
    { id: 'pending', label: '承認待ち', icon: Clock },
    { id: 'published', label: '公開中', icon: CheckCircle2 },
    { id: 'draft', label: '下書き / 非公開', icon: XCircle },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif tracking-widest text-gray-900">Cast Posts</h1>
          <p className="text-sm text-gray-400 mt-1">キャストの日記投稿を管理・承認します</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-px">
        {tabs.map((tab) => {
          const isActive = status === tab.id;
          return (
            <a
              key={tab.id}
              href={`/admin/posts?status=${tab.id}`}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                isActive ? 'border-gold text-gold' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </a>
          );
        })}
      </div>

      {/* Grid */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-aura flex flex-col">
              <div className="relative aspect-4/5 bg-gray-100">
                <Image 
                  src={post.image_url} 
                  alt="Post Image" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  {post.casts?.stage_name || post.casts?.name || 'Unknown Cast'}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1 wrap-break-word whitespace-pre-wrap">{post.content}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 mb-4 font-mono w-full">
                  <span>{new Date(post.created_at).toLocaleString('ja-JP')}</span>
                  <span className="flex items-center gap-1 font-bold text-gold" title="この記事の閲覧数（PV）">
                    <Eye className="w-3.5 h-3.5" />
                    {post.view_count?.toLocaleString() || 0} PV
                  </span>
                </div>
                
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
                  {status === 'pending' && (
                    <form action={handleApprove} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <Button type="submit" size="sm" className="w-full bg-gold hover:bg-gold/90 text-white border-transparent">
                        承認して公開
                      </Button>
                    </form>
                  )}
                  {status === 'published' && (
                    <form action={handleReject} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <Button type="submit" variant="outline" size="sm" className="w-full">
                        非公開にする
                      </Button>
                    </form>
                  )}
                  {status === 'draft' && (
                    <form action={handleApprove} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <Button type="submit" variant="outline" size="sm" className="w-full border-gold text-gold hover:bg-gold hover:text-white">
                        再公開する
                      </Button>
                    </form>
                  )}
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={post.id} />
                    <Button type="submit" variant="outline" size="sm" className="px-3 border-red-500 text-red-500 hover:bg-red-50" title="完全に削除">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">投稿がありません</h3>
          <p className="text-sm text-gray-400">現在、該当するステータスの投稿はありません。</p>
        </div>
      )}
    </div>
  );
}
