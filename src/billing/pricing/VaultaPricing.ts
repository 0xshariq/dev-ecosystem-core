import type { ComponentPricing } from '../types/BillingTypes.js';
import { UsageEventType } from '../../usage/UsageTypes.js';

export const VAULTA_PRICING_GUIDE: ComponentPricing = {
	component: 'vaulta',
	rules: [
		{
			id: 'vaulta-workflow-run',
			eventType: UsageEventType.WORKFLOW_RUN,
			metric: 'count',
			pricePerUnit: 0.015,
			description: 'Charge per Vaulta workflow run',
		},
		{
			id: 'vaulta-step-execute',
			eventType: UsageEventType.STEP_EXECUTE,
			metric: 'count',
			pricePerUnit: 0.002,
			description: 'Charge per Vaulta step execution',
		},
	],
};
