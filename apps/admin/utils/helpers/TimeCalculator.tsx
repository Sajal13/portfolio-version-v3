'use client';

import { useEffect, useState, useMemo, JSX } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { timeAgo } from './TimeAgo';

interface TimeAgoProps {
  time: string | number | Date | Dayjs;
  useUTC?: boolean;
  interval?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

const TimeAgo = ({
  time,
  useUTC = true,
  interval = 60000,
  as: Component = 'span',
  className
}: TimeAgoProps) => {
  const [now, setNow] = useState<Dayjs>(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  const value = useMemo(() => {
    return timeAgo(time, { useUTC, now });
  }, [time, now, useUTC]);

  return <Component className={className}>{value}</Component>;
};

export default TimeAgo;
