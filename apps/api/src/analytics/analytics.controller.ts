import { Body, Controller, Get, Headers, Ip, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @Public()
  @Throttle({ default: { limit: 60, ttl: 60_000 } })
  @ApiOperation({ summary: 'Record an event (page view, click, etc.)' })
  @ApiResponse({ status: 201, description: 'Event recorded.' })
  @ResponseMessage('Event recorded.')
  async trackEvent(
    @Body() dto: TrackEventDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string
  ) {
    await this.analyticsService.trackEvent(dto, ip, userAgent);
    return { success: true };
  }

  @Get('summary')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get aggregated analytics for the admin dashboard' })
  @ApiResponse({ status: 200 })
  @ResponseMessage('Analytics summary fetched successfully.')
  async getSummary() {
    return this.analyticsService.getSummary();
  }
}
