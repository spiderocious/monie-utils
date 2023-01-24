/**
 * Tests for formatPercentage utility
 */

import { formatPercentage } from './formatPercentage';
import { MonieUtilsError } from '../errors';

describe('formatPercentage', () => {
  describe('basic functionality', () => {
    it('should format basic decimal to percentage', () => {
      const result = formatPercentage(0.25);
      expect(result.formatted).toBe('25.00%');
      expect(result.decimal).toBe(0.25);
      expect(result.percentage).toBe(25);
    });

    it('should handle zero', () => {
      const result = formatPercentage(0);
      expect(result.formatted).toBe('0.00%');
    });

    it('should handle negative percentages', () => {
      const result = formatPercentage(-0.15);
      expect(result.formatted).toBe('-15.00%');
    });
  });

  describe('input validation', () => {
    it('should throw error for invalid decimals', () => {
      expect(() => formatPercentage(NaN)).toThrow(MonieUtilsError);
      expect(() => formatPercentage(Infinity)).toThrow(MonieUtilsError);
    });
  });

  describe('formatting options', () => {
    it('should respect precision option', () => {
      const result = formatPercentage(0.1234, { precision: 1 });
      expect(result.formatted).toBe('12.3%');
      expect(result.precision).toBe(1);
    });

    it('should respect locale option', () => {
      const result = formatPercentage(0.1234, { locale: 'de-DE' });
      expect(result.formatted).toBe('12,34%'); // German formatting
      expect(result.locale).toBe('de-DE');
    });

    it('should use custom suffix', () => {
      const result = formatPercentage(0.25, { suffix: ' percent' });
      expect(result.formatted).toBe('25.00 percent');
    });

    it('should add space before suffix', () => {
      const result = formatPercentage(0.25, { spaceBefore: true });
      expect(result.formatted).toBe('25.00 %');
    });
  });
});
