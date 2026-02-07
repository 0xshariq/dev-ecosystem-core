/**
 * Orbyt Error Classes
 * 
 * Concrete error implementations for the Orbyt workflow execution engine.
 * All errors extend BaseError and use OrbytErrorCodes.
 * 
 * @category Orbyt
 * @public
 */

import { BaseError } from './BaseError.js';
import { ErrorType, ErrorSeverity } from './ErrorTypes.js';
import { ExitCodes } from '../exit-codes/ExitCodes.js';
import { OrbytErrorCodes } from './ErrorCodes.js';

// ============================================================================
// WORKFLOW ERRORS
// ============================================================================

export class WorkflowValidationError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.USER;
  readonly code = OrbytErrorCodes.WORKFLOW_SCHEMA_INVALID;
  readonly exitCode = ExitCodes.INVALID_SCHEMA;
  readonly severity = ErrorSeverity.HIGH;
}

export class WorkflowCycleDetectedError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.USER;
  readonly code = OrbytErrorCodes.WORKFLOW_CYCLE_DETECTED;
  readonly exitCode = ExitCodes.CIRCULAR_DEPENDENCY;
  readonly severity = ErrorSeverity.HIGH;
}

export class WorkflowParseError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.USER;
  readonly code = OrbytErrorCodes.WORKFLOW_PARSE_FAILED;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  readonly severity = ErrorSeverity.HIGH;
}

export class WorkflowNotFoundError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.USER;
  readonly code = OrbytErrorCodes.WORKFLOW_NOT_FOUND;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  readonly severity = ErrorSeverity.MEDIUM;
}

// ============================================================================
// STEP ERRORS
// ============================================================================

export class StepNotFoundError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.USER;
  readonly code = OrbytErrorCodes.STEP_NOT_FOUND;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class StepTimeoutError extends BaseError {
  readonly component = 'orbyt';
  readonly type =ErrorType.EXECUTION;
  readonly code = OrbytErrorCodes.STEP_TIMEOUT;
  readonly exitCode = ExitCodes.TIMEOUT;
  readonly severity = ErrorSeverity.MEDIUM;
  readonly retryable = true;
}

export class StepExecutionError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.EXECUTION;
  readonly code = OrbytErrorCodes.STEP_EXECUTION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  readonly severity = ErrorSeverity.HIGH;
}

export class StepDependencyError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.EXECUTION;
  readonly code = OrbytErrorCodes.STEP_DEPENDENCY_FAILED;
  readonly exitCode = ExitCodes.DEPENDENCY_FAILED;
  readonly severity = ErrorSeverity.HIGH;
}

export class StepConfigurationError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.CONFIG;
  readonly code = OrbytErrorCodes.STEP_CONFIG_INVALID;
  readonly exitCode = ExitCodes.INVALID_CONFIG;
  readonly severity = ErrorSeverity.MEDIUM;
}

// ============================================================================
// ADAPTER ERRORS
// ============================================================================

export class AdapterNotRegisteredError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.CONFIG;
  readonly code = OrbytErrorCodes.ADAPTER_NOT_REGISTERED;
  readonly exitCode = ExitCodes.MISSING_DEPENDENCY;
  readonly severity = ErrorSeverity.HIGH;
}

export class AdapterExecutionError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.EXECUTION;
  readonly code = OrbytErrorCodes.ADAPTER_EXECUTION_FAILED;
  readonly exitCode = ExitCodes.ADAPTER_FAILED;
  readonly severity = ErrorSeverity.HIGH;
}

export class AdapterInitializationError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.CONFIG;
  readonly code = OrbytErrorCodes.ADAPTER_INIT_FAILED;
  readonly exitCode = ExitCodes.INITIALIZATION_FAILED;
  readonly severity = ErrorSeverity.CRITICAL;
}

export class AdapterNotFoundError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.CONFIG;
  readonly code = OrbytErrorCodes.ADAPTER_NOT_FOUND;
  readonly exitCode = ExitCodes.MISSING_DEPENDENCY;
  readonly severity = ErrorSeverity.HIGH;
}

// ============================================================================
// ENGINE ERRORS
// ============================================================================

export class EngineInitializationError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.INTERNAL;
  readonly code = OrbytErrorCodes.ENGINE_INITIALIZATION_FAILED;
  readonly exitCode = ExitCodes.INITIALIZATION_FAILED;
  readonly severity = ErrorSeverity.CRITICAL;
}

export class EngineStateCorruptedError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.INTERNAL;
  readonly code = OrbytErrorCodes.ENGINE_STATE_CORRUPTED;
  readonly exitCode = ExitCodes.STATE_CORRUPTION;
  readonly severity = ErrorSeverity.CRITICAL;
}

export class EngineExecutionError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.EXECUTION;
  readonly code = OrbytErrorCodes.ENGINE_EXECUTION_FAILED;
  readonly exitCode = ExitCodes.WORKFLOW_FAILED;
  readonly severity = ErrorSeverity.HIGH;
}

// ============================================================================
// VARIABLE ERRORS
// ============================================================================

export class VariableNotFoundError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.USER;
  readonly code = OrbytErrorCodes.VARIABLE_NOT_FOUND;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class VariableResolutionError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.EXECUTION;
  readonly code = OrbytErrorCodes.VARIABLE_RESOLUTION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class VariableCircularReferenceError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.USER;
  readonly code = OrbytErrorCodes.VARIABLE_CIRCULAR_REFERENCE;
  readonly exitCode = ExitCodes.CIRCULAR_DEPENDENCY;
  readonly severity = ErrorSeverity.HIGH;
}

// ============================================================================
// SECRET ERRORS
// ============================================================================

export class SecretNotFoundError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.CONFIG;
  readonly code = OrbytErrorCodes.SECRET_NOT_FOUND;
  readonly exitCode = ExitCodes.MISSING_SECRET;
  readonly severity = ErrorSeverity.HIGH;
}

export class SecretResolutionError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.SECURITY;
  readonly code = OrbytErrorCodes.SECRET_RESOLUTION_FAILED;
  readonly exitCode = ExitCodes.SECRET_RESOLUTION_FAILED;
  readonly severity = ErrorSeverity.HIGH;
}

export class SecretVaultNotConfiguredError extends BaseError {
  readonly component = 'orbyt';
  readonly type = ErrorType.CONFIG;
  readonly code = OrbytErrorCodes.SECRET_VAULT_NOT_CONFIGURED;
  readonly exitCode = ExitCodes.MISSING_CONFIG;
  readonly severity = ErrorSeverity.HIGH;
}
