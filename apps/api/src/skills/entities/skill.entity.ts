import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Tool } from '../../tools/entities/tool.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Tool, { eager: true })
  @JoinColumn({ name: 'tool_id' })
  title: Tool;

  @Column({ type: 'int' })
  progress: number;

  @Column({ type: 'text' })
  category: string;

  @Column({ type: 'text' })
  parent: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
