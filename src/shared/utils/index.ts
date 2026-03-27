export const formatMoney = (
  val: number | undefined | null | string,
  currency: 'EUR' | 'USD',
  fractionDigits = 2,
) => {
  if (val === undefined || val === null || isNaN(Number(val))) {
    return '0';
  }
  return `${Number(val).toFixed(fractionDigits).toLocaleString()} ${currency}`;
};

export function parseNumberish(value: string | number): number {
  if (typeof value === 'number') return value;
  const normalized = String(value ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(',', '.');
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
}
export const safeToFixed = (val?: number, digits = 2) =>
  typeof val === 'number' ? val.toFixed(digits) : '—';

export function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(value);
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return Promise.resolve();
}
