/**
 * @fileoverview Subscription and recurring payment utilities
 * @module Subscription
 */

import { MonieUtilsError } from '../errors';
import { isValidAmount } from '../validation';
import { roundMoney } from '../arithmetic';
import type {
  SubscriptionPlan,
  SubscriptionValueResult,
  PlanComparisonResult,
  PlanAnalysis,
  ProrationResult,
  UpgradeCreditResult,
  PaymentFrequency,
  AnnualEquivalentResult,
  RecurringCostResult,
} from './types.js';

/**
 * Calculate total subscription value over a period
 *
 * @param monthlyAmount - Monthly subscription amount
 * @param months - Number of months
 * @param currency - Currency code (default: 'USD')
 * @returns Subscription value calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const result = calculateSubscriptionValue(29.99, 12);
 * console.log(result.totalCost); // 359.88
 * console.log(result.averageMonthlyCost); // 29.99
 * ```
 */
export function calculateSubscriptionValue(
  monthlyAmount: number,
  months: number,
  currency: string = 'USD'
): SubscriptionValueResult {
  if (!isValidAmount(monthlyAmount) || !isValidAmount(months)) {
    throw new MonieUtilsError(
      'Monthly amount and months must be valid numbers'
    );
  }

  if (monthlyAmount < 0) {
    throw new MonieUtilsError('Monthly amount cannot be negative');
  }

  if (months <= 0 || !Number.isInteger(months)) {
    throw new MonieUtilsError('Months must be a positive integer');
  }

  const totalCost = monthlyAmount * months;

  return {
    totalCost: roundMoney(totalCost, 2),
    monthlyAmount: roundMoney(monthlyAmount, 2),
    months,
    currency,
    averageMonthlyCost: roundMoney(monthlyAmount, 2),
  };
}

/**
 * Compare multiple subscription plans
 *
 * @param plans - Array of subscription plans to compare
 * @returns Plan comparison result with recommendations
 *
 * @throws {MonieUtilsError} When plans array is invalid
 *
 * @example
 * ```typescript
 * const plans = [
 *   { id: 'basic', name: 'Basic', monthlyAmount: 9.99, currency: 'USD' },
 *   { id: 'pro', name: 'Pro', monthlyAmount: 19.99, currency: 'USD', annualDiscount: 0.2 }
 * ];
 * const comparison = compareSubscriptionPlans(plans);
 * console.log(comparison.recommendedPlan.plan.name);
 * ```
 */
export function compareSubscriptionPlans(
  plans: SubscriptionPlan[]
): PlanComparisonResult {
  if (!Array.isArray(plans) || plans.length === 0) {
    throw new MonieUtilsError('Plans must be a non-empty array');
  }

  if (plans.length === 1) {
    throw new MonieUtilsError('At least two plans are required for comparison');
  }

  // Validate all plans
  for (const plan of plans) {
    if (!plan.id || !plan.name || !isValidAmount(plan.monthlyAmount)) {
      throw new MonieUtilsError(
        'Each plan must have valid id, name, and monthlyAmount'
      );
    }
  }

  const planAnalyses: PlanAnalysis[] = plans.map(plan => {
    const annualDiscount = plan.annualDiscount || 0;
    const effectiveMonthlyRate = plan.monthlyAmount * (1 - annualDiscount);
    const annualCost = effectiveMonthlyRate * 12;
    const costPerUser = plan.maxUsers ? annualCost / plan.maxUsers : undefined;

    // Simple value score based on cost-effectiveness and features
    const featureCount = plan.features?.length || 0;
    const baseScore = Math.max(0, 100 - effectiveMonthlyRate * 2); // Lower cost = higher score
    const featureBonus = Math.min(20, featureCount * 2); // Up to 20 points for features
    const valueScore = Math.min(100, baseScore + featureBonus);

    return {
      plan,
      effectiveMonthlyRate: roundMoney(effectiveMonthlyRate, 2),
      annualCost: roundMoney(annualCost, 2),
      costPerUser: costPerUser ? roundMoney(costPerUser, 2) : undefined,
      valueScore: roundMoney(valueScore, 1),
    };
  });

  // Find recommended plan (highest value score)
  const recommendedPlan = planAnalyses.reduce((best, current) =>
    current.valueScore > best.valueScore ? current : best
  );

  // Calculate max potential savings
  const highestCost = Math.max(...planAnalyses.map(p => p.annualCost));
  const lowestCost = Math.min(...planAnalyses.map(p => p.annualCost));
  const maxSavings = roundMoney(highestCost - lowestCost, 2);

  return {
    plans: planAnalyses,
    recommendedPlan,
    maxSavings,
  };
}

/**
 * Calculate prorated amount based on usage
 *
 * @param amount - Full amount for the period
 * @param daysUsed - Number of days used
 * @param totalDays - Total days in the period
 * @returns Proration calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const result = calculateProrationAmount(100, 15, 30);
 * console.log(result.proratedAmount); // 50.00
 * console.log(result.usagePercentage); // 50
 * ```
 */
export function calculateProrationAmount(
  amount: number,
  daysUsed: number,
  totalDays: number
): ProrationResult {
  if (
    !isValidAmount(amount) ||
    !isValidAmount(daysUsed) ||
    !isValidAmount(totalDays)
  ) {
    throw new MonieUtilsError(
      'Amount, days used, and total days must be valid numbers'
    );
  }

  if (amount < 0) {
    throw new MonieUtilsError('Amount cannot be negative');
  }

  if (daysUsed < 0 || totalDays <= 0) {
    throw new MonieUtilsError(
      'Days used cannot be negative and total days must be positive'
    );
  }

  if (daysUsed > totalDays) {
    throw new MonieUtilsError('Days used cannot exceed total days');
  }

  const usagePercentage = (daysUsed / totalDays) * 100;
  const proratedAmount = (amount * daysUsed) / totalDays;

  return {
    proratedAmount: roundMoney(proratedAmount, 2),
    fullAmount: roundMoney(amount, 2),
    daysUsed: Math.round(daysUsed),
    totalDays: Math.round(totalDays),
    usagePercentage: roundMoney(usagePercentage, 2),
  };
}

/**
 * Calculate upgrade credit when switching plans
 *
 * @param oldPlan - Current subscription plan
 * @param newPlan - New subscription plan to upgrade to
 * @param daysRemaining - Days remaining in current billing period
 * @returns Upgrade credit calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const oldPlan = { id: 'basic', name: 'Basic', monthlyAmount: 9.99, currency: 'USD' };
 * const newPlan = { id: 'pro', name: 'Pro', monthlyAmount: 19.99, currency: 'USD' };
 * const result = calculateUpgradeCredit(oldPlan, newPlan, 15);
 * console.log(result.creditAmount); // Credit from unused portion of old plan
 * console.log(result.netAmountDue); // Additional amount to pay
 * ```
 */
export function calculateUpgradeCredit(
  oldPlan: SubscriptionPlan,
  newPlan: SubscriptionPlan,
  daysRemaining: number
): UpgradeCreditResult {
  if (!oldPlan || !newPlan) {
    throw new MonieUtilsError('Both old and new plans must be provided');
  }

  if (
    !isValidAmount(oldPlan.monthlyAmount) ||
    !isValidAmount(newPlan.monthlyAmount)
  ) {
    throw new MonieUtilsError('Both plans must have valid monthly amounts');
  }

  if (
    !isValidAmount(daysRemaining) ||
    daysRemaining < 0 ||
    daysRemaining > 31
  ) {
    throw new MonieUtilsError('Days remaining must be between 0 and 31');
  }

  const assumedDaysInMonth = 30; // Standardize for calculation
  const effectiveDaysRemaining = Math.min(daysRemaining, assumedDaysInMonth);

  // Calculate remaining value from old plan
  const oldPlanRemainingValue =
    (oldPlan.monthlyAmount * effectiveDaysRemaining) / assumedDaysInMonth;

  // Calculate prorated cost of new plan for remaining period
  const newPlanProratedCost =
    (newPlan.monthlyAmount * effectiveDaysRemaining) / assumedDaysInMonth;

  // Credit is the unused portion of the old plan
  const creditAmount = oldPlanRemainingValue;

  // Net amount due is the difference
  const netAmountDue = newPlanProratedCost - creditAmount;

  return {
    creditAmount: roundMoney(creditAmount, 2),
    oldPlanRemainingValue: roundMoney(oldPlanRemainingValue, 2),
    newPlanProratedCost: roundMoney(newPlanProratedCost, 2),
    netAmountDue: roundMoney(netAmountDue, 2),
    daysRemaining: Math.round(effectiveDaysRemaining),
  };
}

/**
 * Convert payment amount to annual equivalent
 *
 * @param amount - Payment amount per period
 * @param frequency - Payment frequency
 * @returns Annual equivalent calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const result = calculateAnnualEquivalent(500, 'monthly');
 * console.log(result.annualAmount); // 6000
 * console.log(result.paymentsPerYear); // 12
 * ```
 */
export function calculateAnnualEquivalent(
  amount: number,
  frequency: PaymentFrequency
): AnnualEquivalentResult {
  if (!isValidAmount(amount)) {
    throw new MonieUtilsError('Amount must be a valid number');
  }

  if (amount < 0) {
    throw new MonieUtilsError('Amount cannot be negative');
  }

  const frequencyMultipliers: Record<PaymentFrequency, number> = {
    daily: 365,
    weekly: 52,
    'bi-weekly': 26,
    monthly: 12,
    quarterly: 4,
    'semi-annually': 2,
    annually: 1,
  };

  const paymentsPerYear = frequencyMultipliers[frequency];
  if (!paymentsPerYear) {
    throw new MonieUtilsError(`Invalid frequency: ${frequency}`);
  }

  const annualAmount = amount * paymentsPerYear;

  return {
    annualAmount: roundMoney(annualAmount, 2),
    originalAmount: roundMoney(amount, 2),
    frequency,
    paymentsPerYear,
  };
}

/**
 * Calculate next payment date based on start date and frequency
 *
 * @param startDate - Start date of the payment cycle
 * @param frequency - Payment frequency
 * @returns Next payment date
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const nextDate = calculateNextPaymentDate(new Date('2024-01-01'), 'monthly');
 * console.log(nextDate.toISOString()); // 2024-02-01T00:00:00.000Z
 * ```
 */
export function calculateNextPaymentDate(
  startDate: Date,
  frequency: PaymentFrequency
): Date {
  if (!(startDate instanceof Date) || isNaN(startDate.getTime())) {
    throw new MonieUtilsError('Start date must be a valid Date object');
  }

  const nextDate = new Date(startDate);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'bi-weekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'semi-annually':
      nextDate.setMonth(nextDate.getMonth() + 6);
      break;
    case 'annually':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      throw new MonieUtilsError(`Invalid frequency: ${frequency}`);
  }

  return nextDate;
}

/**
 * Calculate total recurring cost over a duration
 *
 * @param amount - Payment amount per period
 * @param frequency - Payment frequency
 * @param duration - Duration in months
 * @returns Total recurring cost calculation result
 *
 * @throws {MonieUtilsError} When inputs are invalid
 *
 * @example
 * ```typescript
 * const result = calculateTotalRecurringCost(100, 'monthly', 24);
 * console.log(result.totalCost); // 2400
 * console.log(result.numberOfPayments); // 24
 * ```
 */
export function calculateTotalRecurringCost(
  amount: number,
  frequency: PaymentFrequency,
  duration: number
): RecurringCostResult {
  if (!isValidAmount(amount) || !isValidAmount(duration)) {
    throw new MonieUtilsError('Amount and duration must be valid numbers');
  }

  if (amount < 0) {
    throw new MonieUtilsError('Amount cannot be negative');
  }

  if (duration <= 0) {
    throw new MonieUtilsError('Duration must be positive');
  }

  // Convert duration (in months) to number of payments based on frequency
  const frequencyToMonthlyMultiplier: Record<PaymentFrequency, number> = {
    daily: 30.44, // Average days per month
    weekly: 4.33, // Average weeks per month
    'bi-weekly': 2.17, // Average bi-weeks per month
    monthly: 1,
    quarterly: 1 / 3,
    'semi-annually': 1 / 6,
    annually: 1 / 12,
  };

  const paymentsPerMonth = frequencyToMonthlyMultiplier[frequency];
  if (!paymentsPerMonth) {
    throw new MonieUtilsError(`Invalid frequency: ${frequency}`);
  }

  const numberOfPayments = Math.round(duration * paymentsPerMonth);
  const totalCost = amount * numberOfPayments;

  return {
    totalCost: roundMoney(totalCost, 2),
    numberOfPayments,
    amountPerPeriod: roundMoney(amount, 2),
    frequency,
    duration: roundMoney(duration, 2),
    durationUnit: 'months',
  };
}
