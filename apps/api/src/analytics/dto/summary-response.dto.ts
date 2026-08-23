import { ApiProperty } from '@nestjs/swagger';

export class EventCountDto {
  @ApiProperty({
    description: 'The event type',
    example: 'page_view'
  })
  type: string;

  @ApiProperty({
    description: 'Number of events of this type',
    example: 1245
  })
  count: number;
}

export class LabelCountDto {
  @ApiProperty({
    description:
      'The label being counted (e.g. a path, referrer, device type, or country)',
    example: '/admin/dashboard'
  })
  label: string;

  @ApiProperty({
    description: 'Number of occurrences for this label',
    example: 312
  })
  count: number;
}

export class AnalyticsSummaryResponseDto {
  @ApiProperty({
    description: 'Total number of tracked events across all types',
    example: 8432
  })
  totalEvents: number;

  @ApiProperty({
    description: 'Total number of unique visitors, based on fingerprinting',
    example: 1204
  })
  uniqueVisitors: number;

  @ApiProperty({
    description:
      'Event counts grouped by event type, ordered by count descending',
    type: [EventCountDto]
  })
  eventCountsByType: EventCountDto[];

  @ApiProperty({
    description:
      'Top 10 most-viewed paths, ordered by page_view count descending',
    type: [LabelCountDto]
  })
  topPaths: LabelCountDto[];

  @ApiProperty({
    description: 'Top 10 referrers, ordered by count descending',
    type: [LabelCountDto]
  })
  topReferrers: LabelCountDto[];

  @ApiProperty({
    description:
      'Visitor counts grouped by device type (e.g. desktop, mobile, tablet, unknown)',
    type: [LabelCountDto]
  })
  deviceBreakdown: LabelCountDto[];

  @ApiProperty({
    description: 'Top 10 visitor counts grouped by country',
    type: [LabelCountDto]
  })
  countryBreakdown: LabelCountDto[];
}
