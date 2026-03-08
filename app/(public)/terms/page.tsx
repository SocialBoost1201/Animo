import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: 'Terms of Service | Club Animo',
  description: 'Club Animoの利用規約について。',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto text-center">
           <h1 className="text-[#171717] font-serif text-2xl md:text-4xl mb-2 tracking-widest uppercase">
            Terms of Service
          </h1>
          <p className="text-gray-500 font-sans tracking-[0.2em] text-xs md:text-sm uppercase">
            利用規約
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm prose prose-sm md:prose-base max-w-none text-gray-700 font-sans">
             <p className="mb-8">
              この利用規約（以下「本規約」）は、Club Animo（以下「当店」）が提供するサービス（WEBサイトで提供するサービスを含みます。以下「本サービス」）のご利用条件を定めるものです。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">1. ご利用資格</h3>
            <p>
              当店は風俗営業等の規制及び業務の適正化等に関する法律等により、20歳未満の方の入店を固くお断りしております。ご入店時に身分証明書の提示をお願いする場合がございます。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">2. 禁止事項</h3>
            <p>
              お客様は、本サービスのご利用にあたり、以下の行為をしてはなりません。
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              <li>キャストや他のスタッフ等への迷惑行為・セクハラ行為・暴力行為</li>
              <li>店内での無断撮影・録音</li>
              <li>当店の営業を妨害する行為</li>
              <li>法令または公序良俗に違反する行為</li>
            </ul>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">3. 免責事項</h3>
            <p>
              当店は、お客様同士、またはお客様と第三者との間で生じたトラブルについて一切の責任を負いません。また、お荷物・貴重品の紛失等につきましても当店は責任を負いかねますので各自で管理をお願いいたします。
            </p>

            <div className="mt-12 flex justify-end text-sm text-gray-500">
              制定日：2023年10月1日
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
