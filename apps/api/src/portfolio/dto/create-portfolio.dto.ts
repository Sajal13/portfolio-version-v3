import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';
import { ProjectType } from '../enum/projectType.enum';

export class CreatePortfolioDto {
  @ApiProperty({ example: 'Abcd project' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Abcd project is for example. It uses something' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-01-01' })
  @IsString()
  @IsOptional()
  publishedDate?: string;

  @ApiProperty({ enum: ProjectType, example: ProjectType.featured })
  @IsEnum(ProjectType)
  @IsNotEmpty()
  projectType: ProjectType;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  tools: number[];

  @ApiProperty({ example: 'https:res.cloudinary.con/abcd.png' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'https://abacd.com' })
  @IsString()
  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  liveLink: string;

  @ApiProperty({ example: 'https://github.com/aocb' })
  @IsString()
  @IsUrl({ require_protocol: true })
  @IsNotEmpty()
  githubLink: string;
}
