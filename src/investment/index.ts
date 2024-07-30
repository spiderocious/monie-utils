/**
 * @fileoverview Investment and returns utilities
 * @module Investment
 *
 * This module provides utilities for calculating investment returns, yields, and future values.
 * All functions include comprehensive input validation and return detailed result objects.
 *
 * @example
 * ```typescript
 * import {
 *   calculateROI,
 *   calculateAnnualizedReturn,
 *   calculateDividendYield,
 *   calculateFutureValue
 * } from 'monie-utils/investment';
 *
 * // Calculate ROI
 * const roi = calculateROI(1000, 1250);
 * console.log(`ROI: ${roi.roiPercentage}%`); // ROI: 25%
 *
 * // Calculate annualized return
 * const annualized = calculateAnnualizedReturn(1000, 1500, 3);
 * console.log(`Annual return: ${annualized.annualizedReturnPercentage}%`);
 *
 * // Calculate dividend yield
 * const dividend = calculateDividendYield(2.50, 50);
 * console.log(`Dividend yield: ${dividend.yieldPercentage}%`); // 5%
 *
 * // Calculate future value
 * const future = calculateFutureValue(1000, 0.05, 10);
 * console.log(`Future value: $${future.futureValue}`);
 * ```
 */

export {
  calculateROI,
  calculateAnnualizedReturn,
  calculateDividendYield,
  calculateFutureValue,
} from './investment';

export type {
  ROIResult,
  AnnualizedReturnResult,
  DividendYieldResult,
  FutureValueResult,
} from './types';
