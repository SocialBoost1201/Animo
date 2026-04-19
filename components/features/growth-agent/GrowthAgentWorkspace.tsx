'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bot,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  Globe,
  MapPinned,
  RefreshCcw,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  WandSparkles,
  XCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

import { PushNotificationCard } from '@/components/features/growth-agent/PushNotificationCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type {
  GrowthAgentExecutionRecord,
  GrowthAgentMetricSnapshot,
  GrowthAgentNotification,
  GrowthAgentRecommendation,
  GrowthAgentSnapshot,
  GrowthAgentStore,
} from '@/lib/growth-agent/types';

type GrowthAgentView = 'dashboard' | 'stores' | 'history' | 'notifications';
type SnapshotState = GrowthAgentSnapshot;

const STORAGE_KEY = 'growth-agent-mvp-state-v1';

type ViewProps = {
  initialSnapshot: GrowthAgentSnapshot;
  activeView: GrowthAgentView;
  initialRecommendationId?: string;
};

function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

function findLatestMetric(
  metrics: GrowthAgentMetricSnapshot[],
  storeId: string
): GrowthAgentMetricSnapshot | undefined {
  return metrics.find((metric) => metric.storeId === storeId);
}

function recommendationStatusTone(
  status: GrowthAgentRecommendation['workflowStatus']
): string {
  switch (status) {
    case 'pending_approval':
      return 'bg-amber-50 text-amber-700';
    case 'approved':
      return 'bg-emerald-50 text-emerald-700';
    case 'rejected':
      return 'bg-zinc-100 text-zinc-600';
    case 'publishing':
      return 'bg-sky-50 text-sky-700';
    case 'published':
      return 'bg-emerald-50 text-emerald-700';
    case 'failed':
      return 'bg-red-50 text-red-700';
  }
}

function recommendationStatusLabel(
  status: GrowthAgentRecommendation['workflowStatus']
): string {
  switch (status) {
    case 'pending_approval':
      return 'Approval needed';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'publishing':
      return 'Publishing';
    case 'published':
      return 'Published';
    case 'failed':
      return 'Failed';
  }
}

function executionTone(status: GrowthAgentExecutionRecord['status']): string {
  switch (status) {
    case 'queued':
      return 'bg-sky-50 text-sky-700';
    case 'completed':
      return 'bg-emerald-50 text-emerald-700';
    case 'failed':
      return 'bg-red-50 text-red-700';
  }
}

function notificationTone(type: GrowthAgentNotification['type']): string {
  switch (type) {
    case 'approval':
      return 'bg-amber-50 text-amber-700';
    case 'anomaly':
      return 'bg-red-50 text-red-700';
    case 'execution':
      return 'bg-emerald-50 text-emerald-700';
  }
}

function loadInitialSnapshot(initialSnapshot: GrowthAgentSnapshot): SnapshotState {
  if (typeof window === 'undefined') {
    return initialSnapshot;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return initialSnapshot;
  }

  try {
    return JSON.parse(stored) as SnapshotState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return initialSnapshot;
  }
}

function deriveInitialSelection(
  snapshot: SnapshotState,
  recommendationId?: string
): { storeId: string; recommendationId: string | null } {
  const targetedRecommendation = recommendationId
    ? snapshot.recommendations.find((item) => item.id === recommendationId)
    : undefined;

  if (targetedRecommendation) {
    return {
      storeId: targetedRecommendation.storeId,
      recommendationId: targetedRecommendation.id,
    };
  }

  const storeId = snapshot.business.defaultStoreId;
  const firstRecommendation =
    snapshot.recommendations
      .filter((item) => item.storeId === storeId)
      .sort((left, right) => right.priority - left.priority)[0] ?? null;

  return {
    storeId,
    recommendationId: firstRecommendation?.id ?? null,
  };
}

export function GrowthAgentWorkspace({
  initialSnapshot,
  activeView,
  initialRecommendationId,
}: ViewProps) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<SnapshotState>(() =>
    loadInitialSnapshot(initialSnapshot)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const initialSelection = deriveInitialSelection(
    loadInitialSnapshot(initialSnapshot),
    initialRecommendationId
  );
  const [selectedStoreId, setSelectedStoreId] = useState(initialSelection.storeId);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string | null>(
    initialSelection.recommendationId
  );
  const [draftOverrides, setDraftOverrides] = useState<Record<string, string>>({});

  const deferredQuery = useDeferredValue(searchQuery);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  }, [snapshot]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSnapshot((currentSnapshot) => {
        const queuedExecutions = currentSnapshot.executions.filter(
          (execution) => execution.status === 'queued'
        );

        if (queuedExecutions.length === 0) {
          return currentSnapshot;
        }

        const completedAt = new Date().toISOString();
        const nextRecommendations = currentSnapshot.recommendations.map(
          (recommendation) => {
            const relatedExecution = queuedExecutions.find(
              (execution) => execution.recommendationId === recommendation.id
            );

            if (!relatedExecution) {
              return recommendation;
            }

            return {
              ...recommendation,
              workflowStatus: 'published' as const,
            };
          }
        );

        const nextExecutions = currentSnapshot.executions.map((execution) => {
          if (execution.status !== 'queued') {
            return execution;
          }

          return {
            ...execution,
            status: 'completed' as const,
            completedAt,
          };
        });

        return {
          ...currentSnapshot,
          recommendations: nextRecommendations,
          executions: nextExecutions,
          notifications: [
            {
              id: `notif-${completedAt}`,
              type: 'execution' as const,
              title: 'Execution finished',
              body: 'An approved recommendation completed publishing successfully.',
              href: '/growth-agent/history',
              createdAt: completedAt,
              read: false,
            },
            ...currentSnapshot.notifications,
          ],
        };
      });
    }, 1100);

    return () => window.clearTimeout(timer);
  }, [snapshot.executions]);

  const selectedStore =
    snapshot.stores.find((store) => store.id === selectedStoreId) ?? snapshot.stores[0];

  const storeRecommendations = useMemo(
    () =>
      snapshot.recommendations
        .filter((recommendation) => recommendation.storeId === selectedStore.id)
        .sort((left, right) => right.priority - left.priority),
    [selectedStore.id, snapshot.recommendations]
  );

  const filteredRecommendations = useMemo(() => {
    const query = deferredQuery.trim().toLowerCase();

    if (!query) {
      return storeRecommendations;
    }

    return storeRecommendations.filter((recommendation) =>
      [
        recommendation.title,
        recommendation.summary,
        recommendation.reason,
        recommendation.sourceSignal,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [deferredQuery, storeRecommendations]);

  const selectedRecommendation =
    snapshot.recommendations.find(
      (recommendation) => recommendation.id === selectedRecommendationId
    ) ??
    filteredRecommendations[0] ??
    null;

  const pendingCount = snapshot.recommendations.filter(
    (recommendation) => recommendation.workflowStatus === 'pending_approval'
  ).length;
  const failedCount = snapshot.executions.filter(
    (execution) => execution.status === 'failed'
  ).length;
  const currentMetric = findLatestMetric(snapshot.metrics, selectedStore.id);
  const selectedQueueDraft =
    selectedRecommendation?.diffBlocks[0]?.after ?? '';
  const selectedDraftValue =
    selectedRecommendation ? draftOverrides[selectedRecommendation.id] ?? selectedQueueDraft : '';

  const completenessItems = [
    {
      label: 'Business profile',
      value:
        selectedStore.connections.filter((connection) => connection.status === 'connected')
          .length * 25,
    },
    {
      label: 'Review coverage',
      value: Math.min(92, 58 + pendingCount * 7),
    },
    {
      label: 'GEO answers',
      value: currentMetric?.aiReadiness ?? 0,
    },
    {
      label: 'Competitive freshness',
      value: Math.max(48, 82 - failedCount * 6),
    },
  ];

  function updateRecommendation(
    recommendationId: string,
    updater: (recommendation: GrowthAgentRecommendation) => GrowthAgentRecommendation
  ) {
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      recommendations: currentSnapshot.recommendations.map((recommendation) =>
        recommendation.id === recommendationId ? updater(recommendation) : recommendation
      ),
    }));
  }

  function pushExecution(execution: GrowthAgentExecutionRecord) {
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      executions: [execution, ...currentSnapshot.executions],
    }));
  }

  function pushNotification(notification: GrowthAgentNotification) {
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      notifications: [notification, ...currentSnapshot.notifications],
    }));
  }

  function selectRecommendation(recommendationId: string) {
    startTransition(() => {
      setSelectedRecommendationId(recommendationId);
      router.push(`/growth-agent/recommendations/${recommendationId}`);
    });
  }

  function handleApprove(recommendation: GrowthAgentRecommendation, edited = false) {
    const timestamp = new Date().toISOString();
    const draftOverride = draftOverrides[recommendation.id];

    updateRecommendation(recommendation.id, (current) => ({
      ...current,
      workflowStatus: 'publishing',
      diffBlocks: current.diffBlocks.map((block, index) =>
        index === 0 && draftOverride
          ? {
              ...block,
              after: draftOverride,
            }
          : block
      ),
      approvalHistory: [
        {
          id: `approval-${timestamp}`,
          recommendationId: current.id,
          action: edited ? 'edited_and_approved' : 'approved',
          actorName: snapshot.business.ownerName,
          at: timestamp,
        },
        ...current.approvalHistory,
      ],
    }));

    pushExecution({
      id: `exec-${timestamp}`,
      recommendationId: recommendation.id,
      storeId: recommendation.storeId,
      targetSystem: recommendation.targetSystem,
      status: 'queued',
      startedAt: timestamp,
      publishedSummary: edited
        ? 'Edited recommendation approved and queued for publish.'
        : 'Recommendation approved and queued for publish.',
    });

    pushNotification({
      id: `notif-approval-${timestamp}`,
      storeId: recommendation.storeId,
      type: 'execution',
      title: edited ? 'Edited recommendation approved' : 'Recommendation approved',
      body: `${recommendation.title} moved into the publish queue.`,
      href: '/growth-agent/history',
      createdAt: timestamp,
      read: false,
    });

    toast.success(edited ? 'Edited draft approved and queued.' : 'Recommendation approved and queued.');
  }

  function handleReject(recommendation: GrowthAgentRecommendation) {
    const timestamp = new Date().toISOString();

    updateRecommendation(recommendation.id, (current) => ({
      ...current,
      workflowStatus: 'rejected',
      approvalHistory: [
        {
          id: `rejection-${timestamp}`,
          recommendationId: current.id,
          action: 'rejected',
          actorName: snapshot.business.ownerName,
          at: timestamp,
        },
        ...current.approvalHistory,
      ],
    }));

    pushNotification({
      id: `notif-reject-${timestamp}`,
      storeId: recommendation.storeId,
      type: 'approval',
      title: 'Recommendation rejected',
      body: `${recommendation.title} was rejected and removed from the immediate queue.`,
      href: '/growth-agent',
      createdAt: timestamp,
      read: false,
    });

    toast.success('Recommendation rejected.');
  }

  function handleRetry(recommendation: GrowthAgentRecommendation) {
    const timestamp = new Date().toISOString();

    updateRecommendation(recommendation.id, (current) => ({
      ...current,
      workflowStatus: 'publishing',
      approvalHistory: [
        {
          id: `retry-${timestamp}`,
          recommendationId: current.id,
          action: 'retry_requested',
          actorName: snapshot.business.ownerName,
          at: timestamp,
          note: 'Retry after reconnecting CMS.',
        },
        ...current.approvalHistory,
      ],
    }));

    pushExecution({
      id: `retry-exec-${timestamp}`,
      recommendationId: recommendation.id,
      storeId: recommendation.storeId,
      targetSystem: recommendation.targetSystem,
      status: 'queued',
      startedAt: timestamp,
      publishedSummary: 'Retry publish queued after operator confirmation.',
    });

    toast.success('Retry queued.');
  }

  function markAllNotificationsRead() {
    setSnapshot((currentSnapshot) => ({
      ...currentSnapshot,
      notifications: currentSnapshot.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
    toast.success('All in-app alerts marked as read.');
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[26px] border border-[#e6e8ef] bg-white px-4 py-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.22)] md:px-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b8a]">
              Advanced Reports
            </p>
            <h2 className="mt-1 text-[clamp(1.4rem,2.6vw,2rem)] font-semibold tracking-[-0.04em] text-[#1b2335]">
              Search operations overview
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#687588]">
              Review SEO, MEO, and GEO performance, compare connected stores, and move directly into approval actions from the right-side queue.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex items-center gap-2 rounded-[14px] border border-[#e6e8ef] bg-[#f8faff] px-3 py-3 text-sm text-[#5d6b7f]">
              <CalendarRange className="size-4 text-[#4f6bc7]" />
              02/03/2024 - 09/03/2024
            </div>
            <div className="flex items-center gap-2 rounded-[14px] border border-[#e6e8ef] bg-[#f8faff] px-3 py-3 text-sm text-[#5d6b7f]">
              <Store className="size-4 text-[#4f6bc7]" />
              {selectedStore.name}
            </div>
            <Button className="h-12 rounded-[14px] bg-[#1c2536] px-4 text-white hover:bg-[#131b2a]">
              <Sparkles className="size-4" />
              Export summary
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <DashboardFilterBar
            businessName={snapshot.business.name}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stores={snapshot.stores}
            selectedStoreId={selectedStoreId}
            onStoreSelect={(storeId) => {
              setSelectedStoreId(storeId);
              const nextRecommendation = snapshot.recommendations
                .filter((recommendation) => recommendation.storeId === storeId)
                .sort((left, right) => right.priority - left.priority)[0];

              if (nextRecommendation) {
                setSelectedRecommendationId(nextRecommendation.id);
              }
            }}
          />

          {activeView === 'dashboard' ? (
            <>
              <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <SummaryMetricCard
                  label="Search visibility"
                  value={`${currentMetric?.searchVisibility ?? 0}/100`}
                  helper="Overall organic and local discovery"
                  tone="indigo"
                  icon={Globe}
                />
                <SummaryMetricCard
                  label="Map discovery"
                  value={`${currentMetric?.mapDiscovery ?? 0}/100`}
                  helper="Profile views, calls, and direction taps"
                  tone="emerald"
                  icon={MapPinned}
                />
                <SummaryMetricCard
                  label="AI readiness"
                  value={`${currentMetric?.aiReadiness ?? 0}/100`}
                  helper="Generative answer coverage"
                  tone="violet"
                  icon={Bot}
                />
                <SummaryMetricCard
                  label="Approval SLA"
                  value={`${currentMetric?.approvalSLAHours ?? 0}h`}
                  helper="Average time to owner approval"
                  tone="amber"
                  icon={Clock3}
                />
              </section>

              <section className="grid gap-4 xl:grid-cols-2">
                <ProgressBreakdownCard
                  title="Overall status breakdown"
                  value={currentMetric?.searchVisibility ?? 0}
                  helper="Search exposure score"
                  items={[
                    { label: 'Open opportunities', value: pendingCount, tone: 'bg-[#4f6bc7]' },
                    { label: 'Published this period', value: currentMetric?.executedCount ?? 0, tone: 'bg-[#54b399]' },
                    { label: 'Retry needed', value: failedCount, tone: 'bg-[#f28c3b]' },
                  ]}
                />
                <CompletenessCard items={completenessItems} />
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <RecommendationTableCard
                  recommendations={filteredRecommendations}
                  selectedRecommendationId={selectedRecommendation?.id ?? null}
                  onSelect={selectRecommendation}
                />
                <div className="space-y-4">
                  <ConnectionReportCard store={selectedStore} />
                  <SignalDigestCard
                    notifications={snapshot.notifications.slice(0, 4)}
                    executions={snapshot.executions.slice(0, 4)}
                  />
                </div>
              </section>

              <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <StoreComparisonCard
                  stores={snapshot.stores}
                  metrics={snapshot.metrics}
                  selectedStoreId={selectedStore.id}
                />
                <PushNotificationCard />
              </section>
            </>
          ) : null}

          {activeView === 'stores' ? (
            <StoresReportView
              stores={snapshot.stores}
              metrics={snapshot.metrics}
              recommendations={snapshot.recommendations}
            />
          ) : null}

          {activeView === 'history' ? (
            <HistoryReportView
              executions={snapshot.executions}
              recommendations={snapshot.recommendations}
              stores={snapshot.stores}
            />
          ) : null}

          {activeView === 'notifications' ? (
            <NotificationsReportView
              notifications={snapshot.notifications}
              onMarkAllRead={markAllNotificationsRead}
            />
          ) : null}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[104px] xl:h-[calc(100vh-8.5rem)] xl:overflow-y-auto xl:pr-1">
          <details className="rounded-[22px] border border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.22)] xl:hidden" open>
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-4 text-sm font-semibold text-[#1f2738]">
              Approval queue
              <span className="rounded-full bg-[#eff3ff] px-2.5 py-1 text-xs text-[#4f6bc7]">
                {filteredRecommendations.length}
              </span>
            </summary>
            <div className="border-t border-[#eef1f5] px-4 py-4">
              <ApprovalQueueCard
                recommendations={filteredRecommendations}
                selectedRecommendationId={selectedRecommendation?.id ?? null}
                onSelect={selectRecommendation}
              />
            </div>
          </details>

          <div className="hidden xl:block">
            <ApprovalQueueCard
              recommendations={filteredRecommendations}
              selectedRecommendationId={selectedRecommendation?.id ?? null}
              onSelect={selectRecommendation}
            />
          </div>

          {selectedRecommendation ? (
            <RecommendationReviewPanel
              recommendation={selectedRecommendation}
              store={selectedStore}
              draftValue={selectedDraftValue}
              onDraftChange={(value) =>
                setDraftOverrides((current) => ({
                  ...current,
                  [selectedRecommendation.id]: value,
                }))
              }
              onApprove={() => handleApprove(selectedRecommendation)}
              onEditApprove={() => handleApprove(selectedRecommendation, true)}
              onReject={() => handleReject(selectedRecommendation)}
              onRetry={() => handleRetry(selectedRecommendation)}
            />
          ) : null}
        </aside>
      </section>
    </div>
  );
}

function DashboardFilterBar({
  businessName,
  searchQuery,
  setSearchQuery,
  stores,
  selectedStoreId,
  onStoreSelect,
}: {
  businessName: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  stores: GrowthAgentStore[];
  selectedStoreId: string;
  onStoreSelect: (storeId: string) => void;
}) {
  return (
    <section className="rounded-[22px] border border-[#e6e8ef] bg-white px-4 py-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b8a]">
              Workspace
            </p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-[#1b2335]">
              {businessName}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:items-center">
            <label className="flex h-12 items-center gap-2 rounded-[14px] border border-[#e6e8ef] bg-[#fbfcfe] px-3 text-sm text-[#607086]">
              <Search className="size-4 text-[#72839d]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search recommendations"
                className="w-full bg-transparent outline-none placeholder:text-[#9aa7b9]"
              />
            </label>

            <div className="flex items-center gap-2 rounded-[14px] border border-[#e6e8ef] bg-[#fbfcfe] px-3 py-3 text-sm text-[#607086]">
              <Filter className="size-4 text-[#72839d]" />
              All signals
            </div>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
          {stores.map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() => onStoreSelect(store.id)}
              className={cn(
                'min-h-12 rounded-[14px] border px-3 py-3 text-left transition-all',
                selectedStoreId === store.id
                  ? 'border-[#4f6bc7] bg-[#eef3ff] text-[#2342a4]'
                  : 'border-[#e6e8ef] bg-[#fbfcfe] text-[#5f6d82] hover:border-[#ccd5e3]'
              )}
            >
              <p className="text-sm font-semibold">{store.name}</p>
              <p className="mt-1 text-xs">{store.city} · {store.segment}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryMetricCard({
  label,
  value,
  helper,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  helper: string;
  tone: 'indigo' | 'emerald' | 'violet' | 'amber';
  icon: React.ComponentType<{ className?: string }>;
}) {
  const toneClass = {
    indigo: 'bg-[#eef3ff] text-[#3156c9]',
    emerald: 'bg-[#ecf9f3] text-[#2b9a68]',
    violet: 'bg-[#f0efff] text-[#7358d6]',
    amber: 'bg-[#fff3e8] text-[#df8a3b]',
  }[tone];

  return (
    <div className="rounded-[22px] border border-[#e6e8ef] bg-white p-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <div className="flex items-center justify-between">
        <div className={cn('flex size-10 items-center justify-center rounded-[14px]', toneClass)}>
          <Icon className="size-4.5" />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b96a8]">
          KPI
        </span>
      </div>
      <p className="mt-4 text-sm font-medium text-[#5f6d82]">{label}</p>
      <p className="mt-1 text-[clamp(1.55rem,2.2vw,2rem)] font-semibold tracking-[-0.04em] text-[#1b2335]">
        {value}
      </p>
      <p className="mt-1 text-sm leading-6 text-[#8490a3]">{helper}</p>
    </div>
  );
}

function ProgressBreakdownCard({
  title,
  value,
  helper,
  items,
}: {
  title: string;
  value: number;
  helper: string;
  items: Array<{ label: string; value: number; tone: string }>;
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 pt-5 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center justify-center">
          <div className="flex size-36 flex-col items-center justify-center rounded-full border-[14px] border-[#eef3ff] bg-[#fbfcfe] text-center">
            <p className="text-[2rem] font-semibold tracking-[-0.05em] text-[#1b2335]">
              {value}
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-[#7e8ca2]">
              Score
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-sm text-[#8490a3]">{helper}</p>
          {items.map((item) => (
            <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[#1f2738]">{item.label}</span>
                  <span className="text-[#6d7c91]">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-[#eff2f6]">
                  <div
                    className={cn('h-2 rounded-full', item.tone)}
                    style={{ width: `${Math.max(8, Math.min(100, item.value * 10))}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CompletenessCard({
  items,
}: {
  items: Array<{ label: string; value: number }>;
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
          Location completeness
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {items.map((item) => (
          <div key={item.label} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-[#1f2738]">{item.label}</span>
                <span className="text-[#6d7c91]">{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#eff2f6]">
                <div
                  className="h-2 rounded-full bg-[#6f86dc]"
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function RecommendationTableCard({
  recommendations,
  selectedRecommendationId,
  onSelect,
}: {
  recommendations: GrowthAgentRecommendation[];
  selectedRecommendationId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b8a]">
              Recommendation dataset
            </p>
            <CardTitle className="mt-1 text-lg tracking-[-0.03em] text-[#1b2335]">
              Actionable improvements
            </CardTitle>
          </div>
          <div className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#4f6bc7]">
            {recommendations.length} rows
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto pt-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#eef1f5] text-xs uppercase tracking-[0.18em] text-[#8794a7]">
              <th className="px-0 py-3 pr-3 font-semibold">Recommendation</th>
              <th className="py-3 pr-3 font-semibold">Target</th>
              <th className="py-3 pr-3 font-semibold">Impact</th>
              <th className="py-3 pr-3 font-semibold">Status</th>
              <th className="py-3 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((recommendation) => {
              const selected = recommendation.id === selectedRecommendationId;

              return (
                <tr
                  key={recommendation.id}
                  className={cn(
                    'cursor-pointer border-b border-[#f1f3f7] transition-colors hover:bg-[#fafcff]',
                    selected && 'bg-[#f5f8ff]'
                  )}
                  onClick={() => onSelect(recommendation.id)}
                >
                  <td className="px-0 py-4 pr-3 align-top">
                    <div className="min-w-[220px]">
                      <p className="font-semibold text-[#1f2738]">{recommendation.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#7b889b]">
                        {recommendation.summary}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 pr-3 align-top">
                    <span className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-xs font-medium text-[#4663c2]">
                      {recommendation.targetSystem.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 pr-3 align-top text-[#445066]">
                    <div className="space-y-1">
                      <p className="font-medium">{recommendation.expectedImpactValue}</p>
                      <p className="text-xs text-[#8a96a9]">Priority {recommendation.priority}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-3 align-top">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        recommendationStatusTone(recommendation.workflowStatus)
                      )}
                    >
                      {recommendationStatusLabel(recommendation.workflowStatus)}
                    </span>
                  </td>
                  <td className="py-4 align-top text-xs text-[#8a96a9]">
                    {relativeTime(recommendation.suggestedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function ConnectionReportCard({ store }: { store: GrowthAgentStore }) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
          Sync status breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {store.connections.map((connection) => (
          <div key={connection.id} className="flex items-start justify-between gap-3 rounded-[16px] bg-[#fbfcfe] px-4 py-3">
            <div className="min-w-0">
              <p className="font-medium text-[#1f2738]">{connection.name}</p>
              <p className="mt-1 text-xs leading-5 text-[#8290a4]">{connection.detail}</p>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                connection.status === 'connected'
                  ? 'bg-emerald-50 text-emerald-700'
                  : connection.status === 'syncing'
                  ? 'bg-sky-50 text-sky-700'
                  : 'bg-red-50 text-red-700'
              )}
            >
              {connection.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SignalDigestCard({
  notifications,
  executions,
}: {
  notifications: GrowthAgentNotification[];
  executions: GrowthAgentExecutionRecord[];
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
          Recent signal digest
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {notifications.map((notification) => (
          <div key={notification.id} className="rounded-[16px] bg-[#fbfcfe] px-4 py-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-xs font-semibold',
                  notificationTone(notification.type)
                )}
              >
                {notification.type}
              </span>
              <span className="text-xs text-[#8b96a8]">{relativeTime(notification.createdAt)}</span>
            </div>
            <p className="mt-2 font-medium text-[#1f2738]">{notification.title}</p>
            <p className="mt-1 text-xs leading-5 text-[#7f8ca0]">{notification.body}</p>
          </div>
        ))}
        {executions.length > 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#d9dfeb] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[#8794a7]">Latest execution</p>
            <p className="mt-2 font-medium text-[#1f2738]">{executions[0]?.publishedSummary}</p>
            <p className="mt-1 text-xs text-[#8b96a8]">{relativeTime(executions[0]?.startedAt ?? new Date().toISOString())}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function StoreComparisonCard({
  stores,
  metrics,
  selectedStoreId,
}: {
  stores: GrowthAgentStore[];
  metrics: GrowthAgentMetricSnapshot[];
  selectedStoreId: string;
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
          Store comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {stores.map((store) => {
          const metric = findLatestMetric(metrics, store.id);
          return (
            <div
              key={store.id}
              className={cn(
                'rounded-[16px] px-4 py-3',
                store.id === selectedStoreId ? 'bg-[#eef3ff]' : 'bg-[#fbfcfe]'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-[#1f2738]">{store.name}</p>
                  <p className="mt-1 text-xs text-[#7f8ca0]">{store.city} · {store.segment}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <MetricChip label="Search" value={metric?.searchVisibility ?? 0} />
                  <MetricChip label="Map" value={metric?.mapDiscovery ?? 0} />
                  <MetricChip label="AI" value={metric?.aiReadiness ?? 0} />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function MetricChip({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[12px] bg-white px-2 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#8a96a9]">{label}</p>
      <p className="mt-1 font-semibold text-[#1f2738]">{value}</p>
    </div>
  );
}

function ApprovalQueueCard({
  recommendations,
  selectedRecommendationId,
  onSelect,
}: {
  recommendations: GrowthAgentRecommendation[];
  selectedRecommendationId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.22)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5b6b8a]">
              Approval queue
            </p>
            <CardTitle className="mt-1 text-lg tracking-[-0.03em] text-[#1b2335]">
              Review required
            </CardTitle>
          </div>
          <div className="rounded-full bg-[#eef3ff] px-3 py-1 text-xs font-semibold text-[#4f6bc7]">
            {recommendations.length}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        {recommendations.map((recommendation) => {
          const selected = recommendation.id === selectedRecommendationId;
          return (
            <button
              key={recommendation.id}
              type="button"
              onClick={() => onSelect(recommendation.id)}
              className={cn(
                'w-full rounded-[16px] border px-4 py-3 text-left transition-all',
                selected
                  ? 'border-[#4f6bc7] bg-[#f4f7ff]'
                  : 'border-[#edf0f5] bg-[#fbfcfe] hover:border-[#d6ddea]'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={cn(
                    'rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    recommendationStatusTone(recommendation.workflowStatus)
                  )}
                >
                  {recommendationStatusLabel(recommendation.workflowStatus)}
                </span>
                <span className="text-xs font-medium text-[#7d8a9d]">
                  P{recommendation.priority}
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm font-semibold text-[#1f2738]">
                {recommendation.title}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#7f8ca0]">
                <span>{recommendation.targetSystem.toUpperCase()}</span>
                <span>{relativeTime(recommendation.suggestedAt)}</span>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function RecommendationReviewPanel({
  recommendation,
  store,
  draftValue,
  onDraftChange,
  onApprove,
  onEditApprove,
  onReject,
  onRetry,
}: {
  recommendation: GrowthAgentRecommendation;
  store: GrowthAgentStore;
  draftValue: string;
  onDraftChange: (value: string) => void;
  onApprove: () => void;
  onEditApprove: () => void;
  onReject: () => void;
  onRetry: () => void;
}) {
  const canApprove = recommendation.workflowStatus === 'pending_approval';
  const canRetry = recommendation.workflowStatus === 'failed';

  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.22)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                recommendationStatusTone(recommendation.workflowStatus)
              )}
            >
              {recommendationStatusLabel(recommendation.workflowStatus)}
            </span>
            <span className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-xs font-medium text-[#4f6bc7]">
              {recommendation.targetSystem.toUpperCase()}
            </span>
            <span className="rounded-full bg-[#f1f4f8] px-2.5 py-1 text-xs font-medium text-[#627086]">
              {store.name}
            </span>
          </div>
          <div>
            <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
              {recommendation.title}
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-[#6e7b8f]">
              {recommendation.summary}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-5">
        <ReviewMetaRow label="Reason" value={recommendation.reason} icon={WandSparkles} />
        <ReviewMetaRow
          label="Expected impact"
          value={recommendation.expectedImpactValue}
          icon={TrendingUp}
        />

        {recommendation.diffBlocks[0] ? (
          <div className="space-y-3 rounded-[18px] bg-[#fbfcfe] p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8794a7]">
                  Before
                </p>
                <p className="mt-2 rounded-[14px] border border-[#e8edf4] bg-white px-3 py-3 text-sm leading-6 text-[#6a7688]">
                  {recommendation.diffBlocks[0].before}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8794a7]">
                  After
                </p>
                <textarea
                  value={draftValue}
                  onChange={(event) => onDraftChange(event.target.value)}
                  className="mt-2 min-h-[152px] w-full rounded-[14px] border border-[#d9e1ee] bg-white px-3 py-3 text-sm leading-6 text-[#1f2738] outline-none transition focus:border-[#4f6bc7]"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          {recommendation.notes.map((note) => (
            <div
              key={note}
              className="rounded-[14px] border border-[#eef1f5] bg-[#fbfcfe] px-3 py-3 text-sm text-[#677588]"
            >
              {note}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-[#1f2738]">Owner actions</p>
          <div className="flex flex-wrap gap-2">
            {canApprove ? (
              <>
                <Button
                  variant="outline"
                  onClick={onReject}
                  className="h-12 rounded-[14px] border-[#d8dfeb] bg-white hover:bg-[#f6f8fc]"
                >
                  <XCircle className="size-4" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={onEditApprove}
                  className="h-12 rounded-[14px] border-[#d8dfeb] bg-white hover:bg-[#f6f8fc]"
                >
                  <Sparkles className="size-4" />
                  Edit then approve
                </Button>
                <Button
                  onClick={onApprove}
                  className="h-12 rounded-[14px] bg-[#1c2536] text-white hover:bg-[#131b2a]"
                >
                  <CheckCircle2 className="size-4" />
                  Approve
                </Button>
              </>
            ) : null}

            {canRetry ? (
              <Button
                onClick={onRetry}
                className="h-12 rounded-[14px] bg-[#1c2536] text-white hover:bg-[#131b2a]"
              >
                <RefreshCcw className="size-4" />
                Retry failed publish
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 border-t border-[#eef1f5] pt-4">
          <p className="text-sm font-semibold text-[#1f2738]">Approval history</p>
          {recommendation.approvalHistory.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-[#d9e1ee] px-3 py-3 text-sm text-[#7d8a9d]">
              No approval action has been taken yet.
            </div>
          ) : (
            recommendation.approvalHistory.map((item) => (
              <div key={item.id} className="rounded-[14px] bg-[#fbfcfe] px-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#1f2738]">{item.action}</p>
                    <p className="text-xs text-[#7d8a9d]">
                      {item.actorName}
                      {item.note ? ` · ${item.note}` : ''}
                    </p>
                  </div>
                  <p className="text-xs text-[#7d8a9d]">{relativeTime(item.at)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ReviewMetaRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[14px] border border-[#eef1f5] bg-[#fbfcfe] px-3 py-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7c89a0]">
        <Icon className="size-4 text-[#4f6bc7]" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-[#5f6d82]">{value}</p>
    </div>
  );
}

function StoresReportView({
  stores,
  metrics,
  recommendations,
}: {
  stores: GrowthAgentStore[];
  metrics: GrowthAgentMetricSnapshot[];
  recommendations: GrowthAgentRecommendation[];
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
          Store health report
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pt-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#eef1f5] text-xs uppercase tracking-[0.18em] text-[#8794a7]">
              <th className="px-0 py-3 pr-3 font-semibold">Store</th>
              <th className="py-3 pr-3 font-semibold">Connections</th>
              <th className="py-3 pr-3 font-semibold">Search</th>
              <th className="py-3 pr-3 font-semibold">Map</th>
              <th className="py-3 pr-3 font-semibold">AI</th>
              <th className="py-3 pr-3 font-semibold">Pending</th>
              <th className="py-3 font-semibold">Site</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => {
              const metric = findLatestMetric(metrics, store.id);
              const pending = recommendations.filter(
                (recommendation) =>
                  recommendation.storeId === store.id &&
                  recommendation.workflowStatus === 'pending_approval'
              ).length;

              return (
                <tr key={store.id} className="border-b border-[#f1f3f7]">
                  <td className="px-0 py-4 pr-3">
                    <div>
                      <p className="font-semibold text-[#1f2738]">{store.name}</p>
                      <p className="mt-1 text-xs text-[#7f8ca0]">{store.city} · {store.segment}</p>
                    </div>
                  </td>
                  <td className="py-4 pr-3 text-[#5f6d82]">
                    {store.connections.filter((connection) => connection.status === 'connected').length}/
                    {store.connections.length}
                  </td>
                  <td className="py-4 pr-3 text-[#5f6d82]">{metric?.searchVisibility ?? 0}</td>
                  <td className="py-4 pr-3 text-[#5f6d82]">{metric?.mapDiscovery ?? 0}</td>
                  <td className="py-4 pr-3 text-[#5f6d82]">{metric?.aiReadiness ?? 0}</td>
                  <td className="py-4 pr-3">
                    <span className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-xs font-semibold text-[#4f6bc7]">
                      {pending}
                    </span>
                  </td>
                  <td className="py-4">
                    <Link
                      href={store.websiteUrl}
                      className="inline-flex items-center gap-1 text-[#4f6bc7] hover:underline"
                    >
                      Open
                      <ArrowUpRight className="size-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function HistoryReportView({
  executions,
  recommendations,
  stores,
}: {
  executions: GrowthAgentExecutionRecord[];
  recommendations: GrowthAgentRecommendation[];
  stores: GrowthAgentStore[];
}) {
  return (
    <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
      <CardHeader className="border-b border-[#eef1f5] pb-4">
        <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
          Execution audit report
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto pt-0">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#eef1f5] text-xs uppercase tracking-[0.18em] text-[#8794a7]">
              <th className="px-0 py-3 pr-3 font-semibold">Recommendation</th>
              <th className="py-3 pr-3 font-semibold">Store</th>
              <th className="py-3 pr-3 font-semibold">Target</th>
              <th className="py-3 pr-3 font-semibold">Status</th>
              <th className="py-3 pr-3 font-semibold">Started</th>
              <th className="py-3 font-semibold">Result</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((execution) => {
              const recommendation = recommendations.find(
                (item) => item.id === execution.recommendationId
              );
              const store = stores.find((item) => item.id === execution.storeId);

              return (
                <tr key={execution.id} className="border-b border-[#f1f3f7]">
                  <td className="px-0 py-4 pr-3">
                    <p className="font-semibold text-[#1f2738]">
                      {recommendation?.title ?? 'Unknown recommendation'}
                    </p>
                    <p className="mt-1 text-xs text-[#7f8ca0]">{execution.publishedSummary}</p>
                  </td>
                  <td className="py-4 pr-3 text-[#5f6d82]">{store?.name ?? 'Unknown store'}</td>
                  <td className="py-4 pr-3 text-[#5f6d82]">{execution.targetSystem.toUpperCase()}</td>
                  <td className="py-4 pr-3">
                    <span
                      className={cn(
                        'rounded-full px-2.5 py-1 text-xs font-semibold',
                        executionTone(execution.status)
                      )}
                    >
                      {execution.status}
                    </span>
                  </td>
                  <td className="py-4 pr-3 text-[#7f8ca0]">{relativeTime(execution.startedAt)}</td>
                  <td className="py-4 text-[#7f8ca0]">
                    {execution.errorMessage ?? (execution.completedAt ? 'Completed' : 'Waiting')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function NotificationsReportView({
  notifications,
  onMarkAllRead,
}: {
  notifications: GrowthAgentNotification[];
  onMarkAllRead: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onMarkAllRead}
          className="h-12 rounded-[14px] border-[#d8dfeb] bg-white hover:bg-[#f6f8fc]"
        >
          Mark all read
        </Button>
      </div>
      <Card className="rounded-[22px] border-[#e6e8ef] bg-white shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)]">
        <CardHeader className="border-b border-[#eef1f5] pb-4">
          <CardTitle className="text-lg tracking-[-0.03em] text-[#1b2335]">
            Alerts and notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'rounded-[16px] border px-4 py-4',
                notification.read
                  ? 'border-[#eef1f5] bg-[#fbfcfe]'
                  : 'border-[#d8e2ff] bg-[#f6f8ff]'
              )}
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                      notificationTone(notification.type)
                    )}
                  >
                    {notification.type}
                  </span>
                  <p className="font-semibold text-[#1f2738]">{notification.title}</p>
                  <p className="text-sm leading-6 text-[#677588]">{notification.body}</p>
                </div>
                <div className="space-y-2 text-sm text-[#7d8a9d]">
                  <p>{relativeTime(notification.createdAt)}</p>
                  <Link
                    href={notification.href}
                    className="inline-flex items-center gap-1 font-medium text-[#4f6bc7] hover:underline"
                  >
                    Open
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <PushNotificationCard />
    </div>
  );
}
