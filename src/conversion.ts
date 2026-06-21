/**
 * Currency conversion utilities
 * @module ph-currency/conversion
 *
 * Provides exchange rate conversion between Philippine Peso and
 * 30+ world currencies. Includes both static (default) rates and
 * a custom rate store for live data.
 *
 * @example
 * ```ts
 * import { convert, usdToPhp, phpToUsd, setExchangeRate } from 'ph-currency';
 *
 * usdToPhp(100);           // 5650 (using default rate)
 * phpToUsd(5650);          // 100
 * convert(100, 'USD', 'EUR'); // 91.77
 *
 * // Use custom rates
 * setExchangeRate('USD', 57.25);
 * usdToPhp(100);           // 5725
 * ```
 */

import { EXCHANGE_RATES, CURRENCIES } from './constants';
import { ExchangeRate } from './types';

// Type exports for consumers
// Add specific types as needed

// Type exports for consumers
// Add specific types as needed

// Type exports for consumers
// Add specific types as needed

// Mutable rate store (can be updated at runtime)
const rateStore: Record<string, number> = { ...EXCHANGE_RATES };

/**
 * Set a custom exchange rate for a currency pair
 *
 * @param currency - The foreign currency code (e.g., 'USD')
 * @param phpRate - Exchange rate: 1 foreign = X PHP
 *
 * @example
 * ```ts
 * setExchangeRate('USD', 57.25);
 * ```
 */
export function setExchangeRate(currency: string, phpRate: number): void {
  if (phpRate <= 0) {
    throw new Error(`Exchange rate must be positive: ${phpRate}`);
  }
  rateStore[currency.toUpperCase()] = phpRate;
}

/**
 * Get the current exchange rate for a currency against PHP
 *
 * @param currency - The foreign currency code
 * @returns Exchange rate: 1 foreign = X PHP
 *
 * @example
 * ```ts
 * getExchangeRate('USD'); // 56.50
 * ```
 */
export function getExchangeRate(currency: string): number {
  const rate = rateStore[currency.toUpperCase()];
  if (rate === undefined) {
    throw new Error(`No exchange rate available for: ${currency}`);
  }
  return rate;
}

/**
 * Get all available exchange rates
 *
 * @returns Record of currency codes to PHP rates
 */
export function getAllExchangeRates(): Record<string, number> {
  return { ...rateStore };
}

/**
 * Reset exchange rates to defaults
 */
export function resetExchangeRates(): void {
  Object.keys(rateStore).forEach((key) => {
    rateStore[key] = EXCHANGE_RATES[key];
  });
}

/**
 * Convert USD to PHP
 *
 * @param usd - Amount in US Dollars
 * @param rate - Optional custom rate (default: rateStore.USD)
 * @returns Amount in Philippine Peso
 *
 * @example
 * ```ts
 * usdToPhp(100);      // 5650
 * usdToPhp(100, 57);  // 5700
 * usdToPhp(0.01);     // 0.57
 * ```
 */
export function usdToPhp(usd: number, rate?: number): number {
  return phpConvert(usd, rate ?? rateStore.USD);
}

/**
 * Convert PHP to USD
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate (default: rateStore.USD)
 * @returns Amount in US Dollars
 *
 * @example
 * ```ts
 * phpToUsd(5650);    // 100
 * phpToUsd(100);     // 1.77
 * ```
 */
export function phpToUsd(php: number, rate?: number): number {
  const r = rate ?? rateStore.USD;
  return round2(php / r);
}

/**
 * Convert EUR to PHP
 *
 * @param eur - Amount in Euros
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function eurToPhp(eur: number, rate?: number): number {
  return phpConvert(eur, rate ?? rateStore.EUR);
}

/**
 * Convert PHP to EUR
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Euros
 */
export function phpToEur(php: number, rate?: number): number {
  const r = rate ?? rateStore.EUR;
  return round2(php / r);
}

/**
 * Convert GBP to PHP
 *
 * @param gbp - Amount in British Pounds
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function gbpToPhp(gbp: number, rate?: number): number {
  return phpConvert(gbp, rate ?? rateStore.GBP);
}

/**
 * Convert PHP to GBP
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in British Pounds
 */
export function phpToGbp(php: number, rate?: number): number {
  const r = rate ?? rateStore.GBP;
  return round2(php / r);
}

/**
 * Convert JPY to PHP
 *
 * @param jpy - Amount in Japanese Yen
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function jpyToPhp(jpy: number, rate?: number): number {
  return phpConvert(jpy, rate ?? rateStore.JPY);
}

/**
 * Convert PHP to JPY
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Japanese Yen
 */
export function phpToJpy(php: number, rate?: number): number {
  const r = rate ?? rateStore.JPY;
  return round2(php / r);
}

/**
 * Convert SGD to PHP
 *
 * @param sgd - Amount in Singapore Dollars
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function sgdToPhp(sgd: number, rate?: number): number {
  return phpConvert(sgd, rate ?? rateStore.SGD);
}

/**
 * Convert PHP to SGD
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Singapore Dollars
 */
export function phpToSgd(php: number, rate?: number): number {
  const r = rate ?? rateStore.SGD;
  return round2(php / r);
}

/**
 * Convert CNY to PHP
 *
 * @param cny - Amount in Chinese Yuan
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function cnyToPhp(cny: number, rate?: number): number {
  return phpConvert(cny, rate ?? rateStore.CNY);
}

/**
 * Convert PHP to CNY
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Chinese Yuan
 */
export function phpToCny(php: number, rate?: number): number {
  const r = rate ?? rateStore.CNY;
  return round2(php / r);
}

/**
 * Convert KRW to PHP
 *
 * @param krw - Amount in South Korean Won
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function krwToPhp(krw: number, rate?: number): number {
  return phpConvert(krw, rate ?? rateStore.KRW);
}

/**
 * Convert PHP to KRW
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in South Korean Won
 */
export function phpToKrw(php: number, rate?: number): number {
  const r = rate ?? rateStore.KRW;
  return round2(php / r);
}

/**
 * Convert AUD to PHP
 *
 * @param aud - Amount in Australian Dollars
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function audToPhp(aud: number, rate?: number): number {
  return phpConvert(aud, rate ?? rateStore.AUD);
}

/**
 * Convert PHP to AUD
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Australian Dollars
 */
export function phpToAud(php: number, rate?: number): number {
  const r = rate ?? rateStore.AUD;
  return round2(php / r);
}

/**
 * Convert CAD to PHP
 *
 * @param cad - Amount in Canadian Dollars
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function cadToPhp(cad: number, rate?: number): number {
  return phpConvert(cad, rate ?? rateStore.CAD);
}

/**
 * Convert PHP to CAD
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Canadian Dollars
 */
export function phpToCad(php: number, rate?: number): number {
  const r = rate ?? rateStore.CAD;
  return round2(php / r);
}

/**
 * Convert HKD to PHP
 *
 * @param hkd - Amount in Hong Kong Dollars
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function hkdToPhp(hkd: number, rate?: number): number {
  return phpConvert(hkd, rate ?? rateStore.HKD);
}

/**
 * Convert PHP to HKD
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Hong Kong Dollars
 */
export function phpToHkd(php: number, rate?: number): number {
  const r = rate ?? rateStore.HKD;
  return round2(php / r);
}

/**
 * Convert THB to PHP
 *
 * @param thb - Amount in Thai Baht
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function thbToPhp(thb: number, rate?: number): number {
  return phpConvert(thb, rate ?? rateStore.THB);
}

/**
 * Convert PHP to THB
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Thai Baht
 */
export function phpToThb(php: number, rate?: number): number {
  const r = rate ?? rateStore.THB;
  return round2(php / r);
}

/**
 * Convert MYR to PHP
 *
 * @param myr - Amount in Malaysian Ringgit
 * @param rate - Optional custom rate
 * @returns Amount in Philippine Peso
 */
export function myrToPhp(myr: number, rate?: number): number {
  return phpConvert(myr, rate ?? rateStore.MYR);
}

/**
 * Convert PHP to MYR
 *
 * @param php - Amount in Philippine Peso
 * @param rate - Optional custom rate
 * @returns Amount in Malaysian Ringgit
 */
export function phpToMyr(php: number, rate?: number): number {
  const r = rate ?? rateStore.MYR;
  return round2(php / r);
}

/**
 * Generic currency conversion between any two currencies
 * Both currencies are converted through PHP as the base.
 *
 * @param amount - Amount to convert
 * @param from - Source currency code
 * @param to - Target currency code
 * @returns Converted amount
 *
 * @example
 * ```ts
 * convert(100, 'USD', 'EUR');  // ~91.77
 * convert(1000, 'PHP', 'USD'); // ~17.69
 * convert(100, 'JPY', 'USD');  // ~0.25
 * ```
 */
export function convert(amount: number, from: string, to: string): number {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  if (fromUpper === toUpper) return round2(amount);

  // If either is PHP, simple conversion
  if (fromUpper === 'PHP') {
    const rate = rateStore[toUpper];
    if (rate === undefined) throw new Error(`No rate for: ${toUpper}`);
    return round2(amount / rate);
  }
  if (toUpper === 'PHP') {
    const rate = rateStore[fromUpper];
    if (rate === undefined) throw new Error(`No rate for: ${fromUpper}`);
    return round2(amount * rate);
  }

  // Cross-currency via PHP
  const fromRate = rateStore[fromUpper];
  const toRate = rateStore[toUpper];
  if (fromRate === undefined) throw new Error(`No rate for: ${fromUpper}`);
  if (toRate === undefined) throw new Error(`No rate for: ${toUpper}`);

  return round2((amount * fromRate) / toRate);
}

/**
 * Get exchange rate between two currencies
 *
 * @param from - Source currency code
 * @param to - Target currency code
 * @returns ExchangeRate object
 *
 * @example
 * ```ts
 * getExchangeRatePair('USD', 'EUR'); // { from: 'USD', to: 'EUR', rate: 0.92, inverse: 1.09 }
 * ```
 */
export function getExchangeRatePair(from: string, to: string): ExchangeRate {
  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  if (fromUpper === toUpper) {
    return { from: fromUpper, to: toUpper, rate: 1, inverse: 1 };
  }

  const rate = convert(1, fromUpper, toUpper);
  const inverse = convert(1, toUpper, fromUpper);

  return { from: fromUpper, to: toUpper, rate, inverse };
}

/**
 * Compare two amounts in different currencies
 *
 * @param amount1 - First amount
 * @param currency1 - First currency
 * @param amount2 - Second amount
 * @param currency2 - Second currency
 * @returns -1, 0, or 1 (like Array comparator)
 *
 * @example
 * ```ts
 * compareCurrency(100, 'USD', 5000, 'PHP'); // 1 (USD is greater)
 * compareCurrency(100, 'USD', 5650, 'PHP'); // 0 (equal)
 * ```
 */
export function compareCurrency(
  amount1: number,
  currency1: string,
  amount2: number,
  currency2: string,
): -1 | 0 | 1 {
  const php1 = convert(amount1, currency1, 'PHP');
  const php2 = convert(amount2, currency2, 'PHP');
  if (php1 < php2) return -1;
  if (php1 > php2) return 1;
  return 0;
}

// --- Internal Helpers ---

function phpConvert(amount: number, phpRate: number): number {
  return round2(amount * phpRate);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
