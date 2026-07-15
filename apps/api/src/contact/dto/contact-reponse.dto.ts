import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiProperty({ example: 'jane@example.com' })
  email: string;

  @ApiProperty({ example: 'Hi, I would love to work with you on a project.' })
  message: string;

  @ApiProperty({ example: '103.21.244.1' })
  ip: string;

  @ApiProperty({ example: '2026-07-11T13:50:21.496Z' })
  createdAt: Date;
}
