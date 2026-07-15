import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID
} from 'class-validator';

export class CreateBlogDto {
  @ApiProperty({ example: 'How I built my portfolio with NestJS' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../blog-cover.png' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    example: 'b3f1c2a0-1234-4a5b-9abc-1234567890ab',
    description:
      'Id of the already-uploaded MarkdownFile (from POST /upload) that holds this blog content.'
  })
  @IsUUID()
  @IsNotEmpty()
  markdownId: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Tool ids used in this blog'
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  tools: number[];
}
