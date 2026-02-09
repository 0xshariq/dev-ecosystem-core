/**
 * Orbyt Workflow Type Definitions
 * 
 * Comprehensive TypeScript interfaces for Orbyt workflows.
 * These interfaces define the structure of workflow definitions across the ecosystem.
 * 
 * Key Principles:
 * - Domain-agnostic: works for any workflow type
 * - Explicit over implicit: no `any` unless truly dynamic
 * - Documented: every interface has clear purpose
 * - Versioned: includes v1 and future-reserved fields
 * 
 * Note: Enums are in workflow.enums.ts, type aliases are in workflow.type-aliases.ts
 */

// ============================================================================
// IMPORTS
// ============================================================================

import type {
  WorkflowKind,
  TriggerType,
  FailurePolicy,
  BackoffStrategy,
  SandboxLevel,
  ExecutionEnvironment,
  WorkflowSourceType,
  ExecutionMode,
  IsolationLevel,
  ExecutionPriority,
  TelemetryLevel,
  AccountingUnit,
  FailureAction,
  TimeoutAction,
  RollbackStrategy,
  UsageScope,
  UsageCategory,
  ProductIdentifier,
  CostHint,
  LogsLevel,
  MetricsLevel,
  StepFailureAction,
  StrategyType,
  TraceLevel
} from './workflow.enums.js';

import type {
  InputType,
  TimeoutSpec,
  StepOutputMapping,
  StepCondition,
  V1Field,
  FutureField,
  OutputsSchema,
  WorkflowTrigger,
  WorkflowInputs,
} from './workflow.type.js';

// ============================================================================
// METADATA INTERFACES
// ============================================================================

/**
 * Workflow metadata for identification and organization.
 * Never used for execution logic.
 * 
 * @category Metadata
 */
export interface WorkflowMetadata {
  /** Human-readable workflow name */
  name?: string;

  /** Detailed description of workflow purpose */
  description?: string;

  /** Tags for categorization and search */
  tags?: string[];

  /** Team or individual owner */
  owner?: string;

  /** Version of this workflow (not schema version) */
  version?: string;

  /** ISO 8601 creation timestamp */
  createdAt?: string;

  /** ISO 8601 last update timestamp */
  updatedAt?: string;

  /** V1 field marker */
  v1?: V1Field;

  /** Future field marker */
  future?: FutureField;

  /** Allow additional metadata fields */
  [key: string]: any;
}

/**
 * Zero-runtime-impact annotations for AI, UI, and tooling.
 * 
 * @category Metadata
 */
export interface WorkflowAnnotations {
  /** Hint for AI about workflow intent */
  'ai.intent'?: string;

  /** UI grouping category */
  'ui.group'?: string;

  /** Icon identifier for visual representation */
  'ui.icon'?: string;

  /** Allow additional annotations */
  [key: string]: any;
}

// ============================================================================
// TRIGGER TYPES
// ============================================================================

/**
 * Base trigger interface
 * 
 * @category Triggers
 */
export interface BaseTrigger {
  type: TriggerType;
}

/**
 * Manual trigger - workflow must be explicitly invoked
 * 
 * @category Triggers
 */
export interface ManualTrigger extends BaseTrigger {
  type: TriggerType.Manual;
}

/**
 * Cron-based scheduled trigger
 * 
 * @category Triggers
 */
export interface CronTrigger extends BaseTrigger {
  type: TriggerType.Cron;
  /** Cron expression (e.g., "0 2 * * *") */
  schedule: string;
}

/**
 * Event-driven trigger
 * 
 * @category Triggers
 */
export interface EventTrigger extends BaseTrigger {
  type: TriggerType.Event;
  /** Event source identifier (e.g., "github.push") */
  source: string;
  /** Optional filtering conditions */
  filters?: Record<string, any>;
}

/**
 * HTTP webhook trigger
 * 
 * @category Triggers
 */
export interface WebhookTrigger extends BaseTrigger {
  type: TriggerType.Webhook;
  /** Webhook endpoint path */
  endpoint: string;
  /** Optional filtering conditions */
  filters?: Record<string, any>;
}

// ============================================================================
// SECRETS INTERFACES
// ============================================================================

/**
 * External secret references.
 * Values are NEVER stored inline - only references to secret providers.
 * 
 * Format: "provider:path" (e.g., "vaulta:mediaproc/api/key")
 * 
 * @category Secrets
 */
export interface WorkflowSecrets {
  /** Secret vault provider (default: "vaulta") */
  vault?: string;

  /** Map of logical names to provider-specific paths */
  keys: Record<string, string>;
}

// ============================================================================
// INPUT INTERFACES
// ============================================================================

/**
 * Definition of a single input parameter
 * 
 * @category Inputs
 */
export interface WorkflowInputDefinition {
  /** Data type of input */
  type?: InputType;

  /** Whether input is required */
  required?: boolean;

  /** Default value if not provided */
  default?: any;

  /** Human-readable description */
  description?: string;
}

// ============================================================================
// CONTEXT INTERFACES
// ============================================================================

/**
 * Runtime environment context (read-only for steps)
 * 
 * @category Context
 */
export interface WorkflowContext {
  /** Environment name */
  env?: ExecutionEnvironment;

  /** Execution platform */
  platform?: string;

  /** Working directory path */
  workspace?: string;

  /** Allow additional context fields */
  [key: string]: any;
}

// ============================================================================
// RETRY & TIMEOUT TYPES
// ============================================================================

/**
 * Retry configuration
 * 
 * @category Execution
 */
export interface WorkflowRetryConfig {
  /** Maximum retry attempts */
  max: number;

  /** Backoff strategy */
  backoff?: BackoffStrategy;

  /** Initial delay in milliseconds */
  delay?: number;
}

// ============================================================================
// DEFAULTS INTERFACES
// ============================================================================

/**
 * Default settings applied to all steps
 * 
 * @category Configuration
 */
export interface WorkflowDefaults {
  /** Default retry configuration */
  retry?: WorkflowRetryConfig;

  /** Default step timeout */
  timeout?: TimeoutSpec;

  /** Default adapter if not specified in uses */
  adapter?: string;

  /** Allow additional defaults */
  [key: string]: any;
}

// ============================================================================
// POLICIES TYPES
// ============================================================================

/**
 * Execution policies and rules
 * 
 * @category Configuration
 */
export interface WorkflowPolicies {
  /** Failure handling policy */
  failure?: FailurePolicy;

  /** Maximum parallel step execution */
  concurrency?: number;

  /** Sandbox enforcement level */
  sandbox?: SandboxLevel;

  /** Allow additional policies */
  [key: string]: any;
}

// ============================================================================
// PERMISSIONS TYPES
// ============================================================================

/**
 * Filesystem permissions
 * 
 * @category Security
 */
export interface FilesystemPermissions {
  /** Allowed read paths */
  read?: string[];

  /** Allowed write paths */
  write?: string[];
}

/**
 * Network permissions
 * 
 * @category Security
 */
export interface NetworkPermissions {
  /** Allowed hosts/domains */
  allow?: string[];

  /** Blocked hosts/domains */
  deny?: string[];
}

/**
 * Fine-grained security permissions
 * 
 * @category Security
 */
export interface WorkflowPermissions {
  /** Filesystem access permissions */
  fs?: FilesystemPermissions;

  /** Network access permissions */
  network?: NetworkPermissions;

  /** Allow additional permission types */
  [key: string]: any;
}

// ============================================================================
// RESOURCES TYPES
// ============================================================================

/**
 * Resource constraints for cloud/distributed execution
 * Reserved for future use
 * 
 * @category Resources
 */
export interface WorkflowResources {
  /** CPU allocation */
  cpu?: number | string;

  /** Memory allocation (e.g., "512MB", "2GB") */
  memory?: string;

  /** Disk allocation (e.g., "1GB", "10GB") */
  disk?: string;

  /** Overall workflow timeout */
  timeout?: TimeoutSpec;

  /** Allow additional resource specifications */
  [key: string]: any;
}

// ============================================================================
// USAGE & COUNTING TYPES
// ============================================================================

// ============================================================================
// USAGE INTERFACES
// ============================================================================

/**
 * Workflow-level usage tracking configuration
 * Engine counts, bridges transport, website displays
 * 
 * @category Usage
 * @status production-ready - minimal, final
 */
export interface WorkflowUsage {
  /** Enable usage tracking for this workflow */
  track?: boolean;

  /** Aggregation scope */
  scope?: UsageScope | string;

  /** Usage category for billing */
  category?: UsageCategory | string;

  /** Whether this workflow is billable */
  billable?: boolean;

  /** Product/component identifier */
  product?: ProductIdentifier | string;

  /** Tags for analytics */
  tags?: string[];
}

/**
 * Step-level usage tracking override
 * Allows per-step billing customization
 * 
 * @category Usage
 * @status production-ready - minimal, final
 */
export interface StepUsage {
  /** Override workflow billable setting */
  billable?: boolean;

  /** Billing unit (e.g., 'request', 'execution', 'second') */
  unit?: string;

  /** Cost multiplier (default: 1) */
  weight?: number;

  /** Cost estimation hint for billing */
  costHint?: CostHint;
}

// ============================================================================
// STEP INTERFACES
// ============================================================================



/**
 * Individual workflow step definition
 * 
 * @category Steps
 */
export interface WorkflowStepDefinition {
  /**
   * Unique step identifier
   * Used for output referencing and dependencies
   * Pattern: ^[a-zA-Z][a-zA-Z0-9_-]*$
   */
  id: string;

  /** Human-readable step name */
  name?: string;

  /**
   * Action to execute - THE universal abstraction
   * Format: namespace.action or namespace.domain.action
   * 
   * Examples:
   * - mediaproc.image.resize
   * - cli.exec
   * - http.request
   * - shell.run
   * - db.query
   */
  uses: string;

  /**
   * Adapter-specific input parameters
   * Structure validated by adapter, not by schema
   * Supports variable interpolation: ${namespace.path}
   */
  with?: Record<string, any>;

  /** Conditional execution expression */
  when?: StepCondition;

  /** Explicit step dependencies (step IDs) */
  needs?: string[];

  /** Step-specific retry config (overrides defaults) */
  retry?: WorkflowRetryConfig;

  /** Step execution timeout (overrides defaults) */
  timeout?: TimeoutSpec;

  /**
   * Continue workflow even if step fails
   * Critical for cleanup and best-effort steps
   */
  continueOnError?: boolean;

  /** Map step outputs to named values for other steps */
  outputs?: StepOutputMapping;

  /** Environment variables for this step */
  env?: Record<string, string>;

  /** Usage tracking override (future: per-step billing) */
  usage?: StepUsage;

  // === FUTURE-SAFE FIELDS ===

  /** Output schema (future: validation) */
  outputsSchema?: OutputsSchema;

  /** Step-level rollback logic (future: compensation) */
  rollback?: StepRollback;
}

// ============================================================================
// WORKFLOW BODY TYPES
// ============================================================================

/**
 * Core workflow execution definition
 * 
 * @category Workflow
 */
export interface WorkflowBody {
  /** Ordered list of execution steps */
  steps: WorkflowStepDefinition[];
}

// ============================================================================
// LIFECYCLE HOOKS (FUTURE)
// ============================================================================

/**
 * Lifecycle hooks - Reserved for future use
 * 
 * @category Lifecycle
 */
export interface WorkflowLifecycleHooks {
  /** Steps to run on successful completion */
  success?: any[];

  /** Steps to run on failure */
  failure?: any[];

  /** Steps to always run (cleanup) */
  always?: any[];
}

// ============================================================================
// WORKFLOW IDENTITY & LINEAGE
// ============================================================================

/**
 * Workflow source information
 * 
 * @category Identity
 * @status future
 */
export interface WorkflowSource {
  /** Source type */
  type: WorkflowSourceType;

  /** Source reference (e.g., marketplace URL, file path) */
  ref?: string;
}

/**
 * Workflow identity and lineage tracking
 * 
 * @category Identity
 * @status future - reserved for traceability
 */
export interface WorkflowIdentity {
  /** Unique workflow identifier */
  workflowId?: string;

  /** Parent workflow ID (if forked) */
  parentWorkflow?: string;

  /** Workflow source information */
  source?: WorkflowSource;
}

// ============================================================================
// EXECUTION STRATEGY
// ============================================================================

/**
 * Execution strategy and runtime configuration
 * 
 * @category Execution
 * @status future - reserved for multi-environment support
 */
export interface ExecutionStrategy {
  /** Execution mode */
  mode?: ExecutionMode;

  /** Isolation level */
  isolation?: IsolationLevel;

  /** Execution priority */
  priority?: ExecutionPriority;

  /** Strategy type for execution */
  strategyType?: StrategyType;
}

// ============================================================================
// OUTPUT CONTRACTS
// ============================================================================

/**
 * Schema definition for outputs
 * 
 * @category Contracts
 * @status future - reserved for compile-time validation
 */
export interface OutputSchema {
  /** Data type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';

  /** Whether output is required */
  required?: boolean;

  /** Output description */
  description?: string;
}

// ============================================================================
// TELEMETRY & OBSERVABILITY
// ============================================================================

/**
 * Telemetry and observability controls
 * 
 * @category Observability
 * @status future - reserved for privacy controls
 */
export interface TelemetryConfig {
  /** Enable telemetry */
  enabled?: boolean;

  /** Telemetry level */
  level?: TelemetryLevel;

  /** Logs verbosity level */
  logs?: LogsLevel;

  /** Metrics collection level */
  metrics?: MetricsLevel;

  /** Trace collection level */
  trace?: TraceLevel;

  /** Fields to redact from logs */
  redact?: string[];
}

// ============================================================================
// COST & USAGE ACCOUNTING
// ============================================================================

/**
 * Cost and usage accounting
 * 
 * @category Accounting
 * @status future - reserved for monetization
 */
export interface AccountingConfig {
  /** Whether execution is billable */
  billable?: boolean;

  /** Billing unit */
  unit?: AccountingUnit;

  /** Custom tags for accounting */
  tags?: Record<string, string>;
}

// ============================================================================
// VERSION COMPATIBILITY
// ============================================================================

/**
 * Engine version constraints
 * 
 * @category Compatibility
 * @status future - reserved for version management
 */
export interface EngineCompatibility {
  /** Minimum engine version */
  min?: string;

  /** Maximum engine version */
  max?: string;
}

/**
 * Version compatibility and constraints
 * 
 * @category Compatibility
 * @status future - reserved for safe upgrades
 */
export interface CompatibilityConfig {
  /** Engine version requirements */
  engine?: EngineCompatibility;

  /** Required adapter versions */
  adapters?: Record<string, string>;
}

// ============================================================================
// FAILURE SEMANTICS
// ============================================================================

/**
 * Advanced failure handling semantics
 * 
 * @category Execution
 * @status future - reserved for complex workflows
 */
export interface FailureSemantics {
  /** Action on step failure */
  onStepFailure?: FailureAction;

  /** Step-specific failure action */
  stepAction?: StepFailureAction;

  /** Action on timeout */
  onTimeout?: TimeoutAction;
}

// ============================================================================
// ROLLBACK & COMPENSATION
// ============================================================================

/**
 * Step-level rollback configuration
 * 
 * @category Execution
 * @status future - reserved for compensation logic
 */
export interface StepRollback {
  /** Action for rollback */
  uses: string;

  /** Input parameters for rollback */
  with?: Record<string, any>;
}

/**
 * Workflow-level rollback configuration
 * 
 * @category Execution
 * @status future - reserved for transactional workflows
 */
export interface RollbackConfig {
  /** Enable rollback */
  enabled?: boolean;

  /** Rollback strategy */
  strategy?: RollbackStrategy;
}

// ============================================================================
// GOVERNANCE & TEAM METADATA
// ============================================================================

/**
 * Governance and team metadata
 * 
 * @category Governance
 * @status future - reserved for enterprise features
 */
export interface GovernanceConfig {
  /** Required reviewers */
  reviewers?: string[];

  /** Whether approval is required before execution */
  approvalRequired?: boolean;

  /** Additional governance metadata */
  [key: string]: any;
}

// ============================================================================
// MAIN WORKFLOW DEFINITION
// ============================================================================

/**
 * Complete Orbyt workflow definition
 * 
 * This is the root type for all workflow YAML/JSON files.
 * 
 * @category Workflow
 */
export interface WorkflowDefinition {
  // === REQUIRED FIELDS ===

  /** Schema version (semantic versioning) */
  version: string;

  /** Type of executable */
  kind: WorkflowKind | string;

  /** Core workflow execution definition */
  workflow: WorkflowBody;

  // === OPTIONAL METADATA ===

  /** Human-readable metadata */
  metadata?: WorkflowMetadata;

  /** Zero-impact annotations for tooling */
  annotations?: WorkflowAnnotations;

  // === EXECUTION CONFIGURATION ===

  /** Execution triggers */
  triggers?: WorkflowTrigger[];

  /** External secret references */
  secrets?: WorkflowSecrets;

  /** Runtime parameters */
  inputs?: WorkflowInputs;

  /** Runtime environment context */
  context?: WorkflowContext;

  /** Default settings for all steps */
  defaults?: WorkflowDefaults;

  /** Execution policies */
  policies?: WorkflowPolicies;

  /** Security permissions */
  permissions?: WorkflowPermissions;

  /** Resource constraints (future) */
  resources?: WorkflowResources;

  // === OUTPUTS & HOOKS ===

  /** Final workflow outputs returned to caller */
  outputs?: Record<string, string>;

  /** Lifecycle hooks (future) */
  on?: WorkflowLifecycleHooks;

  /** Usage tracking configuration */
  usage?: WorkflowUsage;

  // === FUTURE-SAFE FIELDS ===

  /** Workflow identity & lineage (future: traceability) */
  identity?: WorkflowIdentity;

  /** Execution strategy (future: multi-environment) */
  execution?: ExecutionStrategy;

  /** Output schema (future: validation) */
  outputsSchema?: OutputsSchema;

  /** Telemetry controls (future: privacy) */
  telemetry?: TelemetryConfig;

  /** Cost accounting (future: monetization) */
  accounting?: AccountingConfig;

  /** Version compatibility (future: safe upgrades) */
  compatibility?: CompatibilityConfig;

  /** Failure semantics (future: advanced error handling) */
  failurePolicy?: FailureSemantics;

  /** Rollback config (future: transactional workflows) */
  rollback?: RollbackConfig;

  /** Governance metadata (future: enterprise) */
  governance?: GovernanceConfig;
}

// VariableReference, ActionReference, SecretReference are imported from workflow.type-aliases.ts
// V1Field and FutureField markers are imported from workflow.type-aliases.ts

export * from './workflow.enums.js';
export * from './workflow.type.js';