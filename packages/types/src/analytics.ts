export interface LabelCount {
  label: string;
  count: number;
}

export interface EventCount {
  type: string;
  count: number;
}

export interface AnalyticsSummary {
  totalEvents: number;
  uniqueVisitors: number;
  eventCountsByType: EventCount[];
  topPaths: LabelCount[];
  topReferrers: LabelCount[];
  deviceBreakdown: LabelCount[];
  countryBreakdown: LabelCount[];
}