import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'text',
    nullable: true
  })
  @Exclude()
  hashedRefreshToken!: string | null;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @Column({
    type: 'text',
    nullable: true
  })
  @Exclude()
  otpCode!: string | null;

  @Column({
    type: 'timestamptz',
    nullable: true
  })
  @Exclude()
  otpExpiresAt!: Date | null;

  @Column({ type: 'int', default: 0 })
  @Exclude()
  otpAttempts: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}