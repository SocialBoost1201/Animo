import { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/seo/BreadcrumbSchema';

export const metadata: Metadata = {
  title: '黒服・スタッフ求人｜関内キャバクラ CLUB Animo',
  description: '関内・馬車道エリアの高級キャバクラ「CLUB Animo」の黒服・ホールスタッフ等、運営スタッフの求人募集。未経験歓迎、充実の福利厚生と昇格制度であなたの活躍をサポートします。',
};

export default function StaffRecruitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema breadcrumbs={[
        { name: 'HOME', item: 'https://club-animo.com/' },
        { name: 'STAFF RECRUIT', item: 'https://club-animo.com/recruit/staff' }
      ]} />
      {children}
    </>
  );
}
