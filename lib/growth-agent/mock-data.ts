import type { GrowthAgentSnapshot } from '@/lib/growth-agent/types';

const now = new Date('2026-04-19T09:00:00+09:00');

function hoursAgo(hours: number): string {
  return new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
}

function minutesAgo(minutes: number): string {
  return new Date(now.getTime() - minutes * 60 * 1000).toISOString();
}

const growthAgentSeed: GrowthAgentSnapshot = {
  business: {
    id: 'biz-1',
    name: 'North Star Local Growth',
    ownerName: 'Takuma Shinnyo',
    planName: 'Owner Control',
    defaultStoreId: 'store-kannai',
  },
  stores: [
    {
      id: 'store-kannai',
      name: 'Kannai Lounge Lumiere',
      city: 'Yokohama',
      segment: 'Luxury lounge',
      websiteUrl: 'https://example.com/kannai-lumiere',
      connections: [
        {
          id: 'conn-kannai-gbp',
          kind: 'google-business-profile',
          name: 'Google Business Profile',
          status: 'connected',
          lastSyncAt: minutesAgo(18),
          detail: 'Reviews, posts, and profile fields are syncing normally.',
        },
        {
          id: 'conn-kannai-cms',
          kind: 'cms',
          name: 'Marketing CMS',
          status: 'connected',
          lastSyncAt: minutesAgo(22),
          detail: 'FAQ and store description updates can be published after approval.',
        },
        {
          id: 'conn-kannai-rank',
          kind: 'rank-tracker',
          name: 'Search Rank Monitor',
          status: 'connected',
          lastSyncAt: hoursAgo(3),
          detail: 'Tracking local pack and organic visibility for 24 keywords.',
        },
        {
          id: 'conn-kannai-competitors',
          kind: 'competitor-monitor',
          name: 'Competitor Observation',
          status: 'syncing',
          lastSyncAt: hoursAgo(2),
          detail: 'Watching three nearby competitors for post cadence and FAQ gaps.',
        },
      ],
    },
    {
      id: 'store-bashamichi',
      name: 'Bashamichi Club Sol',
      city: 'Yokohama',
      segment: 'Club',
      websiteUrl: 'https://example.com/bashamichi-sol',
      connections: [
        {
          id: 'conn-sol-gbp',
          kind: 'google-business-profile',
          name: 'Google Business Profile',
          status: 'connected',
          lastSyncAt: minutesAgo(30),
          detail: 'Profile data is healthy; new reviews waiting for response suggestions.',
        },
        {
          id: 'conn-sol-cms',
          kind: 'cms',
          name: 'Marketing CMS',
          status: 'attention',
          lastSyncAt: hoursAgo(9),
          detail: 'Publishing token expires in 2 days. Re-authentication recommended.',
        },
        {
          id: 'conn-sol-rank',
          kind: 'rank-tracker',
          name: 'Search Rank Monitor',
          status: 'connected',
          lastSyncAt: hoursAgo(4),
          detail: 'Tracking discovery for brand, area, and nightlife intent keywords.',
        },
        {
          id: 'conn-sol-competitors',
          kind: 'competitor-monitor',
          name: 'Competitor Observation',
          status: 'connected',
          lastSyncAt: hoursAgo(5),
          detail: 'Rival stores increased review reply speed and FAQ freshness this week.',
        },
      ],
    },
  ],
  recommendations: [
    {
      id: 'rec-kannai-review',
      storeId: 'store-kannai',
      title: 'Reply to 2 unanswered high-intent reviews',
      summary:
        'Two recent reviews mention premium seating and first-visit uncertainty. A faster reply should improve map trust and conversion intent.',
      kind: 'review_reply',
      targetSystem: 'gbp',
      sourceSignal: 'Google review backlog + local pack dip',
      reason:
        'Review reply rate fell to 41% this week while a nearby competitor responded within 6 hours on average.',
      expectedImpactLabel: 'high',
      expectedImpactValue: '+12% map action lift expected',
      priority: 95,
      workflowStatus: 'pending_approval',
      suggestedAt: minutesAgo(14),
      destinationLabel: 'GBP reviews / public reply',
      notes: [
        'Keep the tone warm and premium.',
        'Address first-time visitor concern directly.',
        'No publication happens until approval.',
      ],
      diffBlocks: [
        {
          id: 'diff-kannai-review-1',
          label: 'Review reply draft',
          before: 'No reply exists for this review.',
          after:
            'ご来店ありがとうございました。初めてのお客様にも安心してお過ごしいただけるよう、次回はお席や楽しみ方もより丁寧にご案内いたします。ぜひまたゆっくりお越しください。',
        },
      ],
      approvalHistory: [],
    },
    {
      id: 'rec-kannai-faq',
      storeId: 'store-kannai',
      title: 'Publish GEO-friendly FAQ about private room usage',
      summary:
        'AI search visibility is weak on questions around private rooms, price expectations, and first reservation flow.',
      kind: 'faq',
      targetSystem: 'cms',
      sourceSignal: 'GEO answer gap + rising long-tail demand',
      reason:
        'Generative search snapshots mention competitors more often when users ask about private room usage or beginner-friendly booking.',
      expectedImpactLabel: 'high',
      expectedImpactValue: '+18 AI answer readiness score',
      priority: 91,
      workflowStatus: 'pending_approval',
      suggestedAt: hoursAgo(2),
      destinationLabel: 'CMS / FAQ section',
      notes: [
        'Keeps scope to a single FAQ block update.',
        'References actual reservation flow already present on site.',
      ],
      diffBlocks: [
        {
          id: 'diff-kannai-faq-1',
          label: 'FAQ answer',
          before:
            'Private room details are not clearly described on the store page.',
          after:
            '個室席は事前予約でご案内可能です。初めてのお客様も、ご来店人数・ご希望時間・ご予算感をお伝えいただければ、当日の流れまで含めてスタッフが丁寧にご案内します。',
        },
        {
          id: 'diff-kannai-faq-2',
          label: 'FAQ heading',
          before: 'No dedicated question exists.',
          after: '初めてでも個室席を利用できますか？',
        },
      ],
      approvalHistory: [],
    },
    {
      id: 'rec-sol-profile',
      storeId: 'store-bashamichi',
      title: 'Refresh GBP description to match current brand story',
      summary:
        'Store description still emphasizes “night lounge” while current search demand and site copy now lean toward premium club dining.',
      kind: 'business_info',
      targetSystem: 'gbp',
      sourceSignal: 'Brand mismatch between site, GBP, and search snippets',
      reason:
        'Profile text has not been refreshed in 94 days and is lagging behind the current website positioning.',
      expectedImpactLabel: 'medium',
      expectedImpactValue: '+8% profile engagement expected',
      priority: 84,
      workflowStatus: 'pending_approval',
      suggestedAt: hoursAgo(5),
      destinationLabel: 'GBP profile / business description',
      notes: [
        'Keep within GBP description constraints.',
        'Use the same premium positioning as the landing page.',
      ],
      diffBlocks: [
        {
          id: 'diff-sol-profile-1',
          label: 'Business description',
          before:
            'A stylish night lounge near Bashamichi with drinks, music, and a relaxed atmosphere.',
          after:
            '馬車道エリアで上質な時間を楽しめるクラブスタイルのラウンジ。初めての方にも分かりやすいご案内と、落ち着いた空間でのご接待・ご会食利用に対応しています。',
        },
      ],
      approvalHistory: [],
    },
    {
      id: 'rec-sol-copy',
      storeId: 'store-bashamichi',
      title: 'Tighten store intro copy for local search intent',
      summary:
        'Top competitors now mention access, seating type, and beginner reassurance in the first paragraph. Current CMS copy buries all three.',
      kind: 'store_copy',
      targetSystem: 'cms',
      sourceSignal: 'Competitor copy delta + homepage bounce increase',
      reason:
        'The first paragraph does not answer the top local-intent questions that users ask in search and AI answer interfaces.',
      expectedImpactLabel: 'medium',
      expectedImpactValue: '+11% store page engagement expected',
      priority: 78,
      workflowStatus: 'failed',
      suggestedAt: hoursAgo(11),
      destinationLabel: 'CMS / store introduction module',
      notes: [
        'Previous publish failed because CMS token expired.',
        'Retry will be available after the connection is refreshed.',
      ],
      diffBlocks: [
        {
          id: 'diff-sol-copy-1',
          label: 'Lead paragraph',
          before:
            'Club Sol is a refined nightlife destination in Bashamichi with beautiful lighting and premium service.',
          after:
            '馬車道駅からアクセスしやすく、接待にも初来店にも使いやすい落ち着いたクラブ空間です。席の雰囲気や料金の相談もしやすく、初めてのご予約でも安心してご利用いただけます。',
        },
      ],
      approvalHistory: [
        {
          id: 'approval-sol-copy-1',
          recommendationId: 'rec-sol-copy',
          action: 'approved',
          actorName: 'Takuma Shinnyo',
          at: hoursAgo(10),
          note: 'Publish this after today’s pricing copy review.',
        },
      ],
    },
    {
      id: 'rec-kannai-post',
      storeId: 'store-kannai',
      title: 'Prepare GBP post for weekend private party demand',
      summary:
        'Search volume for weekend private party and premium group seating is rising. A short GBP post can capture map impressions quickly.',
      kind: 'gbp_post',
      targetSystem: 'gbp',
      sourceSignal: 'Weekend intent spike + competitor post freshness',
      reason:
        'Competitors published three updates this week while this profile has been quiet for 12 days.',
      expectedImpactLabel: 'low',
      expectedImpactValue: '+5% impression freshness boost',
      priority: 67,
      workflowStatus: 'pending_approval',
      suggestedAt: hoursAgo(6),
      destinationLabel: 'GBP posts / promotion update',
      notes: [
        'Short, elegant copy performs better than a long promotional block.',
      ],
      diffBlocks: [
        {
          id: 'diff-kannai-post-1',
          label: 'GBP post draft',
          before: 'No new post is scheduled for the coming weekend.',
          after:
            '週末のご会食や少人数でのご利用に向けて、落ち着いたお席のご案内を整えています。初めてのお客様もご希望に合わせてご案内いたします。',
        },
      ],
      approvalHistory: [],
    },
  ],
  executions: [
    {
      id: 'exec-sol-copy-failed',
      recommendationId: 'rec-sol-copy',
      storeId: 'store-bashamichi',
      targetSystem: 'cms',
      status: 'failed',
      startedAt: hoursAgo(10),
      completedAt: hoursAgo(10),
      publishedSummary: 'CMS intro update queued for publish',
      errorMessage: 'CMS token expired before publish confirmation.',
    },
    {
      id: 'exec-kannai-geo-complete',
      recommendationId: 'rec-kannai-faq',
      storeId: 'store-kannai',
      targetSystem: 'cms',
      status: 'completed',
      startedAt: hoursAgo(28),
      completedAt: hoursAgo(27),
      publishedSummary: 'FAQ block about access and first reservation published.',
    },
  ],
  metrics: [
    {
      id: 'metric-kannai',
      storeId: 'store-kannai',
      periodLabel: 'Last 14 days',
      searchVisibility: 71,
      mapDiscovery: 66,
      aiReadiness: 58,
      executedCount: 6,
      approvalSLAHours: 4.3,
    },
    {
      id: 'metric-sol',
      storeId: 'store-bashamichi',
      periodLabel: 'Last 14 days',
      searchVisibility: 64,
      mapDiscovery: 61,
      aiReadiness: 54,
      executedCount: 4,
      approvalSLAHours: 5.1,
    },
  ],
  notifications: [
    {
      id: 'notif-review-backlog',
      storeId: 'store-kannai',
      type: 'approval',
      title: 'Approval needed: review reply',
      body: 'Two high-intent reviews are waiting for approval before publishing.',
      href: '/growth-agent/recommendations/rec-kannai-review',
      createdAt: minutesAgo(12),
      read: false,
    },
    {
      id: 'notif-cms-expiry',
      storeId: 'store-bashamichi',
      type: 'anomaly',
      title: 'CMS connection needs attention',
      body: 'Bashamichi Club Sol publish token expires soon and already blocked one execution.',
      href: '/growth-agent/stores',
      createdAt: hoursAgo(9),
      read: false,
    },
    {
      id: 'notif-faq-published',
      storeId: 'store-kannai',
      type: 'execution',
      title: 'FAQ publish completed',
      body: 'A new FAQ answer for beginner reservations was published successfully.',
      href: '/growth-agent/history',
      createdAt: hoursAgo(27),
      read: true,
    },
  ],
};

export function getGrowthAgentSeed(): GrowthAgentSnapshot {
  return structuredClone(growthAgentSeed);
}
