/**
 * Type definitions for currency conversion utilities
 */

/**
 * Exchange rate information
 */
export interface ExchangeRate {
  /** Source currency code */
  from: string;
  /** Target currency code */
  to: string;
  /** Exchange rate value */
  rate: number;
  /** Timestamp of the rate */
  timestamp?: Date;
}

/**
 * Currency conversion result
 */
export interface ConversionResult {
  /** Original amount */
  originalAmount: number;
  /** Converted amount */
  convertedAmount: number;
  /** Source currency */
  fromCurrency: string;
  /** Target currency */
  toCurrency: string;
  /** Exchange rate used */
  exchangeRate: number;
  /** Timestamp of conversion */
  timestamp: Date;
}

/**
 * Conversion with fee result
 */
export interface ConversionWithFeeResult extends ConversionResult {
  /** Fee amount deducted */
  feeAmount: number;
  /** Fee percentage applied */
  feePercentage: number;
  /** Amount after fee deduction */
  amountAfterFee: number;
}

/**
 * Bulk conversion result
 */
export interface BulkConversionResult {
  /** Array of individual conversion results */
  conversions: ConversionResult[];
  /** Total original amount */
  totalOriginalAmount: number;
  /** Total converted amount */
  totalConvertedAmount: number;
  /** Exchange rate used */
  exchangeRate: number;
  /** Currencies involved */
  fromCurrency: string;
  toCurrency: string;
}
