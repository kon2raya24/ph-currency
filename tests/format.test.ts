import { formatPHPeso, parsePHPeso, formatCurrency, formatAbbreviated, formatWithCommas, formatPHPesoInWords } from '../src/format';

describe('formatPHPeso', () => {
  it('formats basic amounts', () => {
    expect(formatPHPeso(0)).toBe('₱0.00');
    expect(formatPHPeso(100)).toBe('₱100.00');
    expect(formatPHPeso(1234.56)).toBe('₱1,234.56');
    expect(formatPHPeso(1234567.89)).toBe('₱1,234,567.89');
  });

  it('formats negative amounts', () => {
    expect(formatPHPeso(-100)).toBe('₱-100.00');
    expect(formatPHPeso(-1234.56)).toBe('₱-1,234.56');
  });

  it('formats with parentheses for negatives', () => {
    expect(formatPHPeso(-500, { parenthesesForNegative: true })).toBe('(₱500.00)');
    expect(formatPHPeso(500, { parenthesesForNegative: true })).toBe('₱500.00');
  });

  it('formats without symbol', () => {
    expect(formatPHPeso(1234.56, { showSymbol: false })).toBe('1,234.56');
  });

  it('formats with custom decimals', () => {
    expect(formatPHPeso(1234.567, { decimals: 3 })).toBe('₱1,234.567');
    expect(formatPHPeso(1234, { decimals: 0 })).toBe('₱1,234');
  });

  it('formats with sign for positive', () => {
    expect(formatPHPeso(100, { showSign: true })).toBe('+₱100.00');
    expect(formatPHPeso(-100, { showSign: true })).toBe('₱-100.00');
  });

  it('formats large amounts', () => {
    expect(formatPHPeso(1000000000)).toBe('₱1,000,000,000.00');
  });

  it('formats with custom symbol', () => {
    expect(formatPHPeso(100, { customSymbol: 'P' })).toBe('P100.00');
  });
});

describe('formatPHPesoInWords', () => {
  it('formats zero', () => {
    expect(formatPHPesoInWords(0)).toBe('Zero pesos only');
  });

  it('formats simple amounts', () => {
    expect(formatPHPesoInWords(500)).toBe('Five hundred pesos only');
    expect(formatPHPesoInWords(1000)).toBe('One thousand pesos only');
  });

  it('formats with centavos', () => {
    expect(formatPHPesoInWords(1234.56)).toBe('One thousand two hundred thirty-four pesos and 56/100');
  });

  it('formats large amounts', () => {
    const result = formatPHPesoInWords(1000000);
    expect(result).toContain('One million pesos only');
  });

  it('formats negative amounts', () => {
    const result = formatPHPesoInWords(-500);
    expect(result).toContain('Negative');
  });
});

describe('parsePHPeso', () => {
  it('parses basic formatted strings', () => {
    expect(parsePHPeso('₱1,234.56')).toBe(1234.56);
    expect(parsePHPeso('1234.56')).toBe(1234.56);
    expect(parsePHPeso('₱1,234,567')).toBe(1234567);
  });

  it('parses parenthesized negatives', () => {
    expect(parsePHPeso('(₱500.00)')).toBe(-500);
  });

  it('parses negative with minus sign', () => {
    expect(parsePHPeso('₱-100')).toBe(-100);
  });

  it('throws on invalid input', () => {
    expect(() => parsePHPeso('abc')).toThrow('Invalid PHP amount');
  });
});

describe('formatCurrency', () => {
  it('formats USD', () => {
    const result = formatCurrency(1234.56, 'USD');
    expect(result).toContain('1,234.56');
    expect(result).toContain('$');
  });

  it('formats EUR', () => {
    const result = formatCurrency(1234.56, 'EUR');
    expect(result).toContain('€');
  });

  it('formats GBP', () => {
    const result = formatCurrency(1234.56, 'GBP');
    expect(result).toContain('£');
  });

  it('throws for unknown currency', () => {
    expect(() => formatCurrency(100, 'XYZ')).toThrow('Unknown currency');
  });
});

describe('formatAbbreviated', () => {
  it('formats small amounts without abbreviation', () => {
    expect(formatAbbreviated(500)).toBe('500');
  });

  it('formats thousands', () => {
    expect(formatAbbreviated(1234)).toBe('1.2K');
  });

  it('formats millions', () => {
    expect(formatAbbreviated(1234567)).toBe('1.2M');
  });

  it('formats billions', () => {
    expect(formatAbbreviated(1234567890)).toBe('1.2B');
  });

  it('formats negative amounts', () => {
    expect(formatAbbreviated(-1234)).toBe('-1.2K');
  });
});

describe('formatWithCommas', () => {
  it('formats with commas', () => {
    expect(formatWithCommas(1234567.891)).toBe('1,234,567.89');
    expect(formatWithCommas(1000)).toBe('1,000.00');
  });

  it('formats with custom decimals', () => {
    expect(formatWithCommas(1234.5, 0)).toBe('1,235');
  });
});
