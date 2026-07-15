import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsInt } from 'class-validator';

class PositionItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  order: number;
}

export class UpdatePortfolioPositionDto {
  @ApiProperty({ type: () => [PositionItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PositionItemDto)
  positions: PositionItemDto[];
}
