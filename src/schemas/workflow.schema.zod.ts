import { z } from 'zod';

/**
 * Orbyt Workflow Schema - Zod Validation
 * 
 * Runtime validation schema for Orbyt workflows. This schema provides:
 * - Structural validation
 * - Type checking
 * - Custom refinements for business rules
 * - Type inference for TypeScript
 * 
 * Use this for validating workflows before execution.
 */

// ============================================================================
// METADATA SCHEMAS
// ============================================================================

export const MetadataSchema = z.object({
  name: z.string().optional().describe('Human-readable workflow name'),
  description: z.string().optional().describe('Detailed workflow description'),
  tags: z.array(z.string()).optional().describe('Categorization tags'),
  owner: z.string().optional().describe('Owner team or individual'),
  version: z.string().optional().describe('Workflow version (not schema version)'),
  createdAt: z.string().datetime().optional().describe('Creation timestamp'),
  updatedAt: z.string().datetime().optional().describe('Last update timestamp'),
}).passthrough().describe('Workflow metadata for organization and discovery');

export const AnnotationsSchema = z.object({
  'ai.intent': z.string().optional(),
  'ui.group': z.string().optional(),
  'ui.icon': z.string().optional(),
}).passthrough().describe('Zero-runtime-impact hints for AI and UI');

// ============================================================================
// TRIGGER SCHEMAS
// ============================================================================

const ManualTriggerSchema = z.object({
  type: z.literal('manual'),
}).describe('Manual trigger - workflow must be explicitly invoked');

const CronTriggerSchema = z.object({
  type: z.literal('cron'),
  schedule: z.string().describe('Cron expression for scheduling'),
}).describe('Cron-based scheduled trigger');

const EventTriggerSchema = z.object({
  type: z.literal('event'),
  source: z.string().describe('Event source identifier'),
  filters: z.record(z.string(), z.any()).optional().describe('Event filtering conditions'),
}).describe('Event-driven trigger');

const WebhookTriggerSchema = z.object({
  type: z.literal('webhook'),
  endpoint: z.string().describe('Webhook endpoint path'),
  filters: z.record(z.string(), z.any()).optional(),
}).describe('Webhook trigger');

export const TriggerSchema = z.discriminatedUnion('type', [
  ManualTriggerSchema,
  CronTriggerSchema,
  EventTriggerSchema,
  WebhookTriggerSchema,
]).describe('Workflow trigger definition');

// ============================================================================
// SECRETS SCHEMA
// ============================================================================

export const SecretsSchema = z.object({
  vault: z.string().default('vaulta').describe('Secret vault provider'),
  keys: z.record(
    z.string(),
    z.string().regex(/^[a-zA-Z0-9_-]+:.+$/, 'Secret reference must be in format: provider:path')
  ).describe('Map of logical names to provider-specific secret paths'),
}).describe('External secret references - values never stored in workflow');

// ============================================================================
// INPUTS SCHEMA
// ============================================================================

export const InputDefinitionSchema = z.object({
  type: z.enum(['string', 'number', 'boolean', 'array', 'object']).optional(),
  required: z.boolean().default(false),
  default: z.any().optional(),
  description: z.string().optional(),
}).describe('Input parameter definition');

export const InputsSchema = z.record(z.string(), InputDefinitionSchema)
  .describe('Runtime parameters for workflow reusability');

// ============================================================================
// CONTEXT SCHEMA
// ============================================================================

export const ContextSchema = z.object({
  env: z.enum(['local', 'dev', 'staging', 'prod']).optional(),
  platform: z.string().optional(),
  workspace: z.string().optional(),
}).passthrough().describe('Runtime environment context (read-only for steps)');

// ============================================================================
// DEFAULTS SCHEMA
// ============================================================================

export const RetryConfigSchema = z.object({
  max: z.number().int().min(0).describe('Maximum retry attempts'),
  backoff: z.enum(['linear', 'exponential']).optional().describe('Backoff strategy'),
  delay: z.number().int().min(0).optional().describe('Initial delay in milliseconds'),
}).describe('Retry configuration');

export const DefaultsSchema = z.object({
  retry: RetryConfigSchema.optional(),
  timeout: z.string().regex(/^[0-9]+(ms|s|m|h|d)$/).optional().describe('Default step timeout'),
  adapter: z.string().optional().describe('Default adapter'),
}).passthrough().describe('Default settings applied to all steps');

// ============================================================================
// POLICIES SCHEMA
// ============================================================================

export const PoliciesSchema = z.object({
  failure: z.enum(['stop', 'continue', 'isolate']).default('stop'),
  concurrency: z.number().int().min(1).default(1),
  sandbox: z.enum(['none', 'basic', 'strict']).default('basic'),
}).passthrough().describe('Execution policies and rules');

// ============================================================================
// PERMISSIONS SCHEMA
// ============================================================================

export const PermissionsSchema = z.object({
  fs: z.object({
    read: z.array(z.string()).optional(),
    write: z.array(z.string()).optional(),
  }).optional(),
  network: z.object({
    allow: z.array(z.string()).optional(),
    deny: z.array(z.string()).optional(),
  }).optional(),
}).passthrough().describe('Fine-grained security permissions');

// ============================================================================
// RESOURCES SCHEMA
// ============================================================================

export const ResourcesSchema = z.object({
  cpu: z.union([z.number(), z.string()]).optional(),
  memory: z.string().optional(),
  disk: z.string().optional(),
  timeout: z.string().optional(),
}).passthrough().describe('Resource constraints for execution');

// ============================================================================
// STEP SCHEMA
// ============================================================================

export const StepSchema = z.object({
  id: z.string()
    .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/, 'Step ID must start with letter and contain only alphanumeric, underscore, or hyphen')
    .describe('Unique step identifier'),
  
  name: z.string().optional().describe('Human-readable step name'),
  
  uses: z.string()
    .regex(/^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, 'uses must be in format: namespace.action or namespace.domain.action')
    .describe('Action to execute - universal adapter reference'),
  
  with: z.record(z.string(), z.any()).optional()
    .describe('Adapter-specific input parameters. Supports variable interpolation.'),
  
  when: z.string().optional()
    .describe('Conditional execution expression'),
  
  needs: z.array(z.string()).optional()
    .describe('Explicit step dependencies'),
  
  retry: RetryConfigSchema.optional()
    .describe('Step-specific retry config (overrides defaults)'),
  
  timeout: z.string().regex(/^[0-9]+(ms|s|m|h)$/).optional()
    .describe('Step execution timeout'),
  
  continueOnError: z.boolean().default(false)
    .describe('Continue workflow even if step fails'),
  
  outputs: z.record(z.string(), z.string()).optional()
    .describe('Map step outputs to named values'),
  
  env: z.record(z.string(), z.string()).optional()
    .describe('Environment variables for this step'),
}).describe('Individual workflow step definition');

// ============================================================================
// WORKFLOW SCHEMA
// ============================================================================

export const WorkflowBodySchema = z.object({
  steps: z.array(StepSchema).min(1, 'Workflow must have at least one step'),
}).describe('The core workflow execution definition');

// ============================================================================
// MAIN WORKFLOW SCHEMA
// ============================================================================

export const OrbytWorkflowSchema = z.object({
  version: z.string()
    .regex(/^[0-9]+\.[0-9]+(\.[0-9]+)?$/, 'Version must follow semantic versioning (e.g., 1.0 or 1.0.0)')
    .describe('Schema version'),
  
  kind: z.enum(['workflow', 'pipeline', 'job', 'playbook', 'automation'])
    .default('workflow')
    .describe('Type of executable'),
  
  metadata: MetadataSchema.optional(),
  annotations: AnnotationsSchema.optional(),
  triggers: z.array(TriggerSchema).optional(),
  secrets: SecretsSchema.optional(),
  inputs: InputsSchema.optional(),
  context: ContextSchema.optional(),
  defaults: DefaultsSchema.optional(),
  policies: PoliciesSchema.optional(),
  permissions: PermissionsSchema.optional(),
  resources: ResourcesSchema.optional(),
  
  workflow: WorkflowBodySchema.describe('Core workflow execution definition'),
  
  outputs: z.record(z.string(), z.string()).optional()
    .describe('Final workflow outputs returned to caller'),
  
  on: z.object({
    success: z.array(z.any()).optional(),
    failure: z.array(z.any()).optional(),
    always: z.array(z.any()).optional(),
  }).optional().describe('Lifecycle hooks (reserved for future)'),
})
  .strict() // No additional properties allowed at root level
  .describe('Complete Orbyt workflow definition');

// ============================================================================
// REFINEMENTS - Business Logic Validation
// ============================================================================

export const ValidatedOrbytWorkflowSchema = OrbytWorkflowSchema
  .refine(
    (workflow) => {
      // Check for duplicate step IDs
      const stepIds = workflow.workflow.steps.map(step => step.id);
      const uniqueIds = new Set(stepIds);
      return stepIds.length === uniqueIds.size;
    },
    {
      message: 'Step IDs must be unique within a workflow',
      path: ['workflow', 'steps'],
    }
  )
  .refine(
    (workflow) => {
      // Validate step dependencies exist
      const stepIds = new Set(workflow.workflow.steps.map(step => step.id));
      for (const step of workflow.workflow.steps) {
        if (step.needs) {
          for (const dependency of step.needs) {
            if (!stepIds.has(dependency)) {
              return false;
            }
          }
        }
      }
      return true;
    },
    {
      message: 'Step dependencies must reference existing step IDs',
      path: ['workflow', 'steps'],
    }
  )
  .refine(
    (workflow) => {
      // Validate cron triggers have schedule
      if (workflow.triggers) {
        for (const trigger of workflow.triggers) {
          if (trigger.type === 'cron' && !trigger.schedule) {
            return false;
          }
        }
      }
      return true;
    },
    {
      message: 'Cron triggers must have a schedule field',
      path: ['triggers'],
    }
  );

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type WorkflowDefinitionZod = z.infer<typeof OrbytWorkflowSchema>;
export type ValidatedWorkflowDefinition = z.infer<typeof ValidatedOrbytWorkflowSchema>;
export type StepDefinition = z.infer<typeof StepSchema>;
export type TriggerDefinition = z.infer<typeof TriggerSchema>;
export type MetadataDefinition = z.infer<typeof MetadataSchema>;
export type SecretsDefinition = z.infer<typeof SecretsSchema>;
export type InputsDefinition = z.infer<typeof InputsSchema>;
export type InputDefinition = z.infer<typeof InputDefinitionSchema>;
export type ContextDefinition = z.infer<typeof ContextSchema>;
export type DefaultsDefinition = z.infer<typeof DefaultsSchema>;
export type PoliciesDefinition = z.infer<typeof PoliciesSchema>;
export type PermissionsDefinition = z.infer<typeof PermissionsSchema>;
export type ResourcesDefinition = z.infer<typeof ResourcesSchema>;
export type RetryConfig = z.infer<typeof RetryConfigSchema>;
