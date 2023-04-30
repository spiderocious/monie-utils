/**
 * Arithmetic operations utilities barrel export
 *
 * This module provides comprehensive arithmetic operations for money including:
 * - Basic operations (add, subtract, multiply, divide, round)
 * - Financial calculations (tip, tax, discount, interest)
 * - Proportional operations (split, distribute, percentages)
 *
 * @example
 * ```typescript
 * import { addMoney, calculateTip, splitAmount } from 'monie-utils/arithmetic';
 *
 * // Basic operations
 * const sum = addMoney(100.50, 25.25); // 125.75
 *
 * // Financial calculations
 * const tip = calculateTip(100, 15); // 15.00
 *
 * // Proportional operations
 * const split = splitAmount(100, 3); // [33.33, 33.33, 33.34]
 * ```
 */

// Export basic operations
export {
  addMoney,
  subtractMoney,
  multiplyMoney,
  divideMoney,
  roundMoney,
} from './arithmetic';

// Export financial calculations
export {
  calculateTip,
  calculateTax,
  calculateDiscount,
  calculateSimpleInterest,
  calculateCompoundInterest,
} from './arithmetic';

// Export proportional operations
export {
  splitAmount,
  distributeProportionally,
  calculatePercentageOfTotal,
} from './arithmetic';

// Export types
export type {
  RoundingMode,
  ArithmeticResult,
  SplitResult,
  DistributionResult,
  InterestResult,
  PercentageResult,
} from './types';
