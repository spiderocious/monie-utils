/**
 * @fileoverview Tests for utility functions
 */

import {
  roundToNearestCent,
  roundToBankersRounding,
  truncateToDecimalPlaces,
  ceilToNearestCent,
  formatThousands,
  formatToHundreds,
  removeFormattingFromNumber,
  convertToWords,
  formatAccountNumber,
} from './index';
import { MonieUtilsError } from '../errors';

describe('utility functions', () => {
  describe('rounding and precision', () => {
    describe('roundToNearestCent', () => {
      it('should round to nearest cent correctly', () => {
        expect(roundToNearestCent(123.456)).toBe(123.46);
        expect(roundToNearestCent(123.454)).toBe(123.45);
        expect(roundToNearestCent(123.455)).toBe(123.46);
        expect(roundToNearestCent(123.0)).toBe(123.0);
      });

      it('should handle negative numbers', () => {
        expect(roundToNearestCent(-123.456)).toBe(-123.46);
        expect(roundToNearestCent(-123.454)).toBe(-123.45);
      });

      it('should throw error for invalid input', () => {
        expect(() => roundToNearestCent(NaN)).toThrow(MonieUtilsError);
        expect(() => roundToNearestCent(Infinity)).toThrow(MonieUtilsError);
      });
    });

    describe('roundToBankersRounding', () => {
      it("should apply banker's rounding correctly", () => {
        expect(roundToBankersRounding(2.125, 2)).toBe(2.12);
        expect(roundToBankersRounding(2.135, 2)).toBe(2.14);
        expect(roundToBankersRounding(2.145, 2)).toBe(2.14);
        expect(roundToBankersRounding(2.155, 2)).toBe(2.16);
      });

      it('should handle different decimal places', () => {
        expect(roundToBankersRounding(123.456, 1)).toBe(123.5);
      });

      it('should throw error for invalid inputs', () => {
        expect(() => roundToBankersRounding(NaN, 2)).toThrow(MonieUtilsError);
        expect(() => roundToBankersRounding(123.45, -1)).toThrow(
          MonieUtilsError
        );
        expect(() => roundToBankersRounding(123.45, 1.5)).toThrow(
          MonieUtilsError
        );
      });
    });

    describe('truncateToDecimalPlaces', () => {
      it('should truncate without rounding', () => {
        expect(truncateToDecimalPlaces(123.456, 2)).toBe(123.45);
        expect(truncateToDecimalPlaces(123.999, 2)).toBe(123.99);
        expect(truncateToDecimalPlaces(123.999, 1)).toBe(123.9);
        expect(truncateToDecimalPlaces(123.999, 0)).toBe(123);
      });

      it('should handle negative numbers', () => {
        expect(truncateToDecimalPlaces(-123.456, 2)).toBe(-123.45);
        expect(truncateToDecimalPlaces(-123.999, 1)).toBe(-123.9);
      });

      it('should throw error for invalid inputs', () => {
        expect(() => truncateToDecimalPlaces(NaN, 2)).toThrow(MonieUtilsError);
        expect(() => truncateToDecimalPlaces(123.45, -1)).toThrow(
          MonieUtilsError
        );
      });
    });

    describe('ceilToNearestCent', () => {
      it('should ceil to nearest cent', () => {
        expect(ceilToNearestCent(123.451)).toBe(123.46);
        expect(ceilToNearestCent(123.401)).toBe(123.41);
        expect(ceilToNearestCent(123.0)).toBe(123.0);
      });

      it('should handle negative numbers', () => {
        expect(ceilToNearestCent(-123.451)).toBe(-123.45);
        expect(ceilToNearestCent(-123.401)).toBe(-123.4);
      });

      it('should throw error for invalid input', () => {
        expect(() => ceilToNearestCent(NaN)).toThrow(MonieUtilsError);
      });
    });
  });

  describe('formatting helpers', () => {
    describe('formatThousands', () => {
      it('should add thousand separators', () => {
        expect(formatThousands(1234567.89)).toBe('1,234,567.89');
        expect(formatThousands(1234567)).toBe('1,234,567');
        expect(formatThousands(123)).toBe('123');
      });

      it('should handle custom separators', () => {
        expect(formatThousands(1234567, { separator: ' ' })).toBe('1 234 567');
        expect(formatThousands(1234567, { separator: '.' })).toBe('1.234.567');
      });

      it('should handle decimal options', () => {
        expect(formatThousands(1234.5, { includeDecimals: false })).toBe(
          '1,235'
        );
        expect(formatThousands(1234.567, { decimalPlaces: 1 })).toBe('1,234.6');
      });

      it('should throw error for invalid input', () => {
        expect(() => formatThousands(NaN)).toThrow(MonieUtilsError);
      });
    });

    describe('formatToHundreds', () => {
      it('should format cents to dollars', () => {
        expect(formatToHundreds(12345)).toBe('123.45');
        expect(formatToHundreds(100000)).toBe('1,000.00');
        expect(formatToHundreds(50)).toBe('0.50');
      });

      it('should handle custom separators', () => {
        expect(formatToHundreds(123456, { separator: ' ' })).toBe('1 234.56');
      });

      it('should throw error for invalid input', () => {
        expect(() => formatToHundreds(NaN)).toThrow(MonieUtilsError);
      });
    });

    describe('removeFormattingFromNumber', () => {
      it('should remove formatting characters', () => {
        expect(removeFormattingFromNumber('1,234,567.89')).toBe('1234567.89');
        expect(removeFormattingFromNumber('$1,234.56')).toBe('1234.56');
        expect(removeFormattingFromNumber('1 234 567.89')).toBe('1234567.89');
        expect(removeFormattingFromNumber('-$1,234.56')).toBe('-1234.56');
      });

      it('should handle already clean numbers', () => {
        expect(removeFormattingFromNumber('1234.56')).toBe('1234.56');
        expect(removeFormattingFromNumber('123')).toBe('123');
      });

      it('should throw error for invalid inputs', () => {
        expect(() => removeFormattingFromNumber('')).toThrow(MonieUtilsError);
        expect(() => removeFormattingFromNumber('abc')).toThrow(
          MonieUtilsError
        );
        expect(() => removeFormattingFromNumber('$$$')).toThrow(
          MonieUtilsError
        );
      });
    });

    describe('convertToWords', () => {
      it('should convert simple numbers', () => {
        expect(convertToWords(0).words).toBe('zero');
        expect(convertToWords(1).words).toBe('one');
        expect(convertToWords(15).words).toBe('fifteen');
        expect(convertToWords(25).words).toBe('twenty-five');
        expect(convertToWords(100).words).toBe('one hundred');
      });

      it('should convert complex numbers', () => {
        expect(convertToWords(123).words).toBe('one hundred twenty-three');
        expect(convertToWords(1234).words).toBe(
          'one thousand two hundred thirty-four'
        );
        expect(convertToWords(1000000).words).toBe('one million');
      });

      it('should handle decimals', () => {
        expect(convertToWords(123.45).words).toBe(
          'one hundred twenty-three and forty-five'
        );
        expect(convertToWords(100.01).words).toBe('one hundred and one');
      });

      it('should handle currency', () => {
        expect(convertToWords(123, 'USD').words).toBe(
          'one hundred twenty-three usd'
        );
        expect(convertToWords(123.45, 'USD').words).toBe(
          'one hundred twenty-three and forty-five usd cents'
        );
      });

      it('should handle negative numbers', () => {
        expect(convertToWords(-123).words).toBe(
          'negative one hundred twenty-three'
        );
        expect(convertToWords(-123.45).words).toBe(
          'negative one hundred twenty-three and forty-five'
        );
      });

      it('should throw error for invalid inputs', () => {
        expect(() => convertToWords(NaN)).toThrow(MonieUtilsError);
        expect(() => convertToWords(1000000000000)).toThrow(MonieUtilsError);
      });
    });

    describe('formatAccountNumber', () => {
      it('should format with default masking', () => {
        const result = formatAccountNumber('1234567890123456');
        expect(result.formatted).toBe('1234 **** **** 3456');
        expect(result.isMasked).toBe(true);
        expect(result.maskedCharacters).toBe(8);
      });

      it('should handle custom masking options', () => {
        const result = formatAccountNumber('1234567890', {
          showFirst: 2,
          showLast: 2,
          maskChar: 'X',
        });
        expect(result.formatted).toBe('12XX XXXX 90');
        expect(result.maskedCharacters).toBe(6);
      });

      it('should format without masking', () => {
        const result = formatAccountNumber('1234567890123456', {
          applyMask: false,
        });
        expect(result.formatted).toBe('1234 5678 9012 3456');
        expect(result.isMasked).toBe(false);
        expect(result.maskedCharacters).toBe(0);
      });

      it('should handle custom separators and group sizes', () => {
        const result = formatAccountNumber('123456789012', {
          separator: '-',
          groupSize: 3,
          applyMask: false,
        });
        expect(result.formatted).toBe('123-456-789-012');
      });

      it('should throw error for invalid inputs', () => {
        expect(() => formatAccountNumber('')).toThrow(MonieUtilsError);
        expect(() => formatAccountNumber('123abc456')).toThrow(MonieUtilsError);
        expect(() => formatAccountNumber('123', { showFirst: -1 })).toThrow(
          MonieUtilsError
        );
        expect(() => formatAccountNumber('123', { groupSize: 0 })).toThrow(
          MonieUtilsError
        );
      });
    });
  });
});
