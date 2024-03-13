import {
  Controller,
  Get,
  Post,
  Body,
  Response,
  Session,
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
    @Body() body: LoginUserRequestDto,
    @Response() res: IResponse,
    @Session() session: any,
  ) {
    const user = await this.authService.login(body.email, body.password);
    session.userId = user.id;
    return res.sendStatus(200);
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  logOut(@Session() session: any, @Response() res: IResponse) {
    session.userId = null;
    return res.sendStatus(200);
  }
}
