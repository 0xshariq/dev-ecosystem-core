/**
 * Simple type aliases for workflow schemas
 * @module workflow.type-aliases
 */

import type { CronTrigger, EventTrigger, ManualTrigger, OutputSchema, WebhookTrigger, WorkflowInputDefinition } from "./workflow.interfaces";

/**
 * Scalar and complex input types for workflow variables
 */
export type InputType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'array'
  | 'object'
  | 'secret';

/**
 * Timeout specification - ISO 8601 duration or numeric seconds
 */
export type TimeoutSpec = string | number;

/**
 * Mapping of step outputs to workflow variables - key = target var, value = source path
 */
export type StepOutputMapping = Record<string, string>;

/**
 * Step execution condition - expression string
 * Supports $inputs.*, $secrets.*, $steps.*.outputs.*, $context.*
 */
export type StepCondition = string;

/**
 * Runtime variable reference - used for ${variable} interpolation
 * @example "${inputs.name}", "${context.workspace}"
 */
export type VariableReference = string;

/**
 * Reference to a step or action - used for step dependencies
 * @example "build", "test", "deploy"
 */
export type ActionReference = string;

/**
 * Secret reference for secure data - used for ${secrets.*} interpolation
 * @example "${secrets.apiKey}", "${secrets.dbPassword}"
 */
export type SecretReference = string;

/**
 * Marker for V1 fields - used for tracking schema evolution
 */
export type V1Field = true;

/**
 * Marker for future fields - reserved for upcoming features
 */
export type FutureField = true;

/**
 * Workflow version string
 */
export type WorkflowVersion = string;

/**
 * Retry policy identifier
 */
export type RetryPolicy = string;

/**
 * Caching strategy identifier
 */
export type CacheStrategy = string;

/**
 * Resource constraint specification
 */
export type ResourceConstraints = Record<string, any>;

/**
 * Environment variable definitions
 */
export type EnvironmentVariables = Record<string, string>;

/**
 * Metadata key-value pairs
 */
export type Metadata = Record<string, any>;

/**
 * Tags for categorization
 */
export type Tags = string[];

/**
 * Permission scope identifier
 */
export type PermissionScope = string;

/**
 * Audit log entry structure
 */
export type AuditLogEntry = Record<string, any>;

/**
 * Execution context data
 */
export type ExecutionContext = Record<string, any>;

/**
 * Step dependencies array
 */
export type StepDependencies = string[];

/**
 * Transformation function definition
 */
export type TransformFunction = string;

/**
 * Validation rule definition
 */
export type ValidationRule = Record<string, any>;

/**
 * Notification configuration
 */
export type NotificationConfig = Record<string, any>;

/**
 * Webhook payload structure
 */
export type WebhookPayload = Record<string, any>;

/**
 * Schedule configuration
 */
export type ScheduleConfig = Record<string, any>;

/**
 * Filter expression string
 */
export type FilterExpression = string;

/**
 * Aggregation configuration
 */
export type AggregationConfig = Record<string, any>;

/**
 * Parallel execution configuration
 */
export type ParallelConfig = Record<string, any>;

/**
 * Union of all trigger types (override type alias with proper definition)
 * 
 * @category Triggers
 */
export type WorkflowTrigger = ManualTrigger | CronTrigger | EventTrigger | WebhookTrigger;

/**
 * Runtime parameters for workflow reusability (override type alias with proper definition)
 * 
 * @category Inputs
 */
export type WorkflowInputs = Record<string, WorkflowInputDefinition>;

/**
 * Output schema mapping (override type alias with proper definition)
 * 
 * @category Contracts
 * @status future - reserved for type safety
 */
export type OutputsSchema = Record<string, OutputSchema>;