import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadApiResponse, v2 as CloudinaryType } from 'cloudinary';
import * as streamifier from 'streamifier';
import { MarkdownFile } from './entities/markdown-file.entity';
import { CLOUDINARY } from '../common/cloudinary/cloudinary.provider';
import { UploadFolder } from './dto/upload-file.dto';
import { ResumeFile } from './entities/resume-file.entity';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MARKDOWN_MIME_TYPES = ['text/markdown', 'text/x-markdown', 'text/plain'];
const PDF_MIME_TYPES = ['application/pdf'];
const CLOUDINARY_ROOT_FOLDER = 'portfolio-app';

@Injectable()
export class UploadService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryType,
    @InjectRepository(MarkdownFile)
    private readonly markdownFileRepository: Repository<MarkdownFile>,
    @InjectRepository(ResumeFile)
    private readonly resumeFileRepository: Repository<ResumeFile>
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    folder: UploadFolder
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file provided.');
    }

    // Resume goes to DB regardless of mimetype sniffing quirks,
    // as long as it's actually a PDF and the folder says "resume".
    if (folder === 'resume') {
      if (
        !PDF_MIME_TYPES.includes(file.mimetype) &&
        !file.originalname.endsWith('.pdf')
      ) {
        throw new BadRequestException(
          'Only PDF files are allowed for the resume.'
        );
      }
      return this.saveResumeToDatabase(file);
    }

    if (IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return this.uploadImageToCloudinary(file, folder);
    }

    if (
      MARKDOWN_MIME_TYPES.includes(file.mimetype) ||
      file.originalname.endsWith('.md')
    ) {
      return this.saveMarkdownToDatabase(file);
    }

    throw new BadRequestException(`Unsupported file type: ${file.mimetype}.`);
  }

  private uploadImageToCloudinary(
    file: Express.Multer.File,
    folder: UploadFolder
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: `${CLOUDINARY_ROOT_FOLDER}/${folder}`,
          resource_type: 'image'
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(
              new BadRequestException('Failed to upload image to Cloudinary.')
            );
          }
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private async saveMarkdownToDatabase(
    file: Express.Multer.File
  ): Promise<string> {
    const markdownFile = this.markdownFileRepository.create({
      content: file.buffer.toString('utf-8'),
      originalName: file.originalname
    });

    const saved = await this.markdownFileRepository.save(markdownFile);

    return `/api/v1/upload/markdown/${saved.id}`;
  }

  private async saveResumeToDatabase(
    file: Express.Multer.File
  ): Promise<string> {
    await this.resumeFileRepository.clear();

    const resumeFile = this.resumeFileRepository.create({
      data: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype
    });

    await this.resumeFileRepository.save(resumeFile);

    return `/api/v1/upload/resume/download`;
  }

  async getResumeFile(): Promise<ResumeFile> {
    const [resume] = await this.resumeFileRepository.find({
      take: 1,
      order: { createdAt: 'DESC' }
    });

    if (!resume) {
      throw new BadRequestException('No resume uploaded yet.');
    }

    return resume;
  }

  async getMarkdownContent(id: string): Promise<string> {
    const markdownFile = await this.markdownFileRepository.findOneBy({ id });

    if (!markdownFile) {
      throw new BadRequestException(`Markdown file with id ${id} not found.`);
    }

    return markdownFile.content;
  }
}
