/**
 * Philippine Peso currency utilities - Type definitions
 * @module ph-currency
 */

/** Supported currency codes */
export type CurrencyCode =
  | 'PHP' | 'USD' | 'EUR' | 'GBP' | 'JPY'
  | 'CNY' | 'KRW' | 'SGD' | 'AUD' | 'CAD'
  | 'HKD' | 'TWD' | 'MYR' | 'THB' | 'IDR'
  | 'INR' | 'AED' | 'SAR' | 'QAR' | 'OMR'
  | 'BHD' | 'KWD' | 'NZD' | 'CHF' | 'SEK'
  | 'NOK' | 'DKK' | 'RUB' | 'BRL' | 'MXN'
  | 'ZAR' | 'EGP' | 'TRY' | 'PHP' | string;

/** Philippine VAT rates */
export type VATType = 'standard' | 'reduced' | 'zero' | 'exempt';

/** Withholding tax types for PH */
export type WHTType =
  | 'professional_fee'
  | 'rental'
  | 'services'
  | 'interest'
  | 'royalty'
  | 'dividend_domestic'
  | 'dividend_foreign'
  | 'prize'
  | 'commission'
  | 'contractual'
  | 'regular';

/** Income tax type for individuals */
export type IncomeTaxType = 'compensation' | 'business' | 'mixed';

/** Currency information */
export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  country: string;
  decimalPlaces: number;
}

/** Formatted currency result */
export interface FormattedCurrency {
  amount: number;
  formatted: string;
  currency: string;
  symbol: string;
}

/** Tax calculation result */
export interface TaxResult {
  gross: number;
  taxAmount: number;
  netAmount: number;
  taxRate: number;
  taxType: string;
}

/** Exchange rate pair */
export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  inverse: number;
}

/** Denomination */
export interface Denomination {
  value: number;
  type: 'bill' | 'coin';
  name: string;
}

/** Breakdown of amounts into denominations */
export interface DenominationBreakdown {
  total: number;
  denominations: { denomination: Denomination; count: number; subtotal: number }[];
  totalPieces: number;
}

/** Income tax bracket result */
export interface IncomeTaxBracket {
  range: string;
  taxRate: string;
  amount: number;
  tax: number;
}

/** BIR Form 2316 data */
export interface BIR2316Data {
  compensationIncome: number;
  statutoryBenefits: number;
  nonTaxableAllowances: number;
  deMinimisBenefits: number;
  taxableIncome: number;
  taxDue: number;
  taxWithheld: number;
  taxPayable: number;
  taxRefund: number;
}
