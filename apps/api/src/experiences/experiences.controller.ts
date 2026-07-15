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
import { ExperiencesService } from './experiences.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { ExperienceResponseDto } from './dto/experience-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { UpdateExperiencePositionDto } from './dto/update-experience-position.dto';

@ApiTags('experiences')
@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all experiences' })
  @ApiResponse({ status: 200, type: ExperienceResponseDto, isArray: true })
  @ResponseMessage('Experience get successful.')
  async getAllExperiences() {
    return this.experiencesService.getExperiences();
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a experience' })
  @ApiResponse({ status: 201, type: ExperienceResponseDto })
  @ResponseMessage('Experience created successfully')
  async createExperience(@Body() dto: CreateExperienceDto) {
    return this.experiencesService.createExperience(dto);
  }

  @Put('/update-position')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the display order of experiences (drag-and-drop reorder)'
  })
  @ApiResponse({ status: 200, type: [ExperienceResponseDto] })
  @ResponseMessage('Experience order updated successfully.')
  async updatePosition(@Body() dto: UpdateExperiencePositionDto) {
    return await this.experiencesService.updateExperiencePosition(dto);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a experience' })
  @ApiResponse({ status: 200, type: ExperienceResponseDto })
  @ResponseMessage('Experience updated successfully.')
  async updateExperience(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateExperienceDto
  ) {
    return await this.experiencesService.updateExperience(id, dto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a experience' })
  @ApiResponse({ status: 200, description: 'Experience deleted successfully.' })
  @ResponseMessage('Experience deleted successfully')
  async deleteExperience(@Param('id', ParseIntPipe) id: number) {
    return await this.experiencesService.deleteExperience(id);
  }
}
