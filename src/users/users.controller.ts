import { Controller, Get, Patch, Body, Delete, Query, Param, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PublicUserDto } from './dtos/public-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Serialize(PublicUserDto)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    findUsers(@Query('email') email: string) {
        if (email) return this.userService.findByEmail(email);
        return this.userService.findAll();
    }

    @Get('/:id')
    findUserById(@Param('id') id: string) {
        if (!parseInt(id) && id !== '0') throw new BadRequestException('Id must be a number');
        return this.userService.findById(parseInt(id));
    }

    @Patch('/:id')
    updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto,
    ) {
        if (!parseInt(id) && id !== '0') throw new BadRequestException('Id must be a number');
        return this.userService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        if (!parseInt(id) && id !== '0') throw new BadRequestException('Id must be a number');
        return this.userService.remove(parseInt(id));
    }
}
