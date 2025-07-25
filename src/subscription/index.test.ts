/**
 * @fileoverview Tests for subscription and recurring payment utilities
 */

import {
  calculateSubscriptionValue,
  compareSubscriptionPlans,
  calculateProrationAmount,
  calculateUpgradeCredit,
  calculateAnnualEquivalent,
  calculateNextPaymentDate,
  calculateTotalRecurringCost,
} from './index';
import { MonieUtilsError } from '../errors';
import type { SubscriptionPlan } from './types';

describe('subscription and recurring payment utilities', () => {
  describe('subscription value calculations', () => {
    it('should calculate subscription value correctly', () => {
      const result = calculateSubscriptionValue(29.99, 12);
      expect(result.totalCost).toBe(359.88);
      expect(result.monthlyAmount).toBe(29.99);
      expect(result.months).toBe(12);
      expect(result.averageMonthlyCost).toBe(29.99);
    });

    it('should handle zero monthly amount', () => {
      const result = calculateSubscriptionValue(0, 6);
      expect(result.totalCost).toBe(0);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateSubscriptionValue(-10, 12)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateSubscriptionValue(29.99, 0)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateSubscriptionValue(29.99, 5.5)).toThrow(
        MonieUtilsError
      );
    });
  });

  describe('subscription plan comparison', () => {
    const basicPlan: SubscriptionPlan = {
      id: 'basic',
      name: 'Basic',
      monthlyAmount: 9.99,
      currency: 'USD',
      features: ['Feature 1', 'Feature 2'],
    };

    const proPlan: SubscriptionPlan = {
      id: 'pro',
      name: 'Pro',
      monthlyAmount: 19.99,
      currency: 'USD',
      annualDiscount: 0.2,
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
      maxUsers: 10,
    };

    it('should compare subscription plans correctly', () => {
      const result = compareSubscriptionPlans([basicPlan, proPlan]);
      expect(result.plans).toHaveLength(2);
      expect(result.recommendedPlan).toBeDefined();
      expect(result.maxSavings).toBeGreaterThanOrEqual(0);
    });

    it('should calculate effective rates with discounts', () => {
      const result = compareSubscriptionPlans([basicPlan, proPlan]);
      const proAnalysis = result.plans.find(p => p.plan.id === 'pro');
      expect(proAnalysis?.effectiveMonthlyRate).toBe(15.99); // 19.99 * 0.8
    });

    it('should throw error for invalid plans', () => {
      expect(() => compareSubscriptionPlans([])).toThrow(MonieUtilsError);
      expect(() => compareSubscriptionPlans([basicPlan])).toThrow(
        MonieUtilsError
      );
    });
  });

  describe('proration calculations', () => {
    it('should calculate proration correctly', () => {
      const result = calculateProrationAmount(100, 15, 30);
      expect(result.proratedAmount).toBe(50);
      expect(result.usagePercentage).toBe(50);
      expect(result.daysUsed).toBe(15);
      expect(result.totalDays).toBe(30);
    });

    it('should handle full usage', () => {
      const result = calculateProrationAmount(100, 30, 30);
      expect(result.proratedAmount).toBe(100);
      expect(result.usagePercentage).toBe(100);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateProrationAmount(-100, 15, 30)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateProrationAmount(100, -5, 30)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateProrationAmount(100, 35, 30)).toThrow(
        MonieUtilsError
      );
    });
  });

  describe('upgrade credit calculations', () => {
    const oldPlan: SubscriptionPlan = {
      id: 'basic',
      name: 'Basic',
      monthlyAmount: 9.99,
      currency: 'USD',
    };

    const newPlan: SubscriptionPlan = {
      id: 'pro',
      name: 'Pro',
      monthlyAmount: 19.99,
      currency: 'USD',
    };

    it('should calculate upgrade credit correctly', () => {
      const result = calculateUpgradeCredit(oldPlan, newPlan, 15);
      expect(result.creditAmount).toBe(5); // (9.99 * 15) / 30 = 4.995, rounded to 5
      expect(result.newPlanProratedCost).toBe(9.99); // (19.99 * 15) / 30 = 9.995, rounded to 9.99
      expect(result.netAmountDue).toBe(5); // 9.99 - 5 = 4.99, but rounding after subtraction gives 5
      expect(result.daysRemaining).toBe(15);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateUpgradeCredit(oldPlan, newPlan, -5)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateUpgradeCredit(oldPlan, newPlan, 35)).toThrow(
        MonieUtilsError
      );
    });
  });

  describe('annual equivalent calculations', () => {
    it('should calculate monthly to annual correctly', () => {
      const result = calculateAnnualEquivalent(500, 'monthly');
      expect(result.annualAmount).toBe(6000);
      expect(result.paymentsPerYear).toBe(12);
    });

    it('should calculate weekly to annual correctly', () => {
      const result = calculateAnnualEquivalent(100, 'weekly');
      expect(result.annualAmount).toBe(5200);
      expect(result.paymentsPerYear).toBe(52);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateAnnualEquivalent(-100, 'monthly')).toThrow(
        MonieUtilsError
      );
      expect(() => calculateAnnualEquivalent(100, 'invalid' as any)).toThrow(
        MonieUtilsError
      );
    });
  });

  describe('next payment date calculations', () => {
    it('should calculate next monthly payment', () => {
      const startDate = new Date('2024-01-01');
      const nextDate = calculateNextPaymentDate(startDate, 'monthly');
      expect(nextDate.getFullYear()).toBe(2024);
      expect(nextDate.getMonth()).toBe(1); // February (0-indexed)
      expect(nextDate.getDate()).toBe(1);
    });

    it('should calculate next weekly payment', () => {
      const startDate = new Date('2024-01-01');
      const nextDate = calculateNextPaymentDate(startDate, 'weekly');
      expect(nextDate.getDate()).toBe(8);
    });

    it('should throw error for invalid date', () => {
      expect(() =>
        calculateNextPaymentDate(new Date('invalid'), 'monthly')
      ).toThrow(MonieUtilsError);
    });
  });

  describe('total recurring cost calculations', () => {
    it('should calculate monthly recurring cost correctly', () => {
      const result = calculateTotalRecurringCost(100, 'monthly', 24);
      expect(result.totalCost).toBe(2400);
      expect(result.numberOfPayments).toBe(24);
      expect(result.amountPerPeriod).toBe(100);
      expect(result.frequency).toBe('monthly');
    });

    it('should calculate quarterly recurring cost correctly', () => {
      const result = calculateTotalRecurringCost(300, 'quarterly', 12);
      expect(result.numberOfPayments).toBe(4); // 12 months / 3 months per quarter
      expect(result.totalCost).toBe(1200);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateTotalRecurringCost(-100, 'monthly', 12)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateTotalRecurringCost(100, 'monthly', 0)).toThrow(
        MonieUtilsError
      );
    });
  });
});
