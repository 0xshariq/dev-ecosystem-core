import type { ComponentPricing } from '../types/BillingTypes.js';
import { UsageEventType } from '../../usage/UsageTypes.js';

export const ORBYT_PRICING_GUIDE: ComponentPricing = {
	component: 'orbyt',
	rules: [
		{
			id: 'orbyt-workflow-run',
			eventType: UsageEventType.WORKFLOW_RUN,
			metric: 'count',
			pricePerUnit: 0.01,
			description: 'Charge per workflow run',
		},
		{
			id: 'orbyt-step-execute',
			eventType: UsageEventType.STEP_EXECUTE,
			metric: 'count',
			pricePerUnit: 0.001,
			description: 'Charge per executed step',
		},
	],
};
