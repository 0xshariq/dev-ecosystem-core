/**
 * Orbyt Error Codes
 * 
 * Structured error codes for the Orbyt workflow execution engine.
 * 
 * Pattern: ORBYT-<CATEGORY>-<NUMBER>
 * 
 * Categories:
 * - WF: Workflow-level errors
 * - STEP: Step-level errors
 * - ADAPTER: Adapter execution errors
 * - ENGINE: Core engine errors
 * - VAR: Variable resolution errors
 * - SEC: Secret resolution errors
 * 
 * @category Orbyt
 * @public
 */

export const OrbytErrorCodes = {
  // =========================================================================
  // WORKFLOW (WF) - Workflow definition and validation errors
  // =========================================================================
  
  /** Workflow schema validation failed */
  WORKFLOW_SCHEMA_INVALID: 'ORBYT-WF-001',
  
  /** Circular dependency detected in workflow steps */
  WORKFLOW_CYCLE_DETECTED: 'ORBYT-WF-002',
  
  /** Workflow parsing failed */
  WORKFLOW_PARSE_FAILED: 'ORBYT-WF-003',
  
  /** Workflow not found */
  WORKFLOW_NOT_FOUND: 'ORBYT-WF-004',
  
  /** Workflow version unsupported */ 
  WORKFLOW_VERSION_UNSUPPORTED: 'ORBYT-WF-005',
  
  /** Invalid workflow structure */
  WORKFLOW_STRUCTURE_INVALID: 'ORBYT-WF-006',
  
  /** Missing required workflow field */
  WORKFLOW_MISSING_FIELD: 'ORBYT-WF-007',
  
  /** Workflow already exists */
  WORKFLOW_ALREADY_EXISTS: 'ORBYT-WF-008',

  // =========================================================================
  // STEP (STEP) - Step-level errors
  // =========================================================================
  
  /** Step not found in workflow */
  STEP_NOT_FOUND: 'ORBYT-STEP-001',
  
  /** Step execution timeout */
  STEP_TIMEOUT: 'ORBYT-STEP-002',
  
  /** Step execution failed */
  STEP_EXECUTION_FAILED: 'ORBYT-STEP-003',
  
  /** Step dependency not met */
  STEP_DEPENDENCY_FAILED: 'ORBYT-STEP-004',
  
  /** Invalid step configuration */
  STEP_CONFIG_INVALID: 'ORBYT-STEP-005',
  
  /** Duplicate step ID */
  STEP_DUPLICATE_ID: 'ORBYT-STEP-006',
  
  /** Step condition evaluation failed */
  STEP_CONDITION_FAILED: 'ORBYT-STEP-007',
  
  /** Step output mapping failed */
  STEP_OUTPUT_MAPPING_FAILED: 'ORBYT-STEP-008',

  // =========================================================================
  // ADAPTER (ADAPTER) - Adapter execution errors
  // =========================================================================
  
  /** Adapter not registered */
  ADAPTER_NOT_REGISTERED: 'ORBYT-ADAPTER-001',
  
  /** Adapter execution failed */
  ADAPTER_EXECUTION_FAILED: 'ORBYT-ADAPTER-002',
  
  /** Adapter initialization failed */
  ADAPTER_INIT_FAILED: 'ORBYT-ADAPTER-003',
  
  /** Invalid adapter action */
  ADAPTER_ACTION_INVALID: 'ORBYT-ADAPTER-004',
  
  /** Adapter not found */
  ADAPTER_NOT_FOUND: 'ORBYT-ADAPTER-005',
  
  /** Adapter input validation failed */
  ADAPTER_INPUT_INVALID: 'ORBYT-ADAPTER-006',
  
  /** Adapter output invalid */
  ADAPTER_OUTPUT_INVALID: 'ORBYT-ADAPTER-007',

  // =========================================================================
  // ENGINE (ENGINE) - Core engine errors
  // =========================================================================
  
  /** Engine initialization failed */
  ENGINE_INITIALIZATION_FAILED: 'ORBYT-ENGINE-001',
  
  /** Engine state corrupted */
  ENGINE_STATE_CORRUPTED: 'ORBYT-ENGINE-002',
  
  /** Engine execution failed */
  ENGINE_EXECUTION_FAILED: 'ORBYT-ENGINE-003',
  
  /** Engine not initialized */
  ENGINE_NOT_INITIALIZED: 'ORBYT-ENGINE-004',
  
  /** Engine shutting down */
  ENGINE_SHUTTING_DOWN: 'ORBYT-ENGINE-005',
  
  /** Engine configuration invalid */
  ENGINE_CONFIG_INVALID: 'ORBYT-ENGINE-006',

  // =========================================================================
  // VARIABLE (VAR) - Variable resolution errors
  // =========================================================================
  
  /** Variable not found */
  VARIABLE_NOT_FOUND: 'ORBYT-VAR-001',
  
  /** Variable resolution failed */
  VARIABLE_RESOLUTION_FAILED: 'ORBYT-VAR-002',
  
  /** Circular variable reference */
  VARIABLE_CIRCULAR_REFERENCE: 'ORBYT-VAR-003',
  
  /** Invalid variable syntax */
  VARIABLE_SYNTAX_INVALID: 'ORBYT-VAR-004',
  
  /** Variable type mismatch */
  VARIABLE_TYPE_MISMATCH: 'ORBYT-VAR-005',

  // =========================================================================
  // SECRET (SEC) - Secret resolution errors
  // =========================================================================
  
  /** Secret not found */
  SECRET_NOT_FOUND: 'ORBYT-SEC-001',
  
  /** Secret resolution failed */
  SECRET_RESOLUTION_FAILED: 'ORBYT-SEC-002',
  
  /** Invalid secret reference */
  SECRET_REFERENCE_INVALID: 'ORBYT-SEC-003',
  
  /** Vault not configured */
  SECRET_VAULT_NOT_CONFIGURED: 'ORBYT-SEC-004',
  
  /** Secret provider unavailable */
  SECRET_PROVIDER_UNAVAILABLE: 'ORBYT-SEC-005',

} as const;

/**
 * Type for Orbyt error codes
 */
export type OrbytErrorCode = typeof OrbytErrorCodes[keyof typeof OrbytErrorCodes];

/**
 * Get category from Orbyt error code
 */
export function getOrbytErrorCategory(code: OrbytErrorCode): string {
  const match = code.match(/^ORBYT-([A-Z]+)-\d+$/);
  return match ? match[1] : 'UNKNOWN';
}

/**
 * Check if code is an Orbyt error code
 */
export function isOrbytErrorCode(code: string): code is OrbytErrorCode {
  return Object.values(OrbytErrorCodes).includes(code as OrbytErrorCode);
}
