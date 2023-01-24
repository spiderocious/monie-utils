/**
 * Validation and parsing utilities barrel export
 *
 * This module provides validation and parsing utilities including:
 * - Amount and currency validation
 * - Money object validation
 * - String parsing for amounts and currencies
 * - Amount normalization
 *
 * @example
 * ```typescript
 * import { isValidAmount, parseAmount, validateMoneyObject } from 'monie-utils/validation';
 *
 * // Validation
 * const isValid = isValidAmount(123.45); // true
 *
 * // Parsing
 * const parsed = parseAmount('$1,234.56');
 * console.log(parsed.amount); // 1234.56
 * ```
 */

// Export validation functions
export {
  isValidAmount,
  isValidCurrency,
  validateMoneyObject,
  isPositiveAmount,
  isWithinRange,
  parseAmount,
  parseCurrencyString,
  normalizeAmount,
  parseFormattedCurrency,
} from './validation';

// Export types
export type {
  ParsedAmount,
  ParsedCurrency,
  NormalizeOptions,
  RangeOptions,
} from './types';
