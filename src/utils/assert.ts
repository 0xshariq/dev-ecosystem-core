/**
 * @dev-ecosystem/core - Assertion Utilities
 * 
 * Provides validation and assertion utilities for runtime checks.
 * Used across the ecosystem for defensive programming and error handling.
 */

/**
 * Custom error class for assertion failures
 */
export class AssertionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AssertionError';
    Error.captureStackTrace(this, AssertionError);
  }
}

/**
 * Assert that a condition is true, throw error if false
 * @param condition - Condition to assert
 * @param message - Error message if assertion fails
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message || 'Assertion failed');
  }
}

/**
 * Assert that a value is defined (not null or undefined)
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertDefined<T>(
  value: T | null | undefined,
  name?: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new AssertionError(`Expected ${name || 'value'} to be defined, but got ${value}`);
  }
}

/**
 * Assert that a value is not null
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertNotNull<T>(
  value: T | null,
  name?: string
): asserts value is T {
  if (value === null) {
    throw new AssertionError(`Expected ${name || 'value'} to not be null`);
  }
}

/**
 * Assert that a value is a string
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertString(
  value: unknown,
  name?: string
): asserts value is string {
  if (typeof value !== 'string') {
    throw new AssertionError(
      `Expected ${name || 'value'} to be a string, but got ${typeof value}`
    );
  }
}

/**
 * Assert that a value is a number
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertNumber(
  value: unknown,
  name?: string
): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be a number, but got ${typeof value}`
    );
  }
}

/**
 * Assert that a value is a boolean
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertBoolean(
  value: unknown,
  name?: string
): asserts value is boolean {
  if (typeof value !== 'boolean') {
    throw new AssertionError(
      `Expected ${name || 'value'} to be a boolean, but got ${typeof value}`
    );
  }
}

/**
 * Assert that a value is an array
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertArray(
  value: unknown,
  name?: string
): asserts value is unknown[] {
  if (!Array.isArray(value)) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be an array, but got ${typeof value}`
    );
  }
}

/**
 * Assert that a value is an object (not null, not array)
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertObject(
  value: unknown,
  name?: string
): asserts value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be an object, but got ${typeof value}`
    );
  }
}

/**
 * Assert that a value is one of a set of allowed values
 * @param value - Value to check
 * @param allowed - Array of allowed values
 * @param name - Name of the value for error message
 */
export function assertOneOf<T>(
  value: unknown,
  allowed: readonly T[],
  name?: string
): asserts value is T {
  if (!allowed.includes(value as T)) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be one of [${allowed.join(', ')}], but got ${value}`
    );
  }
}

/**
 * Assert that a string matches a regex pattern
 * @param value - String to check
 * @param pattern - Regex pattern
 * @param name - Name of the value for error message
 */
export function assertMatches(
  value: string,
  pattern: RegExp,
  name?: string
): void {
  if (!pattern.test(value)) {
    throw new AssertionError(
      `Expected ${name || 'value'} to match pattern ${pattern}, but got "${value}"`
    );
  }
}

/**
 * Assert that a number is within a range
 * @param value - Number to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param name - Name of the value for error message
 */
export function assertRange(
  value: number,
  min: number,
  max: number,
  name?: string
): void {
  if (value < min || value > max) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be between ${min} and ${max}, but got ${value}`
    );
  }
}

/**
 * Assert that a value is never reached (exhaustive check)
 * @param value - Value that should never be reached
 * @param message - Error message
 */
export function assertNever(value: never, message?: string): never {
  throw new AssertionError(
    message || `Unexpected value: ${JSON.stringify(value)}`
  );
}

/**
 * Assert that a value is truthy
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertTruthy(value: unknown, name?: string): void {
  if (!value) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be truthy, but got ${value}`
    );
  }
}

/**
 * Assert that a value is falsy
 * @param value - Value to check
 * @param name - Name of the value for error message
 */
export function assertFalsy(value: unknown, name?: string): void {
  if (value) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be falsy, but got ${value}`
    );
  }
}

/**
 * Assert that two values are equal
 * @param actual - Actual value
 * @param expected - Expected value
 * @param name - Name of the values for error message
 */
export function assertEqual<T>(
  actual: T,
  expected: T,
  name?: string
): void {
  if (actual !== expected) {
    throw new AssertionError(
      `Expected ${name || 'values'} to be equal: expected ${expected}, got ${actual}`
    );
  }
}

/**
 * Assert that an array is not empty
 * @param value - Array to check
 * @param name - Name of the array for error message
 */
export function assertNotEmpty<T>(
  value: T[],
  name?: string
): asserts value is [T, ...T[]] {
  if (value.length === 0) {
    throw new AssertionError(
      `Expected ${name || 'array'} to not be empty`
    );
  }
}

/**
 * Assert that a value is an instance of a class
 * @param value - Value to check
 * @param constructor - Class constructor
 * @param name - Name of the value for error message
 */
export function assertInstanceOf<T>(
  value: unknown,
  constructor: new (...args: any[]) => T,
  name?: string
): asserts value is T {
  if (!(value instanceof constructor)) {
    throw new AssertionError(
      `Expected ${name || 'value'} to be an instance of ${constructor.name}`
    );
  }
}

/**
 * Assert that an object has a specific key
 * @param obj - Object to check
 * @param key - Key to check for
 * @param name - Name of the object for error message
 */
export function assertHasKey<K extends string>(
  obj: unknown,
  key: K,
  name?: string
): asserts obj is Record<K, unknown> {
  assertObject(obj, name);
  if (!(key in obj)) {
    throw new AssertionError(
      `Expected ${name || 'object'} to have key "${key}"`
    );
  }
}
