import { Controller, Get, Post, Body, InternalServerErrorException, HttpException, Response, Session } from '@nestjs/common';
import { Response as IResponse } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { PublicUserDto } from '../users/dtos/public-user.dto';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Serialize(PublicUserDto)
    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async signupUser(
        @Body() body: CreateUserDto,
        @Response() res: IResponse,   
        @Session() session: any, 
    ) {
        try {
            const user = await this.authService.singup(body.email, body.password);
            session.userId = user.id;
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
        @Session() session: any,
    ) {
        const user = await this.authService.login(body.email, body.password);
        session.userId = user.id;
        return res.sendStatus(200);
    }

    @Post('/logout')
    logOut(@Session() session: any, @Response() res: IResponse, ) {
        session.userId = null;
        return res.sendStatus(200);
    }
}
