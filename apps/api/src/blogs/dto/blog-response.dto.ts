import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

class ToolSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'NestJS' })
  name: string;
}

class MarkdownSummaryDto {
  @ApiProperty({ example: 'b3f1c2a0-1234-4a5b-9abc-1234567890ab' })
  id: string;

  @ApiProperty({ example: '# Hello there\n\nThis is the blog body.' })
  content: string;
}

@Exclude()
export class BlogResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'How I built my portfolio with NestJS' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'how-i-built-my-portfolio-with-nestjs' })
  @Expose()
  slug: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../blog-cover.png' })
  @Expose()
  image: string;

  @ApiProperty({ type: MarkdownSummaryDto })
  @Expose()
  markdown: MarkdownSummaryDto;

  @ApiProperty({ type: [ToolSummaryDto] })
  @Expose()
  tools: ToolSummaryDto[];

  @ApiProperty({ example: '2026-07-11T13:50:21.496Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-07-11T13:50:21.496Z' })
  @Expose()
  updatedAt: Date;
}
