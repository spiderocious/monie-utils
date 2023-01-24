/**
 * Type definitions for percentage formatting utilities
 */

/**
 * Options for formatting percentages
 */
export interface FormatPercentageOptions {
  /** Number of decimal places to show (default: 2) */
  precision?: number;
  /** Locale for formatting (default: 'en-US') */
  locale?: string;
  /** Whether to use grouping separators (default: true) */
  useGrouping?: boolean;
  /** Custom suffix instead of % (optional) */
  suffix?: string;
  /** Whether to include a space before the suffix (default: false) */
  spaceBefore?: boolean;
}

/**
 * Result of percentage formatting
 */
export interface FormattedPercentage {
  /** The formatted percentage string */
  formatted: string;
  /** The original decimal value */
  decimal: number;
  /** The percentage value (decimal * 100) */
  percentage: number;
  /** The precision used */
  precision: number;
  /** The locale used */
  locale: string;
}
