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
} from 'monie-utils';

// Validate amounts
console.log(isValidAmount(100.50)); // true
console.log(isValidAmount(NaN)); // false

// Validate currencies
console.log(isValidCurrency('USD')); // true
console.log(isValidCurrency('BTC')); // true
console.log(isValidCurrency('INVALID')); // false

```


## 📚 API Reference

### Currency Formatting

#### `formatCurrency(amount: number, currency: string, options?: FormatCurrencyOptions): FormattedCurrency`
Formats a currency amount with locale-specific formatting.

```typescript
formatCurrency(1234.56, 'USD')
// Returns: { formatted: '$1,234.56', amount: 1234.56, currency: 'USD', locale: 'en-US', isCompact: false }

formatCurrency(1234.56, 'EUR', { locale: 'de-DE', showCode: true })
// Returns: { formatted: '1.234,56 EUR', amount: 1234.56, currency: 'EUR', locale: 'de-DE', isCompact: false }
```

#### `formatMoney(amount: number, currency: string, locale?: string): string`
Simple string formatting for currency amounts.

```typescript
formatMoney(1234.56, 'USD')
// Returns: '$1,234.56'

formatMoney(1234.56, 'EUR', 'de-DE')
// Returns: '1.234,56 €'
```

#### `formatCents(cents: number, currency: string, options?: FormatCurrencyOptions): FormattedCurrency`
Formats amounts from smallest currency unit (cents/satoshis).

```typescript
formatCents(12345, 'USD')
// Returns: { formatted: '$123.45', amount: 123.45, currency: 'USD', locale: 'en-US', isCompact: false }

formatCents(10000000, 'BTC')
// Returns: { formatted: '₿0.10000000', amount: 0.1, currency: 'BTC', locale: 'en-US', isCompact: false }
```

#### `formatCompactCurrency(amount: number, currency: string, options?: FormatCurrencyOptions): FormattedCurrency`
Formats large amounts in compact notation (1M, 1B, etc.).

```typescript
formatCompactCurrency(1500000, 'USD')
// Returns: { formatted: '$1.5M', amount: 1500000, currency: 'USD', locale: 'en-US', isCompact: true }

formatCompactCurrency(2500000000, 'USD')
// Returns: { formatted: '$2.5B', amount: 2500000000, currency: 'USD', locale: 'en-US', isCompact: true }
```

### Percentage Formatting

#### `formatPercentage(decimal: number, options?: PercentageOptions): string`
Formats decimal values as percentages.

```typescript
formatPercentage(0.1525)
// Returns: '15.25%'

formatPercentage(0.1525, { precision: 1, locale: 'de-DE' })
// Returns: '15,3 %'
```

### Localization

#### `formatCurrencyByLocale(amount: number, currency: string, locale: string): string`
Formats currency with specific locale rules.

```typescript
formatCurrencyByLocale(1234.56, 'USD', 'en-US')
// Returns: '$1,234.56'

formatCurrencyByLocale(1234.56, 'EUR', 'de-DE')
// Returns: '1.234,56 €'
```

#### `getLocaleCurrencyInfo(locale: string): LocaleCurrencyInfo`
Gets currency information for a locale.

```typescript
getLocaleCurrencyInfo('en-US')
// Returns: { currency: 'USD', symbol: '$', name: 'US Dollar' }

getLocaleCurrencyInfo('de-DE')
// Returns: { currency: 'EUR', symbol: '€', name: 'Euro' }
```

#### `formatWithGrouping(amount: number, locale?: string): string`
Adds thousand separators based on locale.

```typescript
formatWithGrouping(1234567.89)
// Returns: '1,234,567.89'

formatWithGrouping(1234567.89, 'de-DE')
// Returns: '1.234.567,89'
```

#### `formatDecimalPlaces(amount: number, decimalPlaces: number): string`
Formats number with specific decimal places.

```typescript
formatDecimalPlaces(123.456789, 2)
// Returns: '123.46'

formatDecimalPlaces(123.1, 4)
// Returns: '123.1000'
```

### Validation and Parsing

#### `isValidAmount(amount: unknown): amount is number`
Checks if a value is a valid money amount.

```typescript
isValidAmount(100.50)
// Returns: true

isValidAmount(NaN)
// Returns: false
```

#### `isValidCurrency(currencyCode): currencyCode is string`
Validates currency codes against ISO 4217 and cryptocurrencies.

```typescript
isValidCurrency('USD')
// Returns: true

isValidCurrency('BTC')
// Returns: true

isValidCurrency('INVALID')
// Returns: false
```

#### `isPositiveAmount(amount: number): boolean`
Checks if an amount is positive.

```typescript
isPositiveAmount(100)
// Returns: true

isPositiveAmount(-50)
// Returns: false
```

#### `isWithinRange(amount: number, min: number, max: number): boolean`
Checks if an amount is within a specified range.

```typescript
isWithinRange(50, 10, 100)
// Returns: true

isWithinRange(150, 10, 100)
// Returns: false
```

#### `parseAmount(amountString: string): ParsedAmount`
Parses string to number amount.

```typescript
parseAmount('123.45')
// Returns: { amount: 123.45, isValid: true }

parseAmount('invalid')
// Returns: { amount: 0, isValid: false }
```

#### `parseCurrencyString(currencyString: string): ParsedCurrency`
Extracts amount and currency from formatted string.

```typescript
parseCurrencyString('$123.45')
// Returns: { amount: 123.45, currency: 'USD', isValid: true }

parseCurrencyString('€1.234,56')
// Returns: { amount: 1234.56, currency: 'EUR', isValid: true }
```

#### `normalizeAmount(amount: number, decimalPlaces?: number): number`
Normalizes amount to standard format.

```typescript
normalizeAmount(123.456789)
// Returns: 123.46

normalizeAmount(123.456789, 4)
// Returns: 123.4568
```

#### `parseFormattedCurrency(formattedString: string, locale?: string): ParsedCurrency`
Parses formatted currency string with locale awareness.

```typescript
parseFormattedCurrency('$1,234.56', 'en-US')
// Returns: { amount: 1234.56, currency: 'USD', isValid: true }

parseFormattedCurrency('1.234,56 €', 'de-DE')
// Returns: { amount: 1234.56, currency: 'EUR', isValid: true }
```

### Currency Conversion

#### `convertCurrency(amount: number, fromCurrency: string, toCurrency: string, rate?: number): ConversionResult`
Converts between currencies with exchange rates.

```typescript
convertCurrency(100, 'USD', 'EUR', 0.85)
// Returns: { amount: 85, fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.85 }

convertCurrency(100, 'USD', 'USD')
// Returns: { amount: 100, fromCurrency: 'USD', toCurrency: 'USD', rate: 1 }
```

#### `convertWithFee(amount: number, rate: number, feePercentage: number): ConversionWithFee`
Converts currency with transaction fee.

```typescript
convertWithFee(100, 0.85, 2.5)
// Returns: { convertedAmount: 85, fee: 2.125, totalCost: 87.125, effectiveRate: 0.8713 }
```

#### `bulkConvert(amounts: number[], fromCurrency: string, toCurrency: string, rate: number): BulkConversionResult`
Converts multiple amounts at once.

```typescript
bulkConvert([100, 200, 300], 'USD', 'EUR', 0.85)
// Returns: { convertedAmounts: [85, 170, 255], totalOriginal: 600, totalConverted: 510, rate: 0.85 }
```

### Arithmetic Operations

#### `roundMoney(amount: number, precision?: number): number`
Rounds money to specified precision.

```typescript
roundMoney(123.456)
// Returns: 123.46

roundMoney(123.456, 1)
// Returns: 123.5
```

#### `addMoney(amount1: number, amount2: number, currency?: string): number`
Adds two money amounts.

```typescript
addMoney(100.25, 50.75)
// Returns: 151

addMoney(100.25, 50.75, 'USD')
// Returns: 151
```

#### `subtractMoney(amount1: number, amount2: number, currency?: string): number`
Subtracts money amounts.

```typescript
subtractMoney(100.75, 25.25)
// Returns: 75.5

subtractMoney(100.75, 25.25, 'USD')
// Returns: 75.5
```

#### `multiplyMoney(amount: number, multiplier: number): number`
Multiplies money by a number.

```typescript
multiplyMoney(50.25, 3)
// Returns: 150.75

multiplyMoney(100, 1.5)
// Returns: 150
```

#### `divideMoney(amount: number, divisor: number): number`
Divides money by a number.

```typescript
divideMoney(150, 3)
// Returns: 50

divideMoney(100, 4)
// Returns: 25
```

#### `calculateTip(amount: number, percentage: number): number`
Calculates tip amount.

```typescript
calculateTip(100, 15)
// Returns: 15

calculateTip(85.50, 20)
// Returns: 17.1
```

#### `calculateTax(amount: number, taxRate: number): number`
Calculates tax amount.

```typescript
calculateTax(100, 8.5)
// Returns: 8.5

calculateTax(250, 10)
// Returns: 25
```

#### `calculateDiscount(amount: number, discountRate: number): number`
Calculates discount amount.

```typescript
calculateDiscount(100, 10)
// Returns: 10

calculateDiscount(250, 15)
// Returns: 37.5
```

#### `calculateSimpleInterest(principal: number, rate: number, time: number): number`
Calculates simple interest.

```typescript
calculateSimpleInterest(1000, 5, 2)
// Returns: 100

calculateSimpleInterest(5000, 3.5, 1.5)
// Returns: 262.5
```

#### `calculateCompoundInterest(principal: number, rate: number, time: number, frequency?: number): CompoundInterestResult`
Calculates compound interest.

```typescript
calculateCompoundInterest(1000, 5, 2)
// Returns: { finalAmount: 1102.5, interestEarned: 102.5, effectiveRate: 5.125 }

calculateCompoundInterest(1000, 5, 2, 12)
// Returns: { finalAmount: 1104.89, interestEarned: 104.89, effectiveRate: 5.244 }
```

#### `splitAmount(totalAmount: number, numberOfParts: number): number[]`
Splits amount into equal parts.

```typescript
splitAmount(100, 3)
// Returns: [33.33, 33.33, 33.34]

splitAmount(150, 4)
// Returns: [37.5, 37.5, 37.5, 37.5]
```

#### `distributeProportionally(totalAmount: number, ratios: number[]): number[]`
Distributes amount by ratios.

```typescript
distributeProportionally(100, [1, 2, 3])
// Returns: [16.67, 33.33, 50]

distributeProportionally(500, [40, 30, 30])
// Returns: [200, 150, 150]
```

#### `calculatePercentageOfTotal(amount: number, total: number): number`
Calculates percentage share.

```typescript
calculatePercentageOfTotal(25, 100)
// Returns: 25

calculatePercentageOfTotal(150, 500)
// Returns: 30
```

### Loan and Credit Utilities

#### `calculateMonthlyPayment(principal: number, rate: number, termMonths: number): number`
Calculates monthly loan payment.

```typescript
calculateMonthlyPayment(200000, 4.5, 360)
// Returns: 1013.37

calculateMonthlyPayment(50000, 6, 60)
// Returns: 966.64
```

#### `calculateLoanBalance(principal: number, rate: number, termMonths: number, paymentsMade: number): number`
Calculates remaining loan balance.

```typescript
calculateLoanBalance(200000, 4.5, 360, 12)
// Returns: 197834.23

calculateLoanBalance(50000, 6, 60, 24)
// Returns: 28844.35
```

#### `calculateTotalInterest(principal: number, rate: number, termMonths: number): number`
Calculates total interest over loan term.

```typescript
calculateTotalInterest(200000, 4.5, 360)
// Returns: 164813.42

calculateTotalInterest(50000, 6, 60)
// Returns: 7998.12
```

#### `generateAmortizationSchedule(principal: number, rate: number, termMonths: number): AmortizationEntry[]`
Generates complete amortization schedule.

```typescript
generateAmortizationSchedule(100000, 5, 12)
// Returns: [
//   { month: 1, payment: 8560.75, principal: 8144.08, interest: 416.67, balance: 91855.92 },
//   { month: 2, payment: 8560.75, principal: 8178.02, interest: 382.73, balance: 83677.90 },
//   ...
// ]
```

#### `calculateCreditUtilization(usedCredit: number, totalCredit: number): number`
Calculates credit utilization ratio.

```typescript
calculateCreditUtilization(2500, 10000)
// Returns: 25

calculateCreditUtilization(1200, 5000)
// Returns: 24
```

#### `calculateMinimumPayment(balance: number, rate: number, minimumRate: number): number`
Calculates minimum credit payment.

```typescript
calculateMinimumPayment(5000, 18, 2)
// Returns: 100

calculateMinimumPayment(2500, 24, 3)
// Returns: 75
```

#### `calculatePayoffTime(balance: number, payment: number, rate: number): PayoffResult`
Calculates time to pay off debt.

```typescript
calculatePayoffTime(5000, 200, 18)
// Returns: { months: 30, totalInterest: 983.45, totalPaid: 5983.45 }

calculatePayoffTime(10000, 300, 24)
// Returns: { months: 43, totalInterest: 2804.32, totalPaid: 12804.32 }
```

### Investment and Returns

#### `calculateROI(initialInvestment: number, finalValue: number): number`
Calculates return on investment.

```typescript
calculateROI(10000, 12000)
// Returns: 20

calculateROI(5000, 4500)
// Returns: -10
```

#### `calculateAnnualizedReturn(initialValue: number, finalValue: number, years: number): number`
Calculates annualized return.

```typescript
calculateAnnualizedReturn(10000, 15000, 3)
// Returns: 14.47

calculateAnnualizedReturn(5000, 7500, 2)
// Returns: 22.47
```

#### `calculateDividendYield(dividendPerShare: number, pricePerShare: number): number`
Calculates dividend yield.

```typescript
calculateDividendYield(2.50, 50)
// Returns: 5

calculateDividendYield(1.25, 75)
// Returns: 1.67
```

#### `calculateFutureValue(presentValue: number, rate: number, periods: number): number`
Calculates future value.

```typescript
calculateFutureValue(10000, 7, 10)
// Returns: 19671.51

calculateFutureValue(5000, 5, 20)
// Returns: 13266.49
```

### Subscription and Recurring Payments

#### `calculateSubscriptionValue(monthlyAmount: number, months: number): number`
Calculates total subscription cost.

```typescript
calculateSubscriptionValue(29.99, 12)
// Returns: 359.88

calculateSubscriptionValue(99, 6)
// Returns: 594
```

#### `compareSubscriptionPlans(plans: SubscriptionPlan[]): PlanComparison[]`
Compares subscription plans.

```typescript
compareSubscriptionPlans([
  { name: 'Basic', monthlyPrice: 10, features: [] },
  { name: 'Pro', monthlyPrice: 25, features: [] }
])
// Returns: [
//   { plan: 'Basic', monthlyPrice: 10, annualPrice: 120, savings: 0 },
//   { plan: 'Pro', monthlyPrice: 25, annualPrice: 300, savings: 0 }
// ]
```

#### `calculateProrationAmount(amount: number, daysUsed: number, totalDays: number): number`
Calculates prorated amount.

```typescript
calculateProrationAmount(100, 15, 30)
// Returns: 50

calculateProrationAmount(299, 10, 31)
// Returns: 96.45
```

#### `calculateUpgradeCredit(oldPlan: SubscriptionPlan, newPlan: SubscriptionPlan, daysRemaining: number): UpgradeCredit`
Calculates upgrade credit.

```typescript
calculateUpgradeCredit(
  { name: 'Basic', monthlyPrice: 10 },
  { name: 'Pro', monthlyPrice: 25 },
  15
)
// Returns: { credit: 5, additionalCost: 12.5, totalCost: 7.5 }
```

#### `calculateAnnualEquivalent(amount: number, frequency: 'monthly' | 'weekly' | 'quarterly'): number`
Converts to annual amount.

```typescript
calculateAnnualEquivalent(100, 'monthly')
// Returns: 1200

calculateAnnualEquivalent(25, 'weekly')
// Returns: 1300
```

#### `calculateNextPaymentDate(startDate: Date, frequency: 'monthly' | 'weekly' | 'quarterly'): Date`
Calculates next payment date.

```typescript
calculateNextPaymentDate(new Date('2024-01-15'), 'monthly')
// Returns: Date object for 2024-02-15

calculateNextPaymentDate(new Date('2024-01-15'), 'weekly')
// Returns: Date object for 2024-01-22
```

#### `calculateTotalRecurringCost(amount: number, frequency: 'monthly' | 'weekly' | 'quarterly', duration: number): number`
Calculates total recurring cost.

```typescript
calculateTotalRecurringCost(50, 'monthly', 12)
// Returns: 600

calculateTotalRecurringCost(25, 'weekly', 52)
// Returns: 1300
```

### Utility Functions

#### `roundToNearestCent(amount: number): number`
Rounds to nearest cent.

```typescript
roundToNearestCent(123.456)
// Returns: 123.46

roundToNearestCent(99.994)
// Returns: 99.99
```

#### `roundToBankersRounding(amount: number, decimalPlaces?: number): number`
Applies banker's rounding (round half to even).

```typescript
roundToBankersRounding(2.125, 2)
// Returns: 2.12

roundToBankersRounding(2.135, 2)
// Returns: 2.14
```

#### `truncateToDecimalPlaces(amount: number, places: number): number`
Truncates without rounding.

```typescript
truncateToDecimalPlaces(123.789, 2)
// Returns: 123.78

truncateToDecimalPlaces(99.999, 1)
// Returns: 99.9
```

#### `ceilToNearestCent(amount: number): number`
Ceils to nearest cent.

```typescript
ceilToNearestCent(123.451)
// Returns: 123.46

ceilToNearestCent(99.001)
// Returns: 99.01
```

#### `formatThousands(number: number, options?: ThousandsOptions): string`
Adds thousand separators.

```typescript
formatThousands(1234567.89)
// Returns: '1,234,567.89'

formatThousands(1234567.89, { thousandsSeparator: '.', decimalSeparator: ',' })
// Returns: '1.234.567,89'
```

#### `formatToHundreds(amount: number, options?: ThousandsOptions): string`
Formats cents to dollars with separators.

```typescript
formatToHundreds(123456)
// Returns: '1,234.56'

formatToHundreds(987654, { thousandsSeparator: ' ', decimalSeparator: ',' })
// Returns: '9 876,54'
```

#### `removeFormattingFromNumber(formattedString: string): string`
Removes formatting characters.

```typescript
removeFormattingFromNumber('$1,234.56')
// Returns: '1234.56'

removeFormattingFromNumber('€ 1.234,56')
// Returns: '1234.56'
```

#### `convertToWords(amount: number, options?: { currency?: string }): NumberToWordsResult`
Converts number to words.

```typescript
convertToWords(123.45)
// Returns: { words: 'one hundred twenty-three and forty-five cents' }

convertToWords(1500, { currency: 'USD' })
// Returns: { words: 'one thousand five hundred dollars', currency: 'USD' }
```

#### `formatAccountNumber(accountNumber: string, options?: AccountNumberOptions): FormattedAccountResult`
Formats account numbers with masking.

```typescript
formatAccountNumber('1234567890')
// Returns: { formatted: '******7890', masked: true, groupSize: 4 }

formatAccountNumber('1234567890', { maskCharacter: 'X', showLast: 6 })
// Returns: { formatted: 'XXXX567890', masked: true, groupSize: 4 }
```

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
