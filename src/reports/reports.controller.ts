import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response as IResponse } from 'express';
import { ReportsService } from './reports.service';
import { CreateReportRequestDto } from './dtos/create-report.request.dto';
import { CheckReportRquestDto } from './dtos/check-report.request.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get('/own')
  getMyReports(@CurrentUser() user: User) {
    return this.reportService.findByUserId(user.id);
  }

  @Get('/:id')
  getOne(@Param('id') id: number) {
    return this.reportService.findById(id);
  }

  @Post()
  async createReport(
    @CurrentUser() currentUser: User,
    @Body() body: CreateReportRequestDto,
    @Res() res: IResponse,
  ) {
    await this.reportService.create(currentUser, body);
    return res.sendStatus(201);
  }

  @Patch('/:id')
  async checkReport(
    @CurrentUser() user: User,
    @Param('id') id: number,
    @Body() body: CheckReportRquestDto,
    @Res() res: IResponse,
  ) {
    await this.reportService.checkReport(id, user, body.approved);
    return res.sendStatus(200);
  }
}
