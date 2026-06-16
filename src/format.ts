export function formatPHPeso(amount: number): string {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 2 }).format(amount);
}

export function parsePHPeso(formatted: string): number {
  return parseFloat(formatted.replace(/[^0-9.-]/g, ""));
}
