import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Visitor } from './visitor.entity';
import { EventType } from '../enum/event-type.enum';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Index()
  @ManyToOne(() => Visitor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'visitor_id' })
  visitor: Visitor;

  @Index()
  @Column({ type: 'enum', enum: EventType })
  type: EventType;

  // Which page the event happened on, e.g. "/blog/how-i-built-my-portfolio"
  @Index()
  @Column({ type: 'text', nullable: true })
  path: string | null;

  // Only meaningful for page_view events (where the visitor came from).
  @Column({ type: 'text', nullable: true })
  referrer: string | null;

  // Flexible structured payload for anything event-specific, e.g. for a
  // click: { "elementId": "cta-button", "label": "Contact me" }.
  // Avoids adding a new column every time you add a new event type.
  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, unknown> | null;

  @Index()
  @CreateDateColumn()
  createdAt: Date;
}
