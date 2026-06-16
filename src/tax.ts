export function calculateVAT(amount: number, rate: number = 0.12): number {
  return Math.round(amount * rate * 100) / 100;
}

export function calculateWithholdingTax(amount: number, type: "regular" | "final" = "regular"): number {
  if (type === "final") {
    if (amount <= 100000) return Math.round(amount * 0.05 * 100) / 100;
    if (amount <= 500000) return Math.round(amount * 0.10 * 100) / 100;
    return Math.round(amount * 0.15 * 100) / 100;
  }
  return Math.round(amount * 0.10 * 100) / 100;
}
