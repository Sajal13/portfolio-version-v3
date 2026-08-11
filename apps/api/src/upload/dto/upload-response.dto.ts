// dto/upload-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UploadResponseDTO {
  @ApiProperty({ example: 'bbbg-sdsd-dffffd' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'example.md' })
  @IsString()
  originalName: string;

  @ApiProperty({
    example: 'https://api.yourapp.com/api/v1/upload/markdown/bbbg-sdsd-dffffd'
  })
  @IsString()
  url: string;
}
