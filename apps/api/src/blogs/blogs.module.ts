import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blogs } from './entities/blogs.entity';
import { MarkdownFile } from '../upload/entities/markdown-file.entity';
import { Tool } from '../tools/entities/tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blogs, MarkdownFile, Tool])],
  controllers: [BlogsController],
  providers: [BlogsService]
})
export class BlogsModule {}
