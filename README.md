# 💰 Monie Utils

A comprehensive TypeScript library for money-related utilities including currency formatting, conversion, validation, and financial calculations.

[![npm version](https://badge.fury.io/js/monie-utils.svg)](https://badge.fury.io/js/monie-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## ✨ Features

- 🎯 **Type-safe** - Built with TypeScript for excellent developer experience
- 🌍 **International** - Support for multiple currencies and locales
- 💱 **Currency operations** - Formatting, conversion, and validation
- 🧮 **Financial calculations** - Interest, loans, investments, and more
- 📊 **Business utilities** - Payment processing, subscriptions, analytics
- 🚀 **Lightweight** - Tree-shakeable with zero dependencies
- ✅ **Well-tested** - Comprehensive test coverage
- 📚 **Well-documented** - Extensive documentation and examples

## 🚀 Installation

```bash
npm install monie-utils
```

```bash
yarn add monie-utils
```

```bash
pnpm add monie-utils
```

## 📖 Quick Start

```typescript
import { 
  isValidAmount, 
  isValidCurrency, 
  validateMoneyObject 
} from 'monie-utils';

// Validate amounts
console.log(isValidAmount(100.50)); // true
console.log(isValidAmount(NaN)); // false

// Validate currencies
console.log(isValidCurrency('USD')); // true
console.log(isValidCurrency('BTC')); // true
console.log(isValidCurrency('INVALID')); // false

// Validate money objects
const money = { amount: 100, currency: 'USD' };
console.log(validateMoneyObject(money)); // true
```


## 📚 API Reference

### Validation Functions

#### `isValidAmount(amount: unknown): amount is number`
Checks if a value is a valid money amount.

#### `isValidCurrency(currencyCode: unknown): currencyCode is string`
Validates currency codes against ISO 4217 and common cryptocurrencies.

#### `validateMoneyObject(moneyObject: unknown): moneyObject is Money`
Validates a complete money object structure.

#### `isPositiveAmount(amount: number): boolean`
Checks if an amount is positive.

#### `isWithinRange(amount: number, min: number, max: number): boolean`
Checks if an amount is within a specified range.

#### `normalizeAmount(amount: number): number`
Normalizes amount to ensure proper precision for money calculations.

### Currency Functions

#### `isCryptoCurrency(currencyCode: string): boolean`
Checks if a currency is a cryptocurrency.

#### `isFiatCurrency(currencyCode: string): boolean`
Checks if a currency is a fiat currency.

## 🧪 Development

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/spiderocious/monie-utils.git
cd monie-utils

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the library
npm run build

# Lint and format
npm run lint
npm run format
```

### Scripts

- `npm run dev` - Start development server with Vite
- `npm run build` - Build the library with tsup
- `npm test` - Run tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Lint code with ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking


## 🙏 Acknowledgments

- Inspired by financial libraries from Stripe, PayStack, Monnify, and other payment processors
- Built with modern TypeScript and development tools
- Thanks to all contributors and the open-source community

---

Made with ❤️ by Oluwaferanmi (https://github.com/spiderocious)
