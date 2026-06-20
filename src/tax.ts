/**
 * Philippine tax calculation utilities
 * @module ph-currency/tax
 *
 * Comprehensive tax calculations for Philippine businesses and individuals,
 * including VAT, withholding tax, income tax brackets (TRAIN Law / CREATE Act),
 * and social contributions.
 *
 * All rates are based on BIR (Bureau of Internal Revenue) guidelines.
 *
 * @example
 * ```ts
 * import { calculateVAT, calculateWithholdingTax, computeIncomeTax } from 'ph-currency';
 *
 * calculateVAT(10000);          // 1200 (12% VAT)
 * calculateWithholdingTax(50000, 'services'); // 5000 (10%)
 * computeIncomeTax(600000, 'compensation');  // 72500
 * ```
 */

import {
  VAT_RATES,
  WITHHOLDING_TAX_RATES,
  INCOME_TAX_BRACKETS,
  FINAL_WHT_RATES,
  SSS_RATES,
  PHILHEALTH_RATES,
  PAGIBIG_RATES,
  EWT_RATES,
} from './constants';
import { TaxResult, VATType, WHTType, IncomeTaxBracket, BIR2316Data } from './types';

// Type exports for consumers
// Add specific types as needed

// ===== VAT CALCULATIONS =====

/**
 * Calculate VAT amount for a given gross amount
 *
 * @param amount - Gross amount (inclusive of VAT if vatInclusive is false)
 * @param rate - VAT rate (default: 0.12 = 12%)
 * @param vatInclusive - If true, amount already includes VAT (extract it)
 * @returns VAT amount
 *
 * @example
 * ```ts
 * calculateVAT(10000);                           // 1200 (12% of 10000)
 * calculateVAT(11200, 0.12, true);              // 1200 (extract from inclusive)
 * calculateVAT(5000, 0.05);                     // 250 (5% reduced rate)
 * calculateVAT(10000, 0, true);                 // 0 (zero-rated)
 * ```
 */
export function calculateVAT(
  amount: number,
  rate: number = VAT_RATES.standard,
  vatInclusive: boolean = false,
): number {
  if (vatInclusive) {
    // Extract VAT from inclusive amount: VAT = amount × rate / (1 + rate)
    return round2((amount * rate) / (1 + rate));
  }
  return round2(amount * rate);
}

/**
 * Calculate VAT-inclusive amount (add VAT to a base amount)
 *
 * @param amount - Base amount (exclusive of VAT)
 * @param rate - VAT rate (default: 0.12)
 * @returns Total amount including VAT
 *
 * @example
 * ```ts
 * addVAT(10000);      // 11200
 * addVAT(10000, 0.05); // 10500
 * ```
 */
export function addVAT(amount: number, rate: number = VAT_RATES.standard): number {
  return round2(amount * (1 + rate));
}

/**
 * Calculate VAT-exclusive amount (remove VAT from an inclusive amount)
 *
 * @param amount - VAT-inclusive amount
 * @param rate - VAT rate (default: 0.12)
 * @returns Amount exclusive of VAT
 *
 * @example
 * ```ts
 * removeVAT(11200);       // 10000
 * removeVAT(10500, 0.05); // 10000
 * ```
 */
export function removeVAT(amount: number, rate: number = VAT_RATES.standard): number {
  return round2(amount / (1 + rate));
}

/**
 * Break down an amount into base + VAT
 *
 * @param amount - Gross amount (VAT-inclusive)
 * @param rate - VAT rate (default: 0.12)
 * @returns Object with base, vat, and total
 *
 * @example
 * ```ts
 * const breakdown = vatBreakdown(11200);
 * // { base: 10000, vat: 1200, total: 11200 }
 * ```
 */
export function vatBreakdown(
  amount: number,
  rate: number = VAT_RATES.standard,
): { base: number; vat: number; total: number } {
  const base = round2(amount / (1 + rate));
  const vat = round2(amount - base);
  return { base, vat, total: amount };
}

/**
 * Apply VAT type classification
 *
 * @param amount - The base amount
 * @param vatType - The VAT classification
 * @returns Tax result with zero tax for exempt/zero-rated
 *
 * @example
 * ```ts
 * applyVATType(10000, 'standard');  // { taxAmount: 1200, ... }
 * applyVATType(10000, 'exempt');    // { taxAmount: 0, ... }
 * ```
 */
export function applyVATType(amount: number, vatType: VATType): TaxResult {
  const taxRate = VAT_RATES[vatType];
  const taxAmount = calculateVAT(amount, taxRate);
  return {
    gross: amount,
    taxAmount,
    netAmount: round2(amount + (taxRate > 0 ? 0 : 0)), // For VAT, gross is the base
    taxRate,
    taxType: `VAT (${vatType})`,
  };
}

// ===== WITHHOLDING TAX CALCULATIONS =====

/**
 * Calculate withholding tax based on type and income
 *
 * @param amount - Income amount subject to withholding
 * @param type - Type of withholding tax
 * @param isTopWithholdingAgent - Whether the payer is a top withholding agent
 * @returns Tax result with gross, tax, and net
 *
 * @example
 * ```ts
 * const result = calculateWithholdingTax(50000, 'services');
 * // { gross: 50000, taxAmount: 5000, netAmount: 45000, taxRate: 0.10, taxType: 'services' }
 *
 * calculateWithholdingTax(50000, 'services', true);
 * // { taxAmount: 7500, taxRate: 0.15 } (top withholding agent rate)
 * ```
 */
export function calculateWithholdingTax(
  amount: number,
  type: WHTType | string = 'services',
  isTopWithholdingAgent: boolean = false,
): TaxResult {
  let taxRate: number;
  const rateConfig = WITHHOLDING_TAX_RATES[type];

  if (rateConfig === undefined) {
    throw new Error(`Unknown withholding tax type: ${type}`);
  }

  if (typeof rateConfig === 'object') {
    taxRate = isTopWithholdingAgent ? rateConfig.top_withholding_agent : rateConfig.general;
  } else {
    taxRate = rateConfig;
  }

  const taxAmount = round2(amount * taxRate);
  return {
    gross: amount,
    taxAmount,
    netAmount: round2(amount - taxAmount),
    taxRate,
    taxType: type,
  };
}

/**
 * Calculate final withholding tax (FWT)
 *
 * @param amount - Gross income subject to FWT
 * @param type - Type of income for FWT
 * @returns Tax result
 *
 * @example
 * ```ts
 * calculateFinalWHT(50000, 'interest_domestic_banks'); // 10000 (20%)
 * calculateFinalWHT(50000, 'dividend_domestic');       // 5000 (10%)
 * ```
 */
export function calculateFinalWHT(
  amount: number,
  type: keyof typeof FINAL_WHT_RATES,
): TaxResult {
  const taxRate = FINAL_WHT_RATES[type];
  if (taxRate === undefined) {
    throw new Error(`Unknown final WHT type: ${type}`);
  }

  const taxAmount = round2(amount * taxRate);
  return {
    gross: amount,
    taxAmount,
    netAmount: round2(amount - taxAmount),
    taxRate,
    taxType: `FWT (${type})`,
  };
}

/**
 * Calculate expanded withholding tax (EWT)
 *
 * @param amount - Gross amount subject to EWT
 * @param type - Type of payment
 * @returns Tax result
 *
 * @example
 * ```ts
 * calculateEWT(100000, 'professional_fees'); // 10000 (10%)
 * calculateEWT(100000, 'goods');             // 1000 (1%)
 * ```
 */
export function calculateEWT(
  amount: number,
  type: string,
): TaxResult {
  const taxRate = EWT_RATES[type];
  if (taxRate === undefined) {
    throw new Error(`Unknown EWT type: ${type}`);
  }

  const taxAmount = round2(amount * taxRate);
  return {
    gross: amount,
    taxAmount,
    netAmount: round2(amount - taxAmount),
    taxRate,
    taxType: `EWT (${type})`,
  };
}

// ===== INCOME TAX (TRAIN LAW / CREATE ACT) =====

/**
 * Get income tax bracket information for an amount
 *
 * @param annualIncome - Annual taxable income
 * @returns Matching bracket info
 */
export function getIncomeTaxBracket(annualIncome: number): IncomeTaxBracket {
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (annualIncome <= bracket.max) {
      return {
        range: bracket.description,
        taxRate: bracket.rate === 0 ? 'Exempt' : `${(bracket.rate * 100).toFixed(0)}%`,
        amount: annualIncome,
        tax: computeIncomeTax(annualIncome),
      };
    }
  }
  // Last bracket
  const last = INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];
  return {
    range: last.description,
    taxRate: `${(last.rate * 100).toFixed(0)}%`,
    amount: annualIncome,
    tax: computeIncomeTax(annualIncome),
  };
}

/**
 * Compute Philippine annual income tax based on TRAIN Law / CREATE Act
 * For compensation earners (simplified - no deductions applied)
 *
 * @param annualIncome - Annual taxable income
 * @returns Annual tax due
 *
 * @example
 * ```ts
 * computeIncomeTax(200000);    // 0 (below 250K threshold)
 * computeIncomeTax(300000);    // 7500 (15% of excess over 250K)
 * computeIncomeTax(600000);    // 72500
 * computeIncomeTax(1000000);   // 152500
 * computeIncomeTax(5000000);   // 1202500
 * ```
 */
export function computeIncomeTax(annualIncome: number): number {
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (annualIncome <= bracket.max) {
      if (bracket.rate === 0) return 0;
      const excess = annualIncome - (bracket.excessOver || 0);
      return round2(excess * bracket.rate + (bracket.flatAmount || 0));
    }
  }
  // Fallback: highest bracket
  const last = INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];
  const excess = annualIncome - (last.excessOver || 0);
  return round2(excess * last.rate + (last.flatAmount || 0));
}

/**
 * Compute monthly withholding tax on compensation
 *
 * @param annualIncome - Expected annual taxable income
 * @param monthsElapsed - Number of months elapsed (for annualization)
 * @returns Monthly tax withheld
 *
 * @example
 * ```ts
 * computeMonthlyWithholdingTax(600000);   // 6041.67
 * computeMonthlyWithholdingTax(300000);   // 625
 * ```
 */
export function computeMonthlyWithholdingTax(
  annualIncome: number,
  monthsElapsed: number = 12,
): number {
  const annualTax = computeIncomeTax(annualIncome);
  return round2(annualTax / monthsElapsed);
}

/**
 * Compute monthly withholding tax with salary annualization
 * (as per BIR rules - cumulative method)
 *
 * @param monthlyTaxableIncome - Monthly taxable salary
 * @param month - Current month (1-12)
 * @returns Monthly tax withheld
 *
 * @example
 * ```ts
 * computeAnnualizedWithholdingTax(50000, 1);  // month 1
 * computeAnnualizedWithholdingTax(50000, 6);  // month 6
 * ```
 */
export function computeAnnualizedWithholdingTax(
  monthlyTaxableIncome: number,
  month: number,
): number {
  const annualizedIncome = monthlyTaxableIncome * month;
  const annualTax = computeIncomeTax(annualizedIncome);

  // Cumulative tax minus already withheld
  const previousMonthTax = month > 1
    ? computeIncomeTax(monthlyTaxableIncome * (month - 1))
    : 0;

  return round2(annualTax - previousMonthTax);
}

/**
 * List all income tax brackets with computed tax
 *
 * @param annualIncome - Annual taxable income (for highlighting current bracket)
 * @returns Array of bracket information
 */
export function listIncomeTaxBrackets(annualIncome?: number): IncomeTaxBracket[] {
  return INCOME_TAX_BRACKETS.map((bracket) => {
    const testAmount = annualIncome !== undefined && annualIncome > bracket.min && annualIncome <= bracket.max
      ? annualIncome
      : bracket.min + 1000;
    return {
      range: bracket.description,
      taxRate: bracket.rate === 0 ? 'Exempt' : `${(bracket.rate * 100).toFixed(0)}%`,
      amount: testAmount,
      tax: computeIncomeTax(testAmount),
    };
  });
}

// ===== SOCIAL CONTRIBUTIONS =====

/**
 * Calculate SSS (Social Security System) contribution
 *
 * @param monthlySalaryCredit - Monthly salary credit
 * @returns Object with employee, employer, and total contributions
 *
 * @example
 * ```ts
 * const sss = calculateSSS(25000);
 * // { employee: 1125, employer: 2375, total: 3500 }
 * ```
 */
export function calculateSSS(monthlySalaryCredit: number): {
  employee: number;
  employer: number;
  total: number;
  monthlySalaryCredit: number;
} {
  // Clamp MSC
  const msc = Math.min(
    Math.max(monthlySalaryCredit, SSS_RATES.monthly_salary_credit_min),
    SSS_RATES.monthly_salary_credit_max,
  );

  const total = round2(msc * SSS_RATES.total_contribution_rate);
  const employee = round2(msc * SSS_RATES.employee_share);
  const employer = round2(msc * SSS_RATES.employer_share);

  return {
    employee: Math.min(employee, SSS_RATES.max_monthly_contribution),
    employer: Math.min(employer, SSS_RATES.max_monthly_contribution),
    total: Math.min(total, SSS_RATES.max_monthly_contribution * 1.5),
    monthlySalaryCredit: msc,
  };
}

/**
 * Calculate PhilHealth contribution
 *
 * @param monthlyBasicSalary - Monthly basic salary
 * @param premiumRate - Optional custom premium rate (default: 5%)
 * @returns Object with employee and employer contributions
 *
 * @example
 * ```ts
 * const ph = calculatePhilHealth(30000);
 * // { employee: 750, employer: 750, total: 1500 }
 * ```
 */
export function calculatePhilHealth(
  monthlyBasicSalary: number,
  premiumRate: number = PHILHEALTH_RATES.contribution_rate,
): {
  employee: number;
  employer: number;
  total: number;
} {
  // Clamp to floor/ceiling
  const salary = Math.min(
    Math.max(monthlyBasicSalary, PHILHEALTH_RATES.premium_rate_floor),
    PHILHEALTH_RATES.premium_rate_ceiling,
  );

  const total = round2(salary * premiumRate);
  const employee = round2(total * PHILHEALTH_RATES.employer_share_ratio);
  const employer = round2(total * PHILHEALTH_RATES.employee_share_ratio);

  return { employee, employer, total };
}

/**
 * Calculate Pag-IBIG (HDMF) contribution
 *
 * @param monthlyBasicSalary - Monthly basic salary
 * @returns Object with employee and employer contributions
 *
 * @example
 * ```ts
 * const pagibig = calculatePagIBIG(15000);
 * // { employee: 150, employer: 200, total: 350, employeeRate: '1%', employerRate: '2%' }
 * ```
 */
export function calculatePagIBIG(monthlyBasicSalary: number): {
  employee: number;
  employer: number;
  total: number;
  employeeRate: string;
  employerRate: string;
} {
  let employeeContribution: number;
  let employerContribution: number;
  let employeeRateStr: string;
  let employerRateStr: string;

  if (monthlyBasicSalary <= PAGIBIG_RATES.max_basic_salary) {
    employeeContribution = round2(monthlyBasicSalary * PAGIBIG_RATES.employee_rate_low);
    employerContribution = round2(monthlyBasicSalary * PAGIBIG_RATES.employer_rate_low);
    employeeRateStr = '1%';
    employerRateStr = '2%';
  } else {
    employeeContribution = PAGIBIG_RATES.max_monthly_contribution;
    employerContribution = PAGIBIG_RATES.max_monthly_contribution;
    employeeRateStr = '2% (max ₱200)';
    employerRateStr = '2% (max ₱200)';
  }

  return {
    employee: employeeContribution,
    employer: employerContribution,
    total: round2(employeeContribution + employerContribution),
    employeeRate: employeeRateStr,
    employerRate: employerRateStr,
  };
}

/**
 * Calculate all mandatory government contributions
 *
 * @param monthlyBasicSalary - Monthly basic salary
 * @returns Object with SSS, PhilHealth, Pag-IBIG, and total
 *
 * @example
 * ```ts
 * const contributions = calculateAllContributions(30000);
 * // { sss: {...}, philHealth: {...}, pagIBIG: {...}, total: {...} }
 * ```
 */
export function calculateAllContributions(monthlyBasicSalary: number): {
  sss: ReturnType<typeof calculateSSS>;
  philHealth: ReturnType<typeof calculatePhilHealth>;
  pagIBIG: ReturnType<typeof calculatePagIBIG>;
  total: {
    employee: number;
    employer: number;
    combined: number;
  };
} {
  const sss = calculateSSS(monthlyBasicSalary);
  const philHealth = calculatePhilHealth(monthlyBasicSalary);
  const pagIBIG = calculatePagIBIG(monthlyBasicSalary);

  const totalEmployee = round2(sss.employee + philHealth.employee + pagIBIG.employee);
  const totalEmployer = round2(sss.employer + philHealth.employer + pagIBIG.employer);

  return {
    sss,
    philHealth,
    pagIBIG,
    total: {
      employee: totalEmployee,
      employer: totalEmployer,
      combined: round2(totalEmployee + totalEmployer),
    },
  };
}

// ===== BIR FORM 2316 SIMPLIFIED =====

/**
 * Compute simplified BIR Form 2316 data
 *
 * @param data - Basic income data
 * @returns BIR 2316 computed fields
 *
 * @example
 * ```ts
 * const bir = computeBIR2316({
 *   compensationIncome: 600000,
 *   statutoryBenefits: 12000,
 *   nonTaxableAllowances: 30000,
 *   deMinimisBenefits: 10000,
 * });
 * ```
 */
export function computeBIR2316(data: {
  compensationIncome: number;
  statutoryBenefits?: number;
  nonTaxableAllowances?: number;
  deMinimisBenefits?: number;
  taxWithheld?: number;
}): BIR2316Data {
  const {
    compensationIncome,
    statutoryBenefits = 0,
    nonTaxableAllowances = 0,
    deMinimisBenefits = 0,
    taxWithheld = 0,
  } = data;

  // Taxable income = compensation - exemptions
  const taxableIncome = Math.max(
    0,
    compensationIncome - statutoryBenefits - nonTaxableAllowances - deMinimisBenefits,
  );

  const taxDue = computeIncomeTax(taxableIncome);
  const taxPayable = Math.max(0, taxDue - taxWithheld);
  const taxRefund = Math.max(0, taxWithheld - taxDue);

  return {
    compensationIncome,
    statutoryBenefits,
    nonTaxableAllowances,
    deMinimisBenefits,
    taxableIncome,
    taxDue,
    taxWithheld,
    taxPayable,
    taxRefund,
  };
}

// ===== UTILITY =====

/**
 * Calculate effective tax rate
 *
 * @param taxAmount - Total tax paid
 * @param totalIncome - Total income
 * @returns Effective tax rate as percentage
 *
 * @example
 * ```ts
 * effectiveTaxRate(72500, 600000); // 12.08
 * ```
 */
export function effectiveTaxRate(taxAmount: number, totalIncome: number): number {
  if (totalIncome === 0) return 0;
  return round2((taxAmount / totalIncome) * 100);
}

/**
 * Calculate marginal tax rate for a given income
 *
 * @param annualIncome - Annual taxable income
 * @returns Marginal tax rate as percentage
 *
 * @example
 * ```ts
 * marginalTaxRate(600000); // 20
 * marginalTaxRate(200000); // 0
 * marginalTaxRate(1000000); // 25
 * ```
 */
export function marginalTaxRate(annualIncome: number): number {
  for (const bracket of INCOME_TAX_BRACKETS) {
    if (annualIncome <= bracket.max) {
      return bracket.rate * 100;
    }
  }
  const last = INCOME_TAX_BRACKETS[INCOME_TAX_BRACKETS.length - 1];
  return last.rate * 100;
}

// --- Internal Helpers ---

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
