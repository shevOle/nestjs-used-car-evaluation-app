import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User> {
    if (!id) return null;
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) return null;
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(email: string, password: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = this.userRepository.create({ email, password });
    return this.userRepository.save(user);
  }

  async update(id: number, update: Partial<User>) {
    if (!id) throw new BadRequestException('User Id is needed');
    const originalUser = await this.findById(id);
    const newUser = this.userRepository.create({ ...originalUser, ...update });

    return this.userRepository.save(newUser);
  }

  async remove(id: number) {
    if (!id) throw new BadRequestException('User Id is needed');
    const user = await this.findById(id);
    return this.userRepository.remove(user);
  }
}
