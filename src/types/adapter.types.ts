/**
 * Adapter Types
 * 
 * Core adapter interfaces and types for the Orbyt workflow engine.
 * All adapters must implement these interfaces to integrate with the engine.
 * 
 * This provides a standardized contract for:
 * - Adapter implementation (Adapter interface)
 * - Execution results (AdapterResult)
 * - Execution context (AdapterContext)
 * - Result builders and helpers
 * 
 * @module types/adapter
 */

/** JSON primitive value */
export type JsonPrimitive = string | number | boolean | null;

/** JSON object value */
export type JsonObject = { [key: string]: JsonValue };

/** JSON array value */
export type JsonArray = JsonValue[];

/** Generic JSON value */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/** Supported adapter contract versions */
export const ADAPTER_CONTRACT_VERSION = '1.0' as const;
export type AdapterContractVersion = typeof ADAPTER_CONTRACT_VERSION;

/**
 * Execution metrics captured during adapter execution
 */
export interface ExecutionMetrics {
  /** Duration in milliseconds */
  durationMs: number;

  /** Memory used in bytes (if available) */
  memoryUsed?: number;

  /** Number of retries attempted */
  retries?: number;

  /** Additional adapter-specific metrics */
  [key: string]: JsonValue | undefined;
}

/**
 * Error information when adapter execution fails
 */
export interface AdapterError {
  /** Error message */
  message: string;

  /** Error code (if available) */
  code?: string | number;

  /** Stack trace (if available) */
  stack?: string;

  /** Additional error context */
  details?: Record<string, JsonValue>;
}

/**
 * Standardized adapter execution result
 * 
 * All adapters must return results in this format.
 * The generic type T allows adapter-specific output data.
 */
export interface AdapterResult<T = JsonValue> {
  /** Whether execution was successful */
  success: boolean;

  /** Adapter-specific output data (undefined on failure) */
  output?: T;

  /** Error information (only present on failure) */
  error?: AdapterError;

  /** Execution logs (stdout, stderr, or custom messages) */
  logs?: string[];

  /** Execution metrics */
  metrics: ExecutionMetrics;

  /** Effects caused by this execution (for observability) */
  effects?: string[];

  /** Events emitted during execution (for event bus) */
  emits?: string[];

  /** Warnings encountered (non-fatal) */
  warnings?: string[];
}

/**
 * Adapter capabilities for future-proof execution planning
 */
export interface AdapterCapabilities {
  /** Actions this adapter can perform */
  actions: string[];

  /** Whether adapter supports concurrent execution */
  concurrent?: boolean;

  /** Whether adapter results are cacheable */
  cacheable?: boolean;

  /** Whether adapter operations are idempotent */
  idempotent?: boolean;

  /**
   * Relative side-effect risk of adapter actions.
   * Used by resume/retry safety checks to gate unsafe operations.
   */
  sideEffectLevel?: 'low' | 'medium' | 'high';

  /** Resource requirements */
  resources?: {
    /** Requires network access */
    network?: boolean;
    /** Requires filesystem access */
    filesystem?: boolean;
    /** Requires database access */
    database?: boolean;
    /** Custom resource requirements */
    custom?: string[];
  };

  /** Cost classification */
  cost?: 'free' | 'low' | 'medium' | 'high';
}

/**
 * Adapter metadata for introspection and documentation
 */
export interface AdapterMetadata {
  /** Adapter name */
  name: string;

  /** Adapter contract version */
  contractVersion?: AdapterContractVersion;

  /** Adapter version (semver) */
  version: string;

  /** Human-readable description */
  description?: string;

  /** Adapter author/maintainer */
  author?: string;

  /** Adapter homepage or documentation URL */
  homepage?: string;

  /** Adapter license */
  license?: string;

  /** Tags for categorization */
  tags?: string[];

  /** Runtime/language implementation hint (python, go, rust, java, dotnet, js) */
  runtimeLanguage?: string;

  /** Runtime version hint */
  runtimeVersion?: string;

  /** Free-form extension bag for adapter-specific metadata */
  extensions?: Record<string, JsonValue>;
}

/**
 * Adapter execution context
 */
export interface AdapterContext {
  /** Current workflow name */
  workflowName: string;

  /** Current step ID */
  stepId: string;

  /** Execution ID (unique per run) */
  executionId: string;

  /** Logger function */
  log: (message: string, level?: 'info' | 'warn' | 'error' | 'debug') => void;

  /** Access to secrets (if configured) */
  secrets?: Record<string, string>;

  /** Temporary directory for step execution */
  tempDir?: string;

  /** Abort signal for cancellation */
  signal?: AbortSignal;

  /** Step timeout in milliseconds */
  timeout?: number;

  /** Working directory */
  cwd?: string;

  /** Environment variables */
  env?: Record<string, string>;

  /** Access to previous step outputs */
  stepOutputs?: Record<string, JsonValue>;

  /** Workflow inputs */
  inputs?: Record<string, JsonValue>;

  /** Workflow context */
  workflowContext?: Record<string, JsonValue>;
}

/**
 * Transport-neutral adapter protocol.
 *
 * This allows adapters in any language/runtime to communicate with Orbyt over
 * stdio, HTTP, gRPC, websocket, queue, or in-process bridges.
 */
export type AdapterTransport =
  | 'inproc'
  | 'stdio'
  | 'http'
  | 'grpc'
  | 'websocket'
  | 'queue';

export interface AdapterProtocolAuth {
  type?: 'none' | 'bearer' | 'basic' | 'mtls' | 'custom';
  secretRef?: string;
}

export interface AdapterProtocolConfig {
  transport: AdapterTransport;
  command?: string;
  args?: string[];
  endpoint?: string;
  timeoutMs?: number;
  retries?: number;
  auth?: AdapterProtocolAuth;
}

export interface AdapterInvocationContext {
  workflowName: string;
  stepId: string;
  executionId: string;
  timeout?: number;
  cwd?: string;
  env?: Record<string, string>;
  secrets?: Record<string, string>;
  stepOutputs?: Record<string, JsonValue>;
  inputs?: Record<string, JsonValue>;
  workflowContext?: Record<string, JsonValue>;
}

export interface AdapterInvocationRequest {
  protocolVersion: '1.0';
  requestId: string;
  adapter: string;
  action: string;
  input: Record<string, JsonValue>;
  context: AdapterInvocationContext;
}

export interface AdapterInvocationResponse<T = JsonValue> {
  protocolVersion: '1.0';
  requestId: string;
  result: AdapterResult<T>;
}

export interface AdapterManifestDefinition {
  contractVersion: AdapterContractVersion;
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  license?: string;
  tags?: string[];
  supportedActions: string[];
  capabilities: AdapterCapabilities;
  protocol: AdapterProtocolConfig;
}

/**
 * Base adapter interface for workflow actions
 */
export interface Adapter {
  /** Adapter contract version */
  readonly contractVersion?: AdapterContractVersion;

  /** Unique adapter name */
  readonly name: string;

  /** Adapter version */
  readonly version: string;

  /** Adapter description */
  readonly description?: string;

  /** Supported action patterns (e.g., 'http.*', 'shell.exec') */
  readonly supportedActions: string[];

  /** Adapter capabilities (future-proof) */
  readonly capabilities?: AdapterCapabilities;

  /** Adapter metadata (optional, for introspection) */
  readonly metadata?: AdapterMetadata;

  /**
   * Check if adapter supports an action
   * 
   * @param action - Action name to check
   * @returns True if supported
   */
  supports(action: string): boolean;

  /**
   * Validate input parameters before execution
   * 
   * @param action - Action to validate for
   * @param input - Input parameters to validate
   * @returns Validation errors (empty array if valid)
   */
  validate?(action: string, input: Record<string, any>): string[];

  /**
   * Execute an action
   * 
   * @param action - Full action name (e.g., 'http.request.get')
   * @param input - Resolved input parameters
   * @param context - Execution context
   * @returns Standardized adapter result
   */
  execute(
    action: string,
    input: Record<string, JsonValue>,
    context: AdapterContext
  ): Promise<AdapterResult>;

  /**
   * Optional: Initialize adapter (called once on registration)
   */
  initialize?(): Promise<void>;

  /**
   * Optional: Cleanup adapter (called on engine shutdown)
   */
  cleanup?(): Promise<void>;
}

/**
 * Base adapter implementation with common logic
 */
export abstract class BaseAdapter implements Adapter {
  readonly contractVersion: AdapterContractVersion = ADAPTER_CONTRACT_VERSION;
  abstract readonly name: string;
  abstract readonly version: string;
  abstract readonly description?: string;
  abstract readonly supportedActions: string[];

  /**
   * Check if adapter supports an action
   * 
   * Supports glob-like patterns:
   *   - 'http.*' matches 'http.request.get', 'http.request.post', etc.
   *   - 'http.request.*' matches 'http.request.get', 'http.request.post', etc.
   */
  supports(action: string): boolean {
    for (const pattern of this.supportedActions) {
      if (this.matchesPattern(action, pattern)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Execute action - must be implemented by subclass
   */
  abstract execute(
    action: string,
    input: Record<string, JsonValue>,
    context: AdapterContext
  ): Promise<AdapterResult>;

  /**
   * Optional hook: runs before execute().
   * Subclasses can override to inject telemetry, guards, or preprocessing.
   */
  protected async beforeExecute(
    _action: string,
    _input: Record<string, JsonValue>,
    _context: AdapterContext
  ): Promise<void> {
    // Default no-op.
  }

  /**
   * Optional hook: runs after execute() succeeds.
   * Subclasses can override to enrich result metadata.
   */
  protected async afterExecute(
    _action: string,
    _input: Record<string, JsonValue>,
    _context: AdapterContext,
    result: AdapterResult
  ): Promise<AdapterResult> {
    return result;
  }

  /**
   * Optional hook: runs when execute() throws.
   * Subclasses can override for custom error normalization.
   */
  protected async onExecutionError(
    _action: string,
    _input: Record<string, JsonValue>,
    _context: AdapterContext,
    error: unknown
  ): Promise<AdapterResult | null> {
    if (error instanceof Error) {
      return createFailureResult(
        {
          message: error.message,
          stack: error.stack,
        },
        { durationMs: 0 }
      );
    }

    return createFailureResult(
      {
        message: 'Adapter execution failed with a non-Error value',
        details: {
          thrownValue: String(error),
        },
      },
      { durationMs: 0 }
    );
  }

  /**
   * Wrapper that executes lifecycle hooks around execute().
   * Subclasses may call this helper when they want common hook behavior.
   */
  protected async executeWithLifecycle(
    action: string,
    input: Record<string, JsonValue>,
    context: AdapterContext,
    executor: () => Promise<AdapterResult>
  ): Promise<AdapterResult> {
    await this.beforeExecute(action, input, context);

    try {
      const result = await executor();
      return await this.afterExecute(action, input, context, result);
    } catch (error) {
      const recovered = await this.onExecutionError(action, input, context, error);
      if (recovered) {
        return recovered;
      }
      throw error;
    }
  }

  /**
   * Match action against pattern
   */
  protected matchesPattern(action: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(action);
  }

  /**
   * Validate required input fields
   */
  protected validateInput(
    input: Record<string, JsonValue>,
    required: string[]
  ): void {
    for (const field of required) {
      if (input[field] === undefined || input[field] === null) {
        throw new Error(
          `${this.name} adapter: missing required input field '${field}'`
        );
      }
    }
  }

  /**
   * Get input with default value
   */
  protected getInput<T>(
    input: Record<string, JsonValue>,
    key: string,
    defaultValue: T
  ): T {
    return input[key] !== undefined ? (input[key] as T) : defaultValue;
  }
}

/**
 * Result builder for creating adapter results fluently
 */
export class AdapterResultBuilder<T = any> {
  private result: Partial<AdapterResult<T>> = {
    success: false,
    metrics: { durationMs: 0 },
    logs: [],
    effects: [],
    emits: [],
    warnings: [],
  };

  /**
   * Mark result as successful
   */
  success(output?: T): this {
    this.result.success = true;
    this.result.output = output;
    return this;
  }

  /**
   * Mark result as failed
   */
  failure(error: string | AdapterError): this {
    this.result.success = false;
    this.result.error = typeof error === 'string'
      ? { message: error }
      : error;
    return this;
  }

  /**
   * Set execution metrics
   */
  metrics(metrics: ExecutionMetrics): this {
    this.result.metrics = metrics;
    return this;
  }

  /**
   * Set duration
   */
  duration(ms: number): this {
    if (!this.result.metrics) {
      this.result.metrics = { durationMs: ms };
    } else {
      this.result.metrics.durationMs = ms;
    }
    return this;
  }

  /**
   * Add log message
   */
  log(message: string): this {
    if (!this.result.logs) {
      this.result.logs = [];
    }
    this.result.logs.push(message);
    return this;
  }

  /**
   * Add multiple logs
   */
  logs(messages: string[]): this {
    if (!this.result.logs) {
      this.result.logs = [];
    }
    this.result.logs.push(...messages);
    return this;
  }

  /**
   * Add effect
   */
  effect(effect: string): this {
    if (!this.result.effects) {
      this.result.effects = [];
    }
    this.result.effects.push(effect);
    return this;
  }

  /**
   * Add multiple effects
   */
  effects(effects: string[]): this {
    if (!this.result.effects) {
      this.result.effects = [];
    }
    this.result.effects.push(...effects);
    return this;
  }

  /**
   * Add event emission
   */
  emit(event: string): this {
    if (!this.result.emits) {
      this.result.emits = [];
    }
    this.result.emits.push(event);
    return this;
  }

  /**
   * Add warning
   */
  warning(warning: string): this {
    if (!this.result.warnings) {
      this.result.warnings = [];
    }
    this.result.warnings.push(warning);
    return this;
  }

  /**
   * Add multiple warnings
   */
  warnings(warnings: string[]): this {
    if (!this.result.warnings) {
      this.result.warnings = [];
    }
    this.result.warnings.push(...warnings);
    return this;
  }

  /**
   * Build the final result
   */
  build(): AdapterResult<T> {
    return this.result as AdapterResult<T>;
  }
}

/**
 * Create a success result
 */
export function createSuccessResult<T>(
  output: T,
  metrics: ExecutionMetrics,
  options?: {
    logs?: string[];
    effects?: string[];
    emits?: string[];
    warnings?: string[];
  }
): AdapterResult<T> {
  return {
    success: true,
    output,
    metrics,
    logs: options?.logs,
    effects: options?.effects,
    emits: options?.emits,
    warnings: options?.warnings,
  };
}

/**
 * Create a failure result
 */
export function createFailureResult(
  error: string | AdapterError,
  metrics: ExecutionMetrics,
  options?: {
    logs?: string[];
    warnings?: string[];
  }
): AdapterResult<never> {
  return {
    success: false,
    error: typeof error === 'string' ? { message: error } : error,
    metrics,
    logs: options?.logs,
    warnings: options?.warnings,
  };
}
