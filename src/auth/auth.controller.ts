import {
  Controller,
  Get,
  Post,
  Body,
  Response,
  HttpException,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as IResponse } from 'express';
import { AuthService } from './auth.service';
import { CreateUserRequestDto } from './dtos/create-user.request.dto';
import { LoginUserRequestDto } from './dtos/login-user.request.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../db/entities/user.entity';
import { AuthGuard } from '../common/guards/auth.guard';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { PublicUserDto } from '../users/dtos/public-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/whoami')
  @Serialize(PublicUserDto)
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async signupUser(
    @Body() body: CreateUserRequestDto,
    @Response() res: IResponse,
  ) {
    try {
      const token = await this.authService.signup(body);
      res.cookie('token', token);
      return res.sendStatus(201);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  @Post('/login')
  async loginUser(
    @Body() body: LoginUserRequestDto,
    @Response() res: IResponse,
  ) {
    const token = await this.authService.login(body.email, body.password);
    res.cookie('token', token);
    return res.sendStatus(200);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logOut(@Response() res: IResponse) {
    res.clearCookie('token');
    return res.sendStatus(200);
  }
}
