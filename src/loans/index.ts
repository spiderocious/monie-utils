/**
 * Loan and credit utilities barrel export
 *
 * This module provides comprehensive loan and credit management utilities including:
 * - Loan payment calculations and amortization schedules
 * - Credit utilization and minimum payment calculations
 * - Debt payoff time calculations
 *
 * @example
 * ```typescript
 * import { calculateMonthlyPayment, calculateCreditUtilization } from 'monie-utils/loans';
 *
 * // Calculate mortgage payment
 * const mortgage = calculateMonthlyPayment(300000, 4.5, 360);
 * console.log(mortgage.monthlyPayment); // ~1520.06
 *
 * // Check credit utilization
 * const utilization = calculateCreditUtilization(2500, 10000);
 * console.log(utilization.utilizationPercentage); // 25%
 * ```
 */

// Export loan calculation functions
export {
  calculateMonthlyPayment,
  calculateLoanBalance,
  calculateTotalInterest,
  generateAmortizationSchedule,
} from './loans';

// Export credit utility functions
export {
  calculateCreditUtilization,
  calculateMinimumPayment,
  calculatePayoffTime,
} from './loans';

// Export types
export type {
  LoanPaymentResult,
  LoanBalanceResult,
  AmortizationSchedule,
  AmortizationPayment,
  CreditUtilizationResult,
  MinimumPaymentResult,
  PayoffTimeResult,
} from './types';
