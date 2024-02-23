import { Injectable, BadRequestException } from '@nestjs/common';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';

const scryptPromise = promisify(scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async singup(email: string, password: string) {
        const existingUsers = await this.userService.find(email);
        if (existingUsers.length) {
            throw new BadRequestException('This email is already in use');
        }

        const hashedPassword = (await scryptPromise(password, process.env.SECRET, 24)) as Buffer;
        return this.userService.createUser(email, hashedPassword.toString());
    }

    login() {}
}
