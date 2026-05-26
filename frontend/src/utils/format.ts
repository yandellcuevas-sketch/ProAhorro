/**
 * ProAhorro — Utilidades de formato
 */

const CURRENCY_SYMBOLS: Record<string, string> = {
  DOP: 'RD$',
  USD: '$',
  EUR: '€',
};

export function formatAmount(amount: number, currency: string): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  return `${symbol}${amount.toLocaleString('es-DO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateShort(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-DO', {
    day: '2-digit',
    month: 'short',
  });
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function monthLabel(monthStr: string): string {
  const labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const m = parseInt(monthStr.split('-')[1], 10);
  return labels[m - 1] ?? monthStr;
}
