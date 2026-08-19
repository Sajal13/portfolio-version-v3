import dayjs from 'dayjs';

export const formatMonthYear = (date?: string) =>
  date && dayjs(date).isValid() ? dayjs(date).format('MMM YYYY') : undefined;
