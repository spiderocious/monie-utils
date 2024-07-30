/**
 * Tests for loan and credit utilities
 */

import {
  calculateMonthlyPayment,
  calculateLoanBalance,
  generateAmortizationSchedule,
  calculateCreditUtilization,
  calculateMinimumPayment,
  calculatePayoffTime,
} from './loans';
import { MonieUtilsError } from '../errors';

describe('loan and credit utilities', () => {
  describe('loan calculations', () => {
    it('should calculate monthly payment correctly', () => {
      const result = calculateMonthlyPayment(100000, 5, 360);
      expect(result.monthlyPayment).toBeCloseTo(536.82, 2);
      expect(result.totalInterest).toBeGreaterThan(90000);
    });

    it('should handle zero interest rate', () => {
      const result = calculateMonthlyPayment(12000, 0, 12);
      expect(result.monthlyPayment).toBe(1000);
      expect(result.totalInterest).toBe(0);
    });

    it('should calculate loan balance after payments', () => {
      const result = calculateLoanBalance(100000, 5, 360, 120);
      expect(result.remainingBalance).toBeLessThan(100000);
      expect(result.principalPaid).toBeGreaterThan(0);
    });

    it('should generate amortization schedule', () => {
      const result = generateAmortizationSchedule(10000, 5, 12);
      expect(result.payments).toHaveLength(12);
      expect(result.payments[0].remainingBalance).toBeLessThan(10000);
    });
  });

  describe('credit utilities', () => {
    it('should calculate credit utilization', () => {
      const result = calculateCreditUtilization(2500, 10000);
      expect(result.utilizationPercentage).toBe(25);
      expect(result.riskLevel).toBe('medium');
      expect(result.availableCredit).toBe(7500);
    });

    it('should calculate minimum payment', () => {
      const result = calculateMinimumPayment(5000, 18, 2);
      expect(result.minimumPayment).toBeGreaterThan(0);
      expect(result.interestPortion).toBeGreaterThan(0);
    });

    it('should calculate payoff time', () => {
      const result = calculatePayoffTime(5000, 200, 18);
      expect(result.monthsToPayoff).toBeGreaterThan(0);
      expect(result.totalInterestPaid).toBeGreaterThan(0);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateMonthlyPayment(-1000, 5, 360)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateCreditUtilization(15000, 10000)).toThrow(
        MonieUtilsError
      );
    });
  });
});
