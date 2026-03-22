import React from 'react';
import { CastPostUploadForm } from '@/components/features/cast/CastPostUploadForm';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'キャスト日記 投稿 | Club Animo Portal',
};

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login'); // TODO: Cast向けのログインページがあればそちらに
  }

  // user.id に紐づく cast 情報を取得
  const { data: castData, error } = await supabase
    .from('casts')
    .select('id, name')
    // FIXME: 実際のAuth連携構造に合わせてidの取得元を変更してください。
    // 現状はテストもしくはAdmin連携を想定して先頭のcastを仮取得するか、コメントアウトして適切なIDを渡します。
    .limit(1)
    .single();

  if (error || !castData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <p className="text-gray-500 text-sm">キャスト情報が見つかりません。店舗管理者へお問い合わせください。</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl tracking-widest text-[#171717] mb-2">New Post</h1>
          <p className="text-xs text-gray-500 tracking-wider">キャスト日記を投稿する</p>
        </div>

        {/* 投稿フォームコンポーネント */}
        <CastPostUploadForm castId={castData.id} />
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            ※ 投稿内容は管理者の確認後にWebサイトへ公開されます。<br />
            ※ 画像は自動的に圧縮され、撮影場所(位置情報)などのデータも削除されます。
          </p>
        </div>
      </div>
    </div>
  );
}
