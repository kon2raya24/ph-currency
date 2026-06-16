/**
 * Philippine Peso and world currency constants
 * @module ph-currency
 */

import { CurrencyInfo, Denomination } from './types';

/**
 * Philippine Peso currency info
 */
export const PHP: CurrencyInfo = {
  code: 'PHP',
  name: 'Philippine Peso',
  symbol: '₱',
  country: 'Philippines',
  decimalPlaces: 2,
};

/**
 * Common world currencies
 */
export const CURRENCIES: Record<string, CurrencyInfo> = {
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', country: 'Philippines', decimalPlaces: 2 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', decimalPlaces: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', country: 'Eurozone', decimalPlaces: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom', decimalPlaces: 2 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan', decimalPlaces: 0 },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China', decimalPlaces: 2 },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'South Korea', decimalPlaces: 0 },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore', decimalPlaces: 2 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia', decimalPlaces: 2 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada', decimalPlaces: 2 },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', country: 'Hong Kong', decimalPlaces: 2 },
  TWD: { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', country: 'Taiwan', decimalPlaces: 0 },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia', decimalPlaces: 2 },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', country: 'Thailand', decimalPlaces: 2 },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'Indonesia', decimalPlaces: 0 },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India', decimalPlaces: 2 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'United Arab Emirates', decimalPlaces: 2 },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', country: 'Saudi Arabia', decimalPlaces: 2 },
  QAR: { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', country: 'Qatar', decimalPlaces: 2 },
  OMR: { code: 'OMR', name: 'Omani Rial', symbol: '﷼', country: 'Oman', decimalPlaces: 3 },
  BHD: { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BD', country: 'Bahrain', decimalPlaces: 3 },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', country: 'Kuwait', decimalPlaces: 3 },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand', decimalPlaces: 2 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland', decimalPlaces: 2 },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden', decimalPlaces: 2 },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway', decimalPlaces: 2 },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark', decimalPlaces: 2 },
  RUB: { code: 'RUB', name: 'Russian Ruble', symbol: '₽', country: 'Russia', decimalPlaces: 2 },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil', decimalPlaces: 2 },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'Mexico', decimalPlaces: 2 },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa', decimalPlaces: 2 },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'Turkey', decimalPlaces: 2 },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', country: 'Egypt', decimalPlaces: 2 },
};

/**
 * Philippine Peso denominations (bills and coins)
 */
export const PH_DENOMINATIONS: Denomination[] = [
  // Bills
  { value: 1000, type: 'bill', name: '₱1,000 Bill' },
  { value: 500, type: 'bill', name: '₱500 Bill' },
  { value: 200, type: 'bill', name: '₱200 Bill' },
  { value: 100, type: 'bill', name: '₱100 Bill' },
  { value: 50, type: 'bill', name: '₱50 Bill' },
  { value: 20, type: 'bill', name: '₱20 Bill' },
  // Coins
  { value: 20, type: 'coin', name: '₱20 Coin' },
  { value: 10, type: 'coin', name: '₱10 Coin' },
  { value: 5, type: 'coin', name: '₱5 Coin' },
  { value: 1, type: 'coin', name: '₱1 Coin' },
  { value: 0.25, type: 'coin', name: '25¢ Coin' },
  { value: 0.10, type: 'coin', name: '10¢ Coin' },
  { value: 0.05, type: 'coin', name: '5¢ Coin' },
];

/**
 * Default exchange rates (approximate, against PHP)
 * These serve as fallback rates when no live data is available.
 */
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 56.50,
  EUR: 61.00,
  GBP: 71.00,
  JPY: 0.37,
  CNY: 7.70,
  KRW: 0.041,
  SGD: 41.00,
  AUD: 37.00,
  CAD: 41.00,
  HKD: 7.24,
  TWD: 1.74,
  MYR: 12.00,
  THB: 1.58,
  IDR: 0.0035,
  INR: 0.67,
  AED: 15.40,
  SAR: 15.06,
  QAR: 15.54,
  OMR: 146.80,
  BHD: 149.60,
  KWD: 184.50,
  NZD: 34.00,
  CHF: 63.50,
  SEK: 5.20,
  NOK: 5.30,
  DKK: 8.20,
  RUB: 0.62,
  BRL: 10.20,
  MXN: 3.20,
  TRY: 1.70,
  ZAR: 3.10,
  EGP: 1.15,
};

/**
 * Philippine VAT rates
 */
export const VAT_RATES = {
  standard: 0.12,
  reduced: 0.05,
  zero: 0,
  exempt: 0,
} as const;

/**
 * BIR withholding tax rates (2024)
 * Source: Bureau of Internal Revenue, Philippines
 */
export const WITHHOLDING_TAX_RATES: Record<string, number | Record<string, number>> = {
  // Professional fees, talent fees, commissions
  professional_fee: {
    general: 0.10,
    top_withholding_agent: 0.15,
  },
  // Rental income
  rental: {
    general: 0.05,
    top_withholding_agent: 0.10,
  },
  // Services (independent contractor, professional)
  services: {
    general: 0.10,
    top_withholding_agent: 0.15,
  },
  // Interest income from banks
  interest: 0.20,
  // Royalty income (general)
  royalty: 0.10,
  // Royalty income (books, literary works, music)
  royalty_books: 0.10,
  // Dividend income (domestic corporation)
  dividend_domestic: 0.10,
  // Dividend income (foreign corporation)
  dividend_foreign: 0.15,
  // Prizes exceeding ₱10,000
  prize: 0.20,
  // Commission
  commission: {
    general: 0.10,
    top_withholding_agent: 0.15,
  },
  // Contractual employees
  contractual: 0.10,
};

/**
 * Philippine income tax brackets (TRAIN Law / CREATE Act)
 * Annual taxable income brackets for compensation earners
 */
export const INCOME_TAX_BRACKETS = [
  { min: 0, max: 250000, rate: 0, description: 'Not over ₱250,000' },
  { min: 250000, max: 400000, rate: 0.15, excessOver: 250000, description: 'Over ₱250,000 but not over ₱400,000' },
  { min: 400000, max: 800000, rate: 0.20, excessOver: 400000, flatAmount: 22500, description: 'Over ₱400,000 but not over ₱800,000' },
  { min: 800000, max: 2000000, rate: 0.25, excessOver: 800000, flatAmount: 102500, description: 'Over ₱800,000 but not over ₱2,000,000' },
  { min: 2000000, max: 8000000, rate: 0.30, excessOver: 2000000, flatAmount: 402500, description: 'Over ₱2,000,000 but not over ₱8,000,000' },
  { min: 8000000, max: Infinity, rate: 0.35, excessOver: 8000000, flatAmount: 2202500, description: 'Over ₱8,000,000' },
];

/**
 * Final withholding tax rates for certain income types
 */
export const FINAL_WHT_RATES: Record<string, number> = {
  interest_domestic_banks: 0.20,
  interest_foreign_currency_deposits: 0.15,
  royalties_books: 0.10,
  royalties_general: 0.20,
  prize_10k_below: 0.20,
  prize_above_10k: 0.20,
  dividend_domestic: 0.10,
  dividend_foreign: 0.15,
  sale_shares_stock_unlisted: 0.05,
  sale_real_property: 0.06,
};

/**
 * Social Security System (SSS) contribution rates (2024)
 */
export const SSS_RATES = {
  monthly_salary_credit_min: 4000,
  monthly_salary_credit_max: 30000,
  employer_share: 0.095,
  employee_share: 0.045,
  total_contribution_rate: 0.14,
  max_monthly_contribution: 3000,
  min_monthly_contribution: 500,
} as const;

/**
 * PhilHealth contribution rates (2024)
 */
export const PHILHEALTH_RATES = {
  contribution_rate: 0.05,
  premium_rate_floor: 10000,
  premium_rate_ceiling: 100000,
  employer_share_ratio: 0.5,
  employee_share_ratio: 0.5,
} as const;

/**
 * Pag-IBIG (HDMF) contribution rates
 */
export const PAGIBIG_RATES = {
  employee_rate_low: 0.01,
  employee_rate_high: 0.02,
  employer_rate_low: 0.02,
  employer_rate_high: 0.02,
  max_monthly_contribution: 200,
  min_basic_salary_threshold: 1500,
  max_basic_salary: 5000,
} as const;

/**
 * Expanded withholding tax (EWT) rates
 */
export const EWT_RATES: Record<string, number> = {
  goods: 0.01,
  services: 0.02,
  rentals_real_property: 0.05,
  professional_fees: 0.10,
  commissions: 0.10,
  royalties: 0.10,
  contractual_employees: 0.10,
  agents_brokers: 0.10,
  importers: 0.01,
};
