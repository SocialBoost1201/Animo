import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: 'Recruit Policy | Club Animo',
  description: 'Club Animoの求人応募に関する個人情報等の取り扱い方針について。',
};

export default function RecruitPolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto text-center">
           <h1 className="text-[#171717] font-serif text-2xl md:text-4xl mb-2 tracking-widest uppercase">
            Recruit Policy
          </h1>
          <p className="text-gray-500 font-sans tracking-[0.2em] text-xs md:text-sm uppercase">
            求人応募に関するプライバシーポリシー
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl">
          <FadeIn className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm prose prose-sm md:prose-base max-w-none text-gray-700 font-sans">
             <p className="mb-8">
              Club Animo（以下「当店」）は、求人応募者への連絡および採用活動等の目的において、お預かりした個人情報の取り扱いについて以下の通り定めます。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">1. 個人情報の利用目的</h3>
            <p>
              当店は、応募フォームおよびお電話にて収集した電話番号、LINE ID、お名前、年齢などの情報を、以下の目的の範囲内でのみ利用いたします。
            </p>
            <ul className="list-disc pl-5 mb-6 space-y-1">
              <li>面接日程の調整や、合否を含む採用に関するご連絡のため</li>
              <li>採用の可否判断および選考プロセスの管理のため</li>
              <li>入社後の雇用管理における基礎データとするため</li>
            </ul>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">2. 年齢および身分証の確認に関する取り扱い</h3>
            <p>
              当店では風俗営業等の規制及び業務の適正化等に関する法律等を遵守するため、応募時点で「20歳以上」の方のみを採用対象としております。
              そのため、面接および体験入店の際には、公的な身分証明書による年齢確認を必ず実施いたします。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">3. 応募データの管理と破棄</h3>
            <p>
              ご提供いただいた応募データにつきましては、当店の採用活動終了後、または不採用となった場合には、当店にて責任をもって適切に破棄・削除いたします。
              第三者へ開示・提供することは一切ございません（法令に基づく場合を除く）。
            </p>

            <h3 className="text-[#171717] font-bold border-l-4 border-gold pl-3 mt-8 mb-4">4. お問い合わせ</h3>
            <p>
              ご自身の個人情報に関する開示、訂正、削除等のご請求がある場合は、当店の「Contact」ページ等よりお申し出ください。
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
