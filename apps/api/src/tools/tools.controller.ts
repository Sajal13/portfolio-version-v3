import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ToolsResponseDto } from './dto/tools-response.dto';
import { ToolsService } from './tools.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateToolDto } from './dto/create-tools.dto';
import { UpdateToolDto } from './dto/update-tools.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all the tools' })
  @ApiResponse({ status: 200, type: ToolsResponseDto, isArray: true })
  @ResponseMessage('Get tool successful.')
  async getTools() {
    return await this.toolsService.getTools();
  }

  @Public()
  @Get('/:id')
  @ResponseMessage('Tool fetched successfully.')
  @ApiOperation({ summary: 'Get tool by id.' })
  @ApiResponse({ status: 200, type: ToolsResponseDto })
  async getToolById(@Param('id', ParseIntPipe) id: number) {
    return await this.toolsService.getToolById(id);
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add new tool' })
  @ApiResponse({ status: 201, type: ToolsResponseDto })
  @ResponseMessage('Tool created successfully.')
  async createTool(@Body() dto: CreateToolDto) {
    return await this.toolsService.createTool(dto);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tool by id' })
  @ApiResponse({ status: 200, type: ToolsResponseDto })
  @ResponseMessage('Tool updated successfully.')
  async updateTool(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateToolDto
  ) {
    return await this.toolsService.updateTool(id, dto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tool by id' })
  @ApiResponse({ status: 200, description: 'Tool deleted successfully.' })
  @ResponseMessage('Tool deleted successfully.')
  async deleteTool(@Param('id', ParseIntPipe) id: number) {
    return await this.toolsService.deleteTool(id);
  }
}
