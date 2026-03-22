import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: 'キャスト求人・体入情報｜関内キャバクラ CLUB Animo',
  description: '関内・馬車道エリアの高級キャバクラ「CLUB Animo」のフロアレディ・キャスト求人募集。未経験歓迎、全額日払いOKの1日体験入店を実施中。高待遇で皆様をお迎えします。',
};

export default function CastRecruitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.jp/' },
        { name: 'RECRUIT', item: 'https://club-animo.jp/recruit/cast' }
      ]} />
      {children}
    </>
  );
}
