import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ToolsResponseDto } from './dto/tools-response.dto';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all the tools' })
  @ApiResponse({ status: 200, type: ToolsResponseDto, isArray: true })
  async getTools() {
    console.log('hello');
  }
}
