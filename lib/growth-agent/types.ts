export type GrowthAgentConnectionKind =
  | 'google-business-profile'
  | 'cms'
  | 'rank-tracker'
  | 'competitor-monitor';

export type GrowthAgentConnectionStatus = 'connected' | 'syncing' | 'attention';

export type GrowthAgentTargetSystem = 'gbp' | 'cms';

export type GrowthAgentRecommendationKind =
  | 'review_reply'
  | 'gbp_post'
  | 'business_info'
  | 'faq'
  | 'store_copy'
  | 'geo_answer';

export type GrowthAgentImpactLabel = 'high' | 'medium' | 'low';

export type GrowthAgentWorkflowStatus =
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'publishing'
  | 'published'
  | 'failed';

export type GrowthAgentApprovalActionType =
  | 'approved'
  | 'rejected'
  | 'edited_and_approved'
  | 'retry_requested';

export type GrowthAgentExecutionStatus = 'queued' | 'completed' | 'failed';

export type GrowthAgentNotificationType = 'approval' | 'anomaly' | 'execution';

export interface GrowthAgentDiffBlock {
  id: string;
  label: string;
  before: string;
  after: string;
}

export interface GrowthAgentConnection {
  id: string;
  kind: GrowthAgentConnectionKind;
  name: string;
  status: GrowthAgentConnectionStatus;
  lastSyncAt: string;
  detail: string;
}

export interface GrowthAgentStore {
  id: string;
  name: string;
  city: string;
  segment: string;
  websiteUrl: string;
  connections: GrowthAgentConnection[];
}

export interface GrowthAgentBusiness {
  id: string;
  name: string;
  ownerName: string;
  planName: string;
  defaultStoreId: string;
}

export interface GrowthAgentApprovalRecord {
  id: string;
  recommendationId: string;
  action: GrowthAgentApprovalActionType;
  actorName: string;
  at: string;
  note?: string;
}

export interface GrowthAgentRecommendation {
  id: string;
  storeId: string;
  title: string;
  summary: string;
  kind: GrowthAgentRecommendationKind;
  targetSystem: GrowthAgentTargetSystem;
  sourceSignal: string;
  reason: string;
  expectedImpactLabel: GrowthAgentImpactLabel;
  expectedImpactValue: string;
  priority: number;
  workflowStatus: GrowthAgentWorkflowStatus;
  suggestedAt: string;
  destinationLabel: string;
  notes: string[];
  diffBlocks: GrowthAgentDiffBlock[];
  approvalHistory: GrowthAgentApprovalRecord[];
}

export interface GrowthAgentExecutionRecord {
  id: string;
  recommendationId: string;
  storeId: string;
  targetSystem: GrowthAgentTargetSystem;
  status: GrowthAgentExecutionStatus;
  startedAt: string;
  completedAt?: string;
  publishedSummary: string;
  errorMessage?: string;
}

export interface GrowthAgentMetricSnapshot {
  id: string;
  storeId: string;
  periodLabel: string;
  searchVisibility: number;
  mapDiscovery: number;
  aiReadiness: number;
  executedCount: number;
  approvalSLAHours: number;
}

export interface GrowthAgentNotification {
  id: string;
  storeId?: string;
  type: GrowthAgentNotificationType;
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
}

export interface GrowthAgentSnapshot {
  business: GrowthAgentBusiness;
  stores: GrowthAgentStore[];
  recommendations: GrowthAgentRecommendation[];
  executions: GrowthAgentExecutionRecord[];
  metrics: GrowthAgentMetricSnapshot[];
  notifications: GrowthAgentNotification[];
}
