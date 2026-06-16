import {
  getDenominationBreakdown, countBills, countCoins,
  getAllDenominations, getBillDenominations, getCoinDenominations,
  formatDenominationBreakdown,
} from '../src/denominations';

describe('getDenominationBreakdown', () => {
  it('breaks down a simple amount', () => {
    const result = getDenominationBreakdown(3500);
    expect(result.total).toBe(3500);
    expect(result.denominations.length).toBeGreaterThan(0);
    expect(result.totalPieces).toBe(4); // 3×1000 + 1×500
  });

  it('breaks down with coins', () => {
    const result = getDenominationBreakdown(1505.25);
    expect(result.total).toBe(1505.25);
    expect(result.totalPieces).toBeGreaterThan(0);
  });

  it('handles zero', () => {
    const result = getDenominationBreakdown(0);
    expect(result.total).toBe(0);
    expect(result.totalPieces).toBe(0);
  });

  it('handles small amounts', () => {
    const result = getDenominationBreakdown(2.50);
    expect(result.total).toBe(2.50);
    expect(result.totalPieces).toBeGreaterThan(0);
  });

  it('breaks down 1000', () => {
    const result = getDenominationBreakdown(1000);
    expect(result.total).toBe(1000);
    expect(result.denominations.some(d => d.denomination.value === 1000)).toBe(true);
  });
});

describe('countBills', () => {
  it('counts bills for 3500', () => {
    expect(countBills(3500)).toBe(4); // 3×1000 + 1×500
  });

  it('counts bills for 100', () => {
    expect(countBills(100)).toBe(1);
  });

  it('counts bills for 0', () => {
    expect(countBills(0)).toBe(0);
  });
});

describe('countCoins', () => {
  it('counts coins for 12.50', () => {
    expect(countCoins(12.50)).toBe(5); // 1×10 + 2×1 + 2×0.25
  });

  it('counts coins for 0', () => {
    expect(countCoins(0)).toBe(0);
  });

  it('counts coins for 0.50', () => {
    expect(countCoins(0.50)).toBeGreaterThan(0);
  });
});

describe('getAllDenominations', () => {
  it('returns all denominations', () => {
    const denom = getAllDenominations();
    expect(denom.length).toBe(13);
  });
});

describe('getBillDenominations', () => {
  it('returns only bills', () => {
    const bills = getBillDenominations();
    expect(bills.every(d => d.type === 'bill')).toBe(true);
    expect(bills.length).toBe(6); // 1000, 500, 200, 100, 50, 20
  });
});

describe('getCoinDenominations', () => {
  it('returns only coins', () => {
    const coins = getCoinDenominations();
    expect(coins.every(d => d.type === 'coin')).toBe(true);
  });
});

describe('formatDenominationBreakdown', () => {
  it('formats breakdown', () => {
    const breakdown = getDenominationBreakdown(3500);
    const formatted = formatDenominationBreakdown(breakdown);
    expect(formatted).toContain('₱3,500.00');
    expect(formatted).toContain('Total pieces');
  });
});
