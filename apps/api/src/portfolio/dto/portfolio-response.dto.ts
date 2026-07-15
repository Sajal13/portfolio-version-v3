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
import { Exclude, Expose, Type } from 'class-transformer';

class ToolResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'React' })
  @Expose()
  name: string;
}

@Exclude()
export class PortfolioResponseDto {
  @ApiProperty({ example: 'Abcd project' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Abcd project is for example. It uses something' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: '2026-01-01' })
  @Expose()
  @IsString()
  @IsOptional()
  publishedDate?: string;

  @ApiProperty({ enum: ProjectType, example: ProjectType.featured })
  @Expose()
  @IsEnum(ProjectType)
  @IsNotEmpty()
  projectType: ProjectType;

  @ApiProperty({ type: () => [ToolResponseDto] })
  @Expose()
  @Type(() => ToolResponseDto)
  tools: ToolResponseDto[];

  @ApiProperty({ example: 'https:res.cloudinary.con/abcd.png' })
  @Expose()
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: 'https://abacd.com' })
  @Expose()
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  liveLink: string;

  @ApiProperty({ example: 'https://github.com/aocb' })
  @Expose()
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  githubLink: string;
}
