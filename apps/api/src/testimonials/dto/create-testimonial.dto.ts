import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTestimonialDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Product Manager' })
  @IsString()
  @IsNotEmpty()
  designation: string;

  @ApiProperty({ example: 'Acme Inc.' })
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty({
    example:
      'Working with Sajal was a fantastic experience. Highly recommended!'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../jane-doe.png' })
  @IsString()
  @IsNotEmpty()
  image: string;
}
