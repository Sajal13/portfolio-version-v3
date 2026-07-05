import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProfileResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 5 })
  totalYearsOfExperience: number;

  @Expose()
  @ApiProperty({ example: 20 })
  totalProjects: number;

  @Expose()
  @ApiProperty({ example: 10 })
  totalClients: number;
}
