import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MarkdownFile } from './entities/markdown-file.entity';
import { CloudinaryProvider } from '../common/cloudinary/cloudinary.provider';
import { ResumeFile } from './entities/resume-file.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarkdownFile, ResumeFile, Profile]),
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 }
    })
  ],
  controllers: [UploadController],
  providers: [UploadService, CloudinaryProvider],
  exports: [UploadService]
})
export class UploadModule {}
