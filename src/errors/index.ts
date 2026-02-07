/**
 * Ecosystem Error System - Central Exports
 * 
 * This module provides a unified interface to the ecosystem's comprehensive
 * error handling system. All error types, codes, and concrete error classes
 * are exported from this single entry point.
 * 
 * @public
 * @module @ecosystem/core/errors
 */

// ============================================================================
// EXIT CODES
// ============================================================================

export * from '../exit-codes/ExitCodes.js';

// ============================================================================
// ERROR TYPES & CLASSIFICATIONS
// ============================================================================

export * from './ErrorTypes.js';

// ============================================================================
// BASE ERROR & UTILITIES
// ============================================================================

export * from './BaseError.js';

// ============================================================================
// ERROR CODES - All Components
// ============================================================================

export * from './ErrorCodes.js';
export * from './mediaproc.codes.js';
export * from './vaulta.codes.js';
export * from './devforge.codes.js';

// ============================================================================
// ERROR CLASSES - All Components
// ============================================================================

export * from './orbyt.errors.js';
export * from './mediaproc.errors.js';
export * from './vaulta.errors.js';
export * from './devforge.errors.js';
