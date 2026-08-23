'use client';

import { useMemo } from 'react';
import { EventCount } from '@repo/types';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

interface EventTypeChartProps {
  data: EventCount[];
}

const EventTypeChart = ({ data }: EventTypeChartProps) => {
  const option: EChartsOption = useMemo(
    () => ({
      grid: { left: 8, right: 8, top: 16, bottom: 24, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'var(--color-secondary-700)',
        borderColor: 'var(--color-main)',
        textStyle: { color: '#fff' }
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.type),
        axisLine: { lineStyle: { color: 'var(--color-main)' } },
        axisLabel: { color: 'var(--color-neutral-400)', fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'var(--color-main)', opacity: 0.3 } },
        axisLabel: { color: 'var(--color-neutral-400)', fontSize: 12 }
      },
      series: [
        {
          type: 'bar',
          data: data.map((d) => d.count),
          itemStyle: {
            color: 'var(--color-primary-500)',
            borderRadius: [4, 4, 0, 0]
          },
          barMaxWidth: 48
        }
      ]
    }),
    [data]
  );

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
        No event data yet.
      </div>
    );
  }

  return (
    <ReactECharts option={option} style={{ height: 280, width: '100%' }} />
  );
};

export default EventTypeChart;
