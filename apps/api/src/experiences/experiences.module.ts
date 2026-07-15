import { Module } from '@nestjs/common';
import { ExperiencesController } from './experiences.controller';
import { ExperiencesService } from './experiences.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { Tool } from '../tools/entities/tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Tool])],
  controllers: [ExperiencesController],
  providers: [ExperiencesService]
})
export class ExperiencesModule {}
