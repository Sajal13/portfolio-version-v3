import { PartialType } from '@nestjs/swagger';
import { CreateToolDto } from './create-tools.dto';

export class UpdateToolDto extends PartialType(CreateToolDto) {}
