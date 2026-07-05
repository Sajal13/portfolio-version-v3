import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ToolsResponseDto {
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;

  @Expose()
  @ApiProperty({ example: 'React' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'https://example.com/icon.png', required: false })
  icon?: string;
}
