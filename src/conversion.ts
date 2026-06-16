const RATES: Record<string, number> = {
  USD: 56.0, EUR: 61.0, JPY: 0.37, GBP: 71.0,
  CNY: 7.7, KRW: 0.041, SGD: 41.0, AUD: 37.0, CAD: 41.0,
};

export function usdToPhp(usd: number, rate: number = RATES.USD): number {
  return Math.round(usd * rate * 100) / 100;
}

export function phpToUsd(php: number, rate: number = RATES.USD): number {
  return Math.round((php / rate) * 100) / 100;
}

export function convert(amount: number, from: string, to: string): number {
  const fromRate = RATES[from] || 1;
  const toRate = RATES[to] || 1;
  return Math.round((amount / fromRate) * toRate * 100) / 100;
}
