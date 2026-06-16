import {
  calculateVAT, addVAT, removeVAT, vatBreakdown, applyVATType,
  calculateWithholdingTax, calculateFinalWHT, calculateEWT,
  computeIncomeTax, computeMonthlyWithholdingTax, computeAnnualizedWithholdingTax,
  getIncomeTaxBracket, listIncomeTaxBrackets,
  calculateSSS, calculatePhilHealth, calculatePagIBIG, calculateAllContributions,
  computeBIR2316, effectiveTaxRate, marginalTaxRate,
} from '../src/tax';

describe('calculateVAT', () => {
  it('calculates 12% VAT on amount', () => {
    expect(calculateVAT(10000)).toBe(1200);
  });

  it('calculates VAT with custom rate', () => {
    expect(calculateVAT(10000, 0.05)).toBe(500);
  });

  it('extracts VAT from inclusive amount', () => {
    expect(calculateVAT(11200, 0.12, true)).toBe(1200);
  });

  it('handles zero VAT', () => {
    expect(calculateVAT(10000, 0)).toBe(0);
  });

  it('handles small amounts', () => {
    expect(calculateVAT(100)).toBe(12);
  });
});

describe('addVAT', () => {
  it('adds 12% VAT', () => {
    expect(addVAT(10000)).toBe(11200);
  });

  it('adds with custom rate', () => {
    expect(addVAT(10000, 0.05)).toBe(10500);
  });
});

describe('removeVAT', () => {
  it('removes 12% VAT', () => {
    expect(removeVAT(11200)).toBe(10000);
  });

  it('removes with custom rate', () => {
    expect(removeVAT(10500, 0.05)).toBe(10000);
  });
});

describe('vatBreakdown', () => {
  it('breaks down inclusive amount', () => {
    const result = vatBreakdown(11200);
    expect(result.base).toBe(10000);
    expect(result.vat).toBe(1200);
    expect(result.total).toBe(11200);
  });

  it('breaks down with custom rate', () => {
    const result = vatBreakdown(10500, 0.05);
    expect(result.base).toBe(10000);
    expect(result.vat).toBe(500);
  });
});

describe('applyVATType', () => {
  it('applies standard VAT', () => {
    const result = applyVATType(10000, 'standard');
    expect(result.taxAmount).toBe(1200);
    expect(result.taxRate).toBe(0.12);
  });

  it('applies zero-rated VAT', () => {
    const result = applyVATType(10000, 'zero');
    expect(result.taxAmount).toBe(0);
  });

  it('applies exempt VAT', () => {
    const result = applyVATType(10000, 'exempt');
    expect(result.taxAmount).toBe(0);
  });
});

describe('calculateWithholdingTax', () => {
  it('calculates services WHT (general)', () => {
    const result = calculateWithholdingTax(50000, 'services');
    expect(result.taxAmount).toBe(5000);
    expect(result.netAmount).toBe(45000);
    expect(result.taxRate).toBe(0.10);
  });

  it('calculates services WHT (top agent)', () => {
    const result = calculateWithholdingTax(50000, 'services', true);
    expect(result.taxAmount).toBe(7500);
    expect(result.taxRate).toBe(0.15);
  });

  it('calculates interest WHT', () => {
    const result = calculateWithholdingTax(50000, 'interest');
    expect(result.taxAmount).toBe(10000);
    expect(result.taxRate).toBe(0.20);
  });

  it('calculates rental WHT', () => {
    const result = calculateWithholdingTax(50000, 'rental');
    expect(result.taxAmount).toBe(2500);
    expect(result.taxRate).toBe(0.05);
  });

  it('throws for unknown type', () => {
    expect(() => calculateWithholdingTax(50000, 'unknown')).toThrow('Unknown withholding tax type');
  });
});

describe('calculateFinalWHT', () => {
  it('calculates interest from domestic banks', () => {
    const result = calculateFinalWHT(50000, 'interest_domestic_banks');
    expect(result.taxAmount).toBe(10000);
    expect(result.taxRate).toBe(0.20);
  });

  it('calculates domestic dividend', () => {
    const result = calculateFinalWHT(50000, 'dividend_domestic');
    expect(result.taxAmount).toBe(5000);
    expect(result.taxRate).toBe(0.10);
  });

  it('throws for unknown type', () => {
    expect(() => calculateFinalWHT(50000, 'unknown_type' as any)).toThrow('Unknown final WHT type');
  });
});

describe('calculateEWT', () => {
  it('calculates EWT for professional fees', () => {
    const result = calculateEWT(100000, 'professional_fees');
    expect(result.taxAmount).toBe(10000);
    expect(result.taxRate).toBe(0.10);
  });

  it('calculates EWT for goods', () => {
    const result = calculateEWT(100000, 'goods');
    expect(result.taxAmount).toBe(1000);
    expect(result.taxRate).toBe(0.01);
  });

  it('throws for unknown type', () => {
    expect(() => calculateEWT(100000, 'unknown')).toThrow('Unknown EWT type');
  });
});

describe('computeIncomeTax', () => {
  it('returns 0 for income below 250K', () => {
    expect(computeIncomeTax(200000)).toBe(0);
    expect(computeIncomeTax(250000)).toBe(0);
  });

  it('computes tax for 250K-400K bracket', () => {
    expect(computeIncomeTax(300000)).toBe(7500); // (300K-250K) * 15%
  });

  it('computes tax for 400K-800K bracket', () => {
    expect(computeIncomeTax(600000)).toBe(62500); // 22500 + (600K-400K) * 20%
  });

  it('computes tax for 800K-2M bracket', () => {
    expect(computeIncomeTax(1000000)).toBe(152500); // 102500 + (1M-800K) * 25%
  });

  it('computes tax for 2M-8M bracket', () => {
    expect(computeIncomeTax(5000000)).toBe(1302500); // 402500 + (5M-2M) * 30%
  });

  it('computes tax for over 8M bracket', () => {
    expect(computeIncomeTax(10000000)).toBe(2902500); // 2202500 + (10M-8M) * 35%
  });
});

describe('computeMonthlyWithholdingTax', () => {
  it('computes monthly tax evenly', () => {
    const monthly = computeMonthlyWithholdingTax(625000);
    expect(monthly).toBe(5625);
  });

  it('computes for specific months', () => {
    const monthly = computeMonthlyWithholdingTax(625000, 6);
    expect(monthly).toBe(11250);
  });
});

describe('getIncomeTaxBracket', () => {
  it('returns correct bracket', () => {
    const bracket = getIncomeTaxBracket(300000);
    expect(bracket.taxRate).toBe('15%');
  });

  it('returns exempt for low income', () => {
    const bracket = getIncomeTaxBracket(200000);
    expect(bracket.taxRate).toBe('Exempt');
  });
});

describe('listIncomeTaxBrackets', () => {
  it('returns all brackets', () => {
    const brackets = listIncomeTaxBrackets();
    expect(brackets.length).toBe(6);
  });
});

describe('calculateSSS', () => {
  it('calculates SSS for standard salary', () => {
    const result = calculateSSS(25000);
    expect(result.employee).toBeGreaterThan(0);
    expect(result.employer).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.monthlySalaryCredit).toBe(25000);
  });

  it('clamps to minimum', () => {
    const result = calculateSSS(1000);
    expect(result.monthlySalaryCredit).toBe(4000);
  });

  it('clamps to maximum', () => {
    const result = calculateSSS(50000);
    expect(result.monthlySalaryCredit).toBe(30000);
  });
});

describe('calculatePhilHealth', () => {
  it('calculates PhilHealth contribution', () => {
    const result = calculatePhilHealth(30000);
    expect(result.total).toBe(1500);
    expect(result.employee).toBe(750);
    expect(result.employer).toBe(750);
  });

  it('clamps to floor', () => {
    const result = calculatePhilHealth(5000);
    expect(result.total).toBe(500); // 10000 * 5%
  });

  it('clamps to ceiling', () => {
    const result = calculatePhilHealth(150000);
    expect(result.total).toBe(5000); // 100000 * 5%
  });
});

describe('calculatePagIBIG', () => {
  it('calculates Pag-IBIG for low salary', () => {
    const result = calculatePagIBIG(5000);
    expect(result.employee).toBe(50); // 1%
    expect(result.employer).toBe(100); // 2%
  });

  it('calculates Pag-IBIG for high salary (capped)', () => {
    const result = calculatePagIBIG(10000);
    expect(result.employee).toBe(200); // max 200
    expect(result.employer).toBe(200);
  });
});

describe('calculateAllContributions', () => {
  it('calculates all contributions', () => {
    const result = calculateAllContributions(30000);
    expect(result.sss).toBeDefined();
    expect(result.philHealth).toBeDefined();
    expect(result.pagIBIG).toBeDefined();
    expect(result.total.employee).toBeGreaterThan(0);
    expect(result.total.employer).toBeGreaterThan(0);
    expect(result.total.combined).toBe(result.total.employee + result.total.employer);
  });
});

describe('computeBIR2316', () => {
  it('computes BIR 2316 data', () => {
    const result = computeBIR2316({
      compensationIncome: 600000,
      statutoryBenefits: 12000,
      nonTaxableAllowances: 30000,
      deMinimisBenefits: 10000,
    });
    expect(result.taxableIncome).toBe(548000);
    expect(result.taxDue).toBeGreaterThan(0);
    expect(result.taxPayable).toBe(result.taxDue);
  });

  it('handles no tax withheld', () => {
    const result = computeBIR2316({ compensationIncome: 200000 });
    expect(result.taxDue).toBe(0);
    expect(result.taxPayable).toBe(0);
  });
});

describe('effectiveTaxRate', () => {
  it('calculates effective rate', () => {
    expect(effectiveTaxRate(72500, 600000)).toBe(12.08);
  });

  it('returns 0 for zero income', () => {
    expect(effectiveTaxRate(0, 0)).toBe(0);
  });
});

describe('marginalTaxRate', () => {
  it('returns 0 for low income', () => {
    expect(marginalTaxRate(200000)).toBe(0);
  });

  it('returns 15% for 250K-400K', () => {
    expect(marginalTaxRate(300000)).toBe(15);
  });

  it('returns 20% for 400K-800K', () => {
    expect(marginalTaxRate(600000)).toBe(20);
  });

  it('returns 35% for over 8M', () => {
    expect(marginalTaxRate(10000000)).toBe(35);
  });
});
