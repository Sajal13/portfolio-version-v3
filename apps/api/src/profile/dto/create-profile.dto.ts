import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: 'I am a software engineer with 5 years of experience.'
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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
