/**
 * Percentage formatting utilities
 */

import type { FormatPercentageOptions, FormattedPercentage } from './types';
import { DEFAULT_PERCENTAGE_OPTIONS } from './constants';
import { MonieUtilsError } from '../errors';

/**
 * Validates if a decimal is a valid number for percentage formatting
 * 
 * @param decimal - The decimal to validate
 * @returns True if valid, false otherwise
 * 
 * @example
 * ```typescript
 * isValidDecimal(0.25) // true
 * isValidDecimal(NaN) // false
 * ```
 */
function isValidDecimal(decimal: unknown): decimal is number {
  return typeof decimal === 'number' && Number.isFinite(decimal);
}

/**
 * Formats a decimal as a percentage with customizable options
 * 
 * @param decimal - The decimal to format (e.g., 0.25 for 25%)
 * @param options - Formatting options
 * @returns Formatted percentage object
 * 
 * @throws {MonieUtilsError} When decimal is invalid
 * 
 * @example
 * ```typescript
 * // Basic usage
 * formatPercentage(0.25)
 * // Returns: { formatted: '25.00%', decimal: 0.25, percentage: 25, precision: 2, locale: 'en-US' }
 * 
 * // With custom precision
 * formatPercentage(0.1234, { precision: 1 })
 * // Returns: { formatted: '12.3%', decimal: 0.1234, percentage: 12.3, precision: 1, locale: 'en-US' }
 * 
 * // With custom locale
 * formatPercentage(0.1234, { locale: 'de-DE' })
 * // Returns: { formatted: '12,34 %', decimal: 0.1234, percentage: 12.34, precision: 2, locale: 'de-DE' }
 * ```
 */
export function formatPercentage(
  decimal: number,
  options: FormatPercentageOptions = {}
): FormattedPercentage {
  // Validate input
  if (!isValidDecimal(decimal)) {
    throw new MonieUtilsError(`Invalid decimal: ${decimal}. Decimal must be a finite number.`);
  }

  // Merge options with defaults
  const opts = { ...DEFAULT_PERCENTAGE_OPTIONS, ...options };
  
  // Convert decimal to percentage
  const percentage = decimal * 100;

  try {
    // Format the percentage number
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'decimal',
      minimumFractionDigits: opts.precision,
      maximumFractionDigits: opts.precision,
      useGrouping: opts.useGrouping,
    };

    const formatter = new Intl.NumberFormat(opts.locale, formatOptions);
    const formattedNumber = formatter.format(percentage);

    // Add suffix
    const suffix = opts.suffix ?? '%';
    const formatted = opts.spaceBefore 
      ? `${formattedNumber} ${suffix}`
      : `${formattedNumber}${suffix}`;

    return {
      formatted,
      decimal,
      percentage,
      precision: opts.precision,
      locale: opts.locale,
    };
  } catch (error) {
    throw new MonieUtilsError(`Failed to format percentage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
