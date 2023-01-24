/**
 * Example usage of monie-utils formatCurrency utilities
 */

import { 
  formatCurrency,
  formatMoney,
  formatCents,
  formatCompactCurrency,
  LIBRARY_INFO
} from '../src/index';

console.log('🚀 Monie Utils - Currency Formatting Example\n');
console.log(`Library: ${LIBRARY_INFO.name} v${LIBRARY_INFO.version}`);
console.log(`Description: ${LIBRARY_INFO.description}\n`);

// Basic currency formatting
console.log('💰 Basic Currency Formatting:');
console.log(`formatCurrency(1234.56, 'USD'):`, formatCurrency(1234.56, 'USD').formatted);
console.log(`formatCurrency(1234.56, 'EUR'):`, formatCurrency(1234.56, 'EUR').formatted);
console.log(`formatCurrency(1234, 'JPY'):`, formatCurrency(1234, 'JPY').formatted);
console.log(`formatCurrency(1234.56, 'NGN'):`, formatCurrency(1234.56, 'NGN').formatted);

// Simple formatting
console.log('\n🎯 Simple Money Formatting:');
console.log(`formatMoney(1234.56, 'USD'):`, formatMoney(1234.56, 'USD'));
console.log(`formatMoney(1234.56, 'EUR', 'de-DE'):`, formatMoney(1234.56, 'EUR', 'de-DE'));

// Negative numbers
console.log('\n➖ Negative Number Formatting:');
console.log(`formatCurrency(-1234.56, 'USD'):`, formatCurrency(-1234.56, 'USD').formatted);
console.log(`formatCompactCurrency(-1500000, 'USD'):`, formatCompactCurrency(-1500000, 'USD').formatted);

// Compact notation
console.log('\n📊 Compact Notation:');
console.log(`formatCompactCurrency(1500, 'USD'):`, formatCompactCurrency(1500, 'USD').formatted);
console.log(`formatCompactCurrency(1500000, 'USD'):`, formatCompactCurrency(1500000, 'USD').formatted);
console.log(`formatCompactCurrency(2300000000, 'EUR'):`, formatCompactCurrency(2300000000, 'EUR').formatted);
console.log(`formatCompactCurrency(1500000000000, 'USD'):`, formatCompactCurrency(1500000000000, 'USD').formatted);

// Cents formatting
console.log('\n🪙 Cents/Smallest Unit Formatting:');
console.log(`formatCents(12345, 'USD'):`, formatCents(12345, 'USD').formatted);
console.log(`formatCents(9999, 'EUR'):`, formatCents(9999, 'EUR').formatted);
console.log(`formatCents(1234, 'JPY'):`, formatCents(1234, 'JPY').formatted);
console.log(`formatCents(12345678, 'BTC'):`, formatCents(12345678, 'BTC').formatted);

// Custom options
console.log('\n⚙️ Custom Formatting Options:');
console.log(`Show code instead of symbol:`, formatCurrency(1234.56, 'USD', { showCode: true }).formatted);
console.log(`Hide symbol:`, formatCurrency(1234.56, 'USD', { showSymbol: false }).formatted);
console.log(`Custom symbol:`, formatCurrency(1234.56, 'USD', { customSymbol: 'US$' }).formatted);
console.log(`Symbol at end:`, formatCurrency(1234.56, 'USD', { symbolPosition: 'end' }).formatted);
console.log(`No grouping:`, formatCurrency(1234.56, 'USD', { useGrouping: false }).formatted);
console.log(`Custom decimals:`, formatCurrency(1234.5, 'USD', { decimalPlaces: 3 }).formatted);

// Cryptocurrency
console.log('\n🔗 Cryptocurrency Formatting:');
console.log(`formatCurrency(0.12345678, 'BTC'):`, formatCurrency(0.12345678, 'BTC').formatted);
console.log(`formatCurrency(1.23456789, 'ETH'):`, formatCurrency(1.23456789, 'ETH').formatted);
console.log(`formatCompactCurrency(150000000, 'BTC'):`, formatCompactCurrency(150000000, 'BTC').formatted);

console.log('\n✨ All examples completed successfully!');
