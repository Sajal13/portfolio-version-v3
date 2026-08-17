import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsEnum
} from 'class-validator';
import { ExperienceStatus, ExperienceType } from '../types/experienceType';

export class CreateExperienceDto {
  @ApiProperty({ enum: ExperienceType, example: ExperienceType.fullTime })
  @IsEnum(ExperienceType)
  @IsNotEmpty()
  experienceType: ExperienceType;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'abcd' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({ example: 'USA' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ example: '2026-01-01', required: false })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({
    example: 'Worked as a software engineer in the abcd company.'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    enum: ExperienceStatus,
    example: ExperienceStatus.active,
    required: false,
    default: ExperienceStatus.active
  })
  @IsEnum(ExperienceStatus)
  @IsOptional()
  status?: ExperienceStatus;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  tools: number[];
}
