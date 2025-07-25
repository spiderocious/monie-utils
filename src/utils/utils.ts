/**
 * @fileoverview Utility functions for rounding, precision, and formatting
 * @module Utils
 */

import { MonieUtilsError } from '../errors';
import { isValidAmount } from '../validation';
import type {
  NumberToWordsResult,
  AccountNumberOptions,
  FormattedAccountResult,
  ThousandFormatOptions,
  BankersRoundingMode,
} from './types';

// ==================== ROUNDING AND PRECISION ====================

/**
 * Round amount to nearest cent (2 decimal places)
 *
 * @param amount - The amount to round
 * @returns The amount rounded to nearest cent
 *
 * @throws {MonieUtilsError} When amount is invalid
 *
 * @example
 * ```typescript
 * const rounded = roundToNearestCent(123.456);
 * console.log(rounded); // 123.46
 *
 * const rounded2 = roundToNearestCent(123.454);
 * console.log(rounded2); // 123.45
 * ```
 */
export function roundToNearestCent(amount: number): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError('Amount must be a valid number');
  }

  return Math.round(amount * 100) / 100;
}

/**
 * Apply banker's rounding (round half to even)
 *
 * @param amount - The amount to round
 * @param decimalPlaces - Number of decimal places (default: 2)
 * @param mode - Rounding mode (default: 'half-even')
 * @returns The amount with banker's rounding applied
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const rounded = roundToBankersRounding(2.125, 2);
 * console.log(rounded); // 2.12 (rounds to even)
 *
 * const rounded2 = roundToBankersRounding(2.135, 2);
 * console.log(rounded2); // 2.14 (rounds to even)
 * ```
 */
export function roundToBankersRounding(
  amount: number,
  decimalPlaces: number = 2,
  mode: BankersRoundingMode = 'half-even'
): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError('Amount must be a valid number');
  }

  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    throw new MonieUtilsError('Decimal places must be a non-negative integer');
  }

  const multiplier = Math.pow(10, decimalPlaces);
  const shifted = amount * multiplier;

  // Round to nearest integer first to avoid floating point precision issues
  const rounded = Math.round(shifted * 10) / 10;
  const floor = Math.floor(rounded);
  const remainder = rounded - floor;

  // Check if we have exactly 0.5 (within small tolerance for floating point)
  if (Math.abs(remainder - 0.5) < 1e-10) {
    const isEven = floor % 2 === 0;
    if (mode === 'half-even') {
      return isEven ? floor / multiplier : (floor + 1) / multiplier;
    } else {
      return isEven ? (floor + 1) / multiplier : floor / multiplier;
    }
  }

  // Otherwise, standard rounding
  return Math.round(shifted) / multiplier;
}

/**
 * Truncate number to specified decimal places (no rounding)
 *
 * @param amount - The amount to truncate
 * @param places - Number of decimal places to keep
 * @returns The truncated amount
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const truncated = truncateToDecimalPlaces(123.456, 2);
 * console.log(truncated); // 123.45
 *
 * const truncated2 = truncateToDecimalPlaces(123.999, 1);
 * console.log(truncated2); // 123.9
 * ```
 */
export function truncateToDecimalPlaces(
  amount: number,
  places: number
): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError('Amount must be a valid number');
  }

  if (!Number.isInteger(places) || places < 0) {
    throw new MonieUtilsError('Decimal places must be a non-negative integer');
  }

  const multiplier = Math.pow(10, places);
  return Math.trunc(amount * multiplier) / multiplier;
}

/**
 * Ceil amount to nearest cent (round up to 2 decimal places)
 *
 * @param amount - The amount to ceil
 * @returns The amount ceiled to nearest cent
 *
 * @throws {MonieUtilsError} When amount is invalid
 *
 * @example
 * ```typescript
 * const ceiled = ceilToNearestCent(123.451);
 * console.log(ceiled); // 123.46
 *
 * const ceiled2 = ceilToNearestCent(123.00);
 * console.log(ceiled2); // 123.00
 * ```
 */
export function ceilToNearestCent(amount: number): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError('Amount must be a valid number');
  }

  return Math.ceil(amount * 100) / 100;
}

// ==================== FORMATTING HELPERS ====================

/**
 * Add thousand separators to a number
 *
 * @param number - The number to format
 * @param options - Formatting options
 * @returns The number with thousand separators
 *
 * @throws {MonieUtilsError} When number is invalid
 *
 * @example
 * ```typescript
 * const formatted = formatThousands(1234567.89);
 * console.log(formatted); // "1,234,567.89"
 *
 * const formatted2 = formatThousands(1234567, { separator: ' ' });
 * console.log(formatted2); // "1 234 567"
 * ```
 */
export function formatThousands(
  number: number,
  options: ThousandFormatOptions = {}
): string {
  if (!isValidAmount(number)) {
    throw new MonieUtilsError('Number must be a valid number');
  }

  const {
    separator = ',',
    locale = 'en-US',
    includeDecimals = true,
    decimalPlaces,
  } = options;

  try {
    const formatOptions: Intl.NumberFormatOptions = {
      useGrouping: true,
      minimumFractionDigits: includeDecimals ? (decimalPlaces ?? 0) : 0,
      maximumFractionDigits: includeDecimals ? (decimalPlaces ?? 20) : 0,
    };

    let formatted = new Intl.NumberFormat(locale, formatOptions).format(number);

    // Replace the default separator if custom one is provided
    if (separator !== ',' && locale === 'en-US') {
      formatted = formatted.replace(/,/g, separator);
    }

    return formatted;
  } catch (error) {
    // Fallback for invalid locales
    const parts = number
      .toFixed(includeDecimals ? (decimalPlaces ?? 2) : 0)
      .split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return includeDecimals && parts[1]
      ? `${integerPart}.${parts[1]}`
      : integerPart;
  }
}

/**
 * Format amount to hundreds (divide by 100 and format)
 *
 * @param amount - The amount in smallest units (cents)
 * @param options - Formatting options
 * @returns The amount formatted in hundreds
 *
 * @throws {MonieUtilsError} When amount is invalid
 *
 * @example
 * ```typescript
 * const formatted = formatToHundreds(12345);
 * console.log(formatted); // "123.45"
 *
 * const formatted2 = formatToHundreds(12345, { separator: ' ' });
 * console.log(formatted2); // "123.45"
 * ```
 */
export function formatToHundreds(
  amount: number,
  options: ThousandFormatOptions = {}
): string {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError('Amount must be a valid number');
  }

  const hundredAmount = amount / 100;
  return formatThousands(hundredAmount, {
    ...options,
    includeDecimals: true,
    decimalPlaces: options.decimalPlaces ?? 2,
  });
}

/**
 * Remove formatting from a formatted number string
 *
 * @param formattedString - The formatted string to clean
 * @returns The clean number as string
 *
 * @throws {MonieUtilsError} When string is invalid or empty
 *
 * @example
 * ```typescript
 * const clean = removeFormattingFromNumber("1,234,567.89");
 * console.log(clean); // "1234567.89"
 *
 * const clean2 = removeFormattingFromNumber("$1 234 567.89");
 * console.log(clean2); // "1234567.89"
 * ```
 */
export function removeFormattingFromNumber(formattedString: string): string {
  if (typeof formattedString !== 'string' || formattedString.trim() === '') {
    throw new MonieUtilsError('Formatted string must be a non-empty string');
  }

  // Remove common formatting characters but keep numbers, decimal points, and negative signs
  const cleaned = formattedString
    .replace(/[^\d.-]/g, '') // Keep only digits, decimals, and negative signs
    .replace(/\.(?=.*\.)/g, '') // Remove all but the last decimal point
    .replace(/(?<!^)-/g, ''); // Remove minus signs that aren't at the start

  if (cleaned === '' || isNaN(Number(cleaned))) {
    throw new MonieUtilsError('String does not contain a valid number');
  }

  return cleaned;
}

/**
 * Convert number to words (English)
 *
 * @param amount - The number to convert
 * @param currency - Optional currency to include
 * @returns Object with words and metadata
 *
 * @throws {MonieUtilsError} When amount is invalid or too large
 *
 * @example
 * ```typescript
 * const result = convertToWords(123.45);
 * console.log(result.words); // "one hundred twenty-three and forty-five"
 *
 * const result2 = convertToWords(1500, 'USD');
 * console.log(result2.words); // "one thousand five hundred dollars"
 * ```
 */
export function convertToWords(
  amount: number,
  currency?: string
): NumberToWordsResult {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError('Amount must be a valid number');
  }

  if (Math.abs(amount) > 999999999999.99) {
    throw new MonieUtilsError('Amount too large to convert to words');
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);

  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];

  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  const scales = ['', 'thousand', 'million', 'billion'];

  function convertHundreds(num: number): string {
    let result = '';

    const hundred = Math.floor(num / 100);
    if (hundred > 0) {
      result += ones[hundred] + ' hundred';
    }

    const remainder = num % 100;
    if (remainder > 0) {
      if (result) result += ' ';

      if (remainder < 20) {
        result += ones[remainder];
      } else {
        const tenDigit = Math.floor(remainder / 10);
        const oneDigit = remainder % 10;
        result += tens[tenDigit];
        if (oneDigit > 0) {
          result += '-' + ones[oneDigit];
        }
      }
    }

    return result;
  }

  if (absAmount === 0) {
    const result: NumberToWordsResult = {
      words: 'zero' + (currency ? ` ${currency.toLowerCase()}` : ''),
      originalNumber: amount,
      isNegative: false,
    };

    if (currency !== undefined) {
      result.currency = currency;
    }

    return result;
  }

  const [integerPart, decimalPart] = absAmount.toFixed(2).split('.');
  const integerNum = parseInt(integerPart);

  let words = '';
  let scaleIndex = 0;
  let tempNum = integerNum;

  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk > 0) {
      const chunkWords = convertHundreds(chunk);
      if (scaleIndex > 0) {
        words =
          chunkWords + ' ' + scales[scaleIndex] + (words ? ' ' + words : '');
      } else {
        words = chunkWords;
      }
    }
    tempNum = Math.floor(tempNum / 1000);
    scaleIndex++;
  }

  // Handle decimal part
  if (decimalPart && decimalPart !== '00') {
    const decimalNum = parseInt(decimalPart);
    words += ' and ' + convertHundreds(decimalNum);
    if (currency) {
      words += ` ${currency.toLowerCase()} cents`;
    }
  } else if (currency) {
    words += ` ${currency.toLowerCase()}`;
  }

  if (isNegative) {
    words = 'negative ' + words;
  }

  const result: NumberToWordsResult = {
    words: words.trim(),
    originalNumber: amount,
    isNegative,
  };

  if (currency !== undefined) {
    result.currency = currency;
  }

  return result;
}

/**
 * Format account number with optional masking
 *
 * @param accountNumber - The account number to format
 * @param options - Formatting options
 * @returns Formatted account number result
 *
 * @throws {MonieUtilsError} When account number is invalid
 *
 * @example
 * ```typescript
 * const result = formatAccountNumber("1234567890123456");
 * console.log(result.formatted); // "1234 **** **** 3456"
 *
 * const result2 = formatAccountNumber("1234567890", { showFirst: 2, showLast: 2 });
 * console.log(result2.formatted); // "12** **67 90"
 * ```
 */
export function formatAccountNumber(
  accountNumber: string,
  options: AccountNumberOptions = {}
): FormattedAccountResult {
  if (typeof accountNumber !== 'string' || accountNumber.trim() === '') {
    throw new MonieUtilsError('Account number must be a non-empty string');
  }

  // Remove any existing formatting
  const cleanNumber = accountNumber.replace(/\s+/g, '');

  if (!/^\d+$/.test(cleanNumber)) {
    throw new MonieUtilsError('Account number must contain only digits');
  }

  const {
    maskChar = '*',
    showFirst = 4,
    showLast = 4,
    applyMask = true,
    separator = ' ',
    groupSize = 4,
  } = options;

  if (showFirst < 0 || showLast < 0) {
    throw new MonieUtilsError('showFirst and showLast must be non-negative');
  }

  if (groupSize <= 0) {
    throw new MonieUtilsError('groupSize must be positive');
  }

  let formatted = cleanNumber;
  let maskedCharacters = 0;

  // Apply masking if requested
  if (applyMask && cleanNumber.length > showFirst + showLast) {
    const firstPart = cleanNumber.substring(0, showFirst);
    const lastPart = cleanNumber.substring(cleanNumber.length - showLast);
    const middleLength = cleanNumber.length - showFirst - showLast;
    const middlePart = maskChar.repeat(middleLength);

    formatted = firstPart + middlePart + lastPart;
    maskedCharacters = middleLength;
  }

  // Add separators for grouping
  if (separator && groupSize > 0) {
    const groups = [];
    for (let i = 0; i < formatted.length; i += groupSize) {
      groups.push(formatted.substring(i, i + groupSize));
    }
    formatted = groups.join(separator);
  }

  return {
    formatted,
    original: accountNumber,
    isMasked: applyMask && maskedCharacters > 0,
    maskedCharacters,
  };
}
