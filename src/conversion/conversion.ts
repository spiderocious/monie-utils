/**
 * Currency conversion utilities
 */

import type { 
  ExchangeRate, 
  ConversionResult, 
  ConversionWithFeeResult, 
  BulkConversionResult 
} from './types';
import { isValidAmount, isValidCurrency } from '../validation/validation';
import { MonieUtilsError } from '../errors';

/**
 * Default exchange rates for demo purposes (not for production use)
 */
const DEFAULT_RATES: Record<string, Record<string, number>> = {
  'USD': { 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110, 'NGN': 460 },
  'EUR': { 'USD': 1.18, 'GBP': 0.86, 'JPY': 129, 'NGN': 542 },
  'GBP': { 'USD': 1.37, 'EUR': 1.16, 'JPY': 150, 'NGN': 630 },
  'JPY': { 'USD': 0.0091, 'EUR': 0.0077, 'GBP': 0.0067, 'NGN': 4.18 },
  'NGN': { 'USD': 0.0022, 'EUR': 0.0018, 'GBP': 0.0016, 'JPY': 0.24 },
};

/**
 * Gets exchange rate between two currencies
 * 
 * @param from - Source currency
 * @param to - Target currency
 * @param customRate - Custom rate to use instead of default
 * @returns Exchange rate
 */
function getExchangeRate(from: string, to: string, customRate?: number): number {
  if (customRate !== undefined) {
    return customRate;
  }

  if (from === to) {
    return 1;
  }

  const rate = DEFAULT_RATES[from]?.[to];
  if (!rate) {
    throw new MonieUtilsError(`Exchange rate not available for ${from} to ${to}`);
  }

  return rate;
}

/**
 * Converts currency amount between two currencies
 * 
 * @param amount - Amount to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param rate - Optional custom exchange rate
 * @returns Conversion result
 * 
 * @throws {MonieUtilsError} When inputs are invalid
 * 
 * @example
 * ```typescript
 * convertCurrency(100, 'USD', 'EUR') // Uses default rate
 * convertCurrency(100, 'USD', 'EUR', 0.85) // Uses custom rate
 * ```
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rate?: number
): ConversionResult {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(`Invalid amount: ${amount}. Amount must be a finite number.`);
  }

  if (!isValidCurrency(fromCurrency)) {
    throw new MonieUtilsError(`Invalid source currency: ${fromCurrency}`);
  }

  if (!isValidCurrency(toCurrency)) {
    throw new MonieUtilsError(`Invalid target currency: ${toCurrency}`);
  }

  const exchangeRate = getExchangeRate(fromCurrency.toUpperCase(), toCurrency.toUpperCase(), rate);
  const convertedAmount = amount * exchangeRate;

  return {
    originalAmount: amount,
    convertedAmount,
    fromCurrency: fromCurrency.toUpperCase(),
    toCurrency: toCurrency.toUpperCase(),
    exchangeRate,
    timestamp: new Date(),
  };
}

/**
 * Converts currency with transaction fee
 * 
 * @param amount - Amount to convert
 * @param rate - Exchange rate
 * @param feePercentage - Fee percentage (e.g., 2.5 for 2.5%)
 * @returns Conversion result with fee information
 * 
 * @throws {MonieUtilsError} When inputs are invalid
 * 
 * @example
 * ```typescript
 * convertWithFee(100, 0.85, 2.5) // 2.5% fee
 * ```
 */
export function convertWithFee(
  amount: number,
  rate: number,
  feePercentage: number
): ConversionWithFeeResult {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(`Invalid amount: ${amount}. Amount must be a finite number.`);
  }

  if (!isValidAmount(rate) || rate <= 0) {
    throw new MonieUtilsError(`Invalid exchange rate: ${rate}. Rate must be a positive number.`);
  }

  if (!isValidAmount(feePercentage) || feePercentage < 0 || feePercentage > 100) {
    throw new MonieUtilsError(`Invalid fee percentage: ${feePercentage}. Must be between 0 and 100.`);
  }

  const feeAmount = (amount * feePercentage) / 100;
  const amountAfterFee = amount - feeAmount;
  const convertedAmount = amountAfterFee * rate;

  return {
    originalAmount: amount,
    convertedAmount,
    fromCurrency: '', // Not specified in this function
    toCurrency: '', // Not specified in this function
    exchangeRate: rate,
    timestamp: new Date(),
    feeAmount,
    feePercentage,
    amountAfterFee,
  };
}

/**
 * Converts multiple amounts using the same exchange rate
 * 
 * @param amounts - Array of amounts to convert
 * @param fromCurrency - Source currency code
 * @param toCurrency - Target currency code
 * @param rate - Optional custom exchange rate
 * @returns Bulk conversion result
 * 
 * @throws {MonieUtilsError} When inputs are invalid
 * 
 * @example
 * ```typescript
 * bulkConvert([100, 200, 300], 'USD', 'EUR')
 * ```
 */
export function bulkConvert(
  amounts: number[],
  fromCurrency: string,
  toCurrency: string,
  rate?: number
): BulkConversionResult {
  if (!Array.isArray(amounts) || amounts.length === 0) {
    throw new MonieUtilsError('Amounts must be a non-empty array');
  }

  if (!isValidCurrency(fromCurrency)) {
    throw new MonieUtilsError(`Invalid source currency: ${fromCurrency}`);
  }

  if (!isValidCurrency(toCurrency)) {
    throw new MonieUtilsError(`Invalid target currency: ${toCurrency}`);
  }

  // Validate all amounts
  for (const amount of amounts) {
    if (!isValidAmount(amount)) {
      throw new MonieUtilsError(`Invalid amount in array: ${amount}`);
    }
  }

  const exchangeRate = getExchangeRate(fromCurrency.toUpperCase(), toCurrency.toUpperCase(), rate);
  
  const conversions = amounts.map(amount => ({
    originalAmount: amount,
    convertedAmount: amount * exchangeRate,
    fromCurrency: fromCurrency.toUpperCase(),
    toCurrency: toCurrency.toUpperCase(),
    exchangeRate,
    timestamp: new Date(),
  }));

  const totalOriginalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
  const totalConvertedAmount = totalOriginalAmount * exchangeRate;

  return {
    conversions,
    totalOriginalAmount,
    totalConvertedAmount,
    exchangeRate,
    fromCurrency: fromCurrency.toUpperCase(),
    toCurrency: toCurrency.toUpperCase(),
  };
}
