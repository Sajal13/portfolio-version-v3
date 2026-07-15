import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export const ALLOWED_UPLOAD_FOLDERS = [
  'portfolio',
  'banner',
  'tools',
  'blogs',
  'testimonial',
  'categories',
  'resume'
] as const;

export type UploadFolder = (typeof ALLOWED_UPLOAD_FOLDERS)[number];

export class UploadFileDto {
  @ApiProperty({ enum: ALLOWED_UPLOAD_FOLDERS, example: 'portfolio' })
  @IsString()
  @IsNotEmpty()
  @IsIn(ALLOWED_UPLOAD_FOLDERS)
  folder: UploadFolder;
}
