/**
 * Orbyt Workflow Type Definitions
 * 
 * Comprehensive TypeScript types for Orbyt workflows.
 * These types define the structure of workflow definitions across the ecosystem.
 * 
 * Key Principles:
 * - Domain-agnostic: works for any workflow type
 * - Explicit over implicit: no `any` unless truly dynamic
 * - Documented: every type has clear purpose
 * - Versioned: includes v1 and future-reserved fields
 */

// ============================================================================
// ENUMS & CONSTANTS
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
 * Retry backoff strategy
 */
export enum BackoffStrategy {
  /** Fixed delay between retries */
  Linear = 'linear',
  /** Exponentially increasing delay */
  Exponential = 'exponential',
}

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

/**
 * Execution environment
 */
export enum ExecutionEnvironment {
  Local = 'local',
  Dev = 'dev',
  Staging = 'staging',
  Prod = 'prod',
}

// ============================================================================
// METADATA TYPES
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

/**
 * Union of all trigger types
 * 
 * @category Triggers
 */
export type WorkflowTrigger = ManualTrigger | CronTrigger | EventTrigger | WebhookTrigger;

// ============================================================================
// SECRETS TYPES
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
// INPUT TYPES
// ============================================================================

/**
 * Input parameter data types
 * 
 * @category Inputs
 */
export type InputType = 'string' | 'number' | 'boolean' | 'array' | 'object';

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

/**
 * Runtime parameters for workflow reusability
 * 
 * @category Inputs
 */
export type WorkflowInputs = Record<string, WorkflowInputDefinition>;

// ============================================================================
// CONTEXT TYPES
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

/**
 * Timeout specification (e.g., "30s", "5m", "1h")
 * 
 * @category Execution
 */
export type TimeoutSpec = string;

// ============================================================================
// DEFAULTS TYPES
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
// STEP TYPES
// ============================================================================

/**
 * Output mapping from step result to named outputs
 * 
 * @category Steps
 */
export type StepOutputMapping = Record<string, string>;

/**
 * Conditional execution expression
 * Supports ${inputs.*}, ${secrets.*}, ${steps.*.outputs.*}, ${context.*}
 * 
 * @category Steps
 */
export type StepCondition = string;

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
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Variable reference pattern
 * Format: ${namespace.path.to.value}
 * 
 * Namespaces:
 * - inputs.*
 * - secrets.*
 * - steps.*.outputs.*
 * - context.*
 * - env.*
 * 
 * @category Variables
 */
export type VariableReference = string;

/**
 * Action reference pattern
 * Format: namespace.action or namespace.domain.action
 * 
 * Examples:
 * - mediaproc.image.resize
 * - cli.exec
 * - http.request
 * 
 * @category Actions
 */
export type ActionReference = string;

/**
 * Secret reference pattern
 * Format: provider:path
 * 
 * Examples:
 * - vaulta:mediaproc/api/key
 * - aws-secrets:prod/db/password
 * 
 * @category Secrets
 */
export type SecretReference = string;

// ============================================================================
// VERSION MARKERS
// ============================================================================

/**
 * Marks fields that are implemented in v1
 */
export type V1Field = unknown;

/**
 * Marks fields that are reserved for future versions
 */
export type FutureField = unknown;
