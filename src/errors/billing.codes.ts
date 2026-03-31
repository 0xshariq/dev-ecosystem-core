/**
 * Billing Error Codes
 *
 * Structured error codes for the billing engine and service.
 *
 * Pattern: BILLING-<CATEGORY>-<NUMBER>
 *
 * Categories:
 * - PRICE: Pricing catalog and pricing rule errors
 * - FETCH: Usage fetch and provider errors
 * - CALC: Billing calculation errors
 * - QUOTA: Quota and overuse detection errors
 * - CONFIG: Configuration errors
 *
 * @category Billing
 * @public
 */

export const BillingErrorCodes = {
  // =========================================================================
  // PRICING (PRICE) - Pricing catalog and rule errors
  // =========================================================================

  /** Pricing catalog not configured */
  PRICING_NOT_CONFIGURED: 'BILLING-PRICE-001',

  /** Invalid pricing catalog format */
  PRICING_CATALOG_INVALID: 'BILLING-PRICE-002',

  /** Pricing rule not found for component */
  PRICING_RULE_NOT_FOUND: 'BILLING-PRICE-003',

  /** Invalid pricing rule definition */
  PRICING_RULE_INVALID: 'BILLING-PRICE-004',

  /** Pricing version mismatch */
  PRICING_VERSION_MISMATCH: 'BILLING-PRICE-005',

  // =========================================================================
  // USAGE FETCH (FETCH) - Usage fetch and provider errors
  // =========================================================================

  /** Usage fetch provider not configured */
  USAGE_FETCH_PROVIDER_NOT_CONFIGURED: 'BILLING-FETCH-001',

  /** Usage fetch operation failed */
  USAGE_FETCH_FAILED: 'BILLING-FETCH-002',

  /** Invalid usage fetch options */
  USAGE_FETCH_OPTIONS_INVALID: 'BILLING-FETCH-003',

  /** Usage fetch cursor invalid */
  USAGE_FETCH_CURSOR_INVALID: 'BILLING-FETCH-004',

  /** No usage data available for period */
  USAGE_FETCH_NO_DATA: 'BILLING-FETCH-005',

  /** Usage fetch timeout */
  USAGE_FETCH_TIMEOUT: 'BILLING-FETCH-006',

  /** Usage fetch partial failure */
  USAGE_FETCH_PARTIAL_FAILURE: 'BILLING-FETCH-007',

  // =========================================================================
  // CALCULATION (CALC) - Billing calculation errors
  // =========================================================================

  /** Billing calculation failed */
  CALCULATION_FAILED: 'BILLING-CALC-001',

  /** Invalid usage event format */
  USAGE_EVENT_INVALID: 'BILLING-CALC-002',

  /** Unsupported usage event type */
  USAGE_EVENT_TYPE_UNSUPPORTED: 'BILLING-CALC-003',

  /** Calculation precision loss or overflow */
  CALCULATION_PRECISION_ERROR: 'BILLING-CALC-004',

  /** Currency conversion failed */
  CURRENCY_CONVERSION_FAILED: 'BILLING-CALC-005',

  // =========================================================================
  // QUOTA (QUOTA) - Quota enforcement and overuse detection
  // =========================================================================

  /** Quota policy not found */
  QUOTA_POLICY_NOT_FOUND: 'BILLING-QUOTA-001',

  /** Quota policy invalid */
  QUOTA_POLICY_INVALID: 'BILLING-QUOTA-002',

  /** Quota exceeded - hard limit blocked */
  QUOTA_EXCEEDED: 'BILLING-QUOTA-003',

  /** Quota status query failed */
  QUOTA_STATUS_QUERY_FAILED: 'BILLING-QUOTA-004',

  /** Quota calculation error */
  QUOTA_CALCULATION_ERROR: 'BILLING-QUOTA-005',

  // =========================================================================
  // CONFIGURATION (CONFIG) - Configuration errors
  // =========================================================================

  /** Billing configuration invalid */
  CONFIG_INVALID: 'BILLING-CONFIG-001',

  /** Missing required billing configuration */
  CONFIG_MISSING_REQUIRED: 'BILLING-CONFIG-002',

  /** Billing endpoint unreachable */
  BILLING_ENDPOINT_UNREACHABLE: 'BILLING-CONFIG-003',

  /** Billing service unavailable */
  BILLING_SERVICE_UNAVAILABLE: 'BILLING-CONFIG-004',
} as const;

/**
 * Mapping of error codes to user-friendly messages
 */
export const BillingErrorMessages: Record<string, string> = {
  [BillingErrorCodes.PRICING_NOT_CONFIGURED]:
    'Pricing catalog has not been configured. Call setPricingCatalog() first.',

  [BillingErrorCodes.PRICING_CATALOG_INVALID]:
    'Pricing catalog format is invalid. Check version, currency, and component definitions.',

  [BillingErrorCodes.PRICING_RULE_NOT_FOUND]:
    'No pricing rule found for the requested component.',

  [BillingErrorCodes.PRICING_RULE_INVALID]:
    'Pricing rule definition is invalid. Check metric, scopes, and thresholds.',

  [BillingErrorCodes.PRICING_VERSION_MISMATCH]:
    'Pricing version mismatch between catalog and calculation. Update pricing catalog.',

  [BillingErrorCodes.USAGE_FETCH_PROVIDER_NOT_CONFIGURED]:
    'Usage fetch provider is not configured. Call setUsageFetchProvider() first.',

  [BillingErrorCodes.USAGE_FETCH_FAILED]:
    'Failed to fetch usage data. Check network connectivity and provider configuration.',

  [BillingErrorCodes.USAGE_FETCH_OPTIONS_INVALID]:
    'Usage fetch options are invalid. Check period type, time ranges, and filters.',

  [BillingErrorCodes.USAGE_FETCH_CURSOR_INVALID]:
    'Usage fetch cursor is invalid or expired. Request new cursor from provider.',

  [BillingErrorCodes.USAGE_FETCH_NO_DATA]:
    'No usage data available for the requested period or filters.',

  [BillingErrorCodes.USAGE_FETCH_TIMEOUT]:
    'Usage fetch operation timed out. The provider took too long to respond.',

  [BillingErrorCodes.USAGE_FETCH_PARTIAL_FAILURE]:
    'Usage fetch completed with partial failure. Some data could not be retrieved.',

  [BillingErrorCodes.CALCULATION_FAILED]:
    'Billing calculation failed. Check usage events and pricing rules.',

  [BillingErrorCodes.USAGE_EVENT_INVALID]:
    'Usage event format is invalid. Ensure required fields are present.',

  [BillingErrorCodes.USAGE_EVENT_TYPE_UNSUPPORTED]:
    'Usage event type is not supported by the current pricing rules.',

  [BillingErrorCodes.CALCULATION_PRECISION_ERROR]:
    'Billing calculation encountered precision or overflow error.',

  [BillingErrorCodes.CURRENCY_CONVERSION_FAILED]:
    'Currency conversion failed. Check exchange rates and currency codes.',

  [BillingErrorCodes.QUOTA_POLICY_NOT_FOUND]:
    'Quota policy not found for the requested tier.',

  [BillingErrorCodes.QUOTA_POLICY_INVALID]:
    'Quota policy definition is invalid. Check policy structure and limits.',

  [BillingErrorCodes.QUOTA_EXCEEDED]:
    'Hard quota limit exceeded. Operation blocked to prevent overuse.',

  [BillingErrorCodes.QUOTA_STATUS_QUERY_FAILED]:
    'Failed to query quota status. Check quota configuration.',

  [BillingErrorCodes.QUOTA_CALCULATION_ERROR]:
    'Error calculating quota usage. Check billing state and calculations.',

  [BillingErrorCodes.CONFIG_INVALID]:
    'Billing configuration is invalid. Check settings and required parameters.',

  [BillingErrorCodes.CONFIG_MISSING_REQUIRED]:
    'Required billing configuration is missing.',

  [BillingErrorCodes.BILLING_ENDPOINT_UNREACHABLE]:
    'Billing endpoint is unreachable. Check network and service availability.',

  [BillingErrorCodes.BILLING_SERVICE_UNAVAILABLE]:
    'Billing service is temporarily unavailable. Please retry later.',
};
