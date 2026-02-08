/**
 * Orbyt Workflow Enums
 * 
 * All enum definitions for Orbyt workflows.
 * These enums provide type-safe constants for workflow configuration.
 * 
 * @module types
 */

// ============================================================================
// WORKFLOW & EXECUTION ENUMS
// ============================================================================

/**
 * Type of workflow executable
 */
export enum WorkflowKind {
  /** Standard workflow - default execution model */
  Workflow = 'workflow',
  /** Pipeline - emphasizes data flow */
  Pipeline = 'pipeline',
  /** Job - emphasizes scheduled/batch execution */
  Job = 'job',
  /** Playbook - emphasizes operational procedures */
  Playbook = 'playbook',
  /** Automation - emphasizes event-driven execution */
  Automation = 'automation',
}

/**
 * Trigger types for workflow execution
 */
export enum TriggerType {
  /** Manually invoked by user */
  Manual = 'manual',
  /** Scheduled via cron expression */
  Cron = 'cron',
  /** Event-driven execution */
  Event = 'event',
  /** HTTP webhook trigger */
  Webhook = 'webhook',
}

/**
 * Execution environment
 */
export enum ExecutionEnvironment {
  Local = 'local',
  Dev = 'dev',
  Staging = 'staging',
  Prod = 'prod',
}

/**
 * Execution mode
 */
export enum ExecutionMode {
  /** Local process */
  Local = 'local',
  /** Docker container */
  Docker = 'docker',
  /** Remote execution */
  Remote = 'remote',
  /** Distributed execution */
  Distributed = 'distributed',
}

/**
 * Execution isolation level
 */
export enum IsolationLevel {
  /** Process-level isolation */
  Process = 'process',
  /** Container isolation */
  Container = 'container',
  /** Virtual machine isolation */
  VM = 'vm',
}

/**
 * Execution priority
 */
export enum ExecutionPriority {
  Low = 'low',
  Normal = 'normal',
  High = 'high',
}

/**
 * Execution strategy type
 */
export enum StrategyType {
  /** Sequential execution (default) */
  Sequential = 'sequential',
  /** Parallel execution */
  Parallel = 'parallel',
  /** Matrix strategy (NxM combinations) */
  Matrix = 'matrix',
  /** Fan-out to multiple targets */
  Fanout = 'fanout',
  /** Map-reduce pattern */
  MapReduce = 'map-reduce',
}

// ============================================================================
// FAILURE & RETRY ENUMS
// ============================================================================

/**
 * Failure handling policy
 */
export enum FailurePolicy {
  /** Stop entire workflow on first failure */
  Stop = 'stop',
  /** Continue with remaining steps */
  Continue = 'continue',
  /** Isolate failure to step only */
  Isolate = 'isolate',
}

/**
 * Failure action
 */
export enum FailureAction {
  /** Retry step */
  Retry = 'retry',
  /** Skip step */
  Skip = 'skip',
  /** Rollback workflow */
  Rollback = 'rollback',
  /** Isolate failure */
  Isolate = 'isolate',
  /** Abort workflow */
  Abort = 'abort',
}

/**
 * Failure action per step
 */
export enum StepFailureAction {
  /** Retry the step */
  Retry = 'retry',
  /** Skip and continue */
  Skip = 'skip',
  /** Run compensation logic */
  Compensate = 'compensate',
  /** Send notification */
  Notify = 'notify',
  /** Abort workflow */
  Abort = 'abort',
}

/**
 * Timeout action
 */
export enum TimeoutAction {
  /** Abort workflow */
  Abort = 'abort',
  /** Retry step */
  Retry = 'retry',
  /** Mark as partial success */
  Partial = 'partial',
}

/**
 * Retry backoff strategy
 */
export enum BackoffStrategy {
  /** Fixed delay between retries */
  Linear = 'linear',
  /** Exponentially increasing delay */
  Exponential = 'exponential',
}

/**
 * Rollback strategy
 */
export enum RollbackStrategy {
  /** Reverse order of steps */
  Reverse = 'reverse',
  /** Custom rollback logic */
  Custom = 'custom',
}

// ============================================================================
// SECURITY & SANDBOX ENUMS
// ============================================================================

/**
 * Sandbox enforcement level
 */
export enum SandboxLevel {
  /** No sandboxing */
  None = 'none',
  /** Basic permission checks */
  Basic = 'basic',
  /** Strict isolation and permissions */
  Strict = 'strict',
}

// ============================================================================
// SOURCE & IDENTITY ENUMS
// ============================================================================

/**
 * Workflow source type
 */
export enum WorkflowSourceType {
  /** From marketplace */
  Marketplace = 'marketplace',
  /** Local file */
  Local = 'local',
  /** AI/Tool generated */
  Generated = 'generated',
  /** API created */
  API = 'api',
}

// ============================================================================
// TELEMETRY & OBSERVABILITY ENUMS
// ============================================================================

/**
 * Telemetry level
 */
export enum TelemetryLevel {
  Minimal = 'minimal',
  Standard = 'standard',
  Verbose = 'verbose',
}

/**
 * Telemetry trace level
 */
export enum TraceLevel {
  Off = 'off',
  Minimal = 'minimal',
  Standard = 'standard',
  Detailed = 'detailed',
}

/**
 * Telemetry metrics level
 */
export enum MetricsLevel {
  Off = 'off',
  Basic = 'basic',
  Detailed = 'detailed',
}

/**
 * Telemetry logs level
 */
export enum LogsLevel {
  Off = 'off',
  Minimal = 'minimal',
  Standard = 'standard',
  Verbose = 'verbose',
}

// ============================================================================
// USAGE & ACCOUNTING ENUMS
// ============================================================================

/**
 * Accounting unit
 */
export enum AccountingUnit {
  /** Per execution */
  Execution = 'execution',
  /** Per step */
  Step = 'step',
  /** Per minute */
  Minute = 'minute',
}

/**
 * Usage scope for automation counting
 */
export enum UsageScope {
  /** Ecosystem-wide aggregation */
  Ecosystem = 'ecosystem',
  /** Component-level (Orbyt, MediaProc, etc.) */
  Component = 'component',
  /** Individual workflow */
  Workflow = 'workflow',
}

/**
 * Usage category for billing classification
 */
export enum UsageCategory {
  /** Automation workflow */
  Automation = 'automation',
  /** Data pipeline */
  Pipeline = 'pipeline',
  /** Batch job */
  Batch = 'batch',
  /** Background job */
  Job = 'job',
}

/**
 * Product identifier for ecosystem components
 */
export enum ProductIdentifier {
  Orbyt = 'orbyt',
  MediaProc = 'mediaproc',
  DevForge = 'devforge',
  Vaulta = 'vaulta',
  DevCompanion = 'dev-companion',
}

/**
 * Execution cost hint
 */
export enum CostHint {
  Free = 'free',
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}
