import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { CastPostUploadForm } from '@/components/features/cast/CastPostUploadForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function CastNewPostPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/cast/dashboard" className="inline-flex items-center text-xs text-gray-400 hover:text-gold transition-colors tracking-wider">
          <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-serif text-2xl tracking-widest text-[#171717] mb-2">New Post</h1>
        <p className="text-xs text-gray-400 tracking-wider">キャスト日記を投稿する</p>
      </div>

      <CastPostUploadForm castId={cast.id} />

      <div className="mt-8 text-center">
        <p className="text-xs text-gray-300 leading-relaxed">
          ※ 投稿は管理者の確認後に公開されます。<br />
          ※ 画像の位置情報などは自動的に削除されます。
        </p>
      </div>
    </div>
  );
}
