import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newStrongerPassword456' })
  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  newPassword: string;

  @ApiProperty({ example: 'newStrongerPassword456' })
  @IsString()
  @Match('newPassword', { message: 'Passwords do not match' })
  confirmPassword: string;
}