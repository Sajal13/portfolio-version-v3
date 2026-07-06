import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tool } from './entities/tool.entity';
import { Repository } from 'typeorm';
import { CreateToolDto } from './dto/create-tools.dto';
import { UpdateToolDto } from './dto/update-tools.dto';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(Tool) private readonly toolsRepository: Repository<Tool>
  ) {}

  async getTools(): Promise<Tool[]> {
    return await this.toolsRepository.find();
  }

  async getToolById(id: number): Promise<Tool> {
    const tool = await this.toolsRepository.findOne({ where: { id } });

    if (!tool) throw new NotFoundException(`Tool not found by the ${id} id.`);

    return tool;
  }

  async createTool(dto: CreateToolDto): Promise<Tool> {
    const tool = this.toolsRepository.save(dto);
    return tool;
  }

  async updateTool(id: number, dto: UpdateToolDto): Promise<Tool> {
    const tool = await this.toolsRepository.findOne({ where: { id } });

    if (!tool) {
      throw new NotFoundException(`Tool not found by this ${id} id`);
    }

    const updatedTool = this.toolsRepository.merge(tool, dto);
    return this.toolsRepository.save(updatedTool);
  }
}
