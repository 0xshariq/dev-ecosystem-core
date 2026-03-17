import type { UsageCollector, UsageEvent } from '../../usage/UsageTypes.js';
import type {
	BillingCalculationResult,
	BillingPricingCatalog,
} from '../types/BillingTypes.js';
import { BillingEngine } from './BillingEngine.js';

export class UsageTracker implements UsageCollector {
	readonly contractVersion = '1.0' as const;
	readonly target = 'billing-engine' as const;

	private readonly events: UsageEvent[] = [];
	private readonly seen = new Set<string>();
	private lastSuccessAt?: number;
	private billingEngine: BillingEngine;

	constructor(pricing: BillingPricingCatalog) {
		this.billingEngine = new BillingEngine(pricing);
	}

	setPricingCatalog(pricing: BillingPricingCatalog): void {
		this.billingEngine.setPricing(pricing);
	}

	async record(event: UsageEvent): Promise<void> {
		const key = event.idempotencyKey ?? event.id;
		if (this.seen.has(key)) {
			return;
		}

		this.validateEvent(event);
		this.events.push(event);
		this.seen.add(key);
		this.lastSuccessAt = Date.now();
	}

	async recordBatch(events: UsageEvent[]): Promise<void> {
		for (const event of events) {
			await this.record(event);
		}
	}

	async flush(): Promise<void> {
		this.lastSuccessAt = Date.now();
	}

	async healthCheck(): Promise<{ healthy: boolean; detail?: string; lastSuccessAt?: number }> {
		return {
			healthy: true,
			detail: 'UsageTracker is accepting standardized UsageEvent records',
			lastSuccessAt: this.lastSuccessAt,
		};
	}

	async close(): Promise<void> {
		await this.flush();
	}

	calculateCurrentCharges(): BillingCalculationResult {
		return this.billingEngine.calculateFromUsage(this.events);
	}

	getUsageEvents(): UsageEvent[] {
		return [...this.events];
	}

	clearUsageEvents(): void {
		this.events.length = 0;
		this.seen.clear();
	}

	private validateEvent(event: UsageEvent): void {
		if (!event.id) {
			throw new Error('Invalid UsageEvent: id is required');
		}
		if (!event.product) {
			throw new Error('Invalid UsageEvent: product is required');
		}
		if (!event.executionId) {
			throw new Error('Invalid UsageEvent: executionId is required');
		}
		if (!event.type) {
			throw new Error('Invalid UsageEvent: type is required');
		}
	}
}
