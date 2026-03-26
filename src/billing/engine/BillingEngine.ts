import type { UsageCollector, UsageEvent } from '../../usage/UsageTypes.js';
import type {
	BillingUsageFetchProvider,
	BillingUsageFetchOptions,
	BillingUsageFetchResult,
	BillingUsageIncrementalFetchOptions,
	BillingUsageIncrementalFetchResult,
} from '../types/BillingFetchTypes.js';
import type {
	BillingCalculationCollectorInput,
	BillingCalculationInput,
	BillingCalculationResult,
	BillingLineItem,
	BillingMetric,
	BillingPricingCatalog,
	IgnoredUsageEvent,
	PricingRule,
} from '../types/BillingTypes.js';

export class BillingEngine {
	private pricing: BillingPricingCatalog;
	private usageFetchProvider?: BillingUsageFetchProvider;
	private usageCollector?: UsageCollector;

	constructor(pricing: BillingPricingCatalog) {
		this.pricing = pricing;
	}

	setPricing(pricing: BillingPricingCatalog): void {
		this.pricing = pricing;
	}

	/**
	 * Collector-first usage ingestion wiring.
	 *
	 * TODO(v-next): make this mandatory for all online billing modes and retire
	 * array-based usage inputs.
	 */
	setUsageCollector(collector: UsageCollector): void {
		this.usageCollector = collector;
	}

	getUsageCollector(): UsageCollector | undefined {
		return this.usageCollector;
	}

	/**
	 * Foundation-only wiring: caller injects a usage fetch provider.
	 *
	 * TODO(v-next): add provider capability checks (period support, max limits,
	 * cursor guarantees) before accepting the provider.
	 */
	setUsageFetchProvider(provider: BillingUsageFetchProvider): void {
		this.usageFetchProvider = provider;
	}

	/**
	 * Foundation-only delegation for period billing fetches.
	 *
	 * TODO(v-next): normalize/validate period bounds here so all providers follow
	 * the same constraints from one place.
	 */
	async fetchUsageForBilling(options: BillingUsageFetchOptions = {}): Promise<BillingUsageFetchResult> {
		if (!this.usageFetchProvider) {
			throw new Error('Billing usage fetch provider is not configured');
		}
		return this.usageFetchProvider.fetchUsageForBilling(options);
	}

	/**
	 * Foundation-only delegation for incremental billing fetches.
	 *
	 * TODO(v-next): centralize cursor versioning/migration here.
	 */
	async fetchUsageForBillingIncremental(
		options: BillingUsageIncrementalFetchOptions = {},
	): Promise<BillingUsageIncrementalFetchResult> {
		if (!this.usageFetchProvider) {
			throw new Error('Billing usage fetch provider is not configured');
		}
		return this.usageFetchProvider.fetchUsageForBillingIncremental(options);
	}

	calculate(input: BillingCalculationInput): BillingCalculationResult {
		this.pricing = input.pricing;
		return this.calculateFromUsage(input.usageEvents);
	}

	/**
	 * Collector-first billing calculation foundation.
	 *
	 * This method only accepts UsageCollector (ecosystem-core contract).
	 * It reads events when the collector provides a snapshot accessor.
	 *
	 * TODO(v-next): introduce a formal snapshot/query contract on UsageCollector
	 * so BillingEngine does not rely on structural access checks.
	 */
	calculateFromCollector(input: BillingCalculationCollectorInput): BillingCalculationResult {
		this.pricing = input.pricing;
		this.usageCollector = input.usageCollector;

		const reader = input.usageCollector as UsageCollector & {
			getUsageEvents?: () => UsageEvent[];
		};

		if (typeof reader.getUsageEvents !== 'function') {
			throw new Error(
				'UsageCollector does not expose getUsageEvents(); snapshot/query support is required for billing calculation',
			);
		}

		return this.calculateFromUsage(reader.getUsageEvents());
	}

	calculateFromUsage(usageEvents: UsageEvent[]): BillingCalculationResult {
		const lineItems: BillingLineItem[] = [];
		const ignored: IgnoredUsageEvent[] = [];
		const byComponent: Record<string, number> = {};

		for (const event of usageEvents) {
			if (event.billable === false) {
				ignored.push({
					eventId: event.id,
					component: event.product,
					reason: 'Event is marked as non-billable',
				});
				continue;
			}

			const componentPricing = this.pricing.components[event.product];
			if (!componentPricing) {
				const fallbackPrice = this.pricing.defaults?.fallbackPricePerEvent;
				if (fallbackPrice === undefined) {
					ignored.push({
						eventId: event.id,
						component: event.product,
						reason: `No pricing configured for component '${event.product}'`,
					});
					continue;
				}

				const fallbackMetric = this.pricing.defaults?.fallbackMetric ?? 'count';
				const units = this.resolveUnits(event, fallbackMetric, 1);
				const amount = units * fallbackPrice;
				lineItems.push({
					eventId: event.id,
					eventType: event.type,
					component: event.product,
					ruleId: 'fallback',
					metric: fallbackMetric,
					units,
					unitPrice: fallbackPrice,
					amount,
					currency: this.pricing.currency,
				});
				byComponent[event.product] = (byComponent[event.product] ?? 0) + amount;
				continue;
			}

			const matchedRule = this.matchRule(componentPricing.rules, event);
			if (!matchedRule) {
				ignored.push({
					eventId: event.id,
					component: event.product,
					reason: `No matching pricing rule for event '${event.type}'`,
				});
				continue;
			}

			if (matchedRule.billableOnly === true && event.billable !== true) {
				ignored.push({
					eventId: event.id,
					component: event.product,
					reason: `Rule '${matchedRule.id}' requires billable event`,
				});
				continue;
			}

			const units = this.resolveUnits(
				event,
				matchedRule.metric,
				matchedRule.minimumUnits ?? 1,
			);
			const amount = units * matchedRule.pricePerUnit;

			lineItems.push({
				eventId: event.id,
				eventType: event.type,
				component: event.product,
				ruleId: matchedRule.id,
				metric: matchedRule.metric,
				units,
				unitPrice: matchedRule.pricePerUnit,
				amount,
				currency: componentPricing.currency ?? this.pricing.currency,
			});

			byComponent[event.product] = (byComponent[event.product] ?? 0) + amount;
		}

		const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

		return {
			currency: this.pricing.currency,
			totalAmount,
			billedEvents: lineItems.length,
			ignoredEvents: ignored.length,
			lineItems,
			ignored,
			byComponent,
		};
	}

	private matchRule(rules: PricingRule[], event: UsageEvent): PricingRule | null {
		for (const rule of rules) {
			if (rule.eventType && rule.eventType !== event.type) {
				continue;
			}
			if (rule.adapterType && rule.adapterType !== event.adapterType) {
				continue;
			}
			if (rule.adapterName && rule.adapterName !== event.adapterName) {
				continue;
			}
			return rule;
		}
		return null;
	}

	private resolveUnits(event: UsageEvent, metric: BillingMetric, minimumUnits: number): number {
		if (metric === 'duration-ms') {
			const duration = event.metadata?.durationMs ?? 0;
			return Math.max(duration, minimumUnits);
		}
		return Math.max(1, minimumUnits);
	}
}
