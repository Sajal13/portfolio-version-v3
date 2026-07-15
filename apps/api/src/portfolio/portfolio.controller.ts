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
import { PortfolioService } from './portfolio.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { PortfolioResponseDto } from './dto/portfolio-response.dto';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { UpdatePortfolioPositionDto } from './dto/update-portfolio-position.dto';

@ApiTags('portfolio')
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all portfolios' })
  @ApiResponse({ status: 200, type: PortfolioResponseDto, isArray: true })
  @ResponseMessage('Portfolio get successful.')
  async getAllPortfolios() {
    return this.portfolioService.getAllPortfolios();
  }

  @Get('/:id')
  @Public()
  @ApiOperation({ summary: 'Get a portfolio by id' })
  @ApiResponse({ status: 200, type: PortfolioResponseDto })
  @ResponseMessage('Portfolio get successful.')
  async getPortfolioById(@Param('id', ParseIntPipe) id: number) {
    return this.portfolioService.getPortfolioById(id);
  }

  @Post('/create')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a portfolio' })
  @ApiResponse({ status: 201, type: PortfolioResponseDto })
  @ResponseMessage('Portfolio created successfully')
  async createPortfolio(@Body() dto: CreatePortfolioDto) {
    return this.portfolioService.createPortfolio(dto);
  }

  @Put('/update-position')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update the display order of portfolios (drag-and-drop reorder)'
  })
  @ApiResponse({ status: 200, type: [PortfolioResponseDto] })
  @ResponseMessage('Portfolio order updated successfully.')
  async updatePosition(@Body() dto: UpdatePortfolioPositionDto) {
    return await this.portfolioService.updatePortfolioPosition(dto);
  }

  @Put('/update/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a portfolio' })
  @ApiResponse({ status: 200, type: PortfolioResponseDto })
  @ResponseMessage('Portfolio updated successfully.')
  async updatePortfolio(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePortfolioDto
  ) {
    return await this.portfolioService.updatePortfolio(id, dto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a portfolio' })
  @ApiResponse({ status: 200, description: 'Portfolio deleted successfully.' })
  @ResponseMessage('Portfolio deleted successfully')
  async deletePortfolio(@Param('id', ParseIntPipe) id: number) {
    return await this.portfolioService.deletePortfolio(id);
  }
}
