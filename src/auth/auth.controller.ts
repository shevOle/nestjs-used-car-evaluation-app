import { Controller, Post, Body, InternalServerErrorException, HttpException, Response } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    async signupUser(
        @Body() body: CreateUserDto,
        @Response() res: IResponse,    
    ) {
        try {
            const user = await this.authService.singup(body.email, body.password);
            return res.sendStatus(201);
        } catch (err) {
            if (err instanceof HttpException) throw err;
            throw new InternalServerErrorException('Something went wrong');
        }
    }

    @Post('/login')
    async loginUser(
        @Body() body: LoginUserDto,
        @Response() res: IResponse,    
    ) {
        const user = await this.authService.login(body.email, body.password);
        return res.sendStatus(200);
    }
}
