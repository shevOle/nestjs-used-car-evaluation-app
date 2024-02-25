import { Injectable, BadRequestException } from '@nestjs/common';
import { hashPassword } from './helpers/hashPassword.helper';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    async singup(email: string, password: string) {
        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('This email is already in use');
        }

        const hashedPassword = await hashPassword(password);
        return this.userService.createUser(email, hashedPassword);
    }

    async login(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if (!user) throw new BadRequestException('Username or password is incorrect');

        const hashedPassword = await hashPassword(password);
        const isPasswordCorrect = hashedPassword === user.password;
        if (!isPasswordCorrect) throw new BadRequestException('Username or password is incorrect');

        return user;
    }
}
