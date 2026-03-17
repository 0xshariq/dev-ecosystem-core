import type { ComponentPricing } from '../types/BillingTypes.js';
import { UsageEventType } from '../../usage/UsageTypes.js';

export const MEDIAPROC_PRICING_GUIDE: ComponentPricing = {
	component: 'mediaproc',
	rules: [
		{
			id: 'mediaproc-adapter-call',
			eventType: UsageEventType.ADAPTER_CALL,
			metric: 'count',
			pricePerUnit: 0.02,
			description: 'Charge per MediaProc adapter invocation',
		},
		{
			id: 'mediaproc-duration',
			eventType: UsageEventType.ADAPTER_CALL,
			adapterType: 'media',
			metric: 'duration-ms',
			pricePerUnit: 0.00001,
			minimumUnits: 1,
			description: 'Duration-based media processing charge',
		},
	],
};
