/**
 * @fileoverview Investment and returns calculation utilities
 * @module Investment
 */

import { MonieUtilsError } from '../errors';
import { isValidAmount } from '../validation';
import { roundMoney } from '../arithmetic';
import type {
  ROIResult,
  AnnualizedReturnResult,
  DividendYieldResult,
  FutureValueResult,
} from './types.js';

/**
 * Calculate return on investment (ROI)
 *
 * @param initialInvestment - The initial investment amount
 * @param finalValue - The final value of the investment
 * @returns ROI calculation result with percentage and gain/loss information
 *
 * @throws {MonieUtilsError} When initial investment or final value is invalid
 * @throws {MonieUtilsError} When initial investment is zero or negative
 *
 * @example
 * ```typescript
 * const result = calculateROI(1000, 1250);
 * console.log(result.roiPercentage); // 25 (25% return)
 * console.log(result.gainLoss); // 250
 * console.log(result.isGain); // true
 * ```
 */
export function calculateROI(
  initialInvestment: number,
  finalValue: number
): ROIResult {
  if (!isValidAmount(initialInvestment) || !isValidAmount(finalValue)) {
    throw new MonieUtilsError(
      'Initial investment and final value must be valid numbers'
    );
  }

  if (initialInvestment <= 0) {
    throw new MonieUtilsError('Initial investment must be greater than zero');
  }

  const gainLoss = finalValue - initialInvestment;
  const roi = gainLoss / initialInvestment;
  const roiPercentage = roi * 100;

  return {
    roi: roundMoney(roi, 6),
    roiPercentage: roundMoney(roiPercentage, 2),
    gainLoss: roundMoney(gainLoss, 2),
    isGain: gainLoss >= 0,
  };
}

/**
 * Calculate annualized return on investment
 *
 * @param initialValue - The initial investment value
 * @param finalValue - The final investment value
 * @param years - The number of years the investment was held
 * @returns Annualized return calculation with total return information
 *
 * @throws {MonieUtilsError} When any parameter is invalid
 * @throws {MonieUtilsError} When initial value is zero or negative
 * @throws {MonieUtilsError} When years is zero or negative
 *
 * @example
 * ```typescript
 * const result = calculateAnnualizedReturn(1000, 1500, 3);
 * console.log(result.annualizedReturnPercentage); // ~14.47 (14.47% per year)
 * console.log(result.totalReturnPercentage); // 50 (50% total return)
 * ```
 */
export function calculateAnnualizedReturn(
  initialValue: number,
  finalValue: number,
  years: number
): AnnualizedReturnResult {
  if (
    !isValidAmount(initialValue) ||
    !isValidAmount(finalValue) ||
    !isValidAmount(years)
  ) {
    throw new MonieUtilsError(
      'Initial value, final value, and years must be valid numbers'
    );
  }

  if (initialValue <= 0) {
    throw new MonieUtilsError('Initial value must be greater than zero');
  }

  if (years <= 0) {
    throw new MonieUtilsError('Years must be greater than zero');
  }

  const totalReturn = (finalValue - initialValue) / initialValue;
  const annualizedReturn = Math.pow(finalValue / initialValue, 1 / years) - 1;

  return {
    annualizedReturn: roundMoney(annualizedReturn, 6),
    annualizedReturnPercentage: roundMoney(annualizedReturn * 100, 2),
    totalReturn: roundMoney(totalReturn, 6),
    totalReturnPercentage: roundMoney(totalReturn * 100, 2),
  };
}

/**
 * Calculate dividend yield
 *
 * @param dividendPerShare - The annual dividend payment per share
 * @param pricePerShare - The current price per share
 * @returns Dividend yield calculation with percentage information
 *
 * @throws {MonieUtilsError} When dividend per share or price per share is invalid
 * @throws {MonieUtilsError} When price per share is zero or negative
 * @throws {MonieUtilsError} When dividend per share is negative
 *
 * @example
 * ```typescript
 * const result = calculateDividendYield(2.50, 50);
 * console.log(result.yieldPercentage); // 5 (5% dividend yield)
 * console.log(result.dividendPerShare); // 2.50
 * ```
 */
export function calculateDividendYield(
  dividendPerShare: number,
  pricePerShare: number
): DividendYieldResult {
  if (!isValidAmount(dividendPerShare) || !isValidAmount(pricePerShare)) {
    throw new MonieUtilsError(
      'Dividend per share and price per share must be valid numbers'
    );
  }

  if (pricePerShare <= 0) {
    throw new MonieUtilsError('Price per share must be greater than zero');
  }

  if (dividendPerShare < 0) {
    throw new MonieUtilsError('Dividend per share cannot be negative');
  }

  const yield_ = dividendPerShare / pricePerShare;
  const yieldPercentage = yield_ * 100;

  return {
    yield: roundMoney(yield_, 6),
    yieldPercentage: roundMoney(yieldPercentage, 2),
    dividendPerShare: roundMoney(dividendPerShare, 2),
    sharePrice: roundMoney(pricePerShare, 2),
  };
}

/**
 * Calculate future value of an investment with compound interest
 *
 * @param presentValue - The present value of the investment
 * @param rate - The interest rate per period (as decimal, e.g., 0.05 for 5%)
 * @param periods - The number of compounding periods
 * @returns Future value calculation with interest breakdown
 *
 * @throws {MonieUtilsError} When any parameter is invalid
 * @throws {MonieUtilsError} When present value is zero or negative
 * @throws {MonieUtilsError} When rate is negative
 * @throws {MonieUtilsError} When periods is negative or not an integer
 *
 * @example
 * ```typescript
 * const result = calculateFutureValue(1000, 0.05, 10);
 * console.log(result.futureValue); // ~1628.89
 * console.log(result.totalInterest); // ~628.89
 * ```
 */
export function calculateFutureValue(
  presentValue: number,
  rate: number,
  periods: number
): FutureValueResult {
  if (
    !isValidAmount(presentValue) ||
    !isValidAmount(rate) ||
    !isValidAmount(periods)
  ) {
    throw new MonieUtilsError(
      'Present value, rate, and periods must be valid numbers'
    );
  }

  if (presentValue <= 0) {
    throw new MonieUtilsError('Present value must be greater than zero');
  }

  if (rate < 0) {
    throw new MonieUtilsError('Interest rate cannot be negative');
  }

  if (periods < 0 || !Number.isInteger(periods)) {
    throw new MonieUtilsError('Periods must be a non-negative integer');
  }

  const futureValue = presentValue * Math.pow(1 + rate, periods);
  const totalInterest = futureValue - presentValue;

  return {
    futureValue: roundMoney(futureValue, 2),
    presentValue: roundMoney(presentValue, 2),
    totalInterest: roundMoney(totalInterest, 2),
    effectiveRate: roundMoney(rate, 6),
    periods,
  };
}
