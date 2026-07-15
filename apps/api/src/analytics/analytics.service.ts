import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { UAParser } from 'ua-parser-js';
import geoip from 'geoip-lite';
import { Visitor } from './entities/visitor.entity';
import { Event } from './entities/event.entity';
import { TrackEventDto } from './dto/track-event.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Visitor)
    private readonly visitorRepository: Repository<Visitor>,

    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {}

  private buildFingerprint(ip: string, userAgent: string | undefined): string {
    return createHash('sha256')
      .update(`${ip}::${userAgent ?? 'unknown'}`)
      .digest('hex');
  }

  private async findOrCreateVisitor(
    ip: string,
    userAgent: string | undefined
  ): Promise<Visitor> {
    const fingerprint = this.buildFingerprint(ip, userAgent);

    const existing = await this.visitorRepository.findOneBy({ fingerprint });

    if (existing) {
      existing.lastSeenAt = new Date();
      return await this.visitorRepository.save(existing);
    }

    const parsedUA = userAgent
      ? new UAParser(userAgent).getResult()
      : undefined;
    const geo = geoip.lookup(ip);

    const visitor = this.visitorRepository.create({
      fingerprint,
      ip,
      userAgent: userAgent ?? null,
      browser: parsedUA?.browser.name ?? null,
      os: parsedUA?.os.name ?? null,
      deviceType: parsedUA?.device.type ?? 'desktop',
      country: geo?.country ?? null,
      city: geo?.city ?? null
    });

    return await this.visitorRepository.save(visitor);
  }

  async trackEvent(
    dto: TrackEventDto,
    ip: string,
    userAgent: string | undefined
  ): Promise<void> {
    const visitor = await this.findOrCreateVisitor(ip, userAgent);

    const event = this.eventRepository.create({
      visitor,
      type: dto.type,
      path: dto.path ?? null,
      referrer: dto.referrer ?? null,
      meta: dto.meta ?? null
    });

    await this.eventRepository.save(event);
  }

  async getEventCountsByType(): Promise<{ type: string; count: number }[]> {
    const rows = await this.eventRepository
      .createQueryBuilder('event')
      .select('event.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('event.type')
      .orderBy('count', 'DESC')
      .getRawMany<{ type: string; count: string }>();

    return rows.map((r) => ({ type: r.type, count: Number(r.count) }));
  }

  async getSummary() {
    const totalEvents = await this.eventRepository.count();

    const uniqueVisitors = await this.visitorRepository.count();

    const eventCountsByType = await this.getEventCountsByType();

    const topPaths = await this.eventRepository
      .createQueryBuilder('event')
      .select('event.path', 'label')
      .addSelect('COUNT(*)', 'count')
      .where('event.type = :type', { type: 'page_view' })
      .andWhere('event.path IS NOT NULL')
      .groupBy('event.path')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany<{ label: string; count: string }>();

    const topReferrers = await this.eventRepository
      .createQueryBuilder('event')
      .select('event.referrer', 'label')
      .addSelect('COUNT(*)', 'count')
      .where('event.referrer IS NOT NULL')
      .groupBy('event.referrer')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany<{ label: string; count: string }>();

    const deviceBreakdown = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select("COALESCE(visitor.deviceType, 'unknown')", 'label')
      .addSelect('COUNT(*)', 'count')
      .groupBy('label')
      .orderBy('count', 'DESC')
      .getRawMany<{ label: string; count: string }>();

    const countryBreakdown = await this.visitorRepository
      .createQueryBuilder('visitor')
      .select("COALESCE(visitor.country, 'unknown')", 'label')
      .addSelect('COUNT(*)', 'count')
      .groupBy('label')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany<{ label: string; count: string }>();

    const toNumberBuckets = (rows: { label: string; count: string }[]) =>
      rows.map((r) => ({ label: r.label, count: Number(r.count) }));

    return {
      totalEvents,
      uniqueVisitors,
      eventCountsByType,
      topPaths: toNumberBuckets(topPaths),
      topReferrers: toNumberBuckets(topReferrers),
      deviceBreakdown: toNumberBuckets(deviceBreakdown),
      countryBreakdown: toNumberBuckets(countryBreakdown)
    };
  }
}
