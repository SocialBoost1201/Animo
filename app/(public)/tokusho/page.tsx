import React from 'react';
import { FadeIn } from '@/components/motion/FadeIn';

export const metadata = {
  title: '運営会社 | Club Animo',
  description: 'Club Animoの運営会社情報および特定商取引法に基づく表示。',
  alternates: {
    canonical: '/tokusho',
  },
};

const COMPANY_INFO = [
  { label: '事業者名',     value: '株式会社KTG COBOMO' },
  { label: '法人番号',     value: '7020001101549' },
  { label: '所在地',       value: '神奈川県横浜市中区相生町３丁目５３番地グランドパークビル２階' },
  { label: '電話番号',     value: '045-263-6961' },
  { label: '営業時間',     value: '21:00 〜 LAST（日曜・祝日定休）' },
  { label: '事業内容',     value: '飲食業（クラブ・ラウンジの経営）' },
  { label: '対応メール',   value: 'info@club-animo.com' },
];

export default function TokushoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-gray-light)] pb-24">
      <section className="bg-white pt-12 pb-16 px-6 border-b border-gray-100">
        <div className="container mx-auto text-center">
          <h1 className="text-[#171717] font-serif text-2xl md:text-4xl mb-2 tracking-widest uppercase">
            Company
          </h1>
          <p className="text-gray-500 font-sans tracking-[0.2em] text-xs md:text-sm uppercase">
            運営会社
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="container mx-auto max-w-3xl space-y-10">
          {/* 会社概要 */}
          <FadeIn className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
            <h2 className="text-[#171717] font-serif text-lg tracking-widest uppercase mb-8 border-b border-gray-100 pb-4">
              会社概要
            </h2>
            <dl className="divide-y divide-gray-50">
              {COMPANY_INFO.map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                  <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">
                    {label}
                  </dt>
                  <dd className="text-sm text-gray-700 font-sans leading-relaxed">
                    {label === '電話番号' ? (
                      <a href={`tel:${value.replace(/-/g, '')}`} className="hover:text-gold transition-colors">
                        {value}
                      </a>
                    ) : label === '対応メール' ? (
                      <a href={`mailto:${value}`} className="hover:text-gold transition-colors">
                        {value}
                      </a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeIn>

          {/* 特定商取引法 */}
          <FadeIn className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-sm">
            <h2 className="text-[#171717] font-serif text-lg tracking-widest uppercase mb-8 border-b border-gray-100 pb-4">
              特定商取引法に基づく表示
            </h2>
            <dl className="divide-y divide-gray-50 text-sm font-sans">
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">販売事業者</dt>
                <dd className="text-gray-700 leading-relaxed">株式会社KTG COBOMO</dd>
              </div>
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">代表責任者</dt>
                <dd className="text-gray-700 leading-relaxed">代表取締役</dd>
              </div>
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">所在地</dt>
                <dd className="text-gray-700 leading-relaxed">
                  〒231-0012<br />
                  神奈川県横浜市中区相生町３丁目５３番地グランドパークビル２階
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">お問い合わせ</dt>
                <dd className="text-gray-700 leading-relaxed">
                  TEL：045-263-6961（21:00〜LAST）<br />
                  Mail：info@club-animo.com
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">サービス内容</dt>
                <dd className="text-gray-700 leading-relaxed">飲食業（クラブ・ラウンジの経営）</dd>
              </div>
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">料金</dt>
                <dd className="text-gray-700 leading-relaxed">
                  ご利用内容により異なります。詳細は{' '}
                  <a href="/system" className="text-gold hover:underline">料金システム</a>
                  {' '}ページをご参照ください。
                </dd>
              </div>
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">支払方法</dt>
                <dd className="text-gray-700 leading-relaxed">現金・カード（詳細は店舗にお問い合わせください）</dd>
              </div>
              <div className="flex flex-col sm:flex-row py-4 gap-2 sm:gap-0">
                <dt className="text-xs font-bold tracking-widest text-gray-400 uppercase sm:w-40 shrink-0 pt-0.5">キャンセル</dt>
                <dd className="text-gray-700 leading-relaxed">ご予約のキャンセルは前日までにご連絡ください。</dd>
              </div>
            </dl>
          </FadeIn>

          {/* 免責事項 */}
          <FadeIn className="bg-white p-8 md:p-10 shadow-sm border border-gray-100 rounded-sm">
            <h2 className="text-[#171717] font-serif text-lg tracking-widest uppercase mb-6 border-b border-gray-100 pb-4">
              免責事項
            </h2>
            <p className="text-sm text-gray-600 font-sans leading-7">
              当サイトに掲載されている情報は、予告なく変更される場合があります。
              掲載情報の正確性には万全を期しておりますが、その完全性・正確性を保証するものではありません。
              当サイトのご利用により生じた損害について、当社は一切の責任を負いかねます。
            </p>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
