import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength
} from 'class-validator';
import { EventType } from '../enum/event-type.enum';

export class TrackEventDto {
  @ApiProperty({ enum: EventType, example: EventType.PAGE_VIEW })
  @IsEnum(EventType)
  type: EventType;

  @ApiProperty({ required: false, example: '/blog/how-i-built-my-portfolio' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  path?: string;

  @ApiProperty({ required: false, example: 'https://twitter.com/yourhandle' })
  @IsOptional()
  @IsUrl({ require_protocol: true })
  referrer?: string;

  @ApiProperty({
    required: false,
    example: { elementId: 'cta-button', label: 'Contact me' },
    description: 'Free-form structured data specific to this event type'
  })
  @IsOptional()
  @IsObject()
  meta?: Record<string, unknown>;
}
