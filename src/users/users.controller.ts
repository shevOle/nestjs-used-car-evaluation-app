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
 } from '@nestjs/common';
import { Response as IRespone } from 'express';
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
    async updateUser(
        @Param('id') id: string,
        @Body() body: UpdateUserDto,
        @Response() res: IRespone,
    ) {
        if (!parseInt(id) && id !== '0') throw new BadRequestException('Id must be a number');
        await this.userService.update(parseInt(id), body);
        
        return res.sendStatus(200);
    }

    @Delete('/:id')
    async removeUser(@Param('id') id: string, @Response() res: IRespone,) {
        if (!parseInt(id) && id !== '0') throw new BadRequestException('Id must be a number');
        await this.userService.remove(parseInt(id));

        return res.sendStatus(204);
    }
}
