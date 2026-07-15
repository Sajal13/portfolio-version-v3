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
import { plainToInstance } from 'class-transformer';
import { SkillsService } from './skills.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillResponseDto } from './dto/skill-response.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, type: SkillResponseDto, isArray: true })
  @ResponseMessage('Skills get successful.')
  async getAllSkills() {
    const skills = await this.skillsService.getAllSkills();

    if (skills.length === 0) {
      return { success: true, message: 'No skills found', data: [] };
    }
    return plainToInstance(SkillResponseDto, skills);
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Get a skill by id' })
  @ApiResponse({ status: 200, type: SkillResponseDto })
  @ResponseMessage('Skill get successful.')
  async getSkillById(@Param('id', ParseIntPipe) id: number) {
    const skill = await this.skillsService.getSkillById(id);
    return plainToInstance(SkillResponseDto, skill);
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, type: SkillResponseDto })
  @ResponseMessage('Skill created successfully.')
  async createSkill(@Body() dto: CreateSkillDto) {
    const skill = await this.skillsService.createSkill(dto);
    return plainToInstance(SkillResponseDto, skill);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill' })
  @ApiResponse({ status: 200, type: SkillResponseDto })
  @ResponseMessage('Skill updated successfully.')
  async updateSkill(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSkillDto
  ) {
    const skill = await this.skillsService.updateSkill(id, dto);
    return plainToInstance(SkillResponseDto, skill);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a skill' })
  @ApiResponse({ status: 200, description: 'Skill deleted successfully.' })
  @ResponseMessage('Skill deleted successfully')
  async deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.deleteSkill(id);
  }
}
