/**
 * Arithmetic operations utilities
 */

import type {
  RoundingMode,
  SplitResult,
  DistributionResult,
  InterestResult,
  PercentageResult,
} from './types';
import { isValidAmount, isValidCurrency } from '../validation/validation';
import { MonieUtilsError } from '../errors';

/**
 * Rounds a money amount using the specified rounding mode
 *
 * @param amount - The amount to round
 * @param precision - Number of decimal places (default: 2)
 * @param mode - Rounding mode (default: 'round')
 * @returns Rounded amount
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * roundMoney(123.456) // 123.46
 * roundMoney(123.456, 1) // 123.5
 * roundMoney(123.456, 2, 'floor') // 123.45
 * ```
 */
export function roundMoney(
  amount: number,
  precision: number = 2,
  mode: RoundingMode = 'round'
): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(
      `Invalid amount: ${amount}. Amount must be a finite number.`
    );
  }

  if (
    typeof precision !== 'number' ||
    precision < 0 ||
    !Number.isInteger(precision)
  ) {
    throw new MonieUtilsError(
      `Invalid precision: ${precision}. Must be a non-negative integer.`
    );
  }

  const multiplier = Math.pow(10, precision);

  switch (mode) {
    case 'floor':
      return Math.floor(amount * multiplier) / multiplier;
    case 'ceil':
      return Math.ceil(amount * multiplier) / multiplier;
    case 'bankers':
      // Banker's rounding (round half to even)
      const scaled = amount * multiplier;
      const rounded = Math.round(scaled);
      if (Math.abs(scaled - Math.floor(scaled) - 0.5) < Number.EPSILON) {
        return (
          (rounded % 2 === 0 ? rounded : rounded - Math.sign(rounded)) /
          multiplier
        );
      }
      return rounded / multiplier;
    case 'round':
    default:
      return Math.round(amount * multiplier) / multiplier;
  }
}

/**
 * Adds two money amounts
 *
 * @param amount1 - First amount
 * @param amount2 - Second amount
 * @param currency - Optional currency code for validation
 * @returns Addition result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * addMoney(100.50, 25.25) // 125.75
 * addMoney(100.50, 25.25, 'USD') // 125.75 with currency validation
 * ```
 */
export function addMoney(
  amount1: number,
  amount2: number,
  currency?: string
): number {
  if (!isValidAmount(amount1)) {
    throw new MonieUtilsError(
      `Invalid first amount: ${amount1}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(amount2)) {
    throw new MonieUtilsError(
      `Invalid second amount: ${amount2}. Amount must be a finite number.`
    );
  }

  if (currency && !isValidCurrency(currency)) {
    throw new MonieUtilsError(`Invalid currency: ${currency}`);
  }

  return roundMoney(amount1 + amount2);
}

/**
 * Subtracts two money amounts
 *
 * @param amount1 - Amount to subtract from
 * @param amount2 - Amount to subtract
 * @param currency - Optional currency code for validation
 * @returns Subtraction result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * subtractMoney(100.75, 25.25) // 75.50
 * ```
 */
export function subtractMoney(
  amount1: number,
  amount2: number,
  currency?: string
): number {
  if (!isValidAmount(amount1)) {
    throw new MonieUtilsError(
      `Invalid first amount: ${amount1}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(amount2)) {
    throw new MonieUtilsError(
      `Invalid second amount: ${amount2}. Amount must be a finite number.`
    );
  }

  if (currency && !isValidCurrency(currency)) {
    throw new MonieUtilsError(`Invalid currency: ${currency}`);
  }

  return roundMoney(amount1 - amount2);
}

/**
 * Multiplies money amount by a number
 *
 * @param amount - The amount to multiply
 * @param multiplier - The multiplier
 * @returns Multiplication result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * multiplyMoney(100.50, 2.5) // 251.25
 * ```
 */
export function multiplyMoney(amount: number, multiplier: number): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(
      `Invalid amount: ${amount}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(multiplier)) {
    throw new MonieUtilsError(
      `Invalid multiplier: ${multiplier}. Multiplier must be a finite number.`
    );
  }

  return roundMoney(amount * multiplier);
}

/**
 * Divides money amount by a number
 *
 * @param amount - The amount to divide
 * @param divisor - The divisor
 * @returns Division result
 *
 * @throws {MonieUtilsError} When inputs are invalid or divisor is zero
 *
 * @example
 * ```typescript
 * divideMoney(100.50, 2) // 50.25
 * ```
 */
export function divideMoney(amount: number, divisor: number): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(
      `Invalid amount: ${amount}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(divisor)) {
    throw new MonieUtilsError(
      `Invalid divisor: ${divisor}. Divisor must be a finite number.`
    );
  }

  if (divisor === 0) {
    throw new MonieUtilsError('Cannot divide by zero');
  }

  return roundMoney(amount / divisor);
}

/**
 * Calculates tip amount
 *
 * @param amount - The bill amount
 * @param percentage - Tip percentage (e.g., 15 for 15%)
 * @returns Tip amount
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateTip(100, 15) // 15.00
 * calculateTip(50.75, 20) // 10.15
 * ```
 */
export function calculateTip(amount: number, percentage: number): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(
      `Invalid amount: ${amount}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(percentage) || percentage < 0) {
    throw new MonieUtilsError(
      `Invalid percentage: ${percentage}. Percentage must be a non-negative number.`
    );
  }

  return roundMoney((amount * percentage) / 100);
}

/**
 * Calculates tax amount
 *
 * @param amount - The amount to calculate tax on
 * @param taxRate - Tax rate (e.g., 8.5 for 8.5%)
 * @returns Tax amount
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateTax(100, 8.5) // 8.50
 * ```
 */
export function calculateTax(amount: number, taxRate: number): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(
      `Invalid amount: ${amount}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(taxRate) || taxRate < 0) {
    throw new MonieUtilsError(
      `Invalid tax rate: ${taxRate}. Tax rate must be a non-negative number.`
    );
  }

  return roundMoney((amount * taxRate) / 100);
}

/**
 * Calculates discount amount
 *
 * @param amount - The original amount
 * @param discountRate - Discount rate (e.g., 10 for 10% off)
 * @returns Discount amount
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateDiscount(100, 10) // 10.00 (discount amount)
 * ```
 */
export function calculateDiscount(
  amount: number,
  discountRate: number
): number {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(
      `Invalid amount: ${amount}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(discountRate) || discountRate < 0 || discountRate > 100) {
    throw new MonieUtilsError(
      `Invalid discount rate: ${discountRate}. Discount rate must be between 0 and 100.`
    );
  }

  return roundMoney((amount * discountRate) / 100);
}

/**
 * Calculates simple interest
 *
 * @param principal - Principal amount
 * @param rate - Annual interest rate (e.g., 5 for 5%)
 * @param time - Time in years
 * @returns Interest calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateSimpleInterest(1000, 5, 2) // Interest: 100, Final: 1100
 * ```
 */
export function calculateSimpleInterest(
  principal: number,
  rate: number,
  time: number
): InterestResult {
  if (!isValidAmount(principal) || principal < 0) {
    throw new MonieUtilsError(
      `Invalid principal: ${principal}. Principal must be a non-negative number.`
    );
  }

  if (!isValidAmount(rate) || rate < 0) {
    throw new MonieUtilsError(
      `Invalid rate: ${rate}. Rate must be a non-negative number.`
    );
  }

  if (!isValidAmount(time) || time < 0) {
    throw new MonieUtilsError(
      `Invalid time: ${time}. Time must be a non-negative number.`
    );
  }

  const interest = roundMoney((principal * rate * time) / 100);
  const finalAmount = roundMoney(principal + interest);

  return {
    principal,
    rate,
    time,
    interest,
    finalAmount,
    type: 'simple',
  };
}

/**
 * Calculates compound interest
 *
 * @param principal - Principal amount
 * @param rate - Annual interest rate (e.g., 5 for 5%)
 * @param time - Time in years
 * @param frequency - Compounding frequency per year (default: 1)
 * @returns Interest calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculateCompoundInterest(1000, 5, 2) // Annual compounding
 * calculateCompoundInterest(1000, 5, 2, 12) // Monthly compounding
 * ```
 */
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  time: number,
  frequency: number = 1
): InterestResult {
  if (!isValidAmount(principal) || principal < 0) {
    throw new MonieUtilsError(
      `Invalid principal: ${principal}. Principal must be a non-negative number.`
    );
  }

  if (!isValidAmount(rate) || rate < 0) {
    throw new MonieUtilsError(
      `Invalid rate: ${rate}. Rate must be a non-negative number.`
    );
  }

  if (!isValidAmount(time) || time < 0) {
    throw new MonieUtilsError(
      `Invalid time: ${time}. Time must be a non-negative number.`
    );
  }

  if (
    !isValidAmount(frequency) ||
    frequency <= 0 ||
    !Number.isInteger(frequency)
  ) {
    throw new MonieUtilsError(
      `Invalid frequency: ${frequency}. Frequency must be a positive integer.`
    );
  }

  const finalAmount =
    principal * Math.pow(1 + rate / 100 / frequency, frequency * time);
  const roundedFinal = roundMoney(finalAmount);
  const interest = roundMoney(roundedFinal - principal);

  return {
    principal,
    rate,
    time,
    interest,
    finalAmount: roundedFinal,
    type: 'compound',
    frequency,
  };
}

/**
 * Splits an amount into equal parts
 *
 * @param totalAmount - Total amount to split
 * @param numberOfParts - Number of parts to split into
 * @returns Split result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * splitAmount(100, 3) // [33.33, 33.33, 33.34] (last part gets remainder)
 * ```
 */
export function splitAmount(
  totalAmount: number,
  numberOfParts: number
): SplitResult {
  if (!isValidAmount(totalAmount)) {
    throw new MonieUtilsError(
      `Invalid total amount: ${totalAmount}. Amount must be a finite number.`
    );
  }

  if (!Number.isInteger(numberOfParts) || numberOfParts <= 0) {
    throw new MonieUtilsError(
      `Invalid number of parts: ${numberOfParts}. Must be a positive integer.`
    );
  }

  const baseAmount = Math.floor((totalAmount * 100) / numberOfParts) / 100;
  const remainder = roundMoney(totalAmount - baseAmount * numberOfParts);

  const amounts = new Array(numberOfParts).fill(baseAmount);

  // Distribute remainder to last parts (in cents)
  let remainderCents = Math.round(remainder * 100);
  for (let i = amounts.length - 1; i >= 0 && remainderCents > 0; i--) {
    amounts[i] = roundMoney(amounts[i] + 0.01);
    remainderCents--;
  }

  return {
    amounts,
    totalAmount,
    numberOfParts,
    remainder: remainderCents / 100,
  };
}

/**
 * Distributes an amount proportionally based on ratios
 *
 * @param totalAmount - Total amount to distribute
 * @param ratios - Array of ratios for distribution
 * @returns Distribution result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * distributeProportionally(100, [1, 2, 1]) // [25, 50, 25]
 * distributeProportionally(100, [30, 70]) // [30, 70]
 * ```
 */
export function distributeProportionally(
  totalAmount: number,
  ratios: number[]
): DistributionResult {
  if (!isValidAmount(totalAmount)) {
    throw new MonieUtilsError(
      `Invalid total amount: ${totalAmount}. Amount must be a finite number.`
    );
  }

  if (!Array.isArray(ratios) || ratios.length === 0) {
    throw new MonieUtilsError('Ratios must be a non-empty array');
  }

  // Validate all ratios
  for (const ratio of ratios) {
    if (!isValidAmount(ratio) || ratio < 0) {
      throw new MonieUtilsError(
        `Invalid ratio: ${ratio}. All ratios must be non-negative numbers.`
      );
    }
  }

  const totalRatio = ratios.reduce((sum, ratio) => sum + ratio, 0);

  if (totalRatio === 0) {
    throw new MonieUtilsError('Sum of ratios cannot be zero');
  }

  const amounts = ratios.map(ratio =>
    roundMoney((totalAmount * ratio) / totalRatio)
  );

  const distributedTotal = amounts.reduce((sum, amount) => sum + amount, 0);
  const remainder = roundMoney(totalAmount - distributedTotal);

  return {
    amounts,
    totalAmount,
    ratios,
    remainder,
  };
}

/**
 * Calculates what percentage one amount is of a total
 *
 * @param amount - The amount to calculate percentage for
 * @param total - The total amount
 * @returns Percentage result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * calculatePercentageOfTotal(25, 100) // 25%
 * calculatePercentageOfTotal(33.33, 100) // 33.33%
 * ```
 */
export function calculatePercentageOfTotal(
  amount: number,
  total: number
): PercentageResult {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError(
      `Invalid amount: ${amount}. Amount must be a finite number.`
    );
  }

  if (!isValidAmount(total)) {
    throw new MonieUtilsError(
      `Invalid total: ${total}. Total must be a finite number.`
    );
  }

  if (total === 0) {
    throw new MonieUtilsError('Total cannot be zero');
  }

  const percentage = roundMoney((amount / total) * 100);

  return {
    percentage,
    amount,
    total,
  };
}
