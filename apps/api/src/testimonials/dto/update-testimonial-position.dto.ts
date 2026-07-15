import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, ValidateNested } from 'class-validator';

class TestimonialPositionItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  order: number;
}

export class UpdateTestimonialPositionDto {
  @ApiProperty({ type: [TestimonialPositionItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TestimonialPositionItemDto)
  positions: TestimonialPositionItemDto[];
}
