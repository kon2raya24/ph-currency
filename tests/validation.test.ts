import {
  isValidAmount, isValidCurrencyCode, isPHP, isValidPHPFormatted,
  isAmountInRange, isPositive, isNonNegative, isValidExchangeRate,
  isValidVATRate, isValidTaxRate, hasCentavos, getCentavos,
  isRoundAmount, isValidBIRRef,
} from '../src/validation';

describe('isValidAmount', () => {
  it('accepts valid numbers', () => {
    expect(isValidAmount(100)).toBe(true);
    expect(isValidAmount(0)).toBe(true);
    expect(isValidAmount(-50)).toBe(true);
    expect(isValidAmount(1234.56)).toBe(true);
  });

  it('rejects invalid values', () => {
    expect(isValidAmount(NaN)).toBe(false);
    expect(isValidAmount(Infinity)).toBe(false);
    expect(isValidAmount(-Infinity)).toBe(false);
    expect(isValidAmount('100')).toBe(false);
    expect(isValidAmount(null)).toBe(false);
    expect(isValidAmount(undefined)).toBe(false);
  });
});

describe('isValidCurrencyCode', () => {
  it('accepts valid codes', () => {
    expect(isValidCurrencyCode('USD')).toBe(true);
    expect(isValidCurrencyCode('PHP')).toBe(true);
    expect(isValidCurrencyCode('EUR')).toBe(true);
    expect(isValidCurrencyCode('GBP')).toBe(true);
  });

  it('rejects invalid codes', () => {
    expect(isValidCurrencyCode('XYZ')).toBe(false);
    expect(isValidCurrencyCode('us')).toBe(false);
    expect(isValidCurrencyCode('')).toBe(false);
  });
});

describe('isPHP', () => {
  it('identifies PHP', () => {
    expect(isPHP('PHP')).toBe(true);
    expect(isPHP('php')).toBe(true);
    expect(isPHP('Php')).toBe(true);
  });

  it('rejects non-PHP', () => {
    expect(isPHP('USD')).toBe(false);
  });
});

describe('isValidPHPFormatted', () => {
  it('accepts valid formatted strings', () => {
    expect(isValidPHPFormatted('₱1,234.56')).toBe(true);
    expect(isValidPHPFormatted('1234.56')).toBe(true);
    expect(isValidPHPFormatted('₱-500')).toBe(true);
  });

  it('rejects invalid strings', () => {
    expect(isValidPHPFormatted('abc')).toBe(false);
    expect(isValidPHPFormatted('')).toBe(false);
  });
});

describe('isAmountInRange', () => {
  it('accepts amounts in range', () => {
    expect(isAmountInRange(500, 0, 1000)).toBe(true);
  });

  it('rejects out of range', () => {
    expect(isAmountInRange(-1, 0, 1000)).toBe(false);
    expect(isAmountInRange(1001, 0, 1000)).toBe(false);
  });
});

describe('isPositive', () => {
  it('checks positive', () => {
    expect(isPositive(100)).toBe(true);
    expect(isPositive(0)).toBe(false);
    expect(isPositive(-100)).toBe(false);
  });
});

describe('isNonNegative', () => {
  it('checks non-negative', () => {
    expect(isNonNegative(100)).toBe(true);
    expect(isNonNegative(0)).toBe(true);
    expect(isNonNegative(-1)).toBe(false);
  });
});

describe('isValidExchangeRate', () => {
  it('accepts valid rates', () => {
    expect(isValidExchangeRate(56.5)).toBe(true);
    expect(isValidExchangeRate(0.001)).toBe(true);
  });

  it('rejects invalid rates', () => {
    expect(isValidExchangeRate(0)).toBe(false);
    expect(isValidExchangeRate(-5)).toBe(false);
    expect(isValidExchangeRate(NaN)).toBe(false);
  });
});

describe('isValidVATRate', () => {
  it('accepts valid rates', () => {
    expect(isValidVATRate(0.12)).toBe(true);
    expect(isValidVATRate(0)).toBe(true);
    expect(isValidVATRate(1)).toBe(true);
  });

  it('rejects invalid rates', () => {
    expect(isValidVATRate(-0.1)).toBe(false);
    expect(isValidVATRate(1.5)).toBe(false);
  });
});

describe('isValidTaxRate', () => {
  it('accepts valid rates', () => {
    expect(isValidTaxRate(0.10)).toBe(true);
    expect(isValidTaxRate(0)).toBe(true);
    expect(isValidTaxRate(0.35)).toBe(true);
  });

  it('rejects invalid rates', () => {
    expect(isValidTaxRate(-1)).toBe(false);
    expect(isValidTaxRate(2)).toBe(false);
  });
});

describe('hasCentavos', () => {
  it('detects centavos', () => {
    expect(hasCentavos(100.50)).toBe(true);
    expect(hasCentavos(100.01)).toBe(true);
  });

  it('detects no centavos', () => {
    expect(hasCentavos(100)).toBe(false);
    expect(hasCentavos(100.00)).toBe(false);
  });
});

describe('getCentavos', () => {
  it('extracts centavos', () => {
    expect(getCentavos(1234.56)).toBe(56);
    expect(getCentavos(100)).toBe(0);
    expect(getCentavos(99.99)).toBe(99);
    expect(getCentavos(-1234.56)).toBe(56);
  });
});

describe('isRoundAmount', () => {
  it('checks round amounts', () => {
    expect(isRoundAmount(100)).toBe(true);
    expect(isRoundAmount(100.00)).toBe(true);
  });

  it('rejects non-round', () => {
    expect(isRoundAmount(100.50)).toBe(false);
  });
});

describe('isValidBIRRef', () => {
  it('accepts valid format', () => {
    expect(isValidBIRRef('1234-5678-9012')).toBe(true);
  });

  it('rejects invalid format', () => {
    expect(isValidBIRRef('123-456-789')).toBe(false);
    expect(isValidBIRRef('abcd-efgh-ijkl')).toBe(false);
    expect(isValidBIRRef('123456789012')).toBe(false);
  });
});
