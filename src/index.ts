/**
 * Monie Utils - A comprehensive TypeScript library for money-related utilities
 * 
 * @author Oluwaferanmi Adeniji
 * @version 0.1.0
 * @license MIT
 */

// Export types and interfaces
export type {
  Money,
  ExchangeRate,
  Transaction,
  CurrencyInfo,
  FormatOptions,
  FeeStructure,
  LoanParameters,
  InvestmentReturn,
  BudgetCategory,
  SubscriptionPlan,
  MonieUtilsError as MonieUtilsErrorType
} from './types';

// Export error classes
export { MonieUtilsError, createError } from './errors';

// Export formatCurrency utilities
export * from './formatCurrency';

// Export formatPercentage utilities
export * from './formatPercentage';

// Export localization utilities
export * from './localization';

// Export validation utilities
export * from './validation';

// Export conversion utilities
export * from './conversion';

// Export arithmetic utilities
export * from './arithmetic';

// Version information
export const VERSION = '0.1.0';

/**
 * Library information
 */
export const LIBRARY_INFO = {
  name: 'monie-utils',
  version: VERSION,
  description: 'A comprehensive TypeScript library for money-related utilities',
  author: 'Oluwaferanmi Adeniji',
  license: 'MIT',
} as const;
