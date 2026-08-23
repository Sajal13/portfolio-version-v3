import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Min } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 1, description: 'Id of the referenced Tool' })
  @IsInt()
  title: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(0)
  progress: number;

  @ApiProperty({ example: 'Frontend' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'JavaScript' })
  @IsString()
  parent: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive: boolean;
}
