import type { BillingPricingCatalog } from '../types/BillingTypes.js';

export const DEFAULT_ECOSYSTEM_PRICING: BillingPricingCatalog = {
	version: '1.0.0',
	currency: 'USD',
	components: {},
	defaults: {
		fallbackPricePerEvent: 0,
		fallbackMetric: 'count',
	},
};

export function createEcosystemPricingCatalog(
	components: BillingPricingCatalog['components'],
	overrides?: Partial<Omit<BillingPricingCatalog, 'components'>>,
): BillingPricingCatalog {
	return {
		version: overrides?.version ?? DEFAULT_ECOSYSTEM_PRICING.version,
		currency: overrides?.currency ?? DEFAULT_ECOSYSTEM_PRICING.currency,
		components,
		defaults: {
			...DEFAULT_ECOSYSTEM_PRICING.defaults,
			...overrides?.defaults,
		},
	};
}
