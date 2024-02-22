import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async singup(email: string, password: string) {
        const existingUsers = await this.userService.find(email);
        if (existingUsers.length) {
            throw new BadRequestException('This email is already in use');
        }

        // add password hashing
        const hashedPassword = password;

        return this.userService.createUser(email, hashedPassword);
    }

    login() {}
}
