import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ExperienceType } from '../types/experienceType';

class ToolResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'React' })
  @Expose()
  name: string;
}

@Exclude()
export class ExperienceResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ enum: ExperienceType, example: ExperienceType.fullTime })
  @Expose()
  experienceType: ExperienceType;

  @ApiProperty({ example: 'Software Engineer' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'abcd' })
  @Expose()
  company: string;

  @ApiProperty({ example: 'USA' })
  @Expose()
  location: string;

  @ApiProperty({ example: '2024-01-01' })
  @Expose()
  startDate: string;

  @ApiProperty({ example: '2026-01-01', nullable: true })
  @Expose()
  endDate: string;

  @ApiProperty({
    example: 'Worked as a software engineer in the abcd company.'
  })
  @Expose()
  description: string;

  @ApiProperty({ example: true })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: 1, nullable: true })
  @Expose()
  order: number;

  @ApiProperty({ type: () => [ToolResponseDto] })
  @Expose()
  @Type(() => ToolResponseDto)
  tools: ToolResponseDto[];

  @ApiProperty({ example: '2026-01-01T10:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-01-01T10:00:00.000Z' })
  @Expose()
  updatedAt: Date;
}
