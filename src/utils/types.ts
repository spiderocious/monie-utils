/**
 * @fileoverview Type definitions for utility functions
 * @module Utils/Types
 */

/**
 * Result of number-to-words conversion
 */
export interface NumberToWordsResult {
  /** The number converted to words */
  words: string;
  /** The original number */
  originalNumber: number;
  /** Whether the number was negative */
  isNegative: boolean;
  /** The currency denomination (if applicable) */
  currency?: string;
}

/**
 * Options for formatting account numbers
 */
export interface AccountNumberOptions {
  /** Character to use for masking (default: '*') */
  maskChar?: string;
  /** Number of characters to show at the start (default: 4) */
  showFirst?: number;
  /** Number of characters to show at the end (default: 4) */
  showLast?: number;
  /** Whether to apply masking (default: true) */
  applyMask?: boolean;
  /** Separator character for grouping (default: ' ') */
  separator?: string;
  /** Group size for formatting (default: 4) */
  groupSize?: number;
}

/**
 * Result of account number formatting
 */
export interface FormattedAccountResult {
  /** The formatted account number */
  formatted: string;
  /** The original account number */
  original: string;
  /** Whether masking was applied */
  isMasked: boolean;
  /** Number of characters masked */
  maskedCharacters: number;
}

/**
 * Options for thousand formatting
 */
export interface ThousandFormatOptions {
  /** Separator for thousands (default: ',') */
  separator?: string;
  /** Locale for formatting */
  locale?: string;
  /** Whether to include decimal places */
  includeDecimals?: boolean;
  /** Number of decimal places to show */
  decimalPlaces?: number;
}

/**
 * Banker's rounding mode
 */
export type BankersRoundingMode = 'half-even' | 'half-odd';

/**
 * Rounding result with metadata
 */
export interface RoundingResult {
  /** The rounded value */
  rounded: number;
  /** The original value */
  original: number;
  /** The rounding method used */
  method: string;
  /** Whether the value was rounded up or down */
  direction: 'up' | 'down' | 'none';
  /** The difference between original and rounded */
  difference: number;
}
