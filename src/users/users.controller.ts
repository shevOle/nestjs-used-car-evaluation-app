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
import { Response as IRespone } from 'express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { PublicUserDto } from './dtos/public-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Serialize(PublicUserDto)
@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get()
    findUsers(@Query('email') email?: string) {
        if (email) return this.userService.findByEmail(email);
        return this.userService.findAll();
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
        @Body() body: Partial<UpdateUserDto>,
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
    async removeUser(@Param('id') id: string, @Response() res: IRespone,) {
        const parsedId = parseInt(id);
        if (!parsedId || parsedId < 1) {
            throw new BadRequestException('Id must be a positive number');
        }
        await this.userService.remove(parsedId);

        return res.sendStatus(204);
    }
}
