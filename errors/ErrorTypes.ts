/**
 * Ecosystem Error Types
 * 
 * Semantic error categories used across all ecosystem components.
 * These types answer: "What KIND of failure is this?"
 * 
 * Used for:
 * - Control flow decisions (retry vs abort)
 * - UX messaging (how to present error to user)
 * - AI reasoning (how to explain and suggest fixes)
 * - Metrics and monitoring (error categorization)
 * 
 * @category Core
 * @public
 */

export enum ErrorType {
  /**
   * USER errors - Invalid input, bad parameters, user mistakes
   * 
   * Characteristics:
   * - User can fix
   * - Don't retry automatically
   * - Show helpful message
   * - Not a system issue
   * 
   * Examples:
   * - Invalid command-line arguments
   * - Malformed workflow schema
   * - Missing required inputs
   * - Invalid file format
   */
  USER = 'user',

  /**
   * CONFIG errors - Configuration or environment issues
   * 
   * Characteristics:
   * - Setup problem
   * - May be fixable by user
   * - Check configuration
   * - Environment-related
   * 
   * Examples:
   * - Missing config file
   * - Invalid configuration values
   * - Missing dependencies
   * - Environment variables not set
   */
  CONFIG = 'config',

  /**
   * SECURITY errors - Permissions, authentication, authorization
   * 
   * Characteristics:
   * - Security-related
   * - May require credentials
   * - Don't expose details in logs
   * - Policy enforcement
   * 
   * Examples:
   * - Vault locked
   * - Permission denied
   * - Invalid credentials
   * - Security policy violation
   */
  SECURITY = 'security',

  /**
   * EXECUTION errors - Runtime failures during normal operation
   * 
   * Characteristics:
   * - Operational failure
   * - May be transient
   * - Consider retry
   * - Track for reliability
   * 
   * Examples:
   * - Step failed
   * - Adapter execution failed
   * - Timeout
   * - Dependency failure
   */
  EXECUTION = 'execution',

  /**
   * SYSTEM errors - Infrastructure, network, resource issues
   * 
   * Characteristics:
   * - Infrastructure problem
   * - Usually transient
   * - Good retry candidate
   * - External dependency
   * 
   * Examples:
   * - Network error
   * - Database unavailable
   * - Out of memory
   * - Disk full
   */
  SYSTEM = 'system',

  /**
   * INTERNAL errors - Bugs, unexpected states, programming errors
   * 
   * Characteristics:
   * - Should not happen
   * - Bug or logic error
   * - Needs investigation
   * - Alert developers
   * 
   * Examples:
   * - Unhandled exception
   * - State corruption
   * - Assertion failure
   * - Null pointer
   */
  INTERNAL = 'internal',
}

/**
 * Error severity levels
 * Indicates impact and urgency
 */
export enum ErrorSeverity {
  /** Minor issue, operation can continue */
  LOW = 'low',
  
  /** Notable issue, some functionality affected */
  MEDIUM = 'medium',
  
  /** Serious issue, operation failed */
  HIGH = 'high',
  
  /** Critical failure, system integrity at risk */
  CRITICAL = 'critical',
}

/**
 * Get human-readable description of error type
 */
export function getErrorTypeDescription(type: ErrorType): string {
  const descriptions: Record<ErrorType, string> = {
    [ErrorType.USER]: 'User input or parameter error',
    [ErrorType.CONFIG]: 'Configuration or environment error',
    [ErrorType.SECURITY]: 'Security, permission, or authentication error',
    [ErrorType.EXECUTION]: 'Runtime execution failure',
    [ErrorType.SYSTEM]: 'System, infrastructure, or resource error',
    [ErrorType.INTERNAL]: 'Internal bug or unexpected state',
  };
  return descriptions[type];
}

/**
 * Determine if error type is retryable
 */
export function isErrorTypeRetryable(type: ErrorType): boolean {
  // Generally, only SYSTEM and some EXECUTION errors are retryable
  return type === ErrorType.SYSTEM || type === ErrorType.EXECUTION;
}

/**
 * Determine if error should be reported to developers
 */
export function shouldAlertDevelopers(type: ErrorType): boolean {
  // INTERNAL errors indicate bugs
  return type === ErrorType.INTERNAL;
}

/**
 * Get suggested action for error type
 */
export function getSuggestedAction(type: ErrorType): string {
  const actions: Record<ErrorType, string> = {
    [ErrorType.USER]: 'Check your input and try again',
    [ErrorType.CONFIG]: 'Verify configuration and environment setup',
    [ErrorType.SECURITY]: 'Check permissions and credentials',
    [ErrorType.EXECUTION]: 'Review operation parameters and retry',
    [ErrorType.SYSTEM]: 'Check system resources and network, then retry',
    [ErrorType.INTERNAL]: 'Report this issue to developers',
  };
  return actions[type];
}
