import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TestimonialResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Jane Doe' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Product Manager' })
  @Expose()
  designation: string;

  @ApiProperty({ example: 'Acme Inc.' })
  @Expose()
  company: string;

  @ApiProperty({
    example:
      'Working with Sajal was a fantastic experience. Highly recommended!'
  })
  @Expose()
  description: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../jane-doe.png' })
  image: string;

  @ApiProperty({ example: 1 })
  @Expose()
  order: number;

  @ApiProperty({ example: '2026-07-11T13:50:21.496Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-11T13:50:21.496Z' })
  updatedAt: Date;
}
