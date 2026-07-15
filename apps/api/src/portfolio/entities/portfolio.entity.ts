import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { ProjectType } from '../enum/projectType.enum';
import { Tool } from '../../tools/entities/tool.entity';

@Entity('portfolio')
export class Portfolio {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text', unique: true })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  publishedDate: string;

  @Column({ type: 'enum', enum: ProjectType, default: ProjectType.featured })
  projectType: ProjectType;

  @ManyToMany(() => Tool)
  @JoinTable({
    name: 'portfolio_tools',
    joinColumn: { name: 'portfolio_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tool_id', referencedColumnName: 'id' }
  })
  tools: Tool[];

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'text' })
  liveLink: string;

  @Column({ type: 'text' })
  githubLink: string;

  @Column({ type: 'int' })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
