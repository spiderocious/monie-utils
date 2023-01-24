/**
 * Core interfaces and types for monie-utils
 */

/**
 * Represents a money amount with its currency
 */
export interface Money {
  /** The amount in the currency's base unit */
  amount: number;
  /** ISO 4217 currency code */
  currency: string;
}

/**
 * Exchange rate information between two currencies
 */
export interface ExchangeRate {
  /** Source currency code */
  from: string;
  /** Target currency code */
  to: string;
  /** Exchange rate value */
  rate: number;
  /** Timestamp when rate was fetched */
  timestamp: Date;
}

/**
 * Transaction information
 */
export interface Transaction {
  /** Unique transaction identifier */
  id: string;
  /** Transaction amount */
  amount: Money;
  /** Transaction date */
  date: Date;
  /** Transaction description */
  description: string;
  /** Optional category */
  category?: string;
  /** Transaction type */
  type: 'credit' | 'debit';
}

/**
 * Currency information and metadata
 */
export interface CurrencyInfo {
  /** ISO 4217 currency code */
  code: string;
  /** Full currency name */
  name: string;
  /** Currency symbol */
  symbol: string;
  /** Number of decimal places */
  decimalPlaces: number;
  /** Countries that use this currency */
  countries: string[];
  /** Whether this is a cryptocurrency */
  isCrypto: boolean;
}

/**
 * Formatting options for money display
 */
export interface FormatOptions {
  /** Locale for formatting */
  locale?: string;
  /** Whether to show currency symbol */
  showSymbol?: boolean;
  /** Whether to show currency code */
  showCode?: boolean;
  /** Custom decimal places (overrides currency default) */
  decimalPlaces?: number;
  /** Whether to use compact notation (1M, 1B, etc.) */
  compact?: boolean;
}

/**
 * Fee structure for transaction calculations
 */
export interface FeeStructure {
  /** Fixed fee amount */
  fixed?: number;
  /** Percentage fee rate */
  percentage?: number;
  /** Minimum fee */
  minimum?: number;
  /** Maximum fee */
  maximum?: number;
}

/**
 * Loan calculation parameters
 */
export interface LoanParameters {
  /** Principal loan amount */
  principal: number;
  /** Annual interest rate (as decimal, e.g., 0.05 for 5%) */
  rate: number;
  /** Loan term in months */
  termMonths: number;
}

/**
 * Investment return data
 */
export interface InvestmentReturn {
  /** Period identifier */
  period: string;
  /** Return value for the period */
  value: number;
  /** Date of the return */
  date: Date;
}

/**
 * Budget allocation item
 */
export interface BudgetCategory {
  /** Category name */
  name: string;
  /** Allocated amount */
  amount: number;
  /** Allocation percentage */
  percentage: number;
}

/**
 * Subscription plan information
 */
export interface SubscriptionPlan {
  /** Plan name */
  name: string;
  /** Monthly cost */
  monthlyAmount: number;
  /** Annual cost (if different from 12x monthly) */
  annualAmount?: number;
  /** Billing frequency */
  frequency: 'monthly' | 'quarterly' | 'annually';
  /** Plan features */
  features: string[];
}

/**
 * Error types for validation and operations
 */
export type MonieUtilsError = 
  | 'INVALID_AMOUNT'
  | 'INVALID_CURRENCY'
  | 'CURRENCY_MISMATCH'
  | 'DIVISION_BY_ZERO'
  | 'INVALID_RANGE'
  | 'INVALID_PERCENTAGE'
  | 'INVALID_DATE'
  | 'EXCHANGE_RATE_NOT_FOUND';
