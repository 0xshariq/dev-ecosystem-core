/**
 * @dev-ecosystem/core - Engine Contract
 * 
 * Defines the contract for workflow execution engines across the ecosystem.
 * Enables different products to implement their own execution strategies.
 */

/**
 * Workflow definition (generic)
 */
export interface WorkflowDefinition {
  version: string;
  kind?: string;
  metadata?: WorkflowMetadata;
  workflow: {
    steps: StepDefinition[];
  };
  triggers?: TriggerDefinition[];
  inputs?: Record<string, InputDefinition>;
  secrets?: SecretDefinition[];
  outputs?: Record<string, string>;
  [key: string]: unknown;
}

export interface WorkflowMetadata {
  name: string;
  displayName?: string;
  description?: string;
  version?: string;
  author?: string;
  tags?: string[];
}

export interface StepDefinition {
  id: string;
  name?: string;
  uses: string;
  with?: Record<string, unknown>;
  when?: string;
  needs?: string[];
  timeout?: string;
  retry?: RetryConfig;
  continueOnError?: boolean;
  [key: string]: unknown;
}

export interface TriggerDefinition {
  type: 'manual' | 'cron' | 'event' | 'webhook';
  enabled?: boolean;
  [key: string]: unknown;
}

export interface InputDefinition {
  type: string;
  description?: string;
  default?: unknown;
  required?: boolean;
  [key: string]: unknown;
}

export interface SecretDefinition {
  name: string;
  required?: boolean;
  description?: string;
}

export interface RetryConfig {
  maxAttempts?: number;
  backoff?: 'fixed' | 'linear' | 'exponential';
  initialDelay?: string;
  maxDelay?: string;
  factor?: number;
  retryableErrors?: string[];
}

/**
 * Workflow execution options
 */
export interface WorkflowExecutionOptions {
  runId?: string;
  dryRun?: boolean;
  variables?: Record<string, unknown>;
  secrets?: Record<string, string>;
  timeout?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  outputDir?: string;
  continueOnError?: boolean;
  from?: string;
  to?: string;
}

/**
 * Workflow execution result
 */
export interface WorkflowExecutionResult {
  runId: string;
  workflowName: string;
  status: WorkflowStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  steps: StepExecutionResult[];
  outputs?: Record<string, unknown>;
  error?: Error;
  metadata?: Record<string, unknown>;
}

/**
 * Step execution result
 */
export interface StepExecutionResult {
  stepId: string;
  stepName?: string;
  adapter: string;
  status: StepStatus;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  outputs?: Record<string, unknown>;
  error?: Error;
  retryCount?: number;
  skipped?: boolean;
  skipReason?: string;
}

/**
 * Workflow status
 */
export enum WorkflowStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  PAUSED = 'paused',
}

/**
 * Step status
 */
export enum StepStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  SKIPPED = 'skipped',
  CANCELLED = 'cancelled',
}

/**
 * Workflow execution engine interface
 */
export interface IWorkflowEngine {
  /**
   * Engine name and version
   */
  readonly name: string;
  readonly version: string;
  
  /**
   * Initialize the engine
   */
  initialize(config?: EngineConfig): Promise<void>;
  
  /**
   * Execute a workflow from file path
   */
  executeFromFile(filePath: string, options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult>;
  
  /**
   * Execute a workflow from definition
   */
  executeFromDefinition(workflow: WorkflowDefinition, options?: WorkflowExecutionOptions): Promise<WorkflowExecutionResult>;
  
  /**
   * Validate a workflow definition
   */
  validate(workflow: WorkflowDefinition): Promise<ValidationResult>;
  
  /**
   * Pause a running workflow
   */
  pause(runId: string): Promise<void>;
  
  /**
   * Resume a paused workflow
   */
  resume(runId: string): Promise<void>;
  
  /**
   * Cancel a running workflow
   */
  cancel(runId: string, reason?: string): Promise<void>;
  
  /**
   * Get workflow execution status
   */
  getStatus(runId: string): Promise<WorkflowExecutionResult>;
  
  /**
   * List all workflow executions
   */
  listExecutions(filter?: ExecutionFilter): Promise<WorkflowExecutionResult[]>;
  
  /**
   * Cleanup resources
   */
  shutdown(): Promise<void>;
}

/**
 * Engine configuration
 */
export interface EngineConfig {
  mode?: 'local' | 'distributed' | 'cloud';
  maxConcurrentWorkflows?: number;
  maxConcurrentSteps?: number;
  defaultTimeout?: number;
  stateDir?: string;
  logDir?: string;
  enableMetrics?: boolean;
  enableEvents?: boolean;
  adapters?: string[];
  plugins?: string[];
  [key: string]: unknown;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  code?: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  code?: string;
}

/**
 * Execution filter
 */
export interface ExecutionFilter {
  status?: WorkflowStatus[];
  workflowName?: string;
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Engine event types
 */
export enum EngineEventType {
  WORKFLOW_STARTED = 'workflow.started',
  WORKFLOW_COMPLETED = 'workflow.completed',
  WORKFLOW_FAILED = 'workflow.failed',
  WORKFLOW_PAUSED = 'workflow.paused',
  WORKFLOW_RESUMED = 'workflow.resumed',
  WORKFLOW_CANCELLED = 'workflow.cancelled',
  STEP_STARTED = 'step.started',
  STEP_COMPLETED = 'step.completed',
  STEP_FAILED = 'step.failed',
  STEP_SKIPPED = 'step.skipped',
  STEP_RETRYING = 'step.retrying',
}

/**
 * Engine event
 */
export interface EngineEvent {
  type: EngineEventType;
  timestamp: Date;
  runId: string;
  workflowName: string;
  payload: unknown;
}
