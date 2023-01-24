/**
 * Type definitions for validation and parsing utilities
 */

/**
 * Result of parsing an amount string
 */
export interface ParsedAmount {
  /** The parsed numeric value */
  amount: number;
  /** Whether the original string was valid */
  isValid: boolean;
  /** The original string that was parsed */
  originalString: string;
}

/**
 * Result of parsing a currency string
 */
export interface ParsedCurrency {
  /** The extracted amount */
  amount: number;
  /** The extracted currency code */
  currency: string;
  /** Whether the parsing was successful */
  isValid: boolean;
  /** The original string that was parsed */
  originalString: string;
}

/**
 * Options for normalizing amounts
 */
export interface NormalizeOptions {
  /** Number of decimal places to round to */
  decimalPlaces?: number;
  /** Whether to round or truncate */
  roundingMode?: 'round' | 'floor' | 'ceil';
}

/**
 * Range validation options
 */
export interface RangeOptions {
  /** Whether min/max are inclusive (default: true) */
  inclusive?: boolean;
}
