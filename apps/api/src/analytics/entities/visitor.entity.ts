import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  // sha256(ip + userAgent), truncated. Lets us find-or-create a visitor
  // in one indexed lookup instead of matching on raw ip+userAgent pairs.
  @Index({ unique: true })
  @Column({ type: 'text' })
  fingerprint: string;

  @Index()
  @Column({ type: 'text' })
  ip: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @Column({ type: 'text', nullable: true })
  browser: string | null;

  @Column({ type: 'text', nullable: true })
  os: string | null;

  // 'desktop' | 'mobile' | 'tablet'
  @Index()
  @Column({ type: 'text', nullable: true })
  deviceType: string | null;

  @Index()
  @Column({ type: 'text', nullable: true })
  country: string | null;

  @Column({ type: 'text', nullable: true })
  city: string | null;

  // First time this fingerprint was ever seen.
  @CreateDateColumn()
  firstSeenAt: Date;

  // Bumped every time this fingerprint generates a new event.
  @UpdateDateColumn()
  lastSeenAt: Date;
}
