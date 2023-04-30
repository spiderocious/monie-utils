/**
 * Type definitions for arithmetic operations utilities
 */


/**
 * Rounding modes for financial calculations
 */
export type RoundingMode = 'round' | 'floor' | 'ceil' | 'bankers';

/**
 * Result of money arithmetic operations
 */
export interface ArithmeticResult {
  /** The calculated amount */
  amount: number;
  /** The currency code */
  currency?: string;
  /** The operation performed */
  operation: string;
  /** Original operands */
  operands: number[];
}

/**
 * Split amount result
 */
export interface SplitResult {
  /** Array of split amounts */
  amounts: number[];
  /** Total amount that was split */
  totalAmount: number;
  /** Number of parts */
  numberOfParts: number;
  /** Any remainder from splitting */
  remainder: number;
}

/**
 * Proportional distribution result
 */
export interface DistributionResult {
  /** Array of distributed amounts */
  amounts: number[];
  /** Total amount that was distributed */
  totalAmount: number;
  /** Ratios used for distribution */
  ratios: number[];
  /** Any remainder from distribution */
  remainder: number;
}

/**
 * Interest calculation result
 */
export interface InterestResult {
  /** Principal amount */
  principal: number;
  /** Interest rate used */
  rate: number;
  /** Time period */
  time: number;
  /** Calculated interest */
  interest: number;
  /** Final amount (principal + interest) */
  finalAmount: number;
  /** Type of interest calculation */
  type: 'simple' | 'compound';
  /** Compounding frequency (for compound interest) */
  frequency?: number;
}

/**
 * Percentage calculation result
 */
export interface PercentageResult {
  /** The percentage value */
  percentage: number;
  /** The amount used */
  amount: number;
  /** The total used */
  total: number;
}
