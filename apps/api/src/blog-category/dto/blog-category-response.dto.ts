import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BlogCategoryResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'Web Development' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'web-development' })
  slug: string;

  @Expose()
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;
}
