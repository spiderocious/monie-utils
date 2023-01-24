/**
 * Validation and parsing utilities
 */

import type { ParsedAmount, ParsedCurrency, NormalizeOptions, RangeOptions } from './types';
import { CURRENCY_INFO } from '../formatCurrency/constants';
import { MonieUtilsError } from '../errors';
import type { Money } from '../types';

/**
 * Checks if an amount is a valid money value
 * 
 * @param amount - The value to validate
 * @returns True if the amount is valid for money operations
 * 
 * @example
 * ```typescript
 * isValidAmount(123.45) // true
 * isValidAmount(NaN) // false
 * isValidAmount(Infinity) // false
 * ```
 */
export function isValidAmount(amount: unknown): amount is number {
  return typeof amount === 'number' && Number.isFinite(amount);
}

/**
 * Validates if a currency code is supported (ISO 4217)
 * 
 * @param currencyCode - The currency code to validate
 * @returns True if the currency is supported
 * 
 * @example
 * ```typescript
 * isValidCurrency('USD') // true
 * isValidCurrency('INVALID') // false
 * ```
 */
export function isValidCurrency(currencyCode: unknown): currencyCode is string {
  if (typeof currencyCode !== 'string') return false;
  return currencyCode.toUpperCase() in CURRENCY_INFO;
}

/**
 * Validates a money object structure
 * 
 * @param moneyObject - The object to validate
 * @returns True if the object is a valid Money structure
 * 
 * @example
 * ```typescript
 * validateMoneyObject({ amount: 100, currency: 'USD' }) // true
 * validateMoneyObject({ amount: 'invalid', currency: 'USD' }) // false
 * ```
 */
export function validateMoneyObject(moneyObject: unknown): moneyObject is Money {
  if (!moneyObject || typeof moneyObject !== 'object') return false;
  
  const obj = moneyObject as Record<string, unknown>;
  return isValidAmount(obj.amount) && isValidCurrency(obj.currency);
}

/**
 * Checks if an amount is positive
 * 
 * @param amount - The amount to check
 * @returns True if amount is positive
 * 
 * @example
 * ```typescript
 * isPositiveAmount(100) // true
 * isPositiveAmount(-50) // false
 * isPositiveAmount(0) // false
 * ```
 */
export function isPositiveAmount(amount: number): boolean {
  if (!isValidAmount(amount)) return false;
  return amount > 0;
}

/**
 * Checks if an amount is within a specified range
 * 
 * @param amount - The amount to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @param options - Range validation options
 * @returns True if amount is within range
 * 
 * @example
 * ```typescript
 * isWithinRange(50, 0, 100) // true
 * isWithinRange(150, 0, 100) // false
 * ```
 */
export function isWithinRange(
  amount: number,
  min: number,
  max: number,
  options: RangeOptions = {}
): boolean {
  if (!isValidAmount(amount) || !isValidAmount(min) || !isValidAmount(max)) return false;
  
  const { inclusive = true } = options;
  
  if (inclusive) {
    return amount >= min && amount <= max;
  } else {
    return amount > min && amount < max;
  }
}

/**
 * Parses a string to extract a numeric amount
 * 
 * @param amountString - The string to parse
 * @returns Parsed amount result
 * 
 * @example
 * ```typescript
 * parseAmount('123.45') // { amount: 123.45, isValid: true, originalString: '123.45' }
 * parseAmount('$1,234.56') // { amount: 1234.56, isValid: true, originalString: '$1,234.56' }
 * ```
 */
export function parseAmount(amountString: string): ParsedAmount {
  if (typeof amountString !== 'string') {
    return { amount: NaN, isValid: false, originalString: String(amountString) };
  }

  // Remove common currency symbols and formatting
  const cleaned = amountString
    .replace(/[$£€¥₦₹]/g, '') // Remove common currency symbols
    .replace(/[,\s]/g, '') // Remove commas and spaces
    .replace(/[()]/g, '') // Remove parentheses
    .trim();

  const parsed = parseFloat(cleaned);
  
  return {
    amount: parsed,
    isValid: isValidAmount(parsed),
    originalString: amountString,
  };
}

/**
 * Extracts amount and currency from a formatted string
 * 
 * @param currencyString - The string to parse
 * @returns Parsed currency result
 * 
 * @example
 * ```typescript
 * parseCurrencyString('$123.45 USD') // { amount: 123.45, currency: 'USD', isValid: true, originalString: '$123.45 USD' }
 * parseCurrencyString('€1,234.56 EUR') // { amount: 1234.56, currency: 'EUR', isValid: true, originalString: '€1,234.56 EUR' }
 * ```
 */
export function parseCurrencyString(currencyString: string): ParsedCurrency {
  if (typeof currencyString !== 'string') {
    return { amount: NaN, currency: '', isValid: false, originalString: String(currencyString) };
  }

  // Try to extract currency code (3 letter code)
  const currencyMatch = currencyString.match(/\b([A-Z]{3})\b/);
  const currency = currencyMatch ? currencyMatch[1] : '';

  // Parse the amount
  const amountResult = parseAmount(currencyString);

  return {
    amount: amountResult.amount,
    currency,
    isValid: amountResult.isValid && isValidCurrency(currency),
    originalString: currencyString,
  };
}

/**
 * Normalizes an amount to a standard format
 * 
 * @param amount - The amount to normalize
 * @param options - Normalization options
 * @returns Normalized amount
 * 
 * @throws {MonieUtilsError} When amount is invalid
 * 
 * @example
 * ```typescript
 * normalizeAmount(123.456789) // 123.46 (default 2 decimal places)
 * normalizeAmount(123.456789, { decimalPlaces: 4 }) // 123.4568
 * ```
 */
export function normalizeAmount(amount: number, options: NormalizeOptions = {}): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(`Invalid amount: ${amount}. Amount must be a finite number.`);
  }

  const { decimalPlaces = 2, roundingMode = 'round' } = options;

  if (typeof decimalPlaces !== 'number' || decimalPlaces < 0 || !Number.isInteger(decimalPlaces)) {
    throw new MonieUtilsError(`Invalid decimal places: ${decimalPlaces}. Must be a non-negative integer.`);
  }

  const multiplier = Math.pow(10, decimalPlaces);

  switch (roundingMode) {
    case 'floor':
      return Math.floor(amount * multiplier) / multiplier;
    case 'ceil':
      return Math.ceil(amount * multiplier) / multiplier;
    case 'round':
    default:
      return Math.round(amount * multiplier) / multiplier;
  }
}

/**
 * Parses a formatted currency string based on locale
 * 
 * @param formattedString - The formatted currency string
 * @param locale - The locale for parsing (defaults to 'en-US')
 * @returns Parsed amount
 * 
 * @throws {MonieUtilsError} When parsing fails
 * 
 * @example
 * ```typescript
 * parseFormattedCurrency('$1,234.56') // 1234.56
 * parseFormattedCurrency('1.234,56 €', 'de-DE') // 1234.56
 * ```
 */
export function parseFormattedCurrency(formattedString: string, locale: string = 'en-US'): number {
  if (typeof formattedString !== 'string') {
    throw new MonieUtilsError(`Invalid formatted string: ${formattedString}. Must be a string.`);
  }

  try {
    // For most locales, we can use a simple approach
    // Remove currency symbols and parse based on locale decimal separator
    let cleaned = formattedString
      .replace(/[$£€¥₦₹]/g, '') // Remove common currency symbols
      .replace(/[A-Z]{3}/g, '') // Remove currency codes
      .trim();

    // Handle different decimal separators based on locale
    if (locale.includes('de') || locale.includes('fr') || locale.includes('es')) {
      // European format: 1.234,56
      const parts = cleaned.split(',');
      if (parts.length === 2) {
        const integerPart = parts[0].replace(/\./g, ''); // Remove thousand separators
        const decimalPart = parts[1];
        cleaned = `${integerPart}.${decimalPart}`;
      }
    } else {
      // US/UK format: 1,234.56
      cleaned = cleaned.replace(/,/g, ''); // Remove thousand separators
    }

    const parsed = parseFloat(cleaned);
    
    if (!isValidAmount(parsed)) {
      throw new MonieUtilsError(`Failed to parse formatted currency: ${formattedString}`);
    }

    return parsed;
  } catch (error) {
    throw new MonieUtilsError(`Failed to parse formatted currency: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
