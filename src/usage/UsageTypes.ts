/**
 * Usage Event Types and Collector Interface
 * 
 * Canonical usage facts emitted by automation engines, adapters, and plugins
 * across the ecosystem for billing, analytics, quotas, and abuse prevention.
 * 
 * These are deterministic, engine/component-driven, and never trust user-provided counters.
 * 
 * Usage events are:
 * - Non-blocking: collector failures are logged and swallowed
 * - Deterministic: same input always produces same usage facts
 * - Isolated: per-execution, no cross-run contamination
 * - Asynchronous: not part of critical path execution
 * 
 * @module usage
 */

/**
 * Usage event types - covers all significant automation facts
 */
export enum UsageEventType {
  // Workflow-level usage
  WORKFLOW_RUN = 'usage.workflow.run',

  // Step-level usage
  STEP_EXECUTE = 'usage.step.execute',

  // Adapter-level usage
  ADAPTER_CALL = 'usage.adapter.call',

  // Trigger usage
  TRIGGER_FIRE = 'usage.trigger.fire',

  // Job/queue usage
  JOB_ENQUEUED = 'usage.job.enqueued',
  JOB_EXECUTE = 'usage.job.execute',

  // Alternative/legacy naming support
  AUTOMATION_RUN = 'usage.automation.run',
  ACTION_EXECUTE = 'usage.action.execute',
}

/**
 * Common metadata for all usage events
 */
export interface UsageEventMetadata {
  /** Duration in milliseconds */
  durationMs?: number;

  /** Whether the operation succeeded */
  success?: boolean;

  /** Number of retry attempts made */
  retries?: number;

  /** Error message if failed */
  error?: string;

  /** Custom tags for analytics/reporting (e.g., 'mediaproc', 'image', 'automation') */
  tags?: string[];

  /** Exit code (for shell/CLI adapters) */
  exitCode?: number;

  /** Resource usage (memory, cpu, etc) */
  resourceUsage?: {
    memoryBytes?: number;
    cpuMs?: number;
    networkBytes?: number;
  };

  /** Additional contextual data */
  [key: string]: any;
}

/**
 * Canonical usage event - the single source of truth for billing/analytics
 * 
 * Components emit these at deterministic points:
 * - Orbyt engine: workflow.run (at start), step.execute (after completion), adapter.call (after invocation)
 * - MediaProc: adapter.call (for each pipeline action)
 * - Dev-Forge: workflow.run, step.execute
 * - Voxa: adapter.call (for CLI/integration execution)
 * 
 * The billing engine consumes these events asynchronously for:
 * - Usage aggregation by workspace/user/product
 * - Cost calculation based on pricing tier
 * - Quota enforcement
 * - Analytics and reporting
 */
export interface UsageEvent {
  /** Unique event identifier (UUID) */
  id: string;

  /** Event type (controls event semantics and billing rules) */
  type: UsageEventType;

  /** Unix timestamp in milliseconds when event occurred */
  timestamp: number;

  /** Product/component that generated this event (e.g., 'orbyt', 'mediaproc', 'dev-forge', 'voxa') */
  product: string;

  /** Workflow identifier (if applicable) */
  workflowId?: string;

  /** Execution/run identifier (unique per run) */
  executionId: string;

  /** Owner/user identifier (from OIDC/auth context) */
  userId?: string;

  /** Workspace/organization identifier */
  workspaceId?: string;

  /** Step identifier (for step and adapter events) */
  stepId?: string;

  /** Adapter name if applicable (e.g., 'http', 'shell', 'mediaproc.image', 'mediaproc.video') */
  adapterName?: string;

  /** Adapter type/category (e.g., 'http', 'shell', 'cli', 'plugin', 'media') */
  adapterType?: string;

  /** Component information */
  component?: {
    kind: 'adapter' | 'plugin' | 'trigger' | 'workflow' | 'job';
    name: string;
    version?: string;
  };

  /** Execution/batch mode if applicable (e.g., 'single', 'sequential', 'parallel', 'mixed') */
  executionMode?: string;

  /** Pricing tier at time of execution */
  pricingTier?: 'free' | 'pro' | 'enterprise' | string;

  /** Event-specific metadata */
  metadata?: UsageEventMetadata;

  /** Billability flag (if false, event is recorded but not charged) */
  billable?: boolean;

  /** Optional idempotency key for deduplication at collector/billing ingestion */
  idempotencyKey?: string;

  /** Optional schema version for strict billing validation */
  schemaVersion?: string;
}

/**
 * Aggregated usage statistics for a time window or dimension
 */
export interface UsageAggregation {
  /** Time window start (unix milliseconds) */
  from: number;

  /** Time window end (unix milliseconds) */
  to: number;

  /** Aggregation dimension (e.g., 'user', 'workspace', 'product', 'adapter') */
  dimension?: string;

  /** Total workflow runs */
  totalWorkflowRuns: number;

  /** Total step executions */
  totalStepExecutions: number;

  /** Total adapter calls */
  totalAdapterCalls: number;

  /** Total jobs executed */
  totalJobsExecuted?: number;

  /** Breakdown by adapter type */
  byAdapterType: Record<string, {
    count: number;
    successCount: number;
    failureCount: number;
    totalDurationMs: number;
    billableCount?: number;
  }>;

  /** Total duration of all events (sum of durations) */
  totalDurationMs: number;

  /** Success rate (0-1) */
  successRate: number;

  /** Billable count (events that incur cost) */
  billableCount?: number;
}

/**
 * Pluggable usage collector interface
 * 
 * Standardized interface for all ecosystem components to record usage events.
 * Implementations handle deterministic usage facts from engines, adapters, and plugins.
 * 
 * Contract:
 * - Must be non-fatal and never block execution
 * - Failures are logged but do not propagate
 * - Must support both single and batch recording
 * - Must support optional async flushing for graceful shutdown
 * 
 * Example implementations:
 * 
 * ```ts
 * // No-op collector (default)
 * class NoOpUsageCollector implements UsageCollector {
 *   async record(event: UsageEvent): Promise<void> {}
 *   async recordBatch(events: UsageEvent[]): Promise<void> {}
 * }
 * 
 * // File-based collector
 * class FileUsageCollector implements UsageCollector {
 *   private events: UsageEvent[] = [];
 *   
 *   async record(event: UsageEvent): Promise<void> {
 *     this.events.push(event);
 *   }
 *   
 *   async flush(): Promise<void> {
 *     await fs.writeFile('usage-events.jsonl', 
 *       this.events.map(e => JSON.stringify(e)).join('\n'));
 *     this.events = [];
 *   }
 * }
 * 
 * // API-based collector
 * class ApiUsageCollector implements UsageCollector {
 *   constructor(private apiUrl: string) {}
 *   
 *   async record(event: UsageEvent): Promise<void> {
 *     await fetch(`${this.apiUrl}/usage`, {
 *       method: 'POST',
 *       body: JSON.stringify(event),
 *     });
 *   }
 * }
 * ```
 */
export interface UsageCollector {
  /**
   * Contract version implemented by this collector interface.
   * Billing ingestion can use this to reject unsupported emitters.
   */
  readonly contractVersion?: '1.0';

  /**
   * Collector target classification.
   * Use 'billing-engine' for production billing ingestion collectors.
   */
  readonly target?: 'billing-engine' | 'analytics' | 'both' | 'custom';

  /**
   * Record a single usage event
   * 
   * Implementation must be non-fatal:
   * - Errors are logged but not thrown
   * - Never blocks critical path execution
   * - Should be fast (<100ms for typical implementation)
   * 
   * @param event - Usage event to record
   * @throws Never - errors are caught and logged by caller
   */
  record(event: UsageEvent): Promise<void>;

  /**
   * Record multiple usage events in batch
   * 
   * Default implementation calls record() for each event.
   * Implementations may override for efficiency (e.g., bulk DB insert).
   * 
   * @param events - Usage events to record
   * @throws Never - errors are caught and logged by caller
   */
  recordBatch?(events: UsageEvent[]): Promise<void>;

  /**
   * Flush any pending events
   * 
   * Called before engine/component shutdown to ensure no data loss.
   * Optional - only implement if implementation buffers events.
   * 
   * @throws Never - errors are caught and logged by caller
   */
  flush?(): Promise<void>;

  /**
   * Optional health status for runtime diagnostics.
   */
  healthCheck?(): Promise<{
    healthy: boolean;
    detail?: string;
    lastSuccessAt?: number;
  }>;

  /**
   * Optional graceful shutdown hook.
   */
  close?(): Promise<void>;
}

/**
 * Factory type for creating usage collectors
 * 
 * Allows components to support multiple collector backends via configuration
 */
export type UsageCollectorFactory = (config: any) => UsageCollector;

/**
 * Usage reporting options for queries
 */
export interface UsageQueryOptions {
  /** Start timestamp (ms) */
  from?: number;

  /** End timestamp (ms) */
  to?: number;

  /** User/workspace/product to filter by */
  userId?: string;
  workspaceId?: string;
  product?: string;

  /** Aggregation dimension */
  groupBy?: 'hourly' | 'daily' | 'weekly' | 'adapter' | 'product';

  /** Maximum results */
  limit?: number;
}
