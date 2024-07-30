/**
 * Loan and credit utilities
 */

import type {
  LoanPaymentResult,
  LoanBalanceResult,
  AmortizationSchedule,
  AmortizationPayment,
  CreditUtilizationResult,
  MinimumPaymentResult,
  PayoffTimeResult,
} from './types';
import { isValidAmount } from '../validation/validation';
import { roundMoney } from '../arithmetic/arithmetic';
import { MonieUtilsError } from '../errors';

/**
 * Calculates monthly payment for a loan
 *
 * @param principal - Loan principal amount
 * @param rate - Annual interest rate (e.g., 5 for 5%)
 * @param termMonths - Loan term in months
 * @returns Loan payment calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateMonthlyPayment(100000, 5, 360) // 30-year mortgage
 * // Returns: { monthlyPayment: 536.82, totalAmount: 193253.50, ... }
 * ```
 */
export function calculateMonthlyPayment(
  principal: number,
  rate: number,
  termMonths: number
): LoanPaymentResult {
  if (!isValidAmount(principal) || principal <= 0) {
    throw new MonieUtilsError(
      `Invalid principal: ${principal}. Principal must be a positive number.`
    );
  }

  if (!isValidAmount(rate) || rate < 0) {
    throw new MonieUtilsError(
      `Invalid rate: ${rate}. Rate must be a non-negative number.`
    );
  }

  if (!Number.isInteger(termMonths) || termMonths <= 0) {
    throw new MonieUtilsError(
      `Invalid term: ${termMonths}. Term must be a positive integer.`
    );
  }

  // Handle zero interest rate
  if (rate === 0) {
    const monthlyPayment = roundMoney(principal / termMonths);
    return {
      monthlyPayment,
      principal,
      rate,
      termMonths,
      totalAmount: roundMoney(monthlyPayment * termMonths),
      totalInterest: 0,
    };
  }

  const monthlyRate = rate / 100 / 12;
  const monthlyPayment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const roundedPayment = roundMoney(monthlyPayment);
  const totalAmount = roundMoney(roundedPayment * termMonths);
  const totalInterest = roundMoney(totalAmount - principal);

  return {
    monthlyPayment: roundedPayment,
    principal,
    rate,
    termMonths,
    totalAmount,
    totalInterest,
  };
}

/**
 * Calculates remaining loan balance after payments
 *
 * @param principal - Original loan principal
 * @param rate - Annual interest rate (e.g., 5 for 5%)
 * @param termMonths - Original loan term in months
 * @param paymentsMade - Number of payments made
 * @returns Loan balance calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateLoanBalance(100000, 5, 360, 120) // After 10 years of payments
 * ```
 */
export function calculateLoanBalance(
  principal: number,
  rate: number,
  termMonths: number,
  paymentsMade: number
): LoanBalanceResult {
  if (!isValidAmount(principal) || principal <= 0) {
    throw new MonieUtilsError(
      `Invalid principal: ${principal}. Principal must be a positive number.`
    );
  }

  if (!isValidAmount(rate) || rate < 0) {
    throw new MonieUtilsError(
      `Invalid rate: ${rate}. Rate must be a non-negative number.`
    );
  }

  if (!Number.isInteger(termMonths) || termMonths <= 0) {
    throw new MonieUtilsError(
      `Invalid term: ${termMonths}. Term must be a positive integer.`
    );
  }

  if (
    !Number.isInteger(paymentsMade) ||
    paymentsMade < 0 ||
    paymentsMade > termMonths
  ) {
    throw new MonieUtilsError(
      `Invalid payments made: ${paymentsMade}. Must be between 0 and ${termMonths}.`
    );
  }

  if (paymentsMade === 0) {
    return {
      remainingBalance: principal,
      principalPaid: 0,
      interestPaid: 0,
      paymentsMade: 0,
      paymentsRemaining: termMonths,
    };
  }

  const { monthlyPayment } = calculateMonthlyPayment(
    principal,
    rate,
    termMonths
  );

  if (rate === 0) {
    const principalPaid = roundMoney(monthlyPayment * paymentsMade);
    const remainingBalance = roundMoney(principal - principalPaid);

    return {
      remainingBalance: Math.max(0, remainingBalance),
      principalPaid,
      interestPaid: 0,
      paymentsMade,
      paymentsRemaining: termMonths - paymentsMade,
    };
  }

  const monthlyRate = rate / 100 / 12;
  const remainingBalance =
    (principal *
      (Math.pow(1 + monthlyRate, termMonths) -
        Math.pow(1 + monthlyRate, paymentsMade))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  const roundedBalance = roundMoney(Math.max(0, remainingBalance));
  const principalPaid = roundMoney(principal - roundedBalance);
  const totalPaid = roundMoney(monthlyPayment * paymentsMade);
  const interestPaid = roundMoney(totalPaid - principalPaid);

  return {
    remainingBalance: roundedBalance,
    principalPaid,
    interestPaid,
    paymentsMade,
    paymentsRemaining: termMonths - paymentsMade,
  };
}

/**
 * Calculates total interest for a loan
 *
 * @param principal - Loan principal amount
 * @param rate - Annual interest rate (e.g., 5 for 5%)
 * @param termMonths - Loan term in months
 * @returns Total interest amount
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateTotalInterest(100000, 5, 360) // Total interest over 30 years
 * ```
 */
export function calculateTotalInterest(
  principal: number,
  rate: number,
  termMonths: number
): number {
  const loanResult = calculateMonthlyPayment(principal, rate, termMonths);
  return loanResult.totalInterest;
}

/**
 * Generates complete amortization schedule
 *
 * @param principal - Loan principal amount
 * @param rate - Annual interest rate (e.g., 5 for 5%)
 * @param termMonths - Loan term in months
 * @returns Complete amortization schedule
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * generateAmortizationSchedule(100000, 5, 360)
 * // Returns schedule with 360 payment entries
 * ```
 */
export function generateAmortizationSchedule(
  principal: number,
  rate: number,
  termMonths: number
): AmortizationSchedule {
  const summary = calculateMonthlyPayment(principal, rate, termMonths);
  const payments: AmortizationPayment[] = [];

  let remainingBalance = principal;
  const monthlyRate = rate / 100 / 12;

  for (let i = 1; i <= termMonths; i++) {
    const interestAmount =
      rate === 0 ? 0 : roundMoney(remainingBalance * monthlyRate);
    const principalAmount = roundMoney(summary.monthlyPayment - interestAmount);

    // Adjust last payment if necessary
    const actualPrincipalAmount =
      i === termMonths ? remainingBalance : principalAmount;
    const actualPaymentAmount = roundMoney(
      actualPrincipalAmount + interestAmount
    );

    remainingBalance = roundMoney(
      Math.max(0, remainingBalance - actualPrincipalAmount)
    );

    payments.push({
      paymentNumber: i,
      paymentAmount: actualPaymentAmount,
      principalAmount: actualPrincipalAmount,
      interestAmount,
      remainingBalance,
    });
  }

  return {
    payments,
    summary,
  };
}

/**
 * Calculates credit utilization ratio
 *
 * @param usedCredit - Amount of credit currently used
 * @param totalCredit - Total credit limit available
 * @returns Credit utilization result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateCreditUtilization(2500, 10000)
 * // Returns: { utilizationPercentage: 25, riskLevel: 'medium', ... }
 * ```
 */
export function calculateCreditUtilization(
  usedCredit: number,
  totalCredit: number
): CreditUtilizationResult {
  if (!isValidAmount(usedCredit) || usedCredit < 0) {
    throw new MonieUtilsError(
      `Invalid used credit: ${usedCredit}. Must be a non-negative number.`
    );
  }

  if (!isValidAmount(totalCredit) || totalCredit <= 0) {
    throw new MonieUtilsError(
      `Invalid total credit: ${totalCredit}. Must be a positive number.`
    );
  }

  if (usedCredit > totalCredit) {
    throw new MonieUtilsError(
      `Used credit (${usedCredit}) cannot exceed total credit (${totalCredit}).`
    );
  }

  const utilizationPercentage = roundMoney((usedCredit / totalCredit) * 100);
  const availableCredit = roundMoney(totalCredit - usedCredit);

  let riskLevel: 'low' | 'medium' | 'high';
  if (utilizationPercentage <= 10) {
    riskLevel = 'low';
  } else if (utilizationPercentage <= 30) {
    riskLevel = 'medium';
  } else {
    riskLevel = 'high';
  }

  return {
    utilizationPercentage,
    usedCredit,
    totalCredit,
    availableCredit,
    riskLevel,
  };
}

/**
 * Calculates minimum credit card payment
 *
 * @param balance - Current credit card balance
 * @param rate - Annual interest rate (e.g., 18 for 18%)
 * @param minimumRate - Minimum payment rate (e.g., 2 for 2%)
 * @returns Minimum payment calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateMinimumPayment(5000, 18, 2)
 * // Returns minimum payment details
 * ```
 */
export function calculateMinimumPayment(
  balance: number,
  rate: number,
  minimumRate: number
): MinimumPaymentResult {
  if (!isValidAmount(balance) || balance < 0) {
    throw new MonieUtilsError(
      `Invalid balance: ${balance}. Balance must be a non-negative number.`
    );
  }

  if (!isValidAmount(rate) || rate < 0) {
    throw new MonieUtilsError(
      `Invalid rate: ${rate}. Rate must be a non-negative number.`
    );
  }

  if (!isValidAmount(minimumRate) || minimumRate <= 0 || minimumRate > 100) {
    throw new MonieUtilsError(
      `Invalid minimum rate: ${minimumRate}. Must be between 0 and 100.`
    );
  }

  const monthlyInterestRate = rate / 100 / 12;
  const interestPortion = roundMoney(balance * monthlyInterestRate);
  const minimumBasedOnRate = roundMoney((balance * minimumRate) / 100);

  // Minimum payment is the higher of: minimum rate calculation or interest + $15
  const minimumPayment = Math.max(minimumBasedOnRate, interestPortion + 15);
  const principalPortion = roundMoney(minimumPayment - interestPortion);

  return {
    minimumPayment: roundMoney(minimumPayment),
    balance,
    interestRate: rate,
    minimumRate,
    interestPortion,
    principalPortion,
  };
}

/**
 * Calculates time to pay off debt with fixed payments
 *
 * @param balance - Current debt balance
 * @param payment - Monthly payment amount
 * @param rate - Annual interest rate (e.g., 18 for 18%)
 * @returns Payoff time calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid or payment is too low
 *
 * @example
 * ```typescript
 * calculatePayoffTime(5000, 200, 18)
 * // Returns: { monthsToPayoff: 30, yearsToPayoff: 2.5, ... }
 * ```
 */
export function calculatePayoffTime(
  balance: number,
  payment: number,
  rate: number
): PayoffTimeResult {
  if (!isValidAmount(balance) || balance <= 0) {
    throw new MonieUtilsError(
      `Invalid balance: ${balance}. Balance must be a positive number.`
    );
  }

  if (!isValidAmount(payment) || payment <= 0) {
    throw new MonieUtilsError(
      `Invalid payment: ${payment}. Payment must be a positive number.`
    );
  }

  if (!isValidAmount(rate) || rate < 0) {
    throw new MonieUtilsError(
      `Invalid rate: ${rate}. Rate must be a non-negative number.`
    );
  }

  const monthlyRate = rate / 100 / 12;
  const monthlyInterest = balance * monthlyRate;

  if (payment <= monthlyInterest) {
    throw new MonieUtilsError(
      `Payment (${payment}) must be greater than monthly interest (${roundMoney(monthlyInterest)}).`
    );
  }

  if (rate === 0) {
    const monthsToPayoff = Math.ceil(balance / payment);
    const totalAmountPaid = roundMoney(payment * monthsToPayoff);

    return {
      monthsToPayoff,
      yearsToPayoff: roundMoney(monthsToPayoff / 12),
      totalInterestPaid: 0,
      totalAmountPaid,
      monthlyPayment: payment,
    };
  }

  const monthsToPayoff = Math.ceil(
    -Math.log(1 - (balance * monthlyRate) / payment) / Math.log(1 + monthlyRate)
  );
  const totalAmountPaid = roundMoney(payment * monthsToPayoff);
  const totalInterestPaid = roundMoney(totalAmountPaid - balance);

  return {
    monthsToPayoff,
    yearsToPayoff: roundMoney(monthsToPayoff / 12),
    totalInterestPaid,
    totalAmountPaid,
    monthlyPayment: payment,
  };
}
