/**
 * Billing Error Classes
 *
 * Concrete error implementations for the billing engine.
 * All errors extend BaseError and use BillingErrorCodes.
 *
 * @category Billing
 * @public
 */

import { BaseError } from './BaseError.js';
import { ErrorType, ErrorSeverity } from './ErrorTypes.js';
import { ExitCodes } from '../exit-codes/ExitCodes.js';
import { BillingErrorCodes, BillingErrorMessages } from './billing.codes.js';

function resolveBillingMessage(code: string): string {
  return BillingErrorMessages[code] ?? 'Billing operation failed';
}

/**
 * Base billing error - extended by specific billing errors
 */
export abstract class BillingError extends BaseError {
  readonly component = 'billing';
  override readonly severity: ErrorSeverity = ErrorSeverity.MEDIUM;

  /**
   * Get the user-friendly message for this error
   */
  getUserMessage(): string {
    return BillingErrorMessages[this.code] ?? this.message;
  }
}

// ============================================================================
// PRICING ERRORS
// ============================================================================

export class PricingNotConfiguredError extends BillingError {
  readonly type = ErrorType.CONFIG;
  readonly code = BillingErrorCodes.PRICING_NOT_CONFIGURED;
  readonly exitCode = ExitCodes.SERVICE_UNAVAILABLE;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.PRICING_NOT_CONFIGURED), context);
  }
}

export class PricingCatalogInvalidError extends BillingError {
  readonly type = ErrorType.USER;
  readonly code = BillingErrorCodes.PRICING_CATALOG_INVALID;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.PRICING_CATALOG_INVALID), context);
  }
}

export class PricingRuleNotFoundError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.PRICING_RULE_NOT_FOUND;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.LOW;
  override readonly retryable = false;

  constructor(component: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.PRICING_RULE_NOT_FOUND)} (component: ${component})`,
      { ...context, component },
    );
  }
}

export class PricingRuleInvalidError extends BillingError {
  readonly type = ErrorType.USER;
  readonly code = BillingErrorCodes.PRICING_RULE_INVALID;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.PRICING_RULE_INVALID), context);
  }
}

export class PricingVersionMismatchError extends BillingError {
  readonly type = ErrorType.CONFIG;
  readonly code = BillingErrorCodes.PRICING_VERSION_MISMATCH;
  readonly exitCode = ExitCodes.SERVICE_UNAVAILABLE;
  override readonly retryable = true;

  constructor(expected: string, actual: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.PRICING_VERSION_MISMATCH)} (expected: ${expected}, got: ${actual})`,
      { ...context, expected, actual },
    );
  }
}

// ============================================================================
// USAGE FETCH ERRORS
// ============================================================================

export class UsageFetchProviderNotConfiguredError extends BillingError {
  readonly type = ErrorType.CONFIG;
  readonly code = BillingErrorCodes.USAGE_FETCH_PROVIDER_NOT_CONFIGURED;
  readonly exitCode = ExitCodes.SERVICE_UNAVAILABLE;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.USAGE_FETCH_PROVIDER_NOT_CONFIGURED), context);
  }
}

export class UsageFetchFailedError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.USAGE_FETCH_FAILED;
  readonly exitCode = ExitCodes.NETWORK_ERROR;
  override readonly retryable = true;

  constructor(reason?: string, context?: Record<string, any>) {
    const detail = reason ? ` (${reason})` : '';
    super(
      `${resolveBillingMessage(BillingErrorCodes.USAGE_FETCH_FAILED)}${detail}`,
      context,
    );
  }
}

export class UsageFetchOptionsInvalidError extends BillingError {
  readonly type = ErrorType.USER;
  readonly code = BillingErrorCodes.USAGE_FETCH_OPTIONS_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.USAGE_FETCH_OPTIONS_INVALID), context);
  }
}

export class UsageFetchCursorInvalidError extends BillingError {
  readonly type = ErrorType.USER;
  readonly code = BillingErrorCodes.USAGE_FETCH_CURSOR_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.USAGE_FETCH_CURSOR_INVALID), context);
  }
}

export class UsageFetchNoDataError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.USAGE_FETCH_NO_DATA;
  readonly exitCode = ExitCodes.VALIDATION_FAILED;
  override readonly severity = ErrorSeverity.LOW;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.USAGE_FETCH_NO_DATA), context);
  }
}

export class UsageFetchTimeoutError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.USAGE_FETCH_TIMEOUT;
  readonly exitCode = ExitCodes.TIMEOUT;
  override readonly retryable = true;

  constructor(timeoutMs: number, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.USAGE_FETCH_TIMEOUT)} (${timeoutMs}ms)`,
      { ...context, timeoutMs },
    );
  }
}

export class UsageFetchPartialFailureError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.USAGE_FETCH_PARTIAL_FAILURE;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.LOW;
  override readonly retryable = true;

  constructor(successCount: number, failureCount: number, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.USAGE_FETCH_PARTIAL_FAILURE)} (${successCount} succeeded, ${failureCount} failed)`,
      { ...context, successCount, failureCount },
    );
  }
}

// ============================================================================
// CALCULATION ERRORS
// ============================================================================

export class BillingCalculationFailedError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.CALCULATION_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly retryable = false;

  constructor(reason?: string, context?: Record<string, any>) {
    const detail = reason ? ` (${reason})` : '';
    super(
      `${resolveBillingMessage(BillingErrorCodes.CALCULATION_FAILED)}${detail}`,
      context,
    );
  }
}

export class UsageEventInvalidError extends BillingError {
  readonly type = ErrorType.USER;
  readonly code = BillingErrorCodes.USAGE_EVENT_INVALID;
  readonly exitCode = ExitCodes.INVALID_INPUT;
  override readonly retryable = false;

  constructor(detail?: string, context?: Record<string, any>) {
    const msg = detail ? ` (${detail})` : '';
    super(
      `${resolveBillingMessage(BillingErrorCodes.USAGE_EVENT_INVALID)}${msg}`,
      context,
    );
  }
}

export class UsageEventTypeUnsupportedError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.USAGE_EVENT_TYPE_UNSUPPORTED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.LOW;
  override readonly retryable = false;

  constructor(eventType: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.USAGE_EVENT_TYPE_UNSUPPORTED)} (type: ${eventType})`,
      { ...context, eventType },
    );
  }
}

export class CalculationPrecisionError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.CALCULATION_PRECISION_ERROR;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly severity = ErrorSeverity.HIGH;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.CALCULATION_PRECISION_ERROR), context);
  }
}

export class CurrencyConversionFailedError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.CURRENCY_CONVERSION_FAILED;
  readonly exitCode = ExitCodes.NETWORK_ERROR;
  override readonly retryable = true;

  constructor(from: string, to: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.CURRENCY_CONVERSION_FAILED)} (${from} → ${to})`,
      { ...context, from, to },
    );
  }
}

// ============================================================================
// QUOTA ERRORS
// ============================================================================

export class QuotaPolicyNotFoundError extends BillingError {
  readonly type = ErrorType.CONFIG;
  readonly code = BillingErrorCodes.QUOTA_POLICY_NOT_FOUND;
  readonly exitCode = ExitCodes.SERVICE_UNAVAILABLE;
  override readonly retryable = false;

  constructor(tier: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.QUOTA_POLICY_NOT_FOUND)} (tier: ${tier})`,
      { ...context, tier },
    );
  }
}

export class QuotaPolicyInvalidError extends BillingError {
  readonly type = ErrorType.USER;
  readonly code = BillingErrorCodes.QUOTA_POLICY_INVALID;
  readonly exitCode = ExitCodes.INVALID_FORMAT;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.QUOTA_POLICY_INVALID), context);
  }
}

export class QuotaExceededError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.QUOTA_EXCEEDED;
  readonly exitCode = ExitCodes.RESOURCE_ERROR;
  override readonly severity = ErrorSeverity.HIGH;
  override readonly retryable = false;

  constructor(reason: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.QUOTA_EXCEEDED)} (reason: ${reason})`,
      { ...context, reason },
    );
  }
}

export class QuotaStatusQueryFailedError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.QUOTA_STATUS_QUERY_FAILED;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly retryable = true;

  constructor(reason?: string, context?: Record<string, any>) {
    const detail = reason ? ` (${reason})` : '';
    super(
      `${resolveBillingMessage(BillingErrorCodes.QUOTA_STATUS_QUERY_FAILED)}${detail}`,
      context,
    );
  }
}

export class QuotaCalculationError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.QUOTA_CALCULATION_ERROR;
  readonly exitCode = ExitCodes.STEP_FAILED;
  override readonly retryable = false;

  constructor(reason?: string, context?: Record<string, any>) {
    const detail = reason ? ` (${reason})` : '';
    super(
      `${resolveBillingMessage(BillingErrorCodes.QUOTA_CALCULATION_ERROR)}${detail}`,
      context,
    );
  }
}

// Backwards compatibility alias (legacy exported name)
export class QuotaCalculationErrorClass extends QuotaCalculationError {}

// ============================================================================
// CONFIGURATION ERRORS
// ============================================================================

export class BillingConfigInvalidError extends BillingError {
  readonly type = ErrorType.CONFIG;
  readonly code = BillingErrorCodes.CONFIG_INVALID;
  readonly exitCode = ExitCodes.INVALID_CONFIG;
  override readonly retryable = false;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.CONFIG_INVALID), context);
  }
}

export class BillingConfigMissingRequiredError extends BillingError {
  readonly type = ErrorType.CONFIG;
  readonly code = BillingErrorCodes.CONFIG_MISSING_REQUIRED;
  readonly exitCode = ExitCodes.SERVICE_UNAVAILABLE;
  override readonly retryable = false;

  constructor(missingField: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.CONFIG_MISSING_REQUIRED)} (missing: ${missingField})`,
      { ...context, missingField },
    );
  }
}

export class BillingEndpointUnreachableError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.BILLING_ENDPOINT_UNREACHABLE;
  readonly exitCode = ExitCodes.NETWORK_ERROR;
  override readonly retryable = true;

  constructor(endpoint: string, context?: Record<string, any>) {
    super(
      `${resolveBillingMessage(BillingErrorCodes.BILLING_ENDPOINT_UNREACHABLE)} (${endpoint})`,
      { ...context, endpoint },
    );
  }
}

export class BillingServiceUnavailableError extends BillingError {
  readonly type = ErrorType.EXECUTION;
  readonly code = BillingErrorCodes.BILLING_SERVICE_UNAVAILABLE;
  readonly exitCode = ExitCodes.SERVICE_UNAVAILABLE;
  override readonly retryable = true;

  constructor(context?: Record<string, any>) {
    super(resolveBillingMessage(BillingErrorCodes.BILLING_SERVICE_UNAVAILABLE), context);
  }
}
