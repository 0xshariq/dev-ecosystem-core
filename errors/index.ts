/**
 * Ecosystem Error System - Central Exports
 * 
 * This module provides a unified interface to the ecosystem's comprehensive
 * error handling system. All error types, codes, and concrete error classes
 * are exported from this single entry point.
 * 
 * @public
 * @module @ecosystem/core/errors
 */

// ============================================================================
// EXIT CODES
// ============================================================================

export { ExitCodes, getExitCodeDescription, getExitCodeCategory, isRetryable } from '../exit-codes/ExitCodes.js';

// ============================================================================
// ERROR TYPES & CLASSIFICATIONS
// ============================================================================

export {
  ErrorType,
  ErrorSeverity,
  isErrorTypeRetryable,
  shouldAlertDevelopers,
  getSuggestedAction,
} from './ErrorTypes.js';

// ============================================================================
// BASE ERROR & UTILITIES
// ============================================================================

export type { IEcosystemError } from './BaseError.js';
export { BaseError, isEcosystemError, getErrorCode, wrapError } from './BaseError.js';

// ============================================================================
// ERROR CODES - All Components
// ============================================================================

export {
  OrbytErrorCodes,
  getOrbytErrorMessage,
  isOrbytErrorCode,
} from './ErrorCodes.js';

export {
  MediaProcErrorCodes,
  getMediaProcErrorMessage,
  isMediaProcErrorCode,
} from './mediaproc.codes.js';

export {
  VaultaErrorCodes,
  getVaultaErrorMessage,
  isVaultaErrorCode,
} from './vaulta.codes.js';

export {
  DevforgeErrorCodes,
  getDevforgeErrorMessage,
  isDevforgeErrorCode,
} from './devforge.codes.js';

// ============================================================================
// ORBYT ERRORS
// ============================================================================

export {
  // Workflow Errors
  WorkflowNotFoundError,
  WorkflowValidationError,
  WorkflowDependencyCycleError,
  WorkflowPermissionError,
  WorkflowSyntaxError,
  
  // Step Errors
  StepNotFoundError,
  StepDependencyError,
  StepConditionError,
  StepRetryExhaustedError,
  StepTimeoutError,
  
  // Adapter Errors
  AdapterNotFoundError,
  AdapterExecutionError,
  AdapterConfigurationError,
  AdapterTimeoutError,
  
  // Engine Errors
  WorkflowEngineError,
  ExecutionTimeoutError,
  ConcurrencyLimitError,
  
  // Variable Resolution Errors
  VariableNotFoundError,
  VariableResolutionError,
  InvalidVariableReferenceError,
  
  // Secret Errors
  SecretResolutionError,
  SecretNotFoundInVaultError,
  VaultConnectionError,
} from './orbyt.errors.js';

// ============================================================================
// MEDIAPROC ERRORS
// ============================================================================

export {
  // Image Errors
  ImageFormatUnsupportedError,
  ImageResizeError,
  ImageConversionError,
  ImageFileCorruptedError,
  ImageWatermarkError,
  
  // Video Errors
  VideoCodecNotFoundError,
  VideoTranscodeError,
  VideoFormatUnsupportedError,
  VideoFileCorruptedError,
  
  // Audio Errors
  AudioCodecNotFoundError,
  AudioConversionError,
  AudioFormatUnsupportedError,
  
  // Pipeline Errors
  PipelineStepError,
  PipelineConfigurationError,
  PipelineTimeoutError,
} from './mediaproc.errors.js';

// ============================================================================
// VAULTA ERRORS
// ============================================================================

export {
  // Vault Lifecycle Errors
  VaultNotInitializedError,
  VaultLockedError,
  VaultAlreadyExistsError,
  VaultNotFoundError,
  VaultCorruptedError,
  
  // Security Errors
  InvalidMasterPasswordError,
  VaultPermissionDeniedError,
  VaultAuthenticationError,
  VaultSessionExpiredError,
  
  // Cryptography Errors
  EncryptionError,
  DecryptionError,
  InvalidEncryptionKeyError,
  
  // Access Control Errors
  SecretNotFoundError,
  SecretAlreadyExistsError,
  InvalidSecretPathError,
  SecretReadError,
  SecretWriteError,
} from './vaulta.errors.js';

// ============================================================================
// DEVFORGE ERRORS
// ============================================================================

export {
  // Template Errors
  TemplateNotFoundError,
  TemplateParseError,
  TemplateStructureError,
  TemplateRenderError,
  
  // Feature Errors
  FeatureConflictError,
  FeatureNotFoundError,
  FeatureIncompatibleError,
  FeatureInstallError,
  
  // Generation Errors
  ProjectGenerationError,
  ProjectAlreadyExistsError,
  FileGenerationError,
  DirectoryCreationError,
  DependencyInstallError,
  
  // Configuration Errors
  DevforgeConfigurationError,
  ConfigNotFoundError,
  ConfigParseError,
} from './devforge.errors.js';
