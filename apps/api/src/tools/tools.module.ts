import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from './entities/tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tool])],
  controllers: [ToolsController],
  providers: [ToolsService]
})
export class ToolsModule {}
