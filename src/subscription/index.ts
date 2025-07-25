/**
 * @fileoverview Subscription and recurring payment utilities
 * @module Subscription
 *
 * This module provides utilities for subscription management, plan comparisons,
 * proration calculations, and recurring payment processing.
 *
 * @example
 * ```typescript
 * import {
 *   calculateSubscriptionValue,
 *   compareSubscriptionPlans,
 *   calculateProrationAmount,
 *   calculateUpgradeCredit,
 *   calculateAnnualEquivalent,
 *   calculateNextPaymentDate,
 *   calculateTotalRecurringCost
 * } from 'monie-utils/subscription';
 *
 * // Calculate subscription value
 * const subValue = calculateSubscriptionValue(29.99, 12);
 * console.log(`Total cost: $${subValue.totalCost}`);
 *
 * // Compare subscription plans
 * const plans = [
 *   { id: 'basic', name: 'Basic', monthlyAmount: 9.99, currency: 'USD' },
 *   { id: 'pro', name: 'Pro', monthlyAmount: 19.99, currency: 'USD', annualDiscount: 0.2 }
 * ];
 * const comparison = compareSubscriptionPlans(plans);
 * console.log(`Recommended plan: ${comparison.recommendedPlan.plan.name}`);
 *
 * // Calculate proration
 * const proration = calculateProrationAmount(100, 15, 30);
 * console.log(`Prorated amount: $${proration.proratedAmount}`);
 *
 * // Calculate upgrade credit
 * const oldPlan = { id: 'basic', name: 'Basic', monthlyAmount: 9.99, currency: 'USD' };
 * const newPlan = { id: 'pro', name: 'Pro', monthlyAmount: 19.99, currency: 'USD' };
 * const upgrade = calculateUpgradeCredit(oldPlan, newPlan, 15);
 * console.log(`Net amount due: $${upgrade.netAmountDue}`);
 *
 * // Calculate annual equivalent
 * const annual = calculateAnnualEquivalent(500, 'monthly');
 * console.log(`Annual equivalent: $${annual.annualAmount}`);
 *
 * // Calculate next payment date
 * const nextDate = calculateNextPaymentDate(new Date('2024-01-01'), 'monthly');
 * console.log(`Next payment: ${nextDate.toISOString()}`);
 *
 * // Calculate total recurring cost
 * const recurring = calculateTotalRecurringCost(100, 'monthly', 24);
 * console.log(`Total cost over 24 months: $${recurring.totalCost}`);
 * ```
 */

export {
  calculateSubscriptionValue,
  compareSubscriptionPlans,
  calculateProrationAmount,
  calculateUpgradeCredit,
  calculateAnnualEquivalent,
  calculateNextPaymentDate,
  calculateTotalRecurringCost,
} from './subscription';

export type {
  SubscriptionPlan,
  SubscriptionValueResult,
  PlanComparisonResult,
  PlanAnalysis,
  ProrationResult,
  UpgradeCreditResult,
  PaymentFrequency,
  AnnualEquivalentResult,
  RecurringCostResult,
} from './types';
