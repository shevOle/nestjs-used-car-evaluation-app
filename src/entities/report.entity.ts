import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

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

  @Column()
  updatedByUserId: number;

  @Column({ enum: ['new', 'approved', 'rejected'], default: 'new' })
  status: string;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
