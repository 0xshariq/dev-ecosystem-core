/**
 * Ecosystem Core - Central Exports
 * 
 * This is the main entry point for the @dev-ecosystem/core package.
 * All schemas, types, errors, exit codes, and utilities are exported from here.
 * 
 * @packageDocumentation
 * @module @dev-ecosystem/core
 */

// ============================================================================
// EXIT CODES
// ============================================================================

export * from './exit-codes/ExitCodes.js';

// ============================================================================
// ERROR TYPES & SEVERITY
// ============================================================================

export * from './errors/ErrorTypes.js';

// ============================================================================
// BASE ERROR & UTILITIES
// ============================================================================

export * from './errors/BaseError.js';

// ============================================================================
// ERROR CODES - All Components
// ============================================================================

export * from './errors/ErrorCodes.js';
export * from './errors/mediaproc.codes.js';
export * from './errors/vaulta.codes.js';
export * from './errors/devforge.codes.js';

// ============================================================================
// ERROR CLASSES - All Components
// ============================================================================

export * from './errors/orbyt.errors.js';
export * from './errors/mediaproc.errors.js';
export * from './errors/vaulta.errors.js';
export * from './errors/devforge.errors.js';

// ============================================================================
// WORKFLOW SCHEMAS - Zod (Runtime Validation)
// ============================================================================

export * from './schemas/workflow.schema.zod.js';

// ============================================================================
// WORKFLOW TYPES - TypeScript Definitions
// ============================================================================

export * from './types/workflow.interfaces.js';

// ============================================================================
// ADAPTER TYPES - TypeScript Definitions
// ============================================================================

export * from './types/adapter.types.js';

// ============================================================================
// SCHEMA UTILITIES
// ============================================================================

export * from './schemas/index.js';

// ============================================================================
// LOGGING UTILITIES
// ============================================================================

export * from './logging/LogFormat.js';

// ============================================================================
// CONTRACTS - Interface Definitions
// ============================================================================

export * from './contracts/adapter.contract.js';
export * from './contracts/cli.contract.js';
export * from './contracts/engine.contract.js';
export * from './contracts/plugin.contract.js';
export * from './contracts/vault.contract.js';
export * from './contracts/workflow.contract.js';

// ============================================================================
// UTILITIES
// ============================================================================

export * from './utils/assert.js';

// ============================================================================
// BILLING (Framework - Implementation in Products)
// ============================================================================

// Note: Billing framework is exported from billing/index.ts when needed
// Currently empty as billing logic is product-specific
// export * from './billing/index.js';
