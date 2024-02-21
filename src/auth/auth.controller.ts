import { Controller, Post, Body, InternalServerErrorException, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        try {
            await this.authService.createUser(body);
            return { status: 'ok' };
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}
