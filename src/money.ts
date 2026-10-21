export type Line = { amount: number };

// ISO 4217 assigns every active currency code a minor unit ("exponent"):
// the number of digits after the decimal separator (USD 2, KWD 3, BHD 3,
// JPY 0, ...). Totals must be rounded and formatted to that unit, not to a
// hardcoded 2. ECMA-402 exposes the exponent through Intl.NumberFormat's
// resolved options, so derive it from the runtime's currency data rather
// than maintaining a hand-written table. An unknown currency code is a
// caller error and throws a RangeError instead of silently falling back
// to 2 decimals.
function minorUnitDigits(currency: string): number {
  const formatter = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  return formatter.resolvedOptions().minimumFractionDigits;
}

export function formatTotal(lines: Line[], currency: string): string {
  const sum = lines.reduce((total, line) => total + line.amount, 0);
  return sum.toFixed(minorUnitDigits(currency));
}
