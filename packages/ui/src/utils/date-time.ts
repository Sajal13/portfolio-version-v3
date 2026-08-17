export type DateBound = Date | string;

export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
] as const;

export const MONTH_LABELS_SHORT = MONTH_LABELS.map((m) => m.slice(0, 3));

export const DAY_LABELS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
] as const;

export interface CalendarCell {
  date: Date;
  inMonth: boolean;
}

export interface DateBoundsOptions {
  minDate?: DateBound | null;
  maxDate?: DateBound | null;
  disableFuture?: boolean;
  disablePast?: boolean;
  disabledDates?: (date: Date) => boolean;
}

function pad(value: number, length = 2): string {
  return String(value).padStart(length, '0');
}

/** Parses a Date | string | null|undefined into a valid Date or null. Never throws. */
export function toDate(value?: DateBound | null): Date | null {
  if (!value) return null;
  if (value instanceof Date)
    return Number.isNaN(value.getTime()) ? null : value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Returns a new date moved by `amount` months, clamped to day 1 first to dodge month-length overflow. */
export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function addYears(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + amount);
  return d;
}

function daysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Builds a fixed 6-row (42 cell) month grid, Sunday-first, including the leading/trailing days from adjacent months. */
export function buildCalendarMatrix(viewDate: Date): CalendarCell[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const prevMonthLastDate = new Date(year, month, 0).getDate();

  const cells: CalendarCell[] = [];

  for (let i = 0; i < firstWeekday; i++) {
    const day = prevMonthLastDate - firstWeekday + 1 + i;
    cells.push({ date: new Date(year, month - 1, day), inMonth: false });
  }

  for (let day = 1; day <= totalDays; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }

  let trailingDay = 1;
  while (cells.length < 42) {
    cells.push({
      date: new Date(year, month + 1, trailingDay),
      inMonth: false
    });
    trailingDay += 1;
  }

  return cells;
}

/** True if a given day should be unselectable given the supplied bounds. Time-of-day is ignored. */
export function isDateDisabled(date: Date, opts: DateBoundsOptions): boolean {
  const day = startOfDay(date).getTime();
  const min = toDate(opts.minDate ?? null);
  const max = toDate(opts.maxDate ?? null);

  if (min && day < startOfDay(min).getTime()) return true;
  if (max && day > startOfDay(max).getTime()) return true;
  if (opts.disableFuture && day > startOfDay(new Date()).getTime()) return true;
  if (opts.disablePast && day < startOfDay(new Date()).getTime()) return true;
  if (opts.disabledDates?.(date)) return true;

  return false;
}

export function to12Hour(hour24: number): {
  hour12: number;
  period: 'AM' | 'PM';
} {
  const period: 'AM' | 'PM' = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

export function to24Hour(hour12: number, period: 'AM' | 'PM'): number {
  const normalized = hour12 % 12;
  return period === 'PM' ? normalized + 12 : normalized;
}

export function setTimeOnDate(
  date: Date,
  hour24: number,
  minute: number
): Date {
  const d = new Date(date);
  d.setHours(hour24, minute, 0, 0);
  return d;
}

/**
 * Formats a date using a small token set: yyyy MM dd HH hh mm ss A a.
 * Unknown tokens pass through untouched.
 */
export function formatDateTime(date: Date, format: string): string {
  const hour24 = date.getHours();
  const { hour12 } = to12Hour(hour24);

  const tokens: Record<string, string> = {
    yyyy: String(date.getFullYear()),
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    HH: pad(hour24),
    hh: pad(hour12),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    A: hour24 >= 12 ? 'PM' : 'AM',
    a: hour24 >= 12 ? 'pm' : 'am'
  };

  return format.replace(
    /yyyy|MM|dd|HH|hh|mm|ss|A|a/g,
    (token) => tokens[token] ?? token
  );
}

/** Best-effort parse of a previously-formatted value (or any ISO-ish string) back into a Date. */
export function parseDateTimeValue(value?: string | null): Date | null {
  return toDate(value ?? null);
}

export function clampYear(
  year: number,
  minDate?: DateBound | null,
  maxDate?: DateBound | null
): number {
  const min = toDate(minDate ?? null);
  const max = toDate(maxDate ?? null);
  let clamped = year;
  if (min && clamped < min.getFullYear()) clamped = min.getFullYear();
  if (max && clamped > max.getFullYear()) clamped = max.getFullYear();
  return clamped;
}
