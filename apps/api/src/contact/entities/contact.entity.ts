import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Index()
  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  message: string;

  @Index()
  @Column({ type: 'text' })
  ip: string;

  @CreateDateColumn()
  createdAt: Date;
}
