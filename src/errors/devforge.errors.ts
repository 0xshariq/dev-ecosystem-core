/**
 * Devforge Error Classes
 * 
 * Concrete error implementations for the Devforge project scaffolding tool.
 * All errors extend BaseError and use DevforgeErrorCodes.
 * 
 * @category Devforge
 * @public
 */

import { BaseError } from './BaseError.js';
import { ErrorType, ErrorSeverity } from './ErrorTypes.js';
import { ExitCodes } from '../exit-codes/ExitCodes.js';
import { DevforgeErrorCodes } from './devforge.codes.js';

// ============================================================================
// TEMPLATE ERRORS
// ============================================================================

export class TemplateNotFoundError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.USER;
  readonly code = DevforgeErrorCodes.TEMPLATE_NOT_FOUND;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class TemplateParseError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.INTERNAL;
  readonly code = DevforgeErrorCodes.TEMPLATE_PARSE_FAILED;
  readonly exitCode = ExitCodes.INTERNAL_ERROR;
  override readonly severity = ErrorSeverity.HIGH;
}

export class TemplateStructureError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.USER;
  readonly code = DevforgeErrorCodes.TEMPLATE_STRUCTURE_INVALID;
  readonly exitCode = ExitCodes.INVALID_SCHEMA;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class TemplateRenderError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.EXECUTION;
  readonly code = DevforgeErrorCodes.TEMPLATE_RENDER_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.MEDIUM;
}

// ============================================================================
// FEATURE ERRORS
// ============================================================================

export class FeatureConflictError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.USER;
  readonly code = DevforgeErrorCodes.FEATURE_CONFLICT;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class FeatureNotFoundError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.USER;
  readonly code = DevforgeErrorCodes.FEATURE_NOT_FOUND;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class FeatureIncompatibleError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.USER;
  readonly code = DevforgeErrorCodes.FEATURE_INCOMPATIBLE;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class FeatureInstallError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.EXECUTION;
  readonly code = DevforgeErrorCodes.FEATURE_INSTALL_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
}

// ============================================================================
// GENERATION ERRORS
// ============================================================================

export class ProjectGenerationError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.EXECUTION;
  readonly code = DevforgeErrorCodes.PROJECT_GENERATION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
}

export class ProjectAlreadyExistsError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.USER;
  readonly code = DevforgeErrorCodes.PROJECT_ALREADY_EXISTS;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class FileGenerationError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.EXECUTION;
  readonly code = DevforgeErrorCodes.FILE_GENERATION_FAILED;
  readonly exitCode = ExitCodes.FILESYSTEM_ERROR;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class DirectoryCreationError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.EXECUTION;
  readonly code = DevforgeErrorCodes.DIRECTORY_CREATION_FAILED;
  readonly exitCode = ExitCodes.FILESYSTEM_ERROR;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class DependencyInstallError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.EXECUTION;
  readonly code = DevforgeErrorCodes.DEPENDENCY_INSTALL_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
  override readonly retryable = true;
}

// ============================================================================
// CONFIGURATION ERRORS
// ============================================================================

export class DevforgeConfigurationError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.CONFIG;
  readonly code = DevforgeErrorCodes.CONFIG_INVALID;
  readonly exitCode = ExitCodes.INVALID_CONFIG;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ConfigNotFoundError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.CONFIG;
  readonly code = DevforgeErrorCodes.CONFIG_NOT_FOUND;
  readonly exitCode = ExitCodes.MISSING_CONFIG;
  override readonly severity = ErrorSeverity.MEDIUM;
}

export class ConfigParseError extends BaseError {
  readonly component = 'devforge';
  readonly type = ErrorType.CONFIG;
  readonly code = DevforgeErrorCodes.CONFIG_PARSE_FAILED;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly severity = ErrorSeverity.MEDIUM;
}
