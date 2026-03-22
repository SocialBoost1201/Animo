import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function CastProfilePage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  const profileFields = [
    { label: 'Stage Name', value: cast.stage_name || cast.name },
    { label: 'Age', value: cast.age ? `${cast.age}歳` : '-' },
    { label: 'Height', value: cast.height ? `${cast.height}cm` : '-' },
    { label: 'Hobby', value: cast.hobby || '-' },
  ];

  return (
    <div className="px-5 py-8 max-w-lg mx-auto">
      <div className="mb-6">
        <Link href="/cast/dashboard" className="inline-flex items-center text-xs text-gray-400 hover:text-gold transition-colors tracking-wider">
          <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
        </Link>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-serif text-xl tracking-widest text-[#171717] mb-1">Profile</h1>
        <p className="text-xs text-gray-400 tracking-wider">プロフィール情報</p>
      </div>

      {/* Profile Image */}
      <div className="w-40 h-40 mx-auto mb-8 rounded-full overflow-hidden bg-gray-100 border-2 border-gold/20">
        <PlaceholderImage
          src={cast.image_url}
          alt={cast.stage_name || cast.name}
          ratio="square"
          placeholderText={cast.stage_name || cast.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {profileFields.map((field) => (
          <div key={field.label} className="flex items-center justify-between px-5 py-4">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-serif">{field.label}</span>
            <span className="text-sm text-[#171717] font-bold">{field.value}</span>
          </div>
        ))}
      </div>

      {/* Comment / Message */}
      {cast.comment && (
        <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-serif block mb-3">Message</span>
          <p className="text-sm text-gray-600 font-serif leading-relaxed whitespace-pre-wrap">{cast.comment}</p>
        </div>
      )}

      <p className="mt-8 text-center text-xs text-gray-300 leading-relaxed">
        ※ プロフィールの変更は管理者までお問い合わせください。
      </p>
    </div>
  );
}
