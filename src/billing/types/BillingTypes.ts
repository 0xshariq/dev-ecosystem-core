import type { UsageEvent, UsageEventType } from '../../usage/UsageTypes.js';

export type BillingCurrency = 'USD' | 'INR' | 'EUR' | string;

export type BillingMetric = 'count' | 'duration-ms';

export interface PricingRule {
	id: string;
	description?: string;
	eventType?: UsageEventType;
	adapterType?: string;
	adapterName?: string;
	metric: BillingMetric;
	pricePerUnit: number;
	minimumUnits?: number;
	billableOnly?: boolean;
}

export interface ComponentPricing {
	component: string;
	currency?: BillingCurrency;
	rules: PricingRule[];
}

export interface BillingPricingCatalog {
	version: string;
	currency: BillingCurrency;
	components: Record<string, ComponentPricing>;
	defaults?: {
		fallbackPricePerEvent?: number;
		fallbackMetric?: BillingMetric;
	};
}

export interface BillingLineItem {
	eventId: string;
	eventType: UsageEventType;
	component: string;
	ruleId: string;
	metric: BillingMetric;
	units: number;
	unitPrice: number;
	amount: number;
	currency: BillingCurrency;
}

export interface IgnoredUsageEvent {
	eventId: string;
	component: string;
	reason: string;
}

export interface BillingCalculationResult {
	currency: BillingCurrency;
	totalAmount: number;
	billedEvents: number;
	ignoredEvents: number;
	lineItems: BillingLineItem[];
	ignored: IgnoredUsageEvent[];
	byComponent: Record<string, number>;
}

export interface BillingCalculationInput {
	pricing: BillingPricingCatalog;
	usageEvents: UsageEvent[];
}
