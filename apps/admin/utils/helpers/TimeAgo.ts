import dayjs, { Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(relativeTime, {
  thresholds: [
    { l: 's', r: 44, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 1 },
    { l: 'yy', d: 'year' }
  ],
  rounding: Math.floor
});

export interface TimeAgoOptions {
  useUTC?: boolean;
  now?: Dayjs;
}

export const timeAgo = (
  input: string | number | Date | Dayjs,
  { useUTC = false, now }: TimeAgoOptions = {}
): string => {
  if (!input) return '';

  const base = useUTC ? dayjs.utc(input) : dayjs(input);

  if (!base.isValid()) return '';

  return now ? base.from(now) : base.fromNow();
};
