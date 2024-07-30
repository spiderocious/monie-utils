/**
 * @fileoverview Type definitions for investment and returns utilities
 * @module Investment/Types
 */

/**
 * Result of return on investment calculation
 */
export interface ROIResult {
  /** The ROI as a decimal (e.g., 0.25 for 25% return) */
  roi: number;
  /** The ROI as a percentage (e.g., 25 for 25% return) */
  roiPercentage: number;
  /** The absolute gain or loss amount */
  gainLoss: number;
  /** Whether the investment resulted in a gain (true) or loss (false) */
  isGain: boolean;
}

/**
 * Result of annualized return calculation
 */
export interface AnnualizedReturnResult {
  /** The annualized return as a decimal */
  annualizedReturn: number;
  /** The annualized return as a percentage */
  annualizedReturnPercentage: number;
  /** The total return over the entire period as a decimal */
  totalReturn: number;
  /** The total return over the entire period as a percentage */
  totalReturnPercentage: number;
}

/**
 * Result of dividend yield calculation
 */
export interface DividendYieldResult {
  /** The dividend yield as a decimal */
  yield: number;
  /** The dividend yield as a percentage */
  yieldPercentage: number;
  /** The annual dividend income per share */
  dividendPerShare: number;
  /** The current share price */
  sharePrice: number;
}

/**
 * Result of future value calculation
 */
export interface FutureValueResult {
  /** The future value of the investment */
  futureValue: number;
  /** The initial present value */
  presentValue: number;
  /** The total interest earned */
  totalInterest: number;
  /** The effective annual rate used */
  effectiveRate: number;
  /** The number of compounding periods */
  periods: number;
}
