import { Injectable, BadRequestException } from '@nestjs/common';
import { scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';

const scryptPromise = promisify(scrypt);

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) {}

    private async hashPassword(password: string): Promise<string> {
        const hashedPassword = (await scryptPromise(password, process.env.SECRET, 24)) as Buffer;
        return hashedPassword.toString('hex');
    }

    async singup(email: string, password: string) {
        const existingUser = await this.userService.findbyEmail(email);
        if (existingUser) {
            throw new BadRequestException('This email is already in use');
        }

        const hashedPassword = await this.hashPassword(password);
        return this.userService.createUser(email, hashedPassword);
    }

    async login(email: string, password: string) {
        const user = await this.userService.findbyEmail(email);

        if (!user) throw new BadRequestException('Username or password is incorrect');

        const hashedPassword = await this.hashPassword(password);
        const isPasswordCorrect = hashedPassword === user.password;
        if (!isPasswordCorrect) throw new BadRequestException('Username or password is incorrect');

        return user;
    }
}
