import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ReportStatuses {
  NEW = 'new',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  mileage: number;

  @Column()
  year: number;

  @Column()
  lng: number;

  @Column()
  lat: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  updatedByUserId: number;

  @Column({ nullable: false })
  submittedByUserId: number;

  @Column({ enum: ReportStatuses, default: ReportStatuses.NEW })
  status: string;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;

  @Column()
  description: string;
}
