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

## 🏗️ Project Status

This library is currently in active development. The following features are planned:

### ✅ Phase 1 (Current)
- [x] Project setup and configuration
- [x] TypeScript interfaces and types
- [x] Basic validation utilities
- [x] Error handling
- [x] Testing infrastructure

### 🚧 Phase 2 (Next)
- [ ] Currency formatting functions
- [ ] Basic arithmetic operations
- [ ] Money object utilities
- [ ] Parsing utilities

### 📋 Phase 3 (Planned)
- [ ] Currency conversion utilities
- [ ] Payment processing calculations
- [ ] Loan and interest calculations
- [ ] Investment utilities

### 🎯 Phase 4 (Future)
- [ ] International finance utilities
- [ ] Business finance calculations
- [ ] Analytics and reporting
- [ ] Advanced formatting options

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
git clone https://github.com/yourusername/monie-utils.git
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

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by financial libraries from Stripe, PayStack, Moniepoint, and other payment processors
- Built with modern TypeScript and development tools
- Thanks to all contributors and the open-source community

## 📞 Support

- 📧 Email: [your-email@example.com](mailto:your-email@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/monie-utils/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/monie-utils/discussions)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
