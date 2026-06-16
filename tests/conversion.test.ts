import {
  convert, usdToPhp, phpToUsd, eurToPhp, phpToEur,
  gbpToPhp, phpToGbp, jpyToPhp, phpToJpy,
  sgdToPhp, phpToSgd, cnyToPhp, phpToCny,
  krwToPhp, phpToKrw, audToPhp, phpToAud,
  cadToPhp, phpToCad, hkdToPhp, phpToHkd,
  thbToPhp, phpToThb, myrToPhp, phpToMyr,
  setExchangeRate, getExchangeRate, getAllExchangeRates, resetExchangeRates,
  getExchangeRatePair, compareCurrency,
} from '../src/conversion';

describe('usdToPhp', () => {
  it('converts USD to PHP with default rate', () => {
    expect(usdToPhp(100)).toBe(5650);
  });

  it('converts with custom rate', () => {
    expect(usdToPhp(100, 57)).toBe(5700);
  });

  it('converts zero', () => {
    expect(usdToPhp(0)).toBe(0);
  });

  it('handles small amounts', () => {
    expect(usdToPhp(0.01)).toBe(0.57);
  });
});

describe('phpToUsd', () => {
  it('converts PHP to USD', () => {
    expect(phpToUsd(5650)).toBe(100);
  });

  it('converts with custom rate', () => {
    expect(phpToUsd(5700, 57)).toBe(100);
  });

  it('converts small amounts', () => {
    expect(phpToUsd(100)).toBe(1.77);
  });
});

describe('eurToPhp / phpToEur', () => {
  it('converts EUR to PHP', () => {
    expect(eurToPhp(100)).toBe(6100);
  });

  it('converts PHP to EUR', () => {
    expect(phpToEur(6100)).toBe(100);
  });
});

describe('gbpToPhp / phpToGbp', () => {
  it('converts GBP to PHP', () => {
    expect(gbpToPhp(100)).toBe(7100);
  });

  it('converts PHP to GBP', () => {
    expect(phpToGbp(7100)).toBe(100);
  });
});

describe('jpyToPhp / phpToJpy', () => {
  it('converts JPY to PHP', () => {
    expect(jpyToPhp(1000)).toBe(370);
  });

  it('converts PHP to JPY', () => {
    expect(phpToJpy(370)).toBe(1000);
  });
});

describe('sgdToPhp / phpToSgd', () => {
  it('converts SGD to PHP', () => {
    expect(sgdToPhp(100)).toBe(4100);
  });

  it('converts PHP to SGD', () => {
    expect(phpToSgd(4100)).toBe(100);
  });
});

describe('cnyToPhp / phpToCny', () => {
  it('converts CNY to PHP', () => {
    expect(cnyToPhp(100)).toBe(770);
  });

  it('converts PHP to CNY', () => {
    expect(phpToCny(770)).toBe(100);
  });
});

describe('krwToPhp / phpToKrw', () => {
  it('converts KRW to PHP', () => {
    expect(krwToPhp(10000)).toBe(410);
  });
});

describe('audToPhp / phpToAud', () => {
  it('converts AUD to PHP', () => {
    expect(audToPhp(100)).toBe(3700);
  });
});

describe('cadToPhp / phpToCad', () => {
  it('converts CAD to PHP', () => {
    expect(cadToPhp(100)).toBe(4100);
  });
});

describe('hkdToPhp / phpToHkd', () => {
  it('converts HKD to PHP', () => {
    expect(hkdToPhp(100)).toBe(724);
  });
});

describe('thbToPhp / phpToThb', () => {
  it('converts THB to PHP', () => {
    expect(thbToPhp(1000)).toBe(1580);
  });
});

describe('myrToPhp / phpToMyr', () => {
  it('converts MYR to PHP', () => {
    expect(myrToPhp(100)).toBe(1200);
  });
});

describe('convert', () => {
  it('converts between same currency', () => {
    expect(convert(100, 'USD', 'USD')).toBe(100);
  });

  it('converts USD to EUR', () => {
    const result = convert(100, 'USD', 'EUR');
    expect(result).toBeGreaterThan(0);
    expect(result).not.toBe(100);
  });

  it('converts PHP to USD', () => {
    expect(convert(5650, 'PHP', 'USD')).toBe(100);
  });

  it('converts USD to PHP', () => {
    expect(convert(100, 'USD', 'PHP')).toBe(5650);
  });

  it('throws for unknown currency', () => {
    expect(() => convert(100, 'XYZ', 'USD')).toThrow('No rate for: XYZ');
  });
});

describe('setExchangeRate', () => {
  afterEach(() => resetExchangeRates());

  it('sets a custom exchange rate', () => {
    setExchangeRate('USD', 57.25);
    expect(getExchangeRate('USD')).toBe(57.25);
  });

  it('affects conversions', () => {
    setExchangeRate('USD', 60);
    expect(usdToPhp(100)).toBe(6000);
  });

  it('throws for negative rate', () => {
    expect(() => setExchangeRate('USD', -5)).toThrow('Exchange rate must be positive');
  });
});

describe('getExchangeRate', () => {
  it('returns default rate', () => {
    expect(getExchangeRate('USD')).toBe(56.50);
  });

  it('throws for unknown currency', () => {
    expect(() => getExchangeRate('XYZ')).toThrow('No exchange rate available');
  });
});

describe('getAllExchangeRates', () => {
  it('returns all rates', () => {
    const rates = getAllExchangeRates();
    expect(rates).toHaveProperty('USD');
    expect(rates).toHaveProperty('EUR');
    expect(rates).toHaveProperty('GBP');
    expect(Object.keys(rates).length).toBeGreaterThan(20);
  });
});

describe('resetExchangeRates', () => {
  it('resets to defaults', () => {
    setExchangeRate('USD', 100);
    expect(getExchangeRate('USD')).toBe(100);
    resetExchangeRates();
    expect(getExchangeRate('USD')).toBe(56.50);
  });
});

describe('getExchangeRatePair', () => {
  it('returns correct pair', () => {
    const pair = getExchangeRatePair('USD', 'EUR');
    expect(pair.from).toBe('USD');
    expect(pair.to).toBe('EUR');
    expect(pair.rate).toBeGreaterThan(0);
    expect(pair.inverse).toBeGreaterThan(0);
  });

  it('same currency returns 1', () => {
    const pair = getExchangeRatePair('USD', 'USD');
    expect(pair.rate).toBe(1);
    expect(pair.inverse).toBe(1);
  });
});

describe('compareCurrency', () => {
  it('compares equal amounts', () => {
    expect(compareCurrency(100, 'USD', 5650, 'PHP')).toBe(0);
  });

  it('first is greater', () => {
    expect(compareCurrency(100, 'USD', 5000, 'PHP')).toBe(1);
  });

  it('second is greater', () => {
    expect(compareCurrency(100, 'USD', 6000, 'PHP')).toBe(-1);
  });
});
