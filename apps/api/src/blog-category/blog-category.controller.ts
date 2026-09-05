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
import { BlogCategoryService } from './blog-category.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { UpdateBlogCategoryDto } from './dto/update-blog-category.dto';
import { BlogCategoryResponseDto } from './dto/blog-category-response.dto';

@ApiTags('blog-category')
@Controller('blog-category')
export class BlogCategoryController {
  constructor(private readonly categoriesService: BlogCategoryService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all blog categories' })
  @ApiResponse({ status: 200, type: BlogCategoryResponseDto, isArray: true })
  @ResponseMessage('Categories get successful.')
  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ status: 200, type: BlogCategoryResponseDto })
  @ResponseMessage('Category get successful.')
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.getCategoryById(id);
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a category',
    description: 'Create a new blog category'
  })
  @ApiResponse({ status: 201, type: BlogCategoryResponseDto })
  @ResponseMessage('Category created successfully')
  async createCategory(@Body() dto: CreateBlogCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, type: BlogCategoryResponseDto })
  @ResponseMessage('Category updated successfully.')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogCategoryDto
  ) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({
    status: 409,
    description: 'Category still has blogs assigned to it'
  })
  @ResponseMessage('Category deleted successfully')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.deleteCategory(id);
  }
}
