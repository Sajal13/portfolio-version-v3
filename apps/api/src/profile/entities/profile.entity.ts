import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  totalYearsOfExperience: number;

  @Column({ type: 'int' })
  totalProjects: number;

  @Column({ type: 'int' })
  totalClients: number;
}
