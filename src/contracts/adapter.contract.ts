/**
 * @dev-ecosystem/core - Adapter Contract
 * 
 * Defines the contract for universal adapters in the Orbyt workflow engine.
 * Adapters execute actions (shell commands, HTTP requests, AWS operations, etc.)
 */

import { z } from 'zod';

/**
 * Adapter execution context
 */
export interface AdapterContext {
  workflowId: string;
  workflowName: string;
  runId: string;
  stepId: string;
  stepName?: string;
  inputs: Record<string, unknown>;
  secrets: Record<string, string>;
  env: Record<string, string>;
  workingDirectory: string;
  timeoutMs?: number;
}

/**
 * Adapter execution result
 */
export interface AdapterResult {
  success: boolean;
  outputs?: Record<string, unknown>;
  error?: Error;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
  duration?: number;
  exitCode?: number;
  stdout?: string;
  stderr?: string;
}

/**
 * Universal adapter interface
 */
export interface IAdapter {
  /**
   * Adapter namespace (e.g., 'shell', 'http', 'aws')
   */
  readonly namespace: string;
  
  /**
   * Adapter actions (e.g., 'command', 'request', 's3.upload')
   */
  readonly actions: string[];
  
  /**
   * Adapter version
   */
  readonly version: string;
  
  /**
   * Adapter configuration schema
   */
  readonly configSchema?: z.ZodSchema;
  
  /**
   * Initialize the adapter
   */
  initialize?(config?: Record<string, unknown>): Promise<void>;
  
  /**
   * Execute an adapter action
   */
  execute(action: string, context: AdapterContext): Promise<AdapterResult>;
  
  /**
   * Validate action parameters before execution
   */
  validate?(action: string, params: Record<string, unknown>): Promise<boolean>;
  
  /**
   * Cleanup resources
   */
  cleanup?(): Promise<void>;
  
  /**
   * Get adapter capabilities
   */
  getCapabilities?(): string[];
  
  /**
   * Health check
   */
  healthCheck?(): Promise<boolean>;
}

/**
 * Adapter metadata
 */
export interface AdapterMetadata {
  namespace: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  category: string;
  actions: AdapterActionMetadata[];
  requirements?: AdapterRequirements;
}

/**
 * Adapter action metadata
 */
export interface AdapterActionMetadata {
  name: string;
  displayName: string;
  description: string;
  inputSchema?: z.ZodSchema;
  outputSchema?: z.ZodSchema;
  examples?: AdapterExample[];
}

/**
 * Adapter usage example
 */
export interface AdapterExample {
  title: string;
  description?: string;
  yaml: string;
}

/**
 * Adapter requirements
 */
export interface AdapterRequirements {
  platform?: string[];
  dependencies?: string[];
  permissions?: string[];
  resources?: {
    cpu?: string;
    memory?: string;
    storage?: string;
  };
}

/**
 * Adapter registry interface
 */
export interface IAdapterRegistry {
  register(adapter: IAdapter): void;
  unregister(namespace: string): void;
  get(namespace: string): IAdapter | undefined;
  has(namespace: string): boolean;
  list(): string[];
  getMetadata(namespace: string): AdapterMetadata | undefined;
}
