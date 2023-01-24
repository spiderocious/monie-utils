/**
 * Currency formatting utilities barrel export
 * 
 * This module provides comprehensive currency formatting capabilities including:
 * - Standard currency formatting with locale support
 * - Compact notation for large numbers (1M, 1B, etc.)
 * - Cents/smallest unit formatting
 * - Customizable formatting options
 * 
 * @example
 * ```typescript
 * import { formatCurrency, formatMoney, formatCents } from 'monie-utils/formatCurrency';
 * 
 * // Basic formatting
 * const result = formatCurrency(1234.56, 'USD');
 * console.log(result.formatted); // "$1,234.56"
 * 
 * // Simple string formatting
 * const simple = formatMoney(1234.56, 'EUR', 'de-DE');
 * console.log(simple); // "1.234,56 €"
 * 
 * // Cents formatting
 * const fromCents = formatCents(12345, 'USD');
 * console.log(fromCents.formatted); // "$123.45"
 * ```
 */

// Export main formatting functions
export {
  formatCurrency,
  formatMoney,
  formatCents,
  formatCompactCurrency,
} from './formatCurrency';

// Export types
export type {
  FormatCurrencyOptions,
  FormattedCurrency,
  CurrencyDisplay,
} from './types';

// Export constants for advanced usage
export {
  DEFAULT_FORMAT_OPTIONS,
  CURRENCY_INFO,
  COMPACT_SUFFIXES,
  COMPACT_THRESHOLDS,
} from './constants';
