import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'Jane Doe', required: false })
  name?: string;

  @Expose()
  @ApiProperty({ example: 'user', enum: ['user', 'admin'] })
  role: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;
}
