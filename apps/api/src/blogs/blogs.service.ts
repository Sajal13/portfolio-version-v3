import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { Blogs } from './entities/blogs.entity';
import { Tool } from '../tools/entities/tool.entity';
import { MarkdownFile } from '../upload/entities/markdown-file.entity';
import { BlogCategory } from '../blog-category/entities/blog-category.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,

    @InjectRepository(Tool)
    private readonly toolRepository: Repository<Tool>,

    @InjectRepository(MarkdownFile)
    private readonly markdownFileRepository: Repository<MarkdownFile>,

    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>
  ) {}

  private async resolveTools(toolIds: number[]): Promise<Tool[]> {
    const tools = await this.toolRepository.findBy({ id: In(toolIds) });

    if (tools.length !== toolIds.length) {
      const foundIds = tools.map((t) => t.id);
      const missing = toolIds.filter((id) => !foundIds.includes(id));
      throw new BadRequestException(`Tool(s) not found: ${missing.join(', ')}`);
    }

    return tools;
  }

  private async resolveMarkdown(markdownId: string): Promise<MarkdownFile> {
    const markdown = await this.markdownFileRepository.findOneBy({
      id: markdownId
    });

    if (!markdown) {
      throw new BadRequestException(
        `Markdown file with id ${markdownId} not found.`
      );
    }

    return markdown;
  }

  private async resolveCategory(categoryId: number): Promise<BlogCategory> {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId
    });

    if (!category) {
      throw new BadRequestException(
        `Category with id ${categoryId} not found.`
      );
    }

    return category;
  }

  /**
   * @param categorySlug - category slug to filter by. Omit, or pass "all",
   * to get every blog, newest first.
   */
  async getAllBlogs(categorySlug?: string): Promise<Blogs[]> {
    const where =
      categorySlug && categorySlug !== 'all'
        ? { category: { slug: categorySlug } }
        : {};

    return await this.blogsRepository.find({
      where,
      relations: { tools: true, category: true },
      order: { createdAt: 'DESC' }
    });
  }

  async searchBlogs(query: string): Promise<Blogs[]> {
    if (!query?.trim()) {
      return [];
    }

    return await this.blogsRepository.find({
      where: [
        { title: ILike(`%${query}%`) },
        { description: ILike(`%${query}%`) }
      ],
      relations: { tools: true, category: true },
      order: { createdAt: 'DESC' }
    });
  }

  async getBlogById(id: number): Promise<Blogs> {
    const blog = await this.blogsRepository.findOne({
      where: { id },
      relations: { tools: true, category: true }
    });

    if (!blog) {
      throw new NotFoundException(`Blog with id ${id} not found`);
    }

    return blog;
  }

  async getBlogBySlug(slug: string): Promise<Blogs> {
    const blog = await this.blogsRepository.findOne({
      where: { slug },
      relations: { tools: true, category: true }
    });

    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }

    return blog;
  }

  async createBlog(dto: CreateBlogDto): Promise<Blogs> {
    const existingBlog = await this.blogsRepository.findOne({
      where: { title: dto.title }
    });

    if (existingBlog) {
      throw new ConflictException(
        `Blog with title "${existingBlog.title}" already exists.`
      );
    }

    const [tools, markdown, category] = await Promise.all([
      this.resolveTools(dto.tools),
      this.resolveMarkdown(dto.markdownId),
      this.resolveCategory(dto.categoryId)
    ]);

    const slug = this.generateSlug(dto.title);

    const existingSlug = await this.blogsRepository.findOne({
      where: { slug }
    });

    if (existingSlug) {
      throw new ConflictException(
        `A blog resolving to slug "${slug}" already exists. Try a different title.`
      );
    }

    const blog = this.blogsRepository.create({
      title: dto.title,
      description: dto.description,
      slug,
      image: dto.image,
      tools,
      markdown,
      category
    });

    return await this.blogsRepository.save(blog);
  }

  async updateBlog(id: number, dto: UpdateBlogDto): Promise<Blogs> {
    const blog = await this.getBlogById(id);

    const { tools: toolIds, markdownId, categoryId, ...rest } = dto;

    Object.assign(blog, rest);

    if (toolIds) {
      blog.tools = await this.resolveTools(toolIds);
    }

    if (markdownId) {
      blog.markdown = await this.resolveMarkdown(markdownId);
    }

    if (categoryId) {
      blog.category = await this.resolveCategory(categoryId);
    }

    return await this.blogsRepository.save(blog);
  }

  async deleteBlog(id: number): Promise<{ id: number }> {
    const blog = await this.getBlogById(id);
    await this.blogsRepository.remove(blog);
    return { id };
  }

  private generateSlug(title: string): string {
    return title
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
