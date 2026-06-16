/**
 * Philippine Peso formatting utilities
 * @module ph-currency/format
 *
 * Provides comprehensive formatting and parsing functions for the
 * Philippine Peso (₱) and other currencies.
 *
 * @example
 * ```ts
 * import { formatPHPeso, parsePHPeso, formatCurrency } from 'ph-currency';
 *
 * formatPHPeso(1234567.89); // "₱1,234,567.89"
 * formatPHPeso(1234567.89, { showSymbol: false }); // "1,234,567.89"
 * parsePHPeso("₱1,234,567.89"); // 1234567.89
 * formatCurrency(1234.56, 'USD'); // "$1,234.56"
 * ```
 */

import { CURRENCIES } from './constants';
import { CurrencyInfo, FormattedCurrency } from './types';

export interface FormatOptions {
  /** Show currency symbol (default: true) */
  showSymbol?: boolean;
  /** Show currency code (default: false) */
  showCode?: boolean;
  /** Number of decimal places (default: 2) */
  decimals?: number;
  /** Use parentheses for negative numbers (default: false) */
  parenthesesForNegative?: boolean;
  /** Prefix with + for positive (default: false) */
  showSign?: boolean;
  /** Locale for formatting (default: 'en-PH') */
  locale?: string;
  /** Custom symbol override */
  customSymbol?: string;
  /** Use abbreviations for large numbers (default: false) */
  abbreviate?: boolean;
}

/**
 * Format a number as Philippine Peso (₱)
 *
 * @param amount - The numeric amount to format
 * @param options - Formatting options
 * @returns Formatted PHP string
 *
 * @example
 * ```ts
 * formatPHPeso(1234.56);              // "₱1,234.56"
 * formatPHPeso(1234.56, { showSymbol: false }); // "1,234.56"
 * formatPHPeso(-500, { parenthesesForNegative: true }); // "(₱500.00)"
 * formatPHPeso(1234, { showSign: true }); // "+₱1,234.00"
 * formatPHPeso(1234567890);           // "₱1,234,567,890.00"
 * ```
 */
export function formatPHPeso(amount: number, options?: FormatOptions): string {
  const opts: FormatOptions = {
    showSymbol: true,
    decimals: 2,
    locale: 'en-PH',
    ...options,
  };

  const formatted = formatNumber(amount, opts.decimals!, opts.locale);
  const symbol = opts.customSymbol || '₱';
  const sign = opts.showSign && amount > 0 ? '+' : '';

  if (opts.parenthesesForNegative && amount < 0) {
    const absFormatted = formatNumber(Math.abs(amount), opts.decimals!, opts.locale);
    if (!opts.showSymbol && !opts.customSymbol) return `(${sign}${absFormatted})`;
    return `(${sign}${symbol}${absFormatted})`;
  }

  if (!opts.showSymbol && !opts.customSymbol) return `${sign}${formatted}`;
  return `${sign}${symbol}${formatted}`;
}

/**
 * Format a number as Philippine Peso with words (e.g., for checks)
 *
 * @param amount - The numeric amount to format
 * @returns Amount written in words
 *
 * @example
 * ```ts
 * formatPHPesoInWords(1234.56);  // "One thousand two hundred thirty-four pesos and 56/100"
 * formatPHPesoInWords(500);      // "Five hundred pesos only"
 * formatPHPesoInWords(1000000);  // "One million pesos only"
 * ```
 */
export function formatPHPesoInWords(amount: number): string {
  if (amount < 0) {
    return `Negative ${formatPHPesoInWords(Math.abs(amount))}`;
  }

  const pesos = Math.floor(amount);
  const centavos = Math.round((amount - pesos) * 100);

  let result = '';

  if (pesos === 0) {
    result = 'Zero pesos';
  } else {
    const words = numberToWords(pesos);
    result = `${words.charAt(0).toUpperCase() + words.slice(1)} pesos`;
  }

  if (centavos > 0) {
    result += ` and ${centavos.toString().padStart(2, '0')}/100`;
  } else {
    result += ' only';
  }

  return result;
}

/**
 * Parse a PHP-formatted string back to a number
 *
 * @param formatted - The formatted PHP string
 * @returns Parsed numeric value
 *
 * @example
 * ```ts
 * parsePHPeso("₱1,234.56");    // 1234.56
 * parsePHPeso("1234.56");      // 1234.56
 * parsePHPeso("₱1,234,567");   // 1234567
 * parsePHPeso("(₱500.00)");    // -500
 * parsePHPeso("₱-100");        // -100
 * ```
 */
export function parsePHPeso(formatted: string): number {
  let cleaned = formatted.trim();

  // Handle parentheses for negative
  const isNegative = /^\(.*\)$/.test(cleaned);
  if (isNegative) {
    cleaned = cleaned.replace(/[()]/g, '');
  }

  // Remove all non-numeric characters except decimal point and negative sign
  cleaned = cleaned.replace(/[^0-9.-]/g, '');

  // Handle double negative or minus signs
  const num = parseFloat(cleaned);

  if (isNaN(num)) {
    throw new Error(`Invalid PHP amount: "${formatted}"`);
  }

  return isNegative ? -Math.abs(num) : num;
}

/**
 * Format amount with a specific currency
 *
 * @param amount - The numeric amount
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @param options - Formatting options
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency(1234.56, 'USD');  // "$1,234.56"
 * formatCurrency(1234.56, 'EUR');  // "€1,234.56"
 * formatCurrency(1234.56, 'GBP');  // "£1,234.56"
 * ```
 */
export function formatCurrency(
  amount: number,
  currencyCode: string,
  options?: FormatOptions,
): string {
  const currency = CURRENCIES[currencyCode];
  if (!currency) {
    throw new Error(`Unknown currency: ${currencyCode}`);
  }

  const opts: FormatOptions = {
    decimals: currency.decimalPlaces,
    locale: 'en-US',
    ...options,
    showSymbol: true,
    customSymbol: currency.symbol,
  };

  return formatPHPeso(amount, opts);
}

/**
 * Format amount as abbreviated (e.g., K, M, B)
 *
 * @param amount - The numeric amount
 * @param decimals - Decimal places for abbreviations (default: 1)
 * @returns Abbreviated string
 *
 * @example
 * ```ts
 * formatAbbreviated(1234);        // "1.2K"
 * formatAbbreviated(1234567);     // "1.2M"
 * formatAbbreviated(1234567890);  // "1.2B"
 * formatAbbreviated(500);         // "500"
 * ```
 */
export function formatAbbreviated(amount: number, decimals: number = 1): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 1e12) {
    return `${sign}${(abs / 1e12).toFixed(decimals)}T`;
  }
  if (abs >= 1e9) {
    return `${sign}${(abs / 1e9).toFixed(decimals)}B`;
  }
  if (abs >= 1e6) {
    return `${sign}${(abs / 1e6).toFixed(decimals)}M`;
  }
  if (abs >= 1e3) {
    return `${sign}${(abs / 1e3).toFixed(decimals)}K`;
  }
  // For amounts < 1000, show without unnecessary decimals
  return amount % 1 === 0 ? amount.toFixed(0) : amount.toFixed(decimals);
}

/**
 * Format amount with comma separators
 *
 * @param amount - The numeric amount
 * @param decimals - Number of decimal places (default: 2)
 * @returns Comma-formatted string
 *
 * @example
 * ```ts
 * formatWithCommas(1234567.891); // "1,234,567.89"
 * formatWithCommas(1000);        // "1,000.00"
 * ```
 */
export function formatWithCommas(amount: number, decimals: number = 2): string {
  return formatNumber(amount, decimals, 'en-US');
}

/**
 * Get currency info for a given code
 *
 * @param code - ISO 4217 currency code
 * @returns Currency information
 *
 * @example
 * ```ts
 * getCurrencyInfo('PHP'); // { code: 'PHP', name: 'Philippine Peso', symbol: '₱', ... }
 * getCurrencyInfo('USD'); // { code: 'USD', name: 'US Dollar', symbol: '$', ... }
 * ```
 */
export function getCurrencyInfo(code: string): CurrencyInfo {
  const currency = CURRENCIES[code.toUpperCase()];
  if (!currency) {
    throw new Error(`Unknown currency: ${code}`);
  }
  return { ...currency };
}

/**
 * Get all supported currencies
 *
 * @returns Array of currency information objects
 */
export function getAllCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCIES).map((c) => ({ ...c }));
}

// --- Internal Helpers ---

function formatNumber(
  amount: number,
  decimals: number,
  locale: string = 'en-US',
): string {
  return amount.toLocaleString(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function numberToWords(num: number): string {
  if (num === 0) return 'zero';

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function convertGroup(n: number): string {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? '-' + ones[n % 10] : '');
    }
    return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + convertGroup(n % 100) : '');
  }

  const parts: string[] = [];
  const billions = Math.floor(num / 1e9);
  const millions = Math.floor((num % 1e9) / 1e6);
  const thousands = Math.floor((num % 1e6) / 1e3);
  const remainder = num % 1000;

  if (billions) parts.push(convertGroup(billions) + ' billion');
  if (millions) parts.push(convertGroup(millions) + ' million');
  if (thousands) parts.push(convertGroup(thousands) + ' thousand');
  if (remainder) parts.push(convertGroup(remainder));

  return parts.join(' ');
}
