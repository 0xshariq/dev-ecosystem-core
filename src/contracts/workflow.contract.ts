/**
 * @dev-ecosystem/core - Workflow Contract
 * 
 * Defines the contract for workflow execution and management.
 * Unifies workflow concepts across Orbyt, DevForge, and other products.
 */

import type { WorkflowDefinition, WorkflowExecutionOptions, WorkflowExecutionResult } from './engine.contract';

/**
 * Workflow storage interface
 */
export interface IWorkflowStorage {
  /**
   * Save a workflow definition
   */
  save(workflow: WorkflowDefinition): Promise<string>;
  
  /**
   * Load a workflow by ID or name
   */
  load(identifier: string): Promise<WorkflowDefinition | null>;
  
  /**
   * Delete a workflow
   */
  delete(identifier: string): Promise<void>;
  
  /**
   * List all workflows
   */
  list(filter?: WorkflowFilter): Promise<WorkflowSummary[]>;
  
  /**
   * Check if workflow exists
   */
  exists(identifier: string): Promise<boolean>;
  
  /**
   * Update workflow metadata
   */
  updateMetadata(identifier: string, metadata: Partial<WorkflowDefinition['metadata']>): Promise<void>;
}

/**
 * Workflow filter
 */
export interface WorkflowFilter {
  tags?: string[];
  category?: string;
  author?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

/**
 * Workflow summary
 */
export interface WorkflowSummary {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  version: string;
  author?: string;
  tags?: string[];
  category?: string;
  stepCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastExecutedAt?: Date;
  executionCount: number;
}

/**
 * Workflow execution history interface
 */
export interface IWorkflowHistory {
  /**
   * Save execution result
   */
  save(result: WorkflowExecutionResult): Promise<void>;
  
  /**
   * Get execution by run ID
   */
  get(runId: string): Promise<WorkflowExecutionResult | null>;
  
  /**
   * List executions
   */
  list(filter?: WorkflowHistoryFilter): Promise<WorkflowExecutionResult[]>;
  
  /**
   * Delete execution history
   */
  delete(runId: string): Promise<void>;
  
  /**
   * Get execution statistics
   */
  getStats(workflowName: string): Promise<WorkflowStats>;
}

/**
 * Workflow history filter
 */
export interface WorkflowHistoryFilter {
  workflowName?: string;
  status?: string[];
  from?: Date;
  to?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Workflow statistics
 */
export interface WorkflowStats {
  workflowName: string;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  averageDuration: number;
  lastRunAt?: Date;
  successRate: number;
}

/**
 * Workflow scheduler interface
 */
export interface IWorkflowScheduler {
  /**
   * Schedule a workflow
   */
  schedule(workflowId: string, trigger: ScheduleTrigger, options?: WorkflowExecutionOptions): Promise<string>;
  
  /**
   * Unschedule a workflow
   */
  unschedule(scheduleId: string): Promise<void>;
  
  /**
   * List scheduled workflows
   */
  list(): Promise<ScheduledWorkflow[]>;
  
  /**
   * Enable/disable a schedule
   */
  setEnabled(scheduleId: string, enabled: boolean): Promise<void>;
  
  /**
   * Get next run time
   */
  getNextRun(scheduleId: string): Promise<Date | null>;
}

/**
 * Schedule trigger
 */
export interface ScheduleTrigger {
  type: 'cron' | 'interval' | 'once';
  cron?: string;
  interval?: string; // e.g., '5m', '1h', '1d'
  at?: Date;
  timezone?: string;
}

/**
 * Scheduled workflow
 */
export interface ScheduledWorkflow {
  id: string;
  workflowId: string;
  workflowName: string;
  trigger: ScheduleTrigger;
  enabled: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  runCount: number;
  createdAt: Date;
}

/**
 * Workflow template interface
 */
export interface IWorkflowTemplate {
  /**
   * Create workflow from template
   */
  create(templateId: string, variables: Record<string, unknown>): Promise<WorkflowDefinition>;
  
  /**
   * List available templates
   */
  list(category?: string): Promise<WorkflowTemplateSummary[]>;
  
  /**
   * Get template details
   */
  get(templateId: string): Promise<WorkflowTemplate>;
  
  /**
   * Save custom template
   */
  save(template: WorkflowTemplate): Promise<string>;
  
  /**
   * Delete template
   */
  delete(templateId: string): Promise<void>;
}

/**
 * Workflow template
 */
export interface WorkflowTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  version: string;
  variables: TemplateVariable[];
  workflow: Partial<WorkflowDefinition>;
  examples?: TemplateExample[];
}

export interface TemplateVariable {
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  default?: unknown;
}

export interface TemplateExample {
  title: string;
  description: string;
  variables: Record<string, unknown>;
}

export interface WorkflowTemplateSummary {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  tags: string[];
}

/**
 * Workflow validator interface
 */
export interface IWorkflowValidator {
  /**
   * Validate workflow definition
   */
  validate(workflow: WorkflowDefinition): Promise<ValidationResult>;
  
  /**
   * Validate workflow file
   */
  validateFile(filePath: string): Promise<ValidationResult>;
  
  /**
   * Check for circular dependencies
   */
  checkCircularDependencies(workflow: WorkflowDefinition): boolean;
  
  /**
   * Validate adapter references
   */
  validateAdapters(workflow: WorkflowDefinition): Promise<AdapterValidationResult>;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  path: string;
  message: string;
  code: string;
}

export interface AdapterValidationResult {
  valid: boolean;
  missingAdapters: string[];
  invalidActions: Array<{ adapter: string; action: string }>;
}
