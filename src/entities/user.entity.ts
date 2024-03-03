import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @Column({ default: false })
  isAdmin: boolean;
}
