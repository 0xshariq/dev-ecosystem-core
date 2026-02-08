/**
 * Ecosystem Core - Workflow Schema Exports
 * 
 * Central export point for all workflow schema definitions, validators, and types.
 * Import from here rather than individual files for consistency.
 * 
 * @example
 * ```typescript
 * import { 
 *   OrbytWorkflowSchema, 
 *   WorkflowDefinition,
 *   validateWorkflow 
 * } from '@ecosystem-core/schemas';
 * ```
 */

import {
  OrbytWorkflowSchema,
  ValidatedOrbytWorkflowSchema,
  type WorkflowDefinitionZod,
} from './workflow.schema.zod.js';

// ============================================================================
// ZOD SCHEMAS - Runtime Validation
// ============================================================================

export {
  // Main Schema
  OrbytWorkflowSchema,
  ValidatedOrbytWorkflowSchema,
  
  // Sub-schemas
  StepSchema,
  MetadataSchema,
  AnnotationsSchema,
  TriggerSchema,
  SecretsSchema,
  InputsSchema,
  InputDefinitionSchema,
  ContextSchema,
  DefaultsSchema,
  PoliciesSchema,
  PermissionsSchema,
  ResourcesSchema,
  RetryConfigSchema,
  WorkflowBodySchema,
  
  // Type Exports from Zod
  type WorkflowDefinitionZod as ZodWorkflowDefinition,
  type ValidatedWorkflowDefinition,
  type StepDefinition as ZodStepDefinition,
  type TriggerDefinition,
  type MetadataDefinition,
  type SecretsDefinition,
  type InputsDefinition,
  type InputDefinition,
  type ContextDefinition,
  type DefaultsDefinition,
  type PoliciesDefinition,
  type PermissionsDefinition,
  type ResourcesDefinition,
  type RetryConfig,
} from './workflow.schema.zod.js';

// ============================================================================
// TYPESCRIPT TYPES - Type Definitions
// ============================================================================

export {
  // Enums
  WorkflowKind,
  TriggerType,
  FailurePolicy,
  BackoffStrategy,
  SandboxLevel,
  ExecutionEnvironment,
  
  // Main Types
  type WorkflowDefinition,
  type WorkflowMetadata,
  type WorkflowAnnotations,
  type WorkflowTrigger,
  type ManualTrigger,
  type CronTrigger,
  type EventTrigger,
  type WebhookTrigger,
  type WorkflowSecrets,
  type WorkflowInputs,
  type WorkflowContext,
  type WorkflowDefaults,
  type WorkflowPolicies,
  type WorkflowPermissions,
  type WorkflowResources,
  type WorkflowBody,
  type WorkflowLifecycleHooks,
  
  // Step Types
  type WorkflowStepDefinition,
  type StepOutputMapping,
  type StepCondition,
  
  // Helper Types
  type VariableReference,
  type ActionReference,
  type SecretReference,
  type InputType,
  type TimeoutSpec,
  type FilesystemPermissions,
  type NetworkPermissions,
  
  // Version Markers
  type V1Field,
  type FutureField,
} from '../types/workflow.interfaces.js';

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate a workflow definition against the Zod schema
 * 
 * @param workflow - Raw workflow object to validate
 * @returns Validated workflow definition
 * @throws ZodError if validation fails
 * 
 * @example
 * ```typescript
 * try {
 *   const validated = validateWorkflow(rawWorkflow);
 *   console.log('Workflow is valid');
 * } catch (error) {
 *   console.error('Validation failed:', error.errors);
 * }
 * ```
 */
export function validateWorkflow(workflow: unknown) {
  return ValidatedOrbytWorkflowSchema.parse(workflow);
}

/**
 * Safely validate a workflow, returning success or error
 * 
 * @param workflow - Raw workflow object to validate
 * @returns Success result with data, or error result with issues
 * 
 * @example
 * ```typescript
 * const result = safeValidateWorkflow(rawWorkflow);
 * if (result.success) {
 *   console.log('Valid workflow:', result.data);
 * } else {
 *   console.error('Invalid workflow:', result.error.issues);
 * }
 * ```
 */
export function safeValidateWorkflow(workflow: unknown) {
  return ValidatedOrbytWorkflowSchema.safeParse(workflow);
}

/**
 * Validate just the structure (without refinements)
 * Faster validation for initial checks
 */
export function validateWorkflowStructure(workflow: unknown) {
  return OrbytWorkflowSchema.parse(workflow);
}

/**
 * Check if an object matches the workflow shape without throwing
 */
export function isWorkflowDefinition(obj: unknown): obj is WorkflowDefinitionZod {
  return OrbytWorkflowSchema.safeParse(obj).success;
}

// ============================================================================
// JSON SCHEMA PATH
// ============================================================================

/**
 * Path to the JSON Schema file for tooling integration
 * Use this for:
 * - IDE autocomplete
 * - Documentation generation
 * - External validators
 * - OpenAPI/Swagger specs
 */
export const WORKFLOW_JSON_SCHEMA_PATH = new URL('./workflow.schema.json', import.meta.url).pathname;

/**
 * Get the JSON Schema as an object
 * Useful for embedding in other schemas or tools
 */
export async function getWorkflowJsonSchema(): Promise<object> {
  const fs = await import('fs/promises');
  const content = await fs.readFile(WORKFLOW_JSON_SCHEMA_PATH, 'utf-8');
  return JSON.parse(content);
}
