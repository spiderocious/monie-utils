/**
 * Tests for arithmetic operations utilities
 */

import { MonieUtilsError } from '../errors';
import {
  addMoney,
  calculateDiscount,
  calculatePercentageOfTotal,
  calculateSimpleInterest,
  calculateTax,
  calculateTip,
  distributeProportionally,
  divideMoney,
  multiplyMoney,
  splitAmount,
  subtractMoney,
} from './arithmetic';

describe('arithmetic operations', () => {
  describe('basic operations', () => {
    it('should add money amounts', () => {
      expect(addMoney(100.5, 25.25)).toBe(125.75);
    });

    it('should subtract money amounts', () => {
      expect(subtractMoney(100.75, 25.25)).toBe(75.5);
    });

    it('should multiply money amounts', () => {
      expect(multiplyMoney(100.5, 2)).toBe(201.0);
    });

    it('should divide money amounts', () => {
      expect(divideMoney(100.5, 2)).toBe(50.25);
    });

    it('should throw for division by zero', () => {
      expect(() => divideMoney(100, 0)).toThrow(MonieUtilsError);
    });
  });

  describe('financial calculations', () => {
    it('should calculate tip correctly', () => {
      expect(calculateTip(100, 15)).toBe(15.0);
    });

    it('should calculate tax correctly', () => {
      expect(calculateTax(100, 8.5)).toBe(8.5);
    });

    it('should calculate discount correctly', () => {
      expect(calculateDiscount(100, 10)).toBe(10.0);
    });

    it('should calculate simple interest', () => {
      const result = calculateSimpleInterest(1000, 5, 2);
      expect(result.interest).toBe(100);
      expect(result.finalAmount).toBe(1100);
    });
  });

  describe('proportional operations', () => {
    it('should split amount into equal parts', () => {
      const result = splitAmount(100, 3);
      expect(result.amounts).toHaveLength(3);
      expect(result.amounts.reduce((sum, amt) => sum + amt, 0)).toBeCloseTo(
        100
      );
    });

    it('should distribute proportionally', () => {
      const result = distributeProportionally(100, [1, 2, 1]);
      expect(result.amounts).toEqual([25, 50, 25]);
    });

    it('should calculate percentage of total', () => {
      const result = calculatePercentageOfTotal(25, 100);
      expect(result.percentage).toBe(25);
    });
  });
});
