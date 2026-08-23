'use client';

import { AnalyticsSummary } from '@repo/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@repo/ui/components';

interface SummaryCardsProps {
  data: Pick<AnalyticsSummary, 'totalEvents' | 'uniqueVisitors'>;
}

const cards = [
  {
    key: 'totalEvents' as const,
    label: 'Total Events'
  },
  {
    key: 'uniqueVisitors' as const,
    label: 'Unique Visitors'
  }
];

const SummaryCards = ({ data }: SummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map(({ key, label }) => (
        <Card key={key} variant="illustration">
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-3xl">
              {data[key].toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
