/**
 * Devforge Error Codes
 * 
 * Structured error codes for the Devforge project scaffolding tool.
 * 
 * Pattern: DEVFORGE-<CATEGORY>-<NUMBER>
 * 
 * Categories:
 * - TPL: Template errors
 * - FEAT: Feature errors
 * - GEN: Generation errors
 * - CONFIG: Configuration errors
 * 
 * @category Devforge
 * @public
 */

export const DevforgeErrorCodes = {
  //=========================================================================
  // TEMPLATE (TPL) - Template errors
  // =========================================================================
  
  /** Template not found */
  TEMPLATE_NOT_FOUND: 'DEVFORGE-TPL-001',
  
  /** Template parsing failed */
  TEMPLATE_PARSE_FAILED: 'DEVFORGE-TPL-002',
  
  /** Invalid template structure */
  TEMPLATE_STRUCTURE_INVALID: 'DEVFORGE-TPL-003',
  
  /** Template rendering failed */
  TEMPLATE_RENDER_FAILED: 'DEVFORGE-TPL-004',
  
  /** Template validation failed */
  TEMPLATE_VALIDATION_FAILED: 'DEVFORGE-TPL-005',

  // =========================================================================
  // FEATURE (FEAT) - Feature errors
  // =========================================================================
  
  /** Feature conflict detected */
  FEATURE_CONFLICT: 'DEVFORGE-FEAT-001',
  
  /** Feature not found */
  FEATURE_NOT_FOUND: 'DEVFORGE-FEAT-002',
  
  /** Feature incompatible */
  FEATURE_INCOMPATIBLE: 'DEVFORGE-FEAT-003',
  
  /** Feature installation failed */
  FEATURE_INSTALL_FAILED: 'DEVFORGE-FEAT-004',
  
  /** Feature dependency missing */
  FEATURE_DEPENDENCY_MISSING: 'DEVFORGE-FEAT-005',

  // =========================================================================
  // GENERATION (GEN) - Project generation errors
  // =========================================================================
  
  /** Project generation failed */
  PROJECT_GENERATION_FAILED: 'DEVFORGE-GEN-001',
  
  /** Project already exists */
  PROJECT_ALREADY_EXISTS: 'DEVFORGE-GEN-002',
  
  /** Invalid project structure */
  PROJECT_STRUCTURE_INVALID: 'DEVFORGE-GEN-003',
  
  /** File generation failed */
  FILE_GENERATION_FAILED: 'DEVFORGE-GEN-004',
  
  /** Directory creation failed */
  DIRECTORY_CREATION_FAILED: 'DEVFORGE-GEN-005',
  
  /** Dependency installation failed */
  DEPENDENCY_INSTALL_FAILED: 'DEVFORGE-GEN-006',

  // =========================================================================
  // CONFIG (CONFIG) - Configuration errors
  // =========================================================================
  
  /** Invalid configuration */
  CONFIG_INVALID: 'DEVFORGE-CONFIG-001',
  
  /** Configuration not found */
  CONFIG_NOT_FOUND: 'DEVFORGE-CONFIG-002',
  
  /** Configuration parsing failed */
  CONFIG_PARSE_FAILED: 'DEVFORGE-CONFIG-003',
  
  /** Missing required configuration */
  CONFIG_MISSING_REQUIRED: 'DEVFORGE-CONFIG-004',

} as const;

/**
 * Type for Devforge error codes
 */
export type DevforgeErrorCode = typeof DevforgeErrorCodes[keyof typeof DevforgeErrorCodes];

/**
 * Get category from Devforge error code
 */
export function getDevforgeErrorCategory(code: DevforgeErrorCode): string {
  const match = code.match(/^DEVFORGE-([A-Z]+)-\d+$/);
  return match ? match[1] : 'UNKNOWN';
}

/**
 * Check if code is a Devforge error code
 */
export function isDevforgeErrorCode(code: string): code is DevforgeErrorCode {
  return Object.values(DevforgeErrorCodes).includes(code as DevforgeErrorCode);
}
