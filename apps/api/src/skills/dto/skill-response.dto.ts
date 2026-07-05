import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class SkillResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'React' })
  title: string;

  @Expose()
  @ApiProperty({ example: 20 })
  progress: number;

  @Expose()
  @ApiProperty({ example: 'Frontend' })
  category: string;

  @Expose()
  @ApiProperty({ example: 'JavaScript' })
  parent: string;

  @Expose()
  @ApiProperty({ example: true })
  isActive: boolean;

  @Expose()
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
