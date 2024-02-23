import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    findbyEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async createUser(email: string, password: string) {
        const existingUser = await this.findbyEmail(email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const user = this.userRepository.create({ email, password });
        return this.userRepository.save(user);
    }

    async update(id: number, update: Partial<User>) {
        const originalUser = await this.findById(id);
        const newUser = this.userRepository.create({ ...originalUser, ...update });

        return this.userRepository.save(newUser);
    }

    async remove(id: number) {
        const user = await this.findById(id);
        return this.userRepository.remove(user);
    }
}
