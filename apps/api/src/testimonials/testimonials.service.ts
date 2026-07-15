import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { UpdateTestimonialPositionDto } from './dto/update-testimonial-position.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,

    private readonly dataSource: DataSource
  ) {}

  async getAllTestimonials(): Promise<Testimonial[]> {
    return await this.testimonialRepository.find({
      order: { order: 'ASC' }
    });
  }

  async getTestimonialById(id: number): Promise<Testimonial> {
    const testimonial = await this.testimonialRepository.findOneBy({ id });

    if (!testimonial) {
      throw new NotFoundException(`Testimonial with id ${id} not found`);
    }

    return testimonial;
  }

  async createTestimonial(dto: CreateTestimonialDto): Promise<Testimonial> {
    const existingTestimonial = await this.testimonialRepository.findOne({
      where: { name: dto.name }
    });

    if (existingTestimonial) {
      throw new ConflictException(
        `Testimonial with ${dto.name} is already exists.`
      );
    }

    const maxPosition = await this.testimonialRepository
      .createQueryBuilder('testimonial')
      .select('MAX(testimonial.order)', 'max')
      .getRawOne<{ max: number | null }>();

    const testimonial = this.testimonialRepository.create({
      ...dto,
      order: (maxPosition?.max ?? 0) + 1
    });

    return await this.testimonialRepository.save(testimonial);
  }

  async updateTestimonial(
    id: number,
    dto: UpdateTestimonialDto
  ): Promise<Testimonial> {
    const testimonial = await this.getTestimonialById(id);

    Object.assign(testimonial, dto);

    return await this.testimonialRepository.save(testimonial);
  }

  async deleteTestimonial(id: number): Promise<{ id: number }> {
    const testimonial = await this.getTestimonialById(id);
    await this.testimonialRepository.remove(testimonial);
    return { id };
  }

  async updateTestimonialPosition(
    dto: UpdateTestimonialPositionDto
  ): Promise<Testimonial[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ids = dto.positions.map((p) => p.id);

      await queryRunner.manager
        .createQueryBuilder(Testimonial, 'testimonial')
        .setLock('pessimistic_write')
        .whereInIds(ids)
        .getMany();

      const caseStatements = dto.positions
        .map((p) => `WHEN ${p.id} THEN ${p.order}`)
        .join(' ');

      await queryRunner.manager.query(
        `UPDATE testimonials SET "order" = CASE id ${caseStatements} END WHERE id IN (${ids.join(',')})`
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    return await this.getAllTestimonials();
  }
}
