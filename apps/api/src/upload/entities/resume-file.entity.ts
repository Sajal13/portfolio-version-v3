import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('resume_files')
export class ResumeFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @Column({ type: 'text' })
  originalName: string;

  @Column({ type: 'text', default: 'application/pdf' })
  mimeType: string;

  @CreateDateColumn()
  createdAt: Date;
}
