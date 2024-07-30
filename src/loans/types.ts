/**
 * Type definitions for loan and credit utilities
 */

/**
 * Loan payment calculation result
 */
export interface LoanPaymentResult {
  /** Monthly payment amount */
  monthlyPayment: number;
  /** Principal amount */
  principal: number;
  /** Annual interest rate */
  rate: number;
  /** Term in months */
  termMonths: number;
  /** Total amount to be paid */
  totalAmount: number;
  /** Total interest to be paid */
  totalInterest: number;
}

/**
 * Loan balance calculation result
 */
export interface LoanBalanceResult {
  /** Remaining balance */
  remainingBalance: number;
  /** Principal paid so far */
  principalPaid: number;
  /** Interest paid so far */
  interestPaid: number;
  /** Number of payments made */
  paymentsMade: number;
  /** Number of payments remaining */
  paymentsRemaining: number;
}

/**
 * Single amortization payment entry
 */
export interface AmortizationPayment {
  /** Payment number */
  paymentNumber: number;
  /** Payment amount */
  paymentAmount: number;
  /** Principal portion of payment */
  principalAmount: number;
  /** Interest portion of payment */
  interestAmount: number;
  /** Remaining balance after payment */
  remainingBalance: number;
}

/**
 * Amortization schedule result
 */
export interface AmortizationSchedule {
  /** Array of payment details */
  payments: AmortizationPayment[];
  /** Loan summary */
  summary: LoanPaymentResult;
}

/**
 * Credit utilization result
 */
export interface CreditUtilizationResult {
  /** Utilization percentage */
  utilizationPercentage: number;
  /** Used credit amount */
  usedCredit: number;
  /** Total credit limit */
  totalCredit: number;
  /** Available credit */
  availableCredit: number;
  /** Risk level based on utilization */
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Minimum payment calculation result
 */
export interface MinimumPaymentResult {
  /** Minimum payment amount */
  minimumPayment: number;
  /** Current balance */
  balance: number;
  /** Interest rate */
  interestRate: number;
  /** Minimum payment rate */
  minimumRate: number;
  /** Interest portion */
  interestPortion: number;
  /** Principal portion */
  principalPortion: number;
}

/**
 * Payoff time calculation result
 */
export interface PayoffTimeResult {
  /** Time to pay off in months */
  monthsToPayoff: number;
  /** Time to pay off in years */
  yearsToPayoff: number;
  /** Total interest paid */
  totalInterestPaid: number;
  /** Total amount paid */
  totalAmountPaid: number;
  /** Monthly payment amount */
  monthlyPayment: number;
}
