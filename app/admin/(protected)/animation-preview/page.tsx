import { Metadata } from 'next';
import { AnimationPreviewLab } from '@/components/features/admin/AnimationPreviewLab';

export const metadata: Metadata = {
  title: 'Animation Preview | Admin',
};

export default function AnimationPreviewPage() {
  return <AnimationPreviewLab />;
}
