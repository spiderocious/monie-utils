/**
 * Percentage formatting utilities barrel export
 *
 * This module provides percentage formatting capabilities including:
 * - Decimal to percentage conversion
 * - Locale-specific formatting
 * - Customizable precision and suffixes
 *
 * @example
 * ```typescript
 * import { formatPercentage } from 'monie-utils/formatPercentage';
 *
 * // Basic formatting
 * const result = formatPercentage(0.25);
 * console.log(result.formatted); // "25.00%"
 *
 * // Custom precision
 * const precise = formatPercentage(0.1234, { precision: 1 });
 * console.log(precise.formatted); // "12.3%"
 * ```
 */

// Export main formatting function
export { formatPercentage } from './formatPercentage';

// Export types
export type { FormatPercentageOptions, FormattedPercentage } from './types';

// Export constants for advanced usage
export { DEFAULT_PERCENTAGE_OPTIONS } from './constants';
