import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from '../users/user.entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createUser(user: CreateUserDto) {
        const existingUser = await this.userRepository.findOne({ where: { email: user.email } });
        if (existingUser) throw new BadRequestException('User with this email already exists');

        return this.userRepository.insert(user);
    }
}
