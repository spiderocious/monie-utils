/**
 * Type definitions for currency formatting utilities
 */

/**
 * Options for formatting currency amounts
 */
export interface FormatCurrencyOptions {
  /** Locale for formatting (e.g., 'en-US', 'en-GB', 'de-DE') */
  locale?: string;
  /** Whether to show the currency symbol (default: true) */
  showSymbol?: boolean;
  /** Whether to show the currency code (default: false) */
  showCode?: boolean;
  /** Custom decimal places (overrides currency default) */
  decimalPlaces?: number;
  /** Whether to use compact notation for large numbers (1M, 1B, etc.) */
  compact?: boolean;
  /** Whether to use grouping separators (thousands separators) */
  useGrouping?: boolean;
  /** Custom currency symbol to override default */
  customSymbol?: string;
  /** Position of currency symbol ('start' | 'end') */
  symbolPosition?: 'start' | 'end';
}

/**
 * Result of currency formatting operation
 */
export interface FormattedCurrency {
  /** The formatted string representation */
  formatted: string;
  /** The original amount */
  amount: number;
  /** The currency code used */
  currency: string;
  /** The locale used for formatting */
  locale: string;
  /** Whether compact notation was used */
  isCompact: boolean;
}

/**
 * Currency display information
 */
export interface CurrencyDisplay {
  /** Currency code (e.g., 'USD', 'EUR') */
  code: string;
  /** Currency symbol (e.g., '$', '€') */
  symbol: string;
  /** Currency name (e.g., 'US Dollar', 'Euro') */
  name: string;
  /** Number of decimal places for this currency */
  decimalPlaces: number;
  /** Whether this currency uses grouping separators */
  usesGrouping: boolean;
}
