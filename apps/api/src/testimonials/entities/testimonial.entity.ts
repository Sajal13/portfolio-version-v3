import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  designation: string;

  @Column({ type: 'text' })
  company: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'int' })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
