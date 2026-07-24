const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** 1234567 -> "1,234,567" */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const [integer, fraction] = Math.abs(value).toString().split(".");
  const withSeparators = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const sign = value < 0 ? "-" : "";
  return sign + withSeparators + (fraction ? `.${fraction}` : "");
}

/** ISO date string -> "20 Mar 2026" (UTC-based so the calendar day never shifts) */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
