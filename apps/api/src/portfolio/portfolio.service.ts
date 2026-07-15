import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Tool } from '../tools/entities/tool.entity';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdatePortfolioPositionDto } from './dto/update-portfolio-position.dto';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,

    @InjectRepository(Tool)
    private readonly toolRepository: Repository<Tool>,

    private readonly dataSource: DataSource
  ) {}

  async getAllPortfolios(): Promise<Portfolio[]> {
    return await this.portfolioRepository.find({
      relations: { tools: true },
      order: { order: 'ASC' }
    });
  }

  async getPortfolioById(id: number): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: { tools: true }
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with id ${id} not found`);
    }

    return portfolio;
  }

  private async resolveTools(toolIds: number[]): Promise<Tool[]> {
    const tools = await this.toolRepository.findBy({ id: In(toolIds) });

    if (tools.length !== toolIds.length) {
      const foundIds = tools.map((t) => t.id);
      const missing = toolIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(`Tool(s) not found: ${missing.join(', ')}`);
    }

    return tools;
  }

  async createPortfolio(dto: CreatePortfolioDto): Promise<Portfolio> {
    const tools = await this.resolveTools(dto.tools);

    const existingPortfolio = await this.portfolioRepository.findOne({
      where: { title: dto.title }
    });

    if (existingPortfolio) {
      throw new ConflictException(
        `Portfolio with ${existingPortfolio.title} title already exists.`
      );
    }

    const maxPosition = await this.portfolioRepository
      .createQueryBuilder('portfolio')
      .select('MAX(portfolio.order)', 'max')
      .getRawOne<{ max: number | null }>();

    const portfolio = this.portfolioRepository.create({
      ...dto,
      tools,
      order: (maxPosition?.max ?? 0) + 1
    });

    return await this.portfolioRepository.save(portfolio);
  }

  async updatePortfolio(
    id: number,
    dto: UpdatePortfolioDto
  ): Promise<Portfolio> {
    const portfolio = await this.getPortfolioById(id);

    const { tools: toolIds, ...rest } = dto;

    Object.assign(portfolio, rest);

    if (toolIds) {
      portfolio.tools = await this.resolveTools(toolIds);
    }

    return await this.portfolioRepository.save(portfolio);
  }

  async deletePortfolio(id: number): Promise<{ id: number }> {
    const portfolio = await this.getPortfolioById(id);
    await this.portfolioRepository.remove(portfolio);
    return { id };
  }

  async updatePortfolioPosition(
    dto: UpdatePortfolioPositionDto
  ): Promise<Portfolio[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ids = dto.positions.map((p) => p.id);

      await queryRunner.manager
        .createQueryBuilder(Portfolio, 'portfolio')
        .setLock('pessimistic_write')
        .whereInIds(ids)
        .getMany();

      const caseStatements = dto.positions
        .map((p) => `WHEN ${p.id} THEN ${p.order}`)
        .join(' ');

      await queryRunner.manager.query(
        `UPDATE portfolio SET "order" = CASE id ${caseStatements} END WHERE id IN (${ids.join(',')})`
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return await this.getAllPortfolios();
  }
}
