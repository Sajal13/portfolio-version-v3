import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { ResponseMessage } from '../common/decorators/response-message.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Roles('admin')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'portfolio' }
      }
    }
  })
  @ApiOperation({
    summary:
      'Upload an image (Cloudinary), markdown file (DB), or resume PDF (DB)'
  })
  @ApiResponse({ status: 201, type: String })
  @ResponseMessage('File uploaded successfully.')
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto
  ) {
    return this.uploadService.uploadFile(file, dto.folder);
  }

  @Get('markdown/:id')
  @Public()
  @ApiOperation({ summary: 'Retrieve raw markdown content by id' })
  @ApiResponse({ status: 200, type: String })
  @ResponseMessage('Markdown content fetched successfully.')
  async getMarkdown(@Param('id') id: string) {
    return this.uploadService.getMarkdownContent(id);
  }

  @Get('resume/download')
  @Public()
  @ApiOperation({ summary: 'Download the current resume PDF' })
  @ApiResponse({ status: 200 })
  async downloadResume(@Res({ passthrough: true }) res: Response) {
    const resume = await this.uploadService.getResumeFile();

    res.set({
      'Content-Type': resume.mimeType,
      'Content-Disposition': `attachment; filename="${resume.originalName}"`
    });

    return new StreamableFile(resume.data);
  }
}
