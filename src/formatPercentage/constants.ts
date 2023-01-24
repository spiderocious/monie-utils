/**
 * Default options and constants for percentage formatting
 */

import type { FormatPercentageOptions } from './types';

/**
 * Default formatting options for percentages
 */
export const DEFAULT_PERCENTAGE_OPTIONS: Required<
  Omit<FormatPercentageOptions, 'suffix'>
> = {
  precision: 2,
  locale: 'en-US',
  useGrouping: true,
  spaceBefore: false,
};
