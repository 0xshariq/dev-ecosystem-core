/**
 * @dev-ecosystem/core - Adapter Contract
 * 
 * Defines the contract for universal adapters in the Orbyt workflow engine.
 * Adapters execute actions (shell commands, HTTP requests, AWS operations, etc.)
 * 
 * Architecture:
 * - Core adapter types (Adapter, AdapterContext, AdapterResult, etc.) are in types/adapter.types.ts
 * - This file contains contract-specific interfaces for:
 *   - Adapter registry (IAdapterRegistry)
 *   - Extended adapter interface (IAdapter)
 *   - Documentation metadata (AdapterActionMetadata, AdapterExample)
 *   - Runtime requirements (AdapterRequirements)
 * 
 * Usage:
 * - Import core types from: @dev-ecosystem/core/types/adapter.types
 * - Import contracts from: @dev-ecosystem/core/contracts/adapter.contract
 * 
 * @module contracts
 */

import { z } from 'zod';
import type {
  Adapter,
  AdapterMetadata,
  AdapterCapabilities
} from '../types/adapter.types.js';

/**
 * Universal adapter interface (extends base Adapter)
 * 
 * This extends the base Adapter with additional contract requirements:
 * - Configuration schema validation
 * - Initialization lifecycle
 * - Health checks
 * - Cleanup hooks
 * 
 * Note: validate() method is inherited from base Adapter interface
 */
export interface IAdapter extends Adapter {
  /**
   * Adapter configuration schema (Zod)
   */
  readonly configSchema?: z.ZodSchema;
  
  /**
   * Initialize the adapter with configuration
   * (Extends base initialize to accept config parameter)
   */
  initialize?(config?: Record<string, unknown>): Promise<void>;
  
  /**
   * Get adapter capabilities
   */
  getCapabilities?(): AdapterCapabilities;
  
  /**
   * Health check for adapter availability
   */
  healthCheck?(): Promise<boolean>;
}

/**
 * Adapter action metadata for documentation and tooling
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
 * Adapter usage example for documentation
 */
export interface AdapterExample {
  title: string;
  description?: string;
  yaml: string;
}

/**
 * Adapter requirements for runtime validation
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
 * Adapter registry interface for managing adapters
 * 
 * Provides centralized adapter registration and discovery
 */
export interface IAdapterRegistry {
  /**
   * Register an adapter
   */
  register(adapter: IAdapter): void;
  
  /**
   * Unregister an adapter by name
   */
  unregister(name: string): void;
  
  /**
   * Get an adapter by name
   */
  get(name: string): IAdapter | undefined;
  
  /**
   * Check if adapter exists
   */
  has(name: string): boolean;
  
  /**
   * List all registered adapter names
   */
  list(): string[];
  
  /**
   * Get adapter metadata
   */
  getMetadata(name: string): AdapterMetadata | undefined;
}
