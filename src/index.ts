/**
 * ph-currency - Philippine Peso Utilities
 *
 * A comprehensive TypeScript library for Philippine Peso (₱) operations
 * including currency formatting, conversion, tax calculations, and more.
 *
 * @packageDocumentation
 * @example
 * ```ts
 * import {
 *   formatPHPeso,
 *   parsePHPeso,
 *   usdToPhp,
 *   convert,
 *   calculateVAT,
 *   calculateWithholdingTax,
 *   computeIncomeTax,
 *   getDenominationBreakdown,
 * } from 'ph-currency';
 *
 * // Format currency
 * formatPHPeso(1234567.89); // "₱1,234,567.89"
 *
 * // Convert currencies
 * usdToPhp(100);            // 5650
 * convert(100, 'USD', 'EUR'); // ~91.77
 *
 * // Calculate taxes
 * calculateVAT(10000);      // 1200
 * calculateWithholdingTax(50000, 'services'); // 5000
 *
 * // Income tax (TRAIN Law)
 * computeIncomeTax(600000); // 72500
 *
 * // Denomination breakdown
 * const bd = getDenominationBreakdown(3750);
 * // { total: 3750, denominations: [...], totalPieces: 9 }
 * ```
 */

// Types
export type {
  CurrencyCode,
  VATType,
  WHTType,
  IncomeTaxType,
  CurrencyInfo,
  FormattedCurrency,
  TaxResult,
  ExchangeRate,
  Denomination,
  DenominationBreakdown,
  IncomeTaxBracket,
  BIR2316Data,
} from './types';

// Formatting
export {
  formatPHPeso,
  formatPHPesoInWords,
  parsePHPeso,
  formatCurrency,
  formatAbbreviated,
  formatWithCommas,
  getCurrencyInfo,
  getAllCurrencies,
} from './format';
export type { FormatOptions } from './format';

// Conversion
export {
  convert,
  usdToPhp,
  phpToUsd,
  eurToPhp,
  phpToEur,
  gbpToPhp,
  phpToGbp,
  jpyToPhp,
  phpToJpy,
  sgdToPhp,
  phpToSgd,
  cnyToPhp,
  phpToCny,
  krwToPhp,
  phpToKrw,
  audToPhp,
  phpToAud,
  cadToPhp,
  phpToCad,
  hkdToPhp,
  phpToHkd,
  thbToPhp,
  phpToThb,
  myrToPhp,
  phpToMyr,
  setExchangeRate,
  getExchangeRate,
  getAllExchangeRates,
  resetExchangeRates,
  getExchangeRatePair,
  compareCurrency,
} from './conversion';

// Tax calculations
export {
  calculateVAT,
  addVAT,
  removeVAT,
  vatBreakdown,
  applyVATType,
  calculateWithholdingTax,
  calculateFinalWHT,
  calculateEWT,
  computeIncomeTax,
  computeMonthlyWithholdingTax,
  computeAnnualizedWithholdingTax,
  getIncomeTaxBracket,
  listIncomeTaxBrackets,
  calculateSSS,
  calculatePhilHealth,
  calculatePagIBIG,
  calculateAllContributions,
  computeBIR2316,
  effectiveTaxRate,
  marginalTaxRate,
} from './tax';

// Denominations
export {
  getDenominationBreakdown,
  countBills,
  countCoins,
  getAllDenominations,
  getBillDenominations,
  getCoinDenominations,
  formatDenominationBreakdown,
} from './denominations';

// Validation
export {
  isValidAmount,
  isValidCurrencyCode,
  isPHP,
  isValidPHPFormatted,
  isAmountInRange,
  isPositive,
  isNonNegative,
  isValidExchangeRate,
  isValidVATRate,
  isValidTaxRate,
  hasCentavos,
  getCentavos,
  isRoundAmount,
  isValidBIRRef,
} from './validation';

// Constants
export {
  PHP,
  CURRENCIES,
  PH_DENOMINATIONS,
  EXCHANGE_RATES,
  VAT_RATES,
  WITHHOLDING_TAX_RATES,
  INCOME_TAX_BRACKETS,
  FINAL_WHT_RATES,
  SSS_RATES,
  PHILHEALTH_RATES,
  PAGIBIG_RATES,
  EWT_RATES,
} from './constants';
