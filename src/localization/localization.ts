/**
 * Localization utilities for currency and number formatting
 */

import type { 
  LocaleFormatOptions, 
  LocaleCurrencyInfo, 
  FormattedWithGrouping, 
  FormattedDecimalPlaces 
} from './types';
import { LOCALE_CURRENCY_MAP } from './constants';
import { MonieUtilsError } from '../errors';
import { formatCurrency } from '../formatCurrency';

/**
 * Validates if a locale string is properly formatted
 * 
 * @param locale - The locale to validate
 * @returns True if valid, false otherwise
 */
function isValidLocale(locale: string): boolean {
  try {
    new Intl.NumberFormat(locale);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats currency using locale-specific conventions
 * 
 * @param amount - The amount to format
 * @param currency - The currency code
 * @param locale - The locale for formatting
 * @param options - Additional formatting options
 * @returns Formatted currency string
 * 
 * @throws {MonieUtilsError} When inputs are invalid
 * 
 * @example
 * ```typescript
 * formatCurrencyByLocale(1234.56, 'USD', 'en-US') // "$1,234.56"
 * formatCurrencyByLocale(1234.56, 'EUR', 'de-DE') // "1.234,56 €"
 * ```
 */
export function formatCurrencyByLocale(
  amount: number,
  currency: string,
  locale: string,
  options: LocaleFormatOptions = {}
): string {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new MonieUtilsError(`Invalid amount: ${amount}. Amount must be a finite number.`);
  }

  if (!currency || typeof currency !== 'string') {
    throw new MonieUtilsError(`Invalid currency: ${currency}. Currency must be a valid string.`);
  }

  if (!isValidLocale(locale)) {
    throw new MonieUtilsError(`Invalid locale: ${locale}. Locale must be a valid locale string.`);
  }

  const formatOptions: any = {
    locale,
  };

  if (options.useGrouping !== undefined) formatOptions.useGrouping = options.useGrouping;
  if (options.customSymbol !== undefined) formatOptions.customSymbol = options.customSymbol;
  if (options.showCode !== undefined) formatOptions.showCode = options.showCode;
  if (options.symbolPosition !== undefined) formatOptions.symbolPosition = options.symbolPosition;

  const result = formatCurrency(amount, currency, formatOptions);
  return result.formatted;
}

/**
 * Gets currency information for a specific locale
 * 
 * @param locale - The locale to get currency info for
 * @returns Currency information object
 * 
 * @throws {MonieUtilsError} When locale is invalid or not supported
 * 
 * @example
 * ```typescript
 * getLocaleCurrencyInfo('en-US') 
 * // Returns: { currency: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2, locale: 'en-US' }
 * ```
 */
export function getLocaleCurrencyInfo(locale: string): LocaleCurrencyInfo {
  if (!locale || typeof locale !== 'string') {
    throw new MonieUtilsError(`Invalid locale: ${locale}. Locale must be a valid string.`);
  }

  const currencyInfo = LOCALE_CURRENCY_MAP[locale];
  if (!currencyInfo) {
    throw new MonieUtilsError(`Unsupported locale: ${locale}. Check the locale code.`);
  }

  return currencyInfo;
}

/**
 * Formats a number with locale-specific grouping separators
 * 
 * @param amount - The amount to format
 * @param locale - The locale for formatting (defaults to 'en-US')
 * @returns Formatted number with grouping information
 * 
 * @throws {MonieUtilsError} When amount is invalid or locale is unsupported
 * 
 * @example
 * ```typescript
 * formatWithGrouping(1234567.89) // "1,234,567.89"
 * formatWithGrouping(1234567.89, 'de-DE') // "1.234.567,89"
 * ```
 */
export function formatWithGrouping(
  amount: number,
  locale: string = 'en-US'
): FormattedWithGrouping {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new MonieUtilsError(`Invalid amount: ${amount}. Amount must be a finite number.`);
  }

  if (!isValidLocale(locale)) {
    throw new MonieUtilsError(`Invalid locale: ${locale}. Locale must be a valid locale string.`);
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'decimal',
      useGrouping: true,
    });

    const formatted = formatter.format(amount);

    return {
      formatted,
      amount,
      locale,
      hasGrouping: true,
    };
  } catch (error) {
    throw new MonieUtilsError(`Failed to format with grouping: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Formats a number with specific decimal places
 * 
 * @param amount - The amount to format
 * @param decimalPlaces - Number of decimal places to show
 * @returns Formatted number with specified decimal places
 * 
 * @throws {MonieUtilsError} When inputs are invalid
 * 
 * @example
 * ```typescript
 * formatDecimalPlaces(123.456789, 2) // "123.46"
 * formatDecimalPlaces(123, 4) // "123.0000"
 * ```
 */
export function formatDecimalPlaces(
  amount: number,
  decimalPlaces: number
): FormattedDecimalPlaces {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new MonieUtilsError(`Invalid amount: ${amount}. Amount must be a finite number.`);
  }

  if (typeof decimalPlaces !== 'number' || decimalPlaces < 0 || !Number.isInteger(decimalPlaces)) {
    throw new MonieUtilsError(`Invalid decimal places: ${decimalPlaces}. Must be a non-negative integer.`);
  }

  try {
    const formatted = amount.toFixed(decimalPlaces);

    return {
      formatted,
      amount,
      decimalPlaces,
    };
  } catch (error) {
    throw new MonieUtilsError(`Failed to format decimal places: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
