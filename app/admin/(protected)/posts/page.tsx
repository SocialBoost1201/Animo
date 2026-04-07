import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { updateCastPostStatus, deleteCastPost } from '@/lib/actions/cast-posts';
import { CheckCircle2, XCircle, Trash2, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import { revalidatePath } from 'next/cache';

export const metadata = {
  title: 'キャスト投稿管理 | Animo CMS',
};

export default async function AdminCastPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = 'pending' } = await searchParams;
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from('cast_posts')
    .select('*, casts(name, stage_name)')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-[12px] text-[#d4785a]">Error: {error.message}</p>
      </div>
    );
  }

  const handleApprove = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await updateCastPostStatus(id, 'published');
    revalidatePath('/admin/posts');
  };

  const handleReject = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await updateCastPostStatus(id, 'draft');
    revalidatePath('/admin/posts');
  };

  const handleDelete = async (formData: FormData) => {
    'use server';
    const id = formData.get('id') as string;
    await deleteCastPost(id);
    revalidatePath('/admin/posts');
  };

  const tabs = [
    { id: 'pending',   label: '承認待ち',     icon: Clock },
    { id: 'published', label: '公開中',        icon: CheckCircle2 },
    { id: 'draft',     label: '下書き / 非公開', icon: XCircle },
  ];

  return (
    <div className="space-y-6 font-inter">
      {/* ── Page Header ── */}
      <div className="py-2">
        <h1 className="text-[17px] font-semibold text-[#f4f1ea] tracking-[-0.31px]">キャスト投稿</h1>
        <p className="text-[11px] text-[#8a8478] tracking-[0.06px] mt-0.5">キャストの日記投稿を管理・承認します</p>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 border-b border-[#ffffff08]">
        {tabs.map((tab) => {
          const isActive = status === tab.id;
          const Icon = tab.icon;
          return (
            <a
              key={tab.id}
              href={`/admin/posts?status=${tab.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium transition-colors relative ${
                isActive ? 'text-[#f4f1ea]' : 'text-[#5a5650] hover:text-[#8a8478]'
              }`}
            >
              <Icon size={12} />
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
              )}
            </a>
          );
        })}
      </div>

      {/* ── Post Grid ── */}
      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {posts.map((post: {
            id: string;
            image_url: string;
            content: string;
            created_at: string;
            view_count?: number;
            casts?: { name?: string; stage_name?: string } | null;
          }) => (
            <div
              key={post.id}
              className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] bg-[#1c1d22]">
                <Image
                  src={post.image_url}
                  alt="Post Image"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0e0e10]/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#72b894]" />
                  <span className="text-[10px] font-medium text-[#f4f1ea]">
                    {post.casts?.stage_name || post.casts?.name || '–'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[11px] text-[#8a8478] line-clamp-3 mb-3 flex-1 leading-relaxed">{post.content}</p>
                <div className="flex items-center justify-between text-[10px] text-[#5a5650] mb-3">
                  <span>{new Date(post.created_at).toLocaleDateString('ja-JP')}</span>
                  <span className="flex items-center gap-1 text-[#dfbd69] font-semibold">
                    <Eye size={11} />
                    {post.view_count?.toLocaleString() || 0}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-[#ffffff08]">
                  {status === 'pending' && (
                    <form action={handleApprove} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="w-full py-1.5 rounded-[8px] text-[11px] font-bold text-[#0b0b0d] transition-opacity hover:opacity-90"
                        style={{ background: 'linear-gradient(90deg, rgba(223,189,105,1) 0%, rgba(146,111,52,1) 100%)' }}
                      >
                        承認して公開
                      </button>
                    </form>
                  )}
                  {status === 'published' && (
                    <form action={handleReject} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="w-full py-1.5 rounded-[8px] text-[11px] font-medium text-[#8a8478] border border-[#ffffff14] hover:border-[#ffffff25] hover:text-[#c7c0b2] transition-colors"
                      >
                        非公開にする
                      </button>
                    </form>
                  )}
                  {status === 'draft' && (
                    <form action={handleApprove} className="flex-1">
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="w-full py-1.5 rounded-[8px] text-[11px] font-medium text-[#dfbd69] border border-[#dfbd6930] hover:bg-[#dfbd6910] transition-colors"
                      >
                        再公開する
                      </button>
                    </form>
                  )}
                  <form action={handleDelete}>
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-[8px] text-[#5a5650] border border-[#ffffff0f] hover:border-[#d4785a30] hover:text-[#d4785a] hover:bg-[#d4785a08] transition-colors"
                      title="削除"
                    >
                      <Trash2 size={13} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#17181c] rounded-[18px] border border-[#ffffff0f] py-20 text-center">
          <Clock size={28} className="text-[#5a5650] mx-auto mb-3" />
          <p className="text-[13px] font-medium text-[#8a8478]">投稿がありません</p>
          <p className="text-[11px] text-[#5a5650] mt-1">現在、該当するステータスの投稿はありません。</p>
        </div>
      )}
    </div>
  );
}
