import { GrowthAgentWorkspace } from '@/components/features/growth-agent/GrowthAgentWorkspace';
import { getGrowthAgentSeed } from '@/lib/growth-agent/mock-data';

export default function GrowthAgentNotificationsPage() {
  return <GrowthAgentWorkspace initialSnapshot={getGrowthAgentSeed()} activeView="notifications" />;
}
