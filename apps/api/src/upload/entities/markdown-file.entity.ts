import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('markdown_files')
export class MarkdownFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  originalName: string;

  @CreateDateColumn()
  createdAt: Date;
}
