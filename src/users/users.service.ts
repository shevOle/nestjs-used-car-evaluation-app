import { Injectable, NotFoundException, Catch } from '@nestjs/common';
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

    async findByEmail(email: string): Promise<User[]> {
        const user = await this.userRepository.find({ where: { email } });
        if (!user.length) throw new NotFoundException('User not found');
        return user;
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find({});
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
