/**
 * Base Error Class for Ecosystem
 * 
 * All errors in the ecosystem extend this base class.
 * Provides consistent structure for error handling across components.
 * 
 * @category Core
 * @public
 */

import { ExitCodes } from '../exit-codes/ExitCodes.js';
import { ErrorType, ErrorSeverity } from './ErrorTypes.js';

/**
 * Base error interface that all ecosystem errors must implement
 */
export interface IEcosystemError {
  /** Structured error code (e.g., "ORBYT-WF-001") */
  readonly code: string;
  
  /** Process exit code */
  readonly exitCode: ExitCodes;
  
  /** Component that generated the error */
  readonly component: string;
  
  /** Error type/category */
  readonly type: ErrorType;
  
  /** Error severity */
  readonly severity: ErrorSeverity;
  
  /** Whether this error is retryable */
  readonly retryable: boolean;
  
  /** Timestamp when error occurred */
  readonly timestamp: Date;
  
  /** Additional context data */
  readonly context?: Record<string, any>;
  
  /** Original error that caused this (for chaining) */
  readonly cause?: Error;
}

/**
 * Base Error class that all ecosystem errors extend
 * 
 * @example
 * ```typescript
 * export class WorkflowValidationError extends BaseError {
 *   component = 'orbyt';
 *   type = ErrorType.USER;
 *   code = 'ORBYT-WF-001';
 *   exitCode = ExitCodes.INVALID_SCHEMA;
 *   
 *   constructor(message: string, context?: Record<string, any>) {
 *     super(message, context);
 *   }
 * }
 * ```
 */
export abstract class BaseError extends Error implements IEcosystemError {
  // Required abstract properties - must be implemented by subclasses
  abstract readonly code: string;
  abstract readonly exitCode: ExitCodes;
  abstract readonly component: string;
  abstract readonly type: ErrorType;
  
  // Optional properties with defaults
  readonly severity: ErrorSeverity = ErrorSeverity.MEDIUM;
  readonly retryable: boolean = false;
  readonly timestamp: Date;
  readonly context?: Record<string, any>;
  readonly cause?: Error;

  constructor(
    message: string,
    context?: Record<string, any>,
    cause?: Error
  ) {
    super(message);
    
    // Set the prototype explicitly (TypeScript inheritance quirk)
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;
    this.cause = cause;
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging and serialization
   */
  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      exitCode: this.exitCode,
      component: this.component,
      type: this.type,
      severity: this.severity,
      retryable: this.retryable,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
      cause: this.cause ? {
        name: this.cause.name,
        message: this.cause.message,
        stack: this.cause.stack,
      } : undefined,
    };
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `[${this.code}] ${this.component}: ${this.message}`;
  }

  /**
   * Get user-friendly message (sanitized, no technical details)
   */
  toUserMessage(): string {
    // By default, use the message as-is
    // Subclasses can override for custom user messaging
    return this.message;
  }

  /**
   * Get detailed technical message (for logs/developers)
   */
  toTechnicalMessage(): string {
    const parts = [
      `[${this.code}]`,
      `Component: ${this.component}`,
      `Type: ${this.type}`,
      `Message: ${this.message}`,
    ];
    
    if (this.context && Object.keys(this.context).length > 0) {
      parts.push(`Context: ${JSON.stringify(this.context)}`);
    }
    
    if (this.cause) {
      parts.push(`Caused by: ${this.cause.message}`);
    }
    
    return parts.join(' | ');
  }

  /**
   * Check if error is of a specific type
   */
  isType(type: ErrorType): boolean {
    return this.type === type;
  }

  /**
   * Check if error is from a specific component
   */
  isComponent(component: string): boolean {
    return this.component === component;
  }

  /**
   * Check if error has a specific code
   */
  hasCode(code: string): boolean {
    return this.code === code;
  }
}

/**
 * Helper function to check if an error is an ecosystem error
 */
export function isEcosystemError(error: any): error is BaseError {
  return error instanceof BaseError;
}

/**
 * Helper function to extract error code from any error
 */
export function getErrorCode(error: any): string {
  if (isEcosystemError(error)) {
    return error.code;
  }
  return 'UNKNOWN-ERROR';
}

/**
 * Helper function to extract exit code from any error
 */
export function getExitCode(error: any): ExitCodes {
  if (isEcosystemError(error)) {
    return error.exitCode;
  }
  return ExitCodes.INTERNAL_ERROR;
}

/**
 * Helper function to wrap unknown errors in base error
 */
export function wrapError(
  error: unknown,
  component: string,
  code: string = 'UNKNOWN-ERROR'
): BaseError {
  if (isEcosystemError(error)) {
    return error;
  }
  
  const message = error instanceof Error ? error.message : String(error);
  const cause = error instanceof Error ? error : undefined;
  
  return new (class extends BaseError {
    component = component;
    type = ErrorType.INTERNAL;
    code = code;
    exitCode = ExitCodes.UNHANDLED_EXCEPTION;
  })(message, undefined, cause);
}
