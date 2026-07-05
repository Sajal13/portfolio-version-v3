import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, Min } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  title: string;

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
