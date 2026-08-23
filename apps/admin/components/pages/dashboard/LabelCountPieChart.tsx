'use client';

import { useMemo } from 'react';
import { LabelCount } from '@repo/types';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

const COLORS = [
  'var(--color-primary-500)',
  'var(--color-success-500)',
  'var(--color-warning-500)',
  'var(--color-error-500)',
  'var(--color-info-500)'
];

interface LabelCountPieChartProps {
  data: LabelCount[];
}

const LabelCountPieChart = ({ data }: LabelCountPieChartProps) => {
  const option: EChartsOption = useMemo(
    () => ({
      color: COLORS,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'var(--color-secondary-700)',
        borderColor: 'var(--color-main)',
        textStyle: { color: '#fff' }
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        textStyle: { color: 'var(--color-neutral-300)', fontSize: 12 }
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: 'var(--color-secondary-700)',
            borderWidth: 2
          },
          label: { show: false },
          labelLine: { show: false },
          data: data.map((d) => ({ name: d.label, value: d.count }))
        }
      ]
    }),
    [data]
  );

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-neutral-400">
        No data yet.
      </div>
    );
  }

  return (
    <ReactECharts option={option} style={{ height: 280, width: '100%' }} />
  );
};

export default LabelCountPieChart;
