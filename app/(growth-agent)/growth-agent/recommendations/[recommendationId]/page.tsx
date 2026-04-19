import { GrowthAgentWorkspace } from '@/components/features/growth-agent/GrowthAgentWorkspace';
import { getGrowthAgentSeed } from '@/lib/growth-agent/mock-data';

export default async function RecommendationPage({
  params,
}: {
  params: Promise<{ recommendationId: string }>;
}) {
  const { recommendationId } = await params;

  return (
    <GrowthAgentWorkspace
      initialSnapshot={getGrowthAgentSeed()}
      activeView="dashboard"
      initialRecommendationId={recommendationId}
    />
  );
}
