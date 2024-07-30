/**
 * @fileoverview Type definitions for subscription and recurring payment utilities
 * @module Subscription/Types
 */

/**
 * Subscription plan structure
 */
export interface SubscriptionPlan {
  /** Unique identifier for the plan */
  id: string;
  /** Display name of the plan */
  name: string;
  /** Monthly cost of the plan */
  monthlyAmount: number;
  /** Currency code (e.g., 'USD', 'EUR') */
  currency: string;
  /** Optional annual discount as decimal (e.g., 0.1 for 10% off) */
  annualDiscount?: number;
  /** Features included in this plan */
  features?: string[];
  /** Maximum number of users/seats allowed */
  maxUsers?: number;
}

/**
 * Result of subscription value calculation
 */
export interface SubscriptionValueResult {
  /** Total cost for the specified period */
  totalCost: number;
  /** Monthly amount */
  monthlyAmount: number;
  /** Number of months */
  months: number;
  /** Currency code */
  currency: string;
  /** Average monthly cost (useful for prorated calculations) */
  averageMonthlyCost: number;
}

/**
 * Result of subscription plan comparison
 */
export interface PlanComparisonResult {
  /** Array of plans with calculated costs and metrics */
  plans: PlanAnalysis[];
  /** Recommended plan based on cost-effectiveness */
  recommendedPlan: PlanAnalysis;
  /** Potential savings by choosing the recommended plan */
  maxSavings: number;
}

/**
 * Individual plan analysis in comparison
 */
export interface PlanAnalysis {
  /** Original plan information */
  plan: SubscriptionPlan;
  /** Monthly cost (may include discounts) */
  effectiveMonthlyRate: number;
  /** Annual cost */
  annualCost: number;
  /** Cost per user (if applicable) */
  costPerUser?: number;
  /** Value score (0-100, higher is better) */
  valueScore: number;
}

/**
 * Result of proration calculation
 */
export interface ProrationResult {
  /** Prorated amount based on usage */
  proratedAmount: number;
  /** Original full amount */
  fullAmount: number;
  /** Number of days used */
  daysUsed: number;
  /** Total days in the period */
  totalDays: number;
  /** Usage percentage */
  usagePercentage: number;
}

/**
 * Result of upgrade credit calculation
 */
export interface UpgradeCreditResult {
  /** Credit amount to apply to new plan */
  creditAmount: number;
  /** Remaining value from old plan */
  oldPlanRemainingValue: number;
  /** Prorated cost of new plan for remaining period */
  newPlanProratedCost: number;
  /** Net amount due (positive) or credit (negative) */
  netAmountDue: number;
  /** Days remaining in the billing period */
  daysRemaining: number;
}

/**
 * Payment frequency types
 */
export type PaymentFrequency =
  | 'daily'
  | 'weekly'
  | 'bi-weekly'
  | 'monthly'
  | 'quarterly'
  | 'semi-annually'
  | 'annually';

/**
 * Result of annual equivalent calculation
 */
export interface AnnualEquivalentResult {
  /** Annual equivalent amount */
  annualAmount: number;
  /** Original amount */
  originalAmount: number;
  /** Payment frequency */
  frequency: PaymentFrequency;
  /** Number of payments per year */
  paymentsPerYear: number;
}

/**
 * Result of recurring cost calculation
 */
export interface RecurringCostResult {
  /** Total cost over the duration */
  totalCost: number;
  /** Number of payments */
  numberOfPayments: number;
  /** Payment amount per period */
  amountPerPeriod: number;
  /** Payment frequency */
  frequency: PaymentFrequency;
  /** Duration in the specified time unit */
  duration: number;
  /** Time unit for duration */
  durationUnit: 'days' | 'weeks' | 'months' | 'years';
}
