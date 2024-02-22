import { Injectable, BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async singup(email: string, password: string) {
        const existingUsers = await this.userService.find(email);
        if (existingUsers.length) {
            throw new BadRequestException('This email is already in use');
        }

        const hashedPassword = createHash('md5').update(password).digest('hex')
        return this.userService.createUser(email, hashedPassword);
    }

    login() {}
}
