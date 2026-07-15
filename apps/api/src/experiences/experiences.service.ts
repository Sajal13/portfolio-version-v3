import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { In, Repository } from 'typeorm';
import { Tool } from '../tools/entities/tool.entity';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperiencePositionDto } from './dto/update-experience-position.dto';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
    @InjectRepository(Tool)
    private readonly toolsRepository: Repository<Tool>
  ) {}

  async getExperiences(): Promise<Experience[]> {
    return await this.experienceRepository.find({ relations: { tools: true } });
  }

  async createExperience(createDto: CreateExperienceDto): Promise<Experience> {
    const { tools, ...rest } = createDto;

    return this.experienceRepository.manager.transaction(async (manager) => {
      const toolItems = await manager.findBy(Tool, { id: In(tools) });

      const lastExperience = await manager
        .createQueryBuilder(Experience, 'experience')
        .orderBy('experience.order', 'DESC')
        .setLock('pessimistic_write')
        .getOne();

      const nextOrder = (lastExperience?.order ?? 0) + 1;

      const experience = manager.create(Experience, {
        ...rest,
        order: nextOrder,
        tools: toolItems
      });

      return manager.save(experience);
    });
  }

  async updateExperiencePosition(
    updatePositionDto: UpdateExperiencePositionDto
  ): Promise<Experience[]> {
    const { positions } = updatePositionDto;

    if (positions.length === 0) return [];

    await this.experienceRepository.manager.transaction(async (manager) => {
      const ids = positions.map((p) => p.id);

      // Build one UPDATE ... CASE WHEN ... query instead of N separate updates
      const caseStatement = positions
        .map((p) => `WHEN ${p.id} THEN ${p.order}`)
        .join(' ');

      await manager
        .createQueryBuilder()
        .update(Experience)
        .set({ order: () => `CASE id ${caseStatement} END` })
        .where('id IN (:...ids)', { ids })
        .execute();
    });

    return this.experienceRepository.find({
      where: { id: In(positions.map((p) => p.id)) },
      relations: { tools: true },
      order: { order: 'ASC' }
    });
  }
  async updateExperience(
    id: number,
    updateExperienceDto: UpdateExperienceDto
  ): Promise<Experience> {
    const { tools, ...rest } = updateExperienceDto;

    const experience = await this.experienceRepository.preload({
      id,
      ...rest
    });

    if (!experience) {
      throw new NotFoundException(`Experience with id ${id} not found.`);
    }

    if (tools) {
      experience.tools = await this.toolsRepository.findBy({ id: In(tools) });
    }

    return this.experienceRepository.save(experience);
  }

  async deleteExperience(id: number): Promise<void> {
    const experience = await this.experienceRepository.findOneBy({ id });

    if (!experience) {
      throw new NotFoundException(`Experience with id ${id} not found.`);
    }

    await this.experienceRepository.delete(id);
  }
}
