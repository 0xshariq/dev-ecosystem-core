/**
 * Vaulta Error Classes
 * 
 * Concrete error implementations for the Vaulta secret vault.
 * All errors extend BaseError and use VaultaErrorCodes.
 * 
 * @category Vaulta
 * @public
 */

import { BaseError } from './BaseError.js';
import { ErrorType, ErrorSeverity } from './ErrorTypes.js';
import { ExitCodes } from '../exit-codes/ExitCodes.js';
import { VaultaErrorCodes } from './vaulta.codes.js';

// ============================================================================
// VAULT LIFECYCLE ERRORS
// ============================================================================

export class VaultNotInitializedError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.CONFIG;
  readonly code = VaultaErrorCodes.VAULT_NOT_INITIALIZED;
  readonly exitCode = ExitCodes.MISSING_CONFIG;
  readonly severity = ErrorSeverity.HIGH;
}

export class VaultLockedError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.SECURITY;
  readonly code = VaultaErrorCodes.VAULT_LOCKED;
  readonly exitCode = ExitCodes.VAULT_LOCKED;
  readonly severity = ErrorSeverity.HIGH;
  
  toUserMessage(): string {
    return 'Vault is locked. Please unlock it with: vaulta unlock';
  }
}

export class VaultAlreadyExistsError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.USER;
  readonly code = VaultaErrorCodes.VAULT_ALREADY_EXISTS;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class VaultNotFoundError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.USER;
  readonly code = VaultaErrorCodes.VAULT_NOT_FOUND;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class VaultCorruptedError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.INTERNAL;
  readonly code = VaultaErrorCodes.VAULT_CORRUPTED;
  readonly exitCode = ExitCodes.STATE_CORRUPTION;
  readonly severity = ErrorSeverity.CRITICAL;
}

// ============================================================================
// SECURITY ERRORS
// ============================================================================

export class InvalidMasterPasswordError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.SECURITY;
  readonly code = VaultaErrorCodes.INVALID_MASTER_PASSWORD;
  readonly exitCode = ExitCodes.INVALID_CREDENTIALS;
  readonly severity = ErrorSeverity.HIGH;
  
  toUserMessage(): string {
    return 'Invalid master password. Please try again.';
  }
}

export class VaultPermissionDeniedError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.SECURITY;
  readonly code = VaultaErrorCodes.PERMISSION_DENIED;
  readonly exitCode = ExitCodes.PERMISSION_DENIED;
  readonly severity = ErrorSeverity.HIGH;
}

export class VaultAuthenticationError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.SECURITY;
  readonly code = VaultaErrorCodes.AUTH_FAILED;
  readonly exitCode = ExitCodes.AUTH_FAILED;
  readonly severity = ErrorSeverity.HIGH;
}

export class VaultSessionExpiredError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.SECURITY;
  readonly code = VaultaErrorCodes.SESSION_EXPIRED;
  readonly exitCode = ExitCodes.AUTH_FAILED;
  readonly severity = ErrorSeverity.MEDIUM;
  
  toUserMessage(): string {
    return 'Session expired. Please unlock the vault again.';
  }
}

// ============================================================================
// CRYPTOGRAPHY ERRORS
// ============================================================================

export class EncryptionError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.INTERNAL;
  readonly code = VaultaErrorCodes.ENCRYPTION_FAILED;
  readonly exitCode = ExitCodes.INTERNAL_ERROR;
  readonly severity = ErrorSeverity.CRITICAL;
}

export class DecryptionError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.SECURITY;
  readonly code = VaultaErrorCodes.DECRYPTION_FAILED;
  readonly exitCode = ExitCodes.INTERNAL_ERROR;
  readonly severity = ErrorSeverity.CRITICAL;
}

export class InvalidEncryptionKeyError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.SECURITY;
  readonly code = VaultaErrorCodes.INVALID_ENCRYPTION_KEY;
  readonly exitCode = ExitCodes.INVALID_CREDENTIALS;
  readonly severity = ErrorSeverity.CRITICAL;
}

// ============================================================================
// ACCESS CONTROL ERRORS
// ============================================================================

export class SecretNotFoundError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.USER;
  readonly code = VaultaErrorCodes.SECRET_NOT_FOUND;
  readonly exitCode = ExitCodes.MISSING_SECRET;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class SecretAlreadyExistsError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.USER;
  readonly code = VaultaErrorCodes.SECRET_ALREADY_EXISTS;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class InvalidSecretPathError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.USER;
  readonly code = VaultaErrorCodes.INVALID_SECRET_PATH;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class SecretReadError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.EXECUTION;
  readonly code = VaultaErrorCodes.SECRET_READ_FAILED;
  readonly exitCode = ExitCodes.INTERNAL_ERROR;
  readonly severity = ErrorSeverity.MEDIUM;
}

export class SecretWriteError extends BaseError {
  readonly component = 'vaulta';
  readonly type = ErrorType.EXECUTION;
  readonly code = VaultaErrorCodes.SECRET_WRITE_FAILED;
  readonly exitCode = ExitCodes.INTERNAL_ERROR;
  readonly severity = ErrorSeverity.MEDIUM;
}
