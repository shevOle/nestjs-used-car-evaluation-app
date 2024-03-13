import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  Response,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as IRespone } from 'express';
import { UsersService } from './users.service';
import { UpdateUserRequestDto } from './dtos/update-user.request.dto';
import { PublicUserDto } from './dtos/public-user.dto';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { AuthGuard } from '../common/guards/auth.guard';

@ApiTags('Users')
@UseGuards(AuthGuard)
@Serialize(PublicUserDto)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  findUsers(@Query('email') email?: string) {
    if (email === undefined) return this.userService.findAll();
    return this.userService.findByEmail(email);
  }

  @Get('/:id')
  findUserById(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (!parsedId || parsedId < 1) {
      throw new BadRequestException('Id must be a positive number');
    }
    return this.userService.findById(parsedId);
  }

  @Patch('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: Partial<UpdateUserRequestDto>,
    @Response() res: IRespone,
  ) {
    const parsedId = parseInt(id);
    if (!parsedId || parsedId < 1) {
      throw new BadRequestException('Id must be a positive number');
    }
    await this.userService.update(parsedId, body);

    return res.sendStatus(200);
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string, @Response() res: IRespone) {
    const parsedId = parseInt(id);
    if (!parsedId || parsedId < 1) {
      throw new BadRequestException('Id must be a positive number');
    }
    await this.userService.remove(parsedId);

    return res.sendStatus(204);
  }
}
