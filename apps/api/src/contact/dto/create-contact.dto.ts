import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Hi, I would love to work with you on a project.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(2000)
  message: string;

  // Honeypot field. Real users never see or fill this (hidden via CSS on
  // the frontend). Bots that auto-fill every input will populate it, so
  // any non-empty value here is a strong signal of automated spam.
  @ApiProperty({
    required: false,
    description: 'Leave empty. Hidden anti-spam field.'
  })
  @IsOptional()
  @IsEmpty({ message: 'Spam detected.' })
  website?: string;
}
