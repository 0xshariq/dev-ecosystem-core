/**
 * @dev-ecosystem/core - CLI Contract
 * 
 * Defines the contract for CLI tools across the dev-ecosystem.
 * Ensures consistent command structure, error handling, and output formatting.
 */

import { z } from 'zod';

/**
 * CLI command definition
 */
export interface CLICommand {
  name: string;
  description: string;
  aliases?: string[];
  arguments?: CLIArgument[];
  options?: CLIOption[];
  subcommands?: CLICommand[];
  examples?: CLIExample[];
  handler: (args: CLIContext) => Promise<CLIResult>;
}

/**
 * CLI positional argument
 */
export interface CLIArgument {
  name: string;
  description: string;
  required?: boolean;
  defaultValue?: unknown;
  variadic?: boolean;
  validator?: z.ZodSchema;
}

/**
 * CLI flag/option
 */
export interface CLIOption {
  name: string;
  shortFlag?: string;
  longFlag: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required?: boolean;
  defaultValue?: unknown;
  choices?: unknown[];
  validator?: z.ZodSchema;
}

/**
 * CLI usage example
 */
export interface CLIExample {
  description: string;
  command: string;
}

/**
 * CLI execution context
 */
export interface CLIContext {
  command: string;
  args: Record<string, unknown>;
  options: Record<string, unknown>;
  flags: Record<string, boolean>;
  env: Record<string, string>;
  cwd: string;
  stdin?: NodeJS.ReadableStream;
  stdout: NodeJS.WritableStream;
  stderr: NodeJS.WritableStream;
}

/**
 * CLI execution result
 */
export interface CLIResult {
  exitCode: number;
  message?: string;
  data?: unknown;
  error?: Error;
}

/**
 * CLI output formatter interface
 */
export interface ICLIFormatter {
  formatSuccess(message: string, data?: unknown): string;
  formatError(error: Error | string): string;
  formatWarning(message: string): string;
  formatInfo(message: string): string;
  formatTable(headers: string[], rows: string[][]): string;
  formatJSON(data: unknown, indent?: number): string;
  formatList(items: string[], bullet?: string): string;
}

/**
 * CLI spinner/progress interface
 */
export interface ICLISpinner {
  start(message: string): void;
  update(message: string): void;
  succeed(message?: string): void;
  fail(message?: string): void;
  warn(message?: string): void;
  info(message?: string): void;
  stop(): void;
}

/**
 * CLI prompt interface
 */
export interface ICLIPrompt {
  text(message: string, options?: PromptTextOptions): Promise<string>;
  password(message: string, options?: PromptPasswordOptions): Promise<string>;
  confirm(message: string, options?: PromptConfirmOptions): Promise<boolean>;
  select<T>(message: string, choices: PromptChoice<T>[], options?: PromptSelectOptions): Promise<T>;
  multiselect<T>(message: string, choices: PromptChoice<T>[], options?: PromptMultiselectOptions): Promise<T[]>;
}

export interface PromptTextOptions {
  defaultValue?: string;
  placeholder?: string;
  validate?: (value: string) => boolean | string;
}

export interface PromptPasswordOptions {
  validate?: (value: string) => boolean | string;
}

export interface PromptConfirmOptions {
  defaultValue?: boolean;
}

export interface PromptSelectOptions {
  defaultValue?: unknown;
}

export interface PromptMultiselectOptions {
  defaultValues?: unknown[];
  min?: number;
  max?: number;
}

export interface PromptChoice<T> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

/**
 * CLI application interface
 */
export interface ICLIApplication {
  name: string;
  version: string;
  description: string;
  commands: CLICommand[];
  globalOptions?: CLIOption[];
  beforeCommand?(context: CLIContext): Promise<void>;
  afterCommand?(context: CLIContext, result: CLIResult): Promise<void>;
  onError?(error: Error, context: CLIContext): Promise<CLIResult>;
  run(argv: string[]): Promise<CLIResult>;
}

/**
 * CLI configuration
 */
export interface CLIConfig {
  colors?: boolean;
  verbose?: boolean;
  quiet?: boolean;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  outputFormat?: 'text' | 'json' | 'yaml';
  interactive?: boolean;
}
