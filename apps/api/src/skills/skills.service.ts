import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>
  ) {}

  async getAllSkills(): Promise<Skill[]> {
    return this.skillRepository.find();
  }

  async getSkillById(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    return skill;
  }

  async createSkill(dto: CreateSkillDto): Promise<Skill> {
    const skill = this.skillRepository.create(dto);
    return this.skillRepository.save(skill);
  }

  async updateSkill(id: number, dto: UpdateSkillDto): Promise<Skill> {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }

    const updated = this.skillRepository.merge(skill, dto);
    return this.skillRepository.save(updated);
  }

  async deleteSkill(id: number) {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) {
      throw new NotFoundException(`Skill with id ${id} not found`);
    }
    await this.skillRepository.delete(id);
    return { success: true, message: `Skill with id ${id} has been deleted` };
  }
}
