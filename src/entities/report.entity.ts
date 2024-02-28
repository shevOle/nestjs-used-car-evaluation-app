import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
