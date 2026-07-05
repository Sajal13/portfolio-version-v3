import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateToolDto {
  @ApiProperty({ example: 'React' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://example.com/icon.png', required: false })
  @IsString()
  @IsOptional()
  icon?: string;
}
