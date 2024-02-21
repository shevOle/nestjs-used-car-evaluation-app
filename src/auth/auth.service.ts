import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async createUser(email: string, password: string) {
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) throw new BadRequestException('User with this email already exists');

        const user = this.userRepository.create({ email, password });
        return this.userRepository.save(user);
    }
}
