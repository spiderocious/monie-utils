/**
 * Tests for currency formatting utilities
 */

import {
  formatCurrency,
  formatMoney,
  formatCents,
  formatCompactCurrency,
  CURRENCY_INFO,
} from './index';

describe('formatCurrency', () => {
  describe('basic functionality', () => {
    it('should format USD currency correctly', () => {
      const result = formatCurrency(1234.56, 'USD');

      expect(result.formatted).toBe('$1,234.56');
      expect(result.amount).toBe(1234.56);
      expect(result.currency).toBe('USD');
      expect(result.locale).toBe('en-US');
      expect(result.isCompact).toBe(false);
    });

    it('should format EUR currency correctly', () => {
      const result = formatCurrency(1234.56, 'EUR');

      expect(result.formatted).toBe('€1,234.56');
      expect(result.currency).toBe('EUR');
    });

    it('should format JPY currency correctly (no decimals)', () => {
      const result = formatCurrency(1234, 'JPY');

      expect(result.formatted).toBe('¥1,234');
      expect(result.currency).toBe('JPY');
    });

    it('should format NGN currency correctly', () => {
      const result = formatCurrency(1234.56, 'NGN');

      expect(result.formatted).toBe('₦1,234.56');
      expect(result.currency).toBe('NGN');
    });

    it('should handle case insensitive currency codes', () => {
      const result = formatCurrency(100, 'usd');
      expect(result.currency).toBe('USD');
      expect(result.formatted).toBe('$100.00');
    });
  });

  describe('input validation', () => {
    it('should throw error for invalid amounts', () => {
      expect(() => formatCurrency(NaN, 'USD')).toThrow('Invalid amount');
      expect(() => formatCurrency(Infinity, 'USD')).toThrow('Invalid amount');
      expect(() => formatCurrency(-Infinity, 'USD')).toThrow('Invalid amount');
    });

    it('should throw error for unsupported currencies', () => {
      expect(() => formatCurrency(100, 'INVALID')).toThrow(
        'Unsupported currency'
      );
      expect(() => formatCurrency(100, 'XXX')).toThrow('Unsupported currency');
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-1234.56, 'USD');
      expect(result.formatted).toBe('-$1,234.56');
    });

    it('should handle zero amounts', () => {
      const result = formatCurrency(0, 'USD');
      expect(result.formatted).toBe('$0.00');
    });
  });

  describe('formatting options', () => {
    it('should respect locale option', () => {
      const result = formatCurrency(1234.56, 'EUR', { locale: 'de-DE' });
      // German locale uses period for thousands and comma for decimals
      expect(result.locale).toBe('de-DE');
      expect(result.formatted).toContain('1.234,56');
    });

    it('should show currency code when requested', () => {
      const result = formatCurrency(1234.56, 'USD', { showCode: true });
      expect(result.formatted).toContain('USD');
      expect(result.formatted).not.toContain('$');
    });

    it('should hide symbol when requested', () => {
      const result = formatCurrency(1234.56, 'USD', { showSymbol: false });
      expect(result.formatted).not.toContain('$');
      expect(result.formatted).toBe('1,234.56');
    });

    it('should use custom decimal places', () => {
      const result = formatCurrency(1234.5, 'USD', { decimalPlaces: 3 });
      expect(result.formatted).toBe('$1,234.500');
    });

    it('should disable grouping when requested', () => {
      const result = formatCurrency(1234.56, 'USD', { useGrouping: false });
      expect(result.formatted).toBe('$1234.56');
    });

    it('should use custom symbol', () => {
      const result = formatCurrency(1234.56, 'USD', { customSymbol: 'US$' });
      expect(result.formatted).toBe('US$1,234.56');
    });

    it('should position symbol at end when requested', () => {
      const result = formatCurrency(1234.56, 'USD', { symbolPosition: 'end' });
      expect(result.formatted).toBe('1,234.56$');
    });
  });

  describe('compact formatting', () => {
    it('should format thousands in compact notation', () => {
      const result = formatCurrency(1500, 'USD', { compact: true });
      expect(result.formatted).toBe('$1.5K');
      expect(result.isCompact).toBe(true);
    });

    it('should format millions in compact notation', () => {
      const result = formatCurrency(2500000, 'USD', { compact: true });
      expect(result.formatted).toBe('$2.5M');
      expect(result.isCompact).toBe(true);
    });

    it('should format billions in compact notation', () => {
      const result = formatCurrency(3200000000, 'USD', { compact: true });
      expect(result.formatted).toBe('$3.2B');
      expect(result.isCompact).toBe(true);
    });

    it('should format trillions in compact notation', () => {
      const result = formatCurrency(1500000000000, 'USD', { compact: true });
      expect(result.formatted).toBe('$1.5T');
      expect(result.isCompact).toBe(true);
    });

    it('should handle negative compact numbers', () => {
      const result = formatCurrency(-1500000, 'USD', { compact: true });
      expect(result.formatted).toBe('-$1.5M');
    });

    it('should format small numbers normally in compact mode', () => {
      const result = formatCurrency(500, 'USD', { compact: true });
      expect(result.formatted).toBe('$500.0');
    });
  });

  describe('cryptocurrency formatting', () => {
    it('should format Bitcoin correctly', () => {
      const result = formatCurrency(0.12345678, 'BTC');
      expect(result.currency).toBe('BTC');
      expect(result.formatted).toContain('₿');
      expect(result.formatted).toContain('0.12345678');
    });

    it('should format Ethereum correctly', () => {
      const result = formatCurrency(1.23456789, 'ETH');
      expect(result.currency).toBe('ETH');
      expect(result.formatted).toContain('Ξ');
    });
  });
});

describe('formatMoney', () => {
  it('should return formatted string directly', () => {
    const result = formatMoney(1234.56, 'USD');
    expect(typeof result).toBe('string');
    expect(result).toBe('$1,234.56');
  });

  it('should accept locale parameter', () => {
    const result = formatMoney(1234.56, 'EUR', 'de-DE');
    expect(result).toContain('1.234,56');
  });

  it('should work without locale parameter', () => {
    const result = formatMoney(1234.56, 'USD');
    expect(result).toBe('$1,234.56');
  });
});

describe('formatCents', () => {
  describe('basic functionality', () => {
    it('should convert USD cents to dollars', () => {
      const result = formatCents(12345, 'USD');
      expect(result.formatted).toBe('$123.45');
      expect(result.amount).toBe(123.45);
    });

    it('should handle JPY (no decimal conversion)', () => {
      const result = formatCents(1234, 'JPY');
      expect(result.formatted).toBe('¥1,234');
      expect(result.amount).toBe(1234);
    });

    it('should handle EUR cents', () => {
      const result = formatCents(9999, 'EUR');
      expect(result.formatted).toBe('€99.99');
      expect(result.amount).toBe(99.99);
    });

    it('should handle cryptocurrency satoshis', () => {
      const result = formatCents(12345678, 'BTC'); // 0.12345678 BTC
      expect(result.amount).toBe(0.12345678);
      expect(result.formatted).toContain('₿');
    });
  });

  describe('input validation', () => {
    it('should throw error for invalid cent amounts', () => {
      expect(() => formatCents(NaN, 'USD')).toThrow('Invalid cents amount');
      expect(() => formatCents(Infinity, 'USD')).toThrow(
        'Invalid cents amount'
      );
    });

    it('should throw error for unsupported currencies', () => {
      expect(() => formatCents(1234, 'INVALID')).toThrow(
        'Unsupported currency'
      );
    });
  });

  describe('with options', () => {
    it('should respect formatting options', () => {
      const result = formatCents(12345, 'USD', { showCode: true });
      expect(result.formatted).toContain('USD');
    });

    it('should work with compact notation', () => {
      const result = formatCents(150000000, 'USD', { compact: true }); // $1.5M
      expect(result.formatted).toBe('$1.5M');
      expect(result.isCompact).toBe(true);
    });
  });
});

describe('formatCompactCurrency', () => {
  it('should force compact notation', () => {
    const result = formatCompactCurrency(1500000, 'USD');
    expect(result.formatted).toBe('$1.5M');
    expect(result.isCompact).toBe(true);
  });

  it('should override compact option', () => {
    const result = formatCompactCurrency(1500000, 'USD', { compact: false });
    expect(result.formatted).toBe('$1.5M');
    expect(result.isCompact).toBe(true);
  });

  it('should respect other options', () => {
    const result = formatCompactCurrency(1500000, 'USD', { showCode: true });
    expect(result.formatted).toBe('USD 1.5M');
  });
});

describe('edge cases and error handling', () => {
  it('should handle very large numbers', () => {
    const result = formatCurrency(Number.MAX_SAFE_INTEGER, 'USD');
    expect(result.formatted).toBeDefined();
    expect(typeof result.formatted).toBe('string');
  });

  it('should handle very small numbers', () => {
    const result = formatCurrency(0.01, 'USD');
    expect(result.formatted).toBe('$0.01');
  });

  it('should handle numbers with many decimal places', () => {
    const result = formatCurrency(1.123456789, 'USD');
    expect(result.formatted).toBe('$1.12'); // Rounded to 2 decimal places
  });

  it('should maintain precision for cryptocurrencies', () => {
    const result = formatCurrency(0.12345678, 'BTC');
    expect(result.formatted).toContain('0.12345678');
  });
});

describe('currency info constants', () => {
  it('should have correct USD info', () => {
    expect(CURRENCY_INFO.USD).toEqual({
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      decimalPlaces: 2,
      usesGrouping: true,
    });
  });

  it('should have correct JPY info', () => {
    expect(CURRENCY_INFO.JPY).toEqual({
      code: 'JPY',
      symbol: '¥',
      name: 'Japanese Yen',
      decimalPlaces: 0,
      usesGrouping: true,
    });
  });

  it('should have correct BTC info', () => {
    expect(CURRENCY_INFO.BTC).toEqual({
      code: 'BTC',
      symbol: '₿',
      name: 'Bitcoin',
      decimalPlaces: 8,
      usesGrouping: true,
    });
  });
});
