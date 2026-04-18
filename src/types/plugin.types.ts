/**
 * Plugin Types
 *
 * Language-agnostic plugin manifest contracts used to register adapters
 * implemented in any runtime (Node.js, Python, Go, Rust, Java, .NET, etc.).
 *
 * @module types/plugin
 */

import type { AdapterCapabilities } from './adapter.types.js';

export type AdapterTransport =
	| 'inproc'
	| 'stdio'
	| 'http'
	| 'grpc'
	| 'websocket'
	| 'queue';

export interface PluginRuntimeDefinition {
	language: string;
	version?: string;
	entrypoint?: string;
	transport?: AdapterTransport;
}

export interface AdapterProtocolAuth {
	type?: 'none' | 'bearer' | 'basic' | 'mtls' | 'custom';
	secretRef?: string;
}

export interface AdapterProtocolConfig {
	transport: AdapterTransport;
	command?: string;
	args?: string[];
	endpoint?: string;
	timeoutMs?: number;
	retries?: number;
	auth?: AdapterProtocolAuth;
}

export interface AdapterManifestEntry {
	name: string;
	version: string;
	description?: string;
	author?: string;
	homepage?: string;
	license?: string;
	tags?: string[];
	supportedActions: string[];
	capabilities: AdapterCapabilities;
	protocol: AdapterProtocolConfig;
}

export interface PluginManifestDefinition {
	name: string;
	version: string;
	description?: string;
	author?: string;
	homepage?: string;
	license?: string;
	runtime: PluginRuntimeDefinition;
	adapters: AdapterManifestEntry[];
	permissions?: {
		network?: boolean;
		filesystem?: boolean;
		database?: boolean;
	};
	metadata?: Record<string, unknown>;
}
