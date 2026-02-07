/**
 * Ecosystem Exit Codes
 * 
 * Process-level exit codes used across ALL ecosystem components.
 * These are numeric, stable, and cross-language compatible.
 * 
 * Pattern:
 * - 0      → Success
 * - 1xx    → User / Input errors
 * - 2xx    → Configuration / Environment errors
 * - 3xx    → Execution failures
 * - 4xx    → Security / Permission issues
 * - 5xx    → Internal / System errors
 * 
 * Rules:
 * - NEVER remove or change an exit code once published
 * - Use these in CLI, Engine, Services, all products
 * - Keep them component-agnostic at this level
 * - Specific errors use error codes, these are just outcomes
 * 
 * @category Core
 * @public
 */

export enum ExitCodes {
  // =========================================================================
  // SUCCESS
  // =========================================================================
  
  /** Operation completed successfully */
  SUCCESS = 0,

  // =========================================================================
  // USER / INPUT ERRORS (1xx)
  // =========================================================================
  
  /** Invalid command-line arguments or input parameters */
  INVALID_INPUT = 100,
  
  /** Invalid schema or workflow definition */
  INVALID_SCHEMA = 101,
  
  /** Required input file not found or invalid */
  INVALID_FILE = 102,
  
  /** Invalid format or malformed data */
  INVALID_FORMAT = 103,
  
  /** Missing required input or parameter */
  MISSING_REQUIRED_INPUT = 104,
  
  /** Validation failed */
  VALIDATION_FAILED = 105,

  // =========================================================================
  // CONFIGURATION / ENVIRONMENT ERRORS (2xx)
  // =========================================================================
  
  /** Missing or invalid configuration file */
  MISSING_CONFIG = 200,
  
  /** Secret not found or unavailable */
  MISSING_SECRET = 201,
  
  /** Required dependency not found */
  MISSING_DEPENDENCY = 202,
  
  /** Environment not properly set up */
  ENVIRONMENT_ERROR = 203,
  
  /** Invalid configuration values */
  INVALID_CONFIG = 204,
  
  /** Required service unavailable */
  SERVICE_UNAVAILABLE = 205,

  // =========================================================================
  // EXECUTION FAILURES (3xx)
  // =========================================================================
  
  /** Workflow execution failed */
  WORKFLOW_FAILED = 300,
  
  /** Individual step failed */
  STEP_FAILED = 301,
  
  /** Adapter execution failed */
  ADAPTER_FAILED = 302,
  
  /** Plugin execution failed */
  PLUGIN_FAILED = 303,
  
  /** Operation timeout */
  TIMEOUT = 304,
  
  /** Circular dependency detected */
  CIRCULAR_DEPENDENCY = 305,
  
  /** Dependency failure */
  DEPENDENCY_FAILED = 306,
  
  /** Resource allocation failed */
  RESOURCE_ERROR = 307,

  // =========================================================================
  // SECURITY / PERMISSION ISSUES (4xx)
  // =========================================================================
  
  /** Permission denied */
  PERMISSION_DENIED = 400,
  
  /** Vault is locked, requires unlock */
  VAULT_LOCKED = 401,
  
  /** Authentication failed */
  AUTH_FAILED = 402,
  
  /** Invalid credentials */
  INVALID_CREDENTIALS = 403,
  
  /** Access forbidden */
  FORBIDDEN = 404,
  
  /** Secret resolution failed */
  SECRET_RESOLUTION_FAILED = 405,
  
  /** Security policy violation */
  SECURITY_VIOLATION = 406,

  // =========================================================================
  // INTERNAL / SYSTEM ERRORS (5xx)
  // =========================================================================
  
  /** Internal system error */
  INTERNAL_ERROR = 500,
  
  /** Unhandled exception */
  UNHANDLED_EXCEPTION = 501,
  
  /** Engine initialization failed */
  INITIALIZATION_FAILED = 502,
  
  /** State corruption detected */
  STATE_CORRUPTION = 503,
  
  /** Critical system failure */
  CRITICAL_FAILURE = 504,
  
  /** Database error */
  DATABASE_ERROR = 505,
  
  /** File system error */
  FILESYSTEM_ERROR = 506,
  
  /** Network error */
  NETWORK_ERROR = 507,
  
  /** Out of memory */
  OUT_OF_MEMORY = 508,
  
  /** Bug detected (should never happen) */
  BUG_DETECTED = 509,
}

/**
 * Get human-readable description of an exit code
 * 
 * @param code - Exit code to describe
 * @returns Human-readable description
 * 
 * @example
 * ```typescript
 * const desc = getExitCodeDescription(ExitCodes.VAULT_LOCKED);
 * // Returns: "Vault is locked, requires unlock"
 * ```
 */
export function getExitCodeDescription(code: ExitCodes): string {
  const descriptions: Record<ExitCodes, string> = {
    [ExitCodes.SUCCESS]: 'Operation completed successfully',
    
    // User / Input
    [ExitCodes.INVALID_INPUT]: 'Invalid command-line arguments or input parameters',
    [ExitCodes.INVALID_SCHEMA]: 'Invalid schema or workflow definition',
    [ExitCodes.INVALID_FILE]: 'Required input file not found or invalid',
    [ExitCodes.INVALID_FORMAT]: 'Invalid format or malformed data',
    [ExitCodes.MISSING_REQUIRED_INPUT]: 'Missing required input or parameter',
    [ExitCodes.VALIDATION_FAILED]: 'Validation failed',
    
    // Config / Environment
    [ExitCodes.MISSING_CONFIG]: 'Missing or invalid configuration file',
    [ExitCodes.MISSING_SECRET]: 'Secret not found or unavailable',
    [ExitCodes.MISSING_DEPENDENCY]: 'Required dependency not found',
    [ExitCodes.ENVIRONMENT_ERROR]: 'Environment not properly set up',
    [ExitCodes.INVALID_CONFIG]: 'Invalid configuration values',
    [ExitCodes.SERVICE_UNAVAILABLE]: 'Required service unavailable',
    
    // Execution
    [ExitCodes.WORKFLOW_FAILED]: 'Workflow execution failed',
    [ExitCodes.STEP_FAILED]: 'Individual step failed',
    [ExitCodes.ADAPTER_FAILED]: 'Adapter execution failed',
    [ExitCodes.PLUGIN_FAILED]: 'Plugin execution failed',
    [ExitCodes.TIMEOUT]: 'Operation timeout',
    [ExitCodes.CIRCULAR_DEPENDENCY]: 'Circular dependency detected',
    [ExitCodes.DEPENDENCY_FAILED]: 'Dependency failure',
    [ExitCodes.RESOURCE_ERROR]: 'Resource allocation failed',
    
    // Security
    [ExitCodes.PERMISSION_DENIED]: 'Permission denied',
    [ExitCodes.VAULT_LOCKED]: 'Vault is locked, requires unlock',
    [ExitCodes.AUTH_FAILED]: 'Authentication failed',
    [ExitCodes.INVALID_CREDENTIALS]: 'Invalid credentials',
    [ExitCodes.FORBIDDEN]: 'Access forbidden',
    [ExitCodes.SECRET_RESOLUTION_FAILED]: 'Secret resolution failed',
    [ExitCodes.SECURITY_VIOLATION]: 'Security policy violation',
    
    // Internal
    [ExitCodes.INTERNAL_ERROR]: 'Internal system error',
    [ExitCodes.UNHANDLED_EXCEPTION]: 'Unhandled exception',
    [ExitCodes.INITIALIZATION_FAILED]: 'Engine initialization failed',
    [ExitCodes.STATE_CORRUPTION]: 'State corruption detected',
    [ExitCodes.CRITICAL_FAILURE]: 'Critical system failure',
    [ExitCodes.DATABASE_ERROR]: 'Database error',
    [ExitCodes.FILESYSTEM_ERROR]: 'File system error',
    [ExitCodes.NETWORK_ERROR]: 'Network error',
    [ExitCodes.OUT_OF_MEMORY]: 'Out of memory',
    [ExitCodes.BUG_DETECTED]: 'Bug detected (should never happen)',
  };
  
  return descriptions[code] || 'Unknown exit code';
}

/**
 * Get exit code category
 * 
 * @param code - Exit code
 * @returns Category name
 */
export function getExitCodeCategory(code: ExitCodes): string {
  if (code === 0) return 'success';
  if (code >= 100 && code < 200) return 'user-error';
  if (code >= 200 && code < 300) return 'config-error';
  if (code >= 300 && code < 400) return 'execution-error';
  if (code >= 400 && code < 500) return 'security-error';
  if (code >= 500 && code < 600) return 'internal-error';
  return 'unknown';
}

/**
 * Check if exit code represents success
 */
export function isSuccess(code: ExitCodes): boolean {
  return code === ExitCodes.SUCCESS;
}

/**
 * Check if exit code represents a user error
 */
export function isUserError(code: ExitCodes): boolean {
  return code >= 100 && code < 200;
}

/**
 * Check if exit code represents a retryable error
 * Retryable: timeouts, network errors, service unavailable
 * Not retryable: validation, permission, bad input
 */
export function isRetryable(code: ExitCodes): boolean {
  const retryable = [
    ExitCodes.TIMEOUT,
    ExitCodes.SERVICE_UNAVAILABLE,
    ExitCodes.NETWORK_ERROR,
    ExitCodes.DATABASE_ERROR,
    ExitCodes.RESOURCE_ERROR,
  ];
  return retryable.includes(code);
}
