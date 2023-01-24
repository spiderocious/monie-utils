/**
 * Custom error class for monie-utils
 */
export class MonieUtilsError extends Error {
  public readonly code: string = 'MONIE_UTILS_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'MonieUtilsError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MonieUtilsError);
    }
  }
}

/**
 * Create a standardized error
 */
export function createError(message: string): MonieUtilsError {
  return new MonieUtilsError(message);
}
