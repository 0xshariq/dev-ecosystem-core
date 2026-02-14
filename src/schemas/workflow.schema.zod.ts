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

  // Version tracking flags (future-safe)
  v1: z.boolean().optional().describe('Marks workflow as using v1 features'),
  future: z.boolean().optional().describe('Marks workflow as using future/experimental features'),
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
// FUTURE-SAFE SCHEMAS
// ============================================================================

// 1. Identity & Lineage
export const WorkflowSourceSchema = z.object({
  type: z.enum(['marketplace', 'local', 'generated', 'api']),
  ref: z.string().optional(),
}).describe('Workflow source information');

export const IdentitySchema = z.object({
  workflowId: z.string().optional(),
  parentWorkflow: z.string().optional(),
  source: WorkflowSourceSchema.optional(),
}).optional().describe('Workflow identity and lineage tracking (future: traceability)');

// 2. Execution Strategy
export const ExecutionStrategySchema = z.object({
  mode: z.enum(['local', 'docker', 'remote', 'distributed']).optional(),
  isolation: z.enum(['process', 'container', 'vm']).optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
}).optional().describe('Execution strategy and runtime configuration (future: multi-environment)');

// 3. Output Contracts
export const OutputSchemaDefinitionSchema = z.object({
  type: z.enum(['string', 'number', 'boolean', 'array', 'object']),
  required: z.boolean().optional(),
  description: z.string().optional(),
}).describe('Output schema definition');

export const OutputsSchemaSchema = z.record(z.string(), OutputSchemaDefinitionSchema)
  .optional()
  .describe('Output contract definition (future: type safety)');

// 4. Telemetry Controls
export const TelemetrySchema = z.object({
  enabled: z.boolean().optional(),
  level: z.enum(['minimal', 'standard', 'verbose']).optional(),
  redact: z.array(z.string()).optional(),
}).optional().describe('Telemetry and observability controls (future: privacy)');

// 5. Cost & Usage Accounting
export const AccountingSchema = z.object({
  billable: z.boolean().optional(),
  unit: z.enum(['execution', 'step', 'minute']).optional(),
  tags: z.record(z.string(), z.string()).optional(),
}).optional().describe('Cost and usage accounting (future: monetization)');

// 6. Version Compatibility
export const EngineCompatibilitySchema = z.object({
  min: z.string().optional(),
  max: z.string().optional(),
}).describe('Engine version constraints');

export const CompatibilitySchema = z.object({
  engine: EngineCompatibilitySchema.optional(),
  adapters: z.record(z.string(), z.string()).optional(),
}).optional().describe('Version compatibility constraints (future: safe upgrades)');

// 7. Failure Semantics
export const FailureSemanticsSchema = z.object({
  onStepFailure: z.enum(['retry', 'skip', 'rollback', 'isolate', 'abort']).optional(),
  onTimeout: z.enum(['abort', 'retry', 'partial']).optional(),
}).optional().describe('Advanced failure handling semantics (future: complex workflows)');

// 8. Rollback & Compensation
export const StepRollbackSchema = z.object({
  uses: z.string(),
  with: z.record(z.string(), z.any()).optional(),
}).describe('Step-level rollback configuration');

export const RollbackSchema = z.object({
  enabled: z.boolean().optional(),
  strategy: z.enum(['reverse', 'custom']).optional(),
}).optional().describe('Workflow-level rollback configuration (future: transactional workflows)');

// 9. Governance
export const GovernanceSchema = z.object({
  reviewers: z.array(z.string()).optional(),
  approvalRequired: z.boolean().optional(),
}).passthrough().optional().describe('Governance and team metadata (future: enterprise)');

// ============================================================================
// USAGE & COUNTING SCHEMAS
// ============================================================================

/**
 * Workflow-level usage tracking schema
 * Engine counts, bridges transport, website displays
 */
export const WorkflowUsageSchema = z.object({
  track: z.boolean().optional().describe('Enable usage tracking for this workflow'),
  scope: z.enum(['ecosystem', 'component', 'workflow']).or(z.string()).optional()
    .describe('Aggregation scope'),
  category: z.enum(['automation', 'pipeline', 'batch', 'job']).or(z.string()).optional()
    .describe('Usage category for billing'),
  billable: z.boolean().optional().describe('Whether this workflow is billable'),
  product: z.enum(['orbyt', 'mediaproc', 'devforge', 'vaulta', 'dev-companion']).or(z.string()).optional()
    .describe('Product/component identifier'),
  tags: z.array(z.string()).optional().describe('Tags for analytics'),
}).optional().describe('Usage tracking configuration (production: minimal, final)');

/**
 * Step-level usage tracking schema
 * Allows per-step billing customization
 */
export const StepUsageSchema = z.object({
  billable: z.boolean().optional().describe('Override workflow billable setting'),
  unit: z.string().optional().describe('Billing unit (e.g., request, execution, second)'),
  weight: z.number().min(0).optional().describe('Cost multiplier (default: 1)'),
}).optional().describe('Step-level usage tracking override (production: per-step billing)');

// ============================================================================
// EXECUTION STRATEGY SCHEMAS
// ============================================================================

export const ExecutionStrategyConfigSchema = z.object({
  type: z.enum(['sequential', 'parallel', 'matrix', 'fanout', 'map-reduce']).or(z.string()).optional()
    .describe('Execution strategy type'),
  maxParallel: z.number().int().min(1).optional()
    .describe('Maximum parallel execution count'),
  matrix: z.record(z.string(), z.array(z.any())).optional()
    .describe('Matrix dimensions for matrix strategy'),
}).optional().describe('Execution strategy configuration (production: universal patterns)');

// ============================================================================
// CAPABILITY & REQUIREMENTS SCHEMAS
// ============================================================================

export const StepRequirementsSchema = z.object({
  capabilities: z.array(z.string()).optional()
    .describe('Required capabilities (e.g., filesystem.write, network.http, gpu.optional)'),
}).passthrough().optional().describe('Step capability requirements (future: platform-agnostic)');

// ============================================================================  
// EXECUTION HINTS SCHEMAS
// ============================================================================

export const ExecutionHintsSchema = z.object({
  cacheable: z.boolean().optional().describe('Can results be cached'),
  idempotent: z.boolean().optional().describe('Is step idempotent'),
  heavy: z.boolean().optional().describe('Is step computationally heavy'),
  cost: z.enum(['free', 'low', 'medium', 'high']).or(z.string()).optional()
    .describe('Cost classification'),
}).passthrough().optional().describe('Execution hints for optimization (future: smart execution)');

// ============================================================================
// DATA CONTRACTS SCHEMAS
// ============================================================================

export const SchemaReferenceSchema = z.object({
  schema: z.string().optional().describe('Schema file path or URL'),
  inline: z.record(z.string(), z.any()).optional().describe('Inline schema definition'),
}).describe('Schema reference');

export const StepContractsSchema = z.object({
  input: SchemaReferenceSchema.optional().describe('Input schema'),
  output: SchemaReferenceSchema.optional().describe('Output schema'),
}).optional().describe('Step data contracts (future: validation & reliability)');

// ============================================================================
// ENVIRONMENT PROFILES SCHEMAS
// ============================================================================

export const EnvironmentProfileSchema = z.object({
  adapter: z.string().optional().describe('Adapter override for this environment'),
  resources: z.object({
    cpu: z.union([z.number(), z.string()]).optional(),
    memory: z.string().optional(),
    disk: z.string().optional(),
    gpu: z.union([z.number(), z.string()]).optional(),
  }).optional().describe('Resources for this environment'),
}).passthrough().describe('Environment-specific configuration');

export const EnvironmentProfilesSchema = z.record(z.string(), EnvironmentProfileSchema)
  .optional()
  .describe('Environment profiles map (future: write once, run anywhere)');

// ============================================================================
// STEP FAILURE HANDLING SCHEMAS
// ============================================================================

export const FailureNotificationSchema = z.object({
  channel: z.string().optional().describe('Notification channel (e.g., slack, email)'),
}).passthrough().describe('Notification configuration');

export const StepOnFailureSchema = z.object({
  action: z.enum(['retry', 'skip', 'compensate', 'notify', 'abort']).or(z.string()).optional()
    .describe('Action to take on failure'),
  notify: FailureNotificationSchema.optional().describe('Notification configuration'),
  compensate: z.string().optional().describe('Compensation workflow reference'),
}).optional().describe('Step-level failure handling (future: enterprise control)');

// ============================================================================
// TELEMETRY SCHEMAS
// ============================================================================

export const StepTelemetrySchema = z.object({
  trace: z.union([z.boolean(), z.enum(['off', 'minimal', 'standard', 'detailed'])]).optional()
    .describe('Enable tracing'),
  metrics: z.enum(['off', 'basic', 'detailed']).or(z.string()).optional()
    .describe('Metrics detail level'),
  logs: z.enum(['off', 'minimal', 'standard', 'verbose']).or(z.string()).optional()
    .describe('Logs detail level'),
}).optional().describe('Step-level telemetry configuration (future: monitoring)');

// ============================================================================
// COMPLIANCE SCHEMAS
// ============================================================================

export const DataClassificationSchema = z.object({
  pii: z.boolean().optional().describe('Contains PII'),
  retention: z.object({
    logs: z.string().optional().describe('Log retention (e.g., 30d)'),
    outputs: z.string().optional().describe('Output retention (e.g., 90d)'),
  }).optional().describe('Data retention policies'),
}).passthrough().describe('Data classification');

export const ComplianceSchema = z.object({
  data: DataClassificationSchema.optional().describe('Data classification'),
}).passthrough().optional().describe('Compliance metadata (future: regulated environments)');

// ============================================================================  
// PROVENANCE SCHEMAS
// ============================================================================

export const SourceRepositorySchema = z.object({
  repo: z.string().optional().describe('Repository URL'),
  commit: z.string().optional().describe('Commit hash'),
  branch: z.string().optional().describe('Branch name'),
}).describe('Source repository information');

export const ProvenanceSchema = z.object({
  generatedBy: z.string().optional().describe('Tool or system that generated this workflow'),
  source: SourceRepositorySchema.optional().describe('Source repository information'),
  generatedAt: z.string().datetime().optional().describe('Generation timestamp'),
}).passthrough().optional().describe('Workflow provenance tracking (future: AI-generated & audit)');

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

  // Usage tracking
  usage: StepUsageSchema
    .describe('Usage tracking override (production: per-step billing)'),

  // Production-ready universal fields
  ref: z.string().optional()
    .describe('Versioned step reference (e.g., mediaproc.image.resize@^1)'),

  requires: StepRequirementsSchema
    .describe('Capability requirements (future: platform-agnostic execution)'),

  hints: ExecutionHintsSchema
    .describe('Execution hints for optimization (future: smart execution)'),

  contracts: StepContractsSchema
    .describe('Data contracts for validation (future: reliability)'),

  profiles: EnvironmentProfilesSchema
    .describe('Environment-specific profiles (future: portability)'),

  onFailure: StepOnFailureSchema
    .describe('Failure handling configuration (future: enterprise control)'),

  telemetry: StepTelemetrySchema
    .describe('Telemetry configuration (future: monitoring)'),

  rollback: StepRollbackSchema.optional()
    .describe('Step-level rollback logic (future)'),
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

  // Usage tracking
  usage: WorkflowUsageSchema
    .describe('Usage tracking configuration (production: minimal, final)'),

  // Production-ready universal fields
  strategy: ExecutionStrategyConfigSchema
    .describe('Execution strategy (production: universal patterns)'),

  profiles: EnvironmentProfilesSchema
    .describe('Environment-specific profiles (future: write once, run anywhere)'),

  compliance: ComplianceSchema
    .describe('Compliance metadata (future: regulated environments)'),

  provenance: ProvenanceSchema
    .describe('Provenance tracking (future: AI-generated workflows & audit)'),

  execution: ExecutionStrategySchema
    .describe('Execution strategy (future: multi-environment)'),

  outputsSchema: OutputsSchemaSchema
    .describe('Output schema for validation (future: type safety)'),

  telemetry: TelemetrySchema
    .describe('Telemetry controls (future: privacy)'),

  accounting: AccountingSchema
    .describe('Cost and usage accounting (future: monetization)'),

  compatibility: CompatibilitySchema
    .describe('Version compatibility (future: safe upgrades)'),

  failurePolicy: FailureSemanticsSchema
    .describe('Failure semantics (future: complex workflows)'),

  rollback: RollbackSchema
    .describe('Rollback configuration (future: transactional workflows)'),

  governance: GovernanceSchema
    .describe('Governance metadata (future: enterprise)'),
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
