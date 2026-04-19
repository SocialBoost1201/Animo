import type { Metadata } from 'next';

import { GrowthAgentChrome } from '@/components/features/growth-agent/GrowthAgentChrome';
import { GrowthAgentToaster } from '@/components/features/growth-agent/GrowthAgentToaster';

export const metadata: Metadata = {
  title: 'AI Growth Agent',
  description: 'Owner-controlled SEO, MEO, and GEO operating surface for local businesses.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function GrowthAgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GrowthAgentToaster />
      <GrowthAgentChrome>{children}</GrowthAgentChrome>
    </>
  );
}
