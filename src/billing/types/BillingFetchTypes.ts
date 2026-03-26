export type BillingUsageFetchPeriod = 'daily' | 'weekly' | 'monthly';

export interface BillingUsageFetchOptions {
  periodType?: BillingUsageFetchPeriod;
  workspaceId?: string;
  product?: string;
  fromPeriodStart?: string;
  toPeriodStart?: string;
  limit?: number;
  /** Run aggregation pipeline before reading persisted billing buckets. */
  refreshBeforeFetch?: boolean;
}

export interface BillingUsageFetchBucket {
  periodType: BillingUsageFetchPeriod;
  periodStart: string;
  workspaceId: string;
  product: string;
  workflowRuns: number;
  stepExecutions: number;
  adapterCalls: number;
  computeMs: number;
  billableEvents: number;
  totalEvents: number;
  updatedAt: number;
}

export interface BillingUsageFetchResult {
  periodType: BillingUsageFetchPeriod;
  fetchedAt: number;
  refreshedBeforeFetch: boolean;
  sourceFile: string;
  watermarkDay?: string;
  totalBuckets: number;
  buckets: BillingUsageFetchBucket[];
}

export interface BillingUsageFetchCursor {
  periodType: BillingUsageFetchPeriod;
  lastPeriodStart?: string;
  workspaceId?: string;
  product?: string;
  updatedAt: number;
}

export interface BillingUsageIncrementalFetchOptions extends Omit<BillingUsageFetchOptions, 'fromPeriodStart'> {
  cursor?: BillingUsageFetchCursor;
}

export interface BillingUsageIncrementalFetchResult {
  previousCursor?: BillingUsageFetchCursor;
  nextCursor: BillingUsageFetchCursor;
  periodType: BillingUsageFetchPeriod;
  fetchedAt: number;
  refreshedBeforeFetch: boolean;
  sourceFile: string;
  watermarkDay?: string;
  totalBuckets: number;
  buckets: BillingUsageFetchBucket[];
}

/**
 * Foundational provider contract for systems that expose billing usage buckets.
 *
 * Concrete implementations can live in products (e.g. Orbyt engine) while the
 * contract remains component-agnostic in ecosystem-core billing.
 */
export interface BillingUsageFetchProvider {
  fetchUsageForBilling(options?: BillingUsageFetchOptions): Promise<BillingUsageFetchResult>;
  fetchUsageForBillingIncremental(
    options?: BillingUsageIncrementalFetchOptions,
  ): Promise<BillingUsageIncrementalFetchResult>;
}
