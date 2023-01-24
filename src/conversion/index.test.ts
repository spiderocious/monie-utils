/**
 * Tests for currency conversion utilities
 */

import { convertCurrency, convertWithFee, bulkConvert } from './conversion';
import { MonieUtilsError } from '../errors';

describe('currency conversion', () => {
  describe('convertCurrency', () => {
    it('should convert between same currencies', () => {
      const result = convertCurrency(100, 'USD', 'USD');
      expect(result.convertedAmount).toBe(100);
      expect(result.exchangeRate).toBe(1);
    });

    it('should convert with custom rate', () => {
      const result = convertCurrency(100, 'USD', 'EUR', 0.85);
      expect(result.convertedAmount).toBe(85);
      expect(result.exchangeRate).toBe(0.85);
    });

    it('should throw for invalid amounts', () => {
      expect(() => convertCurrency(NaN, 'USD', 'EUR')).toThrow(MonieUtilsError);
    });
  });

  describe('convertWithFee', () => {
    it('should apply fee correctly', () => {
      const result = convertWithFee(100, 0.85, 2.5);
      expect(result.feeAmount).toBe(2.5);
      expect(result.amountAfterFee).toBe(97.5);
      expect(result.convertedAmount).toBe(82.875); // 97.5 * 0.85
    });

    it('should throw for invalid fee percentage', () => {
      expect(() => convertWithFee(100, 0.85, -1)).toThrow(MonieUtilsError);
      expect(() => convertWithFee(100, 0.85, 101)).toThrow(MonieUtilsError);
    });
  });

  describe('bulkConvert', () => {
    it('should convert multiple amounts', () => {
      const result = bulkConvert([100, 200], 'USD', 'EUR', 0.85);
      expect(result.conversions).toHaveLength(2);
      expect(result.totalOriginalAmount).toBe(300);
      expect(result.totalConvertedAmount).toBe(255); // 300 * 0.85
    });

    it('should throw for empty array', () => {
      expect(() => bulkConvert([], 'USD', 'EUR')).toThrow(MonieUtilsError);
    });
  });
});
