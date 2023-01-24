/**
 * Type definitions for localization utilities
 */

/**
 * Options for locale-based formatting
 */
export interface LocaleFormatOptions {
  /** Whether to use grouping separators (default: true) */
  useGrouping?: boolean;
  /** Custom currency symbol */
  customSymbol?: string;
  /** Whether to show currency code instead of symbol */
  showCode?: boolean;
  /** Position of currency symbol */
  symbolPosition?: 'start' | 'end';
}

/**
 * Currency information for a specific locale
 */
export interface LocaleCurrencyInfo {
  /** The currency code used in this locale */
  currency: string;
  /** The currency symbol */
  symbol: string;
  /** The currency name */
  name: string;
  /** Number of decimal places */
  decimalPlaces: number;
  /** The locale code */
  locale: string;
}

/**
 * Formatted number with grouping
 */
export interface FormattedWithGrouping {
  /** The formatted number string */
  formatted: string;
  /** The original amount */
  amount: number;
  /** The locale used */
  locale: string;
  /** Whether grouping was applied */
  hasGrouping: boolean;
}

/**
 * Formatted decimal places result
 */
export interface FormattedDecimalPlaces {
  /** The formatted number string */
  formatted: string;
  /** The original amount */
  amount: number;
  /** The decimal places used */
  decimalPlaces: number;
}
