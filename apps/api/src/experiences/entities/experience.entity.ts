import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Tool } from '../../tools/entities/tool.entity';
import { ExperienceType } from '../types/experienceType';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({
    type: 'enum',
    enum: ExperienceType,
    default: ExperienceType.fullTime
  })
  experienceType: ExperienceType;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  company: string;

  @Column({ type: 'text' })
  location: string;

  @Column({ type: 'text' })
  startDate: string;

  @Column({ type: 'text', nullable: true })
  endDate: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: true })
  order: number;

  @ManyToMany(() => Tool)
  @JoinTable({
    name: 'experience_tools',
    joinColumn: { name: 'experience_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tool_id', referencedColumnName: 'id' }
  })
  tools: Tool[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
