/**
 * Tests for localization utilities
 */

import { 
  formatCurrencyByLocale, 
  getLocaleCurrencyInfo, 
  formatWithGrouping, 
  formatDecimalPlaces 
} from './localization';
import { MonieUtilsError } from '../errors';

describe('localization utilities', () => {
  describe('formatCurrencyByLocale', () => {
    it('should format currency with US locale', () => {
      const result = formatCurrencyByLocale(1234.56, 'USD', 'en-US');
      expect(result).toBe('$1,234.56');
    });

    it('should format currency with German locale', () => {
      const result = formatCurrencyByLocale(1234.56, 'EUR', 'de-DE');
      expect(result).toContain('1.234,56');
    });

    it('should throw error for invalid amount', () => {
      expect(() => formatCurrencyByLocale(NaN, 'USD', 'en-US')).toThrow(MonieUtilsError);
    });
  });

  describe('getLocaleCurrencyInfo', () => {
    it('should return USD info for en-US', () => {
      const info = getLocaleCurrencyInfo('en-US');
      expect(info.currency).toBe('USD');
      expect(info.symbol).toBe('$');
      expect(info.decimalPlaces).toBe(2);
    });

    it('should throw error for unsupported locale', () => {
      expect(() => getLocaleCurrencyInfo('xx-XX')).toThrow(MonieUtilsError);
    });
  });

  describe('formatWithGrouping', () => {
    it('should add thousand separators', () => {
      const result = formatWithGrouping(1234567.89);
      expect(result.formatted).toBe('1,234,567.89');
      expect(result.hasGrouping).toBe(true);
    });

    it('should throw error for invalid amount', () => {
      expect(() => formatWithGrouping(Infinity)).toThrow(MonieUtilsError);
    });
  });

  describe('formatDecimalPlaces', () => {
    it('should format with specified decimal places', () => {
      const result = formatDecimalPlaces(123.456789, 2);
      expect(result.formatted).toBe('123.46');
      expect(result.decimalPlaces).toBe(2);
    });

    it('should throw error for negative decimal places', () => {
      expect(() => formatDecimalPlaces(123, -1)).toThrow(MonieUtilsError);
    });
  });
});
