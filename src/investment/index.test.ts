/**
 * @fileoverview Tests for investment and returns utilities
 */

import {
  calculateROI,
  calculateAnnualizedReturn,
  calculateDividendYield,
  calculateFutureValue,
} from './index';
import { MonieUtilsError } from '../errors';

describe('investment and returns utilities', () => {
  describe('ROI calculations', () => {
    it('should calculate positive ROI correctly', () => {
      const result = calculateROI(1000, 1250);
      expect(result.roiPercentage).toBe(25);
      expect(result.gainLoss).toBe(250);
      expect(result.isGain).toBe(true);
    });

    it('should calculate negative ROI correctly', () => {
      const result = calculateROI(1000, 800);
      expect(result.roiPercentage).toBe(-20);
      expect(result.gainLoss).toBe(-200);
      expect(result.isGain).toBe(false);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateROI(0, 1000)).toThrow(MonieUtilsError);
      expect(() => calculateROI(-1000, 1000)).toThrow(MonieUtilsError);
      expect(() => calculateROI(NaN, 1000)).toThrow(MonieUtilsError);
    });
  });

  describe('annualized return calculations', () => {
    it('should calculate annualized return correctly', () => {
      const result = calculateAnnualizedReturn(1000, 1500, 3);
      expect(result.totalReturnPercentage).toBe(50);
      expect(result.annualizedReturnPercentage).toBeCloseTo(14.47, 1);
    });

    it('should handle same initial and final values', () => {
      const result = calculateAnnualizedReturn(1000, 1000, 5);
      expect(result.totalReturnPercentage).toBe(0);
      expect(result.annualizedReturnPercentage).toBe(0);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateAnnualizedReturn(0, 1000, 5)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateAnnualizedReturn(1000, 1500, 0)).toThrow(
        MonieUtilsError
      );
    });
  });

  describe('dividend yield calculations', () => {
    it('should calculate dividend yield correctly', () => {
      const result = calculateDividendYield(2.5, 50);
      expect(result.yieldPercentage).toBe(5);
      expect(result.dividendPerShare).toBe(2.5);
      expect(result.sharePrice).toBe(50);
    });

    it('should handle zero dividend', () => {
      const result = calculateDividendYield(0, 100);
      expect(result.yieldPercentage).toBe(0);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateDividendYield(-1, 50)).toThrow(MonieUtilsError);
      expect(() => calculateDividendYield(2.5, 0)).toThrow(MonieUtilsError);
    });
  });

  describe('future value calculations', () => {
    it('should calculate future value correctly', () => {
      const result = calculateFutureValue(1000, 0.05, 10);
      expect(result.futureValue).toBeCloseTo(1628.89, 1);
      expect(result.totalInterest).toBeCloseTo(628.89, 1);
    });

    it('should handle zero interest rate', () => {
      const result = calculateFutureValue(1000, 0, 10);
      expect(result.futureValue).toBe(1000);
      expect(result.totalInterest).toBe(0);
    });

    it('should throw error for invalid inputs', () => {
      expect(() => calculateFutureValue(0, 0.05, 10)).toThrow(MonieUtilsError);
      expect(() => calculateFutureValue(1000, -0.05, 10)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateFutureValue(1000, 0.05, -1)).toThrow(
        MonieUtilsError
      );
      expect(() => calculateFutureValue(1000, 0.05, 5.5)).toThrow(
        MonieUtilsError
      );
    });
  });
});
