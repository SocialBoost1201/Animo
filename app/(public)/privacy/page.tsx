import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: 'Privacy Policy | Club Animo',
  description: 'Club Animoのプライバシーポリシー（個人情報保護方針）について。',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto text-center">
           <h1 className="text-[#171717] font-serif text-2xl md:text-4xl mb-2 tracking-widest uppercase">
            Privacy Policy
          </h1>
          <p className="text-gray-500 font-sans tracking-[0.2em] text-xs md:text-sm uppercase">
            プライバシーポリシー
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm prose prose-sm md:prose-base max-w-none text-gray-700 font-sans">
             <p className="mb-8">
              Club Animo（以下「当店」）は、お客様の個人情報保護の重要性を強く認識し、以下の通りプライバシーポリシーを定め、個人情報の保護に努めます。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">1. 個人情報の収集・利用</h3>
            <p>
              当店は、ご予約・ご来店・求人応募・お問い合わせ等に際し、必要な範囲内で個人情報を収集いたします。<br />
              収集した個人情報は、以下の目的の範囲内で利用いたします。
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              <li>ご予約の確認・管理およびサービス提供のため</li>
              <li>お問い合わせや求人応募に対する回答・連絡のため</li>
              <li>当店の最新情報やイベント告知などのご案内のため</li>
              <li>サービス向上のための統計・分析のため</li>
            </ul>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">2. 個人情報の第三者提供</h3>
            <p>
              当店は、法令に基づき開示・提供を求められた場合を除き、お客様の同意なく個人情報を第三者に提供・開示することはいたしません。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">3. 個人情報の安全管理</h3>
            <p>
              当店は、個人情報の漏洩、滅失または毀損の防止のため、適切なセキュリティ対策を講じ、安全管理に努めます。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">4. プライバシーポリシーの変更</h3>
            <p>
              当店は、法令の変更等に伴い、本プライバシーポリシーの継続的な見直しと改善を行い、必要に応じて改定することがあります。
            </p>

            <div className="mt-12 flex justify-end text-[10px] md:text-xs text-gray-400 luxury-tracking uppercase font-sans">
              制定日：2023年10月1日
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
