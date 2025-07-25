/**
 * @fileoverview Utility functions for rounding, precision, and formatting
 * @module Utils
 *
 * This module provides essential utility functions for number rounding, precision control,
 * and text formatting operations commonly needed in financial applications.
 *
 * @example
 * ```typescript
 * import {
 *   roundToNearestCent,
 *   roundToBankersRounding,
 *   truncateToDecimalPlaces,
 *   ceilToNearestCent,
 *   formatThousands,
 *   formatToHundreds,
 *   removeFormattingFromNumber,
 *   convertToWords,
 *   formatAccountNumber
 * } from 'monie-utils/utils';
 *
 * // Rounding utilities
 * const rounded = roundToNearestCent(123.456); // 123.46
 * const bankers = roundToBankersRounding(2.125, 2); // 2.12
 * const truncated = truncateToDecimalPlaces(123.999, 2); // 123.99
 * const ceiled = ceilToNearestCent(123.451); // 123.46
 *
 * // Formatting utilities
 * const thousands = formatThousands(1234567.89); // "1,234,567.89"
 * const hundreds = formatToHundreds(12345); // "123.45"
 * const clean = removeFormattingFromNumber("1,234.56"); // "1234.56"
 * const words = convertToWords(123.45); // { words: "one hundred twenty-three and forty-five", ... }
 * const account = formatAccountNumber("1234567890123456"); // { formatted: "1234 **** **** 3456", ... }
 * ```
 */

export {
  // Rounding and Precision
  roundToNearestCent,
  roundToBankersRounding,
  truncateToDecimalPlaces,
  ceilToNearestCent,

  // Formatting Helpers
  formatThousands,
  formatToHundreds,
  removeFormattingFromNumber,
  convertToWords,
  formatAccountNumber,
} from './utils';

export type {
  NumberToWordsResult,
  AccountNumberOptions,
  FormattedAccountResult,
  ThousandFormatOptions,
  BankersRoundingMode,
  RoundingResult,
} from './types';
