import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Tool } from '../../tools/entities/tool.entity';
import { MarkdownFile } from '../../upload/entities/markdown-file.entity';
import { BlogCategory } from '../../blog-category/entities/blog-category.entity';

@Entity('blogs')
export class Blogs {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  slug: string;

  @Column({ type: 'text' })
  image: string;

  @OneToOne(() => MarkdownFile, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'markdown_id' })
  markdown: MarkdownFile;

  @ManyToMany(() => Tool)
  @JoinTable({
    name: 'blog_tools',
    joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tool_id', referencedColumnName: 'id' }
  })
  tools: Tool[];

  @ManyToOne(() => BlogCategory, (category) => category.blogs, {
    nullable: false,
    onDelete: 'RESTRICT'
  })
  @JoinColumn({ name: 'category_id' })
  category: BlogCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
