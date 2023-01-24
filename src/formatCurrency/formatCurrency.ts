/**
 * Currency formatting utilities
 */

import type { FormatCurrencyOptions, FormattedCurrency } from './types';
import { DEFAULT_FORMAT_OPTIONS, CURRENCY_INFO, COMPACT_THRESHOLDS } from './constants';
import { MonieUtilsError } from '../errors';

/**
 * Validates if an amount is a valid number for currency formatting
 * 
 * @param amount - The amount to validate
 * @returns True if valid, false otherwise
 * 
 * @example
 * ```typescript
 * isValidAmount(100.50) // true
 * isValidAmount(NaN) // false
 * isValidAmount(Infinity) // false
 * ```
 */
function isValidAmount(amount: unknown): amount is number {
  return typeof amount === 'number' && Number.isFinite(amount);
}

/**
 * Validates if a currency code is supported
 * 
 * @param currency - The currency code to validate
 * @returns True if supported, false otherwise
 * 
 * @example
 * ```typescript
 * isValidCurrency('USD') // true
 * isValidCurrency('INVALID') // false
 * ```
 */
function isValidCurrency(currency: string): boolean {
  return currency.toUpperCase() in CURRENCY_INFO;
}

/**
 * Formats a number in compact notation (e.g., 1M, 1.5B)
 * 
 * @param amount - The amount to format (should be positive)
 * @param decimalPlaces - Number of decimal places to show
 * @returns Formatted compact string
 * 
 * @example
 * ```typescript
 * formatCompactNumber(1500000, 1) // "1.5M"
 * formatCompactNumber(1000000000, 0) // "1B"
 * ```
 */
function formatCompactNumber(amount: number, decimalPlaces: number = 1): string {
  const absAmount = Math.abs(amount);

  if (absAmount >= COMPACT_THRESHOLDS.TRILLION) {
    return `${(absAmount / COMPACT_THRESHOLDS.TRILLION).toFixed(decimalPlaces)}T`;
  }
  if (absAmount >= COMPACT_THRESHOLDS.BILLION) {
    return `${(absAmount / COMPACT_THRESHOLDS.BILLION).toFixed(decimalPlaces)}B`;
  }
  if (absAmount >= COMPACT_THRESHOLDS.MILLION) {
    return `${(absAmount / COMPACT_THRESHOLDS.MILLION).toFixed(decimalPlaces)}M`;
  }
  if (absAmount >= COMPACT_THRESHOLDS.THOUSAND) {
    return `${(absAmount / COMPACT_THRESHOLDS.THOUSAND).toFixed(decimalPlaces)}K`;
  }

  return absAmount.toFixed(decimalPlaces);
}

/**
 * Formats a currency amount with locale-specific formatting
 * 
 * @param amount - The amount to format
 * @param currency - The currency code (e.g., 'USD', 'EUR')
 * @param options - Formatting options
 * @returns Formatted currency object
 * 
 * @throws {MonieUtilsError} When amount is invalid or currency is not supported
 * 
 * @example
 * ```typescript
 * // Basic usage
 * formatCurrency(1234.56, 'USD')
 * // Returns: { formatted: '$1,234.56', amount: 1234.56, currency: 'USD', locale: 'en-US', isCompact: false }
 * 
 * // With options
 * formatCurrency(1234.56, 'EUR', { locale: 'de-DE', showCode: true })
 * // Returns: { formatted: '1.234,56 EUR', amount: 1234.56, currency: 'EUR', locale: 'de-DE', isCompact: false }
 * 
 * // Compact notation
 * formatCurrency(1500000, 'USD', { compact: true })
 * // Returns: { formatted: '$1.5M', amount: 1500000, currency: 'USD', locale: 'en-US', isCompact: true }
 * ```
 */
export function formatCurrency(
  amount: number,
  currency: string,
  options: FormatCurrencyOptions = {}
): FormattedCurrency {
  // Validate inputs
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(`Invalid amount: ${amount}. Amount must be a finite number.`);
  }

  const upperCurrency = currency.toUpperCase();
  if (!isValidCurrency(upperCurrency)) {
    throw new MonieUtilsError(`Unsupported currency: ${currency}. Check the currency code.`);
  }

  // Merge options with defaults
  const opts = { ...DEFAULT_FORMAT_OPTIONS, ...options };
  const currencyInfo = CURRENCY_INFO[upperCurrency];

  // Determine decimal places
  const decimalPlaces = opts.decimalPlaces ?? currencyInfo.decimalPlaces;

  // Handle compact formatting
  if (opts.compact) {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    const compactNumber = formatCompactNumber(absAmount, 1);
    const symbol = opts.customSymbol ?? currencyInfo.symbol;

    let formatted: string;
    if (opts.symbolPosition === 'end') {
      formatted = opts.showCode ? `${compactNumber} ${upperCurrency}` : `${compactNumber}${symbol}`;
    } else {
      formatted = opts.showCode ? `${upperCurrency} ${compactNumber}` : `${symbol}${compactNumber}`;
    }

    // Add negative sign at the beginning if needed
    if (isNegative) {
      formatted = `-${formatted}`;
    }

    return {
      formatted,
      amount,
      currency: upperCurrency,
      locale: opts.locale!,
      isCompact: true,
    };
  }

  // Use Intl.NumberFormat for standard formatting
  try {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    
    const formatOptions: Intl.NumberFormatOptions = {
      style: 'decimal',
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
      useGrouping: opts.useGrouping,
    };

    const formatter = new Intl.NumberFormat(opts.locale, formatOptions);
    let formatted = formatter.format(absAmount);

    // Add currency symbol/code
    const symbol = opts.customSymbol ?? currencyInfo.symbol;
    
    if (opts.showCode) {
      if (opts.symbolPosition === 'end') {
        formatted = `${formatted} ${upperCurrency}`;
      } else {
        formatted = `${upperCurrency} ${formatted}`;
      }
    } else if (opts.showSymbol !== false) {
      if (opts.symbolPosition === 'end') {
        formatted = `${formatted}${symbol}`;
      } else {
        formatted = `${symbol}${formatted}`;
      }
    }

    // Add negative sign at the beginning if needed
    if (isNegative) {
      formatted = `-${formatted}`;
    }

    return {
      formatted,
      amount,
      currency: upperCurrency,
      locale: opts.locale!,
      isCompact: false,
    };
  } catch (error) {
    throw new MonieUtilsError(`Failed to format currency: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Simple currency formatter that returns just the formatted string
 * 
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param locale - Optional locale (defaults to 'en-US')
 * @returns Formatted currency string
 * 
 * @example
 * ```typescript
 * formatMoney(1234.56, 'USD') // "$1,234.56"
 * formatMoney(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 * ```
 */
export function formatMoney(amount: number, currency: string, locale?: string): string {
  const options: FormatCurrencyOptions = locale ? { locale } : {};
  const result = formatCurrency(amount, currency, options);
  return result.formatted;
}

/**
 * Formats cents (smallest currency unit) to the main currency unit
 * 
 * @param cents - Amount in cents (or smallest unit)
 * @param currency - The currency code
 * @param options - Formatting options
 * @returns Formatted currency object
 * 
 * @example
 * ```typescript
 * formatCents(12345, 'USD') // Formats 123.45 USD
 * formatCents(100, 'JPY') // Formats 100 JPY (no conversion for JPY)
 * ```
 */
export function formatCents(
  cents: number,
  currency: string,
  options: FormatCurrencyOptions = {}
): FormattedCurrency {
  if (!isValidAmount(cents)) {
    throw new MonieUtilsError(`Invalid cents amount: ${cents}. Amount must be a finite number.`);
  }

  const upperCurrency = currency.toUpperCase();
  if (!isValidCurrency(upperCurrency)) {
    throw new MonieUtilsError(`Unsupported currency: ${currency}. Check the currency code.`);
  }

  const currencyInfo = CURRENCY_INFO[upperCurrency];
  const divisor = Math.pow(10, currencyInfo.decimalPlaces);
  const amount = cents / divisor;

  return formatCurrency(amount, upperCurrency, options);
}

/**
 * Formats a currency amount in compact notation for large numbers
 * 
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param options - Formatting options
 * @returns Formatted currency object with compact notation
 * 
 * @example
 * ```typescript
 * formatCompactCurrency(1500000, 'USD') // "$1.5M"
 * formatCompactCurrency(2300000000, 'EUR') // "€2.3B"
 * ```
 */
export function formatCompactCurrency(
  amount: number,
  currency: string,
  options: FormatCurrencyOptions = {}
): FormattedCurrency {
  return formatCurrency(amount, currency, { ...options, compact: true });
}
