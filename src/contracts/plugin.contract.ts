/**
 * @dev-ecosystem/core - Plugin Contract
 * 
 * Defines the contract for plugins that extend ecosystem products.
 * Enables modular architecture and third-party extensions.
 */

import { z } from 'zod';

/**
 * Plugin lifecycle hooks
 */
export enum PluginHook {
  BEFORE_INIT = 'beforeInit',
  AFTER_INIT = 'afterInit',
  BEFORE_EXECUTE = 'beforeExecute',
  AFTER_EXECUTE = 'afterExecute',
  BEFORE_SHUTDOWN = 'beforeShutdown',
  AFTER_SHUTDOWN = 'afterShutdown',
  ON_ERROR = 'onError',
  ON_EVENT = 'onEvent',
}

/**
 * Plugin interface
 */
export interface IPlugin {
  /**
   * Plugin metadata
   */
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly author?: string;
  
  /**
   * Plugin dependencies (other plugin IDs)
   */
  readonly dependencies?: string[];
  
  /**
   * Configuration schema
   */
  readonly configSchema?: z.ZodSchema;
  
  /**
   * Initialize the plugin
   */
  initialize(context: PluginContext): Promise<void>;
  
  /**
   * Register plugin hooks
   */
  registerHooks?(registry: IPluginHookRegistry): void;
  
  /**
   * Register plugin commands
   */
  registerCommands?(registry: IPluginCommandRegistry): void;
  
  /**
   * Register plugin adapters
   */
  registerAdapters?(registry: IPluginAdapterRegistry): void;
  
  /**
   * Cleanup on shutdown
   */
  shutdown?(): Promise<void>;
  
  /**
   * Health check
   */
  healthCheck?(): Promise<boolean>;
}

/**
 * Plugin execution context
 */
export interface PluginContext {
  appName: string;
  appVersion: string;
  config: Record<string, unknown>;
  dataDir: string;
  logDir: string;
  env: Record<string, string>;
  hooks: IPluginHookRegistry;
  logger: IPluginLogger;
  [key: string]: unknown;
}

/**
 * Plugin hook registry interface
 */
export interface IPluginHookRegistry {
  register(hook: PluginHook, handler: PluginHookHandler): void;
  unregister(hook: PluginHook, handler: PluginHookHandler): void;
  trigger(hook: PluginHook, payload: unknown): Promise<void>;
  has(hook: PluginHook): boolean;
}

/**
 * Plugin hook handler
 */
export type PluginHookHandler = (payload: unknown, context: PluginContext) => Promise<void> | void;

/**
 * Plugin command registry interface
 */
export interface IPluginCommandRegistry {
  register(command: PluginCommand): void;
  unregister(commandName: string): void;
  get(commandName: string): PluginCommand | undefined;
  list(): string[];
}

/**
 * Plugin command definition
 */
export interface PluginCommand {
  name: string;
  description: string;
  arguments?: PluginCommandArgument[];
  options?: PluginCommandOption[];
  handler: (args: Record<string, unknown>, context: PluginContext) => Promise<PluginCommandResult>;
}

export interface PluginCommandArgument {
  name: string;
  description: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean';
}

export interface PluginCommandOption {
  name: string;
  shortFlag?: string;
  description: string;
  type?: 'string' | 'number' | 'boolean';
  defaultValue?: unknown;
}

export interface PluginCommandResult {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: Error;
}

/**
 * Plugin adapter registry interface
 */
export interface IPluginAdapterRegistry {
  register(adapter: unknown): void; // Using 'unknown' to avoid circular dependency
  unregister(namespace: string): void;
  has(namespace: string): boolean;
  list(): string[];
}

/**
 * Plugin logger interface
 */
export interface IPluginLogger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  repository?: string;
  license?: string;
  keywords?: string[];
  dependencies?: string[];
  peerDependencies?: string[];
  capabilities?: string[];
}

/**
 * Plugin loader interface
 */
export interface IPluginLoader {
  load(pluginPath: string): Promise<IPlugin>;
  loadFromNpm(packageName: string): Promise<IPlugin>;
  unload(pluginId: string): Promise<void>;
  reload(pluginId: string): Promise<void>;
  list(): PluginMetadata[];
  get(pluginId: string): IPlugin | undefined;
  has(pluginId: string): boolean;
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  id: string;
  enabled: boolean;
  config?: Record<string, unknown>;
  priority?: number;
}

/**
 * Plugin manager interface
 */
export interface IPluginManager {
  initialize(plugins: PluginConfig[]): Promise<void>;
  enable(pluginId: string): Promise<void>;
  disable(pluginId: string): Promise<void>;
  isEnabled(pluginId: string): boolean;
  getPlugin(pluginId: string): IPlugin | undefined;
  listPlugins(): PluginMetadata[];
  shutdown(): Promise<void>;
}
