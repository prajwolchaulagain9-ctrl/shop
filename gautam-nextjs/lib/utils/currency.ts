export function parsePrice(value: string): number {
  const match = value.match(/\d[\d,]*(?:\.\d{1,2})?/);
  const amount = match ? Number(match[0].replace(/,/g, "")) : NaN;
  if (!Number.isFinite(amount)) throw new Error("Invalid product price.");
  return amount;
}
export function formatPrice(amount: number): string {
  return `NPR ${amount.toLocaleString("en-NP", { maximumFractionDigits: 2 })}`;
}
