/**
 * Constants used in currency formatting operations
 */

import type { CurrencyDisplay } from './types';

/**
 * Default formatting options
 */
export const DEFAULT_FORMAT_OPTIONS = {
  locale: 'en-US',
  showSymbol: true,
  showCode: false,
  useGrouping: true,
  symbolPosition: 'start' as const,
} as const;

/**
 * Currency information database
 * Contains symbols, decimal places, and other formatting info for major currencies
 */
export const CURRENCY_INFO: Record<string, CurrencyDisplay> = {
  // Major World Currencies
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    decimalPlaces: 0,
    usesGrouping: true,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF',
    name: 'Swiss Franc',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  
  // African Currencies
  NGN: {
    code: 'NGN',
    symbol: '₦',
    name: 'Nigerian Naira',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  ZAR: {
    code: 'ZAR',
    symbol: 'R',
    name: 'South African Rand',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  GHS: {
    code: 'GHS',
    symbol: '₵',
    name: 'Ghanaian Cedi',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  
  // Asian Currencies
  CNY: {
    code: 'CNY',
    symbol: '¥',
    name: 'Chinese Yuan',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    decimalPlaces: 2,
    usesGrouping: true,
  },
  
  // Cryptocurrencies
  BTC: {
    code: 'BTC',
    symbol: '₿',
    name: 'Bitcoin',
    decimalPlaces: 8,
    usesGrouping: true,
  },
  ETH: {
    code: 'ETH',
    symbol: 'Ξ',
    name: 'Ethereum',
    decimalPlaces: 8,
    usesGrouping: true,
  },
  USDT: {
    code: 'USDT',
    symbol: '₮',
    name: 'Tether',
    decimalPlaces: 2,
    usesGrouping: true,
  },
} as const;

/**
 * Compact notation suffixes for large numbers
 */
export const COMPACT_SUFFIXES = {
  K: 1000,
  M: 1000000,
  B: 1000000000,
  T: 1000000000000,
} as const;

/**
 * Compact notation thresholds
 */
export const COMPACT_THRESHOLDS = {
  THOUSAND: 1000,
  MILLION: 1000000,
  BILLION: 1000000000,
  TRILLION: 1000000000000,
} as const;
