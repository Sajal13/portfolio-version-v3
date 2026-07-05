import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(0)
  totalYearsOfExperience: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  totalProjects: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(0)
  totalClients: number;
}
