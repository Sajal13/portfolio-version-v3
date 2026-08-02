import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({example: 'ey..........'})
  @IsString()
  @IsNotEmpty()
  preAuthToken: string;

  @ApiProperty({ example: '12345'})
  @IsString()
  @Length(6, 6, { message: 'OTP must be a 6-digit code' })
  otp: string;
}