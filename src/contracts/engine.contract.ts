/**
 * @dev-ecosystem/core - Engine Contract
 * 
 * Defines the contract for workflow execution engines across the ecosystem.
 * Enables different products to implement their own execution strategies.
 * 
 * Architecture:
 * - Workflow definition types are in types/workflow.interfaces.ts
 * - This file contains engine-specific execution contracts:
 *   - Execution options and results
 *   - Status enums
 *   - Engine interface
 *   - Validation contracts
 * 
 * Usage:
 * - Import workflow types from: @dev-ecosystem/core/types/workflow.interfaces
 * - Import engine contracts from: @dev-ecosystem/core/contracts/engine.contract
 * 
 * @module contracts
 */

import type { WorkflowDefinition } from '../types/workflow.interfaces.js';

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
