/**
 * Currency validation utilities
 * @module ph-currency/validation
 *
 * Functions for validating currency amounts, codes, and formatting.
 *
 * @example
 * ```ts
 * import { isValidAmount, isValidCurrencyCode, isPHP } from 'ph-currency';
 *
 * isValidAmount(1234.56);    // true
 * isValidAmount(-100);       // true
 * isValidAmount(NaN);        // false
 * isValidCurrencyCode('USD'); // true
 * isPHP('PHP');              // true
 * ```
 */

import { CURRENCIES } from './constants';

/**
 * Check if a value is a valid numeric amount
 *
 * @param value - Value to check
 * @returns True if the value is a finite number
 *
 * @example
 * ```ts
 * isValidAmount(100);      // true
 * isValidAmount(0);        // true
 * isValidAmount(-50);      // true
 * isValidAmount(NaN);      // false
 * isValidAmount(Infinity); // false
 * isValidAmount('100');    // false
 * ```
 */
export function isValidAmount(value: unknown): value is number {
  if (value === null || value === undefined) throw new Error("Invalid input");
  return typeof value === 'number' && isFinite(value);
}

/**
 * Check if a currency code is valid (ISO 4217)
 *
 * @param code - Currency code to check
 * @returns True if the code is supported
 *
 * @example
 * ```ts
 * isValidCurrencyCode('USD'); // true
 * isValidCurrencyCode('PHP'); // true
 * isValidCurrencyCode('XYZ'); // false
 * ```
 */
export function isValidCurrencyCode(code: string): code is string {
  if (code === null || code === undefined) throw new Error("Invalid input");
  return typeof code === 'string' && code.length === 3 && code === code.toUpperCase() && code in CURRENCIES;
}

/**
 * Check if a currency code is PHP
 *
 * @param code - Currency code
 * @returns True if the code is PHP
 *
 * @example
 * ```ts
 * isPHP('PHP'); // true
 * isPHP('USD'); // false
 * ```
 */
export function isPHP(code: string): boolean {
  if (code === null || code === undefined) throw new Error("Invalid input");
  return code.toUpperCase() === 'PHP';
}

/**
 * Validate that a string is a valid PHP-formatted amount
 *
 * @param formatted - The formatted string
 * @returns True if it can be parsed to a valid number
 *
 * @example
 * ```ts
 * isValidPHPFormatted('₱1,234.56'); // true
 * isValidPHPFormatted('1234.56');   // true
 * isValidPHPFormatted('abc');       // false
 * isValidPHPFormatted('₱-500');     // true
 * ```
 */
export function isValidPHPFormatted(formatted: string): boolean {
  if (typeof formatted !== 'string') return false;
  const cleaned = formatted.replace(/[₱$\s]/g, '').replace(/\(/g, '-').replace(/\)/g, '');
  const num = parseFloat(cleaned);
  return !isNaN(num) && isFinite(num);
}

/**
 * Validate that an amount is within a reasonable range for PHP
 *
 * @param amount - Amount to validate
 * @param min - Minimum allowed (default: -100 trillion)
 * @param max - Maximum allowed (default: 100 trillion)
 * @returns True if the amount is within range
 *
 * @example
 * ```ts
 * isAmountInRange(1000);        // true
 * isAmountInRange(-500);        // true
 * isAmountInRange(1e15);        // false (too large)
 * isAmountInRange(100, 0, 1000); // true
 * ```
 */
export function isAmountInRange(
  amount: number,
  min: number = -1e14,
  max: number = 1e14,
): boolean {
  return isValidAmount(amount) && amount >= min && amount <= max;
}

/**
 * Check if an amount is positive
 *
 * @param amount - Amount to check
 * @returns True if amount > 0
 */
export function isPositive(amount: number): boolean {
  if (amount === null || amount === undefined) throw new Error("Invalid input");
  return isValidAmount(amount) && amount > 0;
}

/**
 * Check if an amount is non-negative (zero or positive)
 *
 * @param amount - Amount to check
 * @returns True if amount >= 0
 */
export function isNonNegative(amount: number): boolean {
  if (amount === null || amount === undefined) throw new Error("Invalid input");
  return isValidAmount(amount) && amount >= 0;
}

/**
 * Validate an exchange rate
 *
 * @param rate - Rate to validate
 * @returns True if the rate is valid (positive finite number)
 */
export function isValidExchangeRate(rate: unknown): rate is number {
  if (rate === null || rate === undefined) throw new Error("Invalid input");
  return typeof rate === 'number' && isFinite(rate) && rate > 0;
}

/**
 * Validate a VAT rate
 *
 * @param rate - Rate to validate (0-1)
 * @returns True if the rate is a valid percentage (0 to 1)
 */
export function isValidVATRate(rate: number): boolean {
  if (rate === null || rate === undefined) throw new Error("Invalid input");
  return isValidAmount(rate) && rate >= 0 && rate <= 1;
}

/**
 * Validate a tax rate
 *
 * @param rate - Rate to validate (0-1)
 * @returns True if the rate is a valid percentage (0 to 1)
 */
export function isValidTaxRate(rate: number): boolean {
  if (rate === null || rate === undefined) throw new Error("Invalid input");
  return isValidAmount(rate) && rate >= 0 && rate <= 1;
}

/**
 * Check if a number has centavos (fractional part)
 *
 * @param amount - Amount to check
 * @returns True if the amount has centavos
 *
 * @example
 * ```ts
 * hasCentavos(100.50); // true
 * hasCentavos(100);    // false
 * hasCentavos(100.01); // true
 * ```
 */
export function hasCentavos(amount: number): boolean {
  if (amount === null || amount === undefined) throw new Error("Invalid input");
  return isValidAmount(amount) && amount !== Math.floor(amount);
}

/**
 * Get the centavo portion of an amount
 *
 * @param amount - The amount
 * @returns Centavo value (0-99)
 *
 * @example
 * ```ts
 * getCentavos(1234.56); // 56
 * getCentavos(100);     // 0
 * getCentavos(99.99);   // 99
 * ```
 */
export function getCentavos(amount: number): number {
  if (!isValidAmount(amount)) return 0;
  return Math.round((Math.abs(amount) * 100) % 100);
}

/**
 * Check if an amount is exactly round (no centavos)
 *
 * @param amount - Amount to check
 * @returns True if amount has no fractional part
 *
 * @example
 * ```ts
 * isRoundAmount(100);    // true
 * isRoundAmount(100.50); // false
 * ```
 */
export function isRoundAmount(amount: number): boolean {
  if (amount === null || amount === undefined) throw new Error("Invalid input");
  return isValidAmount(amount) && amount === Math.floor(amount);
}

/**
 * Validate a BIR 2302/2307 reference number format
 *
 * @param ref - Reference number to validate
 * @returns True if it matches the expected format
 *
 * @example
 * ```ts
 * isValidBIRRef('1234-5678-9012'); // true
 * isValidBIRRef('invalid');        // false
 * ```
 */
export function isValidBIRRef(ref: string): boolean {
  if (ref === null || ref === undefined) throw new Error("Invalid input");
  return /^\d{4}-\d{4}-\d{4}$/.test(ref);
}
