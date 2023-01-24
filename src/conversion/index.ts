/**
 * Currency conversion utilities barrel export
 *
 * This module provides currency conversion capabilities including:
 * - Basic currency conversion between supported currencies
 * - Conversion with transaction fees
 * - Bulk conversion of multiple amounts
 *
 * @example
 * ```typescript
 * import { convertCurrency, convertWithFee, bulkConvert } from 'monie-utils/conversion';
 *
 * // Basic conversion
 * const result = convertCurrency(100, 'USD', 'EUR');
 * console.log(result.convertedAmount); // ~85 (depending on rate)
 *
 * // With fee
 * const withFee = convertWithFee(100, 0.85, 2.5);
 * console.log(withFee.feeAmount); // 2.5
 * ```
 */

// Export conversion functions
export { convertCurrency, convertWithFee, bulkConvert } from './conversion';

// Export types
export type {
  ExchangeRate,
  ConversionResult,
  ConversionWithFeeResult,
  BulkConversionResult,
} from './types';
