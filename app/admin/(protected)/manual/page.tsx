import type { Metadata } from 'next';
import { ManualPage } from '@/components/features/admin/ManualPage';

export const metadata: Metadata = {
  title: '操作マニュアル | ANIMO CMS',
  description: 'CLUB ANIMO 管理者向けCMS操作マニュアル。シフト管理・キャスト管理・顧客データなど日常業務の手順を確認できます。',
};

export default function ManualPageRoute() {
  return <ManualPage />;
}
