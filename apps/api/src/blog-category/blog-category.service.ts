import {
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogCategory } from './entities/blog-category.entity';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(
    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>
  ) {}

  async getAllCategories(): Promise<BlogCategory[]> {
    return await this.categoryRepository.find({ order: { name: 'ASC' } });
  }

  async getCategoryById(id: number): Promise<BlogCategory> {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }

    return category;
  }

  async createCategory(dto: CreateBlogCategoryDto): Promise<BlogCategory> {
    const existing = await this.categoryRepository.findOne({
      where: { name: dto.name }
    });

    if (existing) {
      throw new ConflictException(
        `Category with name "${existing.name}" already exists.`
      );
    }

    const slug = this.slugify(dto.name);

    const existingSlug = await this.categoryRepository.findOne({
      where: { slug }
    });

    if (existingSlug) {
      throw new ConflictException(
        `A category resolving to slug "${slug}" already exists.`
      );
    }

    const category = this.categoryRepository.create({ name: dto.name, slug });
    return await this.categoryRepository.save(category);
  }

  async updateCategory(
    id: number,
    dto: UpdateBlogCategoryDto
  ): Promise<BlogCategory> {
    const category = await this.getCategoryById(id);

    if (dto.name) {
      category.name = dto.name;
      category.slug = this.slugify(dto.name);
    }

    return await this.categoryRepository.save(category);
  }

  async deleteCategory(id: number): Promise<{ id: number }> {
    const category = await this.getCategoryById(id);

    try {
      await this.categoryRepository.remove(category);
    } catch (error) {
      if (this.isForeignKeyViolation(error)) {
        throw new ConflictException(
          `Cannot delete "${category.name}" — it's still assigned to one or more blogs. Reassign or delete those blogs first.`
        );
      }
      throw error;
    }

    return { id };
  }

  // Checked via the raw Postgres SQLSTATE code, not `instanceof QueryFailedError`,
  // since the code (not the error class) is what tells us *which* FK failure
  // this is. 23503 = foreign_key_violation (an insert/update referencing a
  // row that doesn't exist); 23001 = restrict_violation (a delete blocked by
  // ON DELETE RESTRICT, which is what a category-delete-with-blogs hits).
  private isForeignKeyViolation(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
      return false;
    }

    const err = error as Record<string, unknown>;
    const driverError = err.driverError as Record<string, unknown> | undefined;
    const code = (driverError?.code ?? err.code) as string | undefined;

    return code === '23503' || code === '23001';
  }

  private slugify(value: string): string {
    return value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
