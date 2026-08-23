'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui/components';
import { useAnalyticsSummary } from 'hooks/queries/useAnalyticsQueries';
import EventTypeChart from './EventTypeChart';
import LabelCountList from './LabelCountList';
import LabelCountPieChart from './LabelCountPieChart';
import SummaryCards from './SummaryCards';

const DashboardContainer = () => {
  const { data, isLoading, isError } = useAnalyticsSummary();

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-neutral-400">Loading analytics…</div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-sm text-error-500">
        Failed to load analytics. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SummaryCards data={data} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Events by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <EventTypeChart data={data.eventCountsByType} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <LabelCountPieChart data={data.deviceBreakdown} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Paths</CardTitle>
          </CardHeader>
          <CardContent>
            <LabelCountList
              data={data.topPaths}
              emptyLabel="No page views yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent>
            <LabelCountList
              data={data.topReferrers}
              emptyLabel="No referrer data yet."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <LabelCountList
              data={data.countryBreakdown}
              emptyLabel="No location data yet."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContainer;
