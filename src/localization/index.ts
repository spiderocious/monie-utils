/**
 * Localization utilities barrel export
 * 
 * This module provides localization utilities including:
 * - Locale-specific currency formatting
 * - Currency information by locale
 * - Number grouping separators
 * - Decimal place formatting
 * 
 * @example
 * ```typescript
 * import { formatCurrencyByLocale, getLocaleCurrencyInfo } from 'monie-utils/localization';
 * 
 * // Locale-specific formatting
 * const formatted = formatCurrencyByLocale(1234.56, 'USD', 'en-US');
 * console.log(formatted); // "$1,234.56"
 * 
 * // Get locale currency info
 * const info = getLocaleCurrencyInfo('de-DE');
 * console.log(info.currency); // "EUR"
 * ```
 */

// Export main functions
export {
  formatCurrencyByLocale,
  getLocaleCurrencyInfo,
  formatWithGrouping,
  formatDecimalPlaces,
} from './localization';

// Export types
export type {
  LocaleFormatOptions,
  LocaleCurrencyInfo,
  FormattedWithGrouping,
  FormattedDecimalPlaces,
} from './types';

// Export constants
export { LOCALE_CURRENCY_MAP } from './constants';
