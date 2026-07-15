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
import { TestimonialsService } from './testimonials.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { TestimonialResponseDto } from './dto/testimonial-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { UpdateTestimonialPositionDto } from './dto/update-testimonial-position.dto';

@ApiTags('testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all testimonials' })
  @ApiResponse({ status: 200, type: TestimonialResponseDto, isArray: true })
  @ResponseMessage('Testimonials get successful.')
  async getAllTestimonials() {
    return this.testimonialsService.getAllTestimonials();
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ summary: 'Get a testimonial by id' })
  @ApiResponse({ status: 200, type: TestimonialResponseDto })
  @ResponseMessage('Testimonial get successful.')
  async getTestimonialById(@Param('id', ParseIntPipe) id: number) {
    return this.testimonialsService.getTestimonialById(id);
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a testimonial' })
  @ApiResponse({ status: 201, type: TestimonialResponseDto })
  @ResponseMessage('Testimonial created successfully')
  async createTestimonial(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.createTestimonial(dto);
  }

  @Put('/update-position')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the display order of testimonials (drag-and-drop reorder)'
  })
  @ApiResponse({ status: 200, type: [TestimonialResponseDto] })
  @ResponseMessage('Testimonial order updated successfully.')
  async updatePosition(@Body() dto: UpdateTestimonialPositionDto) {
    return await this.testimonialsService.updateTestimonialPosition(dto);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a testimonial' })
  @ApiResponse({ status: 200, type: TestimonialResponseDto })
  @ResponseMessage('Testimonial updated successfully.')
  async updateTestimonial(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTestimonialDto
  ) {
    return await this.testimonialsService.updateTestimonial(id, dto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a testimonial' })
  @ApiResponse({
    status: 200,
    description: 'Testimonial deleted successfully.'
  })
  @ResponseMessage('Testimonial deleted successfully')
  async deleteTestimonial(@Param('id', ParseIntPipe) id: number) {
    return await this.testimonialsService.deleteTestimonial(id);
  }
}
