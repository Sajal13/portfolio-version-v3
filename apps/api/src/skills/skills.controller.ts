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

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, type: SkillResponseDto, isArray: true })
  async getAllSkills() {
    const skills = await this.skillsService.getAllSkills();

    if (skills.length === 0) {
      return { success: true, message: 'No skills found', data: [] };
    }
    return plainToInstance(SkillResponseDto, skills);
  }

  @Public()
  @Get('/get/:id')
  @ApiOperation({ summary: 'Get a skill by id' })
  @ApiResponse({ status: 200, type: SkillResponseDto })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async getSkillById(@Param('id', ParseIntPipe) id: number) {
    const skill = await this.skillsService.getSkillById(id);
    return plainToInstance(SkillResponseDto, skill);
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, type: SkillResponseDto })
  async createSkill(@Body() dto: CreateSkillDto) {
    const skill = await this.skillsService.createSkill(dto);
    return plainToInstance(SkillResponseDto, skill);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a skill' })
  @ApiResponse({ status: 200, type: SkillResponseDto })
  @ApiResponse({ status: 404, description: 'Skill not found' })
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
  @ApiResponse({ status: 200, description: 'Skill deleted successfully' })
  @ApiResponse({ status: 404, description: 'Skill not found' })
  async deleteSkill(@Param('id', ParseIntPipe) id: number) {
    return this.skillsService.deleteSkill(id);
  }
}
