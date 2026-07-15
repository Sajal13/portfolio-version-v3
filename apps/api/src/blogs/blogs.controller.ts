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
import { BlogsService } from './blogs.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { BlogResponseDto } from './dto/blog-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blogs, newest first' })
  @ApiResponse({ status: 200, type: BlogResponseDto, isArray: true })
  @ResponseMessage('Blogs get successful.')
  async getAllBlogs() {
    return this.blogsService.getAllBlogs();
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ summary: 'Get a blog by id' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  @ResponseMessage('Blog get successful.')
  async getBlogById(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.getBlogById(id);
  }

  @Get('/slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Get a blog by slug' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  @ResponseMessage('Blog get successful.')
  async getBlogBySlug(@Param('slug') slug: string) {
    return this.blogsService.getBlogBySlug(slug);
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a blog' })
  @ApiResponse({ status: 201, type: BlogResponseDto })
  @ResponseMessage('Blog created successfully')
  async createBlog(@Body() dto: CreateBlogDto) {
    return this.blogsService.createBlog(dto);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog' })
  @ApiResponse({ status: 200, type: BlogResponseDto })
  @ResponseMessage('Blog updated successfully.')
  async updateBlog(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto
  ) {
    return await this.blogsService.updateBlog(id, dto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog' })
  @ApiResponse({ status: 200, description: 'Blog deleted successfully.' })
  @ResponseMessage('Blog deleted successfully')
  async deleteBlog(@Param('id', ParseIntPipe) id: number) {
    return await this.blogsService.deleteBlog(id);
  }
}
