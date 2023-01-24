/**
 * Tests for validation and parsing utilities
 */

import {
  isValidAmount,
  isValidCurrency,
  validateMoneyObject,
  isPositiveAmount,
  isWithinRange,
  parseAmount,
  parseCurrencyString,
  normalizeAmount,
  parseFormattedCurrency,
} from './validation';
import { MonieUtilsError } from '../errors';

describe('validation and parsing', () => {
  describe('isValidAmount', () => {
    it('should validate valid amounts', () => {
      expect(isValidAmount(123.45)).toBe(true);
      expect(isValidAmount(0)).toBe(true);
      expect(isValidAmount(-100)).toBe(true);
    });

    it('should reject invalid amounts', () => {
      expect(isValidAmount(NaN)).toBe(false);
      expect(isValidAmount(Infinity)).toBe(false);
      expect(isValidAmount('123')).toBe(false);
    });
  });

  describe('validateMoneyObject', () => {
    it('should validate correct money objects', () => {
      expect(validateMoneyObject({ amount: 100, currency: 'USD' })).toBe(true);
    });

    it('should reject invalid objects', () => {
      expect(validateMoneyObject({ amount: 'invalid', currency: 'USD' })).toBe(false);
      expect(validateMoneyObject(null)).toBe(false);
    });
  });

  describe('parseAmount', () => {
    it('should parse simple numbers', () => {
      const result = parseAmount('123.45');
      expect(result.amount).toBe(123.45);
      expect(result.isValid).toBe(true);
    });

    it('should parse formatted strings', () => {
      const result = parseAmount('$1,234.56');
      expect(result.amount).toBe(1234.56);
      expect(result.isValid).toBe(true);
    });
  });

  describe('normalizeAmount', () => {
    it('should normalize to 2 decimal places by default', () => {
      expect(normalizeAmount(123.456789)).toBe(123.46);
    });

    it('should throw for invalid amounts', () => {
      expect(() => normalizeAmount(NaN)).toThrow(MonieUtilsError);
    });
  });
});
