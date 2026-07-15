import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './entities/portfolio.entity';
import { Tool } from '../tools/entities/tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, Tool])],
  controllers: [PortfolioController],
  providers: [PortfolioService]
})
export class PortfolioModule {}
