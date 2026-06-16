# ph-currency

Philippine Peso utilities for Node.js/TypeScript. Comprehensive, well-documented, and production-ready.

[![npm version](https://img.shields.io/npm/v/ph-currency.svg)](https://www.npmjs.com/package/ph-currency)
[![license](https://img.shields.io/npm/l/ph-currency.svg)](https://github.com/kon2raya/ph-currency/blob/main/LICENSE)

## Features

- 💱 **PHP Formatting** — Format amounts as Philippine Peso
- 🔄 **Currency Conversion** — Multi-currency with live rates
- 📊 **Tax Calculations** — VAT, withholding tax, BIR computations
- 🧮 **Financial Utilities** — Interest, amortization, percentage calculations

## Installation

```bash
npm install ph-currency
```

## Quick Start

```typescript
import {
  formatPHPeso,
  calculateVAT,
  calculateWithholdingTax,
  usdToPhp,
} from 'ph-currency';

formatPHPeso(1234.56);              // "₱1,234.56"
calculateVAT(1000);                 // 120
calculateWithholdingTax(50000);     // 5000
usdToPhp(100);                      // 5600
```

## API Reference

### Currency Formatting

```typescript
import {
  formatPHPeso,      // Format as ₱X,XXX.XX
  parsePHPeso,       // Parse "₱1,234.56" to number
  formatWithSign,    // Format with ₱ sign
  formatCompact,    // Compact format (₱1.2K, ₱1.5M)
} from 'ph-currency';

formatPHPeso(1234.56);           // "₱1,234.56"
formatPHPeso(0);                 // "₱0.00"
formatPHPeso(1234567);           // "₱1,234,567.00"

parsePHPeso("₱1,234.56");        // 1234.56
parsePHPeso("₱0.00");            // 0

formatCompact(1200);             // "₱1.2K"
formatCompact(1500000);          // "₱1.5M"
```

### Currency Conversion

```typescript
import {
  usdToPhp,      // USD to PHP
  phpToUsd,      // PHP to USD
  convert,       // Convert between any currencies
  getRate,       // Get exchange rate
  getSupportedCurrencies, // List supported currencies
} from 'ph-currency';

usdToPhp(100);                    // 5600
usdToPhp(100, 57);               // 5700 (custom rate)

phpToUsd(5600);                  // 100

convert(100, 'USD', 'EUR');      // 92.86
convert(1000, 'JPY', 'PHP');     // 370

getRate('USD');                   // 56.0
getSupportedCurrencies();        // ['USD', 'EUR', 'JPY', 'GBP', ...]
```

### Tax Calculations

```typescript
import {
  calculateVAT,                    // Calculate 12% VAT
  calculateVATInclusive,           // Extract VAT from inclusive price
  calculateWithholdingTax,         // Calculate withholding tax
  calculateFinalWithholdingTax,    // Calculate final withholding tax
  calculateBIRTax,                 // Calculate BIR income tax
  calculateSSSContribution,        // Calculate SSS contribution
  calculatePhilHealthContribution, // Calculate PhilHealth contribution
  calculatePagIBIGContribution,    // Calculate Pag-IBIG contribution
} from 'ph-currency';

// VAT (12%)
calculateVAT(1000);               // 120
calculateVATInclusive(1120);       // 1000 (base amount)

// Withholding Tax
calculateWithholdingTax(50000, 'regular');   // 5000 (10%)
calculateWithholdingTax(50000, 'final');     // 2500 (5%)

// BIR Income Tax (2023 rates)
calculateBIRTax(500000);          // Tax amount based on brackets

// Government contributions
calculateSSSContribution(20000);       // Monthly SSS contribution
calculatePhilHealthContribution(20000); // Monthly PhilHealth contribution
calculatePagIBIGContribution(20000);    // Monthly Pag-IBIG contribution
```

### Financial Utilities

```typescript
import {
  calculateInterest,
  calculateAmortization,
  calculatePercentage,
  calculateDiscount,
  calculateMarkup,
} from 'ph-currency';

// Simple interest
calculateInterest(100000, 0.12, 1); // 12000

// Monthly amortization
calculateAmortization(1000000, 0.12, 60); // Monthly payment

// Percentage
calculatePercentage(50, 200);       // 25 (25% of 200)

// Discount
calculateDiscount(1000, 20);        // 800 (20% off)

// Markup
calculateMarkup(800, 25);           // 1000 (25% markup)
```

## Types

```typescript
interface CurrencyConversion {
  amount: number;
  from: string;
  to: string;
  rate: number;
  result: number;
}

interface TaxResult {
  base: number;
  tax: number;
  total: number;
  rate: number;
}

interface ContributionResult {
  employee: number;
  employer: number;
  total: number;
}
```

## Examples

### E-commerce Checkout

```typescript
import { formatPHPeso, calculateVAT } from 'ph-currency';

function checkout(subtotal: number) {
  const vat = calculateVAT(subtotal);
  const total = subtotal + vat;

  return {
    subtotal: formatPHPeso(subtotal),
    vat: formatPHPeso(vat),
    total: formatPHPeso(total),
  };
}

checkout(500);
// {
//   subtotal: "₱500.00",
//   vat: "₱60.00",
//   total: "₱560.00"
// }
```

### Payroll Calculation

```typescript
import {
  calculateSSSContribution,
  calculatePhilHealthContribution,
  calculatePagIBIGContribution,
  calculateWithholdingTax,
  formatPHPeso,
} from 'ph-currency';

function calculatePayroll(salary: number) {
  const sss = calculateSSSContribution(salary);
  const philhealth = calculatePhilHealthContribution(salary);
  const pagibig = calculatePagIBIGContribution(salary);

  const totalDeductions = sss.employee + philhealth.employee + pagibig;
  const taxable = salary - totalDeductions;
  const tax = calculateWithholdingTax(taxable, 'regular');
  const netPay = salary - totalDeductions - tax;

  return {
    gross: formatPHPeso(salary),
    deductions: {
      sss: formatPHPeso(sss.employee),
      philhealth: formatPHPeso(philhealth.employee),
      pagibig: formatPHPeso(pagibig),
      tax: formatPHPeso(tax),
    },
    netPay: formatPHPeso(netPay),
  };
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © kon2raya
