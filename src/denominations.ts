/**
 * Philippine Peso denominations utilities
 * @module ph-currency/denominations
 *
 * Utilities for breaking down Philippine Peso amounts into
 * individual bills and coins.
 *
 * @example
 * ```ts
 * import { getDenominationBreakdown, countBills, countCoins } from 'ph-currency';
 *
 * const breakdown = getDenominationBreakdown(1575.50);
 * // { total: 1575.50, denominations: [...], totalPieces: 11 }
 * ```
 */

import { PH_DENOMINATIONS } from './constants';
import { Denomination, DenominationBreakdown } from './types';

// Type exports for consumers
// Add specific types as needed

// Type exports for consumers
// Add specific types as needed

// Type exports for consumers
// Add specific types as needed

/**
 * Get breakdown of amount into Philippine Peso denominations
 *
 * Uses the greedy algorithm to find the optimal combination
 * of bills and coins.
 *
 * @param amount - Amount to break down
 * @param preferBillsOverCoins - Prefer larger bill denominations (default: true)
 * @returns Denomination breakdown
 *
 * @example
 * ```ts
 * const breakdown = getDenominationBreakdown(3750);
 * // { total: 3750, denominations: [
 * //   { denomination: { value: 1000, type: 'bill', name: '₱1,000 Bill' }, count: 3, subtotal: 3000 },
 * //   { denomination: { value: 500, type: 'bill', name: '₱500 Bill' }, count: 1, subtotal: 500 },
 * //   { denomination: { value: 50, type: 'bill', name: '₱50 Bill' }, count: 5, subtotal: 250 }
 * // ], totalPieces: 9 }
 * ```
 */
export function getDenominationBreakdown(
  amount: number,
  preferBillsOverCoins: boolean = true,
): DenominationBreakdown {
  let remaining = Math.round(amount * 100); // Work with centavos to avoid float issues
  const result: DenominationBreakdown['denominations'] = [];

  // Sort denominations: bills first (largest to smallest), then coins (largest to smallest)
  const sorted = [...PH_DENOMINATIONS].sort((a, b) => {
    if (preferBillsOverCoins) {
      if (a.type === 'bill' && b.type === 'coin') return -1;
      if (a.type === 'coin' && b.type === 'bill') return 1;
    }
    return b.value - a.value;
  });

  // Deduplicate: merge bill and coin with same value (prefer bill)
  const seen = new Set<number>();
  const unique = sorted.filter((d) => {
    if (seen.has(d.value)) return false;
    seen.add(d.value);
    return true;
  });

  for (const denom of unique) {
    const denomCentavos = Math.round(denom.value * 100);
    if (denomCentavos <= 0) continue;
    const count = Math.floor(remaining / denomCentavos);
    if (count > 0) {
      remaining -= count * denomCentavos;
      result.push({
        denomination: { ...denom },
        count,
        subtotal: round2(count * denom.value),
      });
    }
  }

  const totalPieces = result.reduce((sum, d) => sum + d.count, 0);

  return {
    total: round2(amount),
    denominations: result,
    totalPieces,
  };
}

/**
 * Count how many bills (not coins) are needed
 *
 * @param amount - Amount to count
 * @returns Number of bills
 *
 * @example
 * ```ts
 * countBills(3500); // 4 (3×₱1000 + 1×₱500)
 * countBills(50);   // 1 (1×₱50)
 * ```
 */
export function countBills(amount: number): number {
  if (amount === null || amount === undefined) throw new Error("Invalid input");
  let remaining = Math.round(amount * 100);
  let count = 0;

  const bills = PH_DENOMINATIONS.filter((d) => d.type === 'bill')
    .sort((a, b) => b.value - a.value);

  for (const bill of bills) {
    const billCentavos = Math.round(bill.value * 100);
    const c = Math.floor(remaining / billCentavos);
    count += c;
    remaining -= c * billCentavos;
  }

  return count;
}

/**
 * Count how many coins are needed
 *
 * @param amount - Amount to count
 * @returns Number of coins
 *
 * @example
 * ```ts
 * countCoins(12.50); // 15 (1×₱10 + 2×₱1 + 1×25¢ + 1×25¢)
 * ```
 */
export function countCoins(amount: number): number {
  if (amount === null || amount === undefined) throw new Error("Invalid input");
  let remaining = Math.round(amount * 100);
  let count = 0;

  const coins = PH_DENOMINATIONS.filter((d) => d.type === 'coin')
    .sort((a, b) => b.value - a.value);

  for (const coin of coins) {
    const coinCentavos = Math.round(coin.value * 100);
    if (coinCentavos <= 0) continue;
    const c = Math.floor(remaining / coinCentavos);
    count += c;
    remaining -= c * coinCentavos;
  }

  return count;
}

/**
 * Get all available Philippine Peso denominations
 *
 * @returns Array of all denominations
 */
export function getAllDenominations(): Denomination[] {
  return PH_DENOMINATIONS.map((d) => ({ ...d }));
}

/**
 * Get bill denominations only
 *
 * @returns Array of bill denominations
 */
export function getBillDenominations(): Denomination[] {
  return PH_DENOMINATIONS.filter((d) => d.type === 'bill').map((d) => ({ ...d }));
}

/**
 * Get coin denominations only
 *
 * @returns Array of coin denominations
 */
export function getCoinDenominations(): Denomination[] {
  return PH_DENOMINATIONS.filter((d) => d.type === 'coin').map((d) => ({ ...d }));
}

/**
 * Format denomination breakdown as a readable string
 *
 * @param breakdown - The breakdown result from getDenominationBreakdown
 * @returns Human-readable string
 *
 * @example
 * ```ts
 * const breakdown = getDenominationBreakdown(3750);
 * formatDenominationBreakdown(breakdown);
 * // "₱3,750.00 breakdown:\n  3× ₱1,000 Bill = ₱3,000\n  1× ₱500 Bill = ₱500\n  5× ₱50 Bill = ₱250\n  Total pieces: 9"
 * ```
 */
export function formatDenominationBreakdown(breakdown: DenominationBreakdown): string {
  if (breakdown === null || breakdown === undefined) throw new Error("Invalid input");
  const lines: string[] = [];
  lines.push(`₱${breakdown.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })} breakdown:`);

  for (const d of breakdown.denominations) {
    lines.push(
      `  ${d.count}× ${d.denomination.name} = ₱${d.subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
    );
  }

  lines.push(`  Total pieces: ${breakdown.totalPieces}`);
  return lines.join('\n');
}

// --- Internal Helpers ---

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
